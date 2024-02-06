mod conversion;
mod enums;
mod updater;
mod views;

use std::ops::Deref;

pub use conversion::*;
pub use enums::*;
pub use updater::*;
pub use views::*;

use crate::components::prelude::{
    DataQuery, DependenciesCreatedForDataQuery, DependencyValueUpdateRequest,
};

pub use super::StateVarIdx;

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
    updater: Box<dyn StateVarUpdaterWithCache<T>>,

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
    /// set `came_from_default` to `false`, and increment the change counter.
    pub fn set_value(&mut self, new_val: T) {
        self.value = new_val;
        self.freshness = Freshness::Fresh;
        self.came_from_default = false;
        self.change_counter += 1;
    }

    /// Set the value of the state variable to `new_val`,
    /// mark it as Fresh, set `came_from_default` to `true`, and increment the change counter.
    pub fn set_value_from_default(&mut self, new_val: T) {
        self.value = new_val;
        self.freshness = Freshness::Fresh;
        self.came_from_default = true;
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

impl<T: Default + Clone> StateVar<T> {
    /// Create a new state variable with the supplied interface
    pub fn new(updater: Box<dyn StateVarUpdaterWithCache<T>>, default_value: T) -> Self {
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
    /// set `came_from_default` to `false`, and mark it fresh
    pub fn set_value(&self, new_val: T) {
        self.value.set_value(new_val)
    }

    /// Set the value of the state variable to `new_val`,
    /// mark it as Fresh, and set `came_from_default` to `true`.
    pub fn set_value_from_default(&self, new_val: T) {
        self.value.set_value_from_default(new_val)
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
    pub fn return_data_queries(&mut self) -> Vec<DataQuery> {
        self.updater.return_data_queries()
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
            StateVarCalcResult::FromDefault(val) => self.value.set_value_from_default(val),
            StateVarCalcResult::From(state_var_view) => {
                if state_var_view.came_from_default() {
                    self.value
                        .set_value_from_default(state_var_view.get().clone())
                } else {
                    self.value.set_value(state_var_view.get().clone())
                }
            }
        };
        self.mark_fresh();
    }

    /// Convenience function to call `invert` on interface
    pub fn invert(
        &mut self,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        self.updater
            .invert(&self.immutable_view_of_value, is_direct_change_from_action)
    }

    /// Return the default value of this state variable
    pub fn default(&self) -> T {
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
