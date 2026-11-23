//! `<and>`, `<or>`, `<xor>`, `<iff>` and `<implies>`, which share their
//! table: a boolean over their children read as a list (ADR 0041), one
//! operand per text piece (`true`, `false`) and per reference.

use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentDef, ComponentType};
use crate::error::Result;
use crate::limits::byte;
use crate::program::{Reduction, VecOp};

component! {
    /// `<and>true $b</and>`: true when every operand is. A missing operand
    /// (an entry past a list's end) is passed over, as in the current core,
    /// and a request cannot change it.
    tags: ["and"],
    flags: [copyable],
    text: Boolean(value),
    extend_value: Scalar(value),
    default_prop: value,
    props {
        value: by_planner { rendered },
    }
    children: List,
    planner: Plan(plan),
}

/// `<or>`: true when some operand is.
pub(crate) const OR: ComponentDef = DEFINITION.with_tags(&["or"]);
/// `<xor>`: true when exactly one operand is.
pub(crate) const XOR: ComponentDef = DEFINITION.with_tags(&["xor"]);
/// `<iff>`: true when every operand is as the first is.
pub(crate) const IFF: ComponentDef = DEFINITION.with_tags(&["iff"]);
/// `<implies>`: true when the first operand implies the second; of one
/// operand, its negation; of none, true; of more than two, false.
pub(crate) const IMPLIES: ComponentDef = DEFINITION.with_tags(&["implies"]);

/// What a type of this table computes of its operands.
fn reduction(ty: ComponentType) -> Reduction {
    match ty {
        ComponentType::And => Reduction::All,
        ComponentType::Or => Reduction::Any,
        ComponentType::Xor => Reduction::Xor,
        ComponentType::Iff => Reduction::Iff,
        ComponentType::Implies => Reduction::Implies,
        _ => unreachable!("<{}> is not planned by this table", ty.tag()),
    }
}

/// Its `value`: an instruction over a hidden port per operand
/// ([`operands`]); with none, what the connective gives of none.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let pieces = ctx.list_entries(Attrs::of(ctx.record()).children, f64::INFINITY)?;
    let mut wiring = ElemWiring::of(ty);
    let args = operands(ctx, &mut wiring, pieces, PieceKind::Boolean, false)?;
    let op = reduction(ty);
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
