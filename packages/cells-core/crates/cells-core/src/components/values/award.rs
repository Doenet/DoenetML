//! `<award>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<award credit="0.5">` inside an `<answer>`: `awarded` is `credit` when
    /// its `<when>` holds (or its content equals the submitted response), else
    /// 0. Planned with its answer (`plan_answer`).
    tags: ["award"],
    default_prop: awarded,
    props {
        credit: attr(1.0),
        awarded: by_planner,
    }
    planner: Whole(plan),
}

pub const CREDIT: usize = Props::AT.credit;
pub const AWARDED: usize = Props::AT.awarded;

/// An award is planned by its answer; one elsewhere has no plan.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    if !ctx.is_planned() {
        return Err(Error::Unsupported("an <award> outside an <answer>".into()));
    }
    Ok(())
}
