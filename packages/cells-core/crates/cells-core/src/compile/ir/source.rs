//! Where a port's value comes from, before any iteration exists: a
//! [`Source`] (a leaf, a dataflow expression over [`Arg`]s, or a scope
//! specialization), and what holds an element ([`Hold`]).

use crate::compile::*;
use crate::components::{Aggregate, ArgFrom};

/// A cell an operator reads or a slot aliases, named before any iteration
/// exists: a reference (with a selector into what it names), one of the
/// element's own ports, a port of another element in the same template, or
/// a constant.
#[derive(Debug, Clone, Copy)]
pub(crate) enum Arg {
    Ref(RefId, Sel),
    Own(Port),
    /// A copy with overridden attributes shares the rest of the original's
    /// essential state through this.
    Elem(ElemId, Port),
    /// A literal an operator reads. Only an operator input, never an
    /// alias.
    Const(f64),
}

/// Which cell of a reference's target: the single cell, coordinate `j` of a
/// point-valued prop, coordinate `j` of item `i` of a list prop, or port
/// `k` of the element the path names, whatever prop it is.
#[derive(Debug, Clone, Copy)]
pub(crate) enum Sel {
    Whole,
    Coord(u8),
    Item(u8, u8),
    Port(u8),
}

/// A value not given (yet): an attribute's default when it has no value
/// of its own, an emptied input, an answer not submitted, an entry past a
/// tuple's end, an operator input left out. A component writes NaN only
/// as this, or as [`Wire::undefined`]/[`Source::undefined`] after a warning.
pub(crate) const NO_VALUE: f64 = f64::NAN;

/// Proof that the element's diagnostic was raised, required to make a
/// value a planner cannot define.
#[derive(Debug, Clone, Copy)]
pub(crate) struct Warned(());

impl Warned {
    pub(in crate::compile) fn raised() -> Self {
        Warned(())
    }
}

/// Where a port's value comes from, before any iteration exists: a leaf, a
/// dataflow expression over ports, or a scope specialization choosing
/// between two by the scope the template is stamped in.
#[derive(Debug, Clone)]
pub(crate) enum Source {
    Leaf(Leaf),
    Flow(Flow),
    /// The first source where `pred` holds of the scope the template is
    /// stamped in, the second elsewhere: chosen per instance, like a
    /// scope constant.
    Specialize(ScopePred, Box<Source>, Box<Source>),
}

/// A value nothing computes: given (essential when a student's action can
/// write it, a constant otherwise), a constant, or a scope constant.
#[derive(Debug, Clone)]
pub(crate) enum Leaf {
    /// A given value: the attribute's, or the type's default
    /// without one.
    Given(f64),
    /// A given text value holding this string, or none (blank).
    GivenText(Option<StrId>),
    /// A given math value (an unbound mathInput's `expr`, an answer's
    /// `submitted`) holding this expression, or blank (NaN).
    GivenMath(Option<Tree<RefId>>),
    /// A constant: never state, whatever can reach it.
    Const(f64),
    /// A value that depends on the scope the template is stamped in.
    Scope(ScopeConst),
}

/// A scope constant: a value that depends on the scope alone.
#[derive(Debug, Clone, Copy)]
pub(crate) enum ScopeConst {
    /// The 1-based position of the enclosing iteration.
    IterIndex,
    /// A `<selectFromSequence>`'s draw: a number in `[0, 1)` drawn per
    /// instance from the document seed, which its pick (`VecOp::
    /// SequencePick`) indexes the sequence by (ADR 0037).
    Draw,
    /// A given math value whose initial expression is the value the
    /// reference names when the cell is first built (a mathInput's
    /// `prefill="$n"`): a seed, not a binding.
    Seed(RefId),
}

/// A dataflow expression over ports: an alias, an operator, a lowered math
/// tree whose leaves are ports, or a symbolic template whose leaves are
/// ports.
#[derive(Debug, Clone)]
pub(crate) enum Flow {
    Alias(Arg),
    /// Operator over cells.
    Op(OpSpec, Vec<Arg>),
    /// Output `k` of the vector instruction headed at own port `head`
    /// (an `Op(OpSpec::Vec(..))`, which is output 0).
    VecOut(Port, u8),
    /// Math text: lowered to operators if numeric, else NaN.
    Math(ExprId),
    /// A `<math>`'s `expr` prop: NaN when the math is numeric (it lowers),
    /// else as `SymExpr`.
    MathHandle(ExprId, Post),
    /// A `<math>`'s `value` prop: the literal if the expression is a
    /// number, the lowered operators if numeric, else an `Evaluate` of its
    /// `expr`.
    MathValue(ExprId),
    /// A math cell from math text: a constant handle
    /// without cell leaves, an alias of a lone math leaf, else an
    /// `Instantiate` instruction over the leaves.
    SymExpr(ExprId, Post),
    /// An operator over a collection of components around the element:
    /// credit over the scored items, a section's number among its
    /// siblings, a collect's count of what it gathers.
    Aggregate(Aggregate),
}

/// A structural predicate of the scope a template is stamped in.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum ScopePred {
    /// The first iteration of the enclosing repeat (a function iterate's
    /// initial value).
    FirstIteration,
}

impl Leaf {
    /// Whether the leaf is a document constant when it is a constant: the
    /// same in every instance of its template slot. A scope constant is
    /// not.
    pub(crate) fn is_document_constant(&self) -> bool {
        !matches!(self, Leaf::Scope(_))
    }
}

impl Flow {
    /// Whether a constant this expression gives is a document constant:
    /// math text with nothing to read is; an alias or an operator is what
    /// it reads.
    pub(crate) fn is_document_constant(&self) -> bool {
        matches!(
            self,
            Flow::Math(_) | Flow::MathHandle(..) | Flow::MathValue(_) | Flow::SymExpr(..)
        )
    }
}

impl Source {
    /// Whether a constant this plan gives is a document constant: one made
    /// from the source alone, the same in every instance of its template
    /// slot.
    pub(crate) fn gives_document_constant(&self) -> bool {
        match self {
            Source::Leaf(leaf) => leaf.is_document_constant(),
            Source::Flow(flow) => flow.is_document_constant(),
            Source::Specialize(..) => false,
        }
    }

    /// Port `k` of the element `p` names, whatever prop it is: a copy's
    /// port aliasing its referent's.
    pub(crate) fn port_of(p: RefId, k: usize) -> Self {
        Source::Flow(Flow::Alias(Arg::Ref(p, Sel::Port(byte(k)))))
    }

    /// A given value.
    pub(crate) fn given(v: f64) -> Self {
        Source::Leaf(Leaf::Given(v))
    }
    /// A constant.
    pub(crate) fn constant(v: f64) -> Self {
        Source::Leaf(Leaf::Const(v))
    }
    /// A value the element cannot have, as `warned` explains: NaN.
    pub(crate) fn undefined(_: Warned) -> Self {
        Source::constant(f64::NAN)
    }
    /// A value not given (`NO_VALUE`), as a constant.
    pub(crate) fn absent() -> Self {
        Source::constant(NO_VALUE)
    }
    /// An aggregate over a collection ([`Flow::Aggregate`]).
    pub(crate) fn aggregate(a: Aggregate) -> Self {
        Source::Flow(Flow::Aggregate(a))
    }
    pub(crate) fn reference(p: RefId) -> Self {
        Source::Flow(Flow::Alias(Arg::Ref(p, Sel::Whole)))
    }
    pub(crate) fn coord(p: RefId, j: usize) -> Self {
        Source::Flow(Flow::Alias(Arg::Ref(p, Sel::Coord(byte(j)))))
    }
    pub(crate) fn item(p: RefId, i: usize, j: usize) -> Self {
        Source::Flow(Flow::Alias(Arg::Ref(p, Sel::Item(byte(i), byte(j)))))
    }
    /// An alias of the element's own port.
    pub(crate) fn own(port: Port) -> Self {
        Source::Flow(Flow::Alias(Arg::Own(port)))
    }
    /// An alias of `arg`.
    pub(crate) fn alias(arg: Arg) -> Self {
        Source::Flow(Flow::Alias(arg))
    }
    /// Operator `op` over `args`.
    pub(crate) fn op(op: OpSpec, args: Vec<Arg>) -> Self {
        Source::Flow(Flow::Op(op, args))
    }
    /// Operator over the element's own ports.
    pub(crate) fn computed(op: OpSpec, args: Vec<Port>) -> Self {
        Source::op(op, args.into_iter().map(Arg::Own).collect())
    }
    /// A type's [`PropFrom::Computed`] prop.
    pub(crate) fn from_def(op: OpSpec, args: &[ArgFrom]) -> Self {
        let arg = |&a: &ArgFrom| match a {
            ArgFrom::Prop(p) => Arg::Own(Port::table(p as usize)),
            ArgFrom::Const(k) => Arg::Const(k),
        };
        Source::op(op, args.iter().map(arg).collect())
    }
    /// Operator over the element's own port `a` and the literal `k`.
    pub(crate) fn computed_k(op: OpSpec, a: Port, k: f64) -> Self {
        Source::op(op, vec![Arg::Own(a), Arg::Const(k)])
    }
    /// Head of a vector instruction over own ports; this port is output 0,
    /// the next `n_out - 1` ports are `VecOut`.
    pub(crate) fn vector(op: VecOp, args: Vec<Port>) -> Self {
        Source::computed(OpSpec::Vec(op), args)
    }
    /// A math cell from math text ([`Flow::SymExpr`]).
    pub(crate) fn sym_expr(id: ExprId, post: Post) -> Self {
        Source::Flow(Flow::SymExpr(id, post))
    }
    /// Math text ([`Flow::Math`]).
    pub(crate) fn math(id: ExprId) -> Self {
        Source::Flow(Flow::Math(id))
    }
}

/// What holds an element: when its cells refuse requests.
#[derive(Debug, Clone, Default)]
pub(crate) enum Hold {
    #[default]
    Off,
    /// A literal `fixed`.
    Always,
    /// While any of these flags is set.
    While(Vec<RefId>),
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::components::{AggOp, Collection};

    /// Whether a plan gives a document constant is decided by its kind
    /// alone.
    #[test]
    fn document_constants_are_classed_by_kind() {
        let p = RefId::new(0);
        let expr = ExprId::new(0);
        let leaves = [
            (Leaf::Given(1.0), true),
            (Leaf::GivenText(None), true),
            (Leaf::GivenMath(None), true),
            (Leaf::Const(1.0), true),
            (Leaf::Scope(ScopeConst::IterIndex), false),
            (Leaf::Scope(ScopeConst::Draw), false),
            (Leaf::Scope(ScopeConst::Seed(p)), false),
        ];
        for (leaf, document) in leaves {
            assert_eq!(
                Source::Leaf(leaf.clone()).gives_document_constant(),
                document,
                "{leaf:?}"
            );
        }
        let flows = [
            (Flow::Alias(Arg::Ref(p, Sel::Whole)), false),
            (
                Flow::Op(OpSpec::Add, vec![Arg::Const(1.0), Arg::Const(2.0)]),
                false,
            ),
            (Flow::VecOut(Port::table(0), 1), false),
            (Flow::Math(expr), true),
            (Flow::MathHandle(expr, Post::None), true),
            (Flow::MathValue(expr), true),
            (Flow::SymExpr(expr, Post::None), true),
        ];
        for (flow, document) in flows {
            assert_eq!(
                Source::Flow(flow.clone()).gives_document_constant(),
                document,
                "{flow:?}"
            );
        }
        let one = Box::new(Source::constant(1.0));
        assert!(
            !Source::Specialize(ScopePred::FirstIteration, one.clone(), one)
                .gives_document_constant()
        );
        let credit = Aggregate {
            op: AggOp::Credit,
            over: Collection::ScoredItems,
        };
        assert!(!Source::aggregate(credit).gives_document_constant());
    }
}
