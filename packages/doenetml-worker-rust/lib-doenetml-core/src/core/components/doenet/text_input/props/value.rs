use crate::components::prelude::*;

use super::TextInputState;

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData {
    preliminary_value: PropView<String>,
    immediate_value: PropView<String>,
    sync_immediate_value: PropView<bool>,
    value_from_children: PropView<String>,
    prefill: PropView<String>,
}

#[derive(Debug, Default)]
pub struct ValueProp {}

impl ValueProp {
    pub fn new() -> Self {
        ValueProp {}
    }
}

impl PropUpdater<String, RequiredData> for ValueProp {
    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            preliminary_value: Some(DataQuery::PreliminaryValue),
            immediate_value: Some(TextInputState::get_immediate_value_data_queries()),
            sync_immediate_value: Some(TextInputState::get_sync_immediate_value_data_queries()),
            value_from_children: Some(TextInputState::get_value_from_children_data_queries()),
            prefill: Some(TextInputState::get_prefill_data_queries()),
        }
        .into()
    }

    fn calculate<'a>(&self, data: &'a RequiredData) -> PropCalcResult<'a, String> {
        let value = if *data.sync_immediate_value.get() {
            data.immediate_value.get().clone()
        } else if data.value_from_children.came_from_default() {
            if data.preliminary_value.came_from_default() {
                data.prefill.get().clone()
            } else {
                data.preliminary_value.get().clone()
            }
        } else {
            data.value_from_children.get().clone()
        };

        PropCalcResult::Calculated(value)
    }

    fn invert(
        &self,
        data: &mut RequiredData,
        prop: &PropView<String>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        let requested_value = prop.get_requested_value();

        if data.value_from_children.came_from_default() {
            data.preliminary_value.queue_update(requested_value.clone());
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
