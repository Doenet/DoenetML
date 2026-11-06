//! What an operator can produce, as an interval: the range rule each
//! operator declares beside its evaluation and its inverse (ADR 0037), which
//! the check's constant evaluator (`compile/graph/eval.rs`) applies to a
//! value that depends on its scope.
//!
//! The contract of a rule: the range holds every value the operator can
//! produce from inputs in the input ranges. It may be wider, never
//! narrower; an operator that can give NaN from such inputs gives ⊤. Ranges
//! are plain `f64`, with no outward rounding.

/// A set of numbers: `[lo, hi]`, or ⊤ (anything, NaN included).
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Range {
    /// ⊤: any value, NaN included.
    Top,
    /// `[lo, hi]`, neither NaN, `lo <= hi`; either may be infinite.
    Span(f64, f64),
}

impl Range {
    /// The one value `v`; ⊤ for NaN, which a range does not hold.
    pub fn point(v: f64) -> Range {
        Range::span(v, v)
    }

    /// `[lo, hi]`, or ⊤ when either is NaN or they are out of order.
    pub fn span(lo: f64, hi: f64) -> Range {
        if lo.is_nan() || hi.is_nan() || lo > hi {
            Range::Top
        } else {
            Range::Span(lo, hi)
        }
    }

    /// 0 or 1: a condition.
    pub const UNIT: Range = Range::Span(0.0, 1.0);

    /// Its one value, when it holds one.
    pub fn as_point(self) -> Option<f64> {
        match self {
            Range::Span(lo, hi) if lo == hi => Some(lo),
            _ => None,
        }
    }

    /// Whether it may hold `v`.
    pub fn holds(self, v: f64) -> bool {
        match self {
            Range::Top => true,
            Range::Span(lo, hi) => lo <= v && v <= hi,
        }
    }

    /// The least range holding both.
    pub fn hull(self, other: Range) -> Range {
        match (self, other) {
            (Range::Span(a, b), Range::Span(c, d)) => Range::Span(a.min(c), b.max(d)),
            _ => Range::Top,
        }
    }

    /// `f` applied to every corner of the two ranges: the range of `f` when
    /// it is monotone in each input over them; ⊤ when either is, or a corner
    /// is NaN.
    pub fn corners(self, other: Range, f: impl Fn(f64, f64) -> f64) -> Range {
        let (Range::Span(a, b), Range::Span(c, d)) = (self, other) else {
            return Range::Top;
        };
        let vs = [f(a, c), f(a, d), f(b, c), f(b, d)];
        if vs.iter().any(|v| v.is_nan()) {
            return Range::Top;
        }
        let lo = vs.iter().copied().fold(f64::INFINITY, f64::min);
        let hi = vs.iter().copied().fold(f64::NEG_INFINITY, f64::max);
        Range::Span(lo, hi)
    }

    /// `f`, nondecreasing, applied to the endpoints.
    pub fn monotone(self, f: impl Fn(f64) -> f64) -> Range {
        match self {
            Range::Span(lo, hi) => Range::span(f(lo), f(hi)),
            Range::Top => Range::Top,
        }
    }

    /// `-a`.
    pub fn negated(self) -> Range {
        match self {
            Range::Span(lo, hi) => Range::Span(-hi, -lo),
            Range::Top => Range::Top,
        }
    }

    /// Whether it may hold 0.
    pub fn may_be_zero(self) -> bool {
        self.holds(0.0)
    }

    /// `a * b`: ⊤ when one may be infinite and the other 0 (NaN).
    pub fn times(self, b: Range) -> Range {
        let unbounded =
            |r: Range| matches!(r, Range::Span(lo, hi) if lo.is_infinite() || hi.is_infinite());
        if (unbounded(self) && b.may_be_zero()) || (unbounded(b) && self.may_be_zero()) {
            return Range::Top;
        }
        self.corners(b, |x, y| x * y)
    }

    /// `a / b`: ⊤ when `b` may be 0.
    pub fn over(self, b: Range) -> Range {
        if b.may_be_zero() {
            return Range::Top;
        }
        self.corners(b, |x, y| x / y)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn corners_bound_a_product() {
        let r = Range::Span(-2.0, 3.0).corners(Range::Span(-1.0, 4.0), |a, b| a * b);
        assert_eq!(r, Range::Span(-8.0, 12.0));
        assert_eq!(
            Range::Span(1.0, 2.0).over(Range::Span(-1.0, 1.0)),
            Range::Top
        );
        assert_eq!(Range::point(f64::NAN), Range::Top);
        let inf = Range::Span(1.0, f64::INFINITY);
        assert_eq!(
            inf.corners(Range::point(-1.0), |a, b| a * b),
            Range::Span(f64::NEG_INFINITY, -1.0)
        );
        assert_eq!(inf.corners(Range::point(0.0), |a, b| a * b), Range::Top);
        assert_eq!(inf.times(Range::Span(-1.0, 1.0)), Range::Top);
    }
}
