use crate::{
    general_prop::test_utils::{
        assert_string_calculated_value, return_single_number_data_query_result,
    },
    props::cache::PropWithMeta,
};

use super::*;

/// check that a number-to_string prop
/// gives the correct data query that requests correct prop
#[test]
fn number_to_string_prop_gives_correct_data_queries() {
    let local_prop_idx: LocalPropIdx = 3.into();
    let prop = as_updater_object::<_, prop_type::String>(NumberToStringProp::new(local_prop_idx));

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
fn calculate_number_to_string_prop() {
    let local_prop_idx: LocalPropIdx = 3.into();
    let prop = as_updater_object::<_, prop_type::String>(NumberToStringProp::new(local_prop_idx));

    // came from default is ignored
    let number_data = return_single_number_data_query_result(-7.1, true);
    let data = DataQueryResults::from_vec(vec![number_data]);
    assert_string_calculated_value(prop.calculate_untyped(data), "-7.1");

    let number_data = return_single_number_data_query_result(9.3, false);
    let data = DataQueryResults::from_vec(vec![number_data]);
    assert_string_calculated_value(prop.calculate_untyped(data), "9.3");

    let number_data = return_single_number_data_query_result(prop_type::Number::NAN, false);
    let data = DataQueryResults::from_vec(vec![number_data]);
    assert_string_calculated_value(prop.calculate_untyped(data), "NaN");
}

#[test]
fn invert_number_to_string_prop() {
    let local_prop_idx: LocalPropIdx = 3.into();
    let prop = as_updater_object::<_, prop_type::String>(NumberToStringProp::new(local_prop_idx));

    let number_data = return_single_number_data_query_result(3.7, false);
    let data = DataQueryResults::from_vec(vec![number_data]);
    let invert_results = prop.invert_untyped(data, "-8.6".into(), false).unwrap().vec;

    assert_eq!(
        invert_results[0].values,
        vec![PropWithMeta {
            value: (-8.6).into(),
            changed: true,
            came_from_default: false,
            origin: None
        }]
    );
}
