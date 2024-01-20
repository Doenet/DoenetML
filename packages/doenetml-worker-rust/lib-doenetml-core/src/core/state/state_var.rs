use std::{
    cell::{Ref, RefCell},
    fmt,
    ops::Deref,
    rc::Rc,
};
#[cfg(feature = "web")]
use tsify::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use thiserror::Error;

use doenetml_derive::{
    FromStateVarIntoStateVarValueEnumRefs, StateVarMethods, StateVarMethodsMut,
    StateVarMutableViewMethods, StateVarReadOnlyViewMethods,
};

use crate::{
    dependency::{Dependency, DependencyInstruction, DependencyValueUpdateRequest},
    ExtendSource,
};

/// The name (snake_case) of a state variable    
pub type StateVarName = &'static str;

/// The possible values of the freshness of a state variable.
/// - Fresh: the state variable value has been calculated from given base variable values
/// - Stale: a base variable influencing this state variable has changed so it must be recalculated
/// - Unresolved: the dependencies for this state variable have not yet been created
/// - Resolved: the dependencies for this state variable have been created,
///   but the value has not yet been calculated
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Freshness {
    Fresh,
    Stale,
    Unresolved,
    Resolved,
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
    immutable_view_of_value: StateVarReadOnlyView<T>,

    /// Trait object that exposes the interface to used to specify
    /// how the state variable is calculated from its dependencies
    /// or how to modify its dependencies to give it a new requested value
    interface: Box<dyn StateVarInterface<T>>,

    /// Additional parameters determining the behavior of the state variable
    parameters: StateVarParameters,

    /// Value if don't have dependencies that determine the value
    default_value: T,

    /// A vector that points to a copy of the values of all the dependencies
    /// of this state variable, where the values are behind enums in order to have a vector.
    /// This vector will be used to determine if any dependencies have changed.
    /// It isn't actually used to calculate the state variable value,
    /// because, for efficiency, we will store values for calculations
    /// in a typed form (without enums) directly on the state variable structure.
    all_dependency_values: Vec<StateVarReadOnlyViewEnum>,
}

#[derive(Debug, Error)]
pub enum RequestDependencyUpdateError {
    #[error("request_dependencies_to_update_value is not implemented")]
    NotImplemented,
    #[error("could not update")]
    CouldNotUpdate,
}

/// StateVarInterface defines the relationship between the state variable
/// and its dependencies
pub trait StateVarInterface<T: Default + Clone>: std::fmt::Debug {
    /// Return the instructions that can be used to calculate the dependencies
    /// for this state variable based on the structure of the document,
    /// e.g., the children, attributes, or other state variables
    /// of the component of this state variable
    fn return_dependency_instructions(
        &self,
        extend_source: Option<&ExtendSource>,
        parameters: &StateVarParameters,
    ) -> Vec<DependencyInstruction>;

    /// Given the structure of the document and the dependency instructions,
    /// the actual dependencies will be determined and passed to `save_dependencies_for_value_calculation`.
    /// The function `save_dependencies_for_value_calculation` should store
    /// the dependencies directly on the the structure (`self`)
    /// in a form (presumably typed not with enums) for efficient calculation.
    #[allow(clippy::ptr_arg)]
    fn save_dependencies_for_value_calculation(&mut self, dependencies: &Vec<Vec<Dependency>>);

    /// Calculate the value of the state variable from the current values of the dependencies
    /// that were stored in `save_dependencies_for_value_calculation`.
    /// Save the result in state_var argument that is passed in.
    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableView<T>,
    );

    /// Given the requested value stored in the meta data of the state_var argument,
    /// calculate the desired values of the dependencies
    /// that will lead to that requested value being calculated from those dependencies.
    ///
    /// Store the requested values of the dependencies in the dependency objects
    /// that were saved on the structure (`self`) in `save_dependencies_for_value_calculation()`.
    ///
    /// Report these requested updates in the returned Result.
    ///
    /// If unable to change to the requested value, return Err.
    ///
    /// The `is_direct_change_from_renderer` argument is true if the requested value
    /// came directly from an action of the renderer
    /// (as opposed to coming from another state variable that depends on this variable)
    #[allow(unused)]
    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyView<T>,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        Err(RequestDependencyUpdateError::NotImplemented)
    }
}

/// Parameters that influence the behavior of the state variable
/// - for_renderer: if true, the value of the state variable will always be calculated
///   and sent to the renderer
/// - name: the name of the state variable
/// - is_public: if true, the state variable can be referenced by a macro.
///   A state variable should be public only if its type has a default component type associated with it,
///   which informs which type of component to create when it is referenced,
///   should a component need to be created.
#[derive(Debug, Default)]
pub struct StateVarParameters {
    /// If true, the value of the state variable will always be calculated
    /// and sent to the renderer.
    pub for_renderer: bool,

    /// the name of the state variable
    pub name: &'static str,

    /// If true, the state variable can be referenced by a macro.
    pub is_public: bool,

    /// Hint for a dependency instruction that can be used by `return_dependency_instructions()`
    /// of a state variable interface.
    ///
    /// May cause a subsequent `return_dependencies()` to panic if the resulting dependency
    /// returns an incompatible type.
    pub dependency_instruction_hint: Option<DependencyInstruction>,

    /// Hint telling `return_dependency_instructions()` whether or not to use `extend_source`.
    ///
    /// If true and the extend source is a state variable where the shadowing name matches
    /// the name of this state variable, then create a dependency from the shadowed state variable
    pub create_dependency_from_extend_source: bool,

    /// If true and `create_dependency_from_extend_source` is true,
    /// then if the extend source is a state variable where the shadowing name is None,
    /// create a dependency from the shadowed state variable.
    pub is_primary_state_variable_for_shadowing_extend_source: bool,
}

/// A mutable view of the value of the state variable.
/// It includes methods that allow one to view and change the variable.
#[derive(Debug)]
pub struct StateVarMutableView<T: Default + Clone> {
    /// Structure containing the value of the variable its meta data.
    /// Since inner is in an Rc<RefCell>, it is shared with other views and could be changed by them.
    inner: Rc<RefCell<StateVarInner<T>>>,

    /// a change counter that can be compared to the change counter of inner
    /// in order to determine if the state variable has changed since last viewed
    change_counter_when_last_viewed: u32,
}

/// A read-only view of the value of the state variable.
/// It includes methods that allow one to view the variable.
#[derive(Debug)]
pub struct StateVarReadOnlyView<T: Default + Clone> {
    /// Structure containing the value of the variable its meta data.
    /// Since inner is in an Rc<RefCell>, it is shared with other views and could be changed by them.
    inner: Rc<RefCell<StateVarInner<T>>>,

    /// a change counter that can be compared to the change counter of inner
    /// in order to determine if the state variable has changed since last viewed
    change_counter_when_last_viewed: u32,
}

/// The value of a state variable along with its meta data.
///
/// Since StateVarInner (via StateVarMutableView and StateVarReadOnlyView)
/// is also used for essential data, we keep extra fields, like parameters,
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
    used_default: bool,

    /// A counter that is incremented every time the value is set.
    /// Used to compare with another counter to determine if the variable has been changed
    /// since the other counter was last set.
    change_counter: u32,
}

impl<T: Default + Clone> StateVarInner<T> {
    /// Retrieves a reference to the value of the state variable if the variable is fresh.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_fresh_value(&self) -> &T {
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
    /// set 'used_default` to false, and increment the change counter.
    pub fn set_value(&mut self, new_val: T) {
        self.value = new_val;
        self.freshness = Freshness::Fresh;
        self.used_default = false;
        self.change_counter += 1;
    }

    /// Set the value of the state variable to `new_val`,
    /// mark it as Fresh, set `used_default`, and increment the change counter.
    pub fn set_value_and_used_default(&mut self, new_val: T, used_default: bool) {
        self.value = new_val;
        self.freshness = Freshness::Fresh;
        self.used_default = used_default;
        self.change_counter += 1;
    }

    /// If the state variable is Stale, mark it as Fresh
    /// so that the value it had before `mark_stale` was called
    /// will be its fresh value again.
    ///
    /// Panics: if the state variable is Unresolved.
    pub fn restore_previous_value(&mut self) {
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

    /// Get the value of the `used_default` field
    pub fn get_used_default(&self) -> bool {
        self.used_default
    }

    /// Set the `requested_value` field to the supplied value
    pub fn request_change_value_to(&mut self, requested_val: T) {
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
                used_default: false,
                change_counter: 1, // Note: start at 1 so starts out indicating it changed
            })),
            change_counter_when_last_viewed: 0,
        }
    }

    /// Create a new fresh StateVarMutableView with supplied value
    pub fn new_with_value(val: T, used_default: bool) -> Self {
        StateVarMutableView {
            inner: Rc::new(RefCell::new(StateVarInner {
                value: val,
                freshness: Freshness::Fresh,
                requested_value: T::default(),
                used_default,
                change_counter: 1, // Note: start at 1 so starts out indicating it changed
            })),
            change_counter_when_last_viewed: 0,
        }
    }

    /// Create a new read-only view to this state variable
    pub fn create_new_read_only_view(&self) -> StateVarReadOnlyView<T> {
        StateVarReadOnlyView {
            inner: self.inner.clone(),
            change_counter_when_last_viewed: 0,
        }
    }

    /// Determine if the state variable has changed
    /// since we last called `get_fresh_value_record_viewed`.
    ///
    /// Note: calls to `get_fresh_value` are ignored when determining when last viewed.
    pub fn check_if_changed_since_last_viewed(&self) -> bool {
        self.inner.borrow().get_change_counter() != self.change_counter_when_last_viewed
    }

    /// If the variable is fresh, get a reference to its current value
    /// and record the fact that we viewed the value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_fresh_value_record_viewed(&mut self) -> impl Deref<Target = T> + '_ {
        let inner: Ref<'_, StateVarInner<T>> = self.inner.borrow();

        // We record the fact that the state variable was viewed
        // by recording the current value of the state variable's counter
        self.change_counter_when_last_viewed = inner.get_change_counter();

        Ref::map(inner, |v| v.get_fresh_value())
    }

    /// If the variable is fresh, get a reference to its current value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_fresh_value(&self) -> impl Deref<Target = T> + '_ {
        Ref::map(self.inner.borrow(), |v| v.get_fresh_value())
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
    /// set 'used_default` to false, and mark it fresh
    pub fn set_value(&self, new_val: T) {
        self.inner.borrow_mut().set_value(new_val);
    }

    /// Set the value of the state variable to `new_val`,
    /// mark it as Fresh, and set `used_default`.
    pub fn set_value_and_used_default(&self, new_val: T, used_default: bool) {
        self.inner
            .borrow_mut()
            .set_value_and_used_default(new_val, used_default);
    }

    /// If the state variable is Stale, mark it as Fresh
    /// so that the value it had before `mark_stale` was called
    /// will be its fresh value again.
    ///
    /// Panics: if the state variable is Unresolved.
    pub fn restore_previous_value(&self) {
        self.inner.borrow_mut().restore_previous_value();
    }

    /// Return if the `used_default` field was set
    pub fn get_used_default(&self) -> bool {
        self.inner.borrow().get_used_default()
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
    pub fn request_change_value_to(&self, requested_val: T) {
        self.inner
            .borrow_mut()
            .request_change_value_to(requested_val);
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

impl<T: Default + Clone> StateVarReadOnlyView<T> {
    /// Determine if the state variable has changed
    /// since we last called `get_fresh_value_record_viewed`.
    ///
    /// Note: calls to `get_fresh_value` are ignored when determining when last viewed.
    pub fn check_if_changed_since_last_viewed(&self) -> bool {
        self.inner.borrow().get_change_counter() != self.change_counter_when_last_viewed
    }

    /// If the variable is fresh, get a reference to its current value
    /// and record the fact that we viewed the value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_fresh_value_record_viewed(&mut self) -> impl Deref<Target = T> + '_ {
        let inner = self.inner.borrow();
        self.change_counter_when_last_viewed = inner.get_change_counter();
        Ref::map(inner, |v| v.get_fresh_value())
    }

    /// If the variable is fresh, get a reference to its current value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_fresh_value(&self) -> impl Deref<Target = T> + '_ {
        Ref::map(self.inner.borrow(), |v| v.get_fresh_value())
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

    /// Return if the `used_default` field was set
    pub fn get_used_default(&self) -> bool {
        self.inner.borrow().get_used_default()
    }

    /// Create a new read-only view to this state variable
    pub fn create_new_read_only_view(&self) -> StateVarReadOnlyView<T> {
        StateVarReadOnlyView {
            inner: self.inner.clone(),
            change_counter_when_last_viewed: 0,
        }
    }

    /// Set the `requested_value` field to the supplied value
    pub fn request_change_value_to(&self, requested_val: T) {
        self.inner
            .borrow_mut()
            .request_change_value_to(requested_val);
    }

    /// Get a reference to the current `requested_value` field
    pub fn get_requested_value(&self) -> impl Deref<Target = T> + '_ {
        Ref::map(self.inner.borrow(), |v| v.get_requested_value())
    }
}

impl<T: Default + Clone> Default for StateVarReadOnlyView<T> {
    fn default() -> Self {
        StateVarReadOnlyView {
            inner: Rc::new(RefCell::new(StateVarInner {
                value: T::default(),
                freshness: Freshness::Unresolved,
                requested_value: T::default(),
                used_default: false,
                change_counter: 1, // Note: start at 1 so starts out indicating it changed
            })),
            change_counter_when_last_viewed: 0,
        }
    }
}

impl<T: Default + Clone> Clone for StateVarReadOnlyView<T> {
    fn clone(&self) -> Self {
        self.create_new_read_only_view()
    }
}

impl<T: Default + Clone> StateVar<T> {
    /// Create a new state variable with the supplied interface and parameters
    pub fn new(
        interface: Box<dyn StateVarInterface<T>>,
        parameters: StateVarParameters,
        default_value: T,
    ) -> Self {
        let value = StateVarMutableView::new();
        StateVar {
            immutable_view_of_value: value.create_new_read_only_view(),
            value,
            interface,
            parameters,
            default_value,
            all_dependency_values: vec![],
        }
    }

    /// Create a new read-only view to this state variable
    pub fn create_new_read_only_view(&self) -> StateVarReadOnlyView<T> {
        self.value.create_new_read_only_view()
    }

    /// Determine if the state variable has changed
    /// since we last called `get_fresh_value_record_viewed`.
    ///
    /// Note: calls to `get_fresh_value` are ignored when determining when last viewed.
    pub fn check_if_changed_since_last_viewed(&self) -> bool {
        self.value.check_if_changed_since_last_viewed()
    }

    /// If the variable is fresh, get a reference to its current value
    /// and record the fact that we viewed the value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_fresh_value_record_viewed(&mut self) -> impl Deref<Target = T> + '_ {
        self.value.get_fresh_value_record_viewed()
    }

    /// If the variable is fresh, get a reference to its current value
    /// and record the fact that we viewed the value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_fresh_value(&self) -> impl Deref<Target = T> + '_ {
        self.value.get_fresh_value()
    }

    /// Record the fact that we viewed the value.
    pub fn record_viewed(&mut self) {
        self.value.record_viewed()
    }

    /// Set the value of the state variable to the supplied value,
    /// set 'used_default` to false, and mark it fresh
    pub fn set_value(&self, new_val: T) {
        self.value.set_value(new_val)
    }

    /// Set the value of the state variable to `new_val`,
    /// mark it as Fresh, and set `used_default`.
    pub fn set_value_and_used_default(&self, new_val: T, used_default: bool) {
        self.value.set_value_and_used_default(new_val, used_default)
    }

    /// If the state variable is Stale, mark it as Fresh
    /// so that the value it had before `mark_stale` was called
    /// will be its fresh value again.
    ///
    /// Panics: if the state variable is Unresolved.
    pub fn restore_previous_value(&self) {
        self.restore_previous_value()
    }

    /// Return if the `used_default` field was set
    pub fn get_used_default(&self) -> bool {
        self.value.get_used_default()
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
    pub fn request_change_value_to(&self, requested_val: T) {
        self.value.request_change_value_to(requested_val)
    }

    /// Get a reference to the current `requested_value` field
    pub fn get_requested_value(&self) -> impl Deref<Target = T> + '_ {
        self.value.get_requested_value()
    }

    /// Convenience function to call `return_dependency_instructions` on interface
    pub fn return_dependency_instructions(
        &self,
        extend_source: Option<&ExtendSource>,
    ) -> Vec<DependencyInstruction> {
        self.interface
            .return_dependency_instructions(extend_source, &self.parameters)
    }

    /// Call `save_dependencies_for_value_calculation` on interface
    /// and save dependencies to `all_dependency_values` field
    pub fn set_dependencies(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        self.interface
            .save_dependencies_for_value_calculation(dependencies);
        self.all_dependency_values = dependencies
            .iter()
            .flat_map(|vec| vec.iter().map(|elt| elt.value.create_new_read_only_view()))
            .collect();
    }

    /// Convenience function to call `calculate_state_var_from_dependencies_and_mark_fresh` on interface
    pub fn calculate_state_var_from_dependencies_and_mark_fresh(&self) {
        self.interface
            .calculate_state_var_from_dependencies_and_mark_fresh(&self.value)
    }

    /// Convenience function to call `request_dependencies_to_update_value` on interface
    pub fn request_dependencies_to_update_value(
        &self,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        self.interface.request_dependencies_to_update_value(
            &self.immutable_view_of_value,
            is_direct_change_from_renderer,
        )
    }

    /// Get name of the state variable
    pub fn get_name(&self) -> &'static str {
        self.parameters.name
    }

    /// Return whether or not a macro can reference the state variable
    pub fn get_is_public(&self) -> bool {
        self.parameters.is_public
    }

    /// Return whether or not this state variable value should be sent to the renderer
    pub fn get_for_renderer(&self) -> bool {
        self.parameters.for_renderer
    }

    /// Return the default value of this state variable
    pub fn return_default_value(&self) -> T {
        self.default_value.clone()
    }

    /// Record that the fact each of the dependencies in `all_dependency_values` were viewed.
    /// Used to determine if any dependency changed since it was last viewed.
    pub fn record_all_dependencies_viewed(&mut self) {
        self.all_dependency_values
            .iter_mut()
            .for_each(|state_var| state_var.record_viewed())
    }

    /// Check if a dependency has changed since we last called `record_all_dependencies_viewed`.
    pub fn check_if_any_dependency_changed_since_last_viewed(&self) -> bool {
        if self.all_dependency_values.is_empty() {
            // if there are no dependencies, then report true if state variable is Unresolved or Resolved,
            // as in that case, we still need to calculate the state variable
            let this_freshness = self.get_freshness();
            this_freshness == Freshness::Resolved || this_freshness == Freshness::Unresolved
        } else {
            self.all_dependency_values
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

/// The base structure for a state variable.
///
/// Provides access to the `StateVarInterface` methods
/// as well as methods to view and change the variable.
#[derive(StateVarMethods, StateVarMethodsMut, FromStateVarIntoStateVarValueEnumRefs)]
pub enum StateVarEnum {
    Number(StateVar<f64>),
    Integer(StateVar<i64>),
    String(StateVar<String>),
    Boolean(StateVar<bool>),
}

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
#[derive(StateVarReadOnlyViewMethods)]
pub enum StateVarReadOnlyViewEnum {
    Number(StateVarReadOnlyView<f64>),
    Integer(StateVarReadOnlyView<i64>),
    String(StateVarReadOnlyView<String>),
    Boolean(StateVarReadOnlyView<bool>),
}

/// This can contain the value of a state variable of any type,
/// which is useful for function parameters.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize, derive_more::TryInto)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub enum StateVarValueEnum {
    String(String),
    Number(f64),
    Integer(i64),
    Boolean(bool),
}

impl<'a> StateVarEnumRef<'a> {
    /// If creating a component from a reference to this state variable
    /// then create a component of the given type.
    ///
    /// TODO: presumably, there should be a way to override this default.
    pub fn get_default_component_type(&self) -> &'static str {
        match self {
            StateVarEnumRef::Number(_) => "number",
            StateVarEnumRef::Integer(_) => "number",
            StateVarEnumRef::String(_) => "text",
            StateVarEnumRef::Boolean(_) => "boolean",
        }
    }
}

impl fmt::Debug for StateVarEnum {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_freshness() {
            Freshness::Fresh => self.get_fresh_value().fmt(f),
            Freshness::Stale => f.write_str("Stale"),
            Freshness::Unresolved => f.write_str("Unresolved"),
            Freshness::Resolved => f.write_str("Resolved"),
        }
    }
}

impl fmt::Debug for StateVarMutableViewEnum {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_freshness() {
            Freshness::Fresh => self.get_fresh_value().fmt(f),
            Freshness::Stale => f.write_str("Stale"),
            Freshness::Unresolved => f.write_str("Unresolved"),
            Freshness::Resolved => f.write_str("Resolved"),
        }
    }
}

impl fmt::Debug for StateVarReadOnlyViewEnum {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_freshness() {
            Freshness::Fresh => self.get_fresh_value().fmt(f),
            Freshness::Stale => f.write_str("Stale"),
            Freshness::Unresolved => f.write_str("Unresolved"),
            Freshness::Resolved => f.write_str("Resolved"),
        }
    }
}
