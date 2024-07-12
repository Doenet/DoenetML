use std::rc::Rc;

use crate::{
    embed_test,
    general_prop::{
        self,
        test_utils::{
            assert_number_calculated_value, return_single_math_data_query_result,
            return_single_number_data_query_result,
        },
        NumberProp,
    },
    props::{as_updater_object, cache::PropWithMeta, prop_type, DataQueryResults},
    state::types::math_expr::{MathExpr, MathParser},
};

pub fn add_math_prop_wasm_tests(all_tests: &mut Vec<String>, test_name: &str) {
    embed_test!(
        all_tests,
        test_name,
        fn math_prop_from_single_math_child() {
            let prop = as_updater_object::<_, prop_type::Math>(
                general_prop::MathProp::new_from_children(0.7.into(), MathParser::Text),
            );

            let independent_state = return_single_number_data_query_result(3.1, true);

            // with single math child, from default
            let math_child = return_single_math_data_query_result(Rc::new(5.2.into()), true);
            let data = DataQueryResults::from_vec(vec![independent_state.clone(), math_child]);
            assert_number_calculated_value(prop.calculate_untyped(data), 5.2);

            // with single math child, non-default
            let math_child = return_single_math_data_query_result(Rc::new(2.5.into()), false);
            let data = DataQueryResults::from_vec(vec![independent_state.clone(), math_child]);
            assert_number_calculated_value(prop.calculate_untyped(data), 2.5);

            // with single math child, expression that resolves to a number
            let math_expr = MathExpr::from_text("1+3/2", true, &["f"]);
            let math_child = return_single_math_data_query_result(Rc::new(math_expr), false);
            let data = DataQueryResults::from_vec(vec![independent_state.clone(), math_child]);
            assert_number_calculated_value(prop.calculate_untyped(data), 2.5);

            // with single math child, expression that does not resolves to a number
            let math_expr = MathExpr::from_text("x", true, &["f"]);
            let math_child = return_single_math_data_query_result(Rc::new(math_expr), false);
            let data = DataQueryResults::from_vec(vec![independent_state.clone(), math_child]);
            assert_number_calculated_value(prop.calculate_untyped(data), prop_type::Number::NAN);
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn invert_with_single_math_child() {
            let prop =
                as_updater_object::<_, prop_type::Number>(NumberProp::new_from_children(0.7));

            let independent_state = return_single_number_data_query_result(3.1, true);

            // with single math child, from default
            let math_child = return_single_math_data_query_result(Rc::new(2.5.into()), true);
            let data = DataQueryResults::from_vec(vec![independent_state.clone(), math_child]);

            let invert_results = prop.invert_untyped(data, 2.9.into(), false).unwrap().vec;

            // independent state is unchanged
            assert_eq!(invert_results[0].values[0].changed, false);
            let new_math_expr: MathExpr = 2.9.into();
            // request change in child
            assert_eq!(
                invert_results[1].values,
                vec![PropWithMeta {
                    value: new_math_expr.into(),
                    changed: true,
                    came_from_default: false,
                    origin: None
                }]
            );
        }
    );
}
