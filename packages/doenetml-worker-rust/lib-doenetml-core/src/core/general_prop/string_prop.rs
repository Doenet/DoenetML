use std::rc::Rc;

use crate::{components::prelude::*, core::props::InvertError, props::UpdaterObject};

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
    data_query: DataQuery,

    /// The default value that is initially returned if no dependencies were returned.
    default_value: String,

    /// If `true`, then we will propagate `came_from_default` from the dependency
    /// in the case where a single dependency is returned.
    /// If `false`, then `came_from_default` will be true only if no dependencies were found
    /// and we are returning an independent value that hasn't yet been changed from its default.
    propagate_came_from_default: bool,
}

impl StringProp {
    /// Creates a string prop that calculates its value from the component's children
    /// matching the `String` profile.
    ///
    /// If there are no matching children, the prop will be initialized with `default_value`.
    pub fn new_from_children<S: Into<String>>(default_value: S) -> Self {
        StringProp {
            data_query: DataQuery::PickProp {
                source: PickPropSource::Children,
                prop_specifier: PropSpecifier::Matching(vec![PropProfile::String]),
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
        self.propagate_came_from_default = false;
        self
    }
}

impl From<StringProp> for UpdaterObject {
    fn from(prop: StringProp) -> UpdaterObject {
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

#[derive(TryFromDataQueryResults, IntoDataQueryResults)]
#[data_query(query_trait = DataQueries, pass_data = &DataQuery)]
struct RequiredData {
    independent_state: PropView<prop_type::String>,
    strings: Vec<PropView<prop_type::String>>,
}

impl DataQueries for RequiredData {
    fn independent_state_query(_: &DataQuery) -> DataQuery {
        DataQuery::State
    }
    fn strings_query(query: &DataQuery) -> DataQuery {
        query.clone()
    }
}

impl PropUpdater for StringProp {
    type PropType = prop_type::String;

    fn default(&self) -> Self::PropType {
        self.default_value.clone().into()
    }

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(&self.data_query)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();
        let independent_state = required_data.independent_state;
        let strings = required_data.strings;

        match strings.len() {
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
                let s = strings.into_iter().next().unwrap();
                if self.propagate_came_from_default && s.came_from_default {
                    // if we are basing it on a single variable and propagating `came_from_default`,
                    // then we propagate `came_from_default` as well as the value.
                    PropCalcResult::FromDefault(s.value)
                } else {
                    // If we are not propagating `came_from_default`,
                    // then we set `came_from_default` to be false (by specifying `Calculated`)
                    // independent of the dependency's `came_from_default`
                    PropCalcResult::Calculated(s.value)
                }
            }
            _ => {
                // multiple string variables, so concatenate
                let mut value = String::new();
                for v in strings {
                    value += &v.value;
                }

                PropCalcResult::Calculated(value.into())
            }
        }
    }

    /// If the prop is determined by a single string variable,
    /// then request that variable take on the requested value for this variable.
    fn invert(
        &self,
        data: DataQueryResults,
        requested_value: Self::PropType,
        _is_direct_change_from_action: bool,
    ) -> Result<DataQueryResults, InvertError> {
        let mut desired = RequiredData::try_new_desired(&data).unwrap();
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();

        match required_data.strings.len() {
            0 => {
                // We had no dependencies, so change the independent state variable
                desired.independent_state.change_to(requested_value);
            }
            1 => {
                // based on a single string value, so we can invert
                desired.strings[0].change_to(requested_value);
            }
            _ => return Err(InvertError::CouldNotUpdate),
        }

        Ok(desired.into_data_query_results())
    }
}

#[cfg(test)]
#[path = "string_prop.test.rs"]
mod tests;
