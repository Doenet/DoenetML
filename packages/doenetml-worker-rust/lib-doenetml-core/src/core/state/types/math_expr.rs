use std::collections::HashMap;
use strum_macros::Display;

#[cfg(all(not(feature = "testing"), feature = "web"))]
use web_sys::js_sys::JsString;

use crate::math_via_wasm::{
    eval_js, math_to_latex, normalize_math, parse_latex_into_math, parse_text_into_math,
    substitute_into_math,
};

const BLANK_MATH_OBJECT: &str = "{\"objectType\":\"math-expression\",\"tree\":\"\u{ff3f}\"}";

/// A symbolic mathematical expression.
///
/// The expression can be created from a text string or a latex string.
/// Mathematical operations, simplification and other normalizations, and latex output are supported.
///
/// `MathExpr` is currently a wrapper on the `math-expressions` Javascript library.
/// Data on this object is stored a serialized string of the `math-expressions` object,
/// which is deserialize to perform operations in Javascript and then serialized when sent back to Rust.
/// This architecture may have performance implications
/// and may be replaced by a Rust-based symbolic tool in the future.
#[derive(Debug, Clone, PartialEq, serde::Deserialize)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub struct MathExpr {
    pub math_object: JsMathExpr,
}

impl MathExpr {
    /// Produce a string representation of the `MathExpr`
    /// that will be revived into the `math-expression` object when eval'ed in Javascript.
    pub fn to_reviver_string(&self) -> String {
        format!(
            "JSON.parse({}, serializedComponentsReviver)",
            serde_json::to_string(&self.math_object.0).unwrap()
        )
    }
}

#[derive(Debug, Clone, PartialEq, serde::Deserialize)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub struct JsMathExpr(pub String);

#[cfg(all(not(feature = "testing"), feature = "web"))]
impl JsMathExpr {
    pub fn to_js_string(&self) -> JsString {
        JsString::from(self.0.as_str())
    }
}

impl Default for MathExpr {
    fn default() -> Self {
        MathExpr {
            math_object: JsMathExpr(BLANK_MATH_OBJECT.to_string()),
        }
    }
}

impl std::fmt::Display for MathExpr {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.to_latex(ToLatexParams::default()))
    }
}

impl serde::Serialize for MathExpr {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.math_object.0)
    }
}

impl MathExpr {
    /// Create a `Math` by parsing the string `text` using the `math-expressions` text parser.
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
    /// - `MathExpr::from_text("xy", true, &["f"])` is `x` times `y`.
    /// - `MathExpr::from_text("xy", false, &["f"])` is the multi-character symbol `xy`.
    /// - `MathExpr::from_text("g(x)", true, &["f", "g"])` is the function `g` evaluated at `x`.
    /// - `MathExpr::from_text("g(x)", true, &["f"])` is `g` times `x`.
    pub fn from_text<TXT: AsRef<str>, FnSymbol: AsRef<str>>(
        text: TXT,
        split_symbols: bool,
        function_symbols: &[FnSymbol],
    ) -> Self {
        let s = text.as_ref();

        let math_object = match parse_text_into_math(s, split_symbols, function_symbols) {
            Ok(res) => res,
            Err(_) => JsMathExpr(BLANK_MATH_OBJECT.to_owned()),
        };

        MathExpr { math_object }
    }

    /// Create a `Math` by parsing the string `latex` using the `math-expressions` latex parser.
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
    /// - `MathExpr::from_latex(r#"\frac{xy}{z}"#, true, &["f"])` is `x` times `y` divided by `z`.
    /// - `MathExpr::from_latex(r#"\frac{xy}{z}"#, false, &["f"])` is the multi-character symbol `xy` divided by `z`.
    /// - `MathExpr::from_latex("g(x)", true, &["f", "g"])` is the function `g` evaluated at `x`.
    /// - `MathExpr::from_latex("g(x)", true, &["f"])` is `g` times `x`.
    pub fn from_latex<TXT: AsRef<str>, FnSymbol: AsRef<str>>(
        latex: TXT,
        split_symbols: bool,
        function_symbols: &[FnSymbol],
    ) -> Self {
        let s = latex.as_ref();

        let math_object = match parse_latex_into_math(s, split_symbols, function_symbols) {
            Ok(res) => res,
            Err(_) => JsMathExpr(BLANK_MATH_OBJECT.to_owned()),
        };

        MathExpr { math_object }
    }

    /// Return a LaTeX string that corresponds to the mathematical expression.
    /// The behavior is controlled by `params`.
    ///
    /// Examples:
    ///
    /// ```no_run
    /// # use doenetml_core::state::types::math_expr::{MathExpr, ToLatexParams};
    /// let expr = MathExpr::from_text("123 / 0.05", true, &["f"]);
    ///
    /// assert_eq!(
    ///     expr.to_latex(ToLatexParams::default()),
    ///     r#"\frac{123}{0.05}"#
    /// );
    ///
    /// let pad_three_decimals = ToLatexParams {
    ///     pad_to_decimals: Some(3),
    ///     ..Default::default()
    /// };
    /// assert_eq!(
    ///     expr.to_latex(pad_three_decimals),
    ///     r#"\frac{123.000}{0.050}"#
    /// );
    ///
    /// let pad_four_digits = ToLatexParams {
    ///     pad_to_digits: Some(4),
    ///     ..Default::default()
    /// };
    /// assert_eq!(expr.to_latex(pad_four_digits), r#"\frac{123.0}{0.05000}"#);
    ///
    /// let expr_with_blanks = MathExpr::from_text("x + ()", true, &["f"]);
    ///
    /// assert_eq!(
    ///     expr_with_blanks.to_latex(ToLatexParams::default()),
    ///     "x + \u{FF3F}"
    /// );
    ///
    /// let hide_blanks = ToLatexParams {
    ///     show_blanks: false,
    ///     ..Default::default()
    /// };
    /// assert_eq!(expr_with_blanks.to_latex(hide_blanks), "x + ");
    /// ```
    pub fn to_latex(&self, params: ToLatexParams) -> String {
        match math_to_latex(&self.math_object, params) {
            Ok(res) => res,
            Err(_) => "\u{FF3f}".to_string(),
        }
    }

    /// Create a new mathematical expression formed by substituting variables with new expressions
    ///
    /// Parameters:
    /// - `substitutions`: a `HashMap` mapping variables to new expressions
    ///
    /// Example:
    ///
    /// ```no_run
    /// # use doenetml_core::state::types::math_expr::{MathExpr, MathArg, ToLatexParams};
    /// # use std::collections::HashMap;
    /// let expr1 = MathExpr::from_text("x+y", true, &["f"]);
    ///
    /// let substitutions =
    ///     HashMap::from([("y".to_string(), MathArg::Symbol("z".to_string()))]);
    /// let expr2 = expr1.substitute(&substitutions);
    ///
    /// assert_eq!(expr2.to_latex(ToLatexParams::default()), "x + z");
    /// ```
    pub fn substitute(&self, substitutions: &HashMap<String, MathArg>) -> MathExpr {
        let math_object = match substitute_into_math(&self.math_object, substitutions) {
            Ok(res) => res,
            Err(_) => JsMathExpr(BLANK_MATH_OBJECT.to_owned()),
        };

        MathExpr { math_object }
    }

    /// Normalize a mathematical expression as specified in `params`.
    ///
    /// Example:
    ///
    /// ```no_run
    /// # use doenetml_core::state::types::math_expr::{MathExpr, MathSimplify, NormalizeParams, ToLatexParams};
    /// let expr = MathExpr::from_text("(x+x+1)(2y+1-y)", true, &["f"]);
    ///
    /// let simplify_expand = NormalizeParams {
    ///     simplify: MathSimplify::Full,
    ///     expand: true,
    ///     ..Default::default()
    /// };
    ///
    /// assert_eq!(
    ///     expr.normalize(simplify_expand).to_latex(ToLatexParams::default()),
    ///     "2 x y + 2 x + y + 1"
    /// );
    /// ```
    pub fn normalize(&self, params: NormalizeParams) -> MathExpr {
        let math_object = match normalize_math(&self.math_object, params) {
            Ok(res) => res,
            Err(_) => JsMathExpr(BLANK_MATH_OBJECT.to_owned()),
        };

        MathExpr { math_object }
    }

    /// Create a new mathematical expression by adding `term` to the current expression.
    pub fn add(&self, term: MathArg) -> MathExpr {
        let js_source = format!(
            r#"{}.add({});"#,
            self.to_reviver_string(),
            term.to_reviver_string()
        );

        let math_object = JsMathExpr(match eval_js(&js_source) {
            Ok(res) => res,
            Err(_) => BLANK_MATH_OBJECT.to_owned(),
        });

        MathExpr { math_object }
    }

    /// Create a new mathematical expression by subtracting `term` to the current expression.
    pub fn subtract(&self, term: MathArg) -> MathExpr {
        let js_source = format!(
            r#"{}.subtract({});"#,
            self.to_reviver_string(),
            term.to_reviver_string()
        );

        let math_object = JsMathExpr(match eval_js(&js_source) {
            Ok(res) => res,
            Err(_) => BLANK_MATH_OBJECT.to_owned(),
        });

        MathExpr { math_object }
    }

    /// Create a new mathematical expression by multiplying the current expression by `term`.
    pub fn multiply(&self, factor: MathArg) -> MathExpr {
        let js_source = format!(
            r#"{}.multiply({});"#,
            self.to_reviver_string(),
            factor.to_reviver_string()
        );

        let math_object = JsMathExpr(match eval_js(&js_source) {
            Ok(res) => res,
            Err(_) => BLANK_MATH_OBJECT.to_owned(),
        });

        MathExpr { math_object }
    }

    /// Create a new mathematical expression by dividing the current expression by `term`.
    pub fn divide(&self, factor: MathArg) -> MathExpr {
        let js_source = format!(
            r#"{}.divide({});"#,
            self.to_reviver_string(),
            factor.to_reviver_string()
        );

        let math_object = JsMathExpr(match eval_js(&js_source) {
            Ok(res) => res,
            Err(_) => BLANK_MATH_OBJECT.to_owned(),
        });

        MathExpr { math_object }
    }
}

/// An mathematical value that can be used in the arguments of functions exposed on `MathExpr`.
///
/// These values will be automatically converted to a `MathExpr` before the functions operate on them,
/// allowing one to use primitive values like numbers rather than first explicitly creating a `MathExpr`.
///
/// For example, if `math_expr` is a `MathExpr`, then `math_expr.add(MathArg::Integer(1))` adds `1`.
#[derive(Debug)]
pub enum MathArg {
    Math(MathExpr),
    Number(f64),
    Integer(i64),
    Symbol(String),
}

impl serde::Serialize for MathArg {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        // Serialize all variants so that, after deserialization on the Javascript side,
        // one still has to call JSON.parse() to finish the hydration,
        // given that this last step is required for the Math variant
        match self {
            Self::Math(math_expr) => math_expr.serialize(serializer),
            Self::Number(num) => serializer.serialize_str(&num.to_string()),
            Self::Integer(num) => serializer.serialize_str(&num.to_string()),
            Self::Symbol(var_name) => {
                serializer.serialize_str(&serde_json::to_value(var_name).unwrap().to_string())
            }
        }
    }
}

impl MathArg {
    /// Produce a string representation of the `MathArg`
    /// that will be revived into a Javascript object when eval'ed in Javascript.
    pub fn to_reviver_string(&self) -> String {
        format!(
            "JSON.parse({}, serializedComponentsReviver)",
            serde_json::to_string(&self).unwrap()
        )
    }
}

/// Parameters for creating a latex string from a `Math`:
#[derive(Debug, Clone, Copy)]
pub struct ToLatexParams {
    /// If present, then pad numbers with zeros so they have at least
    /// this many decimal places after the decimal point displayed.
    pub pad_to_decimals: Option<u32>,
    /// If present, then pad numbers with zeros so they have at least
    /// this many total digits displayed.
    pub pad_to_digits: Option<u32>,
    /// If `true`, then display any blanks in the mathematical expression
    /// as a long underscore.
    pub show_blanks: bool,
}

impl Default for ToLatexParams {
    fn default() -> Self {
        ToLatexParams {
            pad_to_decimals: None,
            pad_to_digits: None,
            show_blanks: true,
        }
    }
}
/// Levels of simplification of mathematical expressions.
///
/// Examples:
///
/// ```no_run
/// # use doenetml_core::state::types::math_expr::{MathExpr, MathSimplify, NormalizeParams, ToLatexParams};
/// let expr = MathExpr::from_text("1+x+x+2+3", true, &["f"]);
///
/// let simplify_full = NormalizeParams {
///     simplify: MathSimplify::Full,
///     ..Default::default()
/// };
///
/// assert_eq!(expr.normalize(simplify_full).to_latex(ToLatexParams::default()), "2 x + 6");
///
/// let simplify_numbers = NormalizeParams {
///     simplify: MathSimplify::Numbers,
///     ..Default::default()
/// };
///
/// assert_eq!(expr.normalize(simplify_numbers).to_latex(ToLatexParams::default()), "x + x + 6");
///
/// let simplify_numbers_preserve_order = NormalizeParams {
///     simplify: MathSimplify::NumbersPreserveOrder,
///     ..Default::default()
/// };
///
/// assert_eq!(
///     expr.normalize(simplify_numbers_preserve_order).to_latex(ToLatexParams::default()),
///     "1 + x + x + 5"
/// );
/// ```
#[derive(Debug, Display, Default, Clone, Copy)]
#[strum(serialize_all = "camelCase")]
pub enum MathSimplify {
    /// No simplification is performed.
    None,
    /// Simplify numbers within the expression, such as simplify `1+1` to 2,
    /// except do not change the order between numerical and non-numerical operands (such as a variable).
    NumbersPreserveOrder,
    /// Simplify numbers within the expression, such as simplify `1+1` to 2,
    Numbers,
    /// Simplify the mathematical expression using the currently
    /// implemented features. These features are limited and subject to change.
    /// For example, simplification of ratio expressions is essentially non-existent.
    #[default]
    Full,
}

/// Parameters for normalizing a mathematical expression
///  
/// Example:
///
/// ```no_run
/// # use doenetml_core::state::types::math_expr::{MathExpr, MathSimplify, NormalizeParams, ToLatexParams};
/// let expr = MathExpr::from_text("(x+x+1)(2y+1-y)", true, &["f"]);
///
/// let simplify_expand = NormalizeParams {
///     simplify: MathSimplify::Full,
///     expand: true,
///     ..Default::default()
/// };
///
/// assert_eq!(
///     expr.normalize(simplify_expand).to_latex(ToLatexParams::default()),
///     "2 x y + 2 x + y + 1"
/// );
/// ```

// TODO: add examples with createVectors and createIntervals
// once have a way to demonstrate their effect
#[derive(Debug, Default, Clone, Copy)]
pub struct NormalizeParams {
    /// See [`MathSimplify`] for the simplification options supported.
    pub simplify: MathSimplify,
    /// If `true`, expand out multiplication over addition/subtraction.
    pub expand: bool,
    /// If `true`, create vectors out of tuples (that haven't previously been turned into intervals).
    pub create_vectors: bool,
    /// If `true`, create closed intervals out of arrays and open intervals out of tuples
    /// (that haven't previously been turned into vectors).
    /// If both `create_vectors` and `create_intervals` are `true`,
    /// `create_vectors` is applied first so that only arrays will be affected by `create_intervals`.
    pub create_intervals: bool,
}

/// We can parse a string into a mathematical expression with either a text or a latex parser
#[derive(Debug, Default, Clone, Copy)]
pub enum MathParser {
    #[default]
    Text,
    Latex,
}
