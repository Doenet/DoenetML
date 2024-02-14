#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;
#[cfg(feature = "web")]
use web_sys::js_sys::Array;
#[cfg(feature = "web")]
use web_sys::js_sys::Boolean;
#[cfg(feature = "web")]
use web_sys::js_sys::JsString;
#[cfg(feature = "web")]
use web_sys::js_sys::Number;

use std::collections::HashMap;

use crate::state::types::math::MathOrPrimitive;
use crate::DoenetMLCore;

impl DoenetMLCore {
    #[cfg(feature = "web")]
    pub fn eval_js(source: &str) -> Result<String, String> {
        let result: JsString = evalWithMathExpressionsInScope(JsString::from(source))
            .map_err(|e| format!("{:?}", e))?;
        Ok(result.into())
    }
    #[cfg(not(feature = "web"))]
    pub fn eval_js(source: &str) -> Result<String, String> {
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
    #[cfg(feature = "web")]
    pub fn parse_text_into_math<'a, TXT: AsRef<str>, FnSymbols: AsRef<[&'a str]>>(
        text: TXT,
        split_symbols: bool,
        function_symbols: FnSymbols,
    ) -> Result<String, String> {
        let js_function_symbols = JsValue::from(
            function_symbols
                .as_ref()
                .into_iter()
                .map(|x| JsValue::from_str(x))
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
    #[cfg(not(feature = "web"))]
    pub fn parse_text_into_math<'a, TXT: AsRef<str>, FnSymbols: AsRef<[&'a str]>>(
        text: TXT,
        split_symbols: bool,
        function_symbols: FnSymbols,
    ) -> Result<String, String> {
        Err(
            "parse_text_into_math is only available when compiled with the `web` feature"
                .to_string(),
        )
    }

    #[cfg(feature = "web")]
    /// Parsing a string into math using the `math-expressions` latex parser.
    ///
    /// Parameters:
    /// - `latex`: the string to be parsed
    /// - `split_symbols`: if true, split multi-character symbols that do not contain an number
    ///   into the product of the characters.
    /// - `function_symbols`: a list of the symbols that will be treated as a function,
    ///   i.e., one of these symbols followed by arguments in parentheses
    ///   will be interpreted as apply that function to the arguments (rather than multiplication)
    pub fn parse_latex_into_math<'a, TXT: AsRef<str>, FnSymbols: AsRef<[&'a str]>>(
        latex: TXT,
        split_symbols: bool,
        function_symbols: FnSymbols,
    ) -> Result<String, String> {
        let js_function_symbols = JsValue::from(
            function_symbols
                .as_ref()
                .into_iter()
                .map(|x| JsValue::from_str(x))
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
    #[cfg(not(feature = "web"))]
    pub fn parse_latex_into_math<'a, TXT: AsRef<str>, FnSymbols: AsRef<[&'a str]>>(
        latex: TXT,
        split_symbols: bool,
        function_symbols: FnSymbols,
    ) -> Result<String, String> {
        Err(
            "parse_latex_into_math is only available when compiled with the `web` feature"
                .to_string(),
        )
    }

    /// Return a LaTeX string that corresponds to a mathematical expression.
    ///
    /// Parameters:
    /// - `math_object`: a serialized `math-expressions` object
    /// - `pad_to_decimals`: if present, then pad numbers with zeros so they have at least
    /// this many decimal places after the decimal point displayed
    /// - `pad_to_digits`: if present, then pad numbers zeros so they have at least
    /// this many total digits displayed
    /// - `show_blanks`: if true, then display any blanks in the mathematical expression
    /// as a long underscore
    #[cfg(feature = "web")]
    pub fn to_latex(
        math_object: &str,
        pad_to_decimals: Option<i32>,
        pad_to_digits: Option<i32>,
        show_blanks: Option<bool>,
    ) -> Result<String, String> {
        let result: JsString = toLatex(
            JsString::from(math_object),
            pad_to_decimals.map(Number::from),
            pad_to_digits.map(Number::from),
            show_blanks.map(Boolean::from),
        )
        .map_err(|e| format!("{:?}", e))?;
        Ok(result.into())
    }
    #[cfg(not(feature = "web"))]
    pub fn to_latex(
        math_object: &str,
        pad_to_decimals: Option<i32>,
        pad_to_digits: Option<i32>,
        show_blanks: Option<bool>,
    ) -> Result<String, String> {
        Err("to_latex is only available when compiled with the `web` feature".to_string())
    }

    /// Create a new mathematical expression formed by substituting variables with new expressions
    ///
    /// Parameters:
    /// - `math_object`: a serialized `math-expressions` object
    /// - `substitutions`: a `HashMap` mapping variables to new expressions
    #[cfg(feature = "web")]
    pub fn substitute_into_math(
        math_object: &str,
        substitutions: &HashMap<String, MathOrPrimitive>,
    ) -> Result<String, String> {
        let substitutions = serde_wasm_bindgen::to_value(&substitutions).unwrap();

        let result: JsString = substituteIntoMath(JsString::from(math_object), substitutions)
            .map_err(|e| format!("{:?}", e))?;
        Ok(result.into())
    }
    #[cfg(not(feature = "web"))]
    pub fn substitute_into_math(
        math_object: &str,
        substitutions: HashMap<String, MathOrPrimitive>,
    ) -> Result<String, String> {
        Err(
            "substitute_into_math is only available when compiled with the `web` feature"
                .to_string(),
        )
    }
}

#[cfg(feature = "web")]
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
        showBlanks: Option<Boolean>,
    ) -> Result<JsString, JsValue>;

    #[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
    pub fn substituteIntoMath(
        mathObject: JsString,
        substitutions: JsValue,
    ) -> Result<JsString, JsValue>;
}
