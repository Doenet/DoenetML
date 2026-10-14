//! Operators: the numeric functions that compute derived cells. Literal
//! parameters are stored inline in the instruction, not in cells.
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

use crate::document::CellIdx;
use crate::program::{SymKind, VecOp};

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Op {
    Add(CellIdx, CellIdx),
    Sub(CellIdx, CellIdx),
    Mul(CellIdx, CellIdx),
    Div(CellIdx, CellIdx),
    /// NaN if either argument is NaN (unlike `f64::min`).
    Min(CellIdx, CellIdx),
    /// NaN if either argument is NaN (unlike `f64::max`).
    Max(CellIdx, CellIdx),
    /// `a` unless it is NaN, then `b`. The cell-level counterpart of the
    /// current core's `valueOnNaN`; it is what gives a recurrence its seed
    /// where a lagged reference has no referent.
    Default(CellIdx, CellIdx),
    Negate(CellIdx),
    /// Round half away from zero, as `f64::round`.
    Round(CellIdx),
    Floor(CellIdx),
    Scale(CellIdx, f64),
    Offset(CellIdx, f64),
    Clamp(CellIdx, f64, f64),
    /// `a` unless it is NaN, then the literal: `valueOnNaN` with a constant.
    NanTo(CellIdx, f64),
    /// `a + t * (b - a)`
    Lerp(CellIdx, CellIdx, f64),
    Pow(CellIdx, CellIdx),
    /// `a`, whatever the flag. The flag is read only by the inverse, which
    /// drops a request unless the flag is 0: a dynamic `fixed` or
    /// `fixAxes`. The flag is still an input, so the hold is an edge in the
    /// graph, like `Shape`'s pivot.
    Hold(CellIdx, CellIdx),
    /// Comparisons for conditions (ADR 0009): 1 or 0, and 0 when either side
    /// is NaN. `Eq` allows a relative error of `EQ_TOL`. No inverses.
    Lt(CellIdx, CellIdx),
    Le(CellIdx, CellIdx),
    Eq(CellIdx, CellIdx),
    /// 1 when `a` holds (nonzero, not NaN), else 0.
    Truthy(CellIdx),
    /// 1 when `a` does not hold.
    Not(CellIdx),
    /// A symbolic instruction: inputs are `operands[start..start + n]`; the
    /// `n_out` entries after them hold its memo (see `Program::step`).
    Sym(SymKind, u32, u8),
    /// A vector operator (`vector.rs`): inputs are `operands[start..start + n_in]`,
    /// outputs are the `n_out` cells from the instruction's `out`.
    Vec(VecOp, u32, u8, u8),
}

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

impl Op {
    #[inline(always)]
    pub fn eval(&self, cells: &[f64]) -> f64 {
        match *self {
            Op::Add(a, b) => cells[a as usize] + cells[b as usize],
            Op::Sub(a, b) => cells[a as usize] - cells[b as usize],
            Op::Mul(a, b) => cells[a as usize] * cells[b as usize],
            Op::Div(a, b) => cells[a as usize] / cells[b as usize],
            Op::Min(a, b) => nan_min(cells[a as usize], cells[b as usize]),
            Op::Max(a, b) => nan_max(cells[a as usize], cells[b as usize]),
            Op::Default(a, b) => {
                let x = cells[a as usize];
                if x.is_nan() { cells[b as usize] } else { x }
            }
            Op::Negate(a) => -cells[a as usize],
            Op::Round(a) => js_round(cells[a as usize]),
            Op::Floor(a) => cells[a as usize].floor(),
            Op::Scale(a, k) => cells[a as usize] * k,
            Op::Offset(a, k) => cells[a as usize] + k,
            Op::Clamp(a, lo, hi) => cells[a as usize].clamp(lo, hi),
            Op::NanTo(a, k) => {
                let x = cells[a as usize];
                if x.is_nan() { k } else { x }
            }
            Op::Lerp(a, b, t) => {
                let (x, y) = (cells[a as usize], cells[b as usize]);
                x + t * (y - x)
            }
            Op::Pow(a, b) => cells[a as usize].powf(cells[b as usize]),
            Op::Hold(a, _) => cells[a as usize],
            Op::Lt(a, b) => bit(cells[a as usize] < cells[b as usize]),
            Op::Le(a, b) => bit(cells[a as usize] <= cells[b as usize]),
            Op::Eq(a, b) => {
                let (x, y) = (cells[a as usize], cells[b as usize]);
                bit(x == y || (x - y).abs() <= EQ_TOL * x.abs().max(y.abs()))
            }
            Op::Truthy(a) => bit(holds(cells[a as usize])),
            Op::Not(a) => bit(!holds(cells[a as usize])),
            Op::Vec(..) => unreachable!("vector operators are evaluated with eval_vec"),
            Op::Sym(..) => unreachable!("symbolic instructions are evaluated by the program"),
        }
    }

    /// Given a desired output value, which input to write and what value.
    /// Returns `None` when the request must be dropped: the inverse is
    /// undefined for the current values (division by zero) or the desired
    /// value is outside the operator's domain.
    #[inline]
    pub fn invert(&self, cells: &[f64], desired: f64) -> Option<(CellIdx, f64)> {
        let v = |c: CellIdx| cells[c as usize];
        Some(match *self {
            Op::Add(a, b) => (a, desired - v(b)),
            Op::Sub(a, b) => (a, desired + v(b)),
            Op::Mul(a, b) => {
                let d = v(b);
                if d == 0.0 {
                    return None;
                }
                (a, desired / d)
            }
            Op::Div(a, b) => {
                let d = v(b);
                if d == 0.0 || d.is_nan() {
                    return None;
                }
                (a, desired * d)
            }
            // Projections: the input is asked for the projected value.
            Op::Min(a, b) => (a, nan_min(desired, v(b))),
            Op::Max(a, b) => (a, nan_max(desired, v(b))),
            // While `a` has no value the request belongs to the fallback.
            Op::Default(a, b) => {
                if v(a).is_nan() {
                    (b, desired)
                } else {
                    (a, desired)
                }
            }
            Op::Negate(a) => (a, -desired),
            Op::Round(a) => {
                if !desired.is_finite() {
                    return None;
                }
                (a, js_round(desired))
            }
            Op::Floor(a) => {
                if !desired.is_finite() {
                    return None;
                }
                (a, desired.floor())
            }
            Op::Scale(a, k) => {
                if k == 0.0 {
                    return None;
                }
                (a, desired / k)
            }
            Op::Offset(a, k) => (a, desired - k),
            Op::Clamp(a, lo, hi) => (a, desired.clamp(lo, hi)),
            // A NaN ask has no inverse here: it would be asking for the fallback.
            Op::NanTo(a, _) => {
                if desired.is_nan() {
                    return None;
                }
                (a, desired)
            }
            Op::Lerp(a, b, t) => {
                // desired = a(1-t) + t b
                if t == 1.0 {
                    return None;
                }
                (a, (desired - t * v(b)) / (1.0 - t))
            }
            // Open only at exactly 0: a NaN flag (a missing referent) holds.
            Op::Hold(a, flag) => {
                if v(flag) != 0.0 {
                    return None;
                }
                (a, desired)
            }
            // Symbolic operators have no inverse rule (ADR 0008); `Evaluate`'s
            // constant-expression inverse needs the engine, so the request
            // engine handles it (`tick/invert.rs`).
            Op::Pow(..) | Op::Sym(..) => return None,
            // A request cannot change a condition (ADR 0009).
            Op::Lt(..) | Op::Le(..) | Op::Eq(..) | Op::Truthy(..) | Op::Not(..) => return None,
            Op::Vec(..) => unreachable!("vector operators are inverted jointly by the program"),
        })
    }

    /// Input cells, without allocating: `(first, Some(second))` for binary ops.
    #[inline(always)]
    pub fn input_pair(&self) -> (CellIdx, Option<CellIdx>) {
        match *self {
            Op::Add(a, b)
            | Op::Sub(a, b)
            | Op::Mul(a, b)
            | Op::Div(a, b)
            | Op::Min(a, b)
            | Op::Max(a, b)
            | Op::Default(a, b)
            | Op::Lerp(a, b, _)
            | Op::Pow(a, b)
            | Op::Hold(a, b)
            | Op::Lt(a, b)
            | Op::Le(a, b)
            | Op::Eq(a, b) => (a, Some(b)),
            Op::Negate(a)
            | Op::Round(a)
            | Op::Floor(a)
            | Op::Scale(a, _)
            | Op::Offset(a, _)
            | Op::Clamp(a, _, _)
            | Op::NanTo(a, _)
            | Op::Truthy(a)
            | Op::Not(a) => (a, None),
            Op::Vec(..) | Op::Sym(..) => {
                unreachable!("vector and symbolic operators keep every input in operands")
            }
        }
    }

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
