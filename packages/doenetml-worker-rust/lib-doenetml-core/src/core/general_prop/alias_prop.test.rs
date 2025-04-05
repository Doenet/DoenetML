use crate::props::cache::PropWithMeta;

use super::*;
use setup_functions::*;

/// check that a prop alias
/// gives the correct data query that requests the prop index specified
#[test]
fn prop_alias_gives_correct_data_queries() {
    // boolean
    let local_prop_idx: LocalPropIdx = 3.into();
    let prop = as_updater_object::<_, prop_type::Boolean>(PropAlias::new(local_prop_idx));

    let queries = prop.data_queries();

    match queries[0] {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: PropSpecifier::LocalIdx(idx),
        } => assert_eq!(idx, local_prop_idx),
        _ => panic!("Incorrect query"),
    }

    // String
    let local_prop_idx: LocalPropIdx = 4.into();
    let prop = as_updater_object::<_, prop_type::String>(PropAlias::new(local_prop_idx));

    let queries = prop.data_queries();

    match queries[0] {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: PropSpecifier::LocalIdx(idx),
        } => assert_eq!(idx, local_prop_idx),
        _ => panic!("Incorrect query"),
    }
}

/// For a boolean prop alias,
/// its value should be the same as the boolean data,
/// and its came_from_default should be the same as the boolean data's came_from_default
#[test]
fn calculate_boolean_prop_alias() {
    let prop = as_updater_object::<_, prop_type::Boolean>(PropAlias::new(3.into()));

    let boolean_data = return_single_boolean_data_query_result(false, true);
    let data = DataQueryResults::from_vec(vec![boolean_data]);
    assert_boolean_default_result(prop.calculate_untyped(data), false);

    let boolean_data = return_single_boolean_data_query_result(true, false);
    let data = DataQueryResults::from_vec(vec![boolean_data]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), true);
}

/// Calling invert on a boolean prop alias
/// causes the boolean data to receive that requested value
#[test]
fn invert_boolean_prop_alias() {
    let prop = as_updater_object::<_, prop_type::Boolean>(PropAlias::new(3.into()));

    let boolean_data = return_single_boolean_data_query_result(false, true);
    let data = DataQueryResults::from_vec(vec![boolean_data]);

    let invert_results = prop.invert_untyped(data, true.into(), false).unwrap().vec;

    // request change in original
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

/// For a string prop alias,
/// its value should be the same as its string data,
/// and its came_from_default should be the same as the string data's came_from_default
#[test]
fn calculate_string_prop_alias() {
    let prop = as_updater_object::<_, prop_type::String>(PropAlias::new(3.into()));

    let string_data = return_single_string_data_query_result("hello", true);
    let data = DataQueryResults::from_vec(vec![string_data]);
    assert_string_default_result(prop.calculate_untyped(data), "hello");

    let string_data = return_single_string_data_query_result("bye", false);
    let data = DataQueryResults::from_vec(vec![string_data]);
    assert_string_calculated_value(prop.calculate_untyped(data), "bye");
}

/// Calling invert on a string prop alias
/// causes the string data to receive that requested value
#[test]
fn invert_string_prop_alias() {
    let prop = as_updater_object::<_, prop_type::String>(PropAlias::new(3.into()));

    let string_data = return_single_string_data_query_result("hello", true);
    let data = DataQueryResults::from_vec(vec![string_data]);

    let invert_results = prop.invert_untyped(data, "bye".into(), false).unwrap().vec;

    // request change in original
    assert_eq!(
        invert_results[0].values,
        vec![PropWithMeta {
            value: "bye".into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );
}

mod setup_functions {

    use super::*;

    pub fn return_single_boolean_data_query_result(
        value: bool,
        came_from_default: bool,
    ) -> DataQueryResult {
        DataQueryResult {
            values: vec![PropWithMeta {
                value: PropValue::Boolean(value),
                came_from_default,
                changed: true,
                origin: None,
            }],
        }
    }

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

    pub fn assert_boolean_calculated_value(result: PropCalcResult<PropValue>, value: bool) {
        let value: PropValue = value.into();

        match result {
            PropCalcResult::FromDefault(_) => {
                panic!("incorrectly from default")
            }
            PropCalcResult::Calculated(boolean_prop) => {
                assert_eq!(boolean_prop, value)
            }
            PropCalcResult::NoChange => panic!("Incorrectly no change"),
        }
    }

    pub fn assert_boolean_default_result(result: PropCalcResult<PropValue>, value: bool) {
        let value: PropValue = value.into();

        match result {
            PropCalcResult::FromDefault(boolean_prop) => {
                assert_eq!(boolean_prop, value)
            }
            PropCalcResult::Calculated(_) => {
                panic!("incorrectly calculated")
            }
            PropCalcResult::NoChange => panic!("Incorrectly no change"),
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
