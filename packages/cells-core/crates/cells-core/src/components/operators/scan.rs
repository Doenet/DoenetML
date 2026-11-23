//! `<cumulativeSum>`, `<cumulativeProduct>`, `<cumulativeMin>`,
//! `<cumulativeMax>` and `<differences>`, which share their table: a list
//! of numbers over the prefixes of their children read as a list (ADR
//! 0041), one operand per text piece and per reference, as the current
//! core's scan operators (`MathListOperators.js`) compute numerically.

use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentDef, ComponentType};
use crate::error::Result;
use crate::limits::byte;
use crate::program::{Scan, VecOp};

component! {
    /// `<cumulativeSum>30 45 12</cumulativeSum>`: the running sums of its
    /// operands, each a number or a reference, as a list of numbers
    /// (`numbers`, `number1`, ...) as long as its operands. A request
    /// cannot change an entry, as in the current core.
    tags: ["cumulativeSum"],
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: by_planner { rendered },
    }
    list {
        names: [numbers, values],
        item: number,
        values: number of Number,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    children: List,
    planner: Plan(plan),
}

/// `<cumulativeProduct>`: the running products of its operands.
pub(crate) const CUMULATIVE_PRODUCT: ComponentDef = DEFINITION.with_tags(&["cumulativeProduct"]);
/// `<cumulativeMin>`: the running minima of its operands.
pub(crate) const CUMULATIVE_MIN: ComponentDef = DEFINITION.with_tags(&["cumulativeMin"]);
/// `<cumulativeMax>`: the running maxima of its operands.
pub(crate) const CUMULATIVE_MAX: ComponentDef = DEFINITION.with_tags(&["cumulativeMax"]);
/// `<differences>`: each operand less the one before it, one fewer than
/// its operands.
pub(crate) const DIFFERENCES: ComponentDef = DEFINITION.with_tags(&["differences"]);

/// What a type of this table computes over its operands' prefixes.
fn scan(ty: ComponentType) -> Scan {
    match ty {
        ComponentType::CumulativeSum => Scan::Sum,
        ComponentType::CumulativeProduct => Scan::Product,
        ComponentType::CumulativeMin => Scan::Min,
        ComponentType::CumulativeMax => Scan::Max,
        ComponentType::Differences => Scan::Differences,
        _ => unreachable!("<{}> is not planned by this table", ty.tag()),
    }
}

/// Its entries: the outputs of one instruction over a hidden port per
/// operand ([`operands`]). With no operand (or, for `<differences>`, one)
/// it has no entries.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let pieces = Attrs::of(ctx.record()).children;
    let op = VecOp::Scan {
        op: scan(ty),
        n: byte(pieces.len().min(u8::MAX as usize)),
    };
    let n = if pieces.is_empty() { 0 } else { op.n_out() };
    let mut wiring = ElemWiring::with_list(ty, n);
    if n > 0 {
        let args = operands(ctx, &mut wiring, pieces, PieceKind::Number, false)?;
        let head = wiring.entry(0);
        wiring.set_entries(ElemWiring::vector_from(head, op, args, &[]));
    }
    wiring.set_public(Props {
        numComponents: Wire::constant(n as f64),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "scan.spec.rs"]
mod spec;
