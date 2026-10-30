//! `scalar_ops!`: every scalar operator from one entry (ADR 0016). An entry
//! names the operator and its inputs (`Mul(a, b)`, at most three), its
//! evaluation, and its inverse as one of
//!
//! - `exact |d| ..`: the input to write and its value, or None to drop the
//!   request; where it writes, evaluating again gives `d`;
//! - `projection |d| ..`: likewise, and evaluating again gives the operator
//!   applied with `d` in the written input (ADR 0003);
//! - `drops`: no request passes.
//!
//! In both expressions the inputs are their cells' values; an inverse names
//! the input it writes by position, `A` for the first. A literal an
//! operator reads is an input like any other, a fixed cell
//! (`Builder::const_slot`). From the entries the macro makes `Op` and
//! `OpSpec` (with the vector and symbolic variants, whose rules are in
//! `vector.rs` and the engine), `Op::eval`, `Op::invert`,
//! `Op::scalar_inputs`, `OpSpec::scalar_arity`, `OpSpec::bind_scalar`,
//! `OpSpec::inverse` and `OpSpec::scalars`, which the `inverses` tests in
//! `scalar.rs` check every inverse against over a fixed table of values,
//! and `OpSpec::writes`, the inputs an inverse may write (ADR 0018): an
//! `exact` or `projection` inverse its first, a `drops` one none.
//!
//! ```ignore
//! scalar_ops! {
//!     /// `a * b`.
//!     Mul(a, b) {
//!         eval: a * b,
//!         exact |d| (b != 0.0).then_some((A, d / b)),
//!     }
//! }
//! ```

/// See the module documentation.
macro_rules! scalar_ops {
    (@cell $x:ident) => { CellIdx };
    (@zero $x:ident) => { CellIdx::new(0) };
    // The inverse's body, and its kind.
    (@inverse drops $desired:ident) => { None };
    (@inverse $kind:ident $desired:ident |$d:ident| $inv:expr) => {{
        let $d = $desired;
        $inv
    }};
    (@kind exact) => { Inverse::Exact };
    (@kind projection) => { Inverse::Projection };
    (@kind drops) => { Inverse::Drops };
    // The inputs an inverse may write: an inverse that passes a request
    // writes its first input.
    (@writes exact) => { 1 };
    (@writes projection) => { 1 };
    (@writes drops) => { 0 };
    // `scalar_inputs` and `bind` by the number of inputs.
    (@inputs $a:ident) => { ([$a, $a, $a], 1) };
    (@inputs $a:ident, $b:ident) => { ([$a, $b, $b], 2) };
    (@inputs $a:ident, $b:ident, $c:ident) => { ([$a, $b, $c], 3) };
    (@arity $a:ident) => { 1 };
    (@arity $a:ident, $b:ident) => { 2 };
    (@arity $a:ident, $b:ident, $c:ident) => { 3 };
    (@bind $inputs:ident $name:ident [$a:ident]) => { Op::$name($inputs[0]) };
    (@bind $inputs:ident $name:ident [$a:ident, $b:ident]) => {
        Op::$name($inputs[0], $inputs[1])
    };
    (@bind $inputs:ident $name:ident [$a:ident, $b:ident, $c:ident]) => {
        Op::$name($inputs[0], $inputs[1], $inputs[2])
    };
    ($(
        $(#[$m:meta])* $name:ident ($($in:ident),+)
        { eval: $eval:expr, $kind:ident $(|$d:ident| $inv:expr)? $(,)? }
    )*) => {
        #[derive(Debug, Clone, Copy, PartialEq)]
        pub enum Op {
            $($(#[$m])* $name($(scalar_ops!(@cell $in)),+),)*
            /// A symbolic instruction: inputs are `operands[start..start + n]`;
            /// its memo is the `n + n_out` entries from `memo` (see `Program::step`).
            Sym(SymKind, OperandIdx, u8, MemoIdx),
            /// A vector operator (`vector.rs`): inputs are `operands[start..start + n_in]`,
            /// outputs are the `n_out` cells from the instruction's `out`.
            Vec(VecOp, OperandIdx, u8, u8),
        }

        /// Description of an operator before its inputs are bound to cells.
        #[derive(Debug, Clone, Copy, PartialEq)]
        pub enum OpSpec {
            $($(#[$m])* $name,)*
            Vec(VecOp),
            /// Any number of inputs (a template's leaves); see `SymKind`.
            Sym(SymKind),
        }

        impl Op {
            #[inline(always)]
            pub fn eval(&self, cells: &[f64]) -> f64 {
                match *self {
                    $(Op::$name($($in),+) => {
                        $(let $in = cells[$in.index()];)+
                        $eval
                    })*
                    Op::Vec(..) => unreachable!("vector operators are evaluated with eval_vec"),
                    Op::Sym(..) => unreachable!("symbolic instructions are evaluated by the program"),
                }
            }

            /// Given a desired output value, which input to write and what
            /// value. Returns `None` when the request must be dropped: the
            /// inverse is undefined for the current values (division by
            /// zero) or the desired value is outside the operator's domain.
            #[inline]
            #[allow(unused_variables)]
            pub fn invert(&self, cells: &[f64], desired: f64) -> Option<(CellIdx, f64)> {
                match *self {
                    $(Op::$name($($in),+) => {
                        let written = [$($in),+];
                        $(let $in = cells[$in.index()];)+
                        let r: Option<(usize, f64)> =
                            scalar_ops!(@inverse $kind desired $(|$d| $inv)?);
                        r.map(|(i, x)| (written[i], x))
                    })*
                    // Symbolic operators have no inverse rule (ADR 0008);
                    // `Evaluate`'s constant-expression inverse needs the
                    // engine, so the request engine handles it
                    // (`tick/invert.rs`).
                    Op::Sym(..) => None,
                    Op::Vec(..) => unreachable!("vector operators are inverted jointly by the program"),
                }
            }

            /// The operator with its inputs left out: what it computes,
            /// whatever cells it reads.
            #[allow(unused_variables)]
            pub fn unbound(&self) -> Op {
                match *self {
                    $(Op::$name($($in),+) => Op::$name($(scalar_ops!(@zero $in)),+),)*
                    Op::Sym(kind, _, n, _) => Op::Sym(kind, OperandIdx::default(), n, MemoIdx::default()),
                    Op::Vec(op, _, n_in, n_out) => Op::Vec(op, OperandIdx::default(), n_in, n_out),
                }
            }

            /// A scalar operator's input cells without allocating: the first
            /// `n` of the array.
            #[inline(always)]
            pub fn scalar_inputs(&self) -> ([CellIdx; 3], usize) {
                match *self {
                    $(Op::$name($($in),+) => scalar_ops!(@inputs $($in),+),)*
                    Op::Vec(..) | Op::Sym(..) => {
                        unreachable!("vector and symbolic operators keep every input in operands")
                    }
                }
            }
        }

        /// How a scalar operator's inverse is checked (`scalar.rs`'s `inverses`).
        #[derive(Debug, Clone, Copy, PartialEq, Eq)]
        pub enum Inverse {
            Exact,
            Projection,
            Drops,
        }

        impl OpSpec {
            /// A scalar operator's inputs; None for a vector or symbolic one.
            pub const fn scalar_arity(&self) -> Option<usize> {
                match self {
                    $(OpSpec::$name => Some(scalar_ops!(@arity $($in),+)),)*
                    OpSpec::Vec(_) | OpSpec::Sym(_) => None,
                }
            }

            /// Bind a scalar operator to its input cells.
            pub(crate) fn bind_scalar(&self, inputs: &[CellIdx]) -> Op {
                match *self {
                    $(OpSpec::$name => scalar_ops!(@bind inputs $name [$($in),+]),)*
                    OpSpec::Vec(_) | OpSpec::Sym(_) => unreachable!("not a scalar operator"),
                }
            }

            /// How a scalar operator's inverse is checked; None for a
            /// vector or symbolic one.
            pub fn inverse(&self) -> Option<Inverse> {
                match self {
                    $(OpSpec::$name => Some(scalar_ops!(@kind $kind)),)*
                    OpSpec::Vec(_) | OpSpec::Sym(_) => None,
                }
            }

            /// The input positions its inverse may write, as a mask: bit
            /// `k` for input `k` (ADR 0018). It may name an input the
            /// inverse writes only for some values, and never leaves one
            /// out; the `inverses` tests in `scalar.rs` and the `writes`
            /// tests in `vector.rs` check it.
            pub fn writes(&self) -> u64 {
                match self {
                    $(OpSpec::$name => scalar_ops!(@writes $kind),)*
                    OpSpec::Vec(op) => op.writes(),
                    OpSpec::Sym(kind) => kind.writes(),
                }
            }

            /// Every scalar operator.
            pub fn scalars() -> Vec<OpSpec> {
                vec![$(OpSpec::$name),*]
            }
        }
    };
}
pub(super) use scalar_ops;
