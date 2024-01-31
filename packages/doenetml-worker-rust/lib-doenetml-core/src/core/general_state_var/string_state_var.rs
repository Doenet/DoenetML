use crate::{components::prelude::*, ExtendSource};

use super::util::create_data_query_if_match_extend_source;

/// A string state variable interface that concatenates all string dependencies.
///
/// If the component has an extend source so that this variable is shadowing another variable,
/// then prepend the shadowed state variable to the list of dependencies.
///
/// If the state variable has a single dependency that is an essential state variable,
/// then propagate the `came_from_default` attribute of the essential state variable.
#[derive(Debug, Default)]
pub struct StringStateVar {
    /// The base data query that indicates how the dependencies of this state variable will be created.
    base_data_query: DataQuery,

    default_value: String,
}

/// The data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct StringRequiredData {
    /// If this state variable is extending another state variable,
    /// the value that is being extended
    extending: Option<StateVarView<String>>,

    /// A vector of the string values of the dependencies coming from the base_data_query
    base: Vec<StateVarView<String>>,

    /// If not extending and don't have any base data,
    /// then use this essential value, which will be initialized with the default value
    essential: StateVarView<String>,
}

impl StringStateVar {
    /// Creates a state var that queries its value from the given data query.
    pub fn new(base_data_query: DataQuery) -> Self {
        StringStateVar {
            base_data_query,
            ..Default::default()
        }
    }

    /// Creates a state var that queries its value from children matching the `Text` profile.
    pub fn new_from_children(default_value: String) -> Self {
        StringStateVar {
            base_data_query: DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text],
                exclude_if_prefer_profiles: vec![],
            },
            default_value,
        }
    }

    /// Creates a state var that queries its value from attr given by `attr_name`,
    /// returning the attribute children that match the `Text` profile.
    pub fn new_from_attribute(attr_name: AttributeName, default_value: String) -> Self {
        StringStateVar {
            base_data_query: DataQuery::AttributeChild {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::Text],
            },
            default_value,
        }
    }
}

impl StateVarUpdater<String, StringRequiredData> for StringStateVar {
    fn default_value(&self) -> String {
        self.default_value.clone()
    }

    fn return_data_queries(
        &self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<Option<DataQuery>> {
        StringRequiredDataQueries {
            extending: create_data_query_if_match_extend_source(extending, state_var_idx),
            base: Some(self.base_data_query.clone()),
            essential: Some(DataQuery::Essential),
        }
        .into()
    }

    fn calculate(data: &StringRequiredData) -> StateVarCalcResult<String> {
        // concatenate the strings from extending and the base data query
        let mut strings = if let Some(extending) = data.extending.as_ref() {
            vec![extending]
        } else {
            vec![]
        };

        strings.extend(data.base.iter());

        match strings.len() {
            0 => {
                // not extending and have no base dependencies, so use the essential value,
                // propagating came_from_default as well as the value
                if data.essential.came_from_default() {
                    return StateVarCalcResult::FromDefault(data.essential.get().clone());
                } else {
                    return StateVarCalcResult::Calculated(data.essential.get().clone());
                }
            }
            1 => {
                if strings[0].came_from_default() {
                    // if we are basing it on a single variable that came from default,
                    // then we propagate came_from_default as well as the value.
                    return StateVarCalcResult::FromDefault(strings[0].get().clone());
                } else {
                    return StateVarCalcResult::Calculated(strings[0].get().clone());
                }
            }
            _ => {
                // multiple string variables, so concatenate
                let mut value = String::new();
                value.extend(strings.iter().map(|v| v.get().clone()));

                StateVarCalcResult::Calculated(value)
            }
        }
    }

    /// If the state variable is determined by a single string variable or an essential variable,
    /// then request that variable take on the requested value for this variable.
    fn invert(
        data: &mut StringRequiredData,
        state_var: &StateVarView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        // concatenate the strings from extending and the base data query
        let mut strings = if let Some(extending) = data.extending.as_mut() {
            vec![extending]
        } else {
            vec![]
        };

        strings.extend(data.base.iter_mut());

        match strings.len() {
            0 => {
                // Not extending and have no base dependencies, so set the essential value.
                data.essential
                    .queue_update(state_var.get_requested_value().clone());
                Ok(data.queued_updates())
            }
            1 => {
                // based on a single string value, so we can invert
                let requested_value = state_var.get_requested_value();

                strings[0].queue_update(requested_value.clone());

                Ok(data.queued_updates())
            }
            _ => Err(RequestDependencyUpdateError::CouldNotUpdate),
        }
    }
}
