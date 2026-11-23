//! `<and>`, `<or>`, `<xor>`, `<iff>` and `<implies>`, which share their
//! table: a boolean over their children read as a list (ADR 0041), one
//! operand per text piece (`true`, `false`) and per reference.

use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::ComponentDef;
use crate::components::define::*;
use crate::error::Result;
use crate::limits::byte;
use crate::program::{Reduction, VecOp};

component! {
    /// `<and>true $b</and>`: true when every operand is. A missing operand
    /// (an entry past a list's end) is passed over, as in the current core,
    /// and a request cannot change it.
    tags: ["and"],
    variant: Reduction::All,
    flags: [copyable],
    value: Boolean,
    props {
        value: by_planner { rendered },
    }
    children: List,
    planner: Plan(plan),
}

/// `<or>`: true when some operand is.
pub(crate) const OR: ComponentDef = DEFINITION.variant(&["or"], &Reduction::Any);
/// `<xor>`: true when exactly one operand is.
pub(crate) const XOR: ComponentDef = DEFINITION.variant(&["xor"], &Reduction::Xor);
/// `<iff>`: true when every operand is as the first is.
pub(crate) const IFF: ComponentDef = DEFINITION.variant(&["iff"], &Reduction::Iff);
/// `<implies>`: true when the first operand implies the second; of one
/// operand, its negation; of none, true; of more than two, false.
pub(crate) const IMPLIES: ComponentDef = DEFINITION.variant(&["implies"], &Reduction::Implies);

/// Its `value`: its connective, the type's variant, over a hidden port per
/// operand ([`operands`]); with none, what the connective gives of none.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let pieces = ctx.list_entries(Attrs::of(ctx.record()).children, f64::INFINITY)?;
    let mut wiring = ElemWiring::of(ty);
    let args = operands(ctx, &mut wiring, pieces, PieceKind::Boolean, false)?;
    let op = *ty.variant::<Reduction>();
    let value = if args.is_empty() {
        Wire::constant(op.eval(&[]))
    } else {
        let n = byte(args.len());
        Source::vector(VecOp::Reduce { op, n }, args).into()
    };
    wiring.set_planned(Planned { value });
    Ok(wiring)
}

#[cfg(test)]
#[path = "logic.spec.rs"]
mod spec;
