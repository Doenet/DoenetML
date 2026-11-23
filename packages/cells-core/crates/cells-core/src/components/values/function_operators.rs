//! `<clampFunction>` and `<wrapFunctionPeriodic>`: a function whose values
//! are held between, or wrapped into, `lowerValue` and `upperValue`. Each is
//! a math cell, the engine's expression of its function's with the bounds
//! applied (`SymKind::ClampFunction`, `SymKind::WrapFunctionPeriodic`), so it
//! is evaluated, sampled as a curve and differentiated as a `<function>` is.

use crate::compile::api::*;
use crate::components::ComponentDef;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::components::prop::graph;
use crate::error::Result;
use crate::program::{Post, SymKind};

component! {
    /// `<clampFunction lowerValue="-3" upperValue="5">$f</clampFunction>`:
    /// its children's function (a `$f`, or math in `x`) with every value
    /// held between `lowerValue` (0 by default) and `upperValue` (1). As a
    /// curve, its `SAMPLES` cells from `samples` on, over the enclosing
    /// graph's x-range, as a `<function>`'s.
    tags: ["clampFunction"],
    flags: [copyable, symbolic],
    renders: InGraph,
    default_prop: expr,
    props {
        expr: by_planner { expr_of: expr },
        lowerValue: by_planner,
        upperValue: by_planner,
        xmin: by_planner { rendered },
        xmax: by_planner { rendered },
        // Always 1: the bridge draws it as a `<function>`'s curve.
        curve: by_planner { rendered },
        samples: by_planner { rendered, sampled: curve },
    }
    // A point constrained to it rides its graph, as one constrained to a
    // `<function>` does.
    constrain_target { graph: expr }
    attributes {
        lowerValue: Scalar,
        upperValue: Scalar,
    }
    children: Math,
    planner: Plan(plan),
}

/// `<wrapFunctionPeriodic lowerValue="-2" upperValue="3">$f</wrapFunctionPeriodic>`:
/// its children's function with every value wrapped into the range from
/// `lowerValue` to `upperValue`, `lowerValue + mod(f(x) - lowerValue,
/// upperValue - lowerValue)`; a clamp's definition under its own tag.
pub(crate) const WRAP_FUNCTION_PERIODIC: ComponentDef =
    DEFINITION.with_tags(&["wrapFunctionPeriodic"]);

/// The children's expression, the bounds (literal or computed, else 0 and
/// 1), the operator over them, and its samples over the x-range of the
/// graph it sits in, else [-10, 10].
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let component_type = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    let nodes = attrs.children.unwrap_or_default();
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(component_type);
    let mt = ctx.math_text(&nodes)?;
    let id = ctx.sym_math(&nodes, &mt)?;
    let of = wiring.hidden(Source::sym_expr(id, Post::None));
    let bound = |source: Option<Source>, attr: Attr, default: f64| match source {
        Some(source) => Wire::scalar(source, GivenId::Attr(attr, 0)),
        None => Wire::constant(default),
    };
    let kind = if component_type == ComponentType::ClampFunction {
        SymKind::ClampFunction
    } else {
        SymKind::WrapFunctionPeriodic
    };
    let [xmin, xmax] = match (
        ctx.enclosing_graph_prop(graph::Props::PORTS.xmin),
        ctx.enclosing_graph_prop(graph::Props::PORTS.xmax),
    ) {
        (Some(xmin), Some(xmax)) => [xmin.into(), xmax.into()],
        _ => [Wire::constant(-10.0), Wire::constant(10.0)],
    };
    wiring.set_public(Props {
        expr: Wire::computed(OpSpec::Sym(kind), vec![of, at.lowerValue, at.upperValue]),
        lowerValue: bound(attrs.lowerValue, attr::lowerValue, 0.0),
        upperValue: bound(attrs.upperValue, attr::upperValue, 1.0),
        xmin,
        xmax,
        curve: Wire::constant(1.0),
        samples: Wire::computed(
            OpSpec::Sym(SymKind::Sample),
            vec![at.expr, at.xmin, at.xmax],
        ),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "function_operators.spec.rs"]
mod spec;
