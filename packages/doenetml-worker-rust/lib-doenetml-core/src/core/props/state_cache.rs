//! Storage and retrieval of state props

use std::{borrow, cell::Cell};

use crate::core::graph_node::GraphNode;

use super::{
    PropCalcResult, PropValue,
    cache::{PropCache, PropWithMeta},
};

/// Storage for state props that facilitates setting, retrieval, and tracking of changes
#[derive(Debug)]
pub struct StateCache {
    /// State is stored in a `PropCache`. However, the `PropCache` is wrapped
    /// to give a nicer API.
    prop_cache: PropCache,
    /// The number of state items that have been created.
    state_counter: Cell<usize>,
}

impl StateCache {
    pub fn new() -> Self {
        StateCache {
            prop_cache: PropCache::new(),
            state_counter: Cell::new(0),
        }
    }

    /// Add a state prop to the store with given `value` and `came_from_default`.
    /// Returns the state prop's index.
    pub fn add_state(&self, value: PropValue, came_from_default: bool) -> usize {
        let idx = self.state_counter.get();
        let value = if came_from_default {
            PropCalcResult::FromDefault(value)
        } else {
            PropCalcResult::Calculated(value)
        };
        self.prop_cache.set_prop(GraphNode::State(idx), value);

        // Update the state counter so the next time we add state we start at a new index.
        self.state_counter.set(idx + 1);

        idx
    }

    /// Get the value of a state prop. `origin` is the `GraphNode::DataQuery` that requested the state prop.
    /// The store tracks and reports if the value has changed since the last time it was queried.
    pub fn get_state<A: borrow::Borrow<GraphNode>, B: borrow::Borrow<GraphNode>>(
        &self,
        state_node: A,
        origin: B,
    ) -> PropWithMeta {
        let state_node = state_node.borrow();
        self.prop_cache.get_prop(state_node, origin, || {
            panic!("Trying to retrieve a state prop that hasn't been set yet, {state_node:?}")
        })
    }

    /// Set the value of a state prop. `origin` is the `GraphNode::DataQuery` that requested the state prop.
    /// The store tracks and reports if the value has changed since the last time it was queried.
    pub fn set_state<A: borrow::Borrow<GraphNode>>(&self, state_node: A, value: PropValue) {
        let state_node = state_node.borrow();
        self.prop_cache
            .set_prop(state_node, PropCalcResult::Calculated(value));
    }
}

impl Default for StateCache {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
#[path = "state_cache.test.rs"]
mod test;
