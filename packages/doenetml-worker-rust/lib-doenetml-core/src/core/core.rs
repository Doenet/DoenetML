//! A version of `Core` based on `DirectedGraph`

use crate::{
    components::prelude::ComponentIdx,
    dast::{flat_dast::FlatRoot, ref_expand::Expander, DastRoot},
    graph_node::GraphNodeLookup,
};

use super::{
    component_builder::ComponentBuilder, document_model::DocumentModel, graph_node::GraphNode,
};

/// Core stores all hydrated components, keeps track of caching data, and tracks dependencies.
/// It is also in charge of marking nodes as dirty when they need to be recalculated and calling
/// functions to recalculate in the appropriate order.
#[derive(Debug)]
pub struct Core {
    pub document_model: DocumentModel,
    pub processing_state: CoreProcessingState,
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
        let stale_renderers = Vec::from([0.into()]);

        Core {
            document_model: DocumentModel::new_with_root_data_query(),
            processing_state: CoreProcessingState { stale_renderers },
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
        self.document_model.init_from_builder(component_builder);
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
