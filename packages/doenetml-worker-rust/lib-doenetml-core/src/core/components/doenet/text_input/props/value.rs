use crate::components::prelude::*;

use super::TextInputState;

/// A struct of all data required to compute the value of this prop.
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
            preliminary_value: Some(DataQuery::State),
            immediate_value: Some(TextInputState::get_immediate_value_data_query()),
            sync_immediate_value: Some(TextInputState::get_sync_immediate_value_data_query()),
            value_from_children: Some(TextInputState::get_value_from_children_data_query()),
            prefill: Some(TextInputState::get_prefill_data_query()),
        }
        .into()
    }

    fn calculate(&mut self, data: &RequiredData) -> PropCalcResult<String> {
        // for the value calculation of `textInput`, we work out scenarios where the value didn't change
        // because calculate will get called whenever immediate_value is changed
        // even though that often does not influence value

        let sync_immediate_value_changed = data.sync_immediate_value.changed_since_last_viewed();
        if *data.sync_immediate_value.get() {
            PropCalcResult::Calculated(data.immediate_value.get().clone())
        } else if data.value_from_children.came_from_default() {
            if data.preliminary_value.came_from_default() {
                if sync_immediate_value_changed || data.prefill.changed_since_last_viewed() {
                    PropCalcResult::Calculated(data.prefill.get().clone())
                } else {
                    PropCalcResult::NoChange
                }
            } else if sync_immediate_value_changed
                || data.preliminary_value.changed_since_last_viewed()
            {
                PropCalcResult::Calculated(data.preliminary_value.get().clone())
            } else {
                PropCalcResult::NoChange
            }
        } else if sync_immediate_value_changed
            || data.value_from_children.changed_since_last_viewed()
        {
            PropCalcResult::Calculated(data.value_from_children.get().clone())
        } else {
            PropCalcResult::NoChange
        }
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
        } else {
            data.value_from_children
                .queue_update(requested_value.clone());
        }
        data.sync_immediate_value.queue_update(true);

        Ok(data.queued_updates())
    }
}
