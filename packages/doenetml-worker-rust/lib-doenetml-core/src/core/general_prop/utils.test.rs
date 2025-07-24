use crate::props::{DataQueryResult, PropCalcResult, PropValue, cache::PropWithMeta, prop_type};

pub fn return_empty_data_query_result() -> DataQueryResult {
    DataQueryResult { values: vec![] }
}

pub fn return_single_number_data_query_result(
    value: prop_type::Number,
    came_from_default: bool,
) -> DataQueryResult {
    DataQueryResult {
        values: vec![PropWithMeta {
            value: PropValue::Number(value),
            came_from_default,
            changed: true,
            origin: None,
        }],
    }
}

pub fn return_single_math_data_query_result(
    value: prop_type::Math,
    came_from_default: bool,
) -> DataQueryResult {
    DataQueryResult {
        values: vec![PropWithMeta {
            value: PropValue::Math(value),
            came_from_default,
            changed: true,
            origin: None,
        }],
    }
}

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

pub fn assert_number_calculated_value(result: PropCalcResult<PropValue>, value: prop_type::Number) {
    let expect_nan = value.is_nan();
    let value: PropValue = value.into();

    match result {
        PropCalcResult::FromDefault(_) => {
            panic!("incorrectly from default")
        }
        PropCalcResult::Calculated(number_prop) => {
            if expect_nan {
                let num: prop_type::Number = number_prop.try_into().unwrap();
                assert!(num.is_nan())
            } else {
                assert_eq!(number_prop, value)
            }
        }
        PropCalcResult::NoChange => panic!("Incorrectly no change"),
    }
}

pub fn assert_number_default_result(result: PropCalcResult<PropValue>, value: prop_type::Number) {
    let expect_nan = value.is_nan();
    let value: PropValue = value.into();

    match result {
        PropCalcResult::FromDefault(number_prop) => {
            if expect_nan {
                let num: prop_type::Number = number_prop.try_into().unwrap();
                assert!(num.is_nan())
            } else {
                assert_eq!(number_prop, value)
            }
        }
        PropCalcResult::Calculated(_) => {
            panic!("incorrectly calculated")
        }
        PropCalcResult::NoChange => panic!("Incorrectly no change"),
    }
}

pub fn assert_math_calculated_value(result: PropCalcResult<PropValue>, value: prop_type::Math) {
    let value: PropValue = value.into();

    match result {
        PropCalcResult::FromDefault(_) => {
            panic!("incorrectly from default")
        }
        PropCalcResult::Calculated(math_prop) => {
            assert_eq!(math_prop, value)
        }
        PropCalcResult::NoChange => panic!("Incorrectly no change"),
    }
}

pub fn assert_math_default_result(result: PropCalcResult<PropValue>, value: prop_type::Math) {
    let value: PropValue = value.into();

    match result {
        PropCalcResult::FromDefault(number_prop) => {
            assert_eq!(number_prop, value)
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
