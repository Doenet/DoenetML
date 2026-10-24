//! `scalar_ops!`: every scalar operator from one entry (ADR 0016). An entry
//! names the operator and its inputs (`Mul(a, b)`) and literal parameters
//! (`Clamp(a; lo, hi)`), its evaluation, and its inverse as one of
//!
//! - `exact |d| ..`: the input to write and its value, or None to drop the
//!   request; where it writes, evaluating again gives `d`;
//! - `projection |d| ..`: likewise, and evaluating again gives the operator
//!   applied with `d` in the written input (ADR 0003);
//! - `drops`: no request passes.
//!
//! In both expressions the inputs are their cells' values and the
//! parameters their literals; an inverse names the input it writes by
//! position, `A` for the first. From the entries the macro makes `Op` and `OpSpec`
//! (with the vector and symbolic variants, whose rules are in `vector.rs`
//! and the engine), `Op::eval`, `Op::invert`, `Op::input_pair`,
//! `OpSpec::scalar_arity`, `OpSpec::bind_scalar`, `OpSpec::inverse` and
//! `OpSpec::scalar_samples`, which
//! the `inverses` tests in `scalar.rs` check every inverse against over a
//! fixed table of values, and `Op::writes` and `OpSpec::writes`, the
//! inputs an inverse may write (ADR 0018): an `exact` or `projection`
//! inverse its first, a `drops` one none. An
//! operator with parameters gives `samples`, the parameters it is checked
//! with.
//!
//! ```ignore
//! scalar_ops! {
//!     /// `a * b`.
//!     Mul(a, b) {
//!         eval: a * b,
//!         exact |d| (b != 0.0).then_some((A, d / b)),
//!     }
//!     /// `a * k`.
//!     Scale(a; k) samples [{ k: 2.0 }, { k: 0.0 }] {
//!         eval: a * k,
//!         exact |d| (k != 0.0).then_some((A, d / k)),
//!     }
//! }
//! ```

/// See the module documentation.
macro_rules! scalar_ops {
    // Normalize each entry, one at a time, into
    // `{ [attrs] Name [inputs] [params] [op def] [spec def] [spec pattern]
    //   [samples] eval kind d inverse }`.
    (@munch [$($done:tt)*]) => { scalar_ops!(@emit $($done)*); };
    // With parameters.
    (@munch [$($done:tt)*]
        $(#[$m:meta])* $name:ident ($($in:ident),+ ; $($p:ident),+)
        samples [$($s:tt),+ $(,)?]
        { eval: $eval:expr, $kind:ident $(|$d:ident| $inv:expr)? $(,)? }
        $($rest:tt)*
    ) => {
        scalar_ops!(@munch [$($done)* {
            [$(#[$m])*] $name [$($in),+] [$($p),+]
            [$name($(scalar_ops!(@cell $in)),+, $(scalar_ops!(@param $p)),+)]
            [$name { $($p: f64),+ }]
            [$name { $($p),+ }]
            [$($s),+]
            $eval, $kind $(|$d| $inv)?
        }] $($rest)*);
    };
    // Without.
    (@munch [$($done:tt)*]
        $(#[$m:meta])* $name:ident ($($in:ident),+)
        { eval: $eval:expr, $kind:ident $(|$d:ident| $inv:expr)? $(,)? }
        $($rest:tt)*
    ) => {
        scalar_ops!(@munch [$($done)* {
            [$(#[$m])*] $name [$($in),+] []
            [$name($(scalar_ops!(@cell $in)),+)]
            [$name]
            [$name]
            [{}]
            $eval, $kind $(|$d| $inv)?
        }] $($rest)*);
    };
    (@cell $x:ident) => { CellIdx };
    (@zero $x:ident) => { 0 };
    (@param $x:ident) => { f64 };
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
    // `input_pair` and `bind` by the number of inputs.
    (@pair $a:ident) => { ($a, None) };
    (@pair $a:ident, $b:ident) => { ($a, Some($b)) };
    (@arity $a:ident) => { 1 };
    (@arity $a:ident, $b:ident) => { 2 };
    (@bind $inputs:ident $name:ident [$a:ident] [$($p:ident),*]) => {
        Op::$name($inputs[0], $($p),*)
    };
    (@bind $inputs:ident $name:ident [$a:ident, $b:ident] [$($p:ident),*]) => {
        Op::$name($inputs[0], $inputs[1], $($p),*)
    };
    (@emit $({
        [$($attr:tt)*] $name:ident [$($in:ident),+] [$($p:ident),*]
        [$($op_def:tt)*] [$($spec_def:tt)*] [$($spec_pat:tt)*]
        [$($sample:tt),*]
        $eval:expr, $kind:ident $(|$d:ident| $inv:expr)?
    })*) => {
        #[derive(Debug, Clone, Copy, PartialEq)]
        pub enum Op {
            $($($attr)* $($op_def)*,)*
            /// A symbolic instruction: inputs are `operands[start..start + n]`; the
            /// `n_out` entries after them hold its memo (see `Program::step`).
            Sym(SymKind, u32, u8),
            /// A vector operator (`vector.rs`): inputs are `operands[start..start + n_in]`,
            /// outputs are the `n_out` cells from the instruction's `out`.
            Vec(VecOp, u32, u8, u8),
        }

        /// Description of an operator before its inputs are bound to cells.
        #[derive(Debug, Clone, Copy, PartialEq)]
        pub enum OpSpec {
            $($($attr)* $($spec_def)*,)*
            Vec(VecOp),
            /// Any number of inputs (a template's leaves); see `SymKind`.
            Sym(SymKind),
        }

        impl Op {
            #[inline(always)]
            #[allow(unused_variables)]
            pub fn eval(&self, cells: &[f64]) -> f64 {
                match *self {
                    $(Op::$name($($in,)+ $($p,)*) => {
                        $(let $in = cells[$in as usize];)+
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
                    $(Op::$name($($in,)+ $($p,)*) => {
                        let written = [$($in),+];
                        $(let $in = cells[$in as usize];)+
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

            /// The operator with its inputs left out: what it computes, with
            /// its literal parameters, whatever cells it reads.
            #[allow(unused_variables)]
            pub fn unbound(&self) -> Op {
                match *self {
                    $(Op::$name($($in,)+ $($p,)*) => Op::$name($(scalar_ops!(@zero $in),)+ $($p,)*),)*
                    Op::Sym(kind, _, n) => Op::Sym(kind, 0, n),
                    Op::Vec(op, _, n_in, n_out) => Op::Vec(op, 0, n_in, n_out),
                }
            }

            /// The input positions its inverse may write, as a mask
            /// (`OpSpec::writes`).
            #[allow(unused_variables)]
            pub fn writes(&self) -> u64 {
                match *self {
                    $(Op::$name(..) => scalar_ops!(@writes $kind),)*
                    Op::Sym(kind, ..) => kind.writes(),
                    Op::Vec(op, ..) => op.writes(),
                }
            }

            /// Input cells, without allocating: `(first, Some(second))` for
            /// binary ops.
            #[inline(always)]
            #[allow(unused_variables)]
            pub fn input_pair(&self) -> (CellIdx, Option<CellIdx>) {
                match *self {
                    $(Op::$name($($in,)+ $($p,)*) => scalar_ops!(@pair $($in),+),)*
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
                    $(OpSpec::$name { .. } => Some(scalar_ops!(@arity $($in),+)),)*
                    OpSpec::Vec(_) | OpSpec::Sym(_) => None,
                }
            }

            /// Bind a scalar operator to its input cells.
            pub(crate) fn bind_scalar(&self, inputs: &[CellIdx]) -> Op {
                match *self {
                    $(OpSpec::$($spec_pat)* => scalar_ops!(@bind inputs $name [$($in),+] [$($p),*]),)*
                    OpSpec::Vec(_) | OpSpec::Sym(_) => unreachable!("not a scalar operator"),
                }
            }

            /// How a scalar operator's inverse is checked; None for a
            /// vector or symbolic one.
            pub fn inverse(&self) -> Option<Inverse> {
                match self {
                    $(OpSpec::$name { .. } => Some(scalar_ops!(@kind $kind)),)*
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
                    $(OpSpec::$name { .. } => scalar_ops!(@writes $kind),)*
                    OpSpec::Vec(op) => op.writes(),
                    OpSpec::Sym(kind) => kind.writes(),
                }
            }

            /// Every scalar operator, with each of its parameter samples.
            pub fn scalar_samples() -> Vec<OpSpec> {
                vec![$($(OpSpec::$name $sample),*),*]
            }
        }
    };
    // The entries, normalized by `@munch` (the arms above come first, so
    // this one never sees the macro's own calls).
    ($($entries:tt)*) => { scalar_ops!(@munch [] $($entries)*); };
}
pub(super) use scalar_ops;
