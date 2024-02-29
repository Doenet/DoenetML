//! Updates values when a dependency changes.

use crate::{components::prelude::PropValue, graph::directed_graph::Taggable, state::Freshness};

use super::{graph_based_core::Core, graph_node::GraphNode};

impl Core {
    /// Sets the value of a `GraphNode::State` or `GraphNode::String`.
    fn set_state_or_string_node(&mut self, node: GraphNode, value: PropValue) {
        match node {
            GraphNode::State(state_idx) => {
                let (_, prop_value) = &mut self.states[state_idx];
                *prop_value = value;
            }
            GraphNode::String(string_idx) => {
                // XXX: We need to record whether this is a change for the current value or not.
                // We'll clean that up later.
                let value = match value {
                    PropValue::String(string) => string,
                    _ => {
                        panic!("Can only set a `GraphNode::String` from a `PropValue::String`, not {:?}", value);
                    }
                };
                self.strings[string_idx] = value;
            }
            _ => {
                panic!("This function can only be called on a `GraphNode::State` or `GraphNode::String`, {:?}", node);
            }
        }
        // We don't recompute now. We just record that the node is stale.
        self.freshness.set_tag(node, Freshness::Stale)
    }
}
