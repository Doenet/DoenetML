use std::{
    cell::{Ref, RefCell},
    fmt,
    ops::Deref,
    rc::Rc,
};

use doenetml_derive::{StateVarMethods, StateVarMutableViewMethods, StateVarReadOnlyViewMethods};

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

/// StateVarTyped<T> is the base data structure for the value of a state variable.
#[derive(Debug)]
pub struct StateVarTyped<T: Default + Clone> {
    /// The current value of the state variable
    /// in a structure that allows the value to be mutated
    /// and also holds meta data about the variable
    value: StateVarMutableViewTyped<T>,

    /// A reference to the same value of the state variable
    /// in a structure that does not allow the value to be mutated.
    /// Sent to functions to give them read only access to the variable.
    immutable_view_of_value: StateVarReadOnlyViewTyped<T>,

    /// Trait object that exposes the interface to used to specify
    /// how the state variable is calculated from its dependencies
    /// or how to modify its dependencies to give it a new requested value
    interface: Box<dyn StateVarInterface<T>>,

    /// Additional parameters determining the behavior of the state variable
    parameters: StateVarParameters<T>,

    /// A vector that points to a copy of the values of all the dependencies
    /// of this state variable, where the values are behind untyped enums in order to have a vector.
    /// This vector will be used to determine if any dependencies have changed.
    /// It isn't actually used to calculate the state variable value,
    /// because, for efficiency, we will store values for calculations
    /// in a typed form (without enums) directly on the state variable structure.
    all_dependency_values: Vec<StateVarReadOnlyView>,
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
    ) -> Vec<DependencyInstruction>;

    /// Given the structure of the document and the dependency instructions,
    /// the actual dependencies will be determined and passed to `save_dependencies_for_value_calculation`.
    /// The function `save_dependencies_for_value_calculation` should store
    /// the dependencies directly on the the structure (`self`)
    /// in a form (presumably typed not with enums) for efficient calculation.
    fn save_dependencies_for_value_calculation(
        &mut self,
        dependencies: &Vec<Vec<Dependency>>,
    ) -> ();

    /// Calculate the value of the state variable from the current values of the dependencies
    /// that were stored in `save_dependencies_for_value_calculation`.
    /// Save the result in state_var argument that is passed in.
    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableViewTyped<T>,
    ) -> ();

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
        state_var: &StateVarReadOnlyViewTyped<T>,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, ()> {
        // The default implementation returns an Err indicating the the state variable
        // cannot be changed by requesting it be set to a value
        Err(())
    }
}

/// Parameters that influence the behavior of the state variable
/// - for_renderer: if true, the value of the state variable will always be calculated
///   and sent to the renderer
/// - initial_essential_value: TODO, but presumably the initial value of its essential value
/// - name: the name of the state variable
/// - is_public: if true, the state variable can be referenced by a macro.
///   A state variable should be public only if its type has a default component type associated with it,
///   which informs which type of component to create when it is referenced,
///   should a component need to be created.
#[derive(Debug, Default)]
pub struct StateVarParameters<T> {
    pub for_renderer: bool,
    pub initial_essential_value: T,
    pub name: &'static str,
    pub is_public: bool,
}

/// A mutable view of the value of the state variable.
/// It includes methods that allow one to view and change the variable.
#[derive(Debug)]
pub struct StateVarMutableViewTyped<T: Default + Clone> {
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
pub struct StateVarReadOnlyViewTyped<T: Default + Clone> {
    /// Structure containing the value of the variable its meta data.
    /// Since inner is in an Rc<RefCell>, it is shared with other views and could be changed by them.
    inner: Rc<RefCell<StateVarInner<T>>>,

    /// a change counter that can be compared to the change counter of inner
    /// in order to determine if the state variable has changed since last viewed
    change_counter_when_last_viewed: u32,
}

/// The value of a state variable along with its meta data
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
    pub fn get_fresh_value<'a>(&'a self) -> &'a T {
        if self.freshness != Freshness::Fresh {
            panic!("State variable is not fresh, cannot get its fresh value");
        }
        &self.value
    }

    /// Attempts to retrieve a reference to the last value (fresh or not) of the state variable.
    /// If the state variable is unresolved or merely resolved, returns None.
    pub fn try_get_last_value<'a>(&'a self) -> Option<&'a T> {
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

    /// Set the value of the state variable to `new_val`, mark it as Fresh, and increment the change counter.
    pub fn set_value(&mut self, new_val: T) {
        self.value = new_val;
        self.freshness = Freshness::Fresh;
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
    pub fn get_requested_value<'a>(&'a self) -> &'a T {
        &self.requested_value
    }

    /// Get the current value of the change counter
    pub fn get_change_counter(&self) -> u32 {
        self.change_counter
    }
}

impl<T: Default + Clone> StateVarMutableViewTyped<T> {
    /// Create a new unresolved StateVarMutableViewTyped
    pub fn new() -> Self {
        StateVarMutableViewTyped {
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

    /// Create a new fresh StateVarMutableViewTyped with supplied value
    pub fn new_with_value(val: T, used_default: bool) -> Self {
        StateVarMutableViewTyped {
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
    pub fn create_new_read_only_view(&self) -> StateVarReadOnlyViewTyped<T> {
        StateVarReadOnlyViewTyped {
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
    pub fn get_fresh_value_record_viewed<'a>(&'a mut self) -> impl Deref<Target = T> + 'a {
        let inner: Ref<'_, StateVarInner<T>> = self.inner.borrow();

        // We record the fact that the state variable was viewed
        // by recording the current value of the state variable's counter
        self.change_counter_when_last_viewed = inner.get_change_counter();

        Ref::map(inner, |v| v.get_fresh_value())
    }

    /// If the variable is fresh, get a reference to its current value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_fresh_value<'a>(&'a self) -> impl Deref<Target = T> + 'a {
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
    pub fn try_get_last_value<'a>(&'a self) -> Option<impl Deref<Target = T> + 'a> {
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

    /// Set the value of the state variable to the supplied value
    /// and mark it fresh
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
    pub fn get_requested_value<'a>(&'a self) -> impl Deref<Target = T> + 'a {
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

impl<T: Default + Clone> StateVarReadOnlyViewTyped<T> {
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
    pub fn get_fresh_value_record_viewed<'a>(&'a mut self) -> impl Deref<Target = T> + 'a {
        let inner = self.inner.borrow();
        self.change_counter_when_last_viewed = inner.get_change_counter();
        Ref::map(inner, |v| v.get_fresh_value())
    }

    /// If the variable is fresh, get a reference to its current value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_fresh_value<'a>(&'a self) -> impl Deref<Target = T> + 'a {
        Ref::map(self.inner.borrow(), |v| v.get_fresh_value())
    }

    /// Record the fact that we viewed the value.
    pub fn record_viewed(&mut self) {
        let inner = self.inner.borrow();
        self.change_counter_when_last_viewed = inner.get_change_counter();
    }

    /// Attempts to retrieve a reference to the last value (fresh or not) of the state variable.
    /// If the state variable is unresolved, returns None.
    pub fn try_get_last_value<'a>(&'a self) -> Option<impl Deref<Target = T> + 'a> {
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
    pub fn create_new_read_only_view(&self) -> StateVarReadOnlyViewTyped<T> {
        StateVarReadOnlyViewTyped {
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
    pub fn get_requested_value<'a>(&'a self) -> impl Deref<Target = T> + 'a {
        Ref::map(self.inner.borrow(), |v| v.get_requested_value())
    }
}

impl<T: Default + Clone> Default for StateVarReadOnlyViewTyped<T> {
    fn default() -> Self {
        StateVarReadOnlyViewTyped {
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

impl<T: Default + Clone> StateVarTyped<T> {
    /// Create a new state variable with the supplied interface and parameters
    pub fn new(
        interface: Box<dyn StateVarInterface<T>>,
        parameters: StateVarParameters<T>,
    ) -> Self {
        let value = StateVarMutableViewTyped::new();
        StateVarTyped {
            immutable_view_of_value: value.create_new_read_only_view(),
            value,
            interface,
            parameters,
            all_dependency_values: vec![],
        }
    }

    /// Create a new read-only view to this state variable
    pub fn create_new_read_only_view(&self) -> StateVarReadOnlyViewTyped<T> {
        StateVarReadOnlyViewTyped {
            inner: self.value.inner.clone(),
            change_counter_when_last_viewed: 0,
        }
    }

    /// If the variable is fresh, get a reference to its current value
    /// and record the fact that we viewed the value.
    ///
    /// Panics: if the state variable is not fresh.
    pub fn get_fresh_value<'a>(&'a self) -> impl Deref<Target = T> + 'a {
        Ref::map(self.value.inner.borrow(), |v| v.get_fresh_value())
    }

    /// Set the value of the state variable to the supplied value
    /// and mark it fresh
    pub fn set_value(&self, new_val: T) {
        self.value.inner.borrow_mut().set_value(new_val);
    }

    /// Set the value of the state variable to `new_val`,
    /// mark it as Fresh, and set `used_default`.
    pub fn set_value_and_used_default(&self, new_val: T, used_default: bool) {
        self.value
            .inner
            .borrow_mut()
            .set_value_and_used_default(new_val, used_default);
    }

    /// If the state variable is Stale, mark it as Fresh
    /// so that the value it had before `mark_stale` was called
    /// will be its fresh value again.
    ///
    /// Panics: if the state variable is Unresolved.
    pub fn restore_previous_value(&self) {
        self.value.inner.borrow_mut().restore_previous_value();
    }

    /// Return if the `used_default` field was set
    pub fn get_used_default(&self) -> bool {
        self.value.inner.borrow().get_used_default()
    }

    /// Set the freshness of the variable to Stale
    pub fn mark_stale(&self) {
        self.value.inner.borrow_mut().mark_stale()
    }

    /// Set the freshness of the variable to Resolved
    pub fn set_as_resolved(&self) {
        self.value.inner.borrow_mut().set_as_resolved()
    }

    /// Return the current freshness of the variable
    pub fn get_freshness(&self) -> Freshness {
        self.value.inner.borrow().freshness
    }

    /// Set the `requested_value` field to the supplied value
    pub fn request_change_value_to(&self, requested_val: T) {
        self.value
            .inner
            .borrow_mut()
            .request_change_value_to(requested_val);
    }

    /// Get a reference to the current `requested_value` field
    pub fn get_requested_value<'a>(&'a self) -> impl Deref<Target = T> + 'a {
        Ref::map(self.value.inner.borrow(), |v| v.get_requested_value())
    }

    /// Convenience function to call `return_dependency_instructions` on interface
    pub fn return_dependency_instructions(
        &self,
        extend_source: Option<&ExtendSource>,
    ) -> Vec<DependencyInstruction> {
        self.interface.return_dependency_instructions(extend_source)
    }

    /// Call `save_dependencies_for_value_calculation` on interface
    /// and save dependencies to `all_dependency_values` field
    pub fn set_dependencies(&mut self, dependencies: &Vec<Vec<Dependency>>) -> () {
        self.interface
            .save_dependencies_for_value_calculation(dependencies);
        self.all_dependency_values = dependencies
            .iter()
            .flat_map(|vec| vec.iter().map(|elt| elt.value.create_new_read_only_view()))
            .collect();
    }

    /// Convenience function to call `calculate_state_var_from_dependencies_and_mark_fresh` on interface
    pub fn calculate_state_var_from_dependencies_and_mark_fresh(&self) -> () {
        self.interface
            .calculate_state_var_from_dependencies_and_mark_fresh(&self.value)
    }

    /// Convenience function to call `request_dependencies_to_update_value` on interface
    pub fn request_dependencies_to_update_value(
        &self,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, ()> {
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

    /// Return the initial essential value of this state variable
    ///
    /// TODO: determine how this is used
    pub fn return_initial_essential_value(&self) -> T {
        self.parameters.initial_essential_value.clone()
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
        self.all_dependency_values
            .iter()
            .any(|state_var| state_var.check_if_changed_since_last_viewed())
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
#[derive(StateVarMethods)]
pub enum StateVar {
    Number(StateVarTyped<f64>),
    Integer(StateVarTyped<i64>),
    String(StateVarTyped<String>),
    Boolean(StateVarTyped<bool>),
}

/// An untyped, mutable view of the value of the state variable.
/// It includes methods that allow one to view and change the variable.
#[derive(StateVarMutableViewMethods)]
pub enum StateVarMutableView {
    Number(StateVarMutableViewTyped<f64>),
    Integer(StateVarMutableViewTyped<i64>),
    String(StateVarMutableViewTyped<String>),
    Boolean(StateVarMutableViewTyped<bool>),
}

/// An untyped, read-only view of the value of the state variable.
/// It includes methods that allow one to view the variable.
#[derive(StateVarReadOnlyViewMethods)]
pub enum StateVarReadOnlyView {
    Number(StateVarReadOnlyViewTyped<f64>),
    Integer(StateVarReadOnlyViewTyped<i64>),
    String(StateVarReadOnlyViewTyped<String>),
    Boolean(StateVarReadOnlyViewTyped<bool>),
}

/// This can contain the value of a state variable of any type,
/// which is useful for function parameters.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(untagged)]
pub enum StateVarValue {
    String(String),
    Number(f64),
    Integer(i64),
    Boolean(bool),
}

impl StateVar {
    /// If creating a component from a reference to this state variable
    /// then create a component of the given type.
    ///
    /// TODO: presumably, there should be a way to override this default.
    pub fn get_default_component_type(&self) -> &'static str {
        match self {
            StateVar::Number(_) => "number",
            StateVar::Integer(_) => "number",
            StateVar::String(_) => "text",
            StateVar::Boolean(_) => "boolean",
        }
    }
}

impl fmt::Debug for StateVar {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_freshness() {
            Freshness::Fresh => self.get_fresh_value().fmt(f),
            Freshness::Stale => f.write_str("Stale"),
            Freshness::Unresolved => f.write_str("Unresolved"),
            Freshness::Resolved => f.write_str("Resolved"),
        }
    }
}

impl fmt::Debug for StateVarMutableView {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_freshness() {
            Freshness::Fresh => self.get_fresh_value().fmt(f),
            Freshness::Stale => f.write_str("Stale"),
            Freshness::Unresolved => f.write_str("Unresolved"),
            Freshness::Resolved => f.write_str("Resolved"),
        }
    }
}

impl fmt::Debug for StateVarReadOnlyView {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_freshness() {
            Freshness::Fresh => self.get_fresh_value().fmt(f),
            Freshness::Stale => f.write_str("Stale"),
            Freshness::Unresolved => f.write_str("Unresolved"),
            Freshness::Resolved => f.write_str("Resolved"),
        }
    }
}
