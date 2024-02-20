use crate::{
    components::prelude::*,
    state::types::math_expr::{MathExpr, ToLatexParams},
};

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData {
    math_expression: PropView<MathExpr>,
}

#[derive(Debug, Default)]
pub struct LatexProp {
    /// Data query that should return the math expression to be converted to Latex
    math_expression: DataQuery,
}

impl LatexProp {
    pub fn new(math_expression: DataQuery) -> Self {
        LatexProp { math_expression }
    }
}

impl PropUpdater<String, RequiredData> for LatexProp {
    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            math_expression: Some(self.math_expression.clone()),
        }
        .into()
    }

    fn calculate(&mut self, data: &RequiredData) -> PropCalcResult<String> {
        PropCalcResult::Calculated(
            data.math_expression
                .get()
                // TODO: add support for specifying latex parameters
                .to_latex(ToLatexParams::default()),
        )
    }
}
