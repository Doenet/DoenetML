//! `<math>`: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::Post;

component! {
    /// `<math>`: lowered to a numeric chain in `value` when its expression is
    /// all numbers and numeric cells (`expr` is then NaN). Otherwise a math
    /// cell: `expr` holds an engine handle, instantiated from the template
    /// whenever a leaf changes (then simplified or expanded if the attribute
    /// says so), and `value` evaluates it (NaN with free symbols).
    tags: ["math"],
    flags: [copyable],
    default_prop: value,
    props {
        // Both of a math's props are set by the builder from its children.
        expr: children { rendered },
        value: children { rendered },
    }
    attributes {
        expand: On,
        simplify: On,
    }
    // Parsed as the type outlining settled (`compile/stages/parse.rs`), not here.
    children: Math,
    planner: Plan(plan),
}

/// The position of `expr`: the engine handle of the expression; NaN when numeric.
pub const EXPR: usize = Props::AT.expr;
/// The position of `value`: the expression's numeric value.
pub const VALUE: usize = Props::AT.value;

/// A math's props: its expression, with `post` applied, and its value.
pub(crate) fn props_of(id: ExprId, post: Post) -> Vec<Source> {
    wiring_of(id, post).finish().0
}

/// A math's wiring: its expression, with `post` applied, and its value.
fn wiring_of(id: ExprId, post: Post) -> ElemWiring {
    let mut wiring = ElemWiring::of(ComponentType::Math);
    wiring.set_public(Props {
        expr: Source::Flow(Flow::MathHandle(id, post)).into(),
        value: Source::Flow(Flow::MathValue(id)).into(),
    });
    wiring
}

/// The type a `<math>` is, from its text alone: a tuple of two, `(a, b)`,
/// is a point; a tuple of more entries is a tuple, one cell per entry;
/// anything else is a math cell. Each `$ref` is one token.
pub(crate) fn settled_type(toks: &[Token]) -> ComponentType {
    match tuple_entries(toks).map(|entries| entries.len()) {
        Some(2) => ComponentType::Point,
        Some(n) if n > 2 => ComponentType::Tuple,
        _ => ComponentType::Math,
    }
}

/// Plans a `<math>` as the type its text makes it: a point's or a tuple's
/// entries, or a math cell, simplified or expanded as its attributes say.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    Ok(match ctx.parsed_math()? {
        ParsedMath::Entries(entries) if ctx.component_type() == ComponentType::Point => {
            let [x, y] = entries[..] else {
                unreachable!("a point is a tuple of two")
            };
            let (x, y) = (ctx.plan_expr(x), ctx.plan_expr(y));
            super::super::geometry::point::wiring_of(x, y)
        }
        ParsedMath::Entries(entries) => {
            if entries.len() > super::MAX_TUPLE {
                return Err(Error::Unsupported(format!(
                    "a tuple of {} entries (at most {})",
                    entries.len(),
                    super::MAX_TUPLE
                )));
            }
            let entries = entries.into_iter().map(|id| ctx.plan_expr(id)).collect();
            super::tuple::wiring_of(entries)
        }
        ParsedMath::Expr(id) => {
            let attrs = Attrs::of(ctx.record());
            let post = if attrs.expand {
                Post::Expand
            } else if attrs.simplify {
                Post::Simplify
            } else {
                Post::None
            };
            wiring_of(id, post)
        }
    })
}
