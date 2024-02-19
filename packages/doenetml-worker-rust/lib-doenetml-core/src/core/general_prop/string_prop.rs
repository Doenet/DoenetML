use crate::components::prelude::*;

/// A string prop that calculates its value by concatenating all string dependencies.
///
/// If the prop has a single dependency,
/// then it propagates the `came_from_default` attribute.
///
/// The string prop can be created via the constructors:
/// - `new(data_query)`: base the value on an arbitrary data query
/// - `new_from_children(default_value)`: base the value on the component's `Text` children,
///   falling back to `default_value` if there are no matching children.
/// - `new_from_attribute(attr_name, default_value)`: base the value on the component's `attr_name` attribute.
///   The calculation will use the `Text` children of the attribute,
///   falling back to `default_value` if there are no matching children.
#[derive(Debug, Default)]
pub struct StringProp {
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
    default_value: String,

    /// If `true`, then we will propagate `came_from_default` from the dependency
    /// in the case where a single dependency is returned.
    /// If `false`, then `came_from_default` will be true only if no dependencies were found
    /// and we are returning an independent value that hasn't yet been changed from its default.
    propagate_came_from_default: bool,
}

/// The data required to compute the value of this prop.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData {
    /// An independent state variable (that doesn't have any dependencies)
    /// that is used if `propagate_came_from_default` is false
    /// to store the value when there are no dependencies.
    independent_state: PropView<String>,

    /// A vector of the string values of the dependencies coming from the data_query
    strings: Vec<PropView<String>>,
}

impl StringProp {
    /// Creates a string prop that calculates its value from the component's children
    /// matching the `String`  profile.
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
    pub fn new_from_children<S: Into<String>>(
        default_value: S,
        propagate_came_from_default: bool,
    ) -> Self {
        StringProp {
            data_query: DataQuery::ChildPropProfile {
                match_profiles: vec![ComponentProfile::String],
                always_return_value: propagate_came_from_default,
            },
            default_value: default_value.into(),
            propagate_came_from_default,
        }
    }

    /// Creates a string prop that calculates its value from the attribute given by `attr_name`,
    /// basing the calculation on the attribute components that match the `String` profile.
    ///
    /// If there are no matching attribute components, the prop will be initialized with `default_value`.
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
    pub fn new_from_attribute<S: Into<String>>(
        attr_name: AttributeName,
        default_value: S,
        propagate_came_from_default: bool,
    ) -> Self {
        StringProp {
            data_query: DataQuery::Attribute {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::String],
                always_return_value: propagate_came_from_default,
            },
            default_value: default_value.into(),
            propagate_came_from_default,
        }
    }
}

impl PropUpdater<String, RequiredData> for StringProp {
    fn default_value(&self) -> String {
        self.default_value.clone()
    }

    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            independent_state: Some(DataQuery::State),
            strings: Some(self.data_query.clone()),
        }
        .into()
    }

    fn calculate(&mut self, data: &RequiredData) -> PropCalcResult<String> {
        match data.strings.len() {
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
                if self.propagate_came_from_default {
                    // if we are basing it on a single variable and propagating came_from_default,
                    // then we propagate came_from_default as well as the value.
                    data.strings[0].prop_calc_result()
                } else {
                    // If we are not propagating came_from_default,
                    // then came_from_default will be false independent of the dependency's came_from_default
                    PropCalcResult::Calculated(data.strings[0].get().clone())
                }
            }
            _ => {
                // multiple string variables, so concatenate

                if data
                    .strings
                    .iter()
                    .any(|view| view.changed_since_last_viewed())
                {
                    let mut value = String::new();
                    value.extend(data.strings.iter().map(|v| v.get().clone()));

                    PropCalcResult::Calculated(value)
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
        data: &mut RequiredData,
        prop: &PropView<String>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        match data.strings.len() {
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
                // based on a single string value, so we can invert
                let requested_value = prop.get_requested_value();

                data.strings[0].queue_update(requested_value.clone());

                Ok(data.queued_updates())
            }
            _ => Err(InvertError::CouldNotUpdate),
        }
    }
}

#[cfg(test)]
#[path = "string_prop.test.rs"]
mod tests;
