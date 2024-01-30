use crate::components::prelude::*;

use super::TextInputState;

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
struct RequiredData {
    essential: StateVarView<String>,
    immediate_value: StateVarView<String>,
    sync_immediate_value: StateVarView<bool>,
    bind_value_to: StateVarView<String>,
    prefill: StateVarView<String>,
}

#[derive(Debug, Default)]
pub struct ValueStateVar {
    /// The data queries that indicate how the dependencies of this state variable will be created.
    data_queries: RequiredDataDataQueries,

    /// The values of the dependencies created from the data queries
    data: RequiredData,
}

impl ValueStateVar {
    pub fn new() -> Self {
        ValueStateVar {
            ..Default::default()
        }
    }
}

impl From<ValueStateVar> for StateVar<String> {
    fn from(updater: ValueStateVar) -> Self {
        StateVar::new(Box::new(updater), Default::default())
    }
}

impl StateVarUpdater<String> for ValueStateVar {
    fn return_data_queries(
        &mut self,
        _extending: Option<ExtendSource>,
        _state_var_idx: StateVarIdx,
    ) -> Vec<DataQuery> {
        self.data_queries = RequiredDataDataQueries {
            essential: Some(DataQuery::Essential),
            immediate_value: Some(TextInputState::get_immediate_value_data_queries()),
            sync_immediate_value: Some(TextInputState::get_sync_immediate_value_data_queries()),
            bind_value_to: Some(TextInputState::get_bind_value_to_data_queries()),
            prefill: Some(TextInputState::get_prefill_data_queries()),
        };

        (&self.data_queries).into()
    }

    fn save_data(&mut self, dependencies: &Vec<DependenciesCreatedForDataQuery>) {
        self.data = dependencies.try_into().unwrap();
    }

    fn calculate(&self) -> StateVarCalcResult<String> {
        let value = if *self.data.sync_immediate_value.get() {
            self.data.immediate_value.get().clone()
        } else if self.data.bind_value_to.came_from_default() {
            if self.data.essential.came_from_default() {
                self.data.prefill.get().clone()
            } else {
                self.data.essential.get().clone()
            }
        } else {
            self.data.bind_value_to.get().clone()
        };

        StateVarCalcResult::Calculated(value)
    }

    fn invert(
        &mut self,
        state_var: &StateVarView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let requested_value = state_var.get_requested_value();

        let data = &mut self.data;

        let bind_value_to_came_from_default = data.bind_value_to.came_from_default();

        if bind_value_to_came_from_default {
            data.essential.queue_update(requested_value.clone());
            data.immediate_value.queue_update(requested_value.clone());
            data.sync_immediate_value.queue_update(true);
        } else {
            data.bind_value_to.queue_update(requested_value.clone());
            data.sync_immediate_value.queue_update(true);
        }

        Ok(data.return_queued_updates())
    }
}
