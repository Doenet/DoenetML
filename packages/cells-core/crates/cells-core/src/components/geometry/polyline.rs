//! `<polyline>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentType, ComponentTypeInfo, PropDef};
use crate::error::{Error, Result};

/// `<polyline vertices="$r">`: its children are copies of the points
/// `vertices` names (a repeat's points, gathered as a `<collect>` does),
/// so its length follows the repeat. `numVertices` counts them. Only
/// drawn: dragging a polyline is not supported.
pub(in crate::components) const POLYLINE: ComponentTypeInfo =
    info(&["polyline"], POLYLINE_PROPS).copyable();

const POLYLINE_PROPS: &[PropDef] = &props([by_planner("numVertices")]);

pub const NUM_VERTICES: usize = at(POLYLINE_PROPS, "numVertices");

/// Gathers the points under what `vertices` names, as
/// `<collect componentType="point">` would; `numVertices` is set when it
/// expands.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    let m = ctx
        .dast()
        .attr(ctx.node(), "vertices")
        .and_then(|a| ctx.single_macro(a))
        .ok_or_else(|| Error::Unsupported("<polyline> needs vertices=\"$name\"".into()))?;
    let p = ctx.reference(m)?;
    if ctx.names_prop(p) {
        return Err(Error::Unsupported(
            "<polyline vertices> must name a component holding points".into(),
        ));
    }
    ctx.collect(p, ComponentType::Point);
    Ok(())
}
