//! `<polyline>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<polyline vertices="$r">`: its children are copies of the points
    /// `vertices` names (a repeat's points, gathered as a `<collect>` does), so
    /// its length follows the repeat. `numVertices` counts them. Only drawn:
    /// dragging a polyline is not supported.
    tags: ["polyline"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        numVertices: by_planner,
    }
    planner: Whole(plan),
}

pub const NUM_VERTICES: usize = Props::AT.numVertices;

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
