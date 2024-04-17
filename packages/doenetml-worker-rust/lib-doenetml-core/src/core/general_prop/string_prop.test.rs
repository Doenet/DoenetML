use crate::props::cache::PropWithMeta;

use super::*;
use setup_functions::*;

/// check that a string prop created from children
/// gives the correct default and data query that requests string children
#[test]
fn check_default_and_child_data_queries() {
    // create a string prop requesting children
    let prop = as_updater_object::<_, prop_type::String>(StringProp::new_from_children(
        String::from("this default"),
    ));

    assert_eq!(
        prop.default(),
        PropValue::String(Rc::new(String::from("this default")))
    );

    let queries = prop.data_queries();

    assert!(matches!(queries[0], DataQuery::State));
    match &queries[1] {
        DataQuery::PickProp {
            source: PickPropSource::Children,
            prop_specifier: PropSpecifier::Matching(profiles),
        } => assert_eq!(profiles, &vec![PropProfile::String]),
        _ => panic!("Incorrect query"),
    }
}

/// check that a string prop created from attribute
/// gives the correct default and data query that requests attribute
#[test]
fn check_default_and_attribute_data_queries() {
    // create a string prop requesting children
    let prop = as_updater_object::<_, prop_type::String>(StringProp::new_from_attribute(
        "my_attr",
        String::from("this default"),
    ));

    assert_eq!(
        prop.default(),
        PropValue::String(Rc::new(String::from("this default")))
    );

    let queries = prop.data_queries();

    assert!(matches!(queries[0], DataQuery::State));
    match &queries[1] {
        DataQuery::Attribute {
            attribute_name: "my_attr",
            match_profiles: profiles,
        } => assert_eq!(profiles, &vec![PropProfile::String]),
        _ => panic!("Incorrect query"),
    }
}

/// Check that string prop from children is calculated from the independent state dependency
/// if there are no children.
/// The result is marked as default if the independent prop is marked came_from_default.
#[test]
fn from_independent_state() {
    let prop =
        as_updater_object::<_, prop_type::String>(StringProp::new_from_children(String::from("")));

    let no_children = DataQueryResult { values: vec![] };

    // with default value
    let independent_state = return_single_string_data_query_result("", true);
    let data = DataQueryResults::from_vec(vec![independent_state, no_children.clone()]);
    assert_string_default_result(prop.calculate_untyped(data), "");

    // with non-default value
    let independent_state = return_single_string_data_query_result("hello", false);
    let data = DataQueryResults::from_vec(vec![independent_state, no_children.clone()]);
    assert_string_calculated_value(prop.calculate_untyped(data), "hello");
}

/// Check that string prop from children is calculated by concatenating the children dependencies
/// and ignoring the independent state dependency.
/// If there is a single child dependency, then the result is marked as default
/// if the child prop is marked came_from_default.
#[test]
fn from_children() {
    let prop =
        as_updater_object::<_, prop_type::String>(StringProp::new_from_children(String::from("")));

    let independent_state = return_single_string_data_query_result("", true);

    // with single child, from default
    let single_child = return_single_string_data_query_result("hello", true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), single_child]);
    assert_string_default_result(prop.calculate_untyped(data), "hello");

    // with single child, non-default
    let single_child = return_single_string_data_query_result("hello", false);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), single_child]);
    assert_string_calculated_value(prop.calculate_untyped(data), "hello");

    // with two children, ignore default
    let two_children = return_two_string_data_query_result("hello", " world!", true, true);
    let data = DataQueryResults::from_vec(vec![independent_state.clone(), two_children]);
    assert_string_calculated_value(prop.calculate_untyped(data), "hello world!");
}

/// Calling invert on a string prop from children with no children,
/// causes the independent prop to be requested to change
#[test]
fn invert_with_independent_state() {
    let prop =
        as_updater_object::<_, prop_type::String>(StringProp::new_from_children(String::from("")));

    let no_children = DataQueryResult { values: vec![] };
    let independent_state = return_single_string_data_query_result("", true);
    let data = DataQueryResults::from_vec(vec![independent_state, no_children]);

    let invert_results = prop.invert_untyped(data, "new".into(), false).unwrap().vec;

    // don't have any children
    assert!(invert_results[1].values.is_empty());
    // request change in independent state
    assert_eq!(
        invert_results[0].values,
        vec![PropWithMeta {
            value: "new".into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );
}

/// Calling invert on a string prop with a single string child
/// causes the child prop to be requested to change
#[test]
fn invert_string_prop_that_has_a_single_string_child() {
    let prop =
        as_updater_object::<_, prop_type::String>(StringProp::new_from_children(String::from("")));

    let independent_state = return_single_string_data_query_result("", true);

    // with single child, from default
    let single_child = return_single_string_data_query_result("hello", true);

    let data = DataQueryResults::from_vec(vec![independent_state, single_child]);

    let invert_results = prop.invert_untyped(data, "new".into(), false).unwrap().vec;

    // independent state is unchanged
    assert_eq!(invert_results[0].values[0].changed, false);
    // request change in child
    assert_eq!(
        invert_results[1].values,
        vec![PropWithMeta {
            value: "new".into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );
}

/// Cannot invert a string prop with a two string children
#[test]
fn cannot_invert_string_prop_that_has_two_string_children() {
    let prop =
        as_updater_object::<_, prop_type::String>(StringProp::new_from_children(String::from("")));

    let independent_state = return_single_string_data_query_result("", true);

    let two_children = return_two_string_data_query_result("hello", " world!", true, true);
    let data = DataQueryResults::from_vec(vec![independent_state, two_children]);

    let invert_results = prop.invert_untyped(data, "new".into(), false);

    assert!(invert_results.is_err());
}

mod setup_functions {

    use super::*;

    pub fn return_single_string_data_query_result(
        value: &str,
        came_from_default: bool,
    ) -> DataQueryResult {
        DataQueryResult {
            values: vec![PropWithMeta {
                value: PropValue::String(value.to_string().into()),
                came_from_default,
                changed: true,
                origin: None,
            }],
        }
    }

    pub fn return_two_string_data_query_result(
        value1: &str,
        value2: &str,
        came_from_default1: bool,
        came_from_default2: bool,
    ) -> DataQueryResult {
        DataQueryResult {
            values: vec![
                PropWithMeta {
                    value: PropValue::String(value1.to_string().into()),
                    came_from_default: came_from_default1,
                    changed: true,
                    origin: None,
                },
                PropWithMeta {
                    value: PropValue::String(value2.to_string().into()),
                    came_from_default: came_from_default2,
                    changed: true,
                    origin: None,
                },
            ],
        }
    }

    pub fn assert_string_calculated_value(result: PropCalcResult<PropValue>, value: &str) {
        let value: PropValue = value.into();

        match result {
            PropCalcResult::FromDefault(_) => {
                panic!("incorrectly from default")
            }
            PropCalcResult::Calculated(string_prop) => {
                assert_eq!(string_prop, value)
            }
            PropCalcResult::NoChange => panic!("Incorrectly no change"),
        }
    }

    pub fn assert_string_default_result(result: PropCalcResult<PropValue>, value: &str) {
        let value: PropValue = value.into();

        match result {
            PropCalcResult::FromDefault(string_prop) => {
                assert_eq!(string_prop, value)
            }
            PropCalcResult::Calculated(_) => {
                panic!("incorrectly calculated")
            }
            PropCalcResult::NoChange => panic!("Incorrectly no change"),
        }
    }
}
