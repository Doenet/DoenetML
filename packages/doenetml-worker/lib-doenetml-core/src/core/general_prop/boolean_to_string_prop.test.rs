use crate::{
    general_prop::test_utils::{
        assert_string_calculated_value, return_single_boolean_data_query_result,
    },
    props::cache::PropWithMeta,
};

use super::*;

/// check that a boolean-to_string prop
/// gives the correct data query that requests correct prop
#[test]
fn boolean_to_string_prop_gives_correct_data_queries() {
    let local_prop_idx: LocalPropIdx = 3.into();
    let prop = as_updater_object::<_, prop_type::String>(BooleanToStringProp::new(local_prop_idx));

    let queries = prop.data_queries();

    match &queries[0] {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: PropSpecifier::LocalIdx(idx),
        } => assert_eq!(*idx, local_prop_idx),
        _ => panic!("Incorrect query"),
    }
}

#[test]
fn calculate_boolean_to_string_prop() {
    let local_prop_idx: LocalPropIdx = 3.into();
    let prop = as_updater_object::<_, prop_type::String>(BooleanToStringProp::new(local_prop_idx));

    // false should become "false", came from default is ignored
    let boolean_data = return_single_boolean_data_query_result(false, true);
    let data = DataQueryResults::from_vec(vec![boolean_data]);
    assert_string_calculated_value(prop.calculate_untyped(data), "false");

    // true should become "true"
    let boolean_data = return_single_boolean_data_query_result(true, false);
    let data = DataQueryResults::from_vec(vec![boolean_data]);
    assert_string_calculated_value(prop.calculate_untyped(data), "true");
}

#[test]
fn invert_boolean_to_string_prop() {
    let local_prop_idx: LocalPropIdx = 3.into();
    let prop = as_updater_object::<_, prop_type::String>(BooleanToStringProp::new(local_prop_idx));

    // request change from false to true
    let boolean_data = return_single_boolean_data_query_result(false, false);
    let data = DataQueryResults::from_vec(vec![boolean_data]);
    let invert_results = prop.invert_untyped(data, "true".into(), false).unwrap().vec;

    assert_eq!(
        invert_results[0].values,
        vec![PropWithMeta {
            value: true.into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );

    // request change from true to false
    let boolean_data = return_single_boolean_data_query_result(true, false);
    let data = DataQueryResults::from_vec(vec![boolean_data]);
    let invert_results = prop
        .invert_untyped(data, "false".into(), false)
        .unwrap()
        .vec;

    assert_eq!(
        invert_results[0].values,
        vec![PropWithMeta {
            value: false.into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );
}

#[test]
fn inverting_boolean_to_string_is_case_insensitive() {
    let local_prop_idx: LocalPropIdx = 3.into();
    let prop = as_updater_object::<_, prop_type::String>(BooleanToStringProp::new(local_prop_idx));

    // request change to "TrUE"
    let boolean_data = return_single_boolean_data_query_result(false, false);
    let data = DataQueryResults::from_vec(vec![boolean_data]);
    let invert_results = prop.invert_untyped(data, "TrUE".into(), false).unwrap().vec;

    assert_eq!(
        invert_results[0].values,
        vec![PropWithMeta {
            value: true.into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );

    // request change to "FalSe"
    let boolean_data = return_single_boolean_data_query_result(true, false);
    let data = DataQueryResults::from_vec(vec![boolean_data]);
    let invert_results = prop
        .invert_untyped(data, "FalSe".into(), false)
        .unwrap()
        .vec;

    assert_eq!(
        invert_results[0].values,
        vec![PropWithMeta {
            value: false.into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );
}
