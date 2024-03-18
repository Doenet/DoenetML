//! # DocumentModel
//!
//! This module contains information about the structure of the document as well as the state of the document.
//! It can be queried for information about the document and its components.

use std::cell::{Cell, Ref, RefCell};

use crate::{
    component_builder::ComponentBuilder,
    components::ComponentNode,
    graph_node::{DependencyGraph, GraphNode},
    props::{
        cache::{PropCache, PropStatus, PropWithMeta},
        DataQuery, PropDefinition, StateCache,
    },
};

use super::super::document_structure::DocumentStructure;

#[derive(Debug)]
pub struct DocumentModel {
    /// Information about the structure of the document. This includes components, props, and children.
    pub document_structure: RefCell<DocumentStructure>,
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
            virtual_node_count: Cell::new(0),
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
            let required_data = self
                .get_data_query_nodes_for_prop(prop_node)
                .into_iter()
                .map(|query_node| self._execute_data_query_with_resolved_deps(query_node))
                .collect::<Vec<_>>();

            let prop = &self.get_prop_definition(prop_node.prop_idx());
            prop.updater.calculate(required_data)
        })
    }

    /// Get the value of a prop for rendering. If the prop is stale or not resolved,
    /// this function will resolve the prop, calculate all its dependencies, and then
    /// return the result of `PropUpdater::calculate` applied to those dependencies.
    /// Do not track that the prop has been viewed for rendering so that its change state is unaltered.
    pub fn get_prop_untracked(&self, prop_node: GraphNode, origin: GraphNode) -> PropWithMeta {
        self.resolve_prop(prop_node);

        self.prop_cache.get_prop_untracked(prop_node, origin, || {
            let required_data = self
                .get_data_query_nodes_for_prop(prop_node)
                .into_iter()
                .map(|query_node| self._execute_data_query_with_resolved_deps(query_node))
                .collect::<Vec<_>>();

            let prop_definition = self.get_prop_definition(prop_node);
            prop_definition.updater.calculate(required_data)
        })
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

    /// Get the requested component
    pub fn get_component_type<T: Into<GraphNode>>(&self, pointer: T) -> String {
        let document_structure = self.document_structure.borrow();
        document_structure
            .get_component(pointer)
            .get_component_type()
            .to_string()
    }
}

impl Default for DocumentModel {
    fn default() -> Self {
        Self::new()
    }
}
