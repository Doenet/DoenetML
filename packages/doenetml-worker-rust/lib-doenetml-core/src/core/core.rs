//! A version of `Core` based on `DirectedGraph`

use crate::{
    components::{prelude::ComponentIdx, Component},
    dast::{flat_dast::FlatRoot, ref_expand::Expander, DastRoot},
    graph::directed_graph::DirectedGraph,
    graph_node::GraphNodeLookup,
    props::DataQuery,
};

use super::{
    component_builder::ComponentBuilder,
    graph_node::{DependencyGraph, GraphNode, StructureGraph},
    props::{cache::PropCache, PropDefinition, StateCache, StringCache},
};

/// Core stores all hydrated components, keeps track of caching data, and tracks dependencies.
/// It is also in charge of marking nodes as dirty when they need to be recalculated and calling
/// functions to recalculate in the appropriate order.
#[derive(Debug)]
pub struct Core {
    /// A graph that stores the structure of the document. This graph keeps
    /// track of children, attributes, props, and state.
    pub structure_graph: StructureGraph,
    /// A graph that stores the active dependencies between nodes. The nodes
    /// of this graph are the same as the nodes of `structure_graph`, but edges
    /// are only added to this graph if if one node must be updated when another changes.
    pub dependency_graph: DependencyGraph,
    /// The reified components. These can be queried for information about their attributes/props/state
    /// as well as asked to calculate/recalculate props.
    pub components: Vec<Component>,
    /// A list of all strings in the document. Strings are stored here once and referenced when they appear as children.
    pub strings: StringCache,
    /// A counter for the number of virtual nodes created. Every virtual node needs to be unique (so that
    /// it can be referenced), but we don't store any information about virtual nodes themselves.
    pub virtual_node_count: usize,
    /// Information about a prop used to resolve dependencies in a `DataQuery`.
    pub props: Vec<PropDefinition>,
    // XXX: fill these in
    pub states: StateCache,
    pub queries: Vec<DataQuery>,
    pub processing_state: CoreProcessingState,
    /// Cache of prop values. The only way core should ever access prop values is through the cache.
    pub prop_cache: PropCache,
    /// A map to look up if a component_node is in the render tree,
    /// i.e., if it can be reached from the document root via rendered children.
    /// For nodes in the render tree, we add their props marked for_render to the flat dast output,
    /// and we need to send flat dast updates if those props change.
    pub in_render_tree: GraphNodeLookup<bool>,
    // This graph node is used to figure out if any props have changed between renders.
    // It is a single fixed node and should always be related to the first entry of `self.queries`.
    pub(super) for_render_query_node: GraphNode,
}

impl Default for Core {
    fn default() -> Self {
        Self::new()
    }
}

impl Core {
    pub fn new() -> Self {
        // Initialize with the document element being stale.
        let stale_renderers = Vec::from([0]);

        Core {
            structure_graph: DirectedGraph::new(),
            dependency_graph: DirectedGraph::new(),
            components: Vec::new(),
            strings: StringCache::new(),
            props: Vec::new(),
            states: StateCache::new(),
            queries: vec![DataQuery::Null],
            virtual_node_count: 0,
            processing_state: CoreProcessingState { stale_renderers },
            prop_cache: PropCache::new(),
            in_render_tree: GraphNodeLookup::new(),
            for_render_query_node: GraphNode::Query(0), // the DataQuery::Null added in queries, above
        }
    }

    /// Initialize `structure_graph`, `state_graph`, and other data
    /// from `dast`.
    ///
    /// This function relies upon the fact that `dast.nodes` will be the same length as `self.components`
    /// and exactly mirror it's structure (i.e., `dast.nodes[i].idx == self.components[i].idx`).
    pub fn init_from_dast_root(&mut self, dast_root: &DastRoot) {
        let mut flat_root = FlatRoot::from_dast(dast_root);
        Expander::expand(&mut flat_root);
        flat_root.compactify();
        let normalized_flat_root = flat_root.into_normalized_root();

        let component_builder = ComponentBuilder::from_normalized_root(&normalized_flat_root);
        self.components = component_builder.components;
        self.strings = component_builder.strings;
        self.structure_graph = component_builder.structure_graph;
        self.virtual_node_count = component_builder.virtual_node_count;
        self.props = component_builder.props;
    }
}

#[derive(Debug)]
pub struct CoreProcessingState {
    /// List of the rendered components that have stale `for_renderer` props.
    pub stale_renderers: Vec<ComponentIdx>,
}

//#[cfg(test)]
//#[path = "core.test.rs"]
//mod test;
