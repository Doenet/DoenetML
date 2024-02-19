use crate::{
    components::prelude::*,
    state::types::math_expr::{MathArg, MathExpr, MathParser},
};

use super::util::MathOrString;

#[derive(Debug, Default)]
pub struct MathProp {
    /// The data query that indicates how the dependencies of this state variable will be created.
    data_query: DataQuery,

    /// The default value that is initially returned if no dependencies were returned.
    /// It behaves differently depending on the value of `propagate_came_from_default`.
    ///
    /// If `propagate_came_from_default` is `true`, then `always_return_value` is set to `true` on the data queries.
    /// If no dependencies were found by those data queries, they will return a value with this default.
    ///
    /// If `propagate_came_from_default` is `false`, then `always_return_value` is set to `false` on the data queries.
    /// If no dependencies were found by those data queries, they will return nothing,
    /// and we will fall back to `independent_state`, which will be initialized with this default.
    default_value: MathExpr,

    /// If `true`, then we will propagate `came_from_default` from the dependency
    /// in the case where a single dependency is returned.
    /// If `false`, then `came_from_default` will be true only if no dependencies were found
    /// and we are returning an independent value that hasn't yet been changed from its default.
    propagate_came_from_default: bool,

    // TODO: this should be based on a data query for a prop/attribute once we implement enum props or attributes
    /// A enum determining whether we should use the latex or text parser.
    parser: MathParser,

    /// Data query that should return a `PropView<bool>`.
    ///
    /// If `true`, we split multi-character symbols into the product of the characters
    /// when parsing the string to a math expression
    split_symbols: DataQuery,

    // TODO: this should be based on a data query for a prop/attribute once we implement array props or attributes
    /// A vector of the symbols that should be treated as functions if they are followed by parentheses.  
    function_symbols: Vec<String>,

    /// A cached value of the expression template used to calculate the final mathematical expression,
    /// saved here in order to prevent the need for its recalculation if only math values change
    expression_template_cache: Option<MathExpr>,

    /// The codes that are embedded int the expression template that represent the math values,
    /// saved here as a companion to `expression_template_cache`.
    math_codes_cache: Vec<String>,
}

/// The data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData {
    /// An independent state variable (that doesn't have any dependencies)
    /// that is used if `propagate_came_from_default` is false
    /// to store the value when there are no dependencies.
    independent_state: PropView<MathExpr>,

    /// A vector of the math or string values of the dependencies coming from the data_query
    maths_and_strings: Vec<MathOrString>,

    /// If `true`, we split multi-character symbols into the product of the characters
    /// when parsing the string to a math expression
    split_symbols: PropView<bool>,
}

impl MathProp {
    /// Creates a math prop that calculates its value from the component's children
    /// matching the `String` and `Math` profiles.
    ///
    /// Arguments:
    /// - `default_value`: If there are no matching children, the prop will be initialized with `default_value`.
    /// - `parser`: Determine whether that latex or text parser is used to parse strings into math.
    /// - `split_symbols`: If `true`, we split multi-character symbols into the product of the characters
    ///   when parsing the string to a math expression
    /// - `function_symbols`: a list of the symbols that will be treated as a function,
    ///   i.e., one of these symbols followed by arguments in parentheses
    ///   will be interpreted as apply that function to the arguments (rather than multiplication)
    /// - `propagate_came_from_default`: see below.
    ///
    /// The `propagate_came_from_default` argument influences
    /// the behavior of this prop's `came_from_default` flag when there is only one matching child
    /// in the following manner:
    /// - If `propagate_came_from_default` is `true`, then if there is only one matching child,
    ///   `came_from_default` will match the `came_from_default` of that single child.
    /// - If `propagate_came_from_default` is `false`, then `came_from_default`
    ///   will always be `false` if there are any matching children.
    ///
    /// Regardless of the `propagate_came_from_default` argument,
    /// - If there are two or more matching children, `came_from_default` is always `false`.
    /// - If there are no matching children, then `came_from_default` will initially be true
    ///   (and the value of the prop itself will be set to `default_value`).
    ///   As soon as the value is changed (by a call to `invert()`),
    ///   then `came_from_default` will be set to `false`.
    pub fn new_from_children<S: Into<MathExpr>>(
        default_value: S,
        parser: MathParser,
        split_symbols: DataQuery,
        function_symbols: Vec<String>,
        propagate_came_from_default: bool,
    ) -> Self {
        MathProp {
            data_query: DataQuery::ChildPropProfile {
                match_profiles: vec![ComponentProfile::String, ComponentProfile::Math],
                always_return_value: propagate_came_from_default,
            },
            parser,
            split_symbols,
            function_symbols,
            default_value: default_value.into(),
            propagate_came_from_default,
            ..Default::default()
        }
    }

    /// Creates a math prop that calculates its value from the attribute given by `attr_name`,
    /// basing the calculation on the attribute components that match the `String` and `Math` profiles.
    ///
    ///
    /// Arguments:
    /// - `default_value`: If there are no matching attribute components,
    ///   the prop will be initialized with `default_value`.
    /// - `parser`: Determine whether that latex or text parser is used to parse strings into math.
    /// - `split_symbols`: If `true`, we split multi-character symbols into the product of the characters
    ///   when parsing the string to a math expression
    /// - `function_symbols`: a list of the symbols that will be treated as a function,
    ///   i.e., one of these symbols followed by arguments in parentheses
    ///   will be interpreted as apply that function to the arguments (rather than multiplication)
    /// - `propagate_came_from_default`: see below.
    ///
    /// The `propagate_came_from_default` argument influences
    /// the behavior of this prop's `came_from_default` flag when there is only one matching attribute component
    /// in the following manner:
    /// - If `propagate_came_from_default` is `true`, then if there is only one matching attribute component,
    ///   `came_from_default` will match the `came_from_default` of that single attribute component.
    /// - If `propagate_came_from_default` is `false`, then `came_from_default`
    ///   will always be `false` if there are any matching attribute components.
    ///
    /// Regardless of the `propagate_came_from_default` argument,
    /// - If there are two or more matching attribute components, `came_from_default` is always `false`.
    /// - If there are no matching attribute components, then `came_from_default` will initially be true
    ///   (and the value of the prop itself will be set to `default_value`).
    ///   As soon as the value is changed (by a call to `invert()`),
    ///   then `came_from_default` will be set to `false`.
    pub fn new_from_attribute<S: Into<MathExpr>>(
        attr_name: AttributeName,
        default_value: S,
        parser: MathParser,
        split_symbols: DataQuery,
        function_symbols: Vec<String>,
        propagate_came_from_default: bool,
    ) -> Self {
        MathProp {
            data_query: DataQuery::Attribute {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::String, ComponentProfile::Math],
                always_return_value: propagate_came_from_default,
            },
            parser,
            split_symbols,
            function_symbols,
            default_value: default_value.into(),
            propagate_came_from_default,
            ..Default::default()
        }
    }
}

impl PropUpdater<MathExpr, RequiredData> for MathProp {
    fn default_value(&self) -> MathExpr {
        self.default_value.clone()
    }

    fn return_data_queries(&self) -> Vec<DataQuery> {
        RequiredDataQueries {
            independent_state: DataQuery::State,
            maths_and_strings: self.data_query.clone(),
            split_symbols: self.split_symbols.clone(),
        }
        .into()
    }

    fn calculate(&mut self, data: &RequiredData) -> PropCalcResult<MathExpr> {
        match data.maths_and_strings.len() {
            0 => {
                if self.propagate_came_from_default {
                    // if propagate_came_from_default is true,
                    // then always_return_value is true on the string data query,
                    // so we should never reach this
                    unreachable!()
                }

                // If propagate_came_from_default is false and there were no dependencies returned,
                // then use the independent state, propagating its came_from_default as well as its value.
                // In this way, came_from_default will be true only if no dependencies were returned.
                data.independent_state.prop_calc_result()
            }
            1 => {
                // if the math expression is based just one component,
                // then either propagate the value of a math
                // or parse a string into a math
                match &data.maths_and_strings[0] {
                    MathOrString::Math(math_value) => {
                        if math_value.changed_since_last_viewed() {
                            if self.propagate_came_from_default {
                                // if we are basing it on a single math value and propagating came_from_default,
                                // then we propagate came_from_default as well as the value.
                                math_value.prop_calc_result()
                            } else {
                                // If we are not propagating came_from_default,
                                // then came_from_default will be false independent of the dependency's came_from_default
                                PropCalcResult::Calculated(math_value.get().clone())
                            }
                        } else {
                            PropCalcResult::NoChange
                        }
                    }
                    MathOrString::String(string_value) => {
                        // TODO: once `function_symbols` is based on data query,
                        // check if that changed as well
                        if string_value.changed_since_last_viewed()
                            || data.split_symbols.changed_since_last_viewed()
                        {
                            // If we are basing a math on a single string value,
                            // then parse that string into a math expression.
                            let math_expr = match self.parser {
                                MathParser::Text => MathExpr::from_text(
                                    string_value.get().clone(),
                                    *data.split_symbols.get(),
                                    &self.function_symbols,
                                ),
                                MathParser::Latex => MathExpr::from_latex(
                                    string_value.get().clone(),
                                    *data.split_symbols.get(),
                                    &self.function_symbols,
                                ),
                            };
                            PropCalcResult::Calculated(math_expr)
                        } else {
                            PropCalcResult::NoChange
                        }
                    }
                }
            }
            _ => {
                // Now we have the more complicated case where that math expression is based on multiple components.
                //
                // Overall strategy: create a "expression template" by concatenating all values
                // while replacing all maths by with a unique code
                // (typically m1, m2, etc., unless "m" appears in a string)
                // and parsing the resulting string into a math expression.
                // We cache that expression template, along with the codes used, onto `self`,
                // so that we don't have to recalculate it unless a string changes
                // or a parameter that controls parsing is changed.
                //
                // The final step is to substitute the values of the math components
                // for their codes into the expression_template.

                let string_changed = data
                    .maths_and_strings
                    .iter()
                    .filter_map(|view| match view {
                        MathOrString::Math(_) => None,
                        MathOrString::String(str_prop) => Some(str_prop),
                    })
                    .any(|view| view.changed_since_last_viewed());

                let math_changed = data
                    .maths_and_strings
                    .iter()
                    .filter_map(|view| match view {
                        MathOrString::Math(math_prop) => Some(math_prop),
                        MathOrString::String(_) => None,
                    })
                    .any(|view| view.changed_since_last_viewed());

                if string_changed || data.split_symbols.changed_since_last_viewed() {
                    // Either a string child has changed or split_symbols changed
                    // (the latter condition will catch the first time calculate() is called).
                    // We need to recalculate the expression template.

                    // Create the expression template from concatenating all values
                    // while substituting codes for the math values
                    let (expression_template, math_codes) = calc_expression_template(
                        &data.maths_and_strings,
                        self.parser,
                        *data.split_symbols.get(),
                        &self.function_symbols,
                    );

                    // save the expression template and codes
                    // so that we can avoid parsing the strings if only a math value changes
                    self.expression_template_cache = Some(expression_template);
                    self.math_codes_cache = math_codes;
                }

                if string_changed || math_changed {
                    // create the substitutions map,
                    // where the keys are the codes for the math values
                    // and the values are the math values
                    let mut substitutions = HashMap::new();
                    substitutions.extend(
                        data.maths_and_strings
                            .iter()
                            .filter_map(|prop| match prop {
                                MathOrString::Math(math_prop) => Some(math_prop),
                                MathOrString::String(_) => None,
                            })
                            .enumerate()
                            .map(|(idx, math_prop)| {
                                (
                                    self.math_codes_cache[idx].clone(),
                                    MathArg::Math(math_prop.get().clone()),
                                )
                            }),
                    );

                    // substitute into the expression template
                    PropCalcResult::Calculated(
                        self.expression_template_cache
                            .as_ref()
                            .unwrap()
                            .substitute(&substitutions),
                    )
                } else {
                    PropCalcResult::NoChange
                }
            }
        }
    }

    /// If the state variable is determined by a single string variable,
    /// then request that variable take on the requested value for this variable.
    fn invert(
        &self,
        data: &mut RequiredData,
        prop: &PropView<MathExpr>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        match data.maths_and_strings.len() {
            0 => {
                if self.propagate_came_from_default {
                    // if propagate_came_from_default is true,
                    // then always_return_value is true on the string data query,
                    // so we should never reach this
                    unreachable!()
                }
                // We had no dependencies, so change the independent state variable
                let requested_value = prop.get_requested_value();

                data.independent_state.queue_update(requested_value.clone());

                Ok(data.queued_updates())
            }
            1 => {
                // based on a single value, so we can invert
                let requested_value = prop.get_requested_value().clone();
                match &mut data.maths_and_strings[0] {
                    MathOrString::Math(boolean_value) => {
                        boolean_value.queue_update(requested_value);
                    }
                    MathOrString::String(_string_value) => {
                        return Err(InvertError::CouldNotUpdate);
                    }
                }

                Ok(data.queued_updates())
            }
            // TODO: implement `invert` for the case with multiple values
            _ => Err(InvertError::CouldNotUpdate),
        }
    }
}

/// Calculate an expression template by concatenating all math and string values,
/// but using a generated unique code for each math value.
///
/// The expression template is simply a `MathExpr`, only it will have the codes as variables
/// in the expression rather than the actual math values.
/// The key is that the expression template doesn't change if the math values change,
/// eliminating the need for the relatively expensive re-parsing of the string.
///
/// Parameters:
/// - `maths_and_strings`: the math and string values forming the expression
/// - `parser`: an enum specifying whether to use the latex or text parser to create the `MathExpr`
/// - `split_symbols`: if true, the parse will split multi-character variables that don't contain digits
///   into the product of their characters
/// - `function_symbols`: the list of variable names that will be treated as a function if they are followed
///   by parentheses.
///
/// Return a tuple of:
/// - the expression template
/// - the generated codes for each math value
fn calc_expression_template(
    maths_and_strings: &[MathOrString],
    parser: MathParser,
    split_symbols: bool,
    function_symbols: &[String],
) -> (MathExpr, Vec<String>) {
    let string_children = Vec::from_iter(maths_and_strings.iter().filter_map(|prop| match prop {
        MathOrString::String(string_prop) => Some(string_prop),
        MathOrString::Math(_) => None,
    }));

    // let code_prefix be a sequence of "m"s long enough so that
    // it does not appear in any string props
    let code_prefix = {
        let mut code_prefix = String::from('m');
        string_children.iter().for_each(|str_prop| {
            while str_prop.get().contains(&code_prefix) {
                code_prefix.push('m');
            }
        });
        code_prefix
    };

    // concatenate the maths and strings, with maths replaced by the generated codes
    let (template_string, math_codes) =
        create_template_string(maths_and_strings, code_prefix, parser);

    // parse this string into a `MathExpr`, which is the expression template
    let expression_template = match parser {
        MathParser::Latex => MathExpr::from_latex(template_string, split_symbols, function_symbols),
        MathParser::Text => MathExpr::from_text(template_string, split_symbols, function_symbols),
    };

    (expression_template, math_codes)
}

/// Concatenate all string and math values, only replacing the math values with generated codes.
///
/// The code for each math value is `code_prefix` followed by a number.
///
/// Parameters:
/// - `maths_and_strings`: the math and string values forming the expression
/// - `code_prefix`: the beginning of each generated code used to represent the math values
/// - `parser`: an enum specifying whether we will use the latex or text parser to create the `MathExpr`
///
/// Returns a tuple of:
/// - the template string that will be parsed into the expression template
/// - the math codes used to represent each math value
///
/// Example:
/// If `maths_and_strings` was derived from `3+<math>x^2</math> + y<math>z</math>`,
/// and the `code_prefix` was `"m"`,
/// then the template string (assuming the text `parser`) would become `"3+ m1  + y m2"`
/// and the codes returned would be the vector of `("m1", "m2")`.
fn create_template_string(
    maths_and_strings: &[MathOrString],
    code_prefix: String,
    parser: MathParser,
) -> (String, Vec<String>) {
    let mut template_string = String::new();
    let mut math_idx = 0;
    let mut math_codes = Vec::new();

    template_string.extend(maths_and_strings.iter().map(|prop| {
        match prop {
            MathOrString::String(str_prop) => {
                format!(" {} ", str_prop.get().clone())
            }
            MathOrString::Math(_) => {
                let code = format!("{}{}", code_prefix, math_idx);
                math_codes.push(code.clone());
                math_idx += 1;

                match parser {
                    MathParser::Latex => {
                        // for latex, must explicitly denote that code
                        // is a multi-character variable
                        format!(r#"\operatorname{{" + {} + "}}"#, code)
                    }
                    MathParser::Text => {
                        // for text, just make sure code is surrounded by spaces
                        // (the presence of numbers inside code will ensure that
                        // it is parsed as a multi-character variable)
                        format!(" {} ", code)
                    }
                }
            }
        }
    }));

    (template_string, math_codes)
}
