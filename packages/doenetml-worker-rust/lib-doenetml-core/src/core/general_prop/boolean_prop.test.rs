use crate::{
    general_prop::test_utils::{
        assert_boolean_calculated_value, assert_boolean_default_result,
        return_empty_data_query_result, return_single_boolean_data_query_result,
        return_single_string_data_query_result, return_two_string_data_query_result,
    },
    props::cache::PropWithMeta,
};

use super::*;

/// check that a boolean prop created from children
/// gives the correct default and data query that requests string and boolean children
#[test]
fn check_default_and_child_data_queries() {
    // create a string prop requesting children
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_children(true));

    assert_eq!(prop.default(), PropValue::Boolean(true));

    let queries = prop.data_queries();

    assert!(matches!(queries[0], DataQuery::State));
    match &queries[1] {
        DataQuery::PickProp {
            source: PickPropSource::Children,
            prop_specifier: PropSpecifier::Matching(profiles),
        } => assert_eq!(profiles, &vec![PropProfile::String, PropProfile::Boolean]),
        _ => panic!("Incorrect query"),
    }
}

/// check that a boolean prop created from attribute
/// gives the correct default and data query that requests attribute
#[test]
fn check_default_and_attribute_data_queries() {
    // create a boolean prop requesting an attribute
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_attribute(
        "my_attr", true,
    ));

    assert_eq!(prop.default(), PropValue::Boolean(true));

    let queries = prop.data_queries();

    assert!(matches!(queries[0], DataQuery::State));
    match &queries[1] {
        DataQuery::Attribute {
            attribute_name: "my_attr",
            match_profiles: profiles,
        } => assert_eq!(profiles, &vec![PropProfile::String, PropProfile::Boolean]),
        _ => panic!("Incorrect query"),
    }
}

/// Check that boolean prop from children is calculated from the independent state dependency
/// if there are no children.
/// The result is marked as default if the independent prop is marked came_from_default.
#[test]
fn from_independent_state() {
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_children(false));

    let no_children = return_empty_data_query_result();

    // with default value
    let independent_state = return_single_boolean_data_query_result(false, true);
    let data = DataQueryResults::from_vec(vec![independent_state, no_children.clone()]);
    assert_boolean_default_result(prop.calculate_untyped(data), false);

    // with non-default value
    let independent_state = return_single_boolean_data_query_result(true, false);
    let data = DataQueryResults::from_vec(vec![independent_state, no_children.clone()]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), true);
}

/// Calling invert on a boolean prop with no children
/// causes the independent state to receive that requested value
#[test]
fn invert_with_independent_state() {
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_children(false));

    let no_children = return_empty_data_query_result();
    let independent_state = return_single_boolean_data_query_result(false, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), no_children]);

    let invert_results = prop.invert_untyped(data, true.into(), false).unwrap().vec;

    // request change in independent state
    assert_eq!(
        invert_results[0].values,
        vec![PropWithMeta {
            value: true.into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );
}

/// If a boolean prop is based on a single boolean child,
/// its value should be the same as the boolean child's value,
/// and its came_from_default should be the same as the boolean child's came_from_default
#[test]
fn from_single_boolean_child() {
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_children(false));

    let independent_state = return_single_boolean_data_query_result(false, true);

    // with single boolean child, from default
    let boolean_child = return_single_boolean_data_query_result(false, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), boolean_child]);
    assert_boolean_default_result(prop.calculate_untyped(data), false);

    // with single boolean child, non-default
    let boolean_child = return_single_boolean_data_query_result(true, false);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), boolean_child]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), true);
}

/// Calling invert on a boolean prop with a single boolean child
/// causes the child to receive that requested value
#[test]
fn invert_with_single_boolean_child() {
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_children(false));

    let independent_state = return_single_boolean_data_query_result(false, true);

    // with single boolean child, from default
    let boolean_child = return_single_boolean_data_query_result(false, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), boolean_child]);

    let invert_results = prop.invert_untyped(data, true.into(), false).unwrap().vec;

    // independent state is unchanged
    assert_eq!(invert_results[0].values[0].changed, false);
    // request change in child
    assert_eq!(
        invert_results[1].values,
        vec![PropWithMeta {
            value: true.into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );
}

/// Check that boolean prop from string children is calculated by concatenating the children dependencies
/// and ignoring the independent state dependency.
/// The result is never marked as default.
#[test]
fn from_string_children() {
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_children(false));

    let independent_state = return_single_boolean_data_query_result(false, true);

    // with single string child, ignore default
    let single_child = return_single_string_data_query_result("false", true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), single_child]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), false);

    // with single child, non-default
    let single_child = return_single_string_data_query_result("true", false);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), single_child]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), true);

    // with two children, ignore default
    let two_children = return_two_string_data_query_result("tr", "ue", true, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), two_children]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), true);
}

/// Calling invert on a boolean prop with string children
/// succeeds only if there is just one child
#[test]
fn invert_with_string_children() {
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_children(false));

    let independent_state = return_single_boolean_data_query_result(false, true);

    let single_child = return_single_string_data_query_result("false", true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), single_child]);

    let invert_results = prop.invert_untyped(data, true.into(), false).unwrap().vec;

    // independent state is unchanged
    assert_eq!(invert_results[0].values[0].changed, false);
    // request change in child
    assert_eq!(
        invert_results[1].values,
        vec![PropWithMeta {
            value: "true".into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );

    // with two children, cannot invert
    let two_children = return_two_string_data_query_result("tr", "ue", true, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), two_children]);

    let invert_results = prop.invert_untyped(data, true.into(), false);
    assert!(invert_results.is_err());
}

/// A boolean prop based on a single blank string child is false
#[test]
fn boolean_prop_calculated_from_a_blank_string_child_is_false() {
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_children(false));

    let independent_state = return_single_boolean_data_query_result(false, true);

    // with single string child, ignore default
    let single_child = return_single_string_data_query_result("", true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), single_child]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), false);
}

/// A boolean prop based on a string child is calculated
/// in a case-insensitive manner
#[test]
fn boolean_prop_calculated_from_string_child_in_case_insensitive_way() {
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_children(false));

    let independent_state = return_single_boolean_data_query_result(false, true);

    // TruE is true
    let single_child = return_single_string_data_query_result("TruE", true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), single_child]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), true);

    // the value of "T" leads to false
    let single_child = return_single_string_data_query_result("T", true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), single_child]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), false);
}

/// If a boolean prop is based on a single boolean attribute component,
/// its value should be the same as the boolean component's value
/// and its came_from_default should be the same as the boolean component's came_from_default
#[test]
fn boolean_prop_calculated_from_single_boolean_attribute_component() {
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_attribute(
        "my_attr", false,
    ));

    let independent_state = return_single_boolean_data_query_result(false, true);

    // with single boolean attribute component, from default
    let attribute_component = return_single_boolean_data_query_result(true, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), attribute_component]);
    assert_boolean_default_result(prop.calculate_untyped(data), true);

    // with single boolean attribute component, non-default
    let attribute_component = return_single_boolean_data_query_result(true, false);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), attribute_component]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), true);
}

/// A boolean prop based on a single blank string attribute component is true
#[test]
fn boolean_prop_calculated_from_a_blank_string_attribute_component_is_true() {
    let prop = as_updater_object::<_, prop_type::Boolean>(BooleanProp::new_from_attribute(
        "my_attr", false,
    ));

    let independent_state = return_single_boolean_data_query_result(false, true);

    // the initial value of "" leads to false
    let attribute_component = return_single_string_data_query_result("", true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), attribute_component]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), true);

    // changing attribute to be " ", results in prop being false
    let attribute_component = return_single_string_data_query_result(" ", true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), attribute_component]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), false);
}
