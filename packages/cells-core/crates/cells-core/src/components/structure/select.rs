//! `<select>`: its definition and its planner (ADR 0016). How a choice
//! is planned is the machinery in `compile/choice.rs`.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<select>`, a load-time choice: its children are the content of the
    /// options it picked, flattened like a repeat's iterations.
    tags: ["select"],
    props {
        hide: by_planner,
    }
    planner: Whole(plan),
}

/// Plans the options picked at load.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    super::plan_choice(ctx)
}
