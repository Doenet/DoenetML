use crate::{
    components::prelude::*,
    state::types::math_expr::{MathExpr, MathParser},
};

use super::util::MathOrString;

#[derive(Debug, Default)]
pub struct MathProp {
    /// The data query that indicates how the dependencies of this state variable will be created.
    data_query: DataQuery,

    default_value: MathExpr,

    parser: MathParser,

    split_symbols: bool,

    function_symbols: Vec<String>,
}

/// The data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData {
    /// A vector of the string values of the dependencies coming from the data_query
    math_or_string: Vec<MathOrString>,
}

impl MathProp {
    /// Creates a string state var that calculates its value from the given data query.
    pub fn new(
        data_query: DataQuery,
        parser: MathParser,
        split_symbols: bool,
        function_symbols: Vec<String>,
    ) -> Self {
        MathProp {
            data_query,
            parser,
            split_symbols,
            function_symbols,
            ..Default::default()
        }
    }

    /// Creates a math state var that calculates its value from the component's children
    /// matching the `LiteralString` and `Math` profiles.
    ///
    /// If there are no matching children, the state variable will be initialized with `default_value`.
    pub fn new_from_children(
        default_value: MathExpr,
        parser: MathParser,
        split_symbols: bool,
        function_symbols: Vec<String>,
    ) -> Self {
        MathProp {
            data_query: DataQuery::Child {
                match_profiles: vec![ComponentProfile::LiteralString, ComponentProfile::Math],
                exclude_if_prefer_profiles: vec![],
                always_return_value: true,
            },
            parser,
            split_symbols,
            function_symbols,
            default_value,
        }
    }

    /// Creates a math state var that calculates its value from the attribute given by `attr_name`,
    /// basing the calculation on the attribute children that match the `LiteralString` and `Math` profiles.
    ///
    /// If there are no matching attribute children, the state variable will be initialized with `default_value`.
    pub fn new_from_attribute<S: Into<MathExpr>>(
        attr_name: AttributeName,
        default_value: S,
        parser: MathParser,
        split_symbols: bool,
        function_symbols: Vec<String>,
    ) -> Self {
        MathProp {
            data_query: DataQuery::AttributeChild {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::LiteralString, ComponentProfile::Math],
                always_return_value: true,
            },
            parser,
            split_symbols,
            function_symbols,
            default_value: default_value.into(),
        }
    }
}

impl PropUpdater<MathExpr, RequiredData> for MathProp {
    fn default_value(&self) -> MathExpr {
        self.default_value.clone()
    }

    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            math_or_string: Some(self.data_query.clone()),
        }
        .into()
    }

    fn calculate<'a>(&self, data: &'a RequiredData) -> PropCalcResult<'a, MathExpr> {
        match data.math_or_string.len() {
            0 => PropCalcResult::Calculated(MathExpr::default()),
            1 => {
                match &data.math_or_string[0] {
                    MathOrString::Math(math_value) => {
                        // If we are basing it on a single variable that came from default,
                        // then we propagate came_from_default as well as the value.
                        PropCalcResult::From(math_value)
                    }
                    MathOrString::String(string_value) => {
                        let math_expr = match self.parser {
                            MathParser::Text => MathExpr::from_text(
                                string_value.get().clone(),
                                self.split_symbols,
                                &self.function_symbols,
                            ),
                            MathParser::Latex => MathExpr::from_latex(
                                string_value.get().clone(),
                                self.split_symbols,
                                &self.function_symbols,
                            ),
                        };
                        PropCalcResult::Calculated(math_expr)
                    }
                }
            }
            _ => {
                // TODO: implement
                PropCalcResult::Calculated(MathExpr::default())
            }
        }
    }

    /// If the state variable is determined by a single string variable,
    /// then request that variable take on the requested value for this variable.
    fn invert(
        &self,
        data: &mut RequiredData,
        state_var: &PropView<MathExpr>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        match data.math_or_string.len() {
            1 => {
                // based on a single value, so we can invert
                let requested_value = state_var.get_requested_value().clone();
                match &mut data.math_or_string[0] {
                    MathOrString::Math(boolean_value) => {
                        boolean_value.queue_update(requested_value);
                    }
                    MathOrString::String(_string_value) => {
                        return Err(InvertError::CouldNotUpdate);
                    }
                }

                Ok(data.queued_updates())
            }
            _ => Err(InvertError::CouldNotUpdate),
        }
    }
}
