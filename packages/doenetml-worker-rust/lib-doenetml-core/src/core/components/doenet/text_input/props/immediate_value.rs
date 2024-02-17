use crate::components::prelude::*;

use super::TextInputState;

/// A struct of all data required to compute the value of this prop.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData {
    preliminary_value: PropView<String>,
    sync_immediate_value: PropView<bool>,
    value_from_children: PropView<String>,
    prefill: PropView<String>,
}

#[derive(Debug, Default)]
pub struct ImmediateValueProp {}

impl ImmediateValueProp {
    pub fn new() -> Self {
        ImmediateValueProp {}
    }
}

impl PropUpdater<String, RequiredData> for ImmediateValueProp {
    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            preliminary_value: Some(DataQuery::PreliminaryValue),
            sync_immediate_value: Some(TextInputState::get_sync_immediate_value_data_query()),
            value_from_children: Some(TextInputState::get_value_from_children_data_query()),
            prefill: Some(TextInputState::get_prefill_data_query()),
        }
        .into()
    }

    fn calculate(&mut self, data: &mut RequiredData) -> PropCalcResult<String> {
        // for simplicity, we don't work out scenarios where immediate_value didn't change,
        // as it typically does change if one of its dependencies changed
        let immediate_value =
            if !data.value_from_children.came_from_default() && *data.sync_immediate_value.get() {
                data.value_from_children.get().clone()
            } else if data.preliminary_value.came_from_default() {
                data.prefill.get().clone()
            } else {
                data.preliminary_value.get().clone()
            };
        PropCalcResult::Calculated(immediate_value)
    }

    fn invert(
        &self,
        data: &mut RequiredData,
        prop: &PropView<String>,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        let requested_value = prop.get_requested_value();

        data.preliminary_value.queue_update(requested_value.clone());

        if !is_direct_change_from_action && !data.value_from_children.came_from_default() {
            data.value_from_children
                .queue_update(requested_value.clone());
        }

        Ok(data.queued_updates())
    }
}
