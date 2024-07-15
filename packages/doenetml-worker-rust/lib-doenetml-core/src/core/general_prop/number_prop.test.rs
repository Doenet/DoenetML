use crate::{
    general_prop::test_utils::{
        assert_number_calculated_value, assert_number_default_result,
        return_empty_data_query_result, return_single_number_data_query_result,
        return_single_string_data_query_result, return_two_string_data_query_result,
    },
    props::cache::PropWithMeta,
};

use super::*;

/// check that a number prop created from children
/// gives the correct default and data query that requests string and number children
#[test]
fn check_default_and_child_data_queries() {
    // create a string prop requesting children
    let prop = as_updater_object::<_, prop_type::Number>(NumberProp::new_from_children(7.0));

    assert_eq!(prop.default(), PropValue::Number(7.0));

    let queries = prop.data_queries();

    assert!(matches!(queries[0], DataQuery::State));
    match &queries[1] {
        DataQuery::PickProp {
            source: PickPropSource::Children,
            prop_specifier: PropSpecifier::Matching(profiles),
        } => assert_eq!(
            profiles,
            &vec![PropProfile::Number, PropProfile::Math, PropProfile::String]
        ),
        _ => panic!("Incorrect query"),
    }
}

/// check that a number prop created from attribute
/// gives the correct default and data query that requests attribute
#[test]
fn check_default_and_attribute_data_queries() {
    // create a number prop requesting an attribute
    let prop =
        as_updater_object::<_, prop_type::Number>(NumberProp::new_from_attribute("my_attr", 7.0));

    assert_eq!(prop.default(), PropValue::Number(7.0));

    let queries = prop.data_queries();

    assert!(matches!(queries[0], DataQuery::State));
    match &queries[1] {
        DataQuery::Attribute {
            attribute_name: "my_attr",
            match_profiles: profiles,
        } => assert_eq!(
            profiles,
            &vec![PropProfile::Number, PropProfile::Math, PropProfile::String]
        ),
        _ => panic!("Incorrect query"),
    }
}

/// Check that number prop from children is calculated from the independent state dependency
/// if there are no children.
/// The result is marked as default if the independent prop is marked came_from_default.
#[test]
fn from_independent_state() {
    let prop = as_updater_object::<_, prop_type::Number>(NumberProp::new_from_children(7.0));

    let no_children = return_empty_data_query_result();

    // with default value
    let independent_state = return_single_number_data_query_result(7.0, true);
    let data = DataQueryResults::from_vec(vec![independent_state, no_children.clone()]);
    assert_number_default_result(prop.calculate_untyped(data), 7.0);

    // with non-default value
    let independent_state = return_single_number_data_query_result(1.2, false);
    let data = DataQueryResults::from_vec(vec![independent_state, no_children.clone()]);
    assert_number_calculated_value(prop.calculate_untyped(data), 1.2);
}

/// Calling invert on a number prop with no children
/// causes the independent state to receive that requested value
#[test]
fn invert_with_independent_state() {
    let prop = as_updater_object::<_, prop_type::Number>(NumberProp::new_from_children(7.0));

    let no_children = return_empty_data_query_result();
    let independent_state = return_single_number_data_query_result(7.0, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), no_children]);

    let invert_results = prop.invert_untyped(data, 5.7.into(), false).unwrap().vec;

    // request change in independent state
    assert_eq!(
        invert_results[0].values,
        vec![PropWithMeta {
            value: 5.7.into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );
}

/// If a number prop is based on a single number child,
/// its value should be the same as the number child's value,
/// and its came_from_default should be the same as the number child's came_from_default
#[test]
fn from_single_number_child() {
    let prop = as_updater_object::<_, prop_type::Number>(NumberProp::new_from_children(0.7));

    let independent_state = return_single_number_data_query_result(3.1, true);

    // with single number child, from default
    let number_child = return_single_number_data_query_result(8.6, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), number_child]);
    assert_number_default_result(prop.calculate_untyped(data), 8.6);

    // with single number child, non-default
    let number_child = return_single_number_data_query_result(9.1, false);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), number_child]);
    assert_number_calculated_value(prop.calculate_untyped(data), 9.1);
}

/// Calling invert on a number prop with a single number child
/// causes the child to receive that requested value
#[test]
fn invert_with_single_number_child() {
    let prop = as_updater_object::<_, prop_type::Number>(NumberProp::new_from_children(0.7));

    let independent_state = return_single_number_data_query_result(3.1, true);

    // with single number child, from default
    let number_child = return_single_number_data_query_result(8.6, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), number_child]);

    let invert_results = prop.invert_untyped(data, 2.9.into(), false).unwrap().vec;

    // independent state is unchanged
    assert_eq!(invert_results[0].values[0].changed, false);
    // request change in child
    assert_eq!(
        invert_results[1].values,
        vec![PropWithMeta {
            value: 2.9.into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );
}

/// Check that number prop from string children is calculated by concatenating the children dependencies
/// and ignoring the independent state dependency.
/// The result is never marked as default.
#[test]
fn from_string_children() {
    let prop = as_updater_object::<_, prop_type::Number>(NumberProp::new_from_children(0.7));

    let independent_state = return_single_number_data_query_result(3.1, true);

    // with single string child, ignore default
    let single_child = return_single_string_data_query_result("8", true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), single_child]);
    assert_number_calculated_value(prop.calculate_untyped(data), 8.0);

    // with single child, non-default
    let single_child = return_single_string_data_query_result("6", false);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), single_child]);
    assert_number_calculated_value(prop.calculate_untyped(data), 6.0);
}

/// Calling invert on a number prop with string children
/// succeeds only if there is just one child
#[test]
fn invert_with_string_children() {
    let prop = as_updater_object::<_, prop_type::Number>(NumberProp::new_from_children(0.7));

    let independent_state = return_single_number_data_query_result(3.1, true);

    let single_child = return_single_string_data_query_result("6", true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), single_child]);

    let invert_results = prop.invert_untyped(data, 7.5.into(), false).unwrap().vec;

    // independent state is unchanged
    assert_eq!(invert_results[0].values[0].changed, false);
    // request change in child
    assert_eq!(
        invert_results[1].values,
        vec![PropWithMeta {
            value: "7.5".into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );

    // with two children, cannot invert
    let two_children = return_two_string_data_query_result("7", "3", true, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), two_children]);

    let invert_results = prop.invert_untyped(data, 21.0.into(), false);
    assert!(invert_results.is_err());
}

/// If a number prop is based on a single number attribute component,
/// its value should be the same as the number component's value
/// and its came_from_default should be the same as the number component's came_from_default
#[test]
fn number_prop_calculated_from_single_number_attribute_component() {
    let prop =
        as_updater_object::<_, prop_type::Number>(NumberProp::new_from_attribute("my_attr", 0.7));

    let independent_state = return_single_number_data_query_result(3.1, true);

    // with single number attribute component, from default
    let attribute_component = return_single_number_data_query_result(8.6, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), attribute_component]);
    assert_number_default_result(prop.calculate_untyped(data), 8.6);

    // with single number attribute component, non-default
    let attribute_component = return_single_number_data_query_result(5.8, false);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), attribute_component]);
    assert_number_calculated_value(prop.calculate_untyped(data), 5.8);
}
