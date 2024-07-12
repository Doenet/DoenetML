use std::rc::Rc;

use crate::{
    embed_test,
    general_prop::{
        self,
        test_utils::{
            assert_number_calculated_value, return_single_math_data_query_result,
            return_single_number_data_query_result,
        },
    },
    props::{as_updater_object, prop_type, DataQueryResults},
    state::types::math_expr::MathExpr,
};

pub fn add_number_prop_wasm_tests(all_tests: &mut Vec<String>, test_name: &str) {
    embed_test!(
        all_tests,
        test_name,
        fn number_prop_from_single_math_child() {
            let prop = as_updater_object::<_, prop_type::Number>(
                general_prop::NumberProp::new_from_children(0.7),
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
}
