//! `<mathInput>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentTypeInfo, PropDef};
use crate::dast::NodeKind;
use crate::error::{Error, Result};
use crate::program::SymKind;

/// `<mathInput>`: bound to another cell by a child reference or
/// `bindValueTo`, it is a numeric input (`expr` NaN). Unbound, its `expr`
/// is an essential math cell (typing writes a parsed handle) and `value`
/// evaluates it; a request on `value` writes a constant expression.
pub(in crate::components) const MATH_INPUT: ComponentTypeInfo =
    info(&["mathInput"], MATH_INPUT_PROPS)
        .copyable()
        .default_prop("value");

// A mathInput's value is bound by a child reference or `bindValueTo`,
// else it is the `prefill` (the builder reads it). The builder plans
// `expr` from what `value` turned out to be (`plan`).
const MATH_INPUT_PROPS: &[PropDef] = &props([
    children("value").attribute("prefill").bind("bindValueTo"),
    by_planner("expr"),
]);

typed_props!(MATH_INPUT_PROPS { value, expr });

pub const VALUE: usize = Props::AT.value;
pub const EXPR: usize = Props::AT.expr;

/// A mathInput bound to a cell (a reference child or `bindValueTo`)
/// stays a numeric input. Unbound, its `expr` is an essential math cell
/// holding the prefill (or its children's text) and `value` evaluates it.
/// A `prefill="$n"` is not a binding: the expression starts as `$n`'s
/// value when the input is first built.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>, props: &mut [Option<SourcePlan>]) -> Result<()> {
    let d = ctx.dast();
    let at = Props::AT;
    let el = ctx.node();
    if d.attr(el, "bindValueTo").is_none()
        && d.children(el).iter().all(|&n| ctx.is_blank(n))
        && let Some(a) = d.attr(el, "prefill")
        && ctx.single_macro(a).is_some()
        && let Some(SourcePlan::Alias(Arg::Ref(p, Sel::Whole))) = props[at.value]
    {
        props[at.expr] = Some(SourcePlan::MathEssentialFrom(p));
        props[at.value] = Some(SourcePlan::computed(
            OpSpec::Sym(SymKind::Evaluate),
            vec![at.expr],
        ));
        return Ok(());
    }
    let nodes = match d.attr(el, "prefill") {
        Some(a) => d.attr_children(a),
        None => d.children(el),
    };
    let bound = matches!(props[at.value], Some(SourcePlan::Alias(_)))
        || nodes.iter().any(|&n| d.kind(n) == NodeKind::Macro);
    if bound {
        props[at.expr] = Some(SourcePlan::Fixed(f64::NAN));
        return Ok(());
    }
    let text: String = nodes
        .iter()
        .filter(|&&n| d.kind(n) == NodeKind::Text)
        .map(|&n| d.str(n))
        .collect();
    let text = text.trim();
    let tree = if text.is_empty() {
        None
    } else {
        Some(
            // Build-time only, so a throwaway engine parses it.
            crate::sym::Engine::new()
                .parse_tree(text)
                .map_err(|reason| Error::BadMath {
                    text: text.into(),
                    reason,
                })?,
        )
    };
    props[at.expr] = Some(SourcePlan::MathEssential(tree));
    props[at.value] = Some(SourcePlan::computed(
        OpSpec::Sym(SymKind::Evaluate),
        vec![at.expr],
    ));
    Ok(())
}
