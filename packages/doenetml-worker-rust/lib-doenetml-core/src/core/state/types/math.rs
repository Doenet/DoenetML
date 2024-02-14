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
    ///
    /// Parameters:
    /// - `pad_to_decimals`: if present, then pad numbers with zeros so they have at least
    /// this many decimal places after the decimal point displayed
    /// - `pad_to_digits`: if present, then pad numbers zeros so they have at least
    /// this many total digits displayed
    /// - `show_blanks`: if true, then display any blanks in the mathematical expression
    /// as a long underscore
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

#[derive(Debug, Default)]
pub struct ToLatexParams {
    pub pad_to_decimals: Option<i32>,
    pub pad_to_digits: Option<i32>,
    pub show_blanks: Option<bool>,
}

#[derive(Debug, Display, Default)]
#[strum(serialize_all = "camelCase")]
pub enum MathSimplify {
    #[default]
    None,
    NumbersPreserveOrder,
    Numbers,
    Full,
}

#[derive(Debug, Default)]
pub struct NormalizeParams {
    pub simplify: MathSimplify,
    pub expand: bool,
    pub create_vectors: bool,
    pub create_intervals: bool,
}
