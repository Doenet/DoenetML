//! A version of `Core` based on `DirectedGraph`

use crate::{
    components::{prelude::ComponentIdx, Component},
    dast::{flat_dast::FlatRoot, ref_expand::Expander, DastRoot},
    graph::directed_graph::DirectedGraph,
    state::PropPointer,
};

use super::{
    component_builder::ComponentBuilder,
    graph_node::{DependencyGraph, GraphNode, StructureGraph},
    props::{cache::PropCache, Prop, StatePropStore},
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
    pub strings: Vec<String>,
    /// A counter for the number of virtual nodes created. Every virtual node needs to be unique (so that
    /// it can be referenced), but we don't store any information about virtual nodes themselves.
    virtual_node_count: usize,
    /// Information about a prop used to resolve dependencies in a `DataQuery`.
    pub props: Vec<Prop>,
    // XXX: fill these in
    pub states: StatePropStore,
    pub queries: Vec<()>,
    pub processing_state: CoreProcessingState,
    /// Cache of prop values. The only way core should ever access prop values is through the cache.
    pub prop_cache: PropCache,
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
            strings: Vec::new(),
            props: Vec::new(),
            states: StatePropStore::new(),
            queries: vec![()],
            virtual_node_count: 0,
            processing_state: CoreProcessingState {
                stale_renderers,
                freshen_stack: Vec::new(),
                mark_stale_stack: Vec::new(),
            },
            prop_cache: PropCache::new(),
            for_render_query_node: GraphNode::Query(0),
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

    // To prevent unnecessary reallocations of temporary vectors, like stacks,
    // we store them on the DoenetMLCore struct so that they will stay allocated.
    pub freshen_stack: Vec<PropPointer>,
    pub mark_stale_stack: Vec<PropPointer>,
    // pub update_stack: Vec<PropUpdateRequest>,
}

//#[cfg(test)]
//#[path = "graph_based_core.test.rs"]
//mod test;
