//! An instruction ([`Instr`]): an operator bound to its input cells and the
//! cell it writes. [`OpSpec`] is the operator before its inputs are bound, as
//! the build plans it; [`SymKind`] the symbolic instructions (ADR 0008).

use crate::document::CellIdx;
use crate::program::{Op, OpSpec, VecOp};
use crate::sym::Handle;

/// Samples a function curve owns: `Sample` writes this many y-values over
/// evenly spaced x-values from the graph's `xmin` to `xmax`.
pub const SAMPLES: usize = 200;
const _: () = assert!(
    SAMPLES <= u8::MAX as usize,
    "`Op::Sym` keeps its outputs in a byte"
);

/// A symbolic instruction (ADR 0008): it calls the document's symbolic
/// engine. Inputs are cells holding numbers or expression handles; every
/// input is in `Program::operands`. Each one keeps the input values it last ran
/// on and its outputs, and reruns only when an input changed.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SymKind {
    /// The template with each cell leaf replaced by its cell's value (a
    /// number, or the expression a math cell holds), then `post`. Inputs
    /// are the template's leaf cells; `template` is an engine expression
    /// whose leaves are those cells (a build plans one as a
    /// `PlannedOp::Template` until emit gives its leaves cells).
    Instantiate { template: Handle, post: Post },
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
    /// becomes when the expression's shape is constant at build time: no engine
    /// call at tick time.
    SampleTape { tape: u32 },
}

/// What a `<math>` does to its expression after instantiating it.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
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

    /// The input positions its inverse may write (`OpSpec::writes`):
    /// `Evaluate`'s expression, which a math input's value request writes
    /// (`tick/invert.rs`); no other symbolic operator inverts.
    pub fn writes(self) -> u64 {
        match self {
            SymKind::Evaluate => 1,
            _ => 0,
        }
    }

    /// Whether the output is an expression handle (a math cell).
    pub fn makes_math(self) -> bool {
        matches!(self, SymKind::Instantiate { .. } | SymKind::Derivative)
    }
}

crate::index::index_type! {
    /// A position in `Program::operands`, where a vector or symbolic
    /// instruction's input cells are parked: an index into that list, never
    /// into the cells.
    pub struct OperandIdx;
}

crate::index::index_type! {
    /// A position in a program's symbolic memo (`SymState`), where a
    /// symbolic instruction keeps the input values it last ran on and its
    /// outputs.
    pub struct MemoIdx;
}

crate::index::index_type! {
    /// A position in `Program::syms`: a symbolic instruction's kind and
    /// memo.
    pub struct SymIdx;
}

/// A position in `Program::vecs`, the program's distinct vector operators.
/// A `u16`, so that `Op::Vec` fits an instruction of 16 bytes: a program
/// has few distinct vector operators, however many instructions use them.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct VecIdx(u16);

impl VecIdx {
    pub fn index(self) -> usize {
        self.0 as usize
    }
}

/// What a symbolic instruction runs: its kind, and where its memo starts
/// (the `n + n_out` entries it keeps in `SymState`).
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct SymEntry {
    pub kind: SymKind,
    pub memo: MemoIdx,
}

/// What a build parks for the operators it binds (`OpSpec::bind`): the
/// operand list a program keeps, the symbolic instructions' kinds and the
/// distinct vector operators, which an `Op` names by index, and how much
/// of the symbolic memo its instructions take.
#[derive(Debug, Clone, Default)]
pub struct Operands {
    pub cells: Vec<CellIdx>,
    pub syms: Vec<SymEntry>,
    pub vecs: Vec<VecOp>,
    vec_ids: std::collections::HashMap<VecOp, VecIdx>,
    pub memo_len: usize,
}

impl Operands {
    /// `op`'s position in `vecs`, added if new.
    fn intern(&mut self, op: VecOp) -> VecIdx {
        let n = self.vecs.len();
        *self.vec_ids.entry(op).or_insert_with(|| {
            self.vecs.push(op);
            VecIdx(u16::try_from(n).expect("more distinct vector operators than a u16 holds"))
        })
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Instr {
    pub out: CellIdx,
    pub op: Op,
}

// Four instructions to a cache line: what the tick walks. A variant that
// needs more goes in a program table (`Operands`), as `Vec` and `Sym` do.
const _: () = assert!(std::mem::size_of::<Instr>() == 16);

impl OpSpec {
    /// How many inputs the operator reads; `usize::MAX` for one that takes
    /// any number (`accepts`).
    pub const fn arity(&self) -> usize {
        if let Some(n) = self.scalar_arity() {
            return n;
        }
        match self {
            OpSpec::Vec(v) => v.n_in(),
            OpSpec::Sym(SymKind::Instantiate { .. } | SymKind::SampleTape { .. }) => usize::MAX,
            OpSpec::Sym(SymKind::Evaluate | SymKind::Derivative) => 1,
            OpSpec::Sym(SymKind::EvalAt | SymKind::Equals | SymKind::EqualsSyntax) => 2,
            OpSpec::Sym(SymKind::Sample) => 3,
            _ => unreachable!(),
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
    /// in `operands`; a symbolic one also reserves a memo entry for each
    /// input and each output.
    pub fn bind(&self, inputs: &[CellIdx], operands: &mut Operands) -> Op {
        // The compile checks every planned operator (`compile::check_arity`);
        // one the build makes with the wrong count is a core bug, stopped
        // here with its name rather than at an index out of bounds.
        assert!(
            self.accepts(inputs.len()),
            "{self:?} bound to {} inputs",
            inputs.len()
        );
        let park = |operands: &mut Operands, leaves: &[CellIdx]| {
            let start = OperandIdx::new(operands.cells.len() as u32);
            operands.cells.extend_from_slice(leaves);
            (start, leaves.len() as u8)
        };
        match *self {
            OpSpec::Sym(kind) => {
                let (start, n) = park(operands, inputs);
                let memo = MemoIdx::new(operands.memo_len as u32);
                operands.memo_len += n as usize + kind.n_out();
                let sym = SymIdx::from_index(operands.syms.len());
                operands.syms.push(SymEntry { kind, memo });
                Op::Sym(n, kind.n_out() as u8, sym, start)
            }
            OpSpec::Vec(v) => {
                let (start, n) = park(operands, inputs);
                Op::Vec(n, v.n_out() as u8, operands.intern(v), start)
            }
            _ => self.bind_scalar(inputs),
        }
    }
}

#[cfg(test)]
mod arity {
    use super::*;
    use crate::program::vector::{RigidOpts, VecOp};

    /// Every operator: the scalar ones (`scalar_ops!` makes the list, so
    /// none is missing), then every vector
    /// and symbolic one. A vector or symbolic variant added does not compile
    /// until `tag` gives it a number, and then this test fails until `every`
    /// has one of it.
    fn every() -> Vec<OpSpec> {
        let mut ops = OpSpec::scalars();
        ops.extend([
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
            OpSpec::Vec(VecOp::Clamp),
            OpSpec::Vec(VecOp::Centroid { n: 3 }),
            OpSpec::Sym(SymKind::Instantiate {
                template: Handle::new(0),
                post: Post::None,
            }),
            OpSpec::Sym(SymKind::Evaluate),
            OpSpec::Sym(SymKind::EvalAt),
            OpSpec::Sym(SymKind::Derivative),
            OpSpec::Sym(SymKind::Equals),
            OpSpec::Sym(SymKind::EqualsSyntax),
            OpSpec::Sym(SymKind::Sample),
            OpSpec::Sym(SymKind::SampleTape { tape: 0 }),
        ]);
        ops
    }

    /// A number per vector and symbolic operator.
    fn tag(op: &OpSpec) -> Option<usize> {
        Some(match op {
            OpSpec::Vec(v) => match v {
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
                VecOp::Clamp => 12,
                VecOp::Centroid { .. } => 13,
            },
            OpSpec::Sym(k) => {
                14 + match k {
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
            _ => return None,
        })
    }
    const N_TAGS: usize = 22;

    // Each operator binds, evaluates and inverts at the arity it declares,
    // so an arity group that disagrees with the operator's arms (an input
    // read past the declared count) fails here, not in a document.
    #[test]
    fn every_operator_works_at_its_arity() {
        let ops = every();
        let mut tags: Vec<usize> = ops.iter().filter_map(tag).collect();
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
            let inputs: Vec<CellIdx> = CellIdx::below(n).collect();
            let mut operands = Operands::default();
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
