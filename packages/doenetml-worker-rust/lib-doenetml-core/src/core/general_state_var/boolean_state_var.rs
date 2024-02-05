#[cfg(test)]
#[path = "boolean_state_var.test.rs"]
mod tests;

use enum_dispatch::enum_dispatch;

use crate::components::prelude::*;

use super::util::{string_attr_to_boolean, string_to_boolean};

/// A boolean state variable interface for calculating the value of a boolean variable from dependencies.
///
/// The current version is in a preliminary form, where the only valid options are
/// - a single boolean dependency
/// - string dependencies (that are concatenated to see if they spell out "true")
///
/// If the component has an extend source so that this variable is shadowing another variable,
/// then prepend the shadowed state variable to the list of dependencies.
///
/// If the state variable has a single boolean dependency that is an essential state variable,
/// then propagate the `came_from_default` attribute of the essential state variable.
#[derive(Debug, Default)]
pub struct BooleanStateVar {
    /// The base data query that indicates how the dependencies of this state variable will be created.
    base_data_query: DataQuery,

    default_value: bool,

    from_attribute: bool,
}

/// The values of the dependencies created from the data queries
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct BooleanRequiredData {
    /// A vector of the boolean or string values of the dependencies coming from the base_data_query
    booleans_and_strings: Vec<BooleanOrString>,
}

/// Since the state variable is based on booleans or strings,
/// the `BooleanOrString` enum is used to store
/// the values of dependencies created.
#[derive(Debug)]
#[enum_dispatch(QueryUpdateRequests)]
enum BooleanOrString {
    Boolean(StateVarView<bool>),
    String(StateVarView<String>),
}

// We implement TryFromState
// because all RequiredData must implement this trait.
// (Needed to create the RequiredData from the information sent the state variable)
impl TryFromState<StateVarViewEnum> for BooleanOrString {
    type Error = &'static str;

    fn try_from_state(value: &StateVarViewEnum) -> Result<Self, Self::Error> {
        match value {
            StateVarViewEnum::Boolean(boolean_sv) => Ok(BooleanOrString::Boolean(
                boolean_sv.create_new_read_only_view(),
            )),
            StateVarViewEnum::String(string_sv) => Ok(BooleanOrString::String(
                string_sv.create_new_read_only_view(),
            )),
            _ => Err("BooleanOrString can only be a boolean or string state variable"),
        }
    }
}

impl BooleanStateVar {
    /// Creates a state var that queries its value from the given data query.
    pub fn new(base_data_query: DataQuery) -> Self {
        BooleanStateVar {
            base_data_query,
            ..Default::default()
        }
    }

    /// Creates a state var that queries its value from children matching the `Text` or `Boolean` profile.
    pub fn new_from_children(default_value: bool) -> Self {
        BooleanStateVar {
            base_data_query: DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                exclude_if_prefer_profiles: vec![],
                always_return_value: true,
            },
            default_value,
            from_attribute: false,
        }
    }

    /// Creates a state var that queries its value from attr given by `attr_name`,
    /// returning the attribute children that match the `Text` or `Boolean` profile.
    pub fn new_from_attribute(attr_name: AttributeName, default_value: bool) -> Self {
        BooleanStateVar {
            base_data_query: DataQuery::AttributeChild {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                always_return_value: true,
            },
            default_value,
            from_attribute: true,
        }
    }
}

impl StateVarUpdater<bool, BooleanRequiredData> for BooleanStateVar {
    fn default_value(&self) -> bool {
        self.default_value
    }

    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        BooleanRequiredDataQueries {
            booleans_and_strings: Some(self.base_data_query.clone()),
        }
        .into()
    }

    #[allow(clippy::needless_return)]
    fn calculate(&self, data: &BooleanRequiredData) -> StateVarCalcResult<bool> {
        match data.booleans_and_strings.len() {
            0 => {
                return StateVarCalcResult::Calculated(false);
            }
            1 => {
                match &data.booleans_and_strings[0] {
                    BooleanOrString::Boolean(boolean_value) => {
                        if boolean_value.came_from_default() {
                            // If we are basing it on a single variable that came from default,
                            // then we propagate came_from_default as well as the value.
                            return StateVarCalcResult::FromDefault(*boolean_value.get());
                        } else {
                            return StateVarCalcResult::Calculated(*boolean_value.get());
                        }
                    }
                    BooleanOrString::String(string_value) => {
                        return StateVarCalcResult::Calculated(if self.from_attribute {
                            string_attr_to_boolean(&string_value.get())
                        } else {
                            string_to_boolean(&string_value.get())
                        });
                    }
                }
            }
            _ => {
                if data
                    .booleans_and_strings
                    .iter()
                    .any(|dep_value| matches!(dep_value, BooleanOrString::Boolean(_)))
                {
                    // invalid combination. Haven't implemented boolean dependency with others
                    return StateVarCalcResult::Calculated(false);
                } else {
                    // Have multiple string variables. Concatenate the string values into a single string

                    let mut value = String::new();
                    value.extend(data.booleans_and_strings.iter().map(|v| match v {
                        BooleanOrString::Boolean(boolean_val) => boolean_val.get().to_string(),
                        BooleanOrString::String(string_value) => string_value.get().to_string(),
                    }));

                    return StateVarCalcResult::Calculated(if self.from_attribute {
                        string_attr_to_boolean(&value)
                    } else {
                        string_to_boolean(&value)
                    });
                }
            }
        }
    }

    #[allow(clippy::needless_return)]
    fn invert(
        &self,
        data: &mut BooleanRequiredData,
        state_var: &StateVarView<bool>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        match data.booleans_and_strings.len() {
            1 => {
                // based on a single value, so we can invert
                let requested_value = *state_var.get_requested_value();
                match &mut data.booleans_and_strings[0] {
                    BooleanOrString::Boolean(boolean_value) => {
                        boolean_value.queue_update(requested_value);
                    }
                    BooleanOrString::String(string_value) => {
                        string_value.queue_update(requested_value.to_string());
                    }
                }

                Ok(data.queued_updates())
            }
            _ => Err(InvertError::CouldNotUpdate),
        }
    }
}
