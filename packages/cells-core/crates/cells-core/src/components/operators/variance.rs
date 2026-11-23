//! `<variance>` and `<standardDeviation>`, which share their table: a
//! sample's or a population's spread of their children read as a list
//! (ADR 0041).

use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentDef, ComponentType};
use crate::error::Result;
use crate::limits::byte;
use crate::program::{Reduction, VecOp};

component! {
    /// `<variance population>1 2 $a</variance>`: the variance of its
    /// operands, a sample's unless `population` holds; with none, no value.
    /// A request cannot change it, as in the current core.
    tags: ["variance"],
    flags: [copyable],
    text: Number(value),
    extend_value: Scalar(value),
    default_prop: value,
    props {
        population: by_planner,
        value: by_planner { rendered },
        anchorX: anchor(0),
        anchorY: anchor(1),
    }
    attributes {
        population: Flag(false),
    }
    children: List,
    planner: Plan(plan),
}

/// `<standardDeviation>`: the square root of the variance.
pub(crate) const STANDARD_DEVIATION: ComponentDef = DEFINITION.with_tags(&["standardDeviation"]);

/// Its `value`: an instruction over `population` and a hidden port per
/// operand ([`operands`]).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    let mut wiring = ElemWiring::of(ty);
    let pieces = ctx.list_entries(attrs.children, f64::INFINITY)?;
    let args = operands(ctx, &mut wiring, pieces, PieceKind::Number, false)?;
    let value = if args.is_empty() {
        Wire::absent()
    } else {
        let op = VecOp::Reduce {
            op: if ty == ComponentType::Variance {
                Reduction::Variance
            } else {
                Reduction::StandardDeviation
            },
            n: byte(args.len() + 1),
        };
        let inputs = std::iter::once(Props::PORTS.population)
            .chain(args)
            .collect();
        Source::vector(op, inputs).into()
    };
    wiring.set_public(Props {
        population: Wire::scalar(attrs.population, GivenId::Attr(attr::population, 0)),
        value,
        // Planned after this, from the element's `anchor` (`plan_anchor`).
        anchorX: Wire::absent(),
        anchorY: Wire::absent(),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "variance.spec.rs"]
mod spec;
