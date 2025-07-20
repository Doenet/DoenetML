//! Allow for the caching of props (and state props and strings).

use std::{borrow, cell::RefCell};

use crate::{
    components::prelude::{GraphNode, PropCalcResult, PropValue},
    core::graph_node::GraphNodeLookup,
    graph::directed_graph::Taggable,
    graph_node::DoubleNodeLookup,
};

/// The possible values of the status of a prop.
/// - `Fresh`: the prop value has been calculated from given base variable values
/// - `Stale`: a base variable influencing this prop has changed so it must be recalculated
/// - `Unresolved`: the dependencies for this prop have not yet been created
/// - `Resolved`: the dependencies for this prop have been created,
///   but the value has not yet been calculated
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PropStatus {
    /// The value has been computed and doesn't need recomputing.
    Fresh,
    /// The value has been computed, but needs recomputing.
    Stale,
    /// The prop has not been "resolved" yet, meaning it and (possibly) the other props it depends on for computing
    /// its value have not yet been added to the dependency graph.
    Unresolved,
    /// The prop has been "resolved", meaning it and its dependencies have been added to the dependency graph,
    /// but the value has never been computed.
    Resolved,
    /// The prop in the process of being resolved.
    Resolving,
}

/// Metadata stored along with a cached prop.
#[derive(Debug, Clone)]
struct CachedPropMeta {
    /// Status of the prop indicating its initialization state and whether it is stale
    pub status: PropStatus,
    /// True if the value was set using the variable's default value.
    /// Is typically used to lower the precedence of this prop's value
    /// when calculating another prop, as it indicates that the document author
    /// did not explicitly set the value
    pub came_from_default: bool,
    /// A counter that is incremented every time the value is set.
    /// Used to compare with another counter to determine if the variable has been changed
    /// since the other counter was last set.
    pub change_counter: u32,
}

/// Store a prop's and other meta information needed to operate a cache
/// that intelligently recomputes props when their dependencies change.
#[derive(Debug)]
struct CachedProp {
    /// Cached value of the prop. Will be `None` if the prop hasn't been computed.
    value: RefCell<Option<PropValue>>,
    meta: RefCell<CachedPropMeta>,
}

impl CachedProp {
    pub fn new() -> Self {
        CachedProp {
            value: RefCell::new(None),
            meta: RefCell::new(CachedPropMeta {
                status: PropStatus::Unresolved,
                came_from_default: false,
                change_counter: 0,
            }),
        }
    }

    /// Sets the value and marks it as fresh using internal mutability.
    /// **For internal use only.**
    fn _set_value(&self, value: PropValue) {
        *self.value.borrow_mut() = Some(value);
        self.meta.borrow_mut().status = PropStatus::Fresh;
        let change_counter = self.meta.borrow().change_counter;
        // A little bit of safety in case someone wiggles their mouse 4 billion times
        self.meta.borrow_mut().change_counter = change_counter.wrapping_add(1);
    }

    /// Sets the prop as stale using interior mutability.
    /// **For internal use only.**
    fn _set_stale(&self) {
        self.meta.borrow_mut().status = PropStatus::Stale;
    }

    /// Set `came_from_default` using interior mutability.
    /// **For internal use only.**
    fn _set_came_from_default(&self, came_from_default: bool) {
        self.meta.borrow_mut().came_from_default = came_from_default;
    }

    /// Set `status` using interior mutability.
    fn set_status(&self, status: PropStatus) {
        self.meta.borrow_mut().status = status;
    }

    /// Get the value of the prop. If the cached value is not fresh,
    /// the `calculate` function will be called to get the value.
    ///
    /// This function uses interior mutability to cache computed values.
    pub fn get_value<CalculateFn: FnOnce() -> PropCalcResult<PropValue>>(
        &self,
        calculate: CalculateFn,
    ) -> PropValue {
        match self.get_status() {
            PropStatus::Fresh => self.get_cached_value().expect(
                "Prop is marked as Fresh but no value is cached. This state should be unreachable",
            ),
            PropStatus::Stale | PropStatus::Resolved => {
                let result = calculate();
                self.set_value(result);
                self.get_cached_value().unwrap()
            }
            PropStatus::Unresolved => {
                panic!("Cannot get value of prop with Unresolved status")
            }
            PropStatus::Resolving => {
                panic!("Cannot get value of prop with Resolving status")
            }
        }
    }

    /// Sets the value of the prop using interior mutability.
    fn set_value(&self, result: PropCalcResult<PropValue>) {
        match result {
            PropCalcResult::Calculated(value) => {
                self._set_value(value);
                self._set_came_from_default(false);
            }
            PropCalcResult::FromDefault(value) => {
                self._set_value(value);
                self._set_came_from_default(true);
            }
            PropCalcResult::NoChange => {
                if self.get_status() == PropStatus::Resolved {
                    panic!(
                        "Prop is marked as `Resolved` and value is computed as `NoChange`. This is a logic error as cached values only exist on `Fresh` and `Stale` props."
                    )
                }
                self.set_status(PropStatus::Fresh);
            }
        }
    }

    /// Get the cached value of the prop without any side computations.
    fn get_cached_value(&self) -> Option<PropValue> {
        self.value.borrow().clone()
    }

    /// Get the status of the prop.
    pub fn get_status(&self) -> PropStatus {
        self.meta.borrow().status
    }
    /// Get the change counter of the prop.
    pub fn get_change_counter(&self) -> u32 {
        self.meta.borrow().change_counter
    }

    /// Get whether or not the cached value came from a default value.
    pub fn get_came_from_default(&self) -> bool {
        self.meta.borrow().came_from_default
    }
}

/// A prop with metadata about whether it has changed
/// and how it was last set.
#[derive(Debug, Clone, PartialEq)]
pub struct PropWithMeta {
    /// The value of the prop
    pub value: PropValue,
    /// `true` if this prop was set by using a default value.
    pub came_from_default: bool,
    /// `true` if this prop has changed since the last time it was queried from
    /// from the same source.
    pub changed: bool,
    /// The graph node where the value originated
    pub origin: Option<GraphNode>,
}

/// A caching store for storage and retrieval of props.
#[derive(Debug)]
pub struct PropCache {
    /// A map from {prop_node} -> {cached_prop}
    store: RefCell<GraphNodeLookup<CachedProp>>,
    /// A map from {prop_node}x{query_node} -> {change_counter}
    change_tracker: RefCell<DoubleNodeLookup<u32>>,
}
impl PropCache {
    pub fn new() -> Self {
        PropCache {
            store: RefCell::new(GraphNodeLookup::new()),
            change_tracker: RefCell::new(DoubleNodeLookup::new()),
        }
    }

    /// Get the status of a prop.
    pub fn get_prop_status<A: borrow::Borrow<GraphNode>>(&self, prop_node: A) -> PropStatus {
        self.store
            .borrow()
            .get_tag(prop_node.borrow())
            .map_or(PropStatus::Unresolved, |cached_prop| {
                cached_prop.get_status()
            })
    }

    /// Set the status of a prop.
    pub fn set_prop_status<A: borrow::Borrow<GraphNode>>(&self, prop_node: A, status: PropStatus) {
        let prop_node = prop_node.borrow();
        self.ensure_prop_exists(prop_node);
        let store = self.store.borrow();
        let cached_prop = store.get_tag(prop_node).unwrap();
        cached_prop.set_status(status);
    }

    /// Ensures that cached data associated with `prop_node` exists.
    /// If no cached data exists, a new `CachedProp` is created and associated with `prop_node`.
    fn ensure_prop_exists(&self, prop_node: &GraphNode) {
        let store = self.store.borrow();
        if store.get_tag(prop_node).is_none() {
            drop(store); // Drop the borrow so we can borrow mutably
            let mut store = self
                .store
                .try_borrow_mut()
                .expect("Trying to initialize CachedProp while it is already borrowed; This probably means the prop is not yet Resolved. Make sure all props are marked as Resolved before querying.");
            let new_cached_prop = CachedProp::new();
            store.set_tag(*prop_node, new_cached_prop);
        }
    }

    /// Get the value of a prop. `origin` is the `GraphNode::DataQuery` that requested the prop.
    /// The cache tracks and reports if the value has changed since the last time it was queried.
    pub fn get_prop<
        CalculateFn: FnOnce() -> PropCalcResult<PropValue>,
        A: borrow::Borrow<GraphNode>,
        B: borrow::Borrow<GraphNode>,
    >(
        &self,
        prop_node: A,
        origin: B,
        calculate: CalculateFn,
    ) -> PropWithMeta {
        self._get_prop(prop_node, origin, calculate, true)
    }

    /// Get the value of a prop. `origin` is the `GraphNode::DataQuery` that requested the prop.
    /// The cache reports if the value has changed since the last time it was queried
    /// but does _not_ update the change tracker. The change state will be
    /// the same as the last time the prop was queried.
    pub fn get_prop_untracked<
        CalculateFn: FnOnce() -> PropCalcResult<PropValue>,
        A: borrow::Borrow<GraphNode>,
        B: borrow::Borrow<GraphNode>,
    >(
        &self,
        prop_node: A,
        origin: B,
        calculate: CalculateFn,
    ) -> PropWithMeta {
        self._get_prop(prop_node, origin, calculate, false)
    }

    /// Get the cached value of a prop. An error is thrown if the prop is not `Fresh`.
    /// The cache tracks and reports if the value has changed since the last time it was queried.
    ///
    /// `origin` is the `GraphNode::DataQuery` that requested the prop.
    /// The cache tracks and reports if the value has changed since the last time it was queried.
    pub fn get_prop_unchecked<A: borrow::Borrow<GraphNode>, B: borrow::Borrow<GraphNode>>(
        &self,
        prop_node: A,
        origin: B,
    ) -> PropWithMeta {
        self._get_prop(
            prop_node,
            origin,
            || panic!("Call to `get_prop_unchecked` on a prop that isn't `Fresh`"),
            true,
        )
    }

    /// Get the cached value of a prop. An error is thrown if the prop is not `Fresh`.
    /// Retrieving a prop this way does _not_ update the change tracker. The change state will be
    /// the same as the last time the prop was queried.
    ///
    /// `origin` is the `GraphNode::DataQuery` that requested the prop.
    /// The cache tracks and reports if the value has changed since the last time it was queried.
    pub fn get_prop_unchecked_untracked<
        A: borrow::Borrow<GraphNode>,
        B: borrow::Borrow<GraphNode>,
    >(
        &self,
        prop_node: A,
        origin: B,
    ) -> PropWithMeta {
        self._get_prop(
            prop_node,
            origin,
            || panic!("Call to `get_prop_unchecked_untracked` on a prop that isn't `Fresh`"),
            false,
        )
    }

    /// Internal version `get_prop`. Can optionally update the change tracker or not when retrieving the prop.
    fn _get_prop<
        CalculateFn: FnOnce() -> PropCalcResult<PropValue>,
        A: borrow::Borrow<GraphNode>,
        B: borrow::Borrow<GraphNode>,
    >(
        &self,
        prop_node: A,
        origin: B,
        calculate: CalculateFn,
        update_change_tracker: bool,
    ) -> PropWithMeta {
        let prop_node = prop_node.borrow();
        let origin: GraphNode = *origin.borrow();
        let change_tracker_key = (*prop_node, origin);

        let change_counter_on_last_query = {
            // Borrow RefCells for the shortest time possible to avoid panics.
            let change_tracker = self.change_tracker.borrow();
            change_tracker
                .get(&change_tracker_key)
                .copied()
                .unwrap_or(0)
        };

        self.ensure_prop_exists(prop_node);
        let store = self.store.borrow();

        let cached_prop = store.get_tag(prop_node).unwrap();
        let value = cached_prop.get_value(calculate);
        let came_from_default = cached_prop.get_came_from_default();

        // Every time a value is changed, `change_counter` is incremented. We use
        // this to see if the value has changed since the last time it was queried.
        // After checking, we update the change tracker with the new `change_counter`
        // so if it is queried on an unchanged value, it will report `changed == false`.
        let change_counter = cached_prop.get_change_counter();
        let changed = change_counter != change_counter_on_last_query;
        if update_change_tracker {
            // Borrow RefCells for the shortest time possible to avoid panics.
            let mut change_tracker = self.change_tracker.borrow_mut();
            change_tracker.insert(change_tracker_key, change_counter);
        }

        PropWithMeta {
            value,
            came_from_default,
            changed,
            origin: Some(*prop_node),
        }
    }

    /// Set the value of a prop. `origin` is the `GraphNode::DataQuery` that requested the prop.
    /// The cache tracks and reports if the value has changed since the last time it was queried.
    pub fn set_prop<A: borrow::Borrow<GraphNode>>(
        &self,
        prop_node: A,
        result: PropCalcResult<PropValue>,
    ) {
        let prop_node = prop_node.borrow();

        self.ensure_prop_exists(prop_node);
        let store = self.store.borrow();
        let cached_prop = store.get_tag(prop_node).unwrap();
        cached_prop.set_value(result);
    }
}

impl Default for PropCache {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
#[path = "cache.test.rs"]
mod test;
