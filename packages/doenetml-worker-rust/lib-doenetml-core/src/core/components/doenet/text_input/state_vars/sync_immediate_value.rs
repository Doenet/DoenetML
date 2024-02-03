use crate::components::prelude::*;

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct RequiredData {
    essential: StateVarView<bool>,
}

#[derive(Debug, Default)]
pub struct SyncImmediateValueStateVar {}

impl SyncImmediateValueStateVar {
    pub fn new() -> Self {
        SyncImmediateValueStateVar {}
    }
}

impl StateVarUpdater<bool, RequiredData> for SyncImmediateValueStateVar {
    fn default_value(&self) -> bool {
        true
    }

    fn return_data_queries(
        &self,
        _extending: Option<ExtendSource>,
        _state_var_idx: StateVarIdx,
    ) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            essential: Some(DataQuery::Essential),
        }
        .into()
    }

    fn calculate(&self, data: &RequiredData) -> StateVarCalcResult<bool> {
        StateVarCalcResult::Calculated(*data.essential.get())
    }

    fn invert(
        &self,
        data: &mut RequiredData,
        state_var: &StateVarView<bool>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        let requested_value = state_var.get_requested_value();

        data.essential.queue_update(*requested_value);

        Ok(data.queued_updates())
    }
}
