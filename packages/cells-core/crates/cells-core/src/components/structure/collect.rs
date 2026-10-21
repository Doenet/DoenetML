//! `<collect>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<collect>`: its children are copies of the collected components.
    tags: ["collect"],
    props {
        count: attr(0.0),
    }
    planner: Whole(plan),
}

pub const COUNT: usize = Props::AT.count;

/// What it collects is resolved when it expands: the components of type
/// `componentType` under what `from` names.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    let d = ctx.dast();
    let el = ctx.node();
    let from = d
        .attr(el, "from")
        .and_then(|a| ctx.single_macro(a))
        .ok_or(Error::BadCollect)?;
    let type_text = d
        .attr(el, "componentType")
        .and_then(|a| ctx.attr_text(a))
        .ok_or(Error::BadCollect)?;
    let ck = ComponentType::from_tag(type_text.trim())
        .filter(|k| k.copyable())
        .ok_or_else(|| Error::BadCollectType(type_text.trim().into()))?;
    let p = ctx.reference(from)?;
    if ctx.names_prop(p) {
        return Err(Error::BadCollect);
    }
    ctx.collect(p, ck);
    Ok(())
}
