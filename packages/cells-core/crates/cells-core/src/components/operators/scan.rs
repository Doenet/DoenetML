//! `<cumulativeSum>`, `<cumulativeProduct>`, `<cumulativeMin>`,
//! `<cumulativeMax>` and `<differences>`, which share their table: a list
//! of numbers over the prefixes of their children read as a list (ADR
//! 0041), one operand per text piece and per reference, as the current
//! core's scan operators (`MathListOperators.js`) compute numerically.

use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::ComponentDef;
use crate::components::define::*;
use crate::error::Result;
use crate::limits::byte;
use crate::program::{Scan, VecOp};

component! {
    /// `<cumulativeSum>30 45 12</cumulativeSum>`: the running sums of its
    /// operands, each a number or a reference, as a list of numbers
    /// (`numbers`, `number1`, ...) as long as its operands. A request
    /// cannot change an entry, as in the current core.
    tags: ["cumulativeSum"],
    variant: Scan::Sum,
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: list_len { rendered },
    }
    list {
        names: [numbers, values],
        item: number,
        values: number of Number, entries: children,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    children: List,
    planner: Plan(plan),
}

/// `<cumulativeProduct>`: the running products of its operands.
pub(crate) const CUMULATIVE_PRODUCT: ComponentDef =
    DEFINITION.variant(&["cumulativeProduct"], &Scan::Product);
/// `<cumulativeMin>`: the running minima of its operands.
pub(crate) const CUMULATIVE_MIN: ComponentDef = DEFINITION.variant(&["cumulativeMin"], &Scan::Min);
/// `<cumulativeMax>`: the running maxima of its operands.
pub(crate) const CUMULATIVE_MAX: ComponentDef = DEFINITION.variant(&["cumulativeMax"], &Scan::Max);
/// `<differences>`: each operand less the one before it, one fewer than
/// its operands.
pub(crate) const DIFFERENCES: ComponentDef = DEFINITION
    .variant(&["differences"], &Scan::Differences)
    .with_entries_less(1);

/// Its entries: the outputs of one instruction, the type's variant's scan,
/// over a hidden port per operand ([`operands`]). With no operand (or, for `<differences>`, one)
/// it has no entries.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let pieces = ctx.list_entries(Attrs::of(ctx.record()).children, f64::INFINITY)?;
    let op = VecOp::Scan {
        op: *ty.variant::<Scan>(),
        n: byte(pieces.len().min(u8::MAX as usize)),
    };
    let n = if pieces.is_empty() { 0 } else { op.n_out() };
    let mut wiring = ElemWiring::with_list(ty, n);
    if n > 0 {
        let args = operands(ctx, &mut wiring, pieces, PieceKind::Number, false)?;
        let head = wiring.entry(0);
        wiring.set_entries(ElemWiring::vector_from(head, op, args, &[]));
    }
    wiring.set_planned(Planned {});
    Ok(wiring)
}

#[cfg(test)]
#[path = "scan.spec.rs"]
mod spec;
