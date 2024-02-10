use crate::components::prelude::*;

use super::util::{string_attr_to_boolean, string_to_boolean, BooleanOrString};

/// A boolean state variable that calculates its value from dependencies.
///
/// The current version is in a preliminary form, where the only valid options are
/// - a single boolean dependency
/// - string dependencies (that are concatenated to see if they spell out "true")
///
/// If the state variable has a single boolean dependency,
/// then it propagates the `came_from_default` attribute.
///
/// The boolean state variable can be created via the constructors:
/// - `new(data_query)`: base the value on an arbitrary data query
/// - `new_from_children(default_value)`: base the value on the component's `Boolean` and `Text` children,
///   falling back to `default_value` if there are no matching children.
/// - `new_from_attribute(attr_name, default_value)`: base the value on the component's `attr_name` attribute.
///   The calculation will use the `Boolean` and `Text` children of the attribute,
///   falling back to `default_value` if there are no matching children.
#[derive(Debug, Default)]
pub struct BooleanStateVar {
    /// The data query that indicates how the dependencies of this state variable will be created.
    data_query: DataQuery,

    default_value: bool,

    from_attribute: bool,
}

/// The values of the dependencies created from the data queries
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct RequiredData {
    /// A vector of the boolean or string values of the dependencies coming from the data_query
    booleans_and_strings: Vec<BooleanOrString>,
}
impl BooleanStateVar {
    /// Creates a boolean state var that calculates its value from the given data query.
    pub fn new(data_query: DataQuery) -> Self {
        BooleanStateVar {
            data_query,
            ..Default::default()
        }
    }

    /// Creates a boolean state var that calculates its value from the component's children
    /// matching the `String` or `Boolean` profile.
    ///
    /// If there are no matching children, the state variable will be initialized with `default_value`.
    pub fn new_from_children(default_value: bool) -> Self {
        BooleanStateVar {
            data_query: DataQuery::Child {
                match_profiles: vec![ComponentProfile::String, ComponentProfile::Boolean],
                exclude_if_prefer_profiles: vec![],
                always_return_value: true,
            },
            default_value,
            from_attribute: false,
        }
    }

    /// Creates a boolean state var that calculates its value from the attribute given by `attr_name`,
    /// basing the calculation on the attribute children that match the `String` or `Boolean` profile.
    ///
    /// If there are no matching attribute children, the state variable will be initialized with `default_value`.
    pub fn new_from_attribute(attr_name: AttributeName, default_value: bool) -> Self {
        BooleanStateVar {
            data_query: DataQuery::AttributeChild {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::String, ComponentProfile::Boolean],
                always_return_value: true,
            },
            default_value,
            from_attribute: true,
        }
    }
}

impl StateVarUpdater<bool, RequiredData> for BooleanStateVar {
    fn default_value(&self) -> bool {
        self.default_value
    }

    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            booleans_and_strings: Some(self.data_query.clone()),
        }
        .into()
    }

    #[allow(clippy::needless_return)]
    fn calculate<'a>(&self, data: &'a RequiredData) -> StateVarCalcResult<'a, bool> {
        match data.booleans_and_strings.len() {
            0 => {
                return StateVarCalcResult::Calculated(false);
            }
            1 => {
                match &data.booleans_and_strings[0] {
                    BooleanOrString::Boolean(boolean_value) => {
                        // If we are basing it on a single variable that came from default,
                        // then we propagate came_from_default as well as the value.
                        return StateVarCalcResult::From(boolean_value);
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
        data: &mut RequiredData,
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

#[cfg(test)]
#[path = "boolean_state_var.test.rs"]
mod tests;
