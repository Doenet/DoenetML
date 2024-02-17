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
            value: Some(MathState::get_value_data_query()),
        }
        .into()
    }

    fn calculate(&mut self, data: &mut RequiredData) -> PropCalcResult<String> {
        if data.value.changed_since_last_viewed() {
            PropCalcResult::Calculated(
                data.value
                    .get_value_record_viewed()
                    .to_latex(ToLatexParams::default()),
            )
        } else {
            PropCalcResult::NoChange
        }
    }
}
