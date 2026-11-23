//! `<round>`: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<round numDecimals="2">x</round>`: its children rounded to
    /// `numDecimals` decimal places (0), or to `numDigits` significant
    /// digits when the author gives that, halves away from zero, as the
    /// current core's math engine rounds. A request writes the asked value
    /// rounded to the children (the current core writes it unrounded).
    tags: ["round"],
    flags: [copyable],
    text: Number(value),
    extend_value: Scalar(value),
    default_prop: value,
    props {
        operand: by_planner,
        numDecimals: by_planner,
        numDigits: by_planner,
        value: by_planner { rendered },
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
    let operand = super::value_operand(ctx, &attrs.children)?;
    let at = Props::PORTS;
    let (op, by) = match attrs.numDigits {
        Some(_) => (OpSpec::RoundDigits, at.numDigits),
        None => (OpSpec::RoundDecimals, at.numDecimals),
    };
    let mut wiring = ElemWiring::of(ComponentType::Round);
    wiring.set_public(Props {
        operand,
        numDecimals: match attrs.numDecimals {
            Some(s) => Wire::scalar(s, GivenId::Attr(attr::numDecimals, 0)),
            None => Wire::constant(0.0),
        },
        numDigits: match attrs.numDigits {
            Some(s) => Wire::scalar(s, GivenId::Attr(attr::numDigits, 0)),
            None => Wire::absent(),
        },
        value: Wire::computed(op, vec![at.operand, by]),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "round.spec.rs"]
mod spec;
