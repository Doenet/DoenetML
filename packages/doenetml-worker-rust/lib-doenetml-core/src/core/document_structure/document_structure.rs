//! # DocumentStructure
//!
//! This module holds information about the structure of the document: the components, props,
//! and the (structural) relations to each other.

use typed_index_collections::TiVec;

use crate::{
    component_builder::ComponentBuilder,
    components::{
        types::{ComponentIdx, PropDefinitionIdx, PropPointer},
        Component, ComponentAttributes, ComponentCommon,
    },
    graph_node::{GraphNode, StructureGraph},
    props::{PropDefinition, PropProfile, StringCache},
};

/// Stores information about the _structure_ of a document. This includes components, props, and children.
/// It does not include any information about the computational dependencies of the document. E.g., which props
/// depend on which other props.
#[derive(Debug)]
pub struct DocumentStructure {
    /// A graph that stores the structure of the document. This graph keeps
    /// track of children, attributes, props, and state.
    pub structure_graph: StructureGraph,
    /// The reified components. These can be queried for information about their attributes/props/state
    /// as well as asked to calculate/recalculate props.
    pub components: TiVec<ComponentIdx, Component>,
    /// A list of all strings in the document. Strings are stored here once and referenced when they appear as children.
    pub strings: StringCache,
    /// A counter for the number of virtual nodes created. Every virtual node needs to be unique (so that
    /// it can be referenced), but we don't store any information about virtual nodes themselves.
    pub virtual_node_count: usize,
    /// Information about a prop used to resolve dependencies in a `DataQuery`.
    pub prop_definitions: TiVec<PropDefinitionIdx, PropDefinition>,
}

impl DocumentStructure {
    /// Create a new `DocumentStructure` with default values.
    pub fn new() -> Self {
        Self {
            structure_graph: StructureGraph::new(),
            components: TiVec::new(),
            strings: StringCache::new(),
            virtual_node_count: 0,
            prop_definitions: TiVec::new(),
        }
    }

    /// Initialize Self based on the values from a `ComponentBuilder`
    pub fn init_from_builder(&mut self, builder: ComponentBuilder) {
        self.structure_graph = builder.structure_graph;
        self.components = builder.components;
        self.strings = builder.strings;
        self.virtual_node_count = builder.virtual_node_count;
        self.prop_definitions = builder.props;
    }

    /// Find the "origin" of a `GraphNode::Virtual` corresponding to an attribute. That is, if an attribute
    /// is extending another, walk down the tree until the attribute with content children is found.
    pub fn attribute_node_origin(&self, attribute_node: GraphNode) -> GraphNode {
        assert!(
            matches!(attribute_node, GraphNode::Virtual(_)),
            "Expected a virtual node, not {:?}",
            attribute_node
        );
        let children = self.structure_graph.get_children(attribute_node);
        // A unique virtual child means we are "extending" another attribute.
        if children.len() == 1 && matches!(children[0], GraphNode::Virtual(_)) {
            self.attribute_node_origin(children[0])
        } else {
            attribute_node
        }
    }

    /// Gets the "leaf node" for a prop. I.e., the node furthest down the tree.
    /// In the case of a prop extending another prop, the state is stored on the "bottom  most" prop.
    /// This function allows traversal to the bottom-most leaf.
    pub fn get_prop_leaf(&self, prop_node: GraphNode) -> GraphNode {
        assert!(
            matches!(prop_node, GraphNode::Prop(_)),
            "Expected a prop node, not {:?}",
            prop_node
        );

        let leaf_node = self.structure_graph.get_leaf(prop_node);

        leaf_node.expect("Every prop should have a leaf node")
    }

    /// Get the `GraphNode` corresponding to the attribute `attr_name` for the specified component.
    pub fn get_attr_node(&self, component_idx: ComponentIdx, attr_name: &str) -> Option<GraphNode> {
        self.components[component_idx]
            .get_attribute_names()
            .iter()
            // This is an internal function call. Case-sensitive comparison.
            .position(|&n| n == attr_name)
            .map(|local_attr_idx| {
                let attr_node =
                    self.structure_graph.get_component_attributes(component_idx)[local_attr_idx];
                // We may be extending another attribute. If so, find the "origin" node (i.e., the one with relevant children).
                self.attribute_node_origin(attr_node)
            })
    }

    /// Get a `PropDefinition` corresponding to `pointer`. The type of `pointer` can be `GraphNode`
    /// or `PropDefinitionIdx`.
    pub fn get_prop_definition<T: Into<GraphNode>>(&self, pointer: T) -> &PropDefinition {
        let prop_idx: PropDefinitionIdx = pointer.into().into();
        &self.prop_definitions[prop_idx]
    }

    /// Returns the _true_ parent of a component coming from the structure of the DAST.
    ///
    /// Use of the `extends` attribute can cause a component to have a non-unique structural parent,
    /// but the XML-like DAST has an unambiguous parent for every component (except root component).
    pub fn get_true_component_parent(&self, component_idx: ComponentIdx) -> Option<ComponentIdx> {
        self.components[component_idx].get_parent()
    }

    /// Get the requested component
    pub fn get_component<T: Into<GraphNode>>(&self, pointer: T) -> &Component {
        let component_idx: ComponentIdx = pointer.into().into();
        &self.components[component_idx]
    }

    /// Returns a vector of all the _content_ children of a component. That is,
    /// any virtual nodes that are listed in the children are expanded down to their content.
    pub fn get_component_content_children<T: Into<GraphNode>>(&self, pointer: T) -> Vec<GraphNode> {
        let component_idx: ComponentIdx = pointer.into().into();
        let children_virtual_node = self
            .structure_graph
            .get_component_children_virtual_node(component_idx);

        // create vector of content children so that we don't borrow core in loop
        // and can make a mutable borrow of core to create a virtual node
        let content_children = self
            .structure_graph
            .get_content_children(children_virtual_node)
            .collect::<Vec<_>>();
        content_children
    }

    /// Get the first prop that matches a profile in `profiles` for a given component.
    pub fn get_component_prop_by_profile(
        &self,
        component_idx: ComponentIdx,
        profiles: &[PropProfile],
    ) -> Option<PropPointer> {
        self.components[component_idx]
            .get_prop_by_profile(profiles)
            .map(|local_prop_idx| PropPointer {
                component_idx,
                local_prop_idx,
            })
    }
}

impl Default for DocumentStructure {
    fn default() -> Self {
        Self::new()
    }
}
