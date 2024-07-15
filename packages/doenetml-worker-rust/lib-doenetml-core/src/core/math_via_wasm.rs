//! This file provides an interface for accessing the Javascript `math-expressions` library from Rust.
//!
//! The Javascript functions called are provided by `lib-js-wasm-binding/src/eval-math.ts`.
//!
//! These functions underlie the ability to create, manipulate, and display mathematical expressions in Rust.

#[cfg(all(not(feature = "testing"), feature = "web"))]
use wasm_bindgen::prelude::*;
#[cfg(all(not(feature = "testing"), feature = "web"))]
use web_sys::js_sys::{Array, Boolean, JsString, Number};

use anyhow::anyhow;
use std::collections::HashMap;

use crate::state::types::math_expr::{
    JsMathExpr, MathArg, NormalizeParams, ToLatexParams, ToTextParams,
};

/// Directly evaluate a javascript string with `MathExpressions` in scope.
///
/// Use this escape hatch only if a more specific function, below, isn't available.
///
/// The preferred approach is to create a function that passes the required data
/// for running a function on the Javascript side,
/// rather than evaluating a Javascript string with this function.
#[cfg(all(not(feature = "testing"), feature = "web"))]
pub fn eval_js(source: &str) -> Result<String, anyhow::Error> {
    let result: JsString =
        evalWithMathExpressionsInScope(JsString::from(source)).map_err(|e| anyhow!("{:?}", e))?;
    Ok(result.into())
}
#[cfg(any(feature = "testing", not(feature = "web")))]
pub fn eval_js(_source: &str) -> Result<String, anyhow::Error> {
    Err(anyhow!(
        "eval_js is only available when compiled with the `web` feature".to_string()
    ))
}

/// Parse a string into math using the `math-expressions` text parser.
///
/// Parameters:
/// - `text`: the string to be parsed
/// - `split_symbols`: if true, split multi-character symbols that do not contain an number
///   into the product of the characters.
/// - `function_symbols`: a list of the symbols that will be treated as a function,
///   i.e., one of these symbols followed by arguments in parentheses
///   will be interpreted as apply that function to the arguments (rather than multiplication)
///
/// Examples:
/// - `parse_text_into_math("xy", true, &["f"])` is `x` times `y`.
/// - `parse_text_into_math("xy", false, &["f"])` is the multi-character symbol `xy`.
/// - `parse_text_into_math("g(x)", true, &["f", "g"])` is the function `g` evaluated at `x`.
/// - `parse_text_into_math("g(x)", true, &["f"])` is `g` times `x`.
#[cfg(all(not(feature = "testing"), feature = "web"))]
pub fn parse_text_into_math<Text: AsRef<str>, FnSymbol: AsRef<str>>(
    text: Text,
    split_symbols: bool,
    function_symbols: &[FnSymbol],
) -> Result<JsMathExpr, anyhow::Error> {
    let js_function_symbols = JsValue::from(
        function_symbols
            .iter()
            .map(|x| JsValue::from_str(x.as_ref()))
            .collect::<Array>(),
    );
    let result: JsString = parseTextIntoMath(
        JsString::from(text.as_ref()),
        Boolean::from(split_symbols),
        js_function_symbols,
    )
    .map_err(|e| anyhow!("{:?}", e))?;
    Ok(JsMathExpr(result.into()))
}
#[cfg(any(feature = "testing", not(feature = "web")))]
pub fn parse_text_into_math<Text: AsRef<str>, FnSymbol: AsRef<str>>(
    _text: Text,
    _split_symbols: bool,
    _function_symbols: &[FnSymbol],
) -> Result<JsMathExpr, anyhow::Error> {
    Err(anyhow!(
        "parse_text_into_math is only available when compiled with the `web` feature".to_string()
    ))
}

/// Return a text string that corresponds to the mathematical expression `math_object`.
/// The behavior is controlled by `params`.
///
/// Examples:
/// ```
/// let expr = parse_text_into_math("123 / 0.05", true, &["f"]).unwrap();
///
/// assert_eq!(
///     math_to_text(&expr, ToTextParams::default()).unwrap(),
///     r#"123/0.05"#
/// );
///
/// let pad_three_decimals = ToTextParams {
///     pad_to_decimals: Some(3),
///     ..Default::default()
/// };
/// assert_eq!(
///     math_to_text(&expr, pad_three_decimals).unwrap(),
///     r#"123.000/0.050"#
/// );
///
/// let pad_four_digits = ToTextParams {
///     pad_to_digits: Some(4),
///     ..Default::default()
/// };
/// assert_eq!(
///     math_to_text(&expr, pad_four_digits).unwrap(),
///     r#"123.0/0.05000"#
/// );
///
/// let expr_with_blanks = parse_text_into_math("x + ()", true, &["f"]).unwrap();
///
/// assert_eq!(
///     math_to_text(&expr_with_blanks, ToTextParams::default()).unwrap(),
///     "x + \u{FF3F}"
/// );
///
/// let hide_blanks = ToTextParams {
///     show_blanks: false,
///     ..Default::default()
/// };
/// assert_eq!(
///     math_to_text(&expr_with_blanks, hide_blanks).unwrap(),
///     "x + "
/// );
/// ````
#[cfg(all(not(feature = "testing"), feature = "web"))]
pub fn math_to_text(
    math_object: &JsMathExpr,
    params: ToTextParams,
) -> Result<String, anyhow::Error> {
    let result: JsString = toText(
        math_object.to_js_string(),
        params.pad_to_decimals.map(Number::from),
        params.pad_to_digits.map(Number::from),
        Boolean::from(params.show_blanks),
    )
    .map_err(|e| anyhow!("{:?}", e))?;
    Ok(result.into())
}
#[cfg(any(feature = "testing", not(feature = "web")))]
pub fn math_to_text(
    _math_object: &JsMathExpr,
    _params: ToTextParams,
) -> Result<String, anyhow::Error> {
    Err(anyhow!(
        "math_to_text is only available when compiled with the `web` feature".to_string(),
    ))
}

/// Parse a string into math using the `math-expressions` latex parser.
///
/// Parameters:
/// - `latex`: the string to be parsed
/// - `split_symbols`: if true, split multi-character symbols that do not contain an number
///   into the product of the characters.
/// - `function_symbols`: a list of the symbols that will be treated as a function,
///   i.e., one of these symbols followed by arguments in parentheses
///   will be interpreted as apply that function to the arguments (rather than multiplication)
///
/// Examples:
/// - `parse_latex_into_math(r#"\frac{xy}{z}"#, true, &["g"])` is `x` times `y` divided by `z`.
/// - `parse_latex_into_math(r#"\frac{xy}{z}"#, false, &["g"])` is the multi-character symbol `xy` divided by `z`.
/// - `parse_latex_into_math("g(x)", true, &["f", "g"])` is the function `g` evaluated at `x`.
/// - `parse_latex_into_math("g(x)", true, &["f"])` is `g` times `x`.
#[cfg(all(not(feature = "testing"), feature = "web"))]
pub fn parse_latex_into_math<Latex: AsRef<str>, FnSymbol: AsRef<str>>(
    latex: Latex,
    split_symbols: bool,
    function_symbols: &[FnSymbol],
) -> Result<JsMathExpr, anyhow::Error> {
    let js_function_symbols = JsValue::from(
        function_symbols
            .iter()
            .map(|x| JsValue::from_str(x.as_ref()))
            .collect::<Array>(),
    );
    let result: JsString = parseLatexIntoMath(
        JsString::from(latex.as_ref()),
        Boolean::from(split_symbols),
        js_function_symbols,
    )
    .map_err(|e| anyhow!("{:?}", e))?;
    Ok(JsMathExpr(result.into()))
}
#[cfg(any(feature = "testing", not(feature = "web")))]
pub fn parse_latex_into_math<Latex: AsRef<str>, FnSymbol: AsRef<str>>(
    _latex: Latex,
    _split_symbols: bool,
    _function_symbols: &[FnSymbol],
) -> Result<JsMathExpr, anyhow::Error> {
    Err(anyhow!(
        "parse_latex_into_math is only available when compiled with the `web` feature".to_string()
    ))
}

/// Return a LaTeX string that corresponds to the mathematical expression `math_object`.
/// The behavior is controlled by `params`.
///
/// Examples:
/// ```
/// let expr = parse_text_into_math("123 / 0.05", true, &["f"]).unwrap();
///
/// assert_eq!(
///     math_to_latex(&expr, ToLatexParams::default()).unwrap(),
///     r#"\frac{123}{0.05}"#
/// );
///
/// let pad_three_decimals = ToLatexParams {
///     pad_to_decimals: Some(3),
///     ..Default::default()
/// };
/// assert_eq!(
///     math_to_latex(&expr, pad_three_decimals).unwrap(),
///     r#"\frac{123.000}{0.050}"#
/// );
///
/// let pad_four_digits = ToLatexParams {
///     pad_to_digits: Some(4),
///     ..Default::default()
/// };
/// assert_eq!(
///     math_to_latex(&expr, pad_four_digits).unwrap(),
///     r#"\frac{123.0}{0.05000}"#
/// );
///
/// let expr_with_blanks = parse_text_into_math("x + ()", true, &["f"]).unwrap();
///
/// assert_eq!(
///     math_to_latex(&expr_with_blanks, ToLatexParams::default()).unwrap(),
///     "x + \u{FF3F}"
/// );
///
/// let hide_blanks = ToLatexParams {
///     show_blanks: false,
///     ..Default::default()
/// };
/// assert_eq!(
///     math_to_latex(&expr_with_blanks, hide_blanks).unwrap(),
///     "x + "
/// );
/// ````
#[cfg(all(not(feature = "testing"), feature = "web"))]
pub fn math_to_latex(
    math_object: &JsMathExpr,
    params: ToLatexParams,
) -> Result<String, anyhow::Error> {
    let result: JsString = toLatex(
        math_object.to_js_string(),
        params.pad_to_decimals.map(Number::from),
        params.pad_to_digits.map(Number::from),
        Boolean::from(params.show_blanks),
    )
    .map_err(|e| anyhow!("{:?}", e))?;
    Ok(result.into())
}
#[cfg(any(feature = "testing", not(feature = "web")))]
pub fn math_to_latex(
    _math_object: &JsMathExpr,
    _params: ToLatexParams,
) -> Result<String, anyhow::Error> {
    Err(anyhow!(
        "math_to_latex is only available when compiled with the `web` feature".to_string(),
    ))
}

/// Create a new mathematical expression formed by substituting variables with new expressions
///
/// Parameters:
/// - `math_object`: a serialized `math-expressions` object
/// - `substitutions`: a `HashMap` mapping variables to new expressions
///
/// Example:
///
/// ```
/// let expr1 = parse_text_into_math("x+y", true, &["f"]).unwrap();
///
/// let substitutions =
///   HashMap::from([("y".to_string(), MathArg::Symbol("z".to_string()))]);
/// let expr2 = substitute_into_math(&expr1, &substitutions).unwrap();
///
/// assert_eq!(
///    math_to_latex(&expr2, ToLatexParams::default()).unwrap(),
///    "x + z"
/// );
/// ```
#[cfg(all(not(feature = "testing"), feature = "web"))]
pub fn substitute_into_math(
    math_object: &JsMathExpr,
    substitutions: &HashMap<String, MathArg>,
) -> Result<JsMathExpr, anyhow::Error> {
    let substitutions = serde_wasm_bindgen::to_value(&substitutions).unwrap();

    let result: JsString = substituteIntoMath(math_object.to_js_string(), substitutions)
        .map_err(|e| anyhow!("{:?}", e))?;
    Ok(JsMathExpr(result.into()))
}
#[cfg(any(feature = "testing", not(feature = "web")))]
pub fn substitute_into_math(
    _math_object: &JsMathExpr,
    _substitutions: &HashMap<String, MathArg>,
) -> Result<JsMathExpr, anyhow::Error> {
    Err(anyhow!(
        "substitute_into_math is only available when compiled with the `web` feature".to_string()
    ))
}

/// Return a normalized mathematical expression from `math_object` as specified in `params`.
///
/// Example:
///
/// ```
/// let expr = parse_text_into_math("(x+x+1)(2y+1-y)", true, &["f"]).unwrap();
///
/// let simplify_expand = NormalizeParams {
///     simplify: MathSimplify::Full,
///     expand: true,
///     ..Default::default()
/// };
///
/// assert_eq!(
///     math_to_latex(normalize_math(&expr, simplify_expand).unwrap(), ToLatexParams::default()).unwrap(),
///     "2 x y + 2 x + y + 1"
/// );
/// ```
#[cfg(all(not(feature = "testing"), feature = "web"))]
pub fn normalize_math(
    math_object: &JsMathExpr,
    params: NormalizeParams,
) -> Result<JsMathExpr, anyhow::Error> {
    let result: JsString = normalizeMath(
        math_object.to_js_string(),
        // TODO: remove .to_lowercase() once normalizeMath isn't sharing code with the Javascript core
        // that is depending on the simplify variant "numberspreserveorder" being in lowercase.
        JsString::from(params.simplify.to_string().to_lowercase()),
        Boolean::from(params.expand),
        Boolean::from(params.create_vectors),
        Boolean::from(params.create_intervals),
    )
    .map_err(|e| anyhow!("{:?}", e))?;
    Ok(JsMathExpr(result.into()))
}
#[cfg(any(feature = "testing", not(feature = "web")))]
pub fn normalize_math(
    _math_object: &JsMathExpr,
    _params: NormalizeParams,
) -> Result<JsMathExpr, anyhow::Error> {
    Err(anyhow!(
        "normalize_math is only available when compiled with the `web` feature".to_string()
    ))
}

/// Evaluates mathematical expression from `math_object` as a number,
/// returning NaN if the expression cannot be evaluated as a constant number.
///
/// Example:
///
/// ```
/// let expr = parse_text_into_math("3/e^0", true, &["f"]).unwrap();
///
/// assert_eq!(
///     evaluate_to_number(&expr).unwrap(),
///     3
/// );
///
/// let expr2 = parse_text_into_math("x", true, &["f"]).unwrap();
///
/// assert!(
///     evaluate_to_number(&expr2).unwrap().is_nan()
/// );
/// ```
#[cfg(all(not(feature = "testing"), feature = "web"))]
pub fn evaluate_to_number(
    math_object: &JsMathExpr,
) -> Result<crate::props::prop_type::Number, anyhow::Error> {
    let result: JsValue =
        evaluateToNumber(math_object.to_js_string()).map_err(|e| anyhow!("{:?}", e))?;
    result
        .as_f64()
        .ok_or(anyhow!("evaluateToNumber() did not return a number!"))
}
#[cfg(any(feature = "testing", not(feature = "web")))]
pub fn evaluate_to_number(
    _math_object: &JsMathExpr,
) -> Result<crate::props::prop_type::Number, anyhow::Error> {
    Err(anyhow!(
        "evaluate_to_number is only available when compiled with the `web` feature".to_string()
    ))
}

/// Parse a string into math using the `math-expressions` text parser and then attempt to evaluate the result
/// as a number
///
/// Parameters:
/// - `text`: the string to be parsed
///
/// Examples:
/// - `parse_text_into_number("3-e^0")` is 2.
#[cfg(all(not(feature = "testing"), feature = "web"))]
pub fn parse_text_into_number<Text: AsRef<str>>(
    text: Text,
) -> Result<crate::props::prop_type::Number, anyhow::Error> {
    let result: JsValue =
        parseTextIntoNumber(JsString::from(text.as_ref())).map_err(|e| anyhow!("{:?}", e))?;
    result
        .as_f64()
        .ok_or(anyhow!("parseTextIntoNumber() did not return a number!"))
}
#[cfg(any(feature = "testing", not(feature = "web")))]
pub fn parse_text_into_number<Text: AsRef<str>>(
    _text: Text,
) -> Result<crate::props::prop_type::Number, anyhow::Error> {
    Err(anyhow!(
        "parse_text_into_number is only available when compiled with the `web` feature".to_string()
    ))
}

#[cfg(all(not(feature = "testing"), feature = "web"))]
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
    pub fn evalWithMathExpressionsInScope(source: JsString) -> Result<JsString, JsValue>;

    #[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
    pub fn parseTextIntoMath(
        source: JsString,
        splitSymbols: Boolean,
        functionSymbols: JsValue,
    ) -> Result<JsString, JsValue>;

    #[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
    pub fn toText(
        mathObject: JsString,
        padToDecimals: Option<Number>,
        padToDigits: Option<Number>,
        showBlanks: Boolean,
    ) -> Result<JsString, JsValue>;

    #[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
    pub fn parseLatexIntoMath(
        source: JsString,
        splitSymbols: Boolean,
        functionSymbols: JsValue,
    ) -> Result<JsString, JsValue>;

    #[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
    pub fn toLatex(
        mathObject: JsString,
        padToDecimals: Option<Number>,
        padToDigits: Option<Number>,
        showBlanks: Boolean,
    ) -> Result<JsString, JsValue>;

    #[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
    pub fn substituteIntoMath(
        mathObject: JsString,
        substitutions: JsValue,
    ) -> Result<JsString, JsValue>;

    #[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
    pub fn normalizeMath(
        mathObject: JsString,
        simplify: JsString,
        expand: Boolean,
        createVectors: Boolean,
        createIntervals: Boolean,
    ) -> Result<JsString, JsValue>;

    #[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
    pub fn evaluateToNumber(mathObject: JsString) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
    pub fn parseTextIntoNumber(source: JsString) -> Result<JsValue, JsValue>;
}
