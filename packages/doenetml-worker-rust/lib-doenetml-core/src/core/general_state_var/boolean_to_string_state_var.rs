use crate::components::prelude::*;

use super::util::string_to_boolean;

/// A string state variable converts a boolean into a string
///
/// Constructor:
/// - `new(boolean_state_var_idx)`: create a state variable converts
///   the boolean variable with the index `boolean_state_var_idx`.
#[derive(Debug, Default)]
pub struct BooleanToStringStateVar {
    boolean_state_var_idx: StateVarIdx,
}

/// The data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct RequiredData {
    boolean: StateVarView<bool>,
}

impl BooleanToStringStateVar {
    /// Creates a string state var by converting the boolean state variable of `boolean_state_var_idx`
    pub fn new(boolean_state_var_idx: StateVarIdx) -> Self {
        BooleanToStringStateVar {
            boolean_state_var_idx,
        }
    }
}

impl StateVarUpdater<String, RequiredData> for BooleanToStringStateVar {
    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            boolean: Some(DataQuery::StateVar {
                component_idx: None,
                state_var_idx: self.boolean_state_var_idx,
            }),
        }
        .into()
    }

    fn calculate<'a>(&self, data: &'a RequiredData) -> StateVarCalcResult<'a, String> {
        StateVarCalcResult::Calculated(data.boolean.get().to_string())
    }

    /// Convert the requested string value to boolean when inverting
    fn invert(
        &self,
        data: &mut RequiredData,
        state_var: &StateVarView<String>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        let requested_boolean = string_to_boolean(&state_var.get_requested_value());

        data.boolean.queue_update(requested_boolean);

        Ok(data.queued_updates())
    }
}

#[cfg(test)]
#[path = "boolean_to_string_state_var.test.rs"]
mod tests;
