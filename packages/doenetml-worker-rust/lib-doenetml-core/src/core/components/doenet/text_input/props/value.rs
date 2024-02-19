use crate::components::prelude::*;

use super::TextInputState;

/// A struct of all data required to compute the value of this prop.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData {
    /// An independent state variable (that doesn't have any dependencies)
    /// that stores `value` when it isn't synced with 'immediate_value`
    /// or being determined by `value_from_children`.
    independent_state: PropView<String>,

    /// The `immediate_value` prop of this `text_input`.
    immediate_value: PropView<String>,

    /// Ths `sync_value_to_immediate_value` prop from this `text_input`.
    /// If `true`, then `value` is synchronized to `immediate_value`.
    sync_value_to_immediate_value: PropView<bool>,

    /// The value coming from any children of the `text_input`.
    value_from_children: PropView<String>,

    /// The value coming from any `prefill` attribute that was specified on the `text_input`
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
    fn return_data_queries(&self) -> Vec<DataQuery> {
        RequiredDataQueries {
            independent_state: DataQuery::State,
            immediate_value: TextInputState::get_immediate_value_data_query(),
            sync_value_to_immediate_value:
                TextInputState::get_sync_value_to_immediate_value_data_query(),
            value_from_children: TextInputState::get_value_from_children_data_query(),
            prefill: TextInputState::get_prefill_data_query(),
        }
        .into()
    }

    fn calculate(&mut self, data: &RequiredData) -> PropCalcResult<String> {
        // For the value calculation of `textInput`, we work out scenarios where the value didn't change
        // because this calculate() function will get called whenever immediate_value is changed
        // even though that often does not influence value.

        if !data.value_from_children.came_from_default() {
            // The text input has children, so the value prop is locked to be the value of those children.
            return if data.value_from_children.changed_since_last_viewed() {
                PropCalcResult::Calculated(data.value_from_children.get().clone())
            } else {
                PropCalcResult::NoChange
            };
        }

        // Given that the text input does not have any children, value will be determined by
        // - immediate_value if value is synced to immediate_value, else
        // - prefill if no interactions with the text input have occurred yet, else
        // - value's independent state variable in all other cases

        // In each of these cases,
        // if sync_value_to_immediate_value did not change
        // and the other prop affecting the value did not change,
        // we'll report that value does not change.

        // TODO: this algorithm is not properly returning NoChange when a user is typing in the textInput
        // because sync_value_to_immediate_value_changed ends up being true
        // even though sync_value_to_immediate_value is staying at false.
        // Since the invert() of immediate_value keeps setting sync_value_to_immediate_value to false,
        // and we don't yet have a mechanism to check if the value actually changed,
        // changed_since_last_viewed() returns true.
        // To improve efficiency, we could check for changes on types like bool where the check is fast.

        let sync_value_to_immediate_value_changed = data
            .sync_value_to_immediate_value
            .changed_since_last_viewed();

        if *data.sync_value_to_immediate_value.get() {
            // If sync_value_to_immediate_value is true, then the value prop copies immediate_value.

            // When a user presses enter or the text input loses focus,
            // then value and immediate value are supposed to be the same,
            // and sync_value_to_immediate_value will be set to true in invert(), below.

            // Other changes to value via invert(),
            // such as a change induced by another component that is extending the value prop,
            // will also set sync_value_to_immediate_value to true.

            if sync_value_to_immediate_value_changed
                || data.immediate_value.changed_since_last_viewed()
            {
                PropCalcResult::Calculated(data.immediate_value.get().clone())
            } else {
                PropCalcResult::NoChange
            }
        } else if data.independent_state.came_from_default() {
            // No interactions have occurred yet, so value is determined by prefill.
            if sync_value_to_immediate_value_changed || data.prefill.changed_since_last_viewed() {
                PropCalcResult::Calculated(data.prefill.get().clone())
            } else {
                PropCalcResult::NoChange
            }
        } else {
            // We are in the typical state when a user is interacting with the text input
            // that has no children.
            // The value state variable stays at the value stored in independent state
            // until the user presses enter or the text input loses focus,
            // at which point invert() below will be called,
            // and sync_value_to_immediate_value will be set to true.

            if sync_value_to_immediate_value_changed
                || data.independent_state.changed_since_last_viewed()
            {
                PropCalcResult::Calculated(data.independent_state.get().clone())
            } else {
                PropCalcResult::NoChange
            }
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
            data.independent_state.queue_update(requested_value.clone());
            data.immediate_value.queue_update(requested_value.clone());
        } else {
            data.value_from_children
                .queue_update(requested_value.clone());
        }
        data.sync_value_to_immediate_value.queue_update(true);

        Ok(data.queued_updates())
    }
}
