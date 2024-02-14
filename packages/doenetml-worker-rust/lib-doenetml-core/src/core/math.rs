#[cfg(not(feature = "testing"))]
use wasm_bindgen::prelude::*;
#[cfg(not(feature = "testing"))]
use web_sys::js_sys::Array;
#[cfg(not(feature = "testing"))]
use web_sys::js_sys::Boolean;
#[cfg(not(feature = "testing"))]
use web_sys::js_sys::JsString;
#[cfg(not(feature = "testing"))]
use web_sys::js_sys::Number;

use std::collections::HashMap;

use crate::state::types::math_expr::{MathOrPrimitive, NormalizeParams, ToLatexParams};
use crate::DoenetMLCore;

impl DoenetMLCore {
    #[cfg(not(feature = "testing"))]
    pub fn eval_js(source: &str) -> Result<String, String> {
        let result: JsString = evalWithMathExpressionsInScope(JsString::from(source))
            .map_err(|e| format!("{:?}", e))?;
        Ok(result.into())
    }
    #[cfg(feature = "testing")]
    pub fn eval_js(_source: &str) -> Result<String, String> {
        Err("eval_js is only available when compiled with the `web` feature".to_string())
    }

    /// Parsing a string into math using the `math-expressions` text parser.
    ///
    /// Parameters:
    /// - `text`: the string to be parsed
    /// - `split_symbols`: if true, split multi-character symbols that do not contain an number
    ///   into the product of the characters.
    /// - `function_symbols`: a list of the symbols that will be treated as a function,
    ///   i.e., one of these symbols followed by arguments in parentheses
    ///   will be interpreted as apply that function to the arguments (rather than multiplication)
    #[cfg(not(feature = "testing"))]
    pub fn parse_text_into_math<'a, TXT: AsRef<str>, FnSymbol: AsRef<str>>(
        text: TXT,
        split_symbols: bool,
        function_symbols: &[FnSymbol],
    ) -> Result<String, String> {
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
        .map_err(|e| format!("{:?}", e))?;
        Ok(result.into())
    }
    #[cfg(feature = "testing")]
    pub fn parse_text_into_math<'a, TXT: AsRef<str>, FnSymbol: AsRef<str>>(
        _text: TXT,
        _split_symbols: bool,
        _function_symbols: &[FnSymbol],
    ) -> Result<String, String> {
        Err(
            "parse_text_into_math is only available when compiled with the `web` feature"
                .to_string(),
        )
    }

    /// Parsing a string into math using the `math-expressions` latex parser.
    ///
    /// Parameters:
    /// - `latex`: the string to be parsed
    /// - `split_symbols`: if true, split multi-character symbols that do not contain an number
    ///   into the product of the characters.
    /// - `function_symbols`: a list of the symbols that will be treated as a function,
    ///   i.e., one of these symbols followed by arguments in parentheses
    ///   will be interpreted as apply that function to the arguments (rather than multiplication)
    #[cfg(not(feature = "testing"))]
    pub fn parse_latex_into_math<'a, TXT: AsRef<str>, FnSymbol: AsRef<str>>(
        latex: TXT,
        split_symbols: bool,
        function_symbols: &[FnSymbol],
    ) -> Result<String, String> {
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
        .map_err(|e| format!("{:?}", e))?;
        Ok(result.into())
    }
    #[cfg(feature = "testing")]
    pub fn parse_latex_into_math<'a, TXT: AsRef<str>, FnSymbol: AsRef<str>>(
        _latex: TXT,
        _split_symbols: bool,
        _function_symbols: &[FnSymbol],
    ) -> Result<String, String> {
        Err(
            "parse_latex_into_math is only available when compiled with the `web` feature"
                .to_string(),
        )
    }

    /// Return a LaTeX string that corresponds to the mathematical expression `math_object`.
    /// The behavior is controlled by `params`.
    #[cfg(not(feature = "testing"))]
    pub fn to_latex(math_object: &str, params: ToLatexParams) -> Result<String, String> {
        let result: JsString = toLatex(
            JsString::from(math_object),
            params.pad_to_decimals.map(Number::from),
            params.pad_to_digits.map(Number::from),
            Boolean::from(params.show_blanks),
        )
        .map_err(|e| format!("{:?}", e))?;
        Ok(result.into())
    }
    #[cfg(feature = "testing")]
    pub fn to_latex(_math_object: &str, _params: ToLatexParams) -> Result<String, String> {
        Err("to_latex is only available when compiled with the `web` feature".to_string())
    }

    /// Create a new mathematical expression formed by substituting variables with new expressions
    ///
    /// Parameters:
    /// - `math_object`: a serialized `math-expressions` object
    /// - `substitutions`: a `HashMap` mapping variables to new expressions
    #[cfg(not(feature = "testing"))]
    pub fn substitute_into_math(
        math_object: &str,
        substitutions: &HashMap<String, MathOrPrimitive>,
    ) -> Result<String, String> {
        let substitutions = serde_wasm_bindgen::to_value(&substitutions).unwrap();

        let result: JsString = substituteIntoMath(JsString::from(math_object), substitutions)
            .map_err(|e| format!("{:?}", e))?;
        Ok(result.into())
    }
    #[cfg(feature = "testing")]
    pub fn substitute_into_math(
        _math_object: &str,
        _substitutions: &HashMap<String, MathOrPrimitive>,
    ) -> Result<String, String> {
        Err(
            "substitute_into_math is only available when compiled with the `web` feature"
                .to_string(),
        )
    }

    /// Return a normalize mathematical expression from `math_object` as specified in `params`.
    #[cfg(not(feature = "testing"))]
    pub fn normalize_math(math_object: &str, params: NormalizeParams) -> Result<String, String> {
        use crate::utils::log;

        log!("simplify to string: {}", params.simplify.to_string());
        log!(
            "simplify to string: {}",
            params.simplify.to_string().to_lowercase()
        );
        let result: JsString = normalizeMath(
            JsString::from(math_object),
            JsString::from(params.simplify.to_string().to_lowercase()), // TODO: remove .to_lowercase()
            Boolean::from(params.expand),
            Boolean::from(params.create_vectors),
            Boolean::from(params.create_intervals),
        )
        .map_err(|e| format!("{:?}", e))?;
        Ok(result.into())
    }
    #[cfg(feature = "testing")]
    pub fn normalize_math(_math_object: &str, _params: NormalizeParams) -> Result<String, String> {
        Err("normalize_math is only available when compiled with the `web` feature".to_string())
    }
}

#[cfg(not(feature = "testing"))]
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
}
