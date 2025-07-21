//! Storage and retrieval of string props

use std::borrow;

use crate::core::graph_node::GraphNode;

use super::{
    PropCalcResult, PropValue,
    cache::{PropCache, PropWithMeta},
};

/// Storage for string props that facilitates setting, retrieval, and tracking of changes
#[derive(Debug)]
pub struct StringCache {
    /// State is stored in a `PropCache`. However, the `PropCache` is wrapped
    /// to give a nicer API.
    prop_cache: PropCache,
    /// The number of string items that have been created.
    string_counter: usize,
}

impl StringCache {
    pub fn new() -> Self {
        StringCache {
            prop_cache: PropCache::new(),
            string_counter: 0,
        }
    }

    /// Add a state prop to the store with given `value` and `came_from_default`.
    /// Returns the state prop's index.
    pub fn add_string(&mut self, s: String) -> usize {
        let idx = self.string_counter;
        self.prop_cache
            .set_prop(GraphNode::String(idx), PropCalcResult::Calculated(s.into()));

        // Update the string counter so the next time we add string we start at a new index.
        self.string_counter += 1;

        idx
    }

    /// Get the value of a string prop. `origin` is the `GraphNode::DataQuery` that requested the string prop.
    /// The store tracks and reports if the value has changed since the last time it was queried.
    pub fn get_string<A: borrow::Borrow<GraphNode>, B: borrow::Borrow<GraphNode>>(
        &self,
        string_node: A,
        origin: B,
    ) -> PropWithMeta {
        let string_node = string_node.borrow();
        self.prop_cache.get_prop(string_node, origin, || {
            panic!("Trying to retrieve a string prop that hasn't been set yet, {string_node:?}")
        })
    }

    /// Get the value of a string prop as a string.
    pub fn get_string_value<A: borrow::Borrow<GraphNode>>(
        &self,
        string_node: A,
    ) -> std::string::String {
        let string_node = string_node.borrow();

        // the origin doesn't matter as `qet_prop_unchecked` does not update change tracker
        let fake_origin = GraphNode::Query(0);
        let prop = self
            .prop_cache
            .get_prop_unchecked_untracked(string_node, fake_origin);

        match (prop.value).clone() {
            PropValue::String(s) => (*s).clone(),
            _ => unreachable!("Expecting string prop, found {:?}", prop.value),
        }
    }

    /// Set the value of a string prop.
    /// The store tracks and reports if the value has changed since the last time it was queried.
    pub fn set_string<A: borrow::Borrow<GraphNode>>(&self, string_node: A, s: String) {
        let string_node = string_node.borrow();
        self.prop_cache
            .set_prop(string_node, PropCalcResult::Calculated(s.into()));
    }
}

impl Default for StringCache {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
#[path = "string_cache.test.rs"]
mod test;
