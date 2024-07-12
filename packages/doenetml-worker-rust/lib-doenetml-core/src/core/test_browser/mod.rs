//! Tests that can only be executed when run in a full WASM environment inside of a browser.

#[path = "math_expr_wasm.test.rs"]
mod math_expr_tests;
#[path = "math_prop_wasm.test.rs"]
mod math_prop_tests;
#[path = "number_prop_wasm.test.rs"]
mod number_prop_tests;

use crate::{
    math_via_wasm::{math_to_latex, parse_text_into_math},
    state::types::math_expr::ToLatexParams,
};

/// Wrap a function for use in a browser-based test.
/// Code is transformed in the following way:
/// ```ignore
/// embed_test!(all_tests, test_name, fn my_test_function() { ... some test code...  })
/// ```
/// becomes
/// ```ignore
/// fn my_test_function() { ... some test code...  }
/// all_tests.push("my_test_function".to_string());
/// if test_name == "my_test_function" {
///     my_test_function();
/// }
/// ```
#[macro_export]
macro_rules! embed_test {
    ($all_tests:ident, $test_name:ident, fn $name:ident() $body:block) => {
        fn $name() $body
        $all_tests.push(stringify!($name).to_string());
        if $test_name == stringify!($name) { $name(); }
    };
}

/// Run a test matching `test_name`. As well, return a list of all tests that can be run.
#[cfg(debug_assertions)]
pub fn run_test(test_name: &str) -> Vec<String> {
    let mut all_tests = Vec::new();

    embed_test!(
        all_tests,
        test_name,
        fn test_parse_text_into_math() {
            let expr = parse_text_into_math("x+y", true, &["f"]).unwrap();
            assert_eq!(
                math_to_latex(&expr, ToLatexParams::default()).unwrap(),
                "x + y"
            );
        }
    );

    math_expr_tests::add_math_expr_wasm_tests(&mut all_tests, test_name);
    number_prop_tests::add_number_prop_wasm_tests(&mut all_tests, test_name);
    math_prop_tests::add_math_prop_wasm_tests(&mut all_tests, test_name);

    all_tests
}

// Version of `run_test` that does nothing; for production mode.
#[cfg(not(debug_assertions))]
pub fn run_test(test_name: &str) -> Vec<String> {
    return Vec::new();
}
