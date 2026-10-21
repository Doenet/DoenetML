//! `<function>` and `<derivative>`, which share their table: their
//! definitions and their planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::prop::graph;
use crate::components::{ComponentType, ComponentTypeInfo, PropDef};
use crate::dast::NodeId;
use crate::error::Result;
use crate::program::{Post, SymKind};

/// `<function>`: a math cell `expr` (variable `x`) and, as a curve, the
/// `SAMPLES` cells from `samples` on, filled by a `Sample` instruction
/// over the enclosing graph's x-range.
pub(in crate::components) const FUNCTION: ComponentTypeInfo = info(&["function"], CURVE_PROPS)
    .copyable()
    .symbolic()
    .default_prop("expr");

/// `<derivative>$f</derivative>`: d/dx of a function or math, sampled
/// like a function.
pub(in crate::components) const DERIVATIVE: ComponentTypeInfo = info(&["derivative"], CURVE_PROPS)
    .copyable()
    .symbolic()
    .default_prop("expr");

// Planned by `plan`; `samples` is the first of
// `SAMPLES` consecutive cells.
const CURVE_PROPS: &[PropDef] = &props([
    children("expr"),
    planned("xmin"),
    planned("xmax"),
    planned("samples"),
]);

// The positions of `<function>` and `<derivative>`, which share their table.
pub const EXPR: usize = at(CURVE_PROPS, "expr");
pub const XMIN: usize = at(CURVE_PROPS, "xmin");
pub const XMAX: usize = at(CURVE_PROPS, "xmax");
pub const SAMPLES: usize = at(CURVE_PROPS, "samples");

/// Whether a `<function>` takes several variables or returns a tuple.
fn is_vector_function(ctx: &mut PlanCtx<'_, '_>) -> Result<bool> {
    let el = ctx.node();
    if ctx.function_variables(el).len() > 1 {
        return Ok(true);
    }
    let nodes: Vec<NodeId> = ctx.dast().children(el).to_vec();
    let (toks, _) = ctx.math_tokens(&nodes)?;
    Ok(unwrap_parens(&toks).is_some_and(|inner| split_top(inner, &Token::Comma).len() > 1))
}

/// A math cell `expr` and, as a curve, its samples over the x-range of
/// the graph it sits in, else [-10, 10].
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    let component_type = ctx.component_type();
    let nodes: Vec<NodeId> = ctx.dast().children(ctx.node()).to_vec();
    let mut plan = ElemPlan::of(component_type);
    if component_type == ComponentType::Function && is_vector_function(ctx)? {
        // Not a curve and not a math cell: a function of several
        // variables, or one returning a tuple, is only iterated
        // (`plan_function_iterates` reads its text).
        plan.set(EXPR, SourcePlan::Fixed(f64::NAN));
        plan.set(XMIN, SourcePlan::Fixed(-10.0));
        plan.set(XMAX, SourcePlan::Fixed(10.0));
        plan.set(SAMPLES, SourcePlan::Fixed(f64::NAN));
        ctx.set_plan(plan);
        return Ok(());
    }
    let id = ctx.sym_math(&nodes)?;
    if component_type == ComponentType::Function {
        plan.set(EXPR, SourcePlan::SymExpr(id, Post::None));
    } else {
        let of = plan.hidden(SourcePlan::SymExpr(id, Post::None));
        plan.set(
            EXPR,
            SourcePlan::computed(OpSpec::Sym(SymKind::Derivative), vec![of]),
        );
    }
    match (
        ctx.enclosing_graph_prop(graph::XMIN),
        ctx.enclosing_graph_prop(graph::XMAX),
    ) {
        (Some(xmin), Some(xmax)) => {
            plan.set(XMIN, xmin);
            plan.set(XMAX, xmax);
        }
        _ => {
            plan.set(XMIN, SourcePlan::Fixed(-10.0));
            plan.set(XMAX, SourcePlan::Fixed(10.0));
        }
    }
    plan.set(
        SAMPLES,
        SourcePlan::computed(OpSpec::Sym(SymKind::Sample), vec![EXPR, XMIN, XMAX]),
    );
    ctx.set_plan(plan);
    Ok(())
}
