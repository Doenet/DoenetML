use std::collections::HashMap;
use strum_macros::Display;

use crate::DoenetMLCore;

/// A mathematical expression represented as a serialized `math-expressions` object.
#[derive(Debug, Clone)]
pub struct Math {
    pub math_object: String,
}

impl serde::Serialize for Math {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.math_object)
    }
}

impl Math {
    /// Create a `Math` by parsing the string `text` using the `math-expressions` text parser.
    ///
    /// Parameters:
    /// - `text`: the string to be parsed
    /// - `split_symbols`: if true, split multi-character symbols that do not contain an number
    ///   into the product of the characters.
    /// - `function_symbols`: a list of the symbols that will be treated as a function,
    ///   i.e., one of these symbols followed by arguments in parentheses
    ///   will be interpreted as apply that function to the arguments (rather than multiplication)
    pub fn from_text<'a, TXT: AsRef<str>, FnSymbols: AsRef<[&'a str]>>(
        text: TXT,
        split_symbols: bool,
        function_symbols: FnSymbols,
    ) -> Self {
        let s = text.as_ref();

        let math_object =
            match DoenetMLCore::parse_text_into_math(s, split_symbols, function_symbols) {
                Ok(res) => res,
                Err(_) => "\u{ff3f}".to_owned(),
            };

        Math { math_object }
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
    pub fn from_latex<'a, TXT: AsRef<str>, FnSymbols: AsRef<[&'a str]>>(
        latex: TXT,
        split_symbols: bool,
        function_symbols: FnSymbols,
    ) -> Self {
        let s = latex.as_ref();

        let math_object =
            match DoenetMLCore::parse_latex_into_math(s, split_symbols, function_symbols) {
                Ok(res) => res,
                Err(_) => "\u{ff3f}".to_owned(),
            };

        Math { math_object }
    }

    /// Return a LaTeX string that corresponds to the mathematical expression.
    /// The behavior is controlled by `params`.
    pub fn to_latex(&self, params: ToLatexParams) -> String {
        match DoenetMLCore::to_latex(&self.math_object, params) {
            Ok(res) => res,
            Err(_) => "\u{ff3f}".to_owned(),
        }
    }

    /// Create a new mathematical expression formed by substituting variables with new expressions
    ///
    /// Parameters:
    /// - `substitutions`: a `HashMap` mapping variables to new expressions
    pub fn substitute(&self, substitutions: &HashMap<String, MathOrPrimitive>) -> Math {
        let math_object = match DoenetMLCore::substitute_into_math(&self.math_object, substitutions)
        {
            Ok(res) => res,
            Err(_) => "\u{ff3f}".to_owned(),
        };

        Math { math_object }
    }

    /// Normalize a mathematical expression as specified in `params`.
    pub fn normalize(&self, params: NormalizeParams) -> Math {
        let math_object = match DoenetMLCore::normalize_math(&self.math_object, params) {
            Ok(res) => res,
            Err(_) => "\u{ff3f}".to_owned(),
        };

        Math { math_object }
    }

    /// Create a new mathematical expression by adding `term` to the current expression.
    pub fn add(&self, term: MathOrPrimitive) -> Math {
        let term = serde_json::to_string(&term).unwrap();

        let js_source = format!(
            r#"JSON.parse('{}', serializedComponentsReviver).add(JSON.parse('{}', serializedComponentsReviver));"#,
            self.math_object, term
        );

        let math_object = match DoenetMLCore::eval_js(&js_source) {
            Ok(res) => res,
            Err(_) => "\u{ff3f}".to_owned(),
        };

        Math { math_object }
    }

    /// Create a new mathematical expression by subtracting `term` to the current expression.
    pub fn subtract(&self, term: MathOrPrimitive) -> Math {
        let term = serde_json::to_string(&term).unwrap();

        let js_source = format!(
            r#"JSON.parse('{}', serializedComponentsReviver).subtract(JSON.parse('{}', serializedComponentsReviver));"#,
            self.math_object, term
        );

        let math_object = match DoenetMLCore::eval_js(&js_source) {
            Ok(res) => res,
            Err(_) => "\u{ff3f}".to_owned(),
        };

        Math { math_object }
    }

    /// Create a new mathematical expression by multiplying the current expression by `term`.
    pub fn multiply(&self, factor: MathOrPrimitive) -> Math {
        let factor = serde_json::to_string(&factor).unwrap();

        let js_source = format!(
            r#"JSON.parse('{}', serializedComponentsReviver).multiply(JSON.parse('{}', serializedComponentsReviver));"#,
            self.math_object, factor
        );

        let math_object = match DoenetMLCore::eval_js(&js_source) {
            Ok(res) => res,
            Err(_) => "\u{ff3f}".to_owned(),
        };

        Math { math_object }
    }

    /// Create a new mathematical expression by dividing the current expression by `term`.
    pub fn divide(&self, factor: MathOrPrimitive) -> Math {
        let factor = serde_json::to_string(&factor).unwrap();

        let js_source = format!(
            r#"JSON.parse('{}', serializedComponentsReviver).divide(JSON.parse('{}', serializedComponentsReviver));"#,
            self.math_object, factor
        );

        let math_object = match DoenetMLCore::eval_js(&js_source) {
            Ok(res) => res,
            Err(_) => "\u{ff3f}".to_owned(),
        };

        Math { math_object }
    }
}

/// An enum of different types of values that can be interpreted as mathematical expressions.
#[derive(Debug, serde::Serialize)]
#[serde(untagged)]
pub enum MathOrPrimitive {
    Math(Math),
    Number(f64),
    Integer(i64),
    String(String),
}

/// Parameters for creating a latex string from a `Math`:
#[derive(Debug)]
pub struct ToLatexParams {
    /// If present, then pad numbers with zeros so they have at least
    /// this many decimal places after the decimal point displayed.
    pub pad_to_decimals: Option<i32>,
    /// If present, then pad numbers with zeros so they have at least
    /// this many total digits displayed.
    pub pad_to_digits: Option<i32>,
    /// If true, then display any blanks in the mathematical expression
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
#[derive(Debug, Display, Default)]
#[strum(serialize_all = "camelCase")]
pub enum MathSimplify {
    /// No simplification is performed.
    #[default]
    None,
    /// Simplify numbers, such as simplify `1+1` to 2,
    /// except do not change the order between numerical and non-numerical operands.
    /// Do not alter non-numerical expressions.
    NumbersPreserveOrder,
    /// Simplify numbers, such as simplify `1+1` to 2,
    /// Do not alter non-numerical expressions.
    Numbers,
    /// Simplify the mathematical expression using the currently
    /// implemented features. These features are limited and subject to change.
    /// For example, simplification of ratio expressions is essentially non-existent.
    Full,
}

/// Parameters for normalizing a mathematical expression
#[derive(Debug, Default)]
pub struct NormalizeParams {
    /// We currently support four options for `simplify`:
    /// - `MathSimplify::None`: no simplification
    /// - `MathSimplify::NumbersPreserveOrder`: simplify numbers, such as simplify `1+1` to 2,
    ///   except do not change the order between numerical and non-numerical operands.
    ///   Do not alter non-numerical expressions.
    /// - `MathSimplify::Numbers`: simplify numbers, such as simplify `1+1` to 2,
    ///   Do not alter non-numerical expressions.
    /// - `MathSimplify::Full`: simplify the mathematical expression using the currently
    ///   implemented features. These features are limited and subject to change.
    ///   For example, simplification of ratio expressions is essentially non-existent.
    pub simplify: MathSimplify,
    /// If true, expand out multiplication over addition/subtraction.
    pub expand: bool,
    /// If true, create vectors out of tuples (that haven't previously been turned into intervals).
    pub create_vectors: bool,
    /// If true, create closed intervals out of arrays and open intervals out of tuples
    /// (that haven't previously been turned into vectors).
    /// If both `create_vectors` and `create_intervals` are `true`,
    /// `create_vectors` is applied first so that only arrays will be affected by `create_intervals`.
    pub create_intervals: bool,
}
