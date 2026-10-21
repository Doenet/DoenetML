//! `<conditionalContent>` and `<feedback>`: its definition and its
//! planner (ADR 0016). How a choice is planned is the machinery in
//! `compile/choice.rs`.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<conditionalContent>`, a reactive choice (ADR 0009). Its `choice` cell
    /// is the 1-based position of the first case whose condition holds, or 0.
    /// Its children are `Case` components. `<feedback condition>` is the same
    /// thing with one case: content shown while its condition holds.
    tags: ["conditionalContent", "feedback"],
    props {
        // `hide` hides what the choice shows, not copies of its names.
        choice: by_planner,
        hide: by_planner,
    }
    planner: Whole(plan),
}

pub const CHOICE: usize = Props::AT.choice;
pub const HIDE: usize = Props::AT.hide;

/// Plans the choice of the case whose condition holds.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    super::plan_choice(ctx)
}
