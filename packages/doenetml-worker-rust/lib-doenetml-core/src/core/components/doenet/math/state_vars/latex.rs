use crate::{
    components::prelude::*,
    state::types::math_expr::{MathExpr, ToLatexParams},
};

use super::MathState;

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct RequiredData {
    value: StateVarView<MathExpr>,
}

#[derive(Debug, Default)]
pub struct LatexValueStateVar {}

impl LatexValueStateVar {
    pub fn new() -> Self {
        LatexValueStateVar {}
    }
}

impl StateVarUpdater<String, RequiredData> for LatexValueStateVar {
    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            value: Some(MathState::get_value_data_queries()),
        }
        .into()
    }

    fn calculate<'a>(&self, data: &'a RequiredData) -> StateVarCalcResult<'a, String> {
        let value = data.value.get().to_latex(ToLatexParams::default());

        StateVarCalcResult::Calculated(value)
    }
}
