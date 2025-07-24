use std::rc::Rc;

use crate::{
    components::prelude::*,
    props::{InvertError, UpdaterObject},
};

use super::util::{string_attr_to_boolean, string_to_boolean};

/// A boolean prop that calculates its value from dependencies.
///
/// The current version is in a preliminary form, where the only valid options are
/// - a single boolean dependency
/// - string dependencies (that are concatenated to see if they spell out "true")
///
/// If the prop has a single boolean dependency,
/// then it propagates the `came_from_default` attribute
/// unless `.dont_propagate_came_from_default()` was added (see below).
///
/// The boolean prop can be created via the constructors:
/// - `new_from_children(default_value)`: base the value on the component's `Boolean` and `String` children,
///   falling back to `default_value` if there are no matching children.
/// - `new_from_attribute(attr_name, default_value)`: base the value on the component's `attr_name` attribute.
///   The calculation will use the `Boolean` and `String` children of the attribute,
///   falling back to `default_value` if there are no matching children.
///
/// The boolean prop can be modified by chaining:
/// - `.dont_propagate_came_from_default()`: change the behavior so that if this prop ends up having a single dependency,
///   no longer propagate that dependency's `came_from_default` flag
///   to this prop's `came_from_default` flag.
///   Instead this prop's `came_from_default` flag will always be `false` whenever it is based on one or more dependency.
#[derive(Debug, Default)]
pub struct BooleanProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,

    /// The default value that is initially returned if no dependencies were returned.
    default_value: bool,

    /// If `true`, then we will propagate `came_from_default` from the dependency
    /// in the case where a single boolean dependency is returned.
    /// If `false`, then `came_from_default` will be true only if no dependencies were found
    /// and we are returning an independent value that hasn't yet been changed from its default.
    propagate_came_from_default: bool,

    /// If `true`, then this prop was created from an attribute.
    /// In this case, an empty string `""` is interpreted as `true`;
    /// otherwise an empty string `""` is interpreted as `false`.
    from_attribute: bool,
}

impl BooleanProp {
    /// Creates a boolean prop that calculates its value from the component's children
    /// matching the `String` or `Boolean` profile.
    ///
    /// If there are no matching children, the prop will be initialized with `default_value`.
    pub fn new_from_children(default_value: bool) -> Self {
        BooleanProp {
            data_query: DataQuery::PickProp {
                source: PickPropSource::Children,
                prop_specifier: PropSpecifier::Matching(vec![
                    PropProfile::String,
                    PropProfile::Boolean,
                ]),
            },
            default_value,
            propagate_came_from_default: true,
            from_attribute: false,
        }
    }
    /// Changes the behavior so that this prop no longer propagates the `came_from_default` flag
    /// when there is only one matching boolean dependency.
    ///
    /// The default behavior was that, in the case of only one matching boolean dependency,
    /// the `came_from_default` of this prop would have matched
    /// the `came_from_default` of that single boolean dependency.
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

impl From<BooleanProp> for UpdaterObject {
    fn from(prop: BooleanProp) -> UpdaterObject {
        Rc::new(prop)
    }
}

impl PropFromAttribute<bool> for BooleanProp {
    /// Creates a boolean prop that calculates its value from the attribute given by `attr_name`,
    /// basing the calculation on the attribute children that match the `String` or `Boolean` profile.
    ///
    /// If there are no matching attribute children, the prop will be initialized with `default_value`.
    fn new_from_attribute(attr_name: AttributeName, default_value: bool) -> Self {
        BooleanProp {
            data_query: DataQuery::Attribute {
                attribute_name: attr_name,
                match_profiles: vec![PropProfile::String, PropProfile::Boolean],
            },
            default_value,
            propagate_came_from_default: true,
            from_attribute: true,
        }
    }
}

#[derive(TryFromDataQueryResults, IntoDataQueryResults)]
#[data_query(query_trait = DataQueries, pass_data = &DataQuery)]
struct RequiredData {
    independent_state: PropView<prop_type::Boolean>,
    booleans_and_strings: Vec<PropView<PropValue>>,
}
impl DataQueries for RequiredData {
    fn independent_state_query(_: &DataQuery) -> DataQuery {
        DataQuery::State
    }
    fn booleans_and_strings_query(query: &DataQuery) -> DataQuery {
        query.clone()
    }
}

impl PropUpdater for BooleanProp {
    type PropType = prop_type::Boolean;

    fn default(&self) -> Self::PropType {
        self.default_value
    }

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(&self.data_query)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();
        let independent_state = required_data.independent_state;
        let booleans_and_strings = required_data.booleans_and_strings;

        match booleans_and_strings.len() {
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
                match &booleans_and_strings[0].value {
                    PropValue::Boolean(bool_value) => {
                        if self.propagate_came_from_default
                            && booleans_and_strings[0].came_from_default
                        {
                            // if we are basing it on a single variable and propagating came_from_default,
                            // then we propagate came_from_default as well as the value.
                            PropCalcResult::FromDefault(*bool_value)
                        } else {
                            PropCalcResult::Calculated(*bool_value)
                        }
                    }
                    PropValue::String(string_value) => {
                        PropCalcResult::Calculated(if self.from_attribute {
                            string_attr_to_boolean(string_value)
                        } else {
                            string_to_boolean(string_value)
                        })
                    }
                    _ => panic!(
                        "Should get boolean or string dependency for boolean, found {:?}",
                        booleans_and_strings[0].value
                    ),
                }
            }
            _ => {
                if booleans_and_strings
                    .iter()
                    .any(|prop| matches!(&prop.value, PropValue::Boolean(_)))
                {
                    // invalid combination. Haven't implemented boolean dependency with others
                    PropCalcResult::Calculated(false)
                } else {
                    // Have multiple string variables. Concatenate the string values into a single string

                    if booleans_and_strings.iter().any(|prop| prop.changed) {
                        let mut value = String::new();

                        for prop in booleans_and_strings {
                            match &prop.value {
                                PropValue::Boolean(boolean_val) => {
                                    value += &boolean_val.to_string()
                                }
                                PropValue::String(string_value) => value += string_value,
                                _ => {
                                    panic!(
                                        "Should get boolean or string for boolean, found {prop:?}"
                                    )
                                }
                            }
                        }

                        PropCalcResult::Calculated(if self.from_attribute {
                            string_attr_to_boolean(&value)
                        } else {
                            string_to_boolean(&value)
                        })
                    } else {
                        PropCalcResult::NoChange
                    }
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

        let booleans_and_strings = required_data.booleans_and_strings;

        match booleans_and_strings.len() {
            0 => {
                // We had no dependencies, so change the independent state variable
                desired.independent_state.change_to(requested_value);
            }
            1 => {
                // based on a single value, so we can invert
                match &booleans_and_strings[0].value {
                    PropValue::Boolean(..) => {
                        desired.booleans_and_strings[0].change_to(requested_value.into());
                    }
                    PropValue::String(..) => {
                        desired.booleans_and_strings[0]
                            .change_to(requested_value.to_string().into());
                    }
                    _ => panic!(
                        "Should get boolean or string dependency for boolean, found {:?}",
                        booleans_and_strings[0].value
                    ),
                };
            }
            _ => return Err(InvertError::CouldNotUpdate),
        }

        Ok(desired.into_data_query_results())
    }
}

#[cfg(test)]
#[path = "boolean_prop.test.rs"]
mod tests;
