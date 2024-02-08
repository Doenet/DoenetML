use std::{
    cell::{Ref, RefCell},
    ops::Deref,
    rc::Rc,
};

use super::{Freshness, QueryUpdateRequests, StateVarInner};

/// A mutable view of a state variable.
/// It includes methods that allow one to view and change the variable.
#[derive(Debug)]
pub struct StateVarMutableView<T: Default + Clone> {
    /// Structure containing the value of the variable its meta data.
    /// Since inner is in an `Rc<RefCell>`, it is shared with other views and could be changed by them.
    inner: Rc<RefCell<StateVarInner<T>>>,

    /// A change counter that can be compared to the change counter of inner
    /// in order to determine if the state variable has changed since last viewed.
    change_counter_when_last_viewed: u32,
}

impl<T: Default + Clone> Default for StateVarMutableView<T> {
    fn default() -> Self {
        Self::new()
    }
}

impl<T: Default + Clone> StateVarMutableView<T> {
    /// Create a new unresolved StateVarMutableView
    pub fn new() -> Self {
        StateVarMutableView {
            inner: Rc::new(RefCell::new(StateVarInner {
                value: T::default(),
                freshness: Freshness::Unresolved,
                requested_value: T::default(),
                came_from_default: false,
                change_counter: 1, // Note: start at 1 so starts out indicating it changed
            })),
            change_counter_when_last_viewed: 0,
        }
    }

    /// Create a new fresh StateVarMutableView with supplied value
    pub fn new_with_value(val: T, came_from_default: bool) -> Self {
        StateVarMutableView {
            inner: Rc::new(RefCell::new(StateVarInner {
                value: val,
                freshness: Freshness::Fresh,
                requested_value: T::default(),
                came_from_default,
                change_counter: 1, // Note: start at 1 so starts out indicating it changed
            })),
            change_counter_when_last_viewed: 0,
        }
    }

    /// Create a new read-only view to this state variable
    pub fn create_new_read_only_view(&self) -> StateVarView<T> {
        StateVarView {
            inner: self.inner.clone(),
            change_counter_when_last_viewed: 0,
            update_has_been_queued: false,
        }
    }

    /// Determine if the state variable has changed
    /// since we last called `get_value_record_viewed`.
    ///
    /// Note: calls to `get` are ignored when determining when last viewed.
    pub fn check_if_changed_since_last_viewed(&self) -> bool {
        self.inner.borrow().get_change_counter() != self.change_counter_when_last_viewed
    }

    /// If the variable is fresh, get a reference to its current value
    /// and record the fact that we viewed the value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_value_record_viewed(&mut self) -> impl Deref<Target = T> + '_ {
        let inner: Ref<'_, StateVarInner<T>> = self.inner.borrow();

        // We record the fact that the state variable was viewed
        // by recording the current value of the state variable's counter
        self.change_counter_when_last_viewed = inner.get_change_counter();

        Ref::map(inner, |v| v.get())
    }

    /// If the variable is fresh, get a reference to its current value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get(&self) -> impl Deref<Target = T> + '_ {
        Ref::map(self.inner.borrow(), |v| v.get())
    }

    /// Record the fact that we viewed the value.
    pub fn record_viewed(&mut self) {
        let inner = self.inner.borrow();

        // We record the fact that the state variable was viewed
        // by recording the current value of the state variable's counter
        self.change_counter_when_last_viewed = inner.get_change_counter();
    }

    /// Attempts to retrieve a reference to the last value (fresh or not) of the state variable.
    /// If the state variable is unresolved, returns None.
    pub fn try_get_last_value(&self) -> Option<impl Deref<Target = T> + '_> {
        // Note: slower than it seems necessary due to two borrows.
        // Another option is to use the ref_filter_map crate or see if there will eventually be a way
        // to convert Ref<Option<T>> to Option<Ref<T>>.
        // See: https://stackoverflow.com/a/62474266
        if self.inner.borrow().try_get_last_value().is_none() {
            None
        } else {
            Some(Ref::map(self.inner.borrow(), |v| {
                v.try_get_last_value().unwrap()
            }))
        }
    }

    /// Set the value of the state variable to the supplied value,
    /// set `came_from_default` to `false`, and mark it fresh
    pub fn set_value(&self, new_val: T) {
        self.inner.borrow_mut().set_value(new_val);
    }

    /// Set the value of the state variable to `new_val`,
    /// mark it as Fresh, and set `came_from_default` to `true`.
    pub fn set_value_from_default(&self, new_val: T) {
        self.inner.borrow_mut().set_value_from_default(new_val);
    }

    /// If the state variable is Stale, mark it as Fresh
    /// so that the value it had before `mark_stale` was called
    /// will be its fresh value again.
    ///
    /// Panics: if the state variable is Unresolved.
    pub fn mark_fresh(&self) {
        self.inner.borrow_mut().mark_fresh();
    }

    /// Return if the value of this state variable was set from its default value
    pub fn came_from_default(&self) -> bool {
        self.inner.borrow().came_from_default()
    }

    /// Set the freshness of the variable to Stale
    pub fn mark_stale(&self) {
        self.inner.borrow_mut().mark_stale()
    }

    /// Set the freshness of the variable to Resolved
    pub fn set_as_resolved(&self) {
        self.inner.borrow_mut().set_as_resolved()
    }

    /// Return the current freshness of the variable
    pub fn get_freshness(&self) -> Freshness {
        self.inner.borrow().freshness
    }

    /// Set the `requested_value` field to the supplied value
    pub fn set_requested_value(&self, requested_val: T) {
        self.inner.borrow_mut().set_requested_value(requested_val);
    }

    /// Get a reference to the current `requested_value` field
    pub fn get_requested_value(&self) -> impl Deref<Target = T> + '_ {
        Ref::map(self.inner.borrow(), |v| v.get_requested_value())
    }

    /// Set the value of the state variable to the current value of its `requested_value` field.
    ///
    /// Equivalent to calling `get_requested_value()` and then calling `set_value()` with that value,
    /// except more efficient due to only one borrow of the inner value.
    pub fn set_value_to_requested_value(&self) {
        let mut inner = self.inner.borrow_mut();
        let new_value = inner.get_requested_value().clone();
        inner.set_value(new_value);
    }
}

/// A read-only view of a state variable.
/// Includes methods to view its value and queue updates that set the requested value for this variable.
#[derive(Debug)]
pub struct StateVarView<T: Default + Clone> {
    /// Structure containing the value of the variable its meta data.
    /// Since inner is in an `Rc<RefCell>`, it is shared with other views and could be changed by them.
    inner: Rc<RefCell<StateVarInner<T>>>,

    /// a change counter that can be compared to the change counter of inner
    /// in order to determine if the state variable has changed since last viewed
    change_counter_when_last_viewed: u32,

    ///
    update_has_been_queued: bool,
    // pub register_update_request: Option<RegisterUpdateRequest<'a>>,
}

impl<T: Default + Clone> StateVarView<T> {
    /// Determine if the state variable has changed
    /// since we last called `get_value_record_viewed`.
    ///
    /// Note: calls to `get` are ignored when determining when last viewed.
    pub fn check_if_changed_since_last_viewed(&self) -> bool {
        self.inner.borrow().get_change_counter() != self.change_counter_when_last_viewed
    }

    /// If the variable is fresh, get a reference to its current value
    /// and record the fact that we viewed the value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_value_record_viewed(&mut self) -> impl Deref<Target = T> + '_ {
        let inner = self.inner.borrow();
        self.change_counter_when_last_viewed = inner.get_change_counter();
        Ref::map(inner, |v| v.get())
    }

    /// If the variable is fresh, get a reference to its current value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get(&self) -> impl Deref<Target = T> + '_ {
        Ref::map(self.inner.borrow(), |v| v.get())
    }

    /// Record the fact that we viewed the value.
    pub fn record_viewed(&mut self) {
        let inner = self.inner.borrow();
        self.change_counter_when_last_viewed = inner.get_change_counter();
    }

    /// Attempts to retrieve a reference to the last value (fresh or not) of the state variable.
    /// If the state variable is unresolved, returns None.
    pub fn try_get_last_value(&self) -> Option<impl Deref<Target = T> + '_> {
        // Note: slower than it seems necessary due to two borrows.
        // Another option is to use the ref_filter_map crate or see if there will eventually be a way
        // to convert Ref<Option<T>> to Option<Ref<T>>.
        // See: https://stackoverflow.com/a/62474266
        if self.inner.borrow().try_get_last_value().is_none() {
            None
        } else {
            Some(Ref::map(self.inner.borrow(), |v| {
                v.try_get_last_value().unwrap()
            }))
        }
    }

    /// Return the current freshness of the variable
    pub fn get_freshness(&self) -> Freshness {
        self.inner.borrow().freshness
    }

    /// Return if the value of this state variable was set from its default value
    pub fn came_from_default(&self) -> bool {
        self.inner.borrow().came_from_default()
    }

    /// Create a new read-only view to this state variable
    pub fn create_new_read_only_view(&self) -> StateVarView<T> {
        StateVarView {
            inner: self.inner.clone(),
            change_counter_when_last_viewed: 0,
            update_has_been_queued: false,
        }
    }

    /// Queue an update to the dependency that will
    /// attempt to set its value to the `requested_value` argument.
    ///
    /// To send all queued updates to core, call `queued_updates()`
    /// on the `data` structure that contains this state variable
    /// and pass the result as the return of the `invert()` function.
    ///
    /// A call to `queue_update` will never fail. However, the queued update may
    /// be discarded by core if the request is overwritten
    /// or if the update is not successful.
    pub fn queue_update(&mut self, requested_val: T) {
        self.inner.borrow_mut().set_requested_value(requested_val);

        self.update_has_been_queued = true;
    }

    /// Get a reference to the current `requested_value` field
    pub fn get_requested_value(&self) -> impl Deref<Target = T> + '_ {
        Ref::map(self.inner.borrow(), |v| v.get_requested_value())
    }
}

impl<T: Default + Clone> Default for StateVarView<T> {
    fn default() -> Self {
        StateVarView {
            inner: Rc::new(RefCell::new(StateVarInner {
                value: T::default(),
                freshness: Freshness::Unresolved,
                requested_value: T::default(),
                came_from_default: false,
                change_counter: 1, // Note: start at 1 so starts out indicating it changed
            })),
            change_counter_when_last_viewed: 0,
            update_has_been_queued: false,
        }
    }
}

impl<T: Default + Clone> Clone for StateVarView<T> {
    fn clone(&self) -> Self {
        self.create_new_read_only_view()
    }
}

impl<T: Default + Clone> QueryUpdateRequests for StateVarView<T> {
    /// Reset 'update_has_been_queued` to false
    fn clear_queued_updates(&mut self) {
        self.update_has_been_queued = false;
    }

    fn indices_with_queued_updates(&self) -> Vec<usize> {
        if self.update_has_been_queued {
            vec![0]
        } else {
            vec![]
        }
    }
}
