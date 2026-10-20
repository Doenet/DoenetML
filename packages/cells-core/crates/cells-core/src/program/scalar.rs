//! Operators: the numeric functions that compute derived cells. Literal
//! parameters are stored inline in the instruction, not in cells. Every
//! scalar operator is one `scalar_ops!` entry (`ops.rs`, ADR 0016): to add
//! one, add an entry.
//!
//! Inverse rules for the scalar operators here (ADR 0003): a binary operator
//! writes its first argument (`Default` writes whichever argument it is
//! passing through); an idempotent operator (Round, Floor, Clamp, Min, Max)
//! inverts by projection, applying itself to the requested value; an inverse
//! that is undefined for the current values, or whose requested value is
//! outside the operator's domain (a non-finite ask on Round), returns `None`
//! and the request is dropped. Vector operators (`Op::Vec`) carry their own
//! rules in `vector.rs`, and may write several inputs; the request engine in
//! `tick/invert.rs` gathers requests and keeps point groups together.

use super::ops::scalar_ops;
use crate::document::CellIdx;
use crate::program::{SymKind, VecOp};

/// `Math.round`: halves round toward positive infinity, unlike Rust's
/// `round`, which rounds them away from zero. The current core is JavaScript,
/// so a grid snap of -1.5 must give -1 here too.
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

/// The input an inverse writes: the operator's first or second.
const A: usize = 0;
const B: usize = 1;

scalar_ops! {
    /// `a + b`.
    Add(a, b) ["add"] {
        eval: a + b,
        exact |d| Some((A, d - b)),
    }
    /// `a - b`.
    Sub(a, b) ["sub"] {
        eval: a - b,
        exact |d| Some((A, d + b)),
    }
    /// `a * b`.
    Mul(a, b) ["mul"] {
        eval: a * b,
        exact |d| (b != 0.0).then_some((A, d / b)),
    }
    /// `a / b`.
    Div(a, b) ["div"] {
        eval: a / b,
        exact |d| (b != 0.0 && !b.is_nan()).then_some((A, d * b)),
    }
    /// NaN if either argument is NaN (unlike `f64::min`).
    Min(a, b) ["min"] {
        eval: nan_min(a, b),
        projection |d| Some((A, nan_min(d, b))),
    }
    /// NaN if either argument is NaN (unlike `f64::max`).
    Max(a, b) ["max"] {
        eval: nan_max(a, b),
        projection |d| Some((A, nan_max(d, b))),
    }
    /// `a` unless it is NaN, then `b`. The cell-level counterpart of the
    /// current core's `valueOnNaN`; it is what gives a recurrence its seed
    /// where a lagged reference has no referent. While `a` has no value the
    /// request belongs to the fallback.
    Default(a, b) ["default"] {
        eval: if a.is_nan() { b } else { a },
        exact |d| Some((if a.is_nan() { B } else { A }, d)),
    }
    /// `-a`.
    Negate(a) ["negate"] {
        eval: -a,
        exact |d| Some((A, -d)),
    }
    /// Round half toward positive infinity, as `Math.round` (`js_round`).
    Round(a) ["round"] {
        eval: js_round(a),
        projection |d| d.is_finite().then(|| (A, js_round(d))),
    }
    /// `a` rounded down.
    Floor(a) ["floor"] {
        eval: a.floor(),
        projection |d| d.is_finite().then(|| (A, d.floor())),
    }
    /// `a * k`.
    Scale(a; k) ["scale"] samples [{ k: 2.0 }, { k: -0.5 }, { k: 0.0 }] {
        eval: a * k,
        exact |d| (k != 0.0).then_some((A, d / k)),
    }
    /// `a + k`.
    Offset(a; k) ["offset"] samples [{ k: 3.0 }] {
        eval: a + k,
        exact |d| Some((A, d - k)),
    }
    /// `a` held between `lo` and `hi`.
    Clamp(a; lo, hi) ["clamp"] samples [{ lo: 0.0, hi: 1.0 }, { lo: -2.5, hi: 4.0 }] {
        eval: a.clamp(lo, hi),
        projection |d| Some((A, d.clamp(lo, hi))),
    }
    /// `a` unless it is NaN, then the literal: `valueOnNaN` with a
    /// constant. A NaN ask has no inverse: it would be asking for the
    /// fallback.
    NanTo(a; k) ["nanTo"] samples [{ k: 7.0 }] {
        eval: if a.is_nan() { k } else { a },
        exact |d| (!d.is_nan()).then_some((A, d)),
    }
    /// `a + t * (b - a)`.
    Lerp(a, b; t) ["lerp"] samples [{ t: 0.5 }, { t: 0.25 }, { t: -1.0 }, { t: 1.0 }] {
        eval: a + t * (b - a),
        // desired = a(1-t) + t b
        exact |d| (t != 1.0).then(|| (A, (d - t * b) / (1.0 - t))),
    }
    /// `a` to the power `b`.
    Pow(a, b) ["pow"] {
        eval: a.powf(b),
        drops,
    }
    /// `a`, whatever the flag. The flag is read only by the inverse, which
    /// drops a request unless the flag is exactly 0 (a NaN flag, a missing
    /// referent, holds): a dynamic `fixed` or `fixAxes`. The flag is still
    /// an input, so the hold is an edge in the graph, like `Shape`'s pivot.
    /// `kind="gate"` predates the op's name.
    Hold(a, b) ["hold", "gate"] {
        eval: a,
        exact |d| (b == 0.0).then_some((A, d)),
    }
    /// Comparisons for conditions (ADR 0009): 1 or 0, and 0 when either
    /// side is NaN. A request cannot change a condition.
    Lt(a, b) ["lt"] {
        eval: bit(a < b),
        drops,
    }
    Le(a, b) ["le"] {
        eval: bit(a <= b),
        drops,
    }
    /// Equal within a relative error of `EQ_TOL`.
    Eq(a, b) ["eq"] {
        eval: bit(a == b || (a - b).abs() <= EQ_TOL * a.abs().max(b.abs())),
        drops,
    }
    /// 1 when `a` holds (nonzero, not NaN), else 0.
    Truthy(a) ["truthy"] {
        eval: bit(holds(a)),
        drops,
    }
    /// 1 when `a` does not hold.
    Not(a) ["not"] {
        eval: bit(!holds(a)),
        drops,
    }
}

impl Op {
    /// Number of output cells (1 for every scalar operator).
    #[inline(always)]
    pub fn n_out(&self) -> usize {
        match *self {
            Op::Vec(_, _, _, n_out) => n_out as usize,
            Op::Sym(k, ..) => k.n_out(),
            _ => 1,
        }
    }

    /// Evaluate a vector operator into `out` (`n_out` values).
    #[inline]
    pub fn eval_vec(&self, cells: &[f64], operands: &[CellIdx], out: &mut [f64]) {
        let Op::Vec(v, start, n_in, _) = *self else {
            unreachable!()
        };
        let mut inp = [0.0f64; crate::program::MAX_VEC_IN];
        let n_in = n_in as usize;
        for (k, &c) in operands[start as usize..start as usize + n_in]
            .iter()
            .enumerate()
        {
            inp[k] = cells[c as usize];
        }
        v.eval(&inp[..n_in], out);
    }

    /// Range into `Program::operands` of inputs kept there (vector and
    /// symbolic operators).
    #[inline(always)]
    pub fn operand_range(&self) -> std::ops::Range<usize> {
        match *self {
            Op::Vec(_, start, n, _) | Op::Sym(_, start, n) => {
                start as usize..start as usize + n as usize
            }
            _ => 0..0,
        }
    }

    /// All input cells, direct and in `operands`.
    pub fn inputs<'a>(&self, operands: &'a [CellIdx]) -> impl Iterator<Item = CellIdx> + 'a {
        let (a, b) = match self {
            Op::Vec(..) | Op::Sym(..) => (None, None),
            _ => {
                let (a, b) = self.input_pair();
                (Some(a), b)
            }
        };
        a.into_iter()
            .chain(b)
            .chain(operands[self.operand_range()].iter().copied())
    }
}
