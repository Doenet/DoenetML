//! `<isBetween>`: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::program::{Reduction, VecOp};

component! {
    /// `<isBetween limits="1 5" strict>x</isBetween>`: true when its
    /// children lie between the two limits (either order), strictly when
    /// `strict` holds; false without both limits.
    tags: ["isBetween"],
    flags: [copyable],
    text: Boolean(value),
    extend_value: Scalar(value),
    default_prop: value,
    props {
        operand: by_planner,
        strict: by_planner,
        value: by_planner { rendered },
    }
    attributes {
        limits: Scalars,
        strict: Flag(false),
    }
    children: Value,
    planner: Plan(plan),
}

/// Its `value`: an instruction over its children, the first two limits in
/// hidden ports (a missing one absent), and `strict`.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let operand = super::value_operand(ctx, &attrs.children)?;
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(ComponentType::IsBetween);
    let mut limits = attrs
        .limits
        .into_iter()
        .map(Some)
        .chain(std::iter::repeat(None));
    let mut limit = |k: u32| {
        let wire = match limits.next().flatten() {
            Some(s) => Wire::scalar(s, GivenId::Attr(attr::limits, k)),
            None => Wire::absent(),
        };
        wiring.hidden_wire(wire)
    };
    let (lim1, lim2) = (limit(0), limit(1));
    let op = VecOp::Reduce {
        op: Reduction::Between,
        n: 4,
    };
    wiring.set_public(Props {
        operand,
        strict: Wire::scalar(attrs.strict, GivenId::Attr(attr::strict, 0)),
        value: Source::vector(op, vec![at.operand, lim1, lim2, at.strict]).into(),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "is_between.spec.rs"]
mod spec;
