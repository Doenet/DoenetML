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

pub use super::PropIdx;

/// The name (snake_case) of a prop
pub type PropName = &'static str;

/// The possible values of the status of a prop.
/// - `Fresh`: the prop value has been calculated from given base variable values
/// - `Stale`: a base variable influencing this prop has changed so it must be recalculated
/// - `Unresolved`: the dependencies for this prop have not yet been created
/// - `Resolved`: the dependencies for this prop have been created,
///   but the value has not yet been calculated
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PropStatus {
    Fresh,
    Stale,
    Unresolved,
    Resolved,
}

/// `Prop<T>` is the base data structure for the value of a prop.
pub struct Prop<T: Default + Clone> {
    /// The current value of the prop
    /// in a structure that allows the value to be mutated
    /// and also holds meta data about the variable
    value: PropViewMut<T>,

    /// A reference to the same value of the prop
    /// in a structure that does not allow the value to be mutated.
    /// It is just a cached copy of the result of calling
    /// `.create_new_read_only_view()` on `.value`, saved here for efficiency.
    /// Sent to functions to give them read only access to the variable.
    immutable_view_of_value: PropView<T>,

    /// Trait object that exposes the interface used "update" a prop.
    /// That is, it specifies how the prop is calculated from its dependencies
    /// or how to modify its dependencies to give it a new requested value.
    updater: Box<dyn PropUpdaterWithCache<T>>,

    /// Value if don't have dependencies that determine the value
    default_value: T,

    /// A vector that points to a copy of the values of all the dependencies
    /// of this prop, where the values are behind enums in order to have a vector.
    /// This vector will be used to determine if any dependencies have changed.
    /// It isn't actually used to calculate the prop value,
    /// because, for efficiency, we will store values for calculations
    /// in a typed form (without enums) directly on the prop structure.
    all_data: Vec<PropViewEnum>,
}

impl<T: Default + Clone + std::fmt::Display> std::fmt::Display for Prop<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.value.fmt(f)
    }
}
impl<T: Default + Clone + std::fmt::Display> std::fmt::Debug for Prop<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.value)
    }
}

/// The value of a prop along with its meta data.
///
/// Since PropInner (via PropViewMut and PropView)
/// is also used for state data, we keep extra fields,
/// off this structure and put them only in Prop.
#[derive(Debug)]
struct PropInner<T: Default + Clone> {
    /// The value of the prop.
    /// It can be viewed by all views but changed only by mutable views.
    value: T,

    /// The current status of the prop.
    /// It is set to fresh whenever the value is set
    /// and set to stale via the mark_stale method.
    status: PropStatus,

    /// If one of the dependencies of this prop has requested that its value
    /// be changed to a particular value, it will be stored in requested_value.
    /// It can be changed even by read-only views.
    requested_value: T,

    /// True if the value was set using the variable's default value.
    /// Is typically used to lower the precedence of this prop's value
    /// when calculating another prop, as it indicates that the document author
    /// did not explicitly set the value
    came_from_default: bool,

    /// A counter that is incremented every time the value is set.
    /// Used to compare with another counter to determine if the variable has been changed
    /// since the other counter was last set.
    change_counter: u32,
}

impl<T: Default + Clone + std::fmt::Display> std::fmt::Display for PropInner<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self.status {
            PropStatus::Fresh => write!(f, "{}", self.value),
            PropStatus::Resolved => write!(f, "Resolved"),
            PropStatus::Stale => write!(f, "Stale"),
            PropStatus::Unresolved => write!(f, "Unresolved"),
        }
    }
}

impl<T: Default + Clone> PropInner<T> {
    /// Retrieves a reference to the value of the prop if the variable is fresh.
    ///
    /// Panics: if the prop is not fresh.
    pub fn get(&self) -> &T {
        if self.status != PropStatus::Fresh {
            panic!("prop is not fresh, cannot get its fresh value");
        }
        &self.value
    }

    /// Attempts to retrieve a reference to the last value (fresh or not) of the prop.
    /// If the prop is unresolved or merely resolved, returns None.
    pub fn try_get_last_value(&self) -> Option<&T> {
        match self.status {
            PropStatus::Unresolved | PropStatus::Resolved => None,
            PropStatus::Fresh | PropStatus::Stale => Some(&self.value),
        }
    }

    /// Set the status of the variable to Stale
    pub fn mark_stale(&mut self) {
        match self.status {
            PropStatus::Fresh => {
                self.status = PropStatus::Stale;
            }
            PropStatus::Stale => (),
            PropStatus::Unresolved | PropStatus::Resolved => {
                panic!("Cannot mark an unresolved or merely resolved prop as stale.");
            }
        }
    }

    /// Set the status of the variable to Resolved
    pub fn set_as_resolved(&mut self) {
        match self.status {
            PropStatus::Unresolved => {
                self.status = PropStatus::Resolved;
            }
            PropStatus::Resolved => (),
            PropStatus::Fresh | PropStatus::Stale => {
                panic!("Cannot set a fresh or stale prop to resolved.");
            }
        }
    }

    /// Set the value of the prop to `new_val`, mark it as Fresh,
    /// set `came_from_default` to `false`, and increment the change counter.
    pub fn set_value(&mut self, new_val: T) {
        self.value = new_val;
        self.status = PropStatus::Fresh;
        self.came_from_default = false;
        self.change_counter += 1;
    }

    /// Set the value of the prop to `new_val`,
    /// mark it as Fresh, set `came_from_default` to `true`, and increment the change counter.
    pub fn set_value_from_default(&mut self, new_val: T) {
        self.value = new_val;
        self.status = PropStatus::Fresh;
        self.came_from_default = true;
        self.change_counter += 1;
    }

    /// If the prop is Stale, mark it as Fresh
    /// so that the value it had before `mark_stale` was called
    /// will be its fresh value again.
    ///
    /// Panics: if the prop is Unresolved or Resolved.
    pub fn mark_fresh(&mut self) {
        match self.status {
            PropStatus::Stale => {
                self.status = PropStatus::Fresh;
            }
            PropStatus::Fresh => (),
            PropStatus::Unresolved | PropStatus::Resolved => {
                panic!("Cannot mark fresh a prop that is unresolved or merely resolved prop");
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

impl<T: Default + Clone> Prop<T> {
    /// Create a new prop with the supplied updater
    pub fn new(updater: Box<dyn PropUpdaterWithCache<T>>, default_value: T) -> Self {
        let value = PropViewMut::new();
        Prop {
            immutable_view_of_value: value.create_new_read_only_view(),
            value,
            updater,
            default_value,
            all_data: vec![],
        }
    }

    /// Create a new read-only view to this prop
    pub fn create_new_read_only_view(&self) -> PropView<T> {
        self.value.create_new_read_only_view()
    }

    /// Determine if the prop has changed
    /// since we last called `get_value_mark_viewed`.
    ///
    /// Note: calls to `get` are ignored when determining when last viewed.
    pub fn changed_since_last_viewed(&self) -> bool {
        self.value.changed_since_last_viewed()
    }

    /// If the variable is fresh, get a reference to its current value
    /// and record the fact that we viewed the value.
    ///
    /// Panics: if the prop is not fresh.
    pub fn get_value_mark_viewed(&mut self) -> impl Deref<Target = T> + '_ {
        self.value.get_value_mark_viewed()
    }

    /// If the variable is fresh, get a reference to its current value
    /// and record the fact that we viewed the value.
    ///
    /// Panics: if the prop is not fresh.
    pub fn get(&self) -> impl Deref<Target = T> + '_ {
        self.value.get()
    }

    /// Record the fact that we viewed the value.
    pub fn mark_viewed(&mut self) {
        self.value.mark_viewed()
    }

    /// Set the value of the prop to the supplied value,
    /// set `came_from_default` to `false`, and mark it fresh
    pub fn set_value(&self, new_val: T) {
        self.value.set_value(new_val)
    }

    /// Set the value of the prop to `new_val`,
    /// mark it as Fresh, and set `came_from_default` to `true`.
    pub fn set_value_from_default(&self, new_val: T) {
        self.value.set_value_from_default(new_val)
    }

    /// If the prop is Stale, mark it as Fresh
    /// so that the value it had before `mark_stale` was called
    /// will be its fresh value again.
    ///
    /// Panics: if the prop is Unresolved.
    pub fn mark_fresh(&self) {
        self.value.mark_fresh()
    }

    /// Return if the value of this prop was set from its default value
    pub fn came_from_default(&self) -> bool {
        self.value.came_from_default()
    }

    /// Set the status of the variable to Stale
    pub fn mark_stale(&self) {
        self.value.mark_stale()
    }

    /// Set the status of the variable to Resolved
    pub fn set_as_resolved(&self) {
        self.value.set_as_resolved()
    }

    /// Return the current status of the variable
    pub fn get_status(&self) -> PropStatus {
        self.value.get_status()
    }

    /// Set the `requested_value` field to the supplied value
    pub fn set_requested_value(&self, requested_val: T) {
        self.value.set_requested_value(requested_val)
    }

    /// Get a reference to the current `requested_value` field
    pub fn get_requested_value(&self) -> impl Deref<Target = T> + '_ {
        self.value.get_requested_value()
    }

    /// Convenience function to call `return_data_queries` on the updater
    pub fn return_data_queries(&mut self) -> Vec<DataQuery> {
        self.updater.return_data_queries()
    }

    /// Call `save_dependencies` on the updater
    /// and save dependencies to `all_data` field
    pub fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForDataQuery>) {
        self.updater.save_data(dependencies);
        self.all_data = dependencies
            .iter()
            .flat_map(|vec| vec.iter().map(|elt| elt.value.create_new_read_only_view()))
            .collect();
    }

    /// Call `calculate` on the updater,
    /// process the result to set the value,
    /// and then call mark_fresh
    ///
    /// Return whether or not the value changed
    pub fn calculate_and_mark_fresh(&mut self) -> bool {
        let value_changed = match self.updater.calculate_old() {
            PropCalcResult::Calculated(val) => {
                self.value.set_value(val);
                true
            }
            PropCalcResult::FromDefault(val) => {
                self.value.set_value_from_default(val);
                true
            }
            PropCalcResult::NoChange => false,
        };
        self.mark_fresh();
        value_changed
    }

    /// Convenience function to call `invert` on updater
    pub fn invert(
        &mut self,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        self.updater
            .invert(&self.immutable_view_of_value, is_direct_change_from_action)
    }

    /// Return the default value of this prop
    pub fn default(&self) -> T {
        self.default_value.clone()
    }

    /// Record that the fact each of the dependencies in `all_data` were viewed.
    /// Used to determine if any dependency changed since it was last viewed.
    pub fn mark_all_dependencies_viewed(&mut self) {
        self.all_data.iter_mut().for_each(|prop| prop.mark_viewed())
    }

    /// Check if a dependency has changed since we last called `mark_all_dependencies_viewed`.
    pub fn check_if_any_dependency_changed_since_last_viewed(&self) -> bool {
        if self.all_data.is_empty() {
            // if there are no dependencies, then report true if prop is Unresolved or Resolved,
            // as in that case, we still need to calculate the prop
            let this_status = self.get_status();
            this_status == PropStatus::Resolved || this_status == PropStatus::Unresolved
        } else {
            self.all_data
                .iter()
                .any(|prop| prop.changed_since_last_viewed())
        }
    }
}
