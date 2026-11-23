//! `<clampFunction>` and `<wrapFunctionPeriodic>`: a function whose values
//! are held between, or wrapped into, `lowerValue` and `upperValue`. Each is
//! a math cell, the engine's expression of its function's with the bounds
//! applied (`SymKind::ClampFunction`, `SymKind::WrapFunctionPeriodic`), so it
//! is evaluated, sampled as a curve and differentiated as a `<function>` is.

use crate::compile::api::*;
use crate::components::ComponentDef;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::components::values::curve::{FunctionParts, function_curve, referenced_function};
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
        // Its function's variable and domain (ADR 0046): `x` and the whole
        // line for math in `x`.
        variable: by_planner,
        domainMin: by_planner,
        domainMax: by_planner,
        domainMinClosed: by_planner,
        domainMaxClosed: by_planner,
        xmin: by_planner { rendered },
        xmax: by_planner { rendered },
        // Always 1: the bridge draws it as a `<function>`'s curve.
        curve: by_planner { rendered },
        samples: by_planner { rendered, sampled: curve },
    }
    // A point constrained to it rides its graph, as one constrained to a
    // `<function>` does.
    constrain_target { function: expr }
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
    // Of a function, in its variable and on its domain (ADR 0046).
    let (of, parts) = match referenced_function(ctx, &nodes)? {
        Some((f, parts)) => (wiring.hidden(f), parts),
        None => {
            let id = ctx.sym_math(&nodes, &mt)?;
            let parts = FunctionParts {
                variable: ctx.symbol("x").into(),
                ..FunctionParts::plain()
            };
            (wiring.hidden(Source::sym_expr(id, Post::None)), parts)
        }
    };
    let bound = |source: Option<Source>, attr: Attr, default: f64| match source {
        Some(source) => Wire::scalar(source, GivenId::Attr(attr, 0)),
        None => Wire::constant(default),
    };
    let kind = if component_type == ComponentType::ClampFunction {
        SymKind::ClampFunction
    } else {
        SymKind::WrapFunctionPeriodic
    };
    let domain_ports = [
        at.domainMin,
        at.domainMax,
        at.domainMinClosed,
        at.domainMaxClosed,
    ];
    let [xmin, xmax, samples] = function_curve(
        ctx,
        &mut wiring,
        parts.plain,
        [at.expr, at.variable],
        domain_ports,
        [at.xmin, at.xmax],
    );
    let [d0, d1, d2, d3] = parts.domain;
    wiring.set_public(Props {
        expr: Wire::computed(OpSpec::Sym(kind), vec![of, at.lowerValue, at.upperValue]),
        lowerValue: bound(attrs.lowerValue, attr::lowerValue, 0.0),
        upperValue: bound(attrs.upperValue, attr::upperValue, 1.0),
        variable: parts.variable,
        domainMin: d0,
        domainMax: d1,
        domainMinClosed: d2,
        domainMaxClosed: d3,
        xmin,
        xmax,
        curve: Wire::constant(1.0),
        samples,
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "function_operators.spec.rs"]
mod spec;
