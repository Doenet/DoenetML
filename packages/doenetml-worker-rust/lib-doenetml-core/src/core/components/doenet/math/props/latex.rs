use crate::{
    components::prelude::*,
    state::types::math_expr::{MathExpr, ToLatexParams},
};

use super::MathState;

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData {
    value: PropView<MathExpr>,
}

#[derive(Debug, Default)]
pub struct LatexValueProp {}

impl LatexValueProp {
    pub fn new() -> Self {
        LatexValueProp {}
    }
}

impl PropUpdater<String, RequiredData> for LatexValueProp {
    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            value: Some(MathState::get_value_data_queries()),
        }
        .into()
    }

    fn calculate<'a>(&self, data: &'a RequiredData) -> PropCalcResult<'a, String> {
        let value = data.value.get().to_latex(ToLatexParams::default());

        PropCalcResult::Calculated(value)
    }
}
