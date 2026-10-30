//! `<function>` and `<derivative>`, which share their table: their
//! definitions and their planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::prop::graph;
use crate::components::{ComponentDef, ComponentType};
use crate::dast::NodeId;
use crate::error::Result;
use crate::program::{Post, SymKind};

component! {
    /// `<function>`: a math cell `expr` (variable `x`) and, as a curve, the
    /// `SAMPLES` cells from `samples` on, filled by a `Sample` instruction over
    /// the enclosing graph's x-range. Drawn in a graph, as its curve through
    /// the samples when `curve` is 1; in text it has no view yet.
    tags: ["function"],
    flags: [copyable, symbolic],
    renders: InGraph,
    default_prop: expr,
    props {
        expr: children,
        xmin: by_planner { rendered },
        xmax: by_planner { rendered },
        // 1 when the function has a curve, 0 when it has none (it takes
        // several variables or returns a tuple): a fact about the source,
        // so the bridge need not ask how `samples` is computed.
        curve: by_planner { rendered },
        // `samples` is the first of `SAMPLES` consecutive cells, outputs
        // with it when `curve` is 1 (`sampled`).
        samples: by_planner { rendered, sampled: curve },
    }
    planner: Whole(plan),
}

/// `<derivative>$f</derivative>`: d/dx of a function or math, sampled
/// like a function; a function's definition under its own tag.
pub(crate) const DERIVATIVE: ComponentDef = DEFINITION.with_tags(&["derivative"]);

pub const EXPR: usize = Props::AT.expr;
pub const XMIN: usize = Props::AT.xmin;
pub const XMAX: usize = Props::AT.xmax;
pub const CURVE: usize = Props::AT.curve;
pub const SAMPLES: usize = Props::AT.samples;

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
    let at = Props::AT;
    let mut wiring = ElemWiring::of(component_type);
    if component_type == ComponentType::Function && is_vector_function(ctx)? {
        // Not a curve and not a math cell: a function of several
        // variables, or one returning a tuple, is only iterated
        // (`plan_function_iterates` reads its text).
        wiring.set_public(Props {
            expr: Wire::absent(),
            xmin: Wire::constant(-10.0),
            xmax: Wire::constant(10.0),
            curve: Wire::constant(0.0),
            samples: Wire::absent(),
        });
        ctx.set_wiring(wiring);
        return Ok(());
    }
    let id = ctx.sym_math(&nodes)?;
    let expr = if component_type == ComponentType::Function {
        Source::SymExpr(id, Post::None).into()
    } else {
        let of = wiring.hidden(Source::SymExpr(id, Post::None));
        Wire::computed(OpSpec::Sym(SymKind::Derivative), vec![of])
    };
    let [xmin, xmax] = match (
        ctx.enclosing_graph_prop(graph::XMIN),
        ctx.enclosing_graph_prop(graph::XMAX),
    ) {
        (Some(xmin), Some(xmax)) => [xmin.into(), xmax.into()],
        _ => [Wire::constant(-10.0), Wire::constant(10.0)],
    };
    wiring.set_public(Props {
        expr,
        xmin,
        xmax,
        curve: Wire::constant(1.0),
        samples: Wire::computed(
            OpSpec::Sym(SymKind::Sample),
            vec![at.expr, at.xmin, at.xmax],
        ),
    });
    ctx.set_wiring(wiring);
    Ok(())
}
