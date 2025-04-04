use crate::graph_node::{GraphNode, GraphNodeLookup};

/// The `DocumentRenderer` is responsible for rendering the document tree into a flat DAST and
/// delivering any rendered updates need as props change.
#[derive(Debug)]
pub struct DocumentRenderer {
    /// A map to look up if a component_node is in the render tree,
    /// i.e., if it can be reached from the document root via rendered children.
    /// For nodes in the render tree, we add their props marked for_render to the flat dast output,
    /// and we need to send flat dast updates if those props change.
    pub in_render_tree: GraphNodeLookup<bool>,
    // This graph node is used to figure out if any props have changed between renders.
    // It is a single fixed node and should always be related to the first entry of `self.queries`.
    pub(super) for_render_query_node: GraphNode,
}

impl Default for DocumentRenderer {
    fn default() -> Self {
        Self::new()
    }
}

impl DocumentRenderer {
    pub fn new() -> Self {
        DocumentRenderer {
            in_render_tree: GraphNodeLookup::new(),
            for_render_query_node: GraphNode::Query(0), // the DataQuery::Null added in queries, above
        }
    }
}
