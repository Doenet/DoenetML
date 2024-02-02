use crate::components::prelude::*;

use super::TextInputState;

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct RequiredData {
    essential: StateVarView<String>,
    sync_immediate_value: StateVarView<bool>,
    bind_value_to: StateVarView<String>,
    prefill: StateVarView<String>,
}

#[derive(Debug, Default)]
pub struct ImmediateValueStateVar {}

impl ImmediateValueStateVar {
    pub fn new() -> Self {
        ImmediateValueStateVar {}
    }
}

impl StateVarUpdater<String, RequiredData> for ImmediateValueStateVar {
    fn return_data_queries(
        &self,
        _extending: Option<ExtendSource>,
        _state_var_idx: StateVarIdx,
    ) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            essential: Some(DataQuery::Essential),
            sync_immediate_value: Some(TextInputState::get_sync_immediate_value_data_queries()),
            bind_value_to: Some(TextInputState::get_bind_value_to_data_queries()),
            prefill: Some(TextInputState::get_prefill_data_queries()),
        }
        .into()
    }

    fn calculate(&self, data: &RequiredData) -> StateVarCalcResult<String> {
        let immediate_value =
            if !data.bind_value_to.came_from_default() && *data.sync_immediate_value.get() {
                data.bind_value_to.get().clone()
            } else if data.essential.came_from_default() {
                data.prefill.get().clone()
            } else {
                data.essential.get().clone()
            };
        StateVarCalcResult::Calculated(immediate_value)
    }

    fn invert(
        &self,
        data: &mut RequiredData,
        state_var: &StateVarView<String>,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        let requested_value = state_var.get_requested_value();

        data.essential.queue_update(requested_value.clone());

        if !is_direct_change_from_renderer && !data.bind_value_to.came_from_default() {
            data.bind_value_to.queue_update(requested_value.clone());
        }

        Ok(data.queued_updates())
    }
}
