use std::collections::HashMap;

use crate::{
    embed_test,
    state::types::math_expr::{
        MathArg, MathExpr, MathSimplify, NormalizeParams, ToLatexParams, ToTextParams,
    },
};

pub fn add_math_expr_wasm_tests(all_tests: &mut Vec<String>, test_name: &str) {
    embed_test!(
        all_tests,
        test_name,
        fn substitute_into_math_expr() {
            let expr1 = MathExpr::from_text("x+y", true, &["f"]);

            let substitutions =
                HashMap::from([("y".to_string(), MathArg::Symbol("z".to_string()))]);
            let expr2 = expr1.substitute(&substitutions);
            assert_eq!(expr2.to_latex(ToLatexParams::default()), "x + z");

            let substitutions = HashMap::from([(
                "y".to_string(),
                MathArg::Math(MathExpr::from_text("q", true, &["f"])),
            )]);
            let expr2 = expr1.substitute(&substitutions);
            assert_eq!(expr2.to_latex(ToLatexParams::default()), "x + q");

            #[allow(clippy::approx_constant)]
            let substitutions = HashMap::from([("y".to_string(), MathArg::Number(3.14))]);
            let expr2 = expr1.substitute(&substitutions);
            assert_eq!(expr2.to_latex(ToLatexParams::default()), "x + 3.14");

            let substitutions = HashMap::from([("y".to_string(), MathArg::Integer(-4))]);
            let expr2 = expr1.substitute(&substitutions);
            assert_eq!(expr2.to_latex(ToLatexParams::default()), "x - 4");
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn math_expr_from_text() {
            // `x` times `y`
            let expr = MathExpr::from_text("xy", true, &["f"]);
            assert_eq!(expr.to_text(ToTextParams::default()), r#"x y"#);

            // the multi-character symbol `xy`
            let expr = MathExpr::from_text("xy", false, &["f"]);
            assert_eq!(expr.to_text(ToTextParams::default()), r#"xy"#);

            // the function `g` evaluated at `x`.
            let expr = MathExpr::from_text("g(x)", true, &["f", "g"]);
            assert_eq!(expr.to_text(ToTextParams::default()), r#"g(x)"#);

            // `g` times `x`
            let expr = MathExpr::from_text("g(x)", true, &["f"]);
            assert_eq!(expr.to_text(ToTextParams::default()), r#"g x"#);
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn math_expr_to_text() {
            let expr = MathExpr::from_text("123 / 0.05", true, &["f"]);

            assert_eq!(expr.to_text(ToTextParams::default()), r#"123/0.05"#);

            let pad_three_decimals = ToTextParams {
                pad_to_decimals: Some(3),
                ..Default::default()
            };
            assert_eq!(expr.to_text(pad_three_decimals), r#"123.000/0.050"#);

            let pad_four_digits = ToTextParams {
                pad_to_digits: Some(4),
                ..Default::default()
            };
            assert_eq!(expr.to_text(pad_four_digits), r#"123.0/0.05000"#);

            let expr_with_blanks = MathExpr::from_text("x + ()", true, &["f"]);

            assert_eq!(
                expr_with_blanks.to_text(ToTextParams::default()),
                "x + \u{FF3F}"
            );

            let hide_blanks = ToTextParams {
                show_blanks: false,
                ..Default::default()
            };
            assert_eq!(expr_with_blanks.to_text(hide_blanks), "x + ");
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn math_expr_from_latex() {
            // `x` times `y`
            let expr = MathExpr::from_latex("xy", true, &["f"]);
            assert_eq!(expr.to_latex(ToLatexParams::default()), r#"x y"#);

            // the multi-character symbol `xy`
            let expr = MathExpr::from_latex("xy", false, &["f"]);
            assert_eq!(
                expr.to_latex(ToLatexParams::default()),
                r#"\operatorname{xy}"#
            );

            // the function `g` evaluated at `x`.
            let expr = MathExpr::from_latex("g(x)", true, &["f", "g"]);
            assert_eq!(
                expr.to_latex(ToLatexParams::default()),
                r#"g\left(x\right)"#
            );

            // `g` times `x`
            let expr = MathExpr::from_latex("g(x)", true, &["f"]);
            assert_eq!(expr.to_latex(ToLatexParams::default()), r#"g x"#);
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn math_expr_tolatex() {
            let expr = MathExpr::from_text("123 / 0.05", true, &["f"]);

            assert_eq!(
                expr.to_latex(ToLatexParams::default()),
                r#"\frac{123}{0.05}"#
            );

            let pad_three_decimals = ToLatexParams {
                pad_to_decimals: Some(3),
                ..Default::default()
            };
            assert_eq!(
                expr.to_latex(pad_three_decimals),
                r#"\frac{123.000}{0.050}"#
            );

            let pad_four_digits = ToLatexParams {
                pad_to_digits: Some(4),
                ..Default::default()
            };
            assert_eq!(expr.to_latex(pad_four_digits), r#"\frac{123.0}{0.05000}"#);

            let expr_with_blanks = MathExpr::from_text("x + ()", true, &["f"]);

            assert_eq!(
                expr_with_blanks.to_latex(ToLatexParams::default()),
                "x + \u{FF3F}"
            );

            let hide_blanks = ToLatexParams {
                show_blanks: false,
                ..Default::default()
            };
            assert_eq!(expr_with_blanks.to_latex(hide_blanks), "x + ");
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn simplify_math() {
            let expr = MathExpr::from_text("x+2+x+3+4", true, &["f"]);

            let expr_none = expr.normalize(NormalizeParams {
                simplify: MathSimplify::None,
                ..Default::default()
            });
            assert_eq!(expr_none, expr);

            let expr_numbers = expr.normalize(NormalizeParams {
                simplify: MathSimplify::Numbers,
                ..Default::default()
            });
            assert_eq!(expr_numbers.to_text(ToTextParams::default()), "x + x + 9");

            let expr_numbers_order = expr.normalize(NormalizeParams {
                simplify: MathSimplify::NumbersPreserveOrder,
                ..Default::default()
            });
            assert_eq!(
                expr_numbers_order.to_text(ToTextParams::default()),
                "x + 2 + x + 7"
            );

            let expr_simplify = expr.normalize(NormalizeParams {
                simplify: MathSimplify::Full,
                ..Default::default()
            });
            assert_eq!(expr_simplify.to_text(ToTextParams::default()), "2 x + 9");

            let expr_simplify2 = expr.normalize(NormalizeParams::default());
            assert_eq!(expr_simplify2, expr_simplify);
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn expand_math() {
            let expr = MathExpr::from_text("(x+1)(x-1)", true, &["f"]);

            let expr_simplify = expr.normalize(NormalizeParams::default());

            assert_eq!(
                expr_simplify.to_text(ToTextParams::default()),
                "(x - 1) (x + 1)"
            );

            let expr_expand = expr.normalize(NormalizeParams {
                expand: true,
                ..Default::default()
            });

            assert_eq!(expr_expand.to_text(ToTextParams::default()), "x^2 - 1");
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn arithmetic_on_math() {
            let expr = MathExpr::from_text("3", true, &["f"]);

            let expr_add = expr.add(MathArg::Integer(4));
            let expr_add_simplify = expr_add.normalize(NormalizeParams::default());

            assert_eq!(expr_add.to_text(ToTextParams::default()), "3 + 4");
            assert_eq!(expr_add_simplify.to_text(ToTextParams::default()), "7");

            let expr_subtract = expr.subtract(MathArg::Integer(4));
            let expr_subtract_simplify = expr_subtract.normalize(NormalizeParams::default());

            assert_eq!(expr_subtract.to_text(ToTextParams::default()), "3 - 4");
            assert_eq!(
                expr_subtract_simplify.to_text(ToTextParams::default()),
                "-1"
            );

            let expr_multiply = expr.multiply(MathArg::Integer(4));
            let expr_multiply_simplify = expr_multiply.normalize(NormalizeParams::default());

            assert_eq!(expr_multiply.to_text(ToTextParams::default()), "3 * 4");
            assert_eq!(
                expr_multiply_simplify.to_text(ToTextParams::default()),
                "12"
            );

            let expr_divide = expr.divide(MathArg::Integer(6));
            let expr_divide_simplify = expr_divide.normalize(NormalizeParams::default());

            assert_eq!(expr_divide.to_text(ToTextParams::default()), "3/6");
            assert_eq!(expr_divide_simplify.to_text(ToTextParams::default()), "1/2");
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn math_expr_converted_to_number() {
            let expr1 = MathExpr::from_text("3/e^0", true, &["f"]);

            let num1 = expr1.to_number();
            assert_eq!(num1, 3.0);

            let num1 = expr1.try_to_number().unwrap();
            assert_eq!(num1, 3.0);

            let num1: f64 = expr1.into();
            assert_eq!(num1, 3.0);

            let expr2 = MathExpr::from_text("x", true, &["f"]);

            let num2 = expr2.to_number();
            assert!(num2.is_nan());

            let num2_result = expr2.try_to_number();
            assert!(num2_result.is_err());

            let num2: f64 = expr2.into();
            assert!(num2.is_nan());
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn parse_text_into_numbers() {
            assert_eq!(MathExpr::number_from_text("3/e^0"), 3.0);

            assert!(MathExpr::number_from_text("x").is_nan());
        }
    );

    embed_test!(
        all_tests,
        test_name,
        fn math_expr_from_numbers() {
            let expr1: MathExpr = 5.into();
            assert_eq!(expr1.to_text(ToTextParams::default()), "5");

            let expr2: MathExpr = 5.5.into();
            assert_eq!(expr2.to_text(ToTextParams::default()), "5.5");
        }
    );
}
