use crate::components::prelude::*;

use super::TextInputState;

/// A struct of all data required to compute the value of this prop.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData {
    /// An independent state variable (that doesn't have any dependencies)
    /// that stores `immediate_value` when it isn't synced with `value_from_children`
    independent_state: PropView<String>,

    /// Ths `sync_value_to_immediate_value` prop from this `text_input`.
    /// If `true`, then `value` is synchronized to `immediate_value`.
    sync_value_to_immediate_value: PropView<bool>,

    /// The value coming from any children of the `text_input`.
    value_from_children: PropView<String>,

    /// The value coming from any `prefill` attribute that was specified on the `text_input`
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
    fn return_data_queries(&self) -> Vec<DataQuery> {
        RequiredDataQueries {
            independent_state: DataQuery::State,
            sync_value_to_immediate_value:
                TextInputState::get_sync_value_to_immediate_value_data_query(),
            value_from_children: TextInputState::get_value_from_children_data_query(),
            prefill: TextInputState::get_prefill_data_query(),
        }
        .into()
    }

    fn calculate_old(&mut self, data: &RequiredData) -> PropCalcResult<String> {
        // for simplicity, we don't work out scenarios where immediate_value didn't change,
        // as it typically does change if one of its dependencies changed
        let immediate_value = if !data.value_from_children.came_from_default()
            && *data.sync_value_to_immediate_value.get()
        {
            // The value prop is synchronized with the immediate_value prop,
            // which happens when invert is called on the value prop,
            // (which happens, for example, when the user presses enter in text input or it loses focus).
            // Moreover, since there is a non-default value coming from the children,
            // this means the value prop is calculating its value from the children.
            // The immediate_value prop must therefore also calculate its value from the children.
            data.value_from_children.get().clone()
        } else if data.independent_state.came_from_default() {
            // If the independent_state variable hasn't been changed from its default,
            // and we're not synchronized to value_from_children,
            // then we set immediate_value from prefill.
            // This is the initial situation before any interactions involving the text input have occurred.
            data.prefill.get().clone()
        } else {
            // Since the independent_state is no longer at its default,
            // some interactions with the text input have occurred and the immediate_value prop
            // is now tracking its independent_state variable whenever not synchronized to value_from_children.
            // This is the situation once interactions with the text input have begun.
            data.independent_state.get().clone()
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

        // We always record any requested update to immediate_value on its independent_state variable,
        // as immediate_value typically tracks its independent_state variable
        data.independent_state.queue_update(requested_value.clone());

        if is_direct_change_from_action {
            // Since this is a direct change from an action,
            // it means that a user typed into the text input.
            // In this case, the immediate_value prop should diverge from the value prop,
            // so we set sync_value_to_immediate_value to false
            data.sync_value_to_immediate_value.queue_update(false);
        } else if !data.value_from_children.came_from_default()
            && *data.sync_value_to_immediate_value.get()
        {
            // The value of the text input is being calculated from its children,
            // but this invert() function is being called for a reason
            // other than a user typing into the text input.
            // (This means that immediate_value is being changed due to another component extending from it.)
            // Since we are in this situation and sync_value_to_immediate_value is true,
            // we change value_from_children so that immediate_value is changed.
            data.value_from_children
                .queue_update(requested_value.clone());
        }

        Ok(data.queued_updates())
    }
}
