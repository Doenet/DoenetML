//! What the operators over math share (ADR 0043): whether one is numeric
//! or symbolic ([`Kind`]), its operands as math, and the planner of the
//! one-input types.
//!
//! An operator over math has two ports beside its operands: `expr`, a math
//! cell when the element is symbolic (the engine's operator over the
//! operands, `post` applied), and `value`, its number: an `Evaluate` of
//! `expr` when the element is symbolic, else its operator over numbers in a
//! hidden port (`Flow::ValueOf`). Which it is the type pass decides once per
//! element: `expr` is math when one operand can be (`Flow::MathHandle` over
//! an `Expr::Operator` of the operands), or always (`forceSymbolic`,
//! `Flow::SymExpr`), or never (`forceNumeric`, no value).

use crate::compile::api::{
    ChildValue, ElemWiring, ExprId, GivenId, Leaf, ListEntry, PlanCtx, Port, Source, ValueChildren,
    Wire,
};
use crate::error::{Error, Result};
use crate::program::Post;

/// What decides whether an operator over math is numeric or symbolic.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Kind {
    /// Its operands, by the type pass: symbolic when one can be math.
    ByOperands,
    /// `forceSymbolic`: symbolic, numbers and all.
    Symbolic,
    /// `forceNumeric`, or a type the current core computes only over
    /// numbers (`<median>`): numeric, a math operand no value.
    Numeric,
}

impl Kind {
    /// From `forceSymbolic` and `forceNumeric`; `forceNumeric` wins, as in
    /// the current core.
    pub(crate) fn forced(symbolic: bool, numeric: bool) -> Kind {
        match (symbolic, numeric) {
            (_, true) => Kind::Numeric,
            (true, false) => Kind::Symbolic,
            (false, false) => Kind::ByOperands,
        }
    }

    /// The `expr` port of an operator that is math `id` when symbolic (an
    /// operator expression, `PlanCtx::operator_expr`), `post` applied: a
    /// math cell when this kind and its operands make it symbolic, else no
    /// value.
    pub(crate) fn expr(self, id: Option<ExprId>, post: Post) -> Wire {
        match (self, id) {
            (Kind::Numeric, _) | (_, None) => Wire::absent(),
            (Kind::ByOperands, Some(id)) => Source::math_handle(id, post).into(),
            (Kind::Symbolic, Some(id)) => Source::sym_expr(id, post).into(),
        }
    }
}

/// How an operator over math simplifies its expression, from its
/// `simplify` and `expand`, as a `<math>`'s do.
pub(crate) fn simplify_post(simplify: bool, expand: bool) -> Post {
    match (simplify, expand) {
        (true, true) => Post::SimplifyExpand,
        (false, true) => Post::Expand,
        (true, false) => Post::Simplify,
        (false, false) => Post::None,
    }
}

/// `value`: an `Evaluate` of `expr` when the element is symbolic, else
/// `numeric`, the operator over numbers, made a hidden port of `wiring`.
pub(crate) fn value(wiring: &mut ElemWiring, expr: Port, numeric: Wire) -> Wire {
    let numeric = wiring.hidden_wire(numeric);
    Source::value_of(expr, numeric).into()
}

/// The operands of an operator over its children as a list, as math, one
/// per entry its children contribute ([`PlanCtx::list_entries`], ADR 0041:
/// a list a reference or an element child names spliced into its
/// entries), in order, as `operands` makes a port of each: a text piece as
/// math text (a number's as written), a reference or an element child as
/// its leaf, math text with references as parsed.
pub(crate) fn operand_exprs(
    ctx: &mut PlanCtx<'_, '_>,
    entries: &[ListEntry],
) -> Result<Vec<ExprId>> {
    entries.iter().map(|entry| entry_expr(ctx, entry)).collect()
}

/// One entry of an operator's operands as math; text that is no math is
/// refused.
pub(crate) fn entry_expr(ctx: &mut PlanCtx<'_, '_>, entry: &ListEntry) -> Result<ExprId> {
    ctx.entry_math(entry).ok_or_else(|| match entry {
        ListEntry::Text(_, text) => Error::BadMath {
            text: text.clone(),
            reason: format!(
                "an operand of <{}> that is no math",
                ctx.component_type().tag()
            ),
        },
        _ => unreachable!("a reference or math text is math"),
    })
}

/// The number a planned value is as written: a literal's.
pub(crate) fn literal(source: &Source) -> Option<f64> {
    match source {
        Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) => Some(*v),
        _ => None,
    }
}

/// A one-input operator over math: its operand, the children read as a
/// value (a literal is given, state a request may write), and its `expr`,
/// the engine's `post` of them when they can be math; with no `post`, the
/// operator is numeric. Blank children are no value; an element among
/// them is refused.
fn one_input(
    ctx: &mut PlanCtx<'_, '_>,
    children: &ValueChildren,
    post: Option<Post>,
) -> Result<(Wire, Wire)> {
    if let Some(tag) = &children.element {
        return Err(Error::Unsupported(format!(
            "a <{tag}> inside a <{}>",
            ctx.component_type().tag()
        )));
    }
    let source = match children.value {
        ChildValue::Blank => return Ok((Wire::absent(), Wire::absent())),
        _ => ctx.value_of(children)?,
    };
    let expr = match post {
        Some(post) => {
            let id = ctx
                .operand_expr(&source)
                .map(|id| ctx.operator_expr(&[id], |texts| texts[0].clone()));
            Kind::ByOperands.expr(id, post)
        }
        None => Wire::absent(),
    };
    Ok((Wire::scalar(source, GivenId::Children(0)), expr))
}

/// The wiring of a one-input operator over math whose public ports
/// include `operand` and `expr`, at `at`, and `value`: `value` is
/// `numeric`, the operator over numbers of the operand's port, or an
/// `Evaluate` of the engine's `post` of the operand (none: numeric only).
/// `public` sets the type's `Props` from the operand, the `expr` and the
/// `value`, in that order.
pub(crate) fn plan_one_input(
    ctx: &mut PlanCtx<'_, '_>,
    children: &ValueChildren,
    at: [Port; 2],
    numeric: impl FnOnce(Port) -> Wire,
    post: Option<Post>,
    public: impl FnOnce(&mut ElemWiring, [Wire; 3]),
) -> Result<ElemWiring> {
    let [operand_at, expr_at] = at;
    let (operand, expr) = one_input(ctx, children, post)?;
    let mut wiring = ElemWiring::of(ctx.component_type());
    let value = value(&mut wiring, expr_at, numeric(operand_at));
    public(&mut wiring, [operand, expr, value]);
    Ok(wiring)
}
