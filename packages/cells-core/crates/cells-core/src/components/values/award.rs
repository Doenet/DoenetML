//! `<award>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentTypeInfo, PropDef};
use crate::error::{Error, Result};

/// `<award credit="0.5">` inside an `<answer>`: `awarded` is `credit`
/// when its `<when>` holds (or its content equals the submitted
/// response), else 0. Planned with its answer (`plan_answer`).
pub(in crate::components) const AWARD: ComponentTypeInfo =
    info(&["award"], AWARD_PROPS).default_prop("awarded");

const AWARD_PROPS: &[PropDef] = &props([attr("credit", 1.0), planned("awarded")]);

typed_props!(AWARD_PROPS { credit, awarded });

pub const CREDIT: usize = Props::AT.credit;
pub const AWARDED: usize = Props::AT.awarded;

/// An award is planned by its answer; one elsewhere has no plan.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    if !ctx.is_planned() {
        return Err(Error::Unsupported("an <award> outside an <answer>".into()));
    }
    Ok(())
}
