use super::super::*;
use crate::components::{doenet::text_input::TextInputProps, prelude::*};

#[derive(Debug, Default)]
pub struct ImmediateValueProp {}

impl ImmediateValueProp {
    pub fn new() -> Self {
        ImmediateValueProp {}
    }
}

/// Structure to hold data generated from the data queries
#[derive(TryFromDataQueryResults, IntoDataQueryResults)]
#[data_query(query_trait = DataQueries)]
#[derive(TestDataQueryTypes)]
#[owning_component(TextInput)]
struct RequiredData {
    /// An independent state variable (that doesn't have any dependencies)
    /// that stores `immediate_value` when it isn't synced with `value_from_children`
    independent_state: PropView<prop_type::String>,

    /// Ths `sync_value_to_immediate_value` prop from this `text_input`.
    /// If `true`, then `value` is synchronized to `immediate_value`.
    sync_value_to_immediate_value: PropView<prop_type::Boolean>,

    /// The value coming from any children of the `text_input`.
    value_from_children: PropView<prop_type::String>,

    /// The value coming from any `prefill` attribute that was specified on the `text_input`
    prefill: PropView<prop_type::String>,
}

impl DataQueries for RequiredData {
    fn independent_state_query() -> DataQuery {
        DataQuery::State
    }

    fn sync_value_to_immediate_value_query() -> DataQuery {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: TextInputProps::SyncValueToImmediateValue.local_idx().into(),
        }
    }

    fn value_from_children_query() -> DataQuery {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: TextInputProps::ValueFromChildren.local_idx().into(),
        }
    }

    fn prefill_query() -> DataQuery {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: TextInputProps::Prefill.local_idx().into(),
        }
    }
}

impl PropUpdater for ImmediateValueProp {
    type PropType = props::types::ImmediateValue;

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::to_data_queries()
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();

        // for simplicity, we don't work out scenarios where immediate_value didn't change,
        // as it typically does change if one of its dependencies changed
        let immediate_value = if !required_data.value_from_children.came_from_default
            && required_data.sync_value_to_immediate_value.value
        {
            // The value prop is synchronized with the immediate_value prop,
            // which happens when invert is called on the value prop,
            // (which happens, for example, when the user presses enter in text input or it loses focus).
            // Moreover, since there is a non-default value coming from the children,
            // this means the value prop is calculating its value from the children.
            // The immediate_value prop must therefore also calculate its value from the children.
            required_data.value_from_children.value
        } else if required_data.independent_state.came_from_default {
            // If the independent_state variable hasn't been changed from its default,
            // and we're not synchronized to value_from_children,
            // then we set immediate_value from prefill.
            // This is the initial situation before any interactions involving the text input have occurred.
            required_data.prefill.value
        } else {
            // Since the independent_state is no longer at its default,
            // some interactions with the text input have occurred and the immediate_value prop
            // is now tracking its independent_state variable whenever not synchronized to value_from_children.
            // This is the situation once interactions with the text input have begun.
            required_data.independent_state.value
        };
        PropCalcResult::Calculated(immediate_value)
    }

    fn invert(
        &self,
        data: DataQueryResults,
        requested_value: Self::PropType,
        is_direct_change_from_action: bool,
    ) -> Result<DataQueryResults, InvertError> {
        let mut desired = RequiredData::try_new_desired(&data).unwrap();
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();

        // We always record any requested update to immediate_value on its independent_state variable,
        // as immediate_value typically tracks its independent_state variable
        desired.independent_state.change_to(requested_value.clone());

        if is_direct_change_from_action {
            // Since this is a direct change from an action,
            // it means that a user typed into the text input.
            // In this case, the immediate_value prop should diverge from the value prop,
            // so we set sync_value_to_immediate_value to false if it isn't already
            if required_data.sync_value_to_immediate_value.value {
                desired.sync_value_to_immediate_value.change_to(false);
            }
        } else if !required_data.value_from_children.came_from_default
            && required_data.sync_value_to_immediate_value.value
        {
            // The value of the text input is being calculated from its children,
            // but this invert() function is being called for a reason
            // other than a user typing into the text input.
            // (This means that immediate_value is being changed due to another component extending from it.)
            // Since we are in this situation and sync_value_to_immediate_value is true,
            // we change value_from_children so that immediate_value is changed.
            desired.value_from_children.change_to(requested_value);
        }

        Ok(desired.into_data_query_results())
    }
}
