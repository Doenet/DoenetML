//! `<conditionalContent>` and `<feedback>`: its definition and its
//! planner (ADR 0016). How a choice is planned is the machinery in
//! `compile/choice.rs`.

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentTypeInfo, PropDef};
use crate::error::Result;

/// `<conditionalContent>`, a reactive choice (ADR 0009). Its `choice` cell
/// is the 1-based position of the first case whose condition holds, or 0.
/// Its children are `Case` components. `<feedback condition>` is the same
/// thing with one case: content shown while its condition holds.
pub(in crate::components) const CONDITIONAL_CONTENT: ComponentTypeInfo = info(
    &["conditionalContent", "feedback"],
    CONDITIONAL_CONTENT_PROPS,
);

// `hide` hides what the choice shows, not copies of its names.
const CONDITIONAL_CONTENT_PROPS: &[PropDef] = &props([planned("choice"), planned("hide")]);

pub const CHOICE: usize = at(CONDITIONAL_CONTENT_PROPS, "choice");
pub const HIDE: usize = at(CONDITIONAL_CONTENT_PROPS, "hide");

/// Plans the choice of the case whose condition holds.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    super::plan_choice(ctx)
}
