use std::{cell::RefCell, rc::Rc};

use crate::{
    components::prelude::*,
    props::UpdaterObject,
    state::types::math_expr::{MathArg, MathExpr, MathParser, ToLatexParams, ToTextParams},
};

/// A math prop that calculates its value by
/// - concatenating all string, math, and number dependencies into a string,
///   replacing the math dependencies with placeholder variables,
/// - parsing that string into a math expression, and
/// - substituting in the values of the math dependencies for their placeholder variables.
///
/// If the prop has a single math dependency,
/// then it propagates the `came_from_default` attribute
/// unless `.dont_propagate_came_from_default()` was added (see below).
///
/// The math prop can be created via the constructors:
/// - `new_from_children(default_value)`: base the value on the component's `String` and `Math` children,
///   falling back to `default_value` if there are no matching children.
/// - `new_from_attribute(attr_name, default_value)`: base the value on the component's `attr_name` attribute.
///   The calculation will use the `String` and `Math` components of the attribute,
///   falling back to `default_value` if there are no matching components. (Currently unimplemented)
///
/// The math prop can be modified by chaining:
/// - `.dont_propagate_came_from_default()`: change the behavior so that if this prop ends up having a single dependency,
///   no longer propagate that dependency's `came_from_default` flag
///   to this prop's `came_from_default` flag.
///   Instead this prop's `came_from_default` flag will always be `false` whenever it is based on one or more dependency.
#[derive(Debug)]
pub struct MathProp {
    /// The data query that returns the math, number and string values used to create the math value
    math_number_strings_data_query: DataQuery,

    /// The data query that includes the fixed prop along with the math/strings prop
    data_query_with_fixed: DataQuery,

    /// The default value that is initially returned if no dependencies were returned.
    /// It behaves differently depending on the value of `propagate_came_from_default`.
    default_value: MathExpr,

    /// If `true`, then we will propagate `came_from_default` from the dependency
    /// in the case where a single dependency is returned.
    /// If `false`, then `came_from_default` will be true only if no dependencies were found
    /// and we are returning an independent value that hasn't yet been changed from its default.
    propagate_came_from_default: bool,

    // TODO: this should be based on a data query for a prop/attribute once we implement enum props or attributes
    /// A enum determining whether we should use the latex or text parser.
    parser: MathParser,

    // TODO: this should be based on a data query for a prop/attribute once we implement array props or attributes
    /// A vector of the symbols that should be treated as functions if they are followed by parentheses.  
    function_symbols: Vec<String>,

    /// A cached value of the expression template used to calculate the final mathematical expression,
    /// saved here in order to prevent the need for its recalculation if only math values change
    cache: RefCell<MathPropCache>,
}

#[derive(Debug, Default)]
pub struct MathPropCache {
    /// A cached value of the expression template used to calculate the final mathematical expression,
    /// saved here in order to prevent the need for its recalculation if only math values change
    expression_template: Option<MathExpr>,

    /// The codes that are embedded in the expression template that represent the math values,
    /// saved here as a companion to the cached `expression_template`.
    math_codes: Vec<String>,
}

impl MathProp {
    /// Creates a math prop that calculates its value from the component's children
    /// matching the `String`, `Math`, and `Number` profiles.
    ///
    /// Arguments:
    /// - `default_value`: If there are no matching children, the prop will be initialized with `default_value`.
    /// - `parser`: Determine whether that latex or text parser is used to parse strings into math.
    /// - `function_symbols`: a list of the symbols that will be treated as a function,
    ///   i.e., one of these symbols followed by arguments in parentheses
    ///   will be interpreted as apply that function to the arguments (rather than multiplication)
    pub fn new_from_children<S: Into<MathExpr>>(
        default_value: S,
        parser: MathParser,
        function_symbols: Vec<String>,
    ) -> Self {
        MathProp {
            math_number_strings_data_query: DataQuery::PickProp {
                source: PickPropSource::Children,
                prop_specifier: PropSpecifier::Matching(vec![
                    PropProfile::String,
                    PropProfile::Math,
                    PropProfile::Number,
                ]),
            },
            data_query_with_fixed: DataQuery::PickProp {
                source: PickPropSource::Children,
                prop_specifier: PropSpecifier::MatchingPair(
                    vec![PropProfile::String, PropProfile::Math, PropProfile::Number],
                    vec![PropProfile::Fixed],
                ),
            },
            parser,
            function_symbols,
            default_value: default_value.into(),
            propagate_came_from_default: true,
            cache: Default::default(),
        }
    }

    /// Changes the behavior so that this prop no longer propagates the `came_from_default` flag
    /// when there is only one matching math dependency.
    ///
    /// The default behavior was that, in the case of only one matching math dependency,
    /// the `came_from_default` of this prop would have matched
    /// the `came_from_default` of that single math dependency.
    ///
    /// This behavior is now changed to that the `came_from_default` of this prop
    /// will always be `false` if there are any matching dependencies.
    ///
    /// The following behavior is unaffected:
    /// - If there are two or more matching dependencies or a string dependency,
    ///   the `came_from_default` of this prop is always `false`.
    /// - If there are no matching dependencies,
    ///   then the `came_from_default` of this prop will initially be `true`
    ///   (and the value of the prop itself will be set to `default_value`).
    ///   As soon as the value is changed (by a call to `invert()`),
    ///   then the `came_from_default` of this prop will be set to `false`.
    pub fn dont_propagate_came_from_default(mut self) -> Self {
        // We both set `propagate_came_from_default` flag to false
        // and set the data queries to return nothing if there were no matches
        // in order that we can treat the case with no matches differently from the case with a single match.
        // (Before this change, the data queries returned a single result even if there were no matches,
        // preventing this case from being distinguished from the case with a single match.)

        self.propagate_came_from_default = false;
        self
    }
}

impl From<MathProp> for UpdaterObject {
    fn from(prop: MathProp) -> UpdaterObject {
        Rc::new(prop)
    }
}

// TODO: determine `math_parser` and `function_symbols`
impl PropFromAttribute<MathExpr> for MathProp {
    /// Creates a math prop that calculates its value from the attribute given by `attr_name`,
    /// basing the calculation on the attribute children that match the `String`, `Math` or `Number` profile.
    ///
    /// If there are no matching attribute children, the prop will be initialized with `default_value`.
    fn new_from_attribute(attr_name: AttributeName, default_value: MathExpr) -> Self {
        MathProp {
            math_number_strings_data_query: DataQuery::Attribute {
                attribute_name: attr_name,
                match_profiles: vec![PropProfile::String, PropProfile::Math, PropProfile::Number],
            },
            data_query_with_fixed: DataQuery::PickProp {
                source: PickPropSource::Attribute {
                    attribute_name: attr_name,
                },
                prop_specifier: PropSpecifier::MatchingPair(
                    vec![PropProfile::String, PropProfile::Math, PropProfile::Number],
                    vec![PropProfile::Fixed],
                ),
            },
            default_value,
            propagate_came_from_default: true,
            parser: MathParser::Text,
            function_symbols: vec!["f".to_string(), "g".to_string()],
            cache: Default::default(),
        }
    }
}

#[derive(TryFromDataQueryResults, IntoDataQueryResults)]
#[data_query(query_trait = DataQueries, pass_data = &MathProp)]
struct RequiredData {
    independent_state: PropView<prop_type::Math>,
    math_number_strings: Vec<PropView<PropValue>>,
    with_fixed: Vec<PropView<prop_type::PropVec>>,
    split_symbols: Option<PropView<prop_type::Boolean>>,
}
impl DataQueries for RequiredData {
    fn independent_state_query(_: &MathProp) -> DataQuery {
        DataQuery::State
    }
    fn math_number_strings_query(math_prop: &MathProp) -> DataQuery {
        math_prop.math_number_strings_data_query.clone()
    }
    fn with_fixed_query(math_prop: &MathProp) -> DataQuery {
        math_prop.data_query_with_fixed.clone()
    }
    fn split_symbols_query(_: &MathProp) -> DataQuery {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: PropSpecifier::Matching(vec![PropProfile::SplitSymbols]),
        }
    }
}

impl PropUpdater for MathProp {
    type PropType = prop_type::Math;

    fn default(&self) -> Self::PropType {
        self.default_value.clone().into()
    }

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(self)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();
        let independent_state = required_data.independent_state;
        let math_number_strings = required_data.math_number_strings;
        let split_symbols = required_data.split_symbols;

        for prop in &math_number_strings {
            match &prop.value {
                PropValue::Math(_) | PropValue::Number(_) | PropValue::String(_) => {}
                _ => {
                    panic!(
                        "Should get number, math, or string dependency for number, found {prop:?}"
                    )
                }
            }
        }

        match math_number_strings.len() {
            0 => {
                // If we reach here, then there were no dependencies returned from the data query.
                // Use the value and came_from_default of `independent_state`
                if independent_state.came_from_default {
                    PropCalcResult::FromDefault(independent_state.value)
                } else {
                    PropCalcResult::Calculated(independent_state.value)
                }
            }
            1 => {
                // if the math expression is based just one component,
                // then either propagate the value of a math or a number
                // or parse a string into a math
                match &math_number_strings[0] {
                    PropView {
                        value: PropValue::Math(math_value),
                        came_from_default,
                        changed,
                        ..
                    } => {
                        if *changed {
                            if self.propagate_came_from_default && *came_from_default {
                                // if we are basing it on a single variable and propagating came_from_default,
                                // then we propagate came_from_default as well as the value.
                                PropCalcResult::FromDefault(math_value.clone())
                            } else {
                                PropCalcResult::Calculated(math_value.clone())
                            }
                        } else {
                            PropCalcResult::NoChange
                        }
                    }
                    PropView {
                        value: PropValue::Number(number_value),
                        changed,
                        ..
                    } => {
                        if *changed {
                            PropCalcResult::Calculated(Rc::new((*number_value).into()))
                        } else {
                            PropCalcResult::NoChange
                        }
                    }
                    PropView {
                        value: PropValue::String(string_value),
                        changed,
                        ..
                    } => {
                        // first check if string is just a number, in which case we have
                        // a shortcut to create the math

                        match string_value.parse::<prop_type::Number>() {
                            Ok(converted_number) => {
                                let math_expr: MathExpr = converted_number.into();
                                return PropCalcResult::Calculated(Rc::new(math_expr));
                            }
                            Err(..) => {}
                        }

                        // TODO: once `function_symbols` is based on data query,
                        // check if that changed as well
                        if *changed
                            || split_symbols
                                .as_ref()
                                .map(|ss| ss.changed)
                                .unwrap_or_default()
                        {
                            let split_symbols_value =
                                split_symbols.map(|ss| ss.value).unwrap_or(true);
                            // If we are basing a math on a single string value,
                            // then parse that string into a math expression.
                            let math_expr = match self.parser {
                                MathParser::Text => MathExpr::from_text(
                                    &(**string_value),
                                    split_symbols_value,
                                    &self.function_symbols,
                                ),
                                MathParser::Latex => MathExpr::from_latex(
                                    &(**string_value),
                                    split_symbols_value,
                                    &self.function_symbols,
                                ),
                            };
                            PropCalcResult::Calculated(Rc::new(math_expr))
                        } else {
                            PropCalcResult::NoChange
                        }
                    }
                    _ => unreachable!(),
                }
            }
            _ => {
                match calculate_math_from_prop_value_vector(
                    math_number_strings,
                    split_symbols,
                    self.parser,
                    &self.function_symbols,
                    &self.cache,
                ) {
                    Ok(math_expr) => PropCalcResult::Calculated(Rc::new(math_expr)),
                    Err(()) => PropCalcResult::NoChange,
                }
            }
        }
    }

    fn invert(
        &self,
        data: DataQueryResults,
        requested_value: Self::PropType,
        _is_direct_change_from_action: bool,
    ) -> Result<DataQueryResults, InvertError> {
        let mut desired = RequiredData::try_new_desired(&data).unwrap();
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();
        let math_number_strings = required_data.math_number_strings;

        for prop in &math_number_strings {
            match &prop.value {
                PropValue::Math(_) | PropValue::Number(_) | PropValue::String(_) => {}
                _ => {
                    panic!(
                        "Should get number, math, or string dependency for number, found {prop:?}"
                    )
                }
            }
        }

        match math_number_strings.len() {
            0 => {
                // We had no dependencies, so change the independent state variable
                desired.independent_state.change_to(requested_value);
            }
            1 => {
                // based on a single value, so we can invert
                match &math_number_strings[0].value {
                    PropValue::Math(_) => {
                        desired.math_number_strings[0].change_to(requested_value.into());
                    }
                    PropValue::Number(_) => {
                        let desired_number: prop_type::Number = (*requested_value).clone().into();
                        desired.math_number_strings[0].change_to(desired_number.into());
                    }
                    PropValue::String(_) => {
                        let desired_string_value = match self.parser {
                            MathParser::Text => requested_value.to_text(ToTextParams::default()),
                            MathParser::Latex => requested_value.to_latex(ToLatexParams::default()),
                        };
                        desired.math_number_strings[0].change_to(desired_string_value.into());
                    }
                    _ => unreachable!(),
                }
            }
            // TODO: implement `invert` for the case with multiple values
            _ => {
                return Err(InvertError::CouldNotUpdate);
                // let fixed_math_number_strings = required_data
                //     .with_fixed
                //     .iter()
                //     .filter_map(|p| {
                //         let prop_vec = &p.value;

                //         // filter out any matches where we don't have a math or string
                //         // (i.e., we matched only on Fixed)
                //         if matches!(prop_vec[0], PropValue::None(())) {
                //             return None;
                //         }

                //         if !matches!(prop_vec[0], PropValue::String(_) | PropValue::Math(_)) {
                //             panic!(
                //                 "Should get math or string dependency for math, found {:?}",
                //                 prop_vec[0]
                //             )
                //         }

                //         match prop_vec[1] {
                //             PropValue::Boolean(v) => Some(v),
                //             PropValue::None(_) => Some(false),
                //             _ => panic!("Fixed be be a boolean, found {:?}", prop_vec[1]),
                //         }
                //     })
                //     .collect_vec();

                // if fixed_math_number_strings.len() != math_number_strings.len() {
                //     panic!(
                //         "Inconsistent lengths with fixed math and strings: {}, {}",
                //         fixed_math_number_strings.len(),
                //         math_number_strings.len()
                //     )
                // }
            }
        }

        Ok(desired.into_data_query_results())
    }
}

//     /// If the state variable is determined by a single string variable,
//     /// then request that variable take on the requested value for this variable.
//     fn invert(
//         &self,
//         data: &mut RequiredData,
//         prop: &PropView<MathExpr>,
//         _is_direct_change_from_action: bool,
//     ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
//         match data.math_number_strings.len() {
//             0 => {
//                 if self.propagate_came_from_default {
//                     // if propagate_came_from_default is true,
//                     // then always_return_value is true on the string data query,
//                     // so we should never reach this
//                     unreachable!()
//                 }
//                 // We had no dependencies, so change the independent state variable
//                 let requested_value = prop.get_requested_value();

//                 data.independent_state.queue_update(requested_value.clone());

//                 Ok(data.queued_updates())
//             }
//             1 => {
//                 // based on a single value, so we can invert
//                 let requested_value = prop.get_requested_value().clone();
//                 match &mut data.math_number_strings[0] {
//                     MathOrString::Math(boolean_value) => {
//                         boolean_value.queue_update(requested_value);
//                     }
//                     MathOrString::String(_string_value) => {
//                         return Err(InvertError::CouldNotUpdate);
//                     }
//                 }

//                 Ok(data.queued_updates())
//             }
//             // TODO: implement `invert` for the case with multiple values
//             _ => Err(InvertError::CouldNotUpdate),
//         }
//     }
// }

/// Calculate a math expression from multiple components,
/// where components are math, number, or string prop values.
///
/// Note: we assume that `math_number_strings` has already been
/// verified to have only math, number, and string values.
///
///
/// # Parameters
/// - `math_number_strings`: the math, number and string values forming the expression
/// - `split_symbols`: if true or none, the parse will split multi-character variables that don't contain digits
/// - `parser`: an enum specifying whether to use the latex or text parser to create the `MathExpr`
///   into the product of their characters
/// - `function_symbols`: the list of variable names that will be treated as a function if they are followed
///   by parentheses.
/// - cache: a cache to store data from parsing the overall structure,
///   which can be reused if the strings and parameters are unchanged
///
/// # Returns
/// A result:
/// - Ok: the math expression calculated
/// - Err: if there was no changed detected
pub fn calculate_math_from_prop_value_vector(
    math_number_strings: Vec<PropView<PropValue>>,
    split_symbols: Option<PropView<bool>>,
    parser: MathParser,
    function_symbols: &[String],
    cache: &RefCell<MathPropCache>,
) -> Result<MathExpr, ()> {
    // Overall strategy: create a "expression template" by concatenating all values
    // while replacing all maths and numbers by with a unique code
    // (typically m1, m2, etc., unless "m" appears in a string)
    // and parsing the resulting string into a math expression.
    // We cache that expression template, along with the codes used, onto `self`,
    // so that we don't have to recalculate it unless a string changes
    // or a parameter that controls parsing is changed.
    //
    // The final step is to substitute the values of the math components
    // for their codes into the expression_template.

    let string_changed = math_number_strings
        .iter()
        .filter(|view| match view.value {
            PropValue::Math(_) | PropValue::Number(_) => false,
            PropValue::String(_) => true,
            _ => unreachable!(),
        })
        .any(|view| view.changed);
    let math_number_changed = math_number_strings.iter().any(|view| {
        matches!(view.value, PropValue::Math(_) | PropValue::Number(_)) && view.changed
    });
    if string_changed
        || split_symbols
            .as_ref()
            .map(|ss| ss.changed)
            .unwrap_or_default()
    {
        // Either a string child has changed or split_symbols changed
        // (the latter condition will catch the first time calculate() is called).
        // We need to recalculate the expression template.

        let split_symbols_value = split_symbols.map(|ss| ss.value).unwrap_or(true);

        // Create the expression template from concatenating all values
        // while substituting codes for the math values
        let (expression_template, math_codes) = calc_expression_template(
            &math_number_strings,
            parser,
            split_symbols_value,
            function_symbols,
        );

        // save the expression template and codes
        // so that we can avoid parsing the strings if only a math value changes
        let mut borrowed_cache = cache.borrow_mut();
        borrowed_cache.expression_template = Some(expression_template);
        borrowed_cache.math_codes = math_codes;
    }
    if !(string_changed || math_number_changed) {
        return Err(());
    }
    let mut substitutions = HashMap::new();
    substitutions.extend(
        math_number_strings
            .iter()
            .filter_map(|prop| match &prop.value {
                PropValue::Math(_) | PropValue::Number(_) => Some(prop),
                PropValue::String(_) => None,
                _ => unreachable!(),
            })
            .enumerate()
            .map(|(idx, prop)| {
                (
                    cache.borrow().math_codes[idx].clone(),
                    match &prop.value {
                        PropValue::Math(math_prop) => MathArg::Math((**math_prop).clone()),
                        PropValue::Number(number_prop) => MathArg::Number(*number_prop),
                        _ => unreachable!(),
                    },
                )
            }),
    );

    Ok(cache
        .borrow()
        .expression_template
        .as_ref()
        .unwrap()
        .substitute(&substitutions))
}

/// Calculate an expression template by concatenating all math and string values,
/// but using a generated unique code for each math value.
///
/// The expression template is simply a `MathExpr`, only it will have the codes as variables
/// in the expression rather than the actual math values.
/// The key is that the expression template doesn't change if the math values change,
/// eliminating the need for the relatively expensive re-parsing of the string.
///
/// # Parameters
/// - `math_number_strings`: the math, number and string values forming the expression
/// - `parser`: an enum specifying whether to use the latex or text parser to create the `MathExpr`
/// - `split_symbols`: if true, the parse will split multi-character variables that don't contain digits
///   into the product of their characters
/// - `function_symbols`: the list of variable names that will be treated as a function if they are followed
///   by parentheses.
///
/// # Returns
/// A tuple of:
/// - the expression template
/// - the generated codes for each math value
fn calc_expression_template(
    math_number_strings: &[PropView<PropValue>],
    parser: MathParser,
    split_symbols: bool,
    function_symbols: &[String],
) -> (MathExpr, Vec<String>) {
    let string_children =
        Vec::from_iter(
            math_number_strings
                .iter()
                .filter_map(|prop| match &prop.value {
                    PropValue::String(string_prop) => Some(string_prop),
                    PropValue::Math(_) | PropValue::Number(_) => None,
                    _ => unreachable!(),
                }),
        );

    // let code_prefix be a sequence of "m"s long enough so that
    // it does not appear in any string props
    let code_prefix = {
        let mut code_prefix = String::from('m');
        string_children.iter().for_each(|str_prop| {
            while str_prop.contains(&code_prefix) {
                code_prefix.push('m');
            }
        });
        code_prefix
    };

    // concatenate the maths, numbers and strings, with maths and numbers replaced by the generated codes
    let (template_string, math_codes) =
        create_template_string(math_number_strings, code_prefix, parser);

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
/// # Parameters
/// - `math_number_strings`: the math, number and string values forming the expression
/// - `code_prefix`: the beginning of each generated code used to represent the math values
/// - `parser`: an enum specifying whether we will use the latex or text parser to create the `MathExpr`
///
/// # Returns
/// A tuple of:
/// - the template string that will be parsed into the expression template
/// - the math codes used to represent each math value
///
/// # Example
/// If `math_number_strings` was derived from `3+<math>x^2</math> + y<math>z</math>`,
/// and the `code_prefix` was `"m"`,
/// then the template string (assuming the text `parser`) would become `"3+ m1  + y m2"`
/// and the codes returned would be the vector of `("m1", "m2")`.
fn create_template_string(
    math_number_strings: &[PropView<PropValue>],
    code_prefix: String,
    parser: MathParser,
) -> (String, Vec<String>) {
    let mut template_string = String::new();
    let mut math_idx = 0;
    let mut math_codes = Vec::new();

    template_string.extend(math_number_strings.iter().map(|prop| {
        match &prop.value {
            PropValue::String(str_prop) => {
                format!(" {str_prop} ")
            }
            PropValue::Math(_) | PropValue::Number(_) => {
                let code = format!("{code_prefix}{math_idx}");
                math_codes.push(code.clone());
                math_idx += 1;

                match parser {
                    MathParser::Latex => {
                        // for latex, must explicitly denote that code
                        // is a multi-character variable
                        format!(r#"\operatorname{{" + {code} + "}}"#)
                    }
                    MathParser::Text => {
                        // for text, just make sure code is surrounded by spaces
                        // (the presence of numbers inside code will ensure that
                        // it is parsed as a multi-character variable)
                        format!(" {code} ")
                    }
                }
            }
            _ => unreachable!(),
        }
    }));

    (template_string, math_codes)
}
