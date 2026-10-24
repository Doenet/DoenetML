//! `<when>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<when>` inside an `<award>`: `value` is 1 while its condition holds,
    /// read against the answer's submitted responses. Planned with its answer.
    tags: ["when"],
    default_prop: value,
    props {
        value: by_planner,
    }
    planner: Whole(plan),
}

pub const VALUE: usize = Props::AT.value;

/// A when is planned by its answer; one elsewhere is not planned.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    if !ctx.is_planned() {
        return Err(Error::Unsupported("a <when> outside an <award>".into()));
    }
    Ok(())
}
