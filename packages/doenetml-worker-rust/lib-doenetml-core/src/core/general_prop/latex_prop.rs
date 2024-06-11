use std::rc::Rc;

use crate::{
    components::prelude::*,
    props::UpdaterObject,
    state::types::math_expr::{MathExpr, ToLatexParams},
};

#[derive(Debug)]
pub struct LatexProp {
    /// Local index for the math expression to be converted to Latex
    math_expression_local_idx: LocalPropIdx,
}

impl LatexProp {
    pub fn new(math_expression_local_idx: LocalPropIdx) -> Self {
        LatexProp {
            math_expression_local_idx,
        }
    }
}

impl From<LatexProp> for UpdaterObject {
    fn from(prop: LatexProp) -> UpdaterObject {
        Rc::new(prop)
    }
}

#[derive(TryFromDataQueryResults, IntoDataQueryResults)]
#[data_query(query_trait = DataQueries, pass_data = &LocalPropIdx)]
struct RequiredData {
    math_expression: PropView<MathExpr>,
}
impl DataQueries for RequiredData {
    fn math_expression_query(math_expression_local_idx: &LocalPropIdx) -> DataQuery {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: (*math_expression_local_idx).into(),
        }
    }
}

impl PropUpdater for LatexProp {
    type PropType = prop_type::String;

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(&self.math_expression_local_idx)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();
        let math_expression = required_data.math_expression;

        PropCalcResult::Calculated(Rc::new(
            // TODO: add support for specifying latex parameters
            math_expression.value.to_latex(ToLatexParams::default()),
        ))
    }

    fn invert(
        &self,
        data: DataQueryResults,
        requested_value: Self::PropType,
        _is_direct_change_from_action: bool,
    ) -> Result<DataQueryResults, InvertError> {
        let mut desired = RequiredData::try_new_desired(&data).unwrap();

        let desired_math = MathExpr::from_latex((*requested_value).clone(), true, &["f", "g"]);

        desired.math_expression.change_to(desired_math);

        Ok(desired.into_data_query_results())
    }
}
