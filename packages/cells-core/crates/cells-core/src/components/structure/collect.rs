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
    presentation { asList }
    planner: Whole(plan),
}

pub const COUNT: usize = Props::AT.count;

/// The type a `<collect>` collects, from the text of its `componentType`
/// (none when it has no literal one). Outlining reads it, once, so a
/// reference indexing the collect knows what it names before anything is
/// planned (ADR 0029).
pub(crate) fn collected_type(type_text: Option<String>) -> Result<ComponentType> {
    let type_text = type_text.ok_or(Error::BadCollect)?;
    ComponentType::from_tag(type_text.trim())
        .filter(|k| k.copyable())
        .ok_or_else(|| Error::BadCollectType(type_text.trim().into()))
}

/// What it collects is resolved when it expands: the components of the
/// type outlining read (`collected_type`) under what `from` names.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    let d = ctx.dast();
    let el = ctx.node();
    let from = d
        .attr(el, "from")
        .and_then(|a| ctx.single_macro(a))
        .ok_or(Error::BadCollect)?;
    let p = ctx.reference(from)?;
    if ctx.names_prop(p) {
        return Err(Error::BadCollect);
    }
    ctx.collect(p);
    Ok(())
}
