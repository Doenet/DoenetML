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
    extending: Option<StateVarView<String>>,
    // /// A vector of the string values of the dependencies
    base: Vec<StateVarView<String>>,
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
    pub fn new_from_children() -> Self {
        StringStateVar {
            base_data_query: DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text],
                exclude_if_prefer_profiles: vec![],
            },
            ..Default::default()
        }
    }

    /// Creates a state var that queries its value from attributes matching the `Text` profile.
    pub fn new_from_attribute(attr_name: AttributeName, default_value: String) -> Self {
        StringStateVar {
            base_data_query: DataQuery::AttributeChild {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::Text],
            },
            default_value,
            ..Default::default()
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
        }
        .into()
    }

    fn calculate(data: &StringRequiredData) -> StateVarCalcResult<String> {
        let mut strings = if let Some(extending) = data.extending.as_ref() {
            vec![extending]
        } else {
            vec![]
        };

        strings.extend(data.base.iter());

        if strings.len() == 1 {
            if strings[0].came_from_default() {
                // if we are basing it on a single variable that came from default,
                // then we propagate came_from_default as well as the value.
                return StateVarCalcResult::FromDefault(strings[0].get().clone());
            } else {
                return StateVarCalcResult::Calculated(strings[0].get().clone());
            }
        } else {
            // TODO: can we implement this without cloning the inner value?
            let value: String = strings.iter().map(|v| v.get().clone()).collect();

            StateVarCalcResult::Calculated(value)
        }
    }

    fn invert(
        data: &mut StringRequiredData,
        state_var: &StateVarView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let mut strings = if let Some(extending) = data.extending.as_mut() {
            vec![extending]
        } else {
            vec![]
        };

        strings.extend(data.base.iter_mut());

        if strings.len() != 1 {
            // TODO: implement for no dependencies where saves to essential value?
            Err(RequestDependencyUpdateError::CouldNotUpdate)
        } else {
            let requested_value = state_var.get_requested_value();

            strings[0].queue_update(requested_value.clone());

            Ok(data.queued_updates())
        }
    }
}
