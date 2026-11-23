//! `<sum>`, `<product>`, `<mean>`, `<median>`, `<min>`, `<max>`, `<mod>`,
//! `<gcd>`, `<lcm>` and `<count>`, which share their table: a number over
//! their children read as a list (ADR 0041), one operand per text piece and
//! per reference.

use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentDef, ComponentType};
use crate::error::Result;
use crate::limits::byte;
use crate::program::{Reduction, VecOp};

component! {
    /// `<sum>1 2 $a</sum>`: the sum of its operands, each a number or a
    /// reference; with none, no value. A request cannot change it, as in
    /// the current core, except a `<min>` or `<max>` of one operand, which
    /// writes it.
    tags: ["sum"],
    flags: [copyable],
    text: Number(value),
    extend_value: Scalar(value),
    default_prop: value,
    props {
        value: by_planner { rendered },
    }
    children: List,
    planner: Plan(plan),
}

/// `<product>`: the product of its operands.
pub(crate) const PRODUCT: ComponentDef = DEFINITION.with_tags(&["product"]);
/// `<mean>`: the mean of its operands.
pub(crate) const MEAN: ComponentDef = DEFINITION.with_tags(&["mean"]);
/// `<median>`: the median of its operands.
pub(crate) const MEDIAN: ComponentDef = DEFINITION.with_tags(&["median"]);
/// `<min>`: the least of its operands.
pub(crate) const MIN: ComponentDef = DEFINITION.with_tags(&["min"]);
/// `<max>`: the greatest of its operands.
pub(crate) const MAX: ComponentDef = DEFINITION.with_tags(&["max"]);
/// `<mod>`: the first of its two operands mod the second.
pub(crate) const MOD: ComponentDef = DEFINITION.with_tags(&["mod"]);
/// `<gcd>`: the greatest common divisor of its integer operands.
pub(crate) const GCD: ComponentDef = DEFINITION.with_tags(&["gcd"]);
/// `<lcm>`: the least common multiple of its integer operands.
pub(crate) const LCM: ComponentDef = DEFINITION.with_tags(&["lcm"]);
/// `<count>`: how many operands it has.
pub(crate) const COUNT: ComponentDef = DEFINITION.with_tags(&["count"]);

/// What a type of this table computes of its operands.
fn reduction(ty: ComponentType) -> Reduction {
    match ty {
        ComponentType::Sum => Reduction::Sum,
        ComponentType::Product => Reduction::Product,
        ComponentType::Mean => Reduction::Mean,
        ComponentType::Median => Reduction::Median,
        ComponentType::Min => Reduction::Min,
        ComponentType::Max => Reduction::Max,
        ComponentType::Mod => Reduction::Mod,
        ComponentType::Gcd => Reduction::Gcd,
        ComponentType::Lcm => Reduction::Lcm,
        _ => unreachable!("<{}> is not planned by this table", ty.tag()),
    }
}

/// Its `value`: an instruction over a hidden port per operand
/// ([`operands`]). With no operand it has no value, as in the current
/// core; a `<count>` counts its pieces; a `<min>` or `<max>` of one operand
/// is that operand, so a request on it writes there, as the current core's
/// does when one operand can change (of several, this core writes none).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let pieces = ctx.list_entries(Attrs::of(ctx.record()).children, f64::INFINITY)?;
    let mut wiring = ElemWiring::of(ty);
    let value = if pieces.is_empty() {
        Wire::absent()
    } else if ty == ComponentType::Count {
        Wire::constant(pieces.len() as f64)
    } else {
        let single = pieces.len() == 1 && matches!(ty, ComponentType::Min | ComponentType::Max);
        let args = operands(ctx, &mut wiring, pieces, PieceKind::Number, single)?;
        if single {
            Wire::own(args[0])
        } else {
            let op = VecOp::Reduce {
                op: reduction(ty),
                n: byte(args.len()),
            };
            Source::vector(op, args).into()
        }
    };
    wiring.set_public(Props { value });
    Ok(wiring)
}

#[cfg(test)]
#[path = "fold.spec.rs"]
mod spec;
