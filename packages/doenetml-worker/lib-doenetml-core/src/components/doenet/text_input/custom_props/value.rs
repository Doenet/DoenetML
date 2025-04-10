use super::super::*;
use crate::components::{doenet::text_input::TextInputProps, prelude::*};

#[derive(Debug, Default)]
pub struct ValueProp {}

impl ValueProp {
    pub fn new() -> Self {
        ValueProp {}
    }
}

/// Structure to hold data generated from the data queries
#[derive(TryFromDataQueryResults, IntoDataQueryResults)]
#[data_query(query_trait = DataQueries)]
#[derive(TestDataQueryTypes)]
#[owning_component(TextInput)]
struct RequiredData {
    /// An independent state variable (that doesn't have any dependencies)
    /// that stores `value` when it isn't synced with 'immediate_value`
    /// or being determined by `value_from_children`.
    independent_state: PropView<prop_type::String>,

    /// The `immediate_value` prop of this `text_input`.
    immediate_value: PropView<prop_type::String>,

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

    fn immediate_value_query() -> DataQuery {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: TextInputProps::ImmediateValue.local_idx().into(),
        }
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

impl PropUpdater for ValueProp {
    type PropType = props::types::Value;

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::to_data_queries()
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();

        // For the value calculation of `textInput`, we work out scenarios where the value didn't change
        // because this calculate_old() function will get called whenever immediate_value is changed
        // even though that often does not influence value.

        if !required_data.value_from_children.came_from_default {
            // The text input has children, so the value prop is locked to be the value of those children.
            return if required_data.value_from_children.changed {
                PropCalcResult::Calculated(required_data.value_from_children.value)
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

        let sync_value_to_immediate_value_changed =
            required_data.sync_value_to_immediate_value.changed;

        if required_data.sync_value_to_immediate_value.value {
            // If sync_value_to_immediate_value is true, then the value prop copies immediate_value.

            // When a user presses enter or the text input loses focus,
            // then value and immediate value are supposed to be the same,
            // and sync_value_to_immediate_value will be set to true in invert(), below.

            // Other changes to value via invert(),
            // such as a change induced by another component that is extending the value prop,
            // will also set sync_value_to_immediate_value to true.

            if sync_value_to_immediate_value_changed || required_data.immediate_value.changed {
                PropCalcResult::Calculated(required_data.immediate_value.value)
            } else {
                PropCalcResult::NoChange
            }
        } else if required_data.independent_state.came_from_default {
            // No interactions have occurred yet, so value is determined by prefill.
            if sync_value_to_immediate_value_changed || required_data.prefill.changed {
                PropCalcResult::Calculated(required_data.prefill.value)
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

            if sync_value_to_immediate_value_changed || required_data.independent_state.changed {
                PropCalcResult::Calculated(required_data.independent_state.value)
            } else {
                PropCalcResult::NoChange
            }
        }
    }

    fn invert(
        &self,
        data: DataQueryResults,
        requested_value: Self::PropType,
        _is_direct_change_from_action: bool,
    ) -> Result<DataQueryResults, InvertError> {
        let mut desired = RequiredData::try_new_desired(&data).unwrap();
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();

        if required_data.value_from_children.came_from_default {
            desired.independent_state.change_to(requested_value.clone());
            desired.immediate_value.change_to(requested_value);
        } else {
            desired.value_from_children.change_to(requested_value);
        }
        desired.sync_value_to_immediate_value.change_to(true);

        Ok(desired.into_data_query_results())
    }
}
