use std::rc::Rc;

use crate::{
    embed_test,
    general_prop::{
        self,
        test_utils::{
            assert_math_calculated_value, assert_math_default_result,
            assert_number_calculated_value, return_empty_data_query_result,
            return_single_boolean_data_query_result, return_single_math_data_query_result,
            return_single_number_data_query_result,
        },
        NumberProp,
    },
    props::{as_updater_object, cache::PropWithMeta, prop_type, DataQueryResults, PropValue},
    state::types::math_expr::{MathExpr, MathParser},
};

pub fn add_math_prop_wasm_tests(all_tests: &mut Vec<String>, test_name: &str) {
    embed_test!(
        all_tests,
        test_name,
        fn math_prop_from_single_math_child() {
            let prop =
                as_updater_object::<_, prop_type::Math>(general_prop::MathProp::new_from_children(
                    0.7,
                    MathParser::Text,
                    vec!["f".to_string()],
                ));

            let independent_state = return_single_math_data_query_result(Rc::new(3.1.into()), true);
            let with_fixed_not_needed = return_empty_data_query_result();
            let split_symbols_result = return_single_boolean_data_query_result(true, true);

            // with single math child, from default
            let math_child = return_single_math_data_query_result(Rc::new(5.2.into()), true);
            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                math_child,
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);
            assert_math_default_result(prop.calculate_untyped(data), Rc::new(5.2.into()));

            // with single math child, non-default
            let math_child = return_single_math_data_query_result(Rc::new(2.5.into()), false);
            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                math_child,
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);
            assert_math_calculated_value(prop.calculate_untyped(data), Rc::new(2.5.into()));
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn invert_with_single_math_child() {
            let prop =
                as_updater_object::<_, prop_type::Math>(general_prop::MathProp::new_from_children(
                    0.7,
                    MathParser::Text,
                    vec!["f".to_string()],
                ));

            let independent_state = return_single_math_data_query_result(Rc::new(3.1.into()), true);
            let with_fixed_not_needed = return_empty_data_query_result();
            let split_symbols_result = return_single_boolean_data_query_result(true, true);

            // with single math child, from default
            let math_child = return_single_math_data_query_result(Rc::new(5.2.into()), true);
            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                math_child,
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);

            let requested_math: MathExpr = 7.9.into();
            let invert_results = prop
                .invert_untyped(data, requested_math.clone().into(), false)
                .unwrap()
                .vec;

            // independent state is unchanged
            assert_eq!(invert_results[0].values[0].changed, false);
            // request change in child
            assert_eq!(
                invert_results[1].values,
                vec![PropWithMeta {
                    value: requested_math.into(),
                    changed: true,
                    came_from_default: false,
                    origin: None
                }]
            );
        }
    );
}
