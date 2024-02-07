use crate::components::prelude::*;

/// A string state variable that calculates its value by concatenating all string dependencies.
///
/// If the state variable has a single dependency,
/// then it propagates the `came_from_default` attribute.
///
/// The string state variable can be created via the constructors:
/// - `new(data_query)`: base the value on an arbitrary data query
/// - `new_from_children(default_value)`: base the value on the component's `Text` children,
///   falling back to `default_value` if there are no matching children.
/// - `new_from_attribute(attr_name, default_value)`: base the value on the component's `attr_name` attribute.
///   The calculation will use the `Text` children of the attribute,
///   falling back to `default_value` if there are no matching children.
#[derive(Debug, Default)]
pub struct StringStateVar {
    /// The data query that indicates how the dependencies of this state variable will be created.
    data_query: DataQuery,

    default_value: String,
}

/// The data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct RequiredData {
    /// A vector of the string values of the dependencies coming from the data_query
    strings: Vec<StateVarView<String>>,
}

impl StringStateVar {
    /// Creates a string state var that calculates its value from the given data query.
    pub fn new(data_query: DataQuery) -> Self {
        StringStateVar {
            data_query,
            ..Default::default()
        }
    }

    /// Creates a string state var that calculates its value from the component's children
    /// matching the `Text`  profile.
    ///
    /// If there are no matching children, the state variable will be initialized with `default_value`.
    pub fn new_from_children(default_value: String) -> Self {
        StringStateVar {
            data_query: DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text],
                exclude_if_prefer_profiles: vec![],
                always_return_value: true,
            },
            default_value,
        }
    }

    /// Creates a string state var that calculates its value from the attribute given by `attr_name`,
    /// basing the calculation on the attribute children that match the `Text` profile.
    ///
    /// If there are no matching attribute children, the state variable will be initialized with `default_value`.
    pub fn new_from_attribute(attr_name: AttributeName, default_value: String) -> Self {
        StringStateVar {
            data_query: DataQuery::AttributeChild {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::Text],
                always_return_value: true,
            },
            default_value,
        }
    }
}

impl StateVarUpdater<String, RequiredData> for StringStateVar {
    fn default_value(&self) -> String {
        self.default_value.clone()
    }

    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            strings: Some(self.data_query.clone()),
        }
        .into()
    }

    fn calculate<'a>(&self, data: &'a RequiredData) -> StateVarCalcResult<'a, String> {
        match data.strings.len() {
            0 => StateVarCalcResult::Calculated(String::from("")),
            1 => {
                // if we are basing it on a single variable that came from default,
                // then we propagate came_from_default as well as the value.
                StateVarCalcResult::From(&data.strings[0])
            }
            _ => {
                // multiple string variables, so concatenate
                let mut value = String::new();
                value.extend(data.strings.iter().map(|v| v.get().clone()));

                StateVarCalcResult::Calculated(value)
            }
        }
    }

    /// If the state variable is determined by a single string variable,
    /// then request that variable take on the requested value for this variable.
    fn invert(
        &self,
        data: &mut RequiredData,
        state_var: &StateVarView<String>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        match data.strings.len() {
            1 => {
                // based on a single string value, so we can invert
                let requested_value = state_var.get_requested_value();

                data.strings[0].queue_update(requested_value.clone());

                Ok(data.queued_updates())
            }
            _ => Err(InvertError::CouldNotUpdate),
        }
    }
}

#[cfg(test)]
#[path = "string_state_var.test.rs"]
mod tests;
