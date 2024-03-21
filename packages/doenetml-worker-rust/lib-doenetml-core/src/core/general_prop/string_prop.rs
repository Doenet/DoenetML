use std::rc::Rc;

use crate::{
    components::prelude::*,
    core::props::{DataQueryResult, InvertError, PropUpdater},
    props::BoxedUpdater,
};

/// A string prop that calculates its value by concatenating all string dependencies.
///
/// If the prop has a single dependency,
/// then it propagates the `came_from_default` attribute
/// unless `.dont_propagate_came_from_default()` was added (see below).
///
/// The string prop can be created via the constructors:
/// - `new_from_children(default_value)`: base the value on the component's `String` children,
///   falling back to `default_value` if there are no matching children.
/// - `new_from_attribute(attr_name, default_value)`: base the value on the component's `attr_name` attribute.
///   The calculation will use the `String` components of the attribute,
///   falling back to `default_value` if there are no matching components.
///
/// The string prop can be modified by chaining:
/// - `.dont_propagate_came_from_default()`: change the behavior so that if this prop ends up having a single dependency,
///   no longer propagate that dependency's `came_from_default` flag
///   to this prop's `came_from_default` flag.
///   Instead this prop's `came_from_default` flag will always be `false` whenever it is based on one or more dependency.
#[derive(Debug, Default)]
pub struct StringProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    ///
    /// The `always_return_value` attribute of the data query will be assumed to be coordinated with
    /// the prop's `propagate_came_from_default`, as described with `propagate_came_from_default`.
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
    default_value: String,

    /// If `true`, then we will propagate `came_from_default` from the dependency
    /// in the case where a single dependency is returned.
    /// If `false`, then `came_from_default` will be true only if no dependencies were found
    /// and we are returning an independent value that hasn't yet been changed from its default.
    ///
    /// The following relationship between `propagate_came_from_default` and the data query's `always_return_value`
    /// is assumed to be maintained:
    /// - if `propagate_came_from_default` is `true`, then `always_return_value` must be `true` on the `data_query`.
    /// - if `propagate_came_from_default` is `false`, then `always_return_value` must be `false` on the `data_query`.
    propagate_came_from_default: bool,
}

impl StringProp {
    /// Creates a string prop that calculates its value from the component's children
    /// matching the `String` profile.
    ///
    /// If there are no matching children, the prop will be initialized with `default_value`.
    pub fn new_from_children<S: Into<String>>(default_value: S) -> Self {
        StringProp {
            data_query: DataQuery::ChildPropProfile {
                match_profiles: vec![PropProfile::String],
            },
            default_value: default_value.into(),
            propagate_came_from_default: true,
        }
    }

    /// Changes the behavior so that this prop no longer propagates the `came_from_default` flag
    /// when there is only one matching dependency.
    ///
    /// The default behavior was that, in the case of only one matching dependency,
    /// the `came_from_default` of this prop would have matched
    /// the `came_from_default` of that single dependency.
    ///
    /// This behavior is now changed to that the `came_from_default` of this prop
    /// will always be `false` if there are any matching dependencies.
    ///
    /// The following behavior is unaffected:
    /// - If there are two or more matching dependencies,
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

impl From<StringProp> for BoxedUpdater {
    fn from(prop: StringProp) -> BoxedUpdater {
        Rc::new(prop)
    }
}

impl<S: Into<String>> PropFromAttribute<S> for StringProp {
    /// Creates a string prop that calculates its value from the attribute given by `attr_name`,
    /// basing the calculation on the attribute components that match the `String` profile.
    ///
    /// If there are no matching attribute components, the prop will be initialized with `default_value`.
    fn new_from_attribute(attr_name: AttributeName, default_value: S) -> Self {
        StringProp {
            data_query: DataQuery::Attribute {
                attribute_name: attr_name,
                match_profiles: vec![PropProfile::String],
            },
            default_value: default_value.into(),
            propagate_came_from_default: true,
        }
    }
}

impl PropUpdater for StringProp {
    fn default(&self) -> PropValue {
        PropValue::String(self.default_value.clone())
    }

    fn data_queries(&self) -> Vec<DataQuery> {
        vec![DataQuery::State, self.data_query.clone()]
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<PropValue> {
        let independent_state = &data.vec[0].values[0];
        let strings = &data.vec[1].values;

        match strings.len() {
            0 => {
                // If we reach here, then there were no dependencies returned from the data query.
                // Use the value and came_from_default of `independent_state`
                if independent_state.came_from_default {
                    PropCalcResult::FromDefault((*independent_state.value).clone())
                } else {
                    PropCalcResult::Calculated((*independent_state.value).clone())
                }
            }
            1 => {
                if !matches!(&*strings[0].value, PropValue::String(..)) {
                    panic!(
                        "Should get string dependency for string, found {:?}",
                        strings[0].value
                    );
                }

                if self.propagate_came_from_default && strings[0].came_from_default {
                    // if we are basing it on a single variable and propagating `came_from_default`,
                    // then we propagate `came_from_default` as well as the value.
                    PropCalcResult::FromDefault((*strings[0].value).clone())
                } else {
                    // If we are not propagating `came_from_default`,
                    // then we set `came_from_default` to be false (by specifying `Calculated`)
                    // independent of the dependency's `came_from_default`
                    PropCalcResult::Calculated((*strings[0].value).clone())
                }
            }
            _ => {
                // multiple string variables, so concatenate

                if strings.iter().any(|view| view.changed) {
                    let mut value = String::new();

                    value.extend(strings.iter().map(|v| match (*v.value).clone() {
                        PropValue::String(str) => str,
                        _ => panic!(
                            "Should get string dependency for string, found {:?}",
                            v.value
                        ),
                    }));

                    PropCalcResult::Calculated(PropValue::String(value))
                } else {
                    PropCalcResult::NoChange
                }
            }
        }
    }

    /// If the prop is determined by a single string variable,
    /// then request that variable take on the requested value for this variable.
    fn invert(
        &self,
        data: Vec<DataQueryResult>,
        requested_value: PropValue,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<Option<Vec<Option<PropValue>>>>, InvertError> {
        let strings = &data[1].values;

        match &requested_value {
            PropValue::String(string_value) => string_value,
            _ => panic!(
                "requested value for in invert for string must be String, found {:?}",
                requested_value
            ),
        };

        match strings.len() {
            0 => {
                // We had no dependencies, so change the independent state variable

                Ok(vec![Some(vec![Some(requested_value.clone())]), None])
            }
            1 => {
                // based on a single string value, so we can invert

                Ok(vec![None, Some(vec![Some(requested_value.clone())])])
            }
            _ => Err(InvertError::CouldNotUpdate),
        }
    }
}

// #[cfg(test)]
// #[path = "string_prop.test.rs"]
// mod tests;
