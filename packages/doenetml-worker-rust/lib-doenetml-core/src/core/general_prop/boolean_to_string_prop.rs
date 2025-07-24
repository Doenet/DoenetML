use std::rc::Rc;

use crate::{components::prelude::*, props::UpdaterObject};

use super::util::string_to_boolean;

/// A boolean to string prop converts a boolean into a string
///
/// Constructor:
/// - `new(boolean_local_prop_idx)`: create a prop converts
///   the boolean variable with the index `boolean_local_prop_idx`.
#[derive(Debug)]
pub struct BooleanToStringProp {
    boolean_local_prop_idx: LocalPropIdx,
}

impl BooleanToStringProp {
    /// Creates a string prop by converting the boolean prop of `boolean_local_prop_idx`
    pub fn new(boolean_local_prop_idx: LocalPropIdx) -> Self {
        BooleanToStringProp {
            boolean_local_prop_idx,
        }
    }
}

impl From<BooleanToStringProp> for UpdaterObject {
    fn from(prop: BooleanToStringProp) -> UpdaterObject {
        Rc::new(prop)
    }
}

#[derive(TryFromDataQueryResults, IntoDataQueryResults)]
#[data_query(query_trait = DataQueries, pass_data = LocalPropIdx)]
struct RequiredData {
    boolean: PropView<bool>,
}

impl DataQueries for RequiredData {
    fn boolean_query(boolean_local_prop_idx: LocalPropIdx) -> DataQuery {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: boolean_local_prop_idx.into(),
        }
    }
}

impl PropUpdater for BooleanToStringProp {
    type PropType = prop_type::String;
    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(self.boolean_local_prop_idx)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();

        PropCalcResult::Calculated(required_data.boolean.value.to_string().into())
    }

    /// Convert the requested string value to boolean when inverting
    fn invert(
        &self,
        data: DataQueryResults,
        requested_value: Self::PropType,
        _is_direct_change_from_action: bool,
    ) -> Result<DataQueryResults, InvertError> {
        let mut desired = RequiredData::try_new_desired(&data).unwrap();

        let requested_boolean = string_to_boolean(&requested_value);

        desired.boolean.change_to(requested_boolean);

        Ok(desired.into_data_query_results())
    }
}

#[cfg(test)]
#[path = "boolean_to_string_prop.test.rs"]
mod tests;
