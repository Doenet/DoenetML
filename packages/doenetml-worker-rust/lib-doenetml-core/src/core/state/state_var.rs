use std::{
    cell::{Ref, RefCell},
    fmt,
    ops::Deref,
    rc::Rc,
};

use enum_dispatch::enum_dispatch;

#[cfg(feature = "web")]
use tsify::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use thiserror::Error;

use doenetml_derive::{
    FromStateVarIntoStateVarEnumRefs, StateVarMethods, StateVarMethodsMut,
    StateVarMutableViewMethods, StateVarViewMethods,
};

use crate::{
    components::doenet::{boolean::Boolean, text::Text},
    dependency::{DataQuery, DependenciesCreatedForDataQuery, DependencyValueUpdateRequest},
    ExtendSource,
};

use super::StateVarIdx;

/// The name (snake_case) of a state variable    
pub type StateVarName = &'static str;

/// The possible values of the freshness of a state variable.
/// - `Fresh`: the state variable value has been calculated from given base variable values
/// - `Stale`: a base variable influencing this state variable has changed so it must be recalculated
/// - `Unresolved`: the dependencies for this state variable have not yet been created
/// - `Resolved`: the dependencies for this state variable have been created,
///   but the value has not yet been calculated
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Freshness {
    Fresh,
    Stale,
    Unresolved,
    Resolved,
}

/// The possible results of a call to `calculate`:
/// - Calculated(T): the value was calculated to be T
/// - FromDefault(T): the value T was determined from the default value
pub enum StateVarCalcResult<T> {
    Calculated(T),
    FromDefault(T),
}

/// StateVar<T> is the base data structure for the value of a state variable.
#[derive(Debug)]
pub struct StateVar<T: Default + Clone> {
    /// The current value of the state variable
    /// in a structure that allows the value to be mutated
    /// and also holds meta data about the variable
    value: StateVarMutableView<T>,

    /// A reference to the same value of the state variable
    /// in a structure that does not allow the value to be mutated.
    /// It is just a cached copy of the result of calling
    /// `.create_new_read_only_view()` on `.value`, saved here for efficiency.
    /// Sent to functions to give them read only access to the variable.
    immutable_view_of_value: StateVarView<T>,

    /// Trait object that exposes the interface used "update" a state var.
    /// That is, it specifies how the state variable is calculated from its dependencies
    /// or how to modify its dependencies to give it a new requested value.
    updater: Box<dyn StateVarUpdater<T>>,

    /// Value if don't have dependencies that determine the value
    default_value: T,

    /// A vector that points to a copy of the values of all the dependencies
    /// of this state variable, where the values are behind enums in order to have a vector.
    /// This vector will be used to determine if any dependencies have changed.
    /// It isn't actually used to calculate the state variable value,
    /// because, for efficiency, we will store values for calculations
    /// in a typed form (without enums) directly on the state variable structure.
    all_data: Vec<StateVarViewEnum>,
}

#[derive(Debug, Error)]
pub enum RequestDependencyUpdateError {
    #[error("request_dependency_updates is not implemented")]
    NotImplemented,
    #[error("could not update")]
    CouldNotUpdate,
}

/// Methods used when updating a state variable's dependencies, including querying for its
/// dependencies and calculating the value from its dependencies.
pub trait StateVarUpdater<T: Default + Clone>: std::fmt::Debug {
    /// Returns the data queries needed to calculate the dependencies
    /// for this state variable. These queries may be based on structure of the document,
    /// e.g., the children, attributes, or other state variables
    /// of the component of this state variable.
    fn return_data_queries(
        &mut self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<DataQuery>;

    /// Called when data queries for the state variable have been completed.
    /// State variables cache the results of their queries
    /// for efficient future computations.
    #[allow(clippy::ptr_arg)]
    fn save_data(&mut self, dependencies: &Vec<DependenciesCreatedForDataQuery>);

    /// Calculate the value of the state variable from the currently cached query results.
    /// Results of this function will be cached, so local caching is not needed.
    fn calculate(&self) -> StateVarCalcResult<T>;

    /// All state variables know how to calculate their value given their dependencies.
    /// Sometimes a state variable is requested to take on a particular value. If the
    /// state variable has dependencies, these dependencies must change in order for the
    /// state variable to take on the target value.
    ///
    /// This function returns a list of update requests for the state variable's dependencies
    /// that, if set on the dependencies, will cause the state variable to take on the
    /// desired value.
    ///
    /// An `Err` is returned if an effective combination of updates cannot be found.
    ///
    /// The `is_direct_change_from_renderer` argument is true if the requested value
    /// came directly from an action of the renderer
    /// (as opposed to coming from another state variable that depends on this variable).
    #[allow(unused)]
    fn invert(
        &mut self,
        state_var: &StateVarView<T>,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        Err(RequestDependencyUpdateError::NotImplemented)
    }
}

/// A mutable view of the value of the state variable.
/// It includes methods that allow one to view and change the variable.
#[derive(Debug)]
pub struct StateVarMutableView<T: Default + Clone> {
    /// Structure containing the value of the variable its meta data.
    /// Since inner is in an Rc<RefCell>, it is shared with other views and could be changed by them.
    inner: Rc<RefCell<StateVarInner<T>>>,

    /// A change counter that can be compared to the change counter of inner
    /// in order to determine if the state variable has changed since last viewed.
    change_counter_when_last_viewed: u32,
}

/// A read-only view of the value of the state variable.
/// It includes methods that allow one to view the variable.
#[derive(Debug)]
pub struct StateVarView<T: Default + Clone> {
    /// Structure containing the value of the variable its meta data.
    /// Since inner is in an Rc<RefCell>, it is shared with other views and could be changed by them.
    inner: Rc<RefCell<StateVarInner<T>>>,

    /// a change counter that can be compared to the change counter of inner
    /// in order to determine if the state variable has changed since last viewed
    change_counter_when_last_viewed: u32,

    ///
    update_has_been_queued: bool,
    // pub register_update_request: Option<RegisterUpdateRequest<'a>>,
}

/// The value of a state variable along with its meta data.
///
/// Since StateVarInner (via StateVarMutableView and StateVarView)
/// is also used for essential data, we keep extra fields,
/// off this structure and put them only in StateVar.
#[derive(Debug)]
struct StateVarInner<T: Default + Clone> {
    /// The value of the state variable.
    /// It can be viewed by all views but changed only by mutable views.
    value: T,

    /// The current freshness of the state variable.
    /// It is set to fresh whenever the value is set
    /// and set to stale via the mark_stale method.
    freshness: Freshness,

    /// If one of the dependencies of this state variable has requested that its value
    /// be changed to a particular value, it will be stored in requested_value.
    /// It can be changed even by read-only views.
    requested_value: T,

    /// True if the value was set using the variable's default value.
    /// Is typically used to lower the precedence of this state variable's value
    /// when calculating another state variable, as it indicates that the document author
    /// did not explicitly set the value
    came_from_default: bool,

    /// A counter that is incremented every time the value is set.
    /// Used to compare with another counter to determine if the variable has been changed
    /// since the other counter was last set.
    change_counter: u32,
}

impl<T: Default + Clone> StateVarInner<T> {
    /// Retrieves a reference to the value of the state variable if the variable is fresh.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get(&self) -> &T {
        if self.freshness != Freshness::Fresh {
            panic!("State variable is not fresh, cannot get its fresh value");
        }
        &self.value
    }

    /// Attempts to retrieve a reference to the last value (fresh or not) of the state variable.
    /// If the state variable is unresolved or merely resolved, returns None.
    pub fn try_get_last_value(&self) -> Option<&T> {
        match self.freshness {
            Freshness::Unresolved | Freshness::Resolved => None,
            Freshness::Fresh | Freshness::Stale => Some(&self.value),
        }
    }

    /// Set the freshness of the variable to Stale
    pub fn mark_stale(&mut self) {
        match self.freshness {
            Freshness::Fresh => {
                self.freshness = Freshness::Stale;
            }
            Freshness::Stale => (),
            Freshness::Unresolved | Freshness::Resolved => {
                panic!("Cannot mark an unresolved or merely resolved state variable as stale.");
            }
        }
    }

    /// Set the freshness of the variable to Resolved
    pub fn set_as_resolved(&mut self) {
        match self.freshness {
            Freshness::Unresolved => {
                self.freshness = Freshness::Resolved;
            }
            Freshness::Resolved => (),
            Freshness::Fresh | Freshness::Stale => {
                panic!("Cannot set a fresh or stale state variable to resolved.");
            }
        }
    }

    /// Set the value of the state variable to `new_val`, mark it as Fresh,
    /// set 'came_from_default` to false, and increment the change counter.
    pub fn set_value(&mut self, new_val: T) {
        self.value = new_val;
        self.freshness = Freshness::Fresh;
        self.came_from_default = false;
        self.change_counter += 1;
    }

    /// Set the value of the state variable to `new_val`,
    /// mark it as Fresh, set `came_from_default`, and increment the change counter.
    pub fn set_value_and_set_came_from_default(&mut self, new_val: T, came_from_default: bool) {
        self.value = new_val;
        self.freshness = Freshness::Fresh;
        self.came_from_default = came_from_default;
        self.change_counter += 1;
    }

    /// If the state variable is Stale, mark it as Fresh
    /// so that the value it had before `mark_stale` was called
    /// will be its fresh value again.
    ///
    /// Panics: if the state variable is Unresolved.
    pub fn mark_fresh(&mut self) {
        match self.freshness {
            Freshness::Stale => {
                self.freshness = Freshness::Fresh;
            }
            Freshness::Fresh => (),
            Freshness::Unresolved | Freshness::Resolved => {
                panic!("Cannot restore previous value to an unresolved or merely resolved state variable");
            }
        }
    }

    /// Get the value of the `came_from_default` field
    pub fn came_from_default(&self) -> bool {
        self.came_from_default
    }

    /// Set the `requested_value` field to the supplied value
    pub fn set_requested_value(&mut self, requested_val: T) {
        self.requested_value = requested_val;
    }
    /// Get a reference to the current `requested_value` field
    pub fn get_requested_value(&self) -> &T {
        &self.requested_value
    }

    /// Get the current value of the change counter
    pub fn get_change_counter(&self) -> u32 {
        self.change_counter
    }
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
    /// set 'came_from_default` to false, and mark it fresh
    pub fn set_value(&self, new_val: T) {
        self.inner.borrow_mut().set_value(new_val);
    }

    /// Set the value of the state variable to `new_val`,
    /// mark it as Fresh, and set `came_from_default`.
    pub fn set_value_and_set_came_from_default(&self, new_val: T, came_from_default: bool) {
        self.inner
            .borrow_mut()
            .set_value_and_set_came_from_default(new_val, came_from_default);
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
    /// To send all queued updates to core, call `return_queued_updates()`
    /// on the `data` structure that contains this state variable
    /// and pass the result as the return of the `request_dependency_updates()` function.
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

#[enum_dispatch]
pub trait QueryUpdateRequests {
    /// Reset variable that tracks whether or not an update has been requested
    fn reset_queued_updates(&mut self);

    fn return_indices_with_queued_updates(&self) -> Vec<usize>;
}

impl<T: Default + Clone> QueryUpdateRequests for StateVarView<T> {
    /// Reset 'update_has_been_queued` to false
    fn reset_queued_updates(&mut self) {
        self.update_has_been_queued = false;
    }

    fn return_indices_with_queued_updates(&self) -> Vec<usize> {
        if self.update_has_been_queued {
            vec![0]
        } else {
            vec![]
        }
    }
}

impl<T> QueryUpdateRequests for Vec<T>
where
    T: QueryUpdateRequests,
{
    fn reset_queued_updates(&mut self) {
        for val in self.iter_mut() {
            val.reset_queued_updates();
        }
    }

    fn return_indices_with_queued_updates(&self) -> Vec<usize> {
        // Note: this algorithm does not correctly handle Vec<Vec<T: QueryUpdateRequests>>
        self.iter()
            .enumerate()
            .filter_map(|(idx, val)| {
                if val.return_indices_with_queued_updates().is_empty() {
                    None
                } else {
                    Some(idx)
                }
            })
            .collect()
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

impl<T: Default + Clone> StateVar<T> {
    /// Create a new state variable with the supplied interface
    pub fn new(updater: Box<dyn StateVarUpdater<T>>, default_value: T) -> Self {
        let value = StateVarMutableView::new();
        StateVar {
            immutable_view_of_value: value.create_new_read_only_view(),
            value,
            updater,
            default_value,
            all_data: vec![],
        }
    }

    /// Create a new read-only view to this state variable
    pub fn create_new_read_only_view(&self) -> StateVarView<T> {
        self.value.create_new_read_only_view()
    }

    /// Determine if the state variable has changed
    /// since we last called `get_value_record_viewed`.
    ///
    /// Note: calls to `get` are ignored when determining when last viewed.
    pub fn check_if_changed_since_last_viewed(&self) -> bool {
        self.value.check_if_changed_since_last_viewed()
    }

    /// If the variable is fresh, get a reference to its current value
    /// and record the fact that we viewed the value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_value_record_viewed(&mut self) -> impl Deref<Target = T> + '_ {
        self.value.get_value_record_viewed()
    }

    /// If the variable is fresh, get a reference to its current value
    /// and record the fact that we viewed the value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get(&self) -> impl Deref<Target = T> + '_ {
        self.value.get()
    }

    /// Record the fact that we viewed the value.
    pub fn record_viewed(&mut self) {
        self.value.record_viewed()
    }

    /// Set the value of the state variable to the supplied value,
    /// set 'came_from_default` to false, and mark it fresh
    pub fn set_value(&self, new_val: T) {
        self.value.set_value(new_val)
    }

    /// Set the value of the state variable to `new_val`,
    /// mark it as Fresh, and set `came_from_default`.
    pub fn set_value_and_set_came_from_default(&self, new_val: T, came_from_default: bool) {
        self.value
            .set_value_and_set_came_from_default(new_val, came_from_default)
    }

    /// If the state variable is Stale, mark it as Fresh
    /// so that the value it had before `mark_stale` was called
    /// will be its fresh value again.
    ///
    /// Panics: if the state variable is Unresolved.
    pub fn mark_fresh(&self) {
        self.value.mark_fresh()
    }

    /// Return if the value of this state variable was set from its default value
    pub fn came_from_default(&self) -> bool {
        self.value.came_from_default()
    }

    /// Set the freshness of the variable to Stale
    pub fn mark_stale(&self) {
        self.value.mark_stale()
    }

    /// Set the freshness of the variable to Resolved
    pub fn set_as_resolved(&self) {
        self.value.set_as_resolved()
    }

    /// Return the current freshness of the variable
    pub fn get_freshness(&self) -> Freshness {
        self.value.get_freshness()
    }

    /// Set the `requested_value` field to the supplied value
    pub fn set_requested_value(&self, requested_val: T) {
        self.value.set_requested_value(requested_val)
    }

    /// Get a reference to the current `requested_value` field
    pub fn get_requested_value(&self) -> impl Deref<Target = T> + '_ {
        self.value.get_requested_value()
    }

    /// Convenience function to call `return_data_queries` on interface
    pub fn return_data_queries(
        &mut self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<DataQuery> {
        self.updater.return_data_queries(extending, state_var_idx)
    }

    /// Call `save_dependencies` on interface
    /// and save dependencies to `all_data` field
    pub fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForDataQuery>) {
        self.updater.save_data(dependencies);
        self.all_data = dependencies
            .iter()
            .flat_map(|vec| vec.iter().map(|elt| elt.value.create_new_read_only_view()))
            .collect();
    }

    /// Convenience function to call `calculate` on interface
    /// and then call mark_fresh
    pub fn calculate_and_mark_fresh(&self) {
        match self.updater.calculate() {
            StateVarCalcResult::Calculated(val) => self.value.set_value(val),
            StateVarCalcResult::FromDefault(val) => {
                self.value.set_value_and_set_came_from_default(val, true)
            }
        };
        self.mark_fresh();
    }

    /// Convenience function to call `request_dependency_updates` on interface
    pub fn request_dependency_updates(
        &mut self,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        self.updater.invert(
            &self.immutable_view_of_value,
            is_direct_change_from_renderer,
        )
    }

    /// Return the default value of this state variable
    pub fn return_default_value(&self) -> T {
        self.default_value.clone()
    }

    /// Record that the fact each of the dependencies in `all_data` were viewed.
    /// Used to determine if any dependency changed since it was last viewed.
    pub fn record_all_dependencies_viewed(&mut self) {
        self.all_data
            .iter_mut()
            .for_each(|state_var| state_var.record_viewed())
    }

    /// Check if a dependency has changed since we last called `record_all_dependencies_viewed`.
    pub fn check_if_any_dependency_changed_since_last_viewed(&self) -> bool {
        if self.all_data.is_empty() {
            // if there are no dependencies, then report true if state variable is Unresolved or Resolved,
            // as in that case, we still need to calculate the state variable
            let this_freshness = self.get_freshness();
            this_freshness == Freshness::Resolved || this_freshness == Freshness::Unresolved
        } else {
            self.all_data
                .iter()
                .any(|state_var| state_var.check_if_changed_since_last_viewed())
        }
    }
}

///////////////////////////////////////////////////////////////////////
// State variable enum views that allow one to refer to state variables
// without specifying type.
// Particularly useful for having vectors of mixed type
///////////////////////////////////////////////////////////////////////

#[derive(StateVarMethods)]
pub enum StateVarEnumRef<'a> {
    Number(&'a StateVar<f64>),
    Integer(&'a StateVar<i64>),
    String(&'a StateVar<String>),
    Boolean(&'a StateVar<bool>),
}

#[derive(StateVarMethods, StateVarMethodsMut)]
pub enum StateVarEnumRefMut<'a> {
    Number(&'a mut StateVar<f64>),
    Integer(&'a mut StateVar<i64>),
    String(&'a mut StateVar<String>),
    Boolean(&'a mut StateVar<bool>),
}

/// An mutable enum view of the value of the state variable.
/// It includes methods that allow one to view and change the variable.
#[derive(StateVarMutableViewMethods)]
pub enum StateVarMutableViewEnum {
    Number(StateVarMutableView<f64>),
    Integer(StateVarMutableView<i64>),
    String(StateVarMutableView<String>),
    Boolean(StateVarMutableView<bool>),
}

/// An read-only enum view of the value of the state variable.
/// It includes methods that allow one to view the variable.
#[derive(StateVarViewMethods)]
pub enum StateVarViewEnum {
    Number(StateVarView<f64>),
    Integer(StateVarView<i64>),
    String(StateVarView<String>),
    Boolean(StateVarView<bool>),
}

/// This can contain the value of a state variable of any type,
/// which is useful for function parameters.
#[derive(
    Debug,
    Clone,
    PartialEq,
    serde::Serialize,
    serde::Deserialize,
    derive_more::TryInto,
    derive_more::From,
    FromStateVarIntoStateVarEnumRefs,
)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub enum StateVarValue {
    String(String),
    Number(f64),
    Integer(i64),
    Boolean(bool),
}

impl<'a> StateVarEnumRef<'a> {
    /// If creating a component from a reference to this state variable
    /// then create a component of the given type with the given state variable
    /// shadowing the original state variable.
    ///
    /// TODO: presumably, there should be a way to override this default.
    ///
    /// Returns: a tuple of (component type, state variable name)
    pub fn get_default_shadowing_component(&self) -> (&'static str, StateVarIdx) {
        match self {
            StateVarEnumRef::Number(_) => unimplemented!("Have not yet created number component"),
            StateVarEnumRef::Integer(_) => unimplemented!("Have not yet created number component"),
            StateVarEnumRef::String(_) => Text::get_state_variable_that_shadows_when_extending(),
            StateVarEnumRef::Boolean(_) => {
                Boolean::get_state_variable_that_shadows_when_extending()
            }
        }
    }
}

impl fmt::Debug for StateVarMutableViewEnum {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_freshness() {
            Freshness::Fresh => self.get().fmt(f),
            Freshness::Stale => f.write_str("Stale"),
            Freshness::Unresolved => f.write_str("Unresolved"),
            Freshness::Resolved => f.write_str("Resolved"),
        }
    }
}

impl fmt::Debug for StateVarViewEnum {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_freshness() {
            Freshness::Fresh => self.get().fmt(f),
            Freshness::Stale => f.write_str("Stale"),
            Freshness::Unresolved => f.write_str("Unresolved"),
            Freshness::Resolved => f.write_str("Resolved"),
        }
    }
}
