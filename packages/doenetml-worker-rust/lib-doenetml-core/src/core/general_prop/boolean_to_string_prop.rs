use crate::components::prelude::*;

use super::util::string_to_boolean;

/// A string state variable converts a boolean into a string
///
/// Constructor:
/// - `new(boolean_prop_idx)`: create a state variable converts
///   the boolean variable with the index `boolean_prop_idx`.
#[derive(Debug, Default)]
pub struct BooleanToStringProp {
    boolean_prop_idx: PropIdx,
}

/// The data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData {
    boolean: PropView<bool>,
}

impl BooleanToStringProp {
    /// Creates a string state var by converting the boolean state variable of `boolean_prop_idx`
    pub fn new(boolean_prop_idx: PropIdx) -> Self {
        BooleanToStringProp { boolean_prop_idx }
    }
}

impl PropUpdater<String, RequiredData> for BooleanToStringProp {
    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            boolean: Some(DataQuery::Prop {
                component_idx: None,
                prop_idx: self.boolean_prop_idx,
            }),
        }
        .into()
    }

    fn calculate<'a>(&self, data: &'a RequiredData) -> PropCalcResult<'a, String> {
        PropCalcResult::Calculated(data.boolean.get().to_string())
    }

    /// Convert the requested string value to boolean when inverting
    fn invert(
        &self,
        data: &mut RequiredData,
        prop: &PropView<String>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        let requested_boolean = string_to_boolean(&prop.get_requested_value());

        data.boolean.queue_update(requested_boolean);

        Ok(data.queued_updates())
    }
}

#[cfg(test)]
#[path = "boolean_to_string_prop.test.rs"]
mod tests;
