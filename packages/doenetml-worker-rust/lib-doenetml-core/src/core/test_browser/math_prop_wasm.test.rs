use std::rc::Rc;

use crate::{
    embed_test,
    general_prop::{
        self,
        test_utils::{
            assert_math_calculated_value, assert_math_default_result,
            return_empty_data_query_result, return_single_boolean_data_query_result,
            return_single_math_data_query_result, return_single_number_data_query_result,
            return_single_string_data_query_result,
        },
    },
    props::{
        DataQueryResult, DataQueryResults, PropValue, as_updater_object, cache::PropWithMeta,
        prop_type,
    },
    state::types::math_expr::{MathExpr, MathParser},
};

pub fn add_math_prop_wasm_tests(all_tests: &mut Vec<String>, test_name: &str) {
    embed_test!(
        all_tests,
        test_name,
        fn math_prop_from_independent_state() {
            // Check that math prop from children is calculated from the independent state dependency
            // if there are no children.
            // The result is marked as default if the independent prop is marked came_from_default.

            let prop =
                as_updater_object::<_, prop_type::Math>(general_prop::MathProp::new_from_children(
                    0.7,
                    MathParser::Text,
                    vec!["f".to_string()],
                ));

            let no_children = return_empty_data_query_result();

            // with default value
            let independent_state = return_single_math_data_query_result(Rc::new(5.2.into()), true);
            let with_fixed_not_needed = return_empty_data_query_result();
            let split_symbols_result = return_single_boolean_data_query_result(true, true);

            let data = DataQueryResults::from_vec(vec![
                independent_state,
                no_children.clone(),
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);

            assert_math_default_result(prop.calculate_untyped(data), Rc::new(5.2.into()));

            // with non-default value
            let independent_state =
                return_single_math_data_query_result(Rc::new(1.2.into()), false);
            let data = DataQueryResults::from_vec(vec![
                independent_state,
                no_children.clone(),
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);

            assert_math_calculated_value(prop.calculate_untyped(data), Rc::new(1.2.into()));
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn invert_math_prop_with_independent_state() {
            // Calling invert on a math prop with no children
            // causes the independent state to receive that requested value
            let prop =
                as_updater_object::<_, prop_type::Math>(general_prop::MathProp::new_from_children(
                    0.7,
                    MathParser::Text,
                    vec!["f".to_string()],
                ));

            let no_children = return_empty_data_query_result();
            let independent_state = return_single_math_data_query_result(Rc::new(7.0.into()), true);
            let with_fixed_not_needed = return_empty_data_query_result();
            let split_symbols_result = return_single_boolean_data_query_result(true, true);

            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                no_children,
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);

            let desired_math: MathExpr = 5.7.into();
            let invert_results = prop
                .invert_untyped(data, desired_math.clone().into(), false)
                .unwrap()
                .vec;

            // request change in independent state
            assert_eq!(
                invert_results[0].values,
                vec![PropWithMeta {
                    value: desired_math.into(),
                    changed: true,
                    came_from_default: false,
                    origin: None
                }]
            );
        }
    );

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
        fn invert_math_prop_with_single_math_child() {
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
            assert!(!invert_results[0].values[0].changed);
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

    embed_test!(
        all_tests,
        test_name,
        fn math_prop_from_single_number_child() {
            let prop =
                as_updater_object::<_, prop_type::Math>(general_prop::MathProp::new_from_children(
                    0.7,
                    MathParser::Text,
                    vec!["f".to_string()],
                ));

            let independent_state = return_single_math_data_query_result(Rc::new(3.1.into()), true);
            let with_fixed_not_needed = return_empty_data_query_result();
            let split_symbols_result = return_single_boolean_data_query_result(true, true);

            // with single number child, from default is ignored
            let number_child = return_single_number_data_query_result(5.2, true);
            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                number_child,
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);
            assert_math_calculated_value(prop.calculate_untyped(data), Rc::new(5.2.into()));

            // with single number child, non-default
            let number_child = return_single_number_data_query_result(2.5, false);
            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                number_child,
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);
            assert_math_calculated_value(prop.calculate_untyped(data), Rc::new(2.5.into()));
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn invert_math_prop_with_single_number_child() {
            let prop =
                as_updater_object::<_, prop_type::Math>(general_prop::MathProp::new_from_children(
                    0.7,
                    MathParser::Text,
                    vec!["f".to_string()],
                ));

            let independent_state = return_single_math_data_query_result(Rc::new(3.1.into()), true);
            let with_fixed_not_needed = return_empty_data_query_result();
            let split_symbols_result = return_single_boolean_data_query_result(true, true);

            // with single number child, from default
            let number_child = return_single_number_data_query_result(5.2, true);
            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                number_child,
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);

            let requested_math: MathExpr = 7.9.into();
            let invert_results = prop
                .invert_untyped(data, requested_math.clone().into(), false)
                .unwrap()
                .vec;

            // independent state is unchanged
            assert!(!invert_results[0].values[0].changed);
            // request change in child
            assert_eq!(
                invert_results[1].values,
                vec![PropWithMeta {
                    value: 7.9.into(),
                    changed: true,
                    came_from_default: false,
                    origin: None
                }]
            );
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn math_prop_from_single_string_child() {
            let prop =
                as_updater_object::<_, prop_type::Math>(general_prop::MathProp::new_from_children(
                    0.7,
                    MathParser::Text,
                    vec!["f".to_string()],
                ));

            let independent_state = return_single_math_data_query_result(Rc::new(3.1.into()), true);
            let with_fixed_not_needed = return_empty_data_query_result();
            let split_symbols_result = return_single_boolean_data_query_result(true, true);

            // with single string child, from default is ignored
            let string_child = return_single_string_data_query_result("5.2", true);
            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                string_child,
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);
            assert_math_calculated_value(prop.calculate_untyped(data), Rc::new(5.2.into()));

            // with single string child, non-default
            let string_child = return_single_string_data_query_result("2.5", false);
            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                string_child,
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);
            assert_math_calculated_value(prop.calculate_untyped(data), Rc::new(2.5.into()));
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn invert_math_prop_with_single_string_child() {
            let prop =
                as_updater_object::<_, prop_type::Math>(general_prop::MathProp::new_from_children(
                    0.7,
                    MathParser::Text,
                    vec!["f".to_string()],
                ));

            let independent_state = return_single_math_data_query_result(Rc::new(3.1.into()), true);
            let with_fixed_not_needed = return_empty_data_query_result();
            let split_symbols_result = return_single_boolean_data_query_result(true, true);

            // with single string child, from default
            let string_child = return_single_string_data_query_result("5.2", true);
            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                string_child,
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);

            let requested_math: MathExpr = 7.9.into();
            let invert_results = prop
                .invert_untyped(data, requested_math.clone().into(), false)
                .unwrap()
                .vec;

            // independent state is unchanged
            assert!(!invert_results[0].values[0].changed);
            // request change in child
            assert_eq!(
                invert_results[1].values,
                vec![PropWithMeta {
                    value: "7.9".into(),
                    changed: true,
                    came_from_default: false,
                    origin: None
                }]
            );
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn math_prop_keep_fraction_from_single_string_child() {
            let prop =
                as_updater_object::<_, prop_type::Math>(general_prop::MathProp::new_from_children(
                    0.7,
                    MathParser::Text,
                    vec!["f".to_string()],
                ));

            let independent_state = return_single_math_data_query_result(Rc::new(3.1.into()), true);
            let with_fixed_not_needed = return_empty_data_query_result();
            let split_symbols_result = return_single_boolean_data_query_result(true, true);

            // with single string child that is a fraction
            let string_child = return_single_string_data_query_result("6/3", false);
            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                string_child,
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);
            assert_math_calculated_value(
                prop.calculate_untyped(data),
                Rc::new(MathExpr::from_text("6/3", true, &["f"])),
            );
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn math_prop_from_string_with_split_symbols() {
            let prop =
                as_updater_object::<_, prop_type::Math>(general_prop::MathProp::new_from_children(
                    0.7,
                    MathParser::Text,
                    vec!["f".to_string()],
                ));

            let independent_state = return_single_math_data_query_result(Rc::new(3.1.into()), true);
            let with_fixed_not_needed = return_empty_data_query_result();
            let split_symbols_result = return_single_boolean_data_query_result(true, false);
            let no_split_symbols_result = return_single_boolean_data_query_result(false, false);
            let string_child = return_single_string_data_query_result("xyz", false);

            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                string_child.clone(),
                with_fixed_not_needed.clone(),
                split_symbols_result.clone(),
            ]);
            assert_math_calculated_value(
                prop.calculate_untyped(data),
                Rc::new(MathExpr::from_text("xyz", true, &["f"])),
            );
            let data = DataQueryResults::from_vec(vec![
                independent_state.clone(),
                string_child.clone(),
                with_fixed_not_needed.clone(),
                no_split_symbols_result.clone(),
            ]);
            assert_math_calculated_value(
                prop.calculate_untyped(data),
                Rc::new(MathExpr::from_text("xyz", false, &["f"])),
            );
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn math_prop_from_string_numbers_and_maths() {
            let prop =
                as_updater_object::<_, prop_type::Math>(general_prop::MathProp::new_from_children(
                    0.7,
                    MathParser::Text,
                    vec!["f".to_string()],
                ));

            let independent_state = return_single_math_data_query_result(Rc::new(3.1.into()), true);
            let with_fixed_not_needed = return_empty_data_query_result();
            let split_symbols_result = return_single_boolean_data_query_result(true, false);

            let children = DataQueryResult {
                values: vec![
                    PropWithMeta {
                        value: PropValue::String("x+".to_string().into()),
                        came_from_default: false,
                        changed: true,
                        origin: None,
                    },
                    PropWithMeta {
                        value: PropValue::Math(Rc::new(MathExpr::from_text("y", true, &["f"]))),
                        came_from_default: false,
                        changed: true,
                        origin: None,
                    },
                    PropWithMeta {
                        value: PropValue::String(" - ".to_string().into()),
                        came_from_default: false,
                        changed: true,
                        origin: None,
                    },
                    PropWithMeta {
                        value: PropValue::Number(7.1),
                        came_from_default: false,
                        changed: true,
                        origin: None,
                    },
                    PropWithMeta {
                        value: PropValue::Math(Rc::new(MathExpr::from_text("z", true, &["f"]))),
                        came_from_default: false,
                        changed: true,
                        origin: None,
                    },
                ],
            };

            let data = DataQueryResults::from_vec(vec![
                independent_state,
                children,
                with_fixed_not_needed,
                split_symbols_result,
            ]);

            assert_math_calculated_value(
                prop.calculate_untyped(data),
                Rc::new(MathExpr::from_text("x+y-7.1z", true, &["f"])),
            );
        }
    );
}
