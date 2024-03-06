//! Storage and retrieval of state props

use std::{borrow, cell::RefCell, collections::HashMap, rc::Rc};

use crate::new_core::graph_node::GraphNode;

use super::{cache::PropWithMeta, PropValue};

/// Metadata stored along with a state prop.
#[derive(Debug, Clone)]
struct StatePropMeta {
    /// True if the value was set using the variable's default value.
    /// Is typically used to lower the precedence of this state prop's value
    /// when calculating another prop, as it indicates that the document author
    /// did not explicitly set the value.
    /// It can be set to true on initialization and will be set to false whenever the value is set.
    pub came_from_default: bool,
    /// A counter that is incremented every time the value is set.
    /// Used to compare with another counter to determine if the variable has been changed
    /// since the other counter was last set.
    pub change_counter: u32,
}

/// Store a state prop's value and other meta information
#[derive(Debug)]
struct StateProp {
    value: RefCell<Rc<PropValue>>,
    meta: RefCell<StatePropMeta>,
}

impl StateProp {
    pub fn new(value: PropValue, came_from_default: bool) -> Self {
        StateProp {
            value: RefCell::new(Rc::new(value)),
            meta: RefCell::new(StatePropMeta {
                came_from_default,
                change_counter: 0,
            }),
        }
    }

    /// Sets the value, mark came_from_default as false, and increment change counter
    pub fn set_value(&self, value: PropValue) {
        *self.value.borrow_mut() = Rc::new(value);
        let mut meta = self.meta.borrow_mut();
        let change_counter = meta.change_counter;
        // A little bit of safety in case someone wiggles their mouse 4 billion times
        meta.change_counter = change_counter.wrapping_add(1);
        meta.came_from_default = false;
    }

    /// Get the value of the state prop
    pub fn get_value(&self) -> Rc<PropValue> {
        Rc::clone(&self.value.borrow())
    }

    /// Get the change counter of the state prop.
    pub fn get_change_counter(&self) -> u32 {
        self.meta.borrow().change_counter
    }

    /// Get whether or not the state prop value came from a default value.
    pub fn get_came_from_default(&self) -> bool {
        self.meta.borrow().came_from_default
    }
}

/// Storage for state props that facilitates setting, retrieval, and tracking of changes
#[derive(Debug)]
pub struct StatePropStore {
    /// A vector of all state props that have been created
    store: RefCell<Vec<StateProp>>,
    /// A map from {state_node}x{query_node} -> {change_counter}
    // TODO: HashMap provides a quick solution, but there may be more efficient ones.
    change_tracker: RefCell<HashMap<(usize, usize), u32>>,
}

impl StatePropStore {
    pub fn new() -> Self {
        StatePropStore {
            store: RefCell::new(Vec::new()),
            change_tracker: RefCell::new(HashMap::new()),
        }
    }

    /// Add a state prop to the store with given `value` and `came_from_default`.
    /// Returns the state prop's index.
    pub fn add_state(&self, value: PropValue, came_from_default: bool) -> usize {
        let mut store = self.store.borrow_mut();
        let idx = store.len();
        let state_prop = StateProp::new(value, came_from_default);
        store.push(state_prop);
        idx
    }

    /// Get the value of a state prop. `origin` is the `GraphNode::DataQuery` that requested the state prop.
    /// The store tracks and reports if the value has changed since the last time it was queried.
    pub fn get_state<A: borrow::Borrow<GraphNode>, B: borrow::Borrow<GraphNode>>(
        &self,
        state_node: A,
        origin: B,
    ) -> PropWithMeta {
        self._get_state(state_node, origin, true)
    }

    /// Internal version `get_state`. Can optionally update the change tracker or not when retrieving the state prop.
    fn _get_state<A: borrow::Borrow<GraphNode>, B: borrow::Borrow<GraphNode>>(
        &self,
        state_node: A,
        origin: B,
        update_change_tracker: bool,
    ) -> PropWithMeta {
        let state_node = state_node.borrow();

        let state_idx = match state_node {
            GraphNode::State(idx) => *idx,
            _ => panic!("Can call get_state() only on a state node"),
        };

        let origin = origin.borrow();
        let change_tracker_key = (state_idx, origin.idx());

        let change_counter_on_last_query = {
            // Borrow RefCells for the shortest time possible to avoid panics.
            let change_tracker = self.change_tracker.borrow();
            change_tracker
                .get(&change_tracker_key)
                .copied()
                .unwrap_or(0)
        };

        let store = self.store.borrow();
        let state_prop = &store[state_idx];
        let value = state_prop.get_value();

        let came_from_default = state_prop.get_came_from_default();

        // Every time a value is changed, `change_counter` is incremented. We use
        // this to see if the value has changed since the last time it was queried.
        // After checking, we update the change tracker with the new `change_counter`
        // so if it is queried on an unchanged value, it will report `changed == false`.
        let change_counter = state_prop.get_change_counter();
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
        }
    }

    /// Set the value of a state prop. `origin` is the `GraphNode::DataQuery` that requested the state prop.
    /// The store tracks and reports if the value has changed since the last time it was queried.
    pub fn set_state<A: borrow::Borrow<GraphNode>>(&self, state_node: A, result: PropValue) {
        let state_node = state_node.borrow();

        let state_idx = match state_node {
            GraphNode::State(idx) => *idx,
            _ => panic!("Can call set_state() only on a state node"),
        };

        let store = self.store.borrow();
        let state_prop = &store[state_idx];
        state_prop.set_value(result);
    }
}
