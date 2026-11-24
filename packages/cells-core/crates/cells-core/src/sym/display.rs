//! How a math value shows: rounded for display, then written as LaTeX, as
//! the current core's `mathDisplayString` writes a math's `latex`
//! (`roundForDisplay`, then `toLatex` with `buildNumberDisplayParameters`).
//! The rounding is the display's only: the value keeps every digit.

use math_expressions as me;
use me::expr::SeqKind;
use me::{Expr, LatexOpts, MathConst, Number, TextOpts};

/// The number-display settings of a math, a point, ...: `displayDigits`,
/// `displayDecimals`, `displaySmallAsZero`, `padZeros`,
/// `avoidScientificNotation` and `displayBlanks`, with the current core's
/// defaults.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Display {
    /// Significant digits; below 1 rounds by decimals only.
    pub digits: f64,
    /// Decimal places kept at least; not finite rounds by digits only.
    pub decimals: f64,
    /// A number smaller than this shows as 0 (when rounding by digits).
    pub small_as_zero: f64,
    /// Pad with zeros to the digits and decimals asked for.
    pub pad_zeros: bool,
    /// Write every number positionally, however large or small.
    pub avoid_scientific_notation: bool,
    /// Show a blank as `＿`, else as nothing.
    pub show_blanks: bool,
}

impl Default for Display {
    fn default() -> Self {
        Display {
            digits: 3.0,
            decimals: 2.0,
            small_as_zero: 1e-14,
            pad_zeros: false,
            avoid_scientific_notation: false,
            show_blanks: true,
        }
    }
}

impl Display {
    /// `e` rounded for display: to `digits` significant digits but never
    /// below `decimals` places, then small numbers set to 0.
    pub fn round(&self, e: &Expr) -> Expr {
        let rounded = me::round_numbers_to_precision_plus_decimals(e, self.digits, self.decimals);
        if self.digits > 0.0 && self.small_as_zero > 0.0 {
            me::set_small_zero(&rounded, self.small_as_zero)
        } else {
            rounded
        }
    }

    /// The LaTeX options the settings ask for.
    fn latex_opts(&self) -> LatexOpts {
        let pad = |v: f64, ok: bool| (self.pad_zeros && ok).then_some(v.max(0.0) as u32);
        LatexOpts {
            pad_to_decimals: pad(self.decimals, self.decimals.is_finite()),
            pad_to_digits: pad(self.digits, self.digits >= 1.0),
            avoid_scientific_notation: self.avoid_scientific_notation,
            show_blanks: self.show_blanks,
            ..LatexOpts::default()
        }
    }

    /// `e` as LaTeX, rounded for display.
    pub fn latex(&self, e: &Expr) -> String {
        me::to_latex(&self.round(e), &self.latex_opts())
    }

    /// The number `v` as LaTeX, rounded for display: what a math holding
    /// a number shows.
    pub fn number_latex(&self, v: f64) -> String {
        self.latex(&number(v))
    }

    /// The text options the settings ask for, as [`Display::latex_opts`].
    fn text_opts(&self) -> TextOpts {
        let latex = self.latex_opts();
        TextOpts {
            pad_to_decimals: latex.pad_to_decimals,
            pad_to_digits: latex.pad_to_digits,
            avoid_scientific_notation: self.avoid_scientific_notation,
            show_blanks: self.show_blanks,
            ..TextOpts::default()
        }
    }

    /// `e` as text, rounded for display: the current core's `text` of a
    /// math (ADR 0071).
    pub fn text(&self, e: &Expr) -> String {
        me::to_text(&self.round(e), &self.text_opts())
    }

    /// The number `v` as text, rounded for display: the current core's
    /// `text` of a number.
    pub fn number_text(&self, v: f64) -> String {
        self.text(&number(v))
    }

    /// The number `v` rounded for display, as a number: the current core's
    /// `valueForDisplay` of a number. A NaN or an infinity is itself.
    pub fn round_number(&self, v: f64) -> f64 {
        if !v.is_finite() {
            return v;
        }
        match self.round(&number(v)) {
            Expr::Num(n) => n.to_f64(),
            e => me::evaluate_to_constant(&e).map_or(v, |z| z.re),
        }
    }

    /// A point's coordinates `values` as LaTeX, rounded for display: a
    /// vector of two or more, as the current core's `coords`, else the
    /// one number.
    pub fn coords_latex(&self, values: &[f64]) -> String {
        match values {
            [v] => self.number_latex(*v),
            _ => {
                let entries = values.iter().map(|&v| number(v)).collect();
                self.latex(&Expr::Seq(SeqKind::Vector, entries))
            }
        }
    }
}

/// `v` as an expression: a number, or the constant an infinity or a NaN
/// is.
fn number(v: f64) -> Expr {
    if v.is_nan() {
        Expr::Const(MathConst::NaN)
    } else if v == f64::INFINITY {
        Expr::Const(MathConst::Inf)
    } else if v == f64::NEG_INFINITY {
        Expr::Const(MathConst::NegInf)
    } else {
        Expr::Num(Number::from_f64(v))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn parse(s: &str) -> Expr {
        me::TextToAst::new(me::TextToAstOptions::default())
            .convert(s)
            .unwrap()
    }

    fn clean(s: String) -> String {
        s.replace(' ', "")
    }

    #[test]
    fn rounds_by_digits_and_decimals_as_the_current_core() {
        // math.test.ts, "display digits and decimals".
        let d = Display::default();
        assert_eq!(clean(d.number_latex(621802.3520303639)), "621802.35");
        let e = parse("31.3835205397397634 x + 4pi");
        assert_eq!(clean(d.latex(&e)), "31.38x+4\\pi");
        let five = Display {
            digits: 5.0,
            decimals: f64::NEG_INFINITY,
            ..d
        };
        assert_eq!(clean(five.number_latex(621802.3520303639)), "621800");
        assert_eq!(clean(five.latex(&e)), "31.384x+4\\pi");
        let dec5 = Display {
            digits: 0.0,
            decimals: 5.0,
            ..d
        };
        assert_eq!(clean(dec5.number_latex(621802.3520303639)), "621802.35203");
    }

    #[test]
    fn pads_zeros_when_asked() {
        let d = Display {
            pad_zeros: true,
            ..Display::default()
        };
        assert_eq!(clean(d.number_latex(2.0)), "2.00");
    }

    #[test]
    fn a_tuple_of_numbers_rounds_each() {
        let d = Display::default();
        assert_eq!(
            clean(d.coords_latex(&[1.23456, -2.0])),
            "\\left(1.23,-2\\right)"
        );
    }

    #[test]
    fn small_numbers_show_as_zero() {
        assert_eq!(clean(Display::default().number_latex(1e-15)), "0");
    }
}
