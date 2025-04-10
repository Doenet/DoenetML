use std::rc::Rc;

use crate::{components::prelude::*, props::UpdaterObject, state::types::math_expr::MathExpr};

/// A number to string prop converts a number into a string
///
/// Constructor:
/// - `new(number_local_prop_idx)`: create a prop converts
///   the number variable with the index `number_local_prop_idx`.
#[derive(Debug)]
pub struct NumberToStringProp {
    number_local_prop_idx: LocalPropIdx,
}

impl NumberToStringProp {
    /// Creates a string prop by converting the number prop of `number_local_prop_idx`
    pub fn new(number_local_prop_idx: LocalPropIdx) -> Self {
        NumberToStringProp {
            number_local_prop_idx,
        }
    }
}

impl From<NumberToStringProp> for UpdaterObject {
    fn from(prop: NumberToStringProp) -> UpdaterObject {
        Rc::new(prop)
    }
}

#[derive(TryFromDataQueryResults, IntoDataQueryResults)]
#[data_query(query_trait = DataQueries, pass_data = LocalPropIdx)]
struct RequiredData {
    number: PropView<prop_type::Number>,
}

impl DataQueries for RequiredData {
    fn number_query(number_local_prop_idx: LocalPropIdx) -> DataQuery {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: number_local_prop_idx.into(),
        }
    }
}

impl PropUpdater for NumberToStringProp {
    type PropType = prop_type::String;
    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(self.number_local_prop_idx)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();

        PropCalcResult::Calculated(required_data.number.value.to_string().into())
    }

    /// Convert the requested string value to number when inverting
    fn invert(
        &self,
        data: DataQueryResults,
        requested_value: Self::PropType,
        _is_direct_change_from_action: bool,
    ) -> Result<DataQueryResults, InvertError> {
        let mut desired = RequiredData::try_new_desired(&data).unwrap();

        let requested_number = MathExpr::number_from_text(&*requested_value);

        desired.number.change_to(requested_number);

        Ok(desired.into_data_query_results())
    }
}

#[cfg(test)]
#[path = "number_to_string_prop.test.rs"]
mod tests;
