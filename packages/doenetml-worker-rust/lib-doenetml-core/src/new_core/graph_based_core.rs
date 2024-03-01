//! A version of `Core` based on `DirectedGraph`

use crate::{
    components::{prelude::PropValue, ComponentEnum},
    dast::flat_dast::NormalizedRoot,
    graph::directed_graph::DirectedGraph,
    state::Freshness,
};

use super::{
    component_builder::ComponentBuilder,
    graph_node::{GraphNode, GraphNodeLookup},
    props::PropIdent,
};

/// Core stores all hydrated components, keeps track of caching data, and tracks dependencies.
/// It is also in charge of marking nodes as dirty when they need to be recalculated and calling
/// functions to recalculate in the appropriate order.
pub struct Core {
    /// A graph that stores the structure of the document. This graph keeps
    /// track of children, attributes, props, and state.
    pub structure_graph: DirectedGraph<GraphNode, GraphNodeLookup<usize>>,
    /// A graph that stores the active dependencies between nodes. The nodes
    /// of this graph are the same as the nodes of `structure_graph`, but edges
    /// are only added to this graph if if one node must be updated when another changes.
    pub dependency_graph: DirectedGraph<GraphNode, GraphNodeLookup<usize>>,
    /// The reified components. These can be queried for information about their attributes/props/state
    /// as well as asked to calculate/recalculate props.
    pub components: Vec<ComponentEnum>,
    /// A list of all strings in the document. Strings are stored here once and referenced when they appear as children.
    pub strings: Vec<String>,
    /// A counter for the number of virtual nodes created. Every virtual node needs to be unique (so that
    /// it can be referenced), but we don't store any information about virtual nodes themselves.
    virtual_node_count: usize,
    /// Information about a prop used to resolve dependencies in a `DataQuery`.
    pub props: Vec<PropIdent>,
    pub states: Vec<(PropIdent, PropValue)>,
    // XXX: fill these in
    pub queries: Vec<()>,
    pub freshness: GraphNodeLookup<Freshness>,
}

impl Default for Core {
    fn default() -> Self {
        Self::new()
    }
}

impl Core {
    pub fn new() -> Self {
        Core {
            structure_graph: DirectedGraph::new(),
            dependency_graph: DirectedGraph::new(),
            components: Vec::new(),
            strings: Vec::new(),
            props: Vec::new(),
            states: Vec::new(),
            queries: Vec::new(),
            virtual_node_count: 0,
            freshness: GraphNodeLookup::new(),
        }
    }

    /// Initialize `structure_graph`, `state_graph`, and other data
    /// from `dast`.
    ///
    /// This function relies upon the fact that `dast.nodes` will be the same length as `self.components`
    /// and exactly mirror it's structure (i.e., `dast.nodes[i].idx == self.components[i].idx`).
    pub fn init_from_normalized_root(&mut self, normalized_root: &NormalizedRoot) {
        let component_builder = ComponentBuilder::from_normalized_root(normalized_root);
        self.components = component_builder.components;
        self.strings = component_builder.strings;
        self.structure_graph = component_builder.structure_graph;
        self.virtual_node_count = component_builder.virtual_node_count;
        self.props = component_builder.props;
    }
}

#[cfg(test)]
#[path = "graph_based_core.test.rs"]
mod test;
