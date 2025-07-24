//! # DocumentModel
//!
//! This module contains information about the structure of the document as well as the state of the document.
//! It can be queried for information about the document and its components.

use std::cell::{Cell, Ref, RefCell};

use crate::{
    component_builder::ComponentBuilder,
    components::{
        Component, ComponentNode, ComponentProps,
        types::{ComponentIdx, LocalPropIdx, PropPointer},
    },
    dast::ElementRefAnnotation,
    graph_node::{DependencyGraph, GraphNode},
    props::{
        DataQuery, DataQueryResults, PropDefinition, PropProfile, RenderContext, StateCache,
        UpdaterObject,
        cache::{PropCache, PropStatus, PropWithMeta},
    },
};

use super::super::document_structure::DocumentStructure;

#[derive(Debug)]
pub struct DocumentModel {
    /// Information about the structure of the document. This includes components, props, and children.
    pub(super) document_structure: RefCell<DocumentStructure>,
    /// A graph that stores the active dependencies between nodes. The nodes
    /// of this graph are the same as the nodes of `structure_graph`, but edges
    /// are only added to this graph if if one node must be updated when another changes.
    pub(super) dependency_graph: RefCell<DependencyGraph>,
    /// States that are stored for the document. States are the roots/leaves of when computing the value
    /// of props.
    pub(super) states: StateCache,
    /// DataQueries that have been made by props.
    pub(super) queries: RefCell<Vec<DataQuery>>,
    /// Cache of prop values. The only way core should ever access prop values is through the cache.
    pub(super) prop_cache: PropCache,
    /// A counter for the number of virtual nodes created. Every virtual node needs to be unique (so that
    /// it can be referenced), but we don't store any information about virtual nodes themselves.
    // XXX: Revisit if we still need this.
    #[allow(unused)]
    pub(super) virtual_node_count: Cell<usize>,
}

impl DocumentModel {
    /// Create a new `DocumentModel` with default values.
    pub fn new() -> Self {
        Self {
            document_structure: RefCell::new(DocumentStructure::new()),
            dependency_graph: RefCell::new(DependencyGraph::new()),
            states: StateCache::new(),
            queries: RefCell::new(Vec::new()),
            prop_cache: PropCache::new(),
            // Start with a count of 1, as the virtual node with index 0
            // will be used to represent null,
            // i.e., the lack of a node in that spot in the dependency graph.
            virtual_node_count: Cell::new(1),
        }
    }

    /// Create a new `DocumentModel` with default values and
    /// the `queries` vec initialized to have a `DataQuery::Null`
    /// as its first item.
    pub fn new_with_root_data_query() -> Self {
        let document_model = Self::new();
        document_model.queries.borrow_mut().push(DataQuery::Null);
        document_model
    }

    /// Initialize Self based on the values from a `ComponentBuilder`
    pub fn init_from_builder(&mut self, builder: ComponentBuilder) {
        self.document_structure
            .borrow_mut()
            .init_from_builder(builder);
    }

    pub fn get_dependency_graph(&self) -> Ref<DependencyGraph> {
        self.dependency_graph.borrow()
    }

    /// Get the value of a prop. If the prop is stale or not resolved,
    /// this function will resolve the prop, calculate all its dependencies, and then
    /// return the result of `PropUpdater::calculate` applied to those dependencies.
    /// Track that the prop has been viewed for rendering so that a second call will report it being unchanged.
    pub fn get_prop(&self, prop_node: GraphNode, origin: GraphNode) -> PropWithMeta {
        self.resolve_prop(prop_node);

        self.prop_cache.get_prop(prop_node, origin, || {
            let required_data = DataQueryResults::from_vec(
                self.get_data_query_nodes_for_prop(prop_node)
                    .into_iter()
                    .map(|query_node| self._execute_data_query_with_resolved_deps(query_node))
                    .collect(),
            );

            let prop = &self.get_prop_definition(prop_node.prop_idx());
            prop.updater.calculate_untyped(required_data)
        })
    }

    /// Get the value of a prop for rendering. If the prop is stale or not resolved,
    /// this function will resolve the prop, calculate all its dependencies, and then
    /// return the result of `PropUpdater::calculate` applied to those dependencies.
    /// Do not track that the prop has been viewed for rendering so that its change state is unaltered.
    pub fn get_prop_untracked(&self, prop_node: GraphNode, origin: GraphNode) -> PropWithMeta {
        self.resolve_prop(prop_node);

        self.prop_cache.get_prop_untracked(prop_node, origin, || {
            let required_data = DataQueryResults::from_vec(
                self.get_data_query_nodes_for_prop(prop_node)
                    .into_iter()
                    .map(|query_node| self._execute_data_query_with_resolved_deps(query_node))
                    .collect(),
            );

            let prop_definition = self.get_prop_definition(prop_node);
            prop_definition.updater.calculate_untyped(required_data)
        })
    }

    /// Get the value of a prop without checking its status. This function assumes the value
    /// is already computed and cached. If the value is not cached, this function will panic.
    /// You usually want `get_prop` or `get_prop_untracked` instead of this function.
    ///
    /// Unlike `get_prop_untracked`, this function will update the prop's change state, so calling
    /// this function twice in a row on the same prop will result in its change status being "unchanged".
    ///
    /// **For internal use only**
    pub fn _get_prop_unchecked(&self, prop_node: GraphNode, origin: GraphNode) -> PropWithMeta {
        self.prop_cache.get_prop_unchecked(prop_node, origin)
    }

    /// Get the status of a prop. This function will not resolve the prop or calculate its dependencies.
    pub fn get_prop_status(&self, prop_node: GraphNode) -> PropStatus {
        self.prop_cache.get_prop_status(prop_node)
    }

    /// Get a `PropDefinition` corresponding to `pointer`. The type of `pointer` can be `GraphNode`
    /// or `PropDefinitionIdx`.
    pub fn get_prop_definition<T: Into<GraphNode>>(&self, pointer: T) -> PropDefinition {
        let document_structure = self.document_structure.borrow();
        (*document_structure.get_prop_definition(pointer)).clone()
    }

    /// Get the prop `UpdaterObject` corresponding to `pointer`.
    /// The type of `pointer` can be `GraphNode` or `PropDefinitionIdx`.
    pub fn get_prop_updater<T: Into<GraphNode>>(&self, pointer: T) -> UpdaterObject {
        let document_structure = self.document_structure.borrow();
        document_structure
            .get_prop_definition(pointer)
            .updater
            .clone()
    }

    /// Get the requested component type
    pub fn get_component_type<T: Into<GraphNode>>(&self, pointer: T) -> String {
        let document_structure = self.document_structure.borrow();
        document_structure
            .get_component(pointer)
            .get_component_type()
            .to_string()
    }

    /// An iterator that iterates over the indices of every component.
    pub fn get_component_indices(&self) -> impl Iterator<Item = ComponentIdx> {
        self.document_structure.borrow().get_component_indices()
    }

    /// Get prop pointers to all `for_render` props of a component.
    pub fn get_for_render_prop_pointers(
        &self,
        component_idx: ComponentIdx,
    ) -> impl Iterator<Item = PropPointer> {
        let local_prop_indices = {
            let document_structure = self.document_structure.borrow();

            // Determine whether or not component is in a graph (i.e., has a graph ancestor).
            // If so, we'll look for props that are rendered `in_graph` rather than `in_text`.
            let in_graph = document_structure
                .get_true_component_ancestors(component_idx)
                .any(|ancestor_idx| {
                    document_structure
                        .get_component(ancestor_idx)
                        .get_component_type()
                        == "graph"
                });

            let render_context = match in_graph {
                true => RenderContext::InGraph,
                false => RenderContext::InText,
            };

            let iterator = document_structure
                .get_component(component_idx)
                .get_for_render_local_prop_indices(render_context);
            // Note: collect into a vector so that stop borrowing from document_structure.components
            iterator.collect::<Vec<_>>()
        };
        local_prop_indices
            .into_iter()
            .map(move |local_prop_idx| PropPointer {
                component_idx,
                local_prop_idx,
            })
    }

    /// Convert a `PropPointer` into a `GraphNode::Prop`
    pub fn prop_pointer_to_prop_node(&self, prop_pointer: PropPointer) -> GraphNode {
        let document_structure = self.document_structure.borrow();
        prop_pointer.into_prop_node(&document_structure)
    }

    /// Get the name of a prop
    pub fn get_prop_name(&self, prop_pointer: PropPointer) -> &'static str {
        let document_structure = self.document_structure.borrow();
        let prop_node = prop_pointer.into_prop_node(&document_structure);
        let prop_name = document_structure.get_prop_definition(prop_node).meta.name;
        prop_name
    }

    /// Get a `PropPointer` for the prop.
    pub fn get_prop_pointer(&self, prop_node: GraphNode) -> PropPointer {
        let document_structure = self.document_structure.borrow();
        document_structure
            .get_prop_definition(prop_node)
            .meta
            .prop_pointer
    }

    /// Get the string associated with a `GraphNode::String`
    pub fn get_string(&self, string_node: GraphNode, origin: GraphNode) -> PropWithMeta {
        let document_structure = self.document_structure.borrow();
        document_structure.get_string(string_node, origin)
    }

    /// Get the string value associated with a `GraphNode::String`
    pub fn get_string_value(&self, string_node: GraphNode) -> String {
        let document_structure = self.document_structure.borrow();
        document_structure.get_string_value(string_node)
    }

    /// A vector of the possible profiles this component provides
    /// along with the index of the prop that you should refer to
    /// if you want data satisfying that profile.
    pub fn get_provided_profiles(
        &self,
        component_idx: ComponentIdx,
    ) -> Vec<(PropProfile, LocalPropIdx)> {
        let document_structure = self.document_structure.borrow();
        document_structure
            .get_component(component_idx)
            .provided_profiles()
    }

    /// Get a clone of the component at the given index. Since a clone is returned, the
    /// caller can take ownership of the parts of the returned component.
    pub fn get_component(&self, component_idx: ComponentIdx) -> Component {
        self.document_structure
            .borrow()
            .get_component(component_idx)
            .clone()
    }

    /// Get the first prop that matches a profile in `profiles` for a given component.
    pub fn get_component_prop_by_profile<T: Into<ComponentIdx>>(
        &self,
        component_idx: T,
        profiles: &[PropProfile],
    ) -> Option<PropPointer> {
        let component_idx: ComponentIdx = component_idx.into();
        let document_structure = self.document_structure.borrow();
        document_structure.get_component_prop_by_profile(component_idx, profiles)
    }

    /// Get the children of a component
    pub fn get_component_content_children<T: Into<ComponentIdx>>(
        &self,
        component_idx: T,
    ) -> Vec<GraphNode> {
        let component_idx: ComponentIdx = component_idx.into();
        let document_structure = self.document_structure.borrow();
        document_structure.get_component_content_children(component_idx)
    }

    /// Get the children of a component bit include information about whether they are
    /// "original" or whether they came from extending another component.
    pub fn get_component_content_children_annotated<T: Into<ComponentIdx>>(
        &self,
        component_idx: T,
    ) -> Vec<(GraphNode, ElementRefAnnotation)> {
        let component_idx: ComponentIdx = component_idx.into();
        let document_structure = self.document_structure.borrow();
        document_structure.get_component_content_children_annotated(component_idx)
    }

    /// Walk up the ancestor tree of `node` until a `GraphNode::Prop` is found.
    /// If `node` is a `GraphNode::Prop`, `node` is returned.
    pub fn get_nearest_prop_ancestor_of_query(&self, node: GraphNode) -> Option<GraphNode> {
        match node {
            // If we're a component, we're already here
            GraphNode::Prop(_) => Some(node),
            _ => {
                let dependency_graph = self.dependency_graph.borrow();
                let mut parent = Some(node);
                while parent.is_some() {
                    match parent.unwrap() {
                        GraphNode::Prop(_) => return parent,
                        node => {
                            parent = dependency_graph.get_unique_parent(node);
                        }
                    }
                }

                parent
            }
        }
    }
}

impl Default for DocumentModel {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
#[path = "document_model.test.rs"]
mod test;
