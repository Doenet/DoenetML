use crate::components::prelude::*;

use super::util::{string_attr_to_boolean, string_to_boolean, BooleanOrString};

/// A boolean prop that calculates its value from dependencies.
///
/// The current version is in a preliminary form, where the only valid options are
/// - a single boolean dependency
/// - string dependencies (that are concatenated to see if they spell out "true")
///
/// If the prop has a single dependency,
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
    default_value: bool,

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

    /// If `true`, then this prop was created from an attribute.
    /// In this case, an empty string `""` is interpreted as `true`;
    /// otherwise an empty string `""` is interpreted as `false`.
    from_attribute: bool,
}

/// The values of the dependencies created from the data queries
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData {
    /// An independent piece of data (a [`StateProp`](crate::state::prop_state::StateProp) whose value gets saved)
    /// that is used if `propagate_came_from_default` is false
    /// to store the value when there are no dependencies.
    independent_state: PropView<bool>,

    /// A vector of the boolean or string values of the dependencies coming from the data_query
    booleans_and_strings: Vec<BooleanOrString>,
}
impl BooleanProp {
    /// Creates a boolean prop that calculates its value from the component's children
    /// matching the `String` or `Boolean` profile.
    ///
    /// If there are no matching children, the prop will be initialized with `default_value`.
    pub fn new_from_children(default_value: bool) -> Self {
        BooleanProp {
            data_query: DataQuery::ChildPropProfile {
                match_profiles: vec![ComponentProfile::String, ComponentProfile::Boolean],
                always_return_value: true,
            },
            default_value,
            propagate_came_from_default: true,
            from_attribute: false,
        }
    }

    /// Creates a boolean prop that calculates its value from the attribute given by `attr_name`,
    /// basing the calculation on the attribute children that match the `String` or `Boolean` profile.
    ///
    /// If there are no matching attribute children, the prop will be initialized with `default_value`.
    pub fn new_from_attribute(attr_name: AttributeName, default_value: bool) -> Self {
        BooleanProp {
            data_query: DataQuery::Attribute {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::String, ComponentProfile::Boolean],
                always_return_value: true,
            },
            default_value,
            propagate_came_from_default: true,
            from_attribute: true,
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
        // We both set `propagate_came_from_default` flag to false
        // and set the data queries to return nothing if there were no matches
        // in order that we can treat the case with no matches differently from the case with a single match.
        // (Before this change, the data queries returned a single result even if there were no matches,
        // preventing this case from being distinguished from the case with a single match.)

        self.propagate_came_from_default = false;
        match &mut self.data_query {
            DataQuery::ChildPropProfile {
                always_return_value,
                ..
            } => *always_return_value = false,
            DataQuery::Attribute {
                always_return_value,
                ..
            } => *always_return_value = false,
            _ => (),
        }
        self
    }
}

impl PropUpdater<bool, RequiredData> for BooleanProp {
    fn default_value(&self) -> bool {
        self.default_value
    }

    fn return_data_queries(&self) -> Vec<DataQuery> {
        RequiredDataQueries {
            independent_state: DataQuery::State,
            booleans_and_strings: self.data_query.clone(),
        }
        .into()
    }

    #[allow(clippy::needless_return)]
    fn calculate(&mut self, data: &RequiredData) -> PropCalcResult<bool> {
        match data.booleans_and_strings.len() {
            0 => {
                if self.propagate_came_from_default {
                    // If `propagate_came_from_default` is true,
                    // this means we did not call `dont_propagate_came_from_default()`
                    // so the `always_return_value` flag must still be set to true on the data query,
                    // forcing them to return at least one value.

                    // If we reached here, then there has been a programming error violating this contract.
                    unreachable!()
                }

                // If we reach here, then we must have called `dont_propagate_came_from_default()`
                // and there were no dependencies returned from the data query.
                // This is the one case where we use `independent_state`,
                // using its `came_from_default` as well as its value.
                if data.independent_state.came_from_default() {
                    PropCalcResult::FromDefault(*data.independent_state.get())
                } else {
                    PropCalcResult::Calculated(*data.independent_state.get())
                }
            }
            1 => {
                match &data.booleans_and_strings[0] {
                    BooleanOrString::Boolean(boolean_value) => {
                        if self.propagate_came_from_default {
                            // if we are basing it on a single variable and propagating came_from_default,
                            // then we propagate came_from_default as well as the value.
                            if boolean_value.came_from_default() {
                                PropCalcResult::FromDefault(*boolean_value.get())
                            } else {
                                PropCalcResult::Calculated(*boolean_value.get())
                            }
                        } else {
                            // If we are not propagating `came_from_default`,
                            // then we set `came_from_default` to be false (by specifying `Calculated`)
                            // independent of the dependency's `came_from_default`
                            PropCalcResult::Calculated(*boolean_value.get())
                        }
                    }
                    BooleanOrString::String(string_value) => {
                        PropCalcResult::Calculated(if self.from_attribute {
                            string_attr_to_boolean(&string_value.get())
                        } else {
                            string_to_boolean(&string_value.get())
                        })
                    }
                }
            }
            _ => {
                if data
                    .booleans_and_strings
                    .iter()
                    .any(|dep_value| matches!(dep_value, BooleanOrString::Boolean(_)))
                {
                    // invalid combination. Haven't implemented boolean dependency with others
                    PropCalcResult::Calculated(false)
                } else {
                    // Have multiple string variables. Concatenate the string values into a single string

                    if data
                        .booleans_and_strings
                        .iter()
                        .any(|view| view.changed_since_last_viewed())
                    {
                        let mut value = String::new();
                        value.extend(data.booleans_and_strings.iter().map(|v| match v {
                            BooleanOrString::Boolean(boolean_val) => boolean_val.get().to_string(),
                            BooleanOrString::String(string_value) => string_value.get().to_string(),
                        }));

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

    #[allow(clippy::needless_return)]
    fn invert(
        &self,
        data: &mut RequiredData,
        prop: &PropView<bool>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        match data.booleans_and_strings.len() {
            0 => {
                if self.propagate_came_from_default {
                    // if propagate_came_from_default is true,
                    // then always_return_value is true on the string data query,
                    // so we should never reach this
                    unreachable!()
                }
                // We had no dependencies, so change the independent state variable
                let requested_value = *prop.get_requested_value();

                data.independent_state.queue_update(requested_value);

                Ok(data.queued_updates())
            }
            1 => {
                // based on a single value, so we can invert
                let requested_value = *prop.get_requested_value();
                match &mut data.booleans_and_strings[0] {
                    BooleanOrString::Boolean(boolean_value) => {
                        boolean_value.queue_update(requested_value);
                    }
                    BooleanOrString::String(string_value) => {
                        string_value.queue_update(requested_value.to_string());
                    }
                }

                Ok(data.queued_updates())
            }
            _ => Err(InvertError::CouldNotUpdate),
        }
    }
}

#[cfg(test)]
#[path = "boolean_prop.test.rs"]
mod tests;
