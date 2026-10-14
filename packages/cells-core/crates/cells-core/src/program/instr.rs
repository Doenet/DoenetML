//! An instruction ([`Instr`]): an operator bound to its input cells and the
//! cell it writes. [`OpSpec`] is the operator before its inputs are bound, as
//! the build plans it; [`SymKind`] the symbolic instructions (ADR 0008).

use crate::document::CellIdx;
use crate::program::{Op, VecOp};

/// Samples a function curve owns: `Sample` writes this many y-values over
/// evenly spaced x-values from the graph's `xmin` to `xmax`.
pub const SAMPLES: usize = 200;

/// A symbolic instruction (ADR 0008): it calls the document's symbolic
/// engine. Inputs are cells holding numbers or expression handles; every
/// input is in `Program::operands`. Each one keeps the input values it last ran
/// on and its outputs, and reruns only when an input changed.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SymKind {
    /// The template with each cell leaf replaced by its cell's value (a
    /// number, or the expression a math cell holds), then `post`. Inputs
    /// are the template's leaf cells. Before emit, `template` indexes the
    /// builder's template list; after, it is an engine handle.
    Instantiate { template: u32, post: Post },
    /// The expression in input 0 as a number; NaN with free symbols.
    Evaluate,
    /// Input 0 with `x` set to input 1.
    EvalAt,
    /// d/dx of input 0.
    Derivative,
    /// 1 if inputs 0 and 1 are mathematically equal (by sampling), else 0.
    Equals,
    /// 1 if inputs 0 and 1 are the same expression as written, else 0.
    EqualsSyntax,
    /// Input 0 at `SAMPLES` evenly spaced x from input 1 to input 2.
    Sample,
    /// `Program::tapes[tape]` at `SAMPLES` evenly spaced x from input 0 to
    /// input 1; inputs 2.. are the tape's parameter cells. What `Sample`
    /// becomes when the expression's shape is fixed at build time: no engine
    /// call at tick time.
    SampleTape { tape: u32 },
}

/// What a `<math>` does to its expression after instantiating it.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Post {
    None,
    Simplify,
    Expand,
}

impl SymKind {
    pub fn n_out(self) -> usize {
        match self {
            SymKind::Sample | SymKind::SampleTape { .. } => SAMPLES,
            _ => 1,
        }
    }

    /// Whether the output is an expression handle (a math cell).
    pub fn makes_math(self) -> bool {
        matches!(self, SymKind::Instantiate { .. } | SymKind::Derivative)
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Instr {
    pub out: CellIdx,
    pub op: Op,
}

/// Description of an operator before its inputs are bound to cells.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum OpSpec {
    Add,
    Sub,
    Mul,
    Div,
    Min,
    Max,
    Default,
    Negate,
    Round,
    Floor,
    Scale {
        k: f64,
    },
    Offset {
        k: f64,
    },
    Clamp {
        lo: f64,
        hi: f64,
    },
    NanTo {
        k: f64,
    },
    Lerp {
        t: f64,
    },
    Pow,
    Hold,
    Lt,
    Le,
    Eq,
    Truthy,
    Not,
    Vec(VecOp),
    /// Any number of inputs (a template's leaves); see `SymKind`.
    Sym(SymKind),
}

impl OpSpec {
    pub fn arity(&self) -> usize {
        match self {
            OpSpec::Add
            | OpSpec::Sub
            | OpSpec::Mul
            | OpSpec::Div
            | OpSpec::Min
            | OpSpec::Max
            | OpSpec::Default
            | OpSpec::Lerp { .. }
            | OpSpec::Pow
            | OpSpec::Hold
            | OpSpec::Lt
            | OpSpec::Le
            | OpSpec::Eq => 2,
            OpSpec::Negate
            | OpSpec::Round
            | OpSpec::Floor
            | OpSpec::Scale { .. }
            | OpSpec::Offset { .. }
            | OpSpec::Clamp { .. }
            | OpSpec::NanTo { .. }
            | OpSpec::Truthy
            | OpSpec::Not => 1,
            OpSpec::Vec(v) => v.n_in(),
            OpSpec::Sym(SymKind::Instantiate { .. } | SymKind::SampleTape { .. }) => usize::MAX,
            OpSpec::Sym(SymKind::Evaluate | SymKind::Derivative) => 1,
            OpSpec::Sym(SymKind::EvalAt | SymKind::Equals | SymKind::EqualsSyntax) => 2,
            OpSpec::Sym(SymKind::Sample) => 3,
        }
    }

    pub fn n_out(&self) -> usize {
        match self {
            OpSpec::Vec(v) => v.n_out(),
            OpSpec::Sym(k) => k.n_out(),
            _ => 1,
        }
    }

    /// Bind to input cells. Vector and symbolic operators park their inputs
    /// in `operands`; a symbolic one also reserves `n_out` entries after them
    /// for its memo.
    pub fn bind(&self, inputs: &[CellIdx], operands: &mut Vec<CellIdx>) -> Op {
        debug_assert!(
            inputs.len() == self.arity()
                || matches!(
                    self,
                    OpSpec::Sym(SymKind::Instantiate { .. } | SymKind::SampleTape { .. })
                )
        );
        let park = |operands: &mut Vec<CellIdx>, leaves: &[CellIdx]| {
            let start = operands.len() as u32;
            operands.extend_from_slice(leaves);
            (start, leaves.len() as u8)
        };
        match *self {
            OpSpec::Add => Op::Add(inputs[0], inputs[1]),
            OpSpec::Sub => Op::Sub(inputs[0], inputs[1]),
            OpSpec::Mul => Op::Mul(inputs[0], inputs[1]),
            OpSpec::Div => Op::Div(inputs[0], inputs[1]),
            OpSpec::Min => Op::Min(inputs[0], inputs[1]),
            OpSpec::Max => Op::Max(inputs[0], inputs[1]),
            OpSpec::Default => Op::Default(inputs[0], inputs[1]),
            OpSpec::Negate => Op::Negate(inputs[0]),
            OpSpec::Round => Op::Round(inputs[0]),
            OpSpec::Floor => Op::Floor(inputs[0]),
            OpSpec::Scale { k } => Op::Scale(inputs[0], k),
            OpSpec::Offset { k } => Op::Offset(inputs[0], k),
            OpSpec::Clamp { lo, hi } => Op::Clamp(inputs[0], lo, hi),
            OpSpec::NanTo { k } => Op::NanTo(inputs[0], k),
            OpSpec::Lerp { t } => Op::Lerp(inputs[0], inputs[1], t),
            OpSpec::Pow => Op::Pow(inputs[0], inputs[1]),
            OpSpec::Hold => Op::Hold(inputs[0], inputs[1]),
            OpSpec::Lt => Op::Lt(inputs[0], inputs[1]),
            OpSpec::Le => Op::Le(inputs[0], inputs[1]),
            OpSpec::Eq => Op::Eq(inputs[0], inputs[1]),
            OpSpec::Truthy => Op::Truthy(inputs[0]),
            OpSpec::Not => Op::Not(inputs[0]),
            OpSpec::Sym(k) => {
                let (start, n) = park(operands, inputs);
                operands.extend(std::iter::repeat_n(crate::document::NONE, k.n_out()));
                Op::Sym(k, start, n)
            }
            OpSpec::Vec(v) => {
                let (start, n) = park(operands, inputs);
                Op::Vec(v, start, n, v.n_out() as u8)
            }
        }
    }
}
