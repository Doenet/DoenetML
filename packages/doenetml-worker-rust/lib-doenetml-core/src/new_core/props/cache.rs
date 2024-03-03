//! Allow for the caching of props (and state props and strings).

use std::{
    borrow,
    cell::{Ref, RefCell},
    rc::Rc,
};

use crate::{
    components::prelude::{GraphNode, PropCalcResult, PropValue},
    graph::directed_graph::Taggable,
    new_core::graph_node::GraphNodeLookup,
    state::PropStatus,
};

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
    /// Cached value of the prop. Will be `None` if the prop hasn't been computed or is stale.
    value: Rc<RefCell<Option<PropValue>>>,
    meta: RefCell<CachedPropMeta>,
}

impl CachedProp {
    pub fn new() -> Self {
        CachedProp {
            value: Rc::new(RefCell::new(None)),
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

    /// Sets the prop as stale and clears the cached value using interior mutability.
    /// **For internal use only.**
    fn _set_stale(&self) {
        *self.value.borrow_mut() = None;
        self.meta.borrow_mut().status = PropStatus::Stale;
    }

    /// Set `came_from_default` using interior mutability.
    /// **For internal use only.**
    fn _set_came_from_default(&self, came_from_default: bool) {
        self.meta.borrow_mut().came_from_default = came_from_default;
    }

    /// Set `status` using interior mutability.
    /// **For internal use only.**
    fn set_status(&self, status: PropStatus) {
        self.meta.borrow_mut().status = status;
    }

    /// Get the value of the prop. If the cached value is not fresh,
    /// the `calculate` function will be called to get the value.
    ///
    /// This function uses interior mutability to cache computed values.
    pub fn get_value<CalculateFn: Fn() -> PropCalcResult<PropValue>>(
        &self,
        calculate: CalculateFn,
    ) -> Ref<PropValue> {
        match self.get_status() {
            PropStatus::Fresh => self.get_cached_value().expect(
                "Prop is marked as Fresh but no value is cached. This state should be unreachable",
            ),
            PropStatus::Stale | PropStatus::Resolved => {
                let result = calculate();
                match result {
                    PropCalcResult::Calculated(value) => {
                        self._set_value(value);
                    }
                    PropCalcResult::FromDefault(value) => {
                        self._set_value(value);
                        self._set_came_from_default(true);
                    }
                    PropCalcResult::NoChange => {
                        self.set_status(PropStatus::Fresh);
                    }
                }
                self.get_cached_value().unwrap()
            }
            PropStatus::Unresolved => {
                panic!("Cannot get value of prop with Unresolved status")
            }
        }
    }

    /// Get the cached value of the prop without any side computations.
    fn get_cached_value(&self) -> Option<Ref<PropValue>> {
        // This code doesn't seem to work with `self.value.borrow().map(...)`. The borrow checker
        // is a mystery.
        match *self.value.borrow() {
            Some(_) => Some(Ref::map(self.value.borrow(), |b| b.as_ref().unwrap())),
            None => None,
        }
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
pub struct PropWithMeta<'a> {
    /// The value of the prop
    pub value: Ref<'a, PropValue>,
    /// `true` if this prop was set by using a default value.
    pub came_from_default: bool,
    /// `true` if this prop has changed since the last time it was queried from
    /// from the same source.
    pub changed: bool,
}

/// A caching store for storage and retrieval of props.
pub struct PropCache {
    store: GraphNodeLookup<CachedProp>,
    change_tracker: GraphNodeLookup<u32>,
}
impl PropCache {
    pub fn new() -> Self {
        PropCache {
            store: GraphNodeLookup::new(),
            change_tracker: GraphNodeLookup::new(),
        }
    }
    
    /// Get the status of a prop.
    pub fn get_prop_status<A: borrow::Borrow<GraphNode>>(&self, prop_node: A) -> PropStatus {
        let prop_node = prop_node.borrow();
        if self.store.get_tag(prop_node).is_none() {
            PropStatus::Unresolved
        } else {
            self.store.get_tag(prop_node).unwrap().get_status()
        }
    }

    /// Set the status of a prop.
    pub fn set_prop_status<A: borrow::Borrow<GraphNode>>(&mut self, prop_node: A, status: PropStatus) {
        let prop_node = prop_node.borrow().clone();
        if self.store.get_tag(&prop_node).is_none() {
            let new_cached_prop = CachedProp::new();
            self.store.set_tag(prop_node, new_cached_prop);
        }
        let cached_prop = self.store.get_tag(&prop_node).unwrap();
        cached_prop.set_status(status);
    }

    /// Get the value of a prop. `origin` is the `GraphNode::DataQuery` that requested the prop.
    /// The cache tracks and reports if the value has changed since the last time it was queried.
    pub fn get_prop<
        CalculateFn: Fn() -> PropCalcResult<PropValue>,
        A: borrow::Borrow<GraphNode>,
        B: borrow::Borrow<GraphNode>,
    >(
        &mut self,
        prop_node: A,
        origin: B,
        calculate: CalculateFn,
    ) -> PropWithMeta {
        let prop_node = prop_node.borrow().clone();
        let origin = origin.borrow().clone();
        let change_counter_on_last_query =
            self.change_tracker.get_tag(&origin).copied().unwrap_or(0);
        if self.store.get_tag(&prop_node).is_none() {
            let new_cached_prop = CachedProp::new();
            self.store.set_tag(prop_node, new_cached_prop);
        }
        let cached_prop = self.store.get_tag(&prop_node).unwrap();
        //       let cached_prop = self.get_or_insert(prop_node);
        let value = cached_prop.get_value(calculate);
        let came_from_default = cached_prop.get_came_from_default();

        // Every time a value is changed, `change_counter` is incremented. We use
        // this to see if the value has changed since the last time it was queried.
        // After checking, we update the change tracker with the new `change_counter`
        // so if it is queried on an unchanged value, it will report `changed == false`.
        let change_counter = cached_prop.get_change_counter();
        let changed = change_counter != change_counter_on_last_query;
        self.change_tracker.set_tag(origin, change_counter);

        PropWithMeta {
            value,
            came_from_default,
            changed,
        }
    }

    /// Get the value of a prop without specifying a DataQuery origin. This will not supply `changed`
    /// information.
    pub fn get_prop_no_origin<
        CalculateFn: Fn() -> PropCalcResult<PropValue>,
        A: borrow::Borrow<GraphNode>,
    >(
        &mut self,
        node: A,
        calculate: CalculateFn,
    ) -> Ref<PropValue> {
        let cached_prop = self.get_or_insert(node.borrow().clone());
        cached_prop.get_value(calculate)
    }

    /// Get the cache entry corresponding to `prop_node` if it exists. Otherwise
    /// insert a new cache entry and return a reference to it.
    fn get_or_insert(&mut self, prop_node: GraphNode) -> &CachedProp {
        if self.store.get_tag(&prop_node).is_none() {
            let new_cached_prop = CachedProp::new();
            self.store.set_tag(prop_node, new_cached_prop);
        }
        self.store.get_tag(&prop_node).unwrap()
    }
}

#[cfg(test)]
#[path = "cache.test.rs"]
mod test;