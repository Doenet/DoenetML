//! `<collect>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentType, ComponentTypeInfo, PropDef};
use crate::error::{Error, Result};

/// `<collect>`: its children are copies of the collected components.
pub(in crate::components) const COLLECT: ComponentTypeInfo = info(&["collect"], COLLECT_PROPS);

const COLLECT_PROPS: &[PropDef] = &props([attr("count", 0.0)]);

pub const COUNT: usize = at(COLLECT_PROPS, "count");

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
