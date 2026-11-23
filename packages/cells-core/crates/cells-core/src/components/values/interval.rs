//! `<interval>`: a math whose tuples and arrays of two are intervals.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<interval>`: a `<math>` with `createIntervals` always on (ADR 0041,
    /// decision 8): `(a, b)` is the open interval, `[a, b]` the closed one,
    /// `(a, b]` and `[a, b)` as written. Its text is one expression,
    /// never a point.
    tags: ["interval"],
    flags: [copyable],
    text: Math(expr, value),
    settle: FromMathText(settled_type),
    extend_value: Expr(super::math::extended),
    default_prop: value,
    props {
        // Set by the builder from its children, as a math's are.
        expr: children { rendered, expr_of: expr },
        value: children { rendered, expr_of: expr },
        ..anchor
    }
    attributes {
        expand: On,
        simplify: On,
        createVectors: On,
    }
    children: Math,
    planner: Plan(plan),
}

/// An interval is one expression whatever its text.
fn settled_type(_: &[Token]) -> ComponentType {
    ComponentType::Interval
}

fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ParsedMath::Expr(id) = ctx.parsed_math()? else {
        return Err(Error::Internal("an interval is one expression".into()));
    };
    let attrs = Attrs::of(ctx.record());
    let post =
        super::math::post_of(attrs.expand, attrs.simplify).with_shapes(attrs.createVectors, true);
    Ok(super::math::wiring_of_type(
        ComponentType::Interval,
        id,
        post,
    ))
}

#[cfg(test)]
#[path = "interval.spec.rs"]
mod spec;
