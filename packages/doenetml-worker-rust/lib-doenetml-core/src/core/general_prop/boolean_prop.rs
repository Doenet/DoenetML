use crate::components::prelude::*;

use super::util::{string_attr_to_boolean, string_to_boolean, BooleanOrString};

/// A boolean prop that calculates its value from dependencies.
///
/// The current version is in a preliminary form, where the only valid options are
/// - a single boolean dependency
/// - string dependencies (that are concatenated to see if they spell out "true")
///
/// If the prop has a single boolean dependency,
/// then it propagates the `came_from_default` attribute.
///
/// The boolean prop can be created via the constructors:
/// - `new(data_query)`: base the value on an arbitrary data query
/// - `new_from_children(default_value)`: base the value on the component's `Boolean` and `Text` children,
///   falling back to `default_value` if there are no matching children.
/// - `new_from_attribute(attr_name, default_value)`: base the value on the component's `attr_name` attribute.
///   The calculation will use the `Boolean` and `Text` children of the attribute,
///   falling back to `default_value` if there are no matching children.
#[derive(Debug, Default)]
pub struct BooleanProp {
    /// The data query that indicates how the dependencies of this prop will be created.
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
    /// An independent state variable (that doesn't have any dependencies)
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
    pub fn new_from_children(default_value: bool, propagate_came_from_default: bool) -> Self {
        BooleanProp {
            data_query: DataQuery::ChildPropProfile {
                match_profiles: vec![ComponentProfile::String, ComponentProfile::Boolean],
                always_return_value: propagate_came_from_default,
            },
            default_value,
            propagate_came_from_default,
            from_attribute: false,
        }
    }

    /// Creates a boolean prop that calculates its value from the attribute given by `attr_name`,
    /// basing the calculation on the attribute children that match the `String` or `Boolean` profile.
    ///
    /// If there are no matching attribute children, the prop will be initialized with `default_value`.
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
    pub fn new_from_attribute(
        attr_name: AttributeName,
        default_value: bool,
        propagate_came_from_default: bool,
    ) -> Self {
        BooleanProp {
            data_query: DataQuery::Attribute {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::String, ComponentProfile::Boolean],
                always_return_value: propagate_came_from_default,
            },
            default_value,
            propagate_came_from_default,
            from_attribute: true,
        }
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
                match &data.booleans_and_strings[0] {
                    BooleanOrString::Boolean(boolean_value) => {
                        if self.propagate_came_from_default {
                            // if we are basing it on a single variable and propagating came_from_default,
                            // then we propagate came_from_default as well as the value.
                            boolean_value.prop_calc_result()
                        } else {
                            // If we are not propagating came_from_default,
                            // then came_from_default will be false independent of the dependency's came_from_default
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
