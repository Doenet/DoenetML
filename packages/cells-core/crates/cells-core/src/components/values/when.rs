//! `<when>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentTypeInfo, PropDef};
use crate::error::{Error, Result};

/// `<when>` inside an `<award>`: `value` is 1 while its condition holds,
/// read against the answer's submitted responses. Planned with its answer.
pub(in crate::components) const WHEN: ComponentTypeInfo =
    info(&["when"], WHEN_PROPS).default_prop("value");

const WHEN_PROPS: &[PropDef] = &props([planned("value")]);

pub const VALUE: usize = at(WHEN_PROPS, "value");

/// A when is planned by its answer; one elsewhere has no plan.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    if !ctx.is_planned() {
        return Err(Error::Unsupported("a <when> outside an <award>".into()));
    }
    Ok(())
}
