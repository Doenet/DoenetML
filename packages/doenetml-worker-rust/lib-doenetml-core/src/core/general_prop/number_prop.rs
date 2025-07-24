use std::{cell::RefCell, rc::Rc};

use crate::{
    components::prelude::*,
    props::{InvertError, UpdaterObject},
    state::types::math_expr::{MathExpr, MathParser},
};

use super::math_prop::{MathPropCache, calculate_math_from_prop_value_vector};

/// A number prop that calculates its value from dependencies.
///
/// The current version is in a preliminary form, where the only valid options are
/// - a single number or math dependency
/// - string dependencies (that are concatenated and parsed into a number)
/// - TODO: parse mathematical expressions into numbers
///
/// If the prop has a single number dependency,
/// then it propagates the `came_from_default` attribute
/// unless `.dont_propagate_came_from_default()` was added (see below).
///
/// The number prop can be created via the constructors:
/// - `new_from_children(default_value)`: base the value on the component's `Number`, `Math` and `String` children,
///   falling back to `default_value` if there are no matching children.
/// - `new_from_attribute(attr_name, default_value)`: base the value on the component's `attr_name` attribute.
///   The calculation will use the `Number`, `Math`, and `String` children of the attribute,
///   falling back to `default_value` if there are no matching children.
///
/// The number prop can be modified by chaining:
/// - `.dont_propagate_came_from_default()`: change the behavior so that if this prop ends up having a single number dependency,
///   no longer propagate that dependency's `came_from_default` flag
///   to this prop's `came_from_default` flag.
///   Instead this prop's `came_from_default` flag will always be `false` whenever it is based on one or more dependency.
#[derive(Debug, Default)]
pub struct NumberProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,

    /// The default value that is initially returned if no dependencies were returned.
    default_value: prop_type::Number,

    /// If `true`, then we will propagate `came_from_default` from the dependency
    /// in the case where a single number dependency is returned.
    /// If `false`, then `came_from_default` will be true only if no dependencies were found
    /// and we are returning an independent value that hasn't yet been changed from its default.
    propagate_came_from_default: bool,

    /// A cached value of the expression template used to calculate the final mathematical expression,
    /// saved here in order to prevent the need for its recalculation if only math values change
    cache: RefCell<MathPropCache>,
}

impl NumberProp {
    /// Creates a number prop that calculates its value from the component's children
    /// matching the `Number`, `Math`, or `String` profile.
    ///
    /// If there are no matching children, the prop will be initialized with `default_value`.
    pub fn new_from_children(default_value: prop_type::Number) -> Self {
        NumberProp {
            data_query: DataQuery::PickProp {
                source: PickPropSource::Children,
                prop_specifier: PropSpecifier::Matching(vec![
                    PropProfile::Number,
                    PropProfile::Math,
                    PropProfile::String,
                ]),
            },
            default_value,
            propagate_came_from_default: true,
            cache: Default::default(),
        }
    }
    /// Changes the behavior so that this prop no longer propagates the `came_from_default` flag
    /// when there is only one matching number dependency.
    ///
    /// The default behavior was that, in the case of only one matching number dependency,
    /// the `came_from_default` of this prop would have matched
    /// the `came_from_default` of that single number dependency.
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
        self.propagate_came_from_default = false;
        self
    }
}

impl From<NumberProp> for UpdaterObject {
    fn from(prop: NumberProp) -> UpdaterObject {
        Rc::new(prop)
    }
}

impl PropFromAttribute<prop_type::Number> for NumberProp {
    /// Creates a number prop that calculates its value from the attribute given by `attr_name`,
    /// basing the calculation on the attribute children that match the `Number`, `Math, or `String` profile.
    ///
    /// If there are no matching attribute children, the prop will be initialized with `default_value`.
    fn new_from_attribute(attr_name: AttributeName, default_value: prop_type::Number) -> Self {
        NumberProp {
            data_query: DataQuery::Attribute {
                attribute_name: attr_name,
                match_profiles: vec![PropProfile::Number, PropProfile::Math, PropProfile::String],
            },
            default_value,
            propagate_came_from_default: true,
            cache: Default::default(),
        }
    }
}

#[derive(TryFromDataQueryResults, IntoDataQueryResults)]
#[data_query(query_trait = DataQueries, pass_data = &DataQuery)]
struct RequiredData {
    independent_state: PropView<prop_type::Number>,
    numbers_maths_and_strings: Vec<PropView<PropValue>>,
}
impl DataQueries for RequiredData {
    fn independent_state_query(_: &DataQuery) -> DataQuery {
        DataQuery::State
    }
    fn numbers_maths_and_strings_query(query: &DataQuery) -> DataQuery {
        query.clone()
    }
}

impl PropUpdater for NumberProp {
    type PropType = prop_type::Number;

    fn default(&self) -> Self::PropType {
        self.default_value
    }

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(&self.data_query)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();
        let independent_state = required_data.independent_state;
        let numbers_maths_and_strings = required_data.numbers_maths_and_strings;

        for prop in &numbers_maths_and_strings {
            match &prop.value {
                PropValue::Math(_) | PropValue::Number(_) | PropValue::String(_) => {}
                _ => {
                    panic!(
                        "Should get number, math, or string dependency for number, found {prop:?}"
                    )
                }
            }
        }

        match numbers_maths_and_strings.len() {
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
                match &numbers_maths_and_strings[0].value {
                    PropValue::Number(number_value) => {
                        if self.propagate_came_from_default
                            && numbers_maths_and_strings[0].came_from_default
                        {
                            // if we are basing it on a single number variable and propagating came_from_default,
                            // then we propagate came_from_default as well as the value.
                            PropCalcResult::FromDefault(*number_value)
                        } else {
                            PropCalcResult::Calculated(*number_value)
                        }
                    }
                    PropValue::Math(math_value) => {
                        // if we are basing it on a single math, `came_from_default` will be false
                        PropCalcResult::Calculated(math_value.to_number())
                    }
                    PropValue::String(string_value) => {
                        // attempt to convert string into a number
                        PropCalcResult::Calculated(MathExpr::number_from_text(&**string_value))
                    }
                    _ => unreachable!(),
                }
            }
            _ => {
                match calculate_math_from_prop_value_vector(
                    numbers_maths_and_strings,
                    None,
                    MathParser::Text,
                    &[],
                    &self.cache,
                ) {
                    Ok(math_expr) => PropCalcResult::Calculated(math_expr.to_number()),
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

        let numbers_maths_and_strings = required_data.numbers_maths_and_strings;

        for prop in &numbers_maths_and_strings {
            match &prop.value {
                PropValue::Math(_) | PropValue::Number(_) | PropValue::String(_) => {}
                _ => {
                    panic!(
                        "Should get number, math, or string dependency for number, found {prop:?}"
                    )
                }
            }
        }

        match numbers_maths_and_strings.len() {
            0 => {
                // We had no dependencies, so change the independent state variable
                desired.independent_state.change_to(requested_value);
            }
            1 => {
                // based on a single value, so we can invert
                match &numbers_maths_and_strings[0].value {
                    PropValue::Number(..) => {
                        desired.numbers_maths_and_strings[0].change_to(requested_value.into());
                    }
                    PropValue::Math(..) => {
                        let requested_math: MathExpr = requested_value.into();
                        desired.numbers_maths_and_strings[0].change_to(requested_math.into());
                    }
                    PropValue::String(..) => {
                        desired.numbers_maths_and_strings[0]
                            .change_to(requested_value.to_string().into());
                    }
                    _ => unreachable!(),
                };
            }
            _ => return Err(InvertError::CouldNotUpdate),
        }

        Ok(desired.into_data_query_results())
    }
}

#[cfg(test)]
#[path = "number_prop.test.rs"]
mod tests;
