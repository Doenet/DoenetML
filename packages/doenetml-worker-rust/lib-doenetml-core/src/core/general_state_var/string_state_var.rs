use crate::{components::prelude::*, ExtendSource};

use super::util::create_data_query_if_match_extend_source;

/// A string state variable interface that concatenates all string dependencies.
///
/// If the component has an extend source so that this variable is shadowing another variable,
/// then prepend the shadowed state variable to the list of dependencies.
///
/// If the state variable has a single dependency that is an essential state variable,
/// then propagate the `came_from_default` attribute of the essential state variable.
#[derive(Debug, Default)]
pub struct StringStateVar {
    /// The base data query that indicates how the dependencies of this state variable will be created.
    base_data_query: DataQuery,

    default_value: String,
}

/// The data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct StringRequiredData {
    /// If this state variable is extending another state variable,
    /// the value that is being extended
    extending: Option<StateVarView<String>>,

    /// A vector of the string values of the dependencies coming from the base_data_query
    base: Vec<StateVarView<String>>,

    /// If not extending and don't have any base data,
    /// then use this essential value, which will be initialized with the default value
    essential: StateVarView<String>,
}

impl StringStateVar {
    /// Creates a state var that queries its value from the given data query.
    pub fn new(base_data_query: DataQuery) -> Self {
        StringStateVar {
            base_data_query,
            ..Default::default()
        }
    }

    /// Creates a state var that queries its value from children matching the `Text` profile.
    pub fn new_from_children(default_value: String) -> Self {
        StringStateVar {
            base_data_query: DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text],
                exclude_if_prefer_profiles: vec![],
            },
            default_value,
        }
    }

    /// Creates a state var that queries its value from attr given by `attr_name`,
    /// returning the attribute children that match the `Text` profile.
    pub fn new_from_attribute(attr_name: AttributeName, default_value: String) -> Self {
        StringStateVar {
            base_data_query: DataQuery::AttributeChild {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::Text],
            },
            default_value,
        }
    }
}

impl StateVarUpdater<String, StringRequiredData> for StringStateVar {
    fn default_value(&self) -> String {
        self.default_value.clone()
    }

    fn return_data_queries(
        &self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<Option<DataQuery>> {
        StringRequiredDataQueries {
            extending: create_data_query_if_match_extend_source(extending, state_var_idx),
            base: Some(self.base_data_query.clone()),
            essential: Some(DataQuery::Essential),
        }
        .into()
    }

    fn calculate(data: &StringRequiredData) -> StateVarCalcResult<String> {
        // concatenate the strings from extending and the base data query
        let mut strings = if let Some(extending) = data.extending.as_ref() {
            vec![extending]
        } else {
            vec![]
        };

        strings.extend(data.base.iter());

        match strings.len() {
            0 => {
                // not extending and have no base dependencies, so use the essential value,
                // propagating came_from_default as well as the value
                if data.essential.came_from_default() {
                    return StateVarCalcResult::FromDefault(data.essential.get().clone());
                } else {
                    return StateVarCalcResult::Calculated(data.essential.get().clone());
                }
            }
            1 => {
                if strings[0].came_from_default() {
                    // if we are basing it on a single variable that came from default,
                    // then we propagate came_from_default as well as the value.
                    return StateVarCalcResult::FromDefault(strings[0].get().clone());
                } else {
                    return StateVarCalcResult::Calculated(strings[0].get().clone());
                }
            }
            _ => {
                // multiple string variables, so concatenate
                let mut value = String::new();
                value.extend(strings.iter().map(|v| v.get().clone()));

                StateVarCalcResult::Calculated(value)
            }
        }
    }

    /// If the state variable is determined by a single string variable or an essential variable,
    /// then request that variable take on the requested value for this variable.
    fn invert(
        data: &mut StringRequiredData,
        state_var: &StateVarView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        // concatenate the strings from extending and the base data query
        let mut strings = if let Some(extending) = data.extending.as_mut() {
            vec![extending]
        } else {
            vec![]
        };

        strings.extend(data.base.iter_mut());

        match strings.len() {
            0 => {
                // Not extending and have no base dependencies, so set the essential value.
                data.essential
                    .queue_update(state_var.get_requested_value().clone());
                Ok(data.queued_updates())
            }
            1 => {
                // based on a single string value, so we can invert
                let requested_value = state_var.get_requested_value();

                strings[0].queue_update(requested_value.clone());

                Ok(data.queued_updates())
            }
            _ => Err(RequestDependencyUpdateError::CouldNotUpdate),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn string_state_var_with_no_dependencies() {
        // set up data that consists of just the essential variable
        let mut string_data = StringRequiredData::default();
        let essential = StateVarMutableView::new_with_value("".to_string(), true);
        string_data.essential = essential.create_new_read_only_view();

        // add meta data needed for invert to work. Use arbitrary values just to test.
        string_data._data_query_mapping_data.essential.push((5, 7));

        // a call to calculate gives the default "", as that is what essential contains
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::FromDefault("".to_string())
        );

        // if change the value of essential, get calculated value with new value
        essential.set_value("hello".to_string());
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("hello".to_string())
        );

        // if change the value of essential as though it were the default,
        // get the new default value
        essential.set_value_from_default("bye".to_string());
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::FromDefault("bye".to_string())
        );

        // set up a view of the state variable itself, as needed for invert
        let state_var = StateVarMutableView::new_with_value("".to_string(), false);
        state_var.set_requested_value("new".to_string());
        let state_var_view = state_var.create_new_read_only_view();

        // we get an Ok result from invert
        let invert_result =
            StringStateVar::invert(&mut string_data, &state_var_view, false).unwrap();

        // the request is to change corresponds to the mapping data we made for essential
        assert_eq!(invert_result.len(), 1);
        assert_eq!(
            invert_result[0],
            DependencyValueUpdateRequest {
                data_query_idx: 5,
                dependency_idx: 7
            }
        );

        // the essential value was requested to change to the new value
        assert_eq!(
            essential.get_requested_value().to_string(),
            "new".to_string()
        );
    }

    #[test]
    fn string_state_var_with_one_base_dependency() {
        // set up data that consists of the essential variable and one base variable
        let mut string_data = StringRequiredData::default();
        let essential = StateVarMutableView::new_with_value("".to_string(), true);
        string_data.essential = essential.create_new_read_only_view();

        let base = StateVarMutableView::new_with_value("the".to_string(), false);
        string_data.base = vec![base.create_new_read_only_view()];

        // add meta data needed for invert to work. Use arbitrary values just to test.
        string_data._data_query_mapping_data.base.push((3, 2));

        // a call to calculate matches the base variable
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("the".to_string())
        );

        // the essential variable is being ignored, so changes to it do not alter the calculation
        essential.set_value("hello".to_string());
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("the".to_string())
        );

        base.set_value("other".to_string());
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("other".to_string())
        );

        // set up a view of the state variable itself, as needed for invert
        let state_var = StateVarMutableView::new_with_value("".to_string(), false);
        state_var.set_requested_value("new".to_string());
        let state_var_view = state_var.create_new_read_only_view();

        // we get an Ok result from invert
        let invert_result =
            StringStateVar::invert(&mut string_data, &state_var_view, false).unwrap();

        // the request is to change corresponds to the mapping data we made for essential
        assert_eq!(invert_result.len(), 1);
        assert_eq!(
            invert_result[0],
            DependencyValueUpdateRequest {
                data_query_idx: 3,
                dependency_idx: 2
            }
        );

        // the base value was requested to change to the new value
        assert_eq!(base.get_requested_value().to_string(), "new".to_string());
    }

    #[test]
    fn string_state_var_with_two_base_dependencies() {
        // set up data that consists of the essential variable and two base variables
        let mut string_data = StringRequiredData::default();
        let essential = StateVarMutableView::new_with_value("".to_string(), true);
        string_data.essential = essential.create_new_read_only_view();

        let base1 = StateVarMutableView::new_with_value("Hello".to_string(), false);
        let base2 = StateVarMutableView::new_with_value("World".to_string(), false);
        string_data.base = vec![
            base1.create_new_read_only_view(),
            base2.create_new_read_only_view(),
        ];

        // add meta data needed for invert to work. Use arbitrary values just to test.
        string_data._data_query_mapping_data.base.push((3, 2));
        string_data._data_query_mapping_data.base.push((5, 1));

        // a call to calculate matches the concatenation of the base variables
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("HelloWorld".to_string())
        );

        // the essential variable is being ignored, so changes to it do not alter the calculation
        essential.set_value("bye".to_string());
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("HelloWorld".to_string())
        );

        base2.set_value("Earth".to_string());
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("HelloEarth".to_string())
        );

        // set up a view of the state variable itself, as needed for invert
        let state_var = StateVarMutableView::new_with_value("".to_string(), false);
        state_var.set_requested_value("new".to_string());
        let state_var_view = state_var.create_new_read_only_view();

        // we get an Err result from invert
        let invert_result = StringStateVar::invert(&mut string_data, &state_var_view, false);

        assert!(invert_result.is_err());
    }

    #[test]
    fn string_state_var_just_extending() {
        // set up data that consists of the essential variable and an extending variable
        let mut string_data = StringRequiredData::default();
        let essential = StateVarMutableView::new_with_value("".to_string(), true);
        string_data.essential = essential.create_new_read_only_view();

        let extending = StateVarMutableView::new_with_value("the".to_string(), false);
        string_data.extending = Some(extending.create_new_read_only_view());

        // add meta data needed for invert to work. Use arbitrary values just to test.
        string_data._data_query_mapping_data.extending.push((3, 2));

        // a call to calculate matches the extending variable
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("the".to_string())
        );

        // the essential variable is being ignored, so changes to it do not alter the calculation
        essential.set_value("hello".to_string());
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("the".to_string())
        );

        extending.set_value("other".to_string());
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("other".to_string())
        );

        // set up a view of the state variable itself, as needed for invert
        let state_var = StateVarMutableView::new_with_value("".to_string(), false);
        state_var.set_requested_value("new".to_string());
        let state_var_view = state_var.create_new_read_only_view();

        // we get an Ok result from invert
        let invert_result =
            StringStateVar::invert(&mut string_data, &state_var_view, false).unwrap();

        // the request is to change corresponds to the mapping data we made for essential
        assert_eq!(invert_result.len(), 1);
        assert_eq!(
            invert_result[0],
            DependencyValueUpdateRequest {
                data_query_idx: 3,
                dependency_idx: 2
            }
        );

        // the extending value was requested to change to the new value
        assert_eq!(
            extending.get_requested_value().to_string(),
            "new".to_string()
        );
    }

    #[test]
    fn string_state_var_extending_and_with_one_base_dependency() {
        // set up data that consists of the essential variable, and extending, and one base variable
        let mut string_data = StringRequiredData::default();
        let essential = StateVarMutableView::new_with_value("".to_string(), true);
        string_data.essential = essential.create_new_read_only_view();

        let extending = StateVarMutableView::new_with_value("Hello".to_string(), false);
        string_data.extending = Some(extending.create_new_read_only_view());

        let base = StateVarMutableView::new_with_value("World".to_string(), false);
        string_data.base = vec![base.create_new_read_only_view()];

        // add meta data needed for invert to work. Use arbitrary values just to test.
        string_data._data_query_mapping_data.extending.push((3, 2));
        string_data._data_query_mapping_data.base.push((5, 1));

        // a call to calculate matches the concatenation of the base variables
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("HelloWorld".to_string())
        );

        // the essential variable is being ignored, so changes to it do not alter the calculation
        essential.set_value("bye".to_string());
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("HelloWorld".to_string())
        );

        base.set_value("Earth".to_string());
        assert_eq!(
            StringStateVar::calculate(&string_data),
            StateVarCalcResult::Calculated("HelloEarth".to_string())
        );

        // set up a view of the state variable itself, as needed for invert
        let state_var = StateVarMutableView::new_with_value("".to_string(), false);
        state_var.set_requested_value("new".to_string());
        let state_var_view = state_var.create_new_read_only_view();

        // we get an Err result from invert
        let invert_result = StringStateVar::invert(&mut string_data, &state_var_view, false);

        assert!(invert_result.is_err());
    }
}
