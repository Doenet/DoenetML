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
use crate::document::CellIdx;
use crate::program::{OperandIdx, Range, SymIdx, SymKind, VecIdx, VecOp};

/// `Math.round`: halves round toward positive infinity, unlike Rust's
/// `round`, which rounds them away from zero.
#[inline(always)]
pub fn js_round(x: f64) -> f64 {
    (x + 0.5).floor()
}

/// Relative tolerance of `Eq`, so `0.1 + 0.2 = 0.3` holds in a condition.
pub const EQ_TOL: f64 = 1e-12;

#[inline(always)]
fn holds(x: f64) -> bool {
    x != 0.0 && !x.is_nan()
}

#[inline(always)]
fn bit(b: bool) -> f64 {
    if b { 1.0 } else { 0.0 }
}

#[inline(always)]
fn nan_min(a: f64, b: f64) -> f64 {
    if a.is_nan() || b.is_nan() {
        f64::NAN
    } else {
        a.min(b)
    }
}

#[inline(always)]
fn nan_max(a: f64, b: f64) -> f64 {
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
        eval: choice_index(a, n),
        projection |d| Some((A, choice_index(d, n))),
        range: choice_index_range(a, n),
    }
    /// `a` unless it is NaN, then `b`: `valueOnNaN`. A NaN ask has no
    /// inverse: it would be asking for the fallback.
    NanTo(a, b) {
        eval: if a.is_nan() { b } else { a },
        exact |d| (!d.is_nan()).then_some((A, d)),
        range: a.hull(b),
    }
    /// `a` to the power `b`.
    Pow(a, b) {
        eval: a.powf(b),
        drops,
    }
    /// `a`: a held element's own cell for a value it reads from another
    /// element's, so the hold is on its cell and not on the other's.
    Copy(a) {
        eval: a,
        exact |d| Some((A, d)),
        range: a,
    }
    /// Comparisons for conditions: 1 or 0, and 0 when either
    /// side is NaN. A request cannot change a condition.
    Lt(a, b) {
        eval: bit(a < b),
        drops,
        range: Range::UNIT,
    }
    Le(a, b) {
        eval: bit(a <= b),
        drops,
        range: Range::UNIT,
    }
    /// Equal within a relative error of `EQ_TOL`.
    Eq(a, b) {
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
    /// the program's (`Program::vecs`).
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

    /// Range into `Program::operands` of inputs kept there (vector and
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
    /// (`OpSpec::writes`).
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
