use crate::components::prelude::*;

use super::TextInputState;

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct RequiredData {
    essential: StateVarView<String>,
    immediate_value: StateVarView<String>,
    sync_immediate_value: StateVarView<bool>,
    value_from_children: StateVarView<String>,
    prefill: StateVarView<String>,
}

#[derive(Debug, Default)]
pub struct ValueStateVar {}

impl ValueStateVar {
    pub fn new() -> Self {
        ValueStateVar {}
    }
}

impl StateVarUpdater<String, RequiredData> for ValueStateVar {
    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            essential: Some(DataQuery::PreliminaryValue),
            immediate_value: Some(TextInputState::get_immediate_value_data_queries()),
            sync_immediate_value: Some(TextInputState::get_sync_immediate_value_data_queries()),
            value_from_children: Some(TextInputState::get_value_from_children_data_queries()),
            prefill: Some(TextInputState::get_prefill_data_queries()),
        }
        .into()
    }

    fn calculate(&self, data: &RequiredData) -> StateVarCalcResult<String> {
        let value = if *data.sync_immediate_value.get() {
            data.immediate_value.get().clone()
        } else if data.value_from_children.came_from_default() {
            if data.essential.came_from_default() {
                data.prefill.get().clone()
            } else {
                data.essential.get().clone()
            }
        } else {
            data.value_from_children.get().clone()
        };

        StateVarCalcResult::Calculated(value)
    }

    fn invert(
        &self,
        data: &mut RequiredData,
        state_var: &StateVarView<String>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        let requested_value = state_var.get_requested_value();

        if data.value_from_children.came_from_default() {
            data.essential.queue_update(requested_value.clone());
            data.immediate_value.queue_update(requested_value.clone());
            data.sync_immediate_value.queue_update(true);
        } else {
            data.value_from_children
                .queue_update(requested_value.clone());
            data.sync_immediate_value.queue_update(true);
        }

        Ok(data.queued_updates())
    }
}
