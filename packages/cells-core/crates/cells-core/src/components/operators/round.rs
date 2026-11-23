//! `<round>`: its definition and its planner.

use super::over_math;
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;
use crate::program::Post;

component! {
    /// `<round numDecimals="2">x</round>`: its children rounded to
    /// `numDecimals` decimal places (0), or to `numDigits` significant
    /// digits when the author gives that, halves away from zero, as the
    /// current core's math engine rounds. Over math, every number in them
    /// so rounded, when the places or digits are a number as written (ADR
    /// 0043). A request on a number writes the asked value rounded to the
    /// children (the current core writes it unrounded).
    tags: ["round"],
    flags: [copyable],
    text: Math(expr, value),
    extend_value: Scalar(value),
    default_prop: value,
    props {
        operand: by_planner,
        expr: by_planner { rendered, expr_of: expr },
        numDecimals: by_planner,
        numDigits: by_planner,
        value: by_planner { rendered, expr_of: expr },
        anchorX: anchor(0),
        anchorY: anchor(1),
    }
    attributes {
        numDecimals: Scalar,
        numDigits: Scalar,
    }
    children: Value,
    planner: Plan(plan),
}

/// Rounded by significant digits when `numDigits` is written, else by
/// decimal places.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let at = Props::PORTS;
    // Over math, the places or digits as written: an integer.
    let whole = |s: &Source| over_math::literal(s).map(|v| v.round() as i32);
    let (op, by, post) = match &attrs.numDigits {
        Some(s) => (
            OpSpec::RoundDigits,
            at.numDigits,
            whole(s).map(Post::RoundDigits),
        ),
        None => (
            OpSpec::RoundDecimals,
            at.numDecimals,
            match &attrs.numDecimals {
                Some(s) => whole(s).map(Post::RoundDecimals),
                None => Some(Post::RoundDecimals(0)),
            },
        ),
    };
    let num_decimals = match attrs.numDecimals {
        Some(s) => Wire::scalar(s, GivenId::Attr(attr::numDecimals, 0)),
        None => Wire::constant(0.0),
    };
    let num_digits = match attrs.numDigits {
        Some(s) => Wire::scalar(s, GivenId::Attr(attr::numDigits, 0)),
        None => Wire::absent(),
    };
    over_math::plan_one_input(
        ctx,
        &attrs.children,
        [at.operand, at.expr],
        |x| Wire::computed(op, vec![x, by]),
        post,
        |w, [operand, expr, value]| {
            w.set_public(Props {
                operand,
                expr,
                numDecimals: num_decimals,
                numDigits: num_digits,
                value,
                // Planned after this, from the `anchor` (`plan_anchor`).
                anchorX: Wire::absent(),
                anchorY: Wire::absent(),
            })
        },
    )
}

#[cfg(test)]
#[path = "round.spec.rs"]
mod spec;
