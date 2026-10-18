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
    /// Simplified, then expanded (a `<boolean simplifyOnCompare
    /// expandOnCompare>`): the engine's expand does not simplify first.
    SimplifyExpand,
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
    /// How many inputs the operator reads; `usize::MAX` for one that takes
    /// any number (`accepts`).
    pub const fn arity(&self) -> usize {
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

    /// Whether the operator can read `n` inputs: its arity, or any number
    /// for a template's leaves.
    pub const fn accepts(&self, n: usize) -> bool {
        match self {
            OpSpec::Sym(SymKind::Instantiate { .. } | SymKind::SampleTape { .. }) => true,
            _ => self.arity() == n,
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
        // The compile checks every planned operator (`compile::check_arity`);
        // one the build makes with the wrong count is a core bug, stopped
        // here with its name rather than at an index out of bounds.
        assert!(
            self.accepts(inputs.len()),
            "{self:?} bound to {} inputs",
            inputs.len()
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

#[cfg(test)]
mod arity {
    use super::*;
    use crate::program::vector::{RigidOpts, VecOp};

    /// A number per operator. Adding a variant does not compile until it is
    /// given one here, and then `every_operator_works_at_its_arity` fails
    /// until `every` has one of it.
    fn tag(op: &OpSpec) -> usize {
        match op {
            OpSpec::Add => 0,
            OpSpec::Sub => 1,
            OpSpec::Mul => 2,
            OpSpec::Div => 3,
            OpSpec::Min => 4,
            OpSpec::Max => 5,
            OpSpec::Default => 6,
            OpSpec::Negate => 7,
            OpSpec::Round => 8,
            OpSpec::Floor => 9,
            OpSpec::Scale { .. } => 10,
            OpSpec::Offset { .. } => 11,
            OpSpec::Clamp { .. } => 12,
            OpSpec::NanTo { .. } => 13,
            OpSpec::Lerp { .. } => 14,
            OpSpec::Pow => 15,
            OpSpec::Hold => 16,
            OpSpec::Lt => 17,
            OpSpec::Le => 18,
            OpSpec::Eq => 19,
            OpSpec::Truthy => 20,
            OpSpec::Not => 21,
            OpSpec::Vec(v) => {
                22 + match v {
                    VecOp::Shape { .. } => 0,
                    VecOp::CircleCenterPoint => 1,
                    VecOp::CirclePoints { .. } => 2,
                    VecOp::CircleTwoPointsRadius => 3,
                    VecOp::PolarSlope => 4,
                    VecOp::PolarDirection { .. } => 5,
                    VecOp::LinePointsFromCoeffs => 6,
                    VecOp::ProjectCircle => 7,
                    VecOp::ProjectLine => 8,
                    VecOp::First { .. } => 9,
                    VecOp::Choose { .. } => 10,
                    VecOp::WeightedMean { .. } => 11,
                }
            }
            OpSpec::Sym(k) => {
                34 + match k {
                    SymKind::Instantiate { .. } => 0,
                    SymKind::Evaluate => 1,
                    SymKind::EvalAt => 2,
                    SymKind::Derivative => 3,
                    SymKind::Equals => 4,
                    SymKind::EqualsSyntax => 5,
                    SymKind::Sample => 6,
                    SymKind::SampleTape { .. } => 7,
                }
            }
        }
    }
    const N_TAGS: usize = 42;

    fn every() -> Vec<OpSpec> {
        let k = 2.0;
        vec![
            OpSpec::Add,
            OpSpec::Sub,
            OpSpec::Mul,
            OpSpec::Div,
            OpSpec::Min,
            OpSpec::Max,
            OpSpec::Default,
            OpSpec::Negate,
            OpSpec::Round,
            OpSpec::Floor,
            OpSpec::Scale { k },
            OpSpec::Offset { k },
            OpSpec::Clamp { lo: 0.0, hi: 1.0 },
            OpSpec::NanTo { k },
            OpSpec::Lerp { t: 0.5 },
            OpSpec::Pow,
            OpSpec::Hold,
            OpSpec::Lt,
            OpSpec::Le,
            OpSpec::Eq,
            OpSpec::Truthy,
            OpSpec::Not,
            OpSpec::Vec(VecOp::Shape {
                n: 3,
                opts: RigidOpts::RIGID,
            }),
            OpSpec::Vec(VecOp::CircleCenterPoint),
            OpSpec::Vec(VecOp::CirclePoints { n: 3 }),
            OpSpec::Vec(VecOp::CircleTwoPointsRadius),
            OpSpec::Vec(VecOp::PolarSlope),
            OpSpec::Vec(VecOp::PolarDirection {
                perpendicular: true,
            }),
            OpSpec::Vec(VecOp::LinePointsFromCoeffs),
            OpSpec::Vec(VecOp::ProjectCircle),
            OpSpec::Vec(VecOp::ProjectLine),
            OpSpec::Vec(VecOp::First { n: 3 }),
            OpSpec::Vec(VecOp::Choose { n: 3 }),
            OpSpec::Vec(VecOp::WeightedMean { n: 3 }),
            OpSpec::Sym(SymKind::Instantiate {
                template: 0,
                post: Post::None,
            }),
            OpSpec::Sym(SymKind::Evaluate),
            OpSpec::Sym(SymKind::EvalAt),
            OpSpec::Sym(SymKind::Derivative),
            OpSpec::Sym(SymKind::Equals),
            OpSpec::Sym(SymKind::EqualsSyntax),
            OpSpec::Sym(SymKind::Sample),
            OpSpec::Sym(SymKind::SampleTape { tape: 0 }),
        ]
    }

    // Each operator binds, evaluates and inverts at the arity it declares,
    // so an arity group that disagrees with the operator's arms (an input
    // read past the declared count) fails here, not in a document.
    #[test]
    fn every_operator_works_at_its_arity() {
        let ops = every();
        let mut tags: Vec<usize> = ops.iter().map(tag).collect();
        tags.sort();
        tags.dedup();
        assert_eq!(
            tags,
            (0..N_TAGS).collect::<Vec<_>>(),
            "`every` misses an operator"
        );
        for spec in ops {
            let n = if spec.arity() == usize::MAX {
                2
            } else {
                spec.arity()
            };
            assert!(spec.accepts(n));
            let inputs: Vec<CellIdx> = (0..n as CellIdx).collect();
            let mut operands = Vec::new();
            let op = spec.bind(&inputs, &mut operands);
            let cells: Vec<f64> = (0..n).map(|i| 1.0 + i as f64).collect();
            match spec {
                OpSpec::Vec(v) => {
                    let mut out = vec![0.0; v.n_out()];
                    v.eval(&cells, &mut out);
                }
                // Evaluated through the engine (`tests/symbolic.rs`).
                OpSpec::Sym(_) => {}
                _ => {
                    op.eval(&cells);
                    op.invert(&cells, 1.5);
                }
            }
            if spec.arity() != usize::MAX {
                assert!(!spec.accepts(n + 1), "{spec:?}");
            }
        }
    }
}
