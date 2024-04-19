use crate::props::cache::PropWithMeta;

use super::*;
use setup_functions::*;

/// check that an independent prop
/// gives the correct data query that requests a state prop
#[test]
fn independent_prop_gives_correct_data_queries() {
    // boolean
    let prop = as_updater_object::<_, prop_type::Boolean>(IndependentProp::new(false));

    let queries = prop.data_queries();

    assert!(matches!(queries[0], DataQuery::State));

    // String
    let prop =
        as_updater_object::<_, prop_type::String>(IndependentProp::new("".to_string().into()));

    let queries = prop.data_queries();

    assert!(matches!(queries[0], DataQuery::State));
}

/// For an independent boolean prop,
/// its value should be the same as the boolean data's state,
/// and its came_from_default should be the same as the boolean data's came_from_default
#[test]
fn calculate_independent_boolean_prop() {
    let prop = as_updater_object::<_, prop_type::Boolean>(IndependentProp::new(false));

    let boolean_data = return_single_boolean_data_query_result(false, true);
    let data = DataQueryResults::from_vec(vec![boolean_data]);
    assert_boolean_default_result(prop.calculate_untyped(data), false);

    let boolean_data = return_single_boolean_data_query_result(true, false);
    let data = DataQueryResults::from_vec(vec![boolean_data]);
    assert_boolean_calculated_value(prop.calculate_untyped(data), true);
}

/// Calling invert on a boolean independent prop
/// causes the boolean data to receive that requested value
#[test]
fn invert_independent_boolean_prop() {
    let prop = as_updater_object::<_, prop_type::Boolean>(IndependentProp::new(false));

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

/// For an independent string prop,
/// its value should be the same as its string data
/// and its came_from_default should be the same as the string data's came_from_default
#[test]
fn calculate_independent_string_prop() {
    let prop = as_updater_object::<_, prop_type::String>(IndependentProp::new(
        String::from("hello").into(),
    ));

    let string_data = return_single_string_data_query_result("hello", true);
    let data = DataQueryResults::from_vec(vec![string_data]);
    assert_string_default_result(prop.calculate_untyped(data), "hello");

    let string_data = return_single_string_data_query_result("bye", false);
    let data = DataQueryResults::from_vec(vec![string_data]);
    assert_string_calculated_value(prop.calculate_untyped(data), "bye");
}

/// Calling invert on a string independent prop
/// causes the string data to receive that requested value
#[test]
fn invert_independent_string_prop() {
    let prop = as_updater_object::<_, prop_type::String>(IndependentProp::new(
        String::from("hello").into(),
    ));

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
