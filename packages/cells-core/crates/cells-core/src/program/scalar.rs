//! Operators: the numeric functions that compute derived cells. Every scalar
//! operator is one `scalar_ops!` entry: to add one, add an entry.
//!
//! Inverse rules for the scalar operators: a binary operator writes its first
//! argument; an idempotent operator (Round, Floor, Clamp, Min, Max) inverts by
//! projection, applying itself to the requested value; an inverse that is
//! undefined for the current values, or whose requested value is outside the
//! operator's domain (a non-finite ask on Round), returns `None` and the
//! request is dropped.

use super::ops::scalar_ops;
use crate::index::CellIdx;
use crate::program::{OperandIdx, Range, SymIdx, SymKind, VecIdx, VecOp};

/// `Math.round`: halves round toward positive infinity, unlike Rust's
/// `round`, which rounds them away from zero.
#[inline(always)]
pub fn js_round(x: f64) -> f64 {
    (x + 0.5).floor()
}

/// Relative tolerance of `Eq`, so `0.1 + 0.2 = 0.3` holds in a condition.
pub const EQ_TOL: f64 = 1e-12;

/// The missing value (ADR 0046): what a reference that names nothing
/// holds, and what a value computed from one is. A NaN with a payload of
/// its own, so it is not a number, never equals anything, and is told
/// apart from the NaN of a computation that has no value by its bits
/// ([`is_missing`]). Moving a cell keeps the bits; arithmetic need not, so
/// every operator says what a missing input gives.
pub const MISSING: f64 = f64::from_bits(0x7ff8_0000_0000_0d37);

/// Whether `x` is the missing value, by its bits.
#[inline(always)]
pub fn is_missing(x: f64) -> bool {
    x.to_bits() == MISSING.to_bits()
}

#[inline(always)]
fn holds(x: f64) -> bool {
    x != 0.0 && !x.is_nan()
}

#[inline(always)]
fn bit(b: bool) -> f64 {
    if b { 1.0 } else { 0.0 }
}

#[inline(always)]
pub(crate) fn nan_min(a: f64, b: f64) -> f64 {
    if a.is_nan() || b.is_nan() {
        f64::NAN
    } else {
        a.min(b)
    }
}

#[inline(always)]
pub(crate) fn nan_max(a: f64, b: f64) -> f64 {
    if a.is_nan() || b.is_nan() {
        f64::NAN
    } else {
        a.max(b)
    }
}

#[inline(always)]
fn choice_index(a: f64, n: f64) -> f64 {
    if a.fract() == 0.0 && a >= 1.0 && a <= n {
        a
    } else {
        0.0
    }
}

/// What `choice_index` gives over `a` and `n`: 0, or an `a` from 1 to `n`.
fn choice_index_range(a: Range, n: Range) -> Range {
    match (a, n) {
        (Range::Span(_, ahi), Range::Span(_, nhi)) => Range::span(0.0, ahi.min(nhi).max(0.0)),
        _ => Range::Top,
    }
}

/// `a` rounded by `f` (`floor` or `ceil`), except that a value within a
/// relative 1e-15 of an integer is that integer, as the current core's
/// `<floor>` and `<ceil>` take it, so roundoff does not drop a whole unit.
#[inline]
fn snap_to_integer(a: f64, f: fn(f64) -> f64) -> f64 {
    let rounded = js_round(a);
    if ((rounded - a) / a).abs() < 1e-15 {
        rounded
    } else {
        f(a)
    }
}

/// `a` with every magnitude below `|t|` taken as 0, as `set_small_zero`.
#[inline]
fn small_to_zero(a: f64, t: f64) -> f64 {
    if a.abs() < t.abs() { 0.0 } else { a }
}

/// `a` rounded to `d` decimal places (a negative `d` to tens, hundreds,
/// ...), halves away from zero, through the number's shortest decimal
/// spelling, as the math engine's `round_numbers_to_decimals`: `0.5555` to
/// three places is `0.556`. `d` is truncated to an integer.
pub(super) fn round_to_decimals(a: f64, d: f64) -> f64 {
    if !a.is_finite() {
        return a;
    }
    math_expressions::Number::from_f64(a)
        .round_to_decimals(d as i32)
        .to_f64()
}

/// `a` rounded to `digits` significant digits, as the math engine's
/// `round_numbers_to_precision`: unchanged when `digits` is below 1 or `a`
/// is 0. `digits` is truncated to an integer.
pub(super) fn round_to_digits(a: f64, digits: f64) -> f64 {
    let digits = digits as i32;
    if !a.is_finite() || a == 0.0 || digits < 1 {
        return a;
    }
    let k = a.abs().log10().floor() as i64;
    let d = (i64::from(digits) - 1 - k).clamp(i64::from(i32::MIN), i64::from(i32::MAX));
    round_to_decimals(a, d as f64)
}

/// `a mod b`, as the math library's `mod`: `a - b * floor(a / b)`, the
/// quotient taken as the integer it is within a relative 1e-12 of, and `a`
/// when `b` is 0.
pub(super) fn modulo(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        return a;
    }
    let q = a / b;
    let r = q.round();
    let q = if q == r || (q - r).abs() <= 1e-12 * q.abs().max(r.abs()) {
        r
    } else {
        q.floor()
    };
    a - b * q
}

/// The sign of `a`: -1, 0 or 1, and NaN for NaN (unlike `f64::signum`,
/// which is 1 at 0).
#[inline]
fn sign(a: f64) -> f64 {
    if a > 0.0 {
        1.0
    } else if a < 0.0 {
        -1.0
    } else {
        a
    }
}

/// The range of `|a|` over `a`.
fn abs_range(a: Range) -> Range {
    match a {
        Range::Span(lo, hi) => {
            let least = if lo >= 0.0 {
                lo
            } else if hi <= 0.0 {
                -hi
            } else {
                0.0
            };
            Range::span(least, lo.abs().max(hi.abs()))
        }
        Range::Top => Range::Top,
    }
}

/// The input an inverse writes: every scalar operator writes its first.
const A: usize = 0;

scalar_ops! {
    // A request through an operator whose other input is not a finite
    // number (an emptied input) is dropped: no value of `a` gives it, and
    // writing what the arithmetic says would make `a` NaN.
    /// `a + b`.
    Add(a, b) {
        eval: a + b,
        exact |d| b.is_finite().then_some((A, d - b)),
        range: a.corners(b, |x, y| x + y),
    }
    /// `a - b`.
    Sub(a, b) {
        eval: a - b,
        exact |d| b.is_finite().then_some((A, d + b)),
        range: a.corners(b, |x, y| x - y),
    }
    /// `a * b`.
    Mul(a, b) {
        eval: a * b,
        exact |d| (b != 0.0 && b.is_finite()).then_some((A, d / b)),
        range: a.times(b),
    }
    /// `a / b`.
    Div(a, b) {
        eval: a / b,
        exact |d| (b != 0.0 && b.is_finite()).then_some((A, d * b)),
        range: a.over(b),
    }
    /// `b - a`: `Sub` with its inputs reversed, so that a request writes
    /// what is subtracted.
    RSub(a, b) {
        eval: b - a,
        exact |d| b.is_finite().then_some((A, b - d)),
        range: b.corners(a, |x, y| x - y),
    }
    /// `b / a`: `Div` with its inputs reversed, so that a request writes the
    /// divisor.
    RDiv(a, b) {
        eval: b / a,
        exact |d| (d != 0.0 && d.is_finite() && b != 0.0 && b.is_finite())
            .then_some((A, b / d)),
        range: b.over(a),
    }
    /// NaN if either argument is NaN (unlike `f64::min`).
    Min(a, b) {
        eval: nan_min(a, b),
        projection |d| Some((A, nan_min(d, b))),
        range: a.corners(b, f64::min),
    }
    /// NaN if either argument is NaN (unlike `f64::max`).
    Max(a, b) {
        eval: nan_max(a, b),
        projection |d| Some((A, nan_max(d, b))),
        range: a.corners(b, f64::max),
    }
    /// `-a`.
    Negate(a) {
        eval: -a,
        exact |d| Some((A, -d)),
        range: a.negated(),
    }
    /// Round half toward positive infinity, as `Math.round` (`js_round`).
    Round(a) {
        eval: js_round(a),
        projection |d| d.is_finite().then(|| (A, js_round(d))),
        range: a.monotone(js_round),
    }
    /// `a` rounded down.
    Floor(a) {
        eval: a.floor(),
        projection |d| d.is_finite().then(|| (A, d.floor())),
        range: a.monotone(f64::floor),
    }
    /// `a` when it is a whole number from 1 to `n`, else 0: a choice
    /// index, 0 meaning none is chosen. A request outside that set
    /// (NaN, a fraction, out of range) chooses none.
    ChoiceIndex(a, n) {
        missing: reads,
        eval: choice_index(a, n),
        projection |d| Some((A, choice_index(d, n))),
        range: choice_index_range(a, n),
    }
    /// `a` unless it is NaN, then `b`: `valueOnNaN`. A NaN ask has no
    /// inverse: it would be asking for the fallback.
    NanTo(a, b) {
        missing: reads,
        eval: if a.is_nan() { b } else { a },
        exact |d| (!d.is_nan()).then_some((A, d)),
        range: a.hull(b),
    }
    /// `a` to the power `b`.
    Pow(a, b) {
        eval: a.powf(b),
        drops,
    }
    /// The square root of `a`, NaN below 0: a regular polygon's
    /// circumradius from its area. A request writes its square; a
    /// negative one is dropped.
    Sqrt(a) {
        eval: a.sqrt(),
        exact |d| (d >= 0.0).then_some((A, d * d)),
    }
    /// `a`: a held element's own cell for a value it reads from another
    /// element's, so the hold is on its cell and not on the other's.
    Copy(a) {
        missing: reads,
        eval: a,
        exact |d| Some((A, d)),
        range: a,
    }
    /// `a`, shown where a request cannot reach back to it: an operand as a
    /// `<sort>`'s entry shows it, whose place a write would move, so a
    /// request on the entry is dropped (ADR 0053).
    Shown(a) {
        missing: reads,
        eval: a,
        drops,
    }
    /// `a < b`, for conditions: 1 or 0, and 0 when either side is NaN. A
    /// request cannot change a condition.
    Lt(a, b) {
        missing: reads,
        eval: bit(a < b),
        drops,
        range: Range::UNIT,
    }
    /// `a <= b`, as [`Op::Lt`].
    Le(a, b) {
        missing: reads,
        eval: bit(a <= b),
        drops,
        range: Range::UNIT,
    }
    /// Equal within a relative error of `EQ_TOL`.
    Eq(a, b) {
        missing: reads,
        eval: bit(a == b || (a - b).abs() <= EQ_TOL * a.abs().max(b.abs())),
        drops,
        range: Range::UNIT,
    }
    /// 1 when `a` holds (nonzero, not NaN), else 0.
    Truthy(a) {
        eval: bit(holds(a)),
        drops,
        range: Range::UNIT,
    }
    /// 1 when `a` does not hold.
    Not(a) {
        eval: bit(!holds(a)),
        drops,
        range: Range::UNIT,
    }
    /// `|a|`. An ask below zero, which no input gives, writes 0, the
    /// nearest value it gives, as the current core's `<abs>` does.
    Abs(a) {
        eval: a.abs(),
        exact |d| (!d.is_nan()).then_some((A, d.max(0.0))),
        range: abs_range(a),
    }
    /// -1, 0 or 1 by the sign of `a`. A request cannot change it, as in
    /// the current core.
    Sign(a) {
        eval: sign(a),
        drops,
        range: Range::span(-1.0, 1.0),
    }
    /// `a` rounded down, a value within roundoff of an integer being that
    /// integer (`snap_to_integer`), as the current core's `<floor>`.
    SnapFloor(a) {
        eval: snap_to_integer(a, f64::floor),
        projection |d| d.is_finite().then(|| (A, snap_to_integer(d, f64::floor))),
        range: a.monotone(|x| snap_to_integer(x, f64::floor)),
    }
    /// `a` rounded up, as [`Op::SnapFloor`] rounds down.
    SnapCeil(a) {
        eval: snap_to_integer(a, f64::ceil),
        projection |d| d.is_finite().then(|| (A, snap_to_integer(d, f64::ceil))),
        range: a.monotone(|x| snap_to_integer(x, f64::ceil)),
    }
    /// `a` rounded to `b` decimal places (`round_to_decimals`).
    RoundDecimals(a, b) {
        eval: round_to_decimals(a, b),
        projection |d| d.is_finite().then(|| (A, round_to_decimals(d, b))),
    }
    /// `a` rounded to `b` significant digits (`round_to_digits`).
    RoundDigits(a, b) {
        eval: round_to_digits(a, b),
        projection |d| d.is_finite().then(|| (A, round_to_digits(d, b))),
    }
    /// `a`, or 0 when its magnitude is below `|b|` (`small_to_zero`).
    SmallToZero(a, b) {
        eval: small_to_zero(a, b),
        projection |d| (!d.is_nan()).then(|| (A, small_to_zero(d, b))),
    }
    /// `a mod b` (`modulo`). A request cannot change it.
    Mod(a, b) {
        eval: modulo(a, b),
        drops,
    }
    /// 1 when `a` is a finite integer, within a relative 1e-15 (the current
    /// core's `<isInteger>`), else 0.
    IsInteger(a) {
        missing: reads,
        eval: bit(a.is_finite() && (js_round(a) - a).abs() <= 1e-15 * a.abs()),
        drops,
        range: Range::UNIT,
    }
    /// 1 when `a` is a finite number, else 0.
    IsFinite(a) {
        missing: reads,
        eval: bit(a.is_finite()),
        drops,
        range: Range::UNIT,
    }
    // The functions numeric math text calls (ADR 0083), as `f64`
    // computes them. A request through one is dropped, as through `Pow`.
    /// The cube root of `a`, negative below 0.
    Cbrt(a) {
        eval: a.cbrt(),
        drops,
        range: a.monotone(f64::cbrt),
    }
    /// `a` rounded up.
    Ceil(a) {
        eval: a.ceil(),
        drops,
        range: a.monotone(f64::ceil),
    }
    /// `e` to the power `a`.
    Exp(a) {
        eval: a.exp(),
        drops,
    }
    /// The natural logarithm of `a` (`log`, `ln`), NaN below 0.
    Ln(a) {
        eval: a.ln(),
        drops,
    }
    /// The base-10 logarithm of `a`, NaN below 0.
    Log10(a) {
        eval: a.log10(),
        drops,
    }
    /// The sine of `a`, in radians.
    Sin(a) {
        eval: a.sin(),
        drops,
    }
    /// The cosine of `a`, in radians.
    Cos(a) {
        eval: a.cos(),
        drops,
    }
    /// The tangent of `a`, in radians.
    Tan(a) {
        eval: a.tan(),
        drops,
    }
    /// The arcsine of `a`, NaN outside `[-1, 1]`.
    Asin(a) {
        eval: a.asin(),
        drops,
    }
    /// The arccosine of `a`, NaN outside `[-1, 1]`.
    Acos(a) {
        eval: a.acos(),
        drops,
    }
    /// The arctangent of `a`.
    Atan(a) {
        eval: a.atan(),
        drops,
    }
    /// The hyperbolic sine of `a`.
    Sinh(a) {
        eval: a.sinh(),
        drops,
    }
    /// The hyperbolic cosine of `a`.
    Cosh(a) {
        eval: a.cosh(),
        drops,
    }
    /// The hyperbolic tangent of `a`.
    Tanh(a) {
        eval: a.tanh(),
        drops,
    }
    /// The inverse hyperbolic sine of `a`.
    Asinh(a) {
        eval: a.asinh(),
        drops,
    }
    /// The inverse hyperbolic cosine of `a`, NaN below 1.
    Acosh(a) {
        eval: a.acosh(),
        drops,
    }
    /// The inverse hyperbolic tangent of `a`, NaN outside `[-1, 1]`.
    Atanh(a) {
        eval: a.atanh(),
        drops,
    }
}

impl Op {
    /// Number of output cells (1 for every scalar operator).
    #[inline(always)]
    pub fn n_out(&self) -> usize {
        match *self {
            Op::Vec(_, n_out, ..) | Op::Sym(_, n_out, ..) => n_out as usize,
            _ => 1,
        }
    }

    /// Evaluate a vector operator into `out` (`n_out` values); `vecs` is
    /// the program's ([`Program::vecs`](crate::program::Program::vecs)).
    #[inline]
    pub fn eval_vec(&self, cells: &[f64], operands: &[CellIdx], vecs: &[VecOp], out: &mut [f64]) {
        let Op::Vec(n_in, _, v, start) = *self else {
            unreachable!()
        };
        let v = vecs[v.index()];
        let mut inp = [0.0f64; crate::program::MAX_VEC_IN];
        let n_in = n_in as usize;
        for (k, &c) in operands[start.index()..start.index() + n_in]
            .iter()
            .enumerate()
        {
            inp[k] = cells[c.index()];
        }
        v.eval(&inp[..n_in], out);
    }

    /// Range into [`Program::operands`](crate::program::Program::operands) of inputs kept there (vector and
    /// symbolic operators).
    #[inline(always)]
    pub fn operand_range(&self) -> std::ops::Range<usize> {
        match *self {
            Op::Vec(n, _, _, start) | Op::Sym(n, _, _, start) => {
                start.index()..start.index() + n as usize
            }
            _ => 0..0,
        }
    }

    /// All input cells, direct and in `operands`.
    pub fn inputs<'a>(&self, operands: &'a [CellIdx]) -> impl Iterator<Item = CellIdx> + 'a {
        let (scalar, n) = match self {
            Op::Vec(..) | Op::Sym(..) => ([CellIdx::new(0); 2], 0),
            _ => self.scalar_inputs(),
        };
        scalar
            .into_iter()
            .take(n)
            .chain(operands[self.operand_range()].iter().copied())
    }
}

/// Every scalar operator's inverse, checked against what its entry
/// declares, over a fixed table of values for each input.
#[cfg(test)]
mod inverses {
    use super::*;
    use crate::program::{Inverse, OpSpec};

    /// Zero, ones, a negative, tiny and large magnitudes, and the
    /// non-finite values.
    const VALUES: [f64; 10] = [
        0.0,
        1.0,
        -1.0,
        -2.5,
        1e-9,
        1e9,
        -1e9,
        f64::NAN,
        f64::INFINITY,
        f64::NEG_INFINITY,
    ];

    /// Every assignment of `VALUES` to `n` inputs.
    fn assignments(n: usize) -> Vec<Vec<f64>> {
        (0..n).fold(vec![vec![]], |acc, _| {
            acc.iter()
                .flat_map(|a| VALUES.iter().map(move |&v| [a.clone(), vec![v]].concat()))
                .collect()
        })
    }

    /// Equal up to rounding at the magnitude of the values involved.
    fn close(got: f64, want: f64, around: &[f64]) -> bool {
        let scale = around
            .iter()
            .copied()
            .filter(|v| v.is_finite())
            .fold(1.0f64, |m, v| m.max(v.abs()));
        (got.is_nan() && want.is_nan()) || got == want || (got - want).abs() <= 1e-9 * scale
    }

    /// Every input an inverse writes is one its entry declares
    /// ([`OpSpec::writes`]).
    #[test]
    fn every_inverse_writes_a_declared_input() {
        for spec in OpSpec::scalars() {
            let n = spec.scalar_arity().unwrap();
            let op = spec.bind_scalar(&CellIdx::below(n).collect::<Vec<_>>());
            for cur in &assignments(n) {
                for &d in &VALUES {
                    if let Some((c, _)) = op.invert(cur, d) {
                        assert!(
                            spec.writes() & (1 << c.index()) != 0,
                            "{spec:?} at {cur:?}, asked {d}, wrote input {c}, which it does not declare"
                        );
                    }
                }
            }
        }
    }

    #[test]
    fn every_inverse_does_what_its_entry_declares() {
        let mut failures = Vec::new();
        for spec in OpSpec::scalars() {
            let n = spec.scalar_arity().unwrap();
            let op = spec.bind_scalar(&CellIdx::below(n).collect::<Vec<_>>());
            let all = assignments(n);
            let mut fail = |what: String| failures.push(format!("{spec:?}: {what}"));
            match spec.inverse().unwrap() {
                // Where it writes, evaluating again gives what was asked,
                // for every value the operator can give.
                Inverse::Exact => {
                    for cur in &all {
                        for target in &all {
                            let d = op.eval(target);
                            if !d.is_finite() {
                                continue;
                            }
                            if let Some((c, x)) = op.invert(cur, d) {
                                let mut after = cur.clone();
                                after[c.index()] = x;
                                let got = op.eval(&after);
                                if !close(got, d, &[cur.as_slice(), target, &[x, d]].concat()) {
                                    fail(format!(
                                        "at {cur:?}, asked {d}, wrote {x} to input {c}, gives {got}"
                                    ));
                                }
                            }
                        }
                    }
                }
                // Evaluating again gives the operator applied with the
                // request in the written input, and what was written is
                // that value: the stored state is what the operator shows.
                Inverse::Projection => {
                    for cur in &all {
                        for &d in VALUES.iter().filter(|v| v.is_finite()) {
                            if let Some((c, x)) = op.invert(cur, d) {
                                let (mut after, mut asked) = (cur.clone(), cur.clone());
                                after[c.index()] = x;
                                asked[c.index()] = d;
                                let (got, want) = (op.eval(&after), op.eval(&asked));
                                let around = [cur.as_slice(), &[d, x]].concat();
                                if !close(got, want, &around) || !close(x, got, &around) {
                                    fail(format!(
                                        "at {cur:?}, asked {d}, wrote {x} to input {c}, gives {got}, not {want}"
                                    ));
                                }
                            }
                        }
                    }
                }
                Inverse::Drops => {
                    for cur in &all {
                        for &d in &VALUES {
                            if let Some((c, x)) = op.invert(cur, d) {
                                fail(format!("at {cur:?}, asked {d}, wrote {x} to input {c}"));
                            }
                        }
                    }
                }
            }
        }
        // One line per operator: how many, and the first.
        let mut by_op: Vec<(String, usize, String)> = Vec::new();
        for f in &failures {
            let op = f.split(':').next().unwrap().to_string();
            match by_op.iter_mut().find(|(o, ..)| *o == op) {
                Some(e) => e.1 += 1,
                None => by_op.push((op, 1, f.clone())),
            }
        }
        let report: Vec<String> = by_op
            .iter()
            .map(|(_, n, first)| format!("{n:>5}  {first}"))
            .collect();
        assert!(
            failures.is_empty(),
            "{} failures:\n{}",
            failures.len(),
            report.join("\n")
        );
    }
}

/// Every scalar operator's range rule (ADR 0037) holds every value it gives
/// from inputs sampled across the declared ranges: a rule that lies fails
/// here, not in a student's variant.
#[cfg(test)]
mod ranges {
    use super::*;
    use crate::program::OpSpec;

    /// Spans with zero inside, at an end, outside, of one value, wide and
    /// unbounded.
    const SPANS: [Range; 9] = [
        Range::Span(-3.0, -1.0),
        Range::Span(-1.0, 2.0),
        Range::Span(0.0, 0.0),
        Range::Span(0.0, 5.0),
        Range::Span(0.5, 4.0),
        Range::Span(2.0, 2.0),
        Range::Span(-1e3, 1e3),
        Range::Span(1.0, f64::INFINITY),
        Range::Span(f64::NEG_INFINITY, -2.0),
    ];

    /// Samples of a span: its ends, and points between them.
    fn samples(r: Range) -> Vec<f64> {
        let Range::Span(lo, hi) = r else {
            return vec![0.0];
        };
        let (a, b) = (lo.max(-1e6), hi.min(1e6));
        let mut v: Vec<f64> = (0..=10).map(|k| a + (b - a) * k as f64 / 10.0).collect();
        v.extend([lo, hi, (a + b).floor(), 0.5 * (a + b)]);
        v.retain(|x| r.holds(*x));
        v
    }

    #[test]
    fn every_range_rule_holds_what_its_operator_gives() {
        let mut failures = Vec::new();
        for spec in OpSpec::scalars() {
            let n = spec.scalar_arity().unwrap();
            let op = spec.bind_scalar(&CellIdx::below(n).collect::<Vec<_>>());
            let combos: Vec<Vec<Range>> = (0..n).fold(vec![vec![]], |acc, _| {
                acc.iter()
                    .flat_map(|a| SPANS.iter().map(move |&r| [a.clone(), vec![r]].concat()))
                    .collect()
            });
            for ranges in combos {
                let rule = spec.range(&ranges);
                let Range::Span(lo, hi) = rule else { continue };
                let points: Vec<Vec<f64>> = ranges.iter().fold(vec![vec![]], |acc, &r| {
                    acc.iter()
                        .flat_map(|a| {
                            samples(r)
                                .into_iter()
                                .map(move |x| [a.clone(), vec![x]].concat())
                        })
                        .collect()
                });
                for inp in points {
                    let v = op.eval(&inp);
                    if v.is_nan() || v < lo || v > hi {
                        failures.push(format!(
                            "{spec:?} over {ranges:?} at {inp:?} gave {v}, outside [{lo}, {hi}]"
                        ));
                    }
                }
            }
        }
        assert!(
            failures.is_empty(),
            "{} failures, first: {}",
            failures.len(),
            failures[0]
        );
    }
}
