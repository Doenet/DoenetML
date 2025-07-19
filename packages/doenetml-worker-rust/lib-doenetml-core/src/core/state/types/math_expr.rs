use anyhow::anyhow;
use itertools::Itertools;
use serde::ser::SerializeStruct;
use std::collections::HashMap;
use strum_macros::Display;

#[cfg(all(not(feature = "testing"), feature = "web"))]
use web_sys::js_sys::JsString;

use crate::{
    math_via_wasm::{
        eval_js, evaluate_to_number, math_to_latex, math_to_text, normalize_math,
        parse_latex_into_math, parse_text_into_math, parse_text_into_number, substitute_into_math,
    },
    props::prop_type,
};

const BLANK_MATH_OBJECT: &str = "\u{ff3f}";

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
            "JSON.parse(\'{{\"objectType\":\"math-expression\",\"tree\":{}}}\', serializedComponentsReviver)",
            self.math_object.0
        )
    }
}

#[derive(Debug, Clone, PartialEq, serde::Deserialize, serde::Serialize)]
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
        // Serialize as a struct named `MathExpr` with `1` field: `math_object`
        let mut m = serializer.serialize_struct("MathExpr", 1)?;
        m.serialize_field("math_object", &self.math_object.0)?;
        m.end()
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

    /// Return a text string that corresponds to the mathematical expression.
    /// The behavior is controlled by `params`.
    ///
    /// Examples:
    ///
    /// ```no_run
    /// # use doenetml_core::state::types::math_expr::{MathExpr, ToTextParams};
    /// let expr = MathExpr::from_text("123 / 0.05", true, &["f"]);
    ///
    /// assert_eq!(
    ///     expr.to_text(ToTextParams::default()),
    ///     r#"123/0.05"#
    /// );
    ///
    /// let pad_three_decimals = ToTextParams {
    ///     pad_to_decimals: Some(3),
    ///     ..Default::default()
    /// };
    /// assert_eq!(
    ///     expr.to_text(pad_three_decimals),
    ///     r#"123.000/0.050"#
    /// );
    ///
    /// let pad_four_digits = ToTextParams {
    ///     pad_to_digits: Some(4),
    ///     ..Default::default()
    /// };
    /// assert_eq!(expr.to_text(pad_four_digits), r#"123.0/0.05000"#);
    ///
    /// let expr_with_blanks = MathExpr::from_text("x + ()", true, &["f"]);
    ///
    /// assert_eq!(
    ///     expr_with_blanks.to_text(ToTextParams::default()),
    ///     "x + \u{FF3F}"
    /// );
    ///
    /// let hide_blanks = ToTextParams {
    ///     show_blanks: false,
    ///     ..Default::default()
    /// };
    /// assert_eq!(expr_with_blanks.to_text(hide_blanks), "x + ");
    /// ```
    pub fn to_text(&self, params: ToTextParams) -> String {
        match math_to_text(&self.math_object, params) {
            Ok(res) => res,
            Err(_) => "\u{FF3f}".to_string(),
        }
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

    /// Create a new math expression that is a vector with components
    /// given by `components`.
    pub fn new_vector(components: &[MathExpr]) -> Self {
        let vector_object = JsMathExpr(format!(
            "[\"vector\",{}]",
            components.iter().map(|comp| &comp.math_object.0).join(",")
        ));

        MathExpr {
            math_object: vector_object,
        }
    }

    /// Calculate an array of math expressions corresponding to the vector components
    /// of `self`.
    ///
    /// Return a Result with
    /// - a `Vec` of the `MathExpr` corresponding to the vector components, if `self` is a vector
    /// - an `Err` if `self` is not a vector
    pub fn to_vector_components(&self) -> Result<Vec<MathExpr>, anyhow::Error> {
        let math_string = &self.math_object.0;

        let val: serde_json::Value = serde_json::from_str(math_string)?;

        let components = match val {
            serde_json::Value::Array(c) => c,
            _ => {
                return Err(anyhow!("Math expression is not a vector"));
            }
        };

        let operator = match &components[0] {
            serde_json::Value::String(op) => op,
            _ => {
                return Err(anyhow!("Math expression is invalid"));
            }
        };

        if operator != "vector" && operator != "tuple" {
            return Err(anyhow!("Math expression is not a vector"));
        }

        let math_strings = components[1..]
            .iter()
            .map(serde_json::to_string)
            .collect::<Result<Vec<_>, _>>()?
            .iter()
            .map(|s| MathExpr {
                math_object: JsMathExpr(s.to_string()),
            })
            .collect::<Vec<_>>();

        Ok(math_strings)
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

    pub fn number_from_text<TXT: AsRef<str>>(text: TXT) -> prop_type::Number {
        let string = text.as_ref();

        string
            .parse::<prop_type::Number>()
            .unwrap_or_else(|_| parse_text_into_number(string).unwrap_or(prop_type::Number::NAN))
    }

    /// Evaluates the `self` as a number, returning `NaN` if value is non-numerical.
    pub fn to_number(&self) -> prop_type::Number {
        match self.math_object.0.parse::<prop_type::Number>() {
            Ok(converted_number) => {
                return converted_number;
            }
            Err(..) => {}
        }

        match evaluate_to_number(&self.math_object) {
            Ok(res) => res,
            Err(..) => prop_type::Number::NAN,
        }
    }

    /// Attempts to evaluate `self` as a number.
    /// Return an `Err` if value is non-numerical.
    pub fn try_to_number(&self) -> Result<prop_type::Number, anyhow::Error> {
        match self.math_object.0.parse::<prop_type::Number>() {
            Ok(converted_number) => {
                return Ok(converted_number);
            }
            Err(..) => {}
        }

        let res = evaluate_to_number(&self.math_object)?;

        if res.is_nan() {
            Err(anyhow!(
                "Math expression could not be evaluated into a number"
            ))
        } else {
            Ok(res)
        }
    }
}

impl From<prop_type::Number> for MathExpr {
    fn from(value: prop_type::Number) -> Self {
        MathExpr {
            math_object: JsMathExpr(format!("{value}",)),
        }
    }
}

impl From<prop_type::Integer> for MathExpr {
    fn from(value: prop_type::Integer) -> Self {
        MathExpr {
            math_object: JsMathExpr(format!("{value}",)),
        }
    }
}

impl From<MathExpr> for prop_type::Number {
    fn from(expr: MathExpr) -> Self {
        expr.to_number()
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
            Self::Math(math_expr) => math_expr.math_object.serialize(serializer),
            Self::Number(num) => serializer.serialize_f64(*num),
            Self::Integer(num) => serializer.serialize_i64(*num),
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
            "JSON.parse(\'{{\"objectType\":\"math-expression\",\"tree\":{}}}\', serializedComponentsReviver)",
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

/// Parameters for creating a text string from a `Math`:
#[derive(Debug, Clone, Copy)]
pub struct ToTextParams {
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

impl Default for ToTextParams {
    fn default() -> Self {
        ToTextParams {
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
