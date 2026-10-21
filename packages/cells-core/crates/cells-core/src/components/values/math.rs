//! `<math>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentType, ComponentTypeInfo, PropDef};
use crate::dast::NodeId;
use crate::error::{Error, Result};
use crate::program::Post;

/// `<math>`: lowered to a numeric chain in `value` when its expression
/// is all numbers and numeric cells (`expr` is then NaN). Otherwise a
/// math cell: `expr` holds an engine handle, instantiated from the
/// template whenever a leaf changes (then simplified or expanded if the
/// attribute says so), and `value` evaluates it (NaN with free symbols).
pub(in crate::components) const MATH: ComponentTypeInfo =
    info(&["math"], MATH_PROPS).copyable().default_prop("value");

// Both of a math's props are set by the builder from its children.
const MATH_PROPS: &[PropDef] = &props([children("expr"), children("value")]);

pub const EXPR: usize = at(MATH_PROPS, "expr");
pub const VALUE: usize = at(MATH_PROPS, "value");

/// A tuple-valued math (`<math>(a, b)</math>`) is a point for the cells
/// core: two cells, draggable as a direction source. With three or more
/// entries it is a tuple, one cell per entry. Otherwise it is a math cell,
/// simplified or expanded as its attributes say.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    let d = ctx.dast();
    let el = ctx.node();
    let nodes: Vec<NodeId> = d.children(el).to_vec();
    let (toks, text) = ctx.math_tokens(&nodes)?;
    if let Some(inner) = unwrap_parens(&toks)
        && split_top(inner, &Token::Comma).len() == 2
    {
        let [x, y] = ctx.tuple(&nodes)?;
        ctx.set_type(ComponentType::Point);
        ctx.set_props(point_props(x, y));
        return Ok(());
    }
    if let Some(inner) = unwrap_parens(&toks)
        && split_top(inner, &Token::Comma).len() > 2
    {
        let parts = split_top(inner, &Token::Comma);
        if parts.len() > super::MAX_TUPLE {
            return Err(Error::Unsupported(format!(
                "a tuple of {} entries (at most {})",
                parts.len(),
                super::MAX_TUPLE
            )));
        }
        let mut entries = Vec::with_capacity(parts.len());
        for part in &parts {
            let id = ctx.parse(part, &text)?;
            entries.push(ctx.plan_expr(id));
        }
        ctx.set_type(ComponentType::Tuple);
        ctx.set_props(tuple_props(entries));
        return Ok(());
    }
    let id = ctx.sym_math(&nodes)?;
    let post = if ctx.attr_on(el, "expand") {
        Post::Expand
    } else if ctx.attr_on(el, "simplify") {
        Post::Simplify
    } else {
        Post::None
    };
    ctx.set_props(math_props(id, post));
    Ok(())
}
