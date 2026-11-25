//! `<equilibriumCurve stable="false" through="(1,2) (3,4)"/>`: a curve of
//! a dynamical system that is stable or not, planned as a `<curve>`
//! (ADR 0049). A renderer draws it solid when stable and dashed when not;
//! with `switchable`, a click switches it.

use super::curve::{self as plain, plan_curve};
use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// A curve with a 0/1 `stable` (1 by default), which the renderer's
    /// switch requests.
    tags: ["equilibriumCurve"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        // A curve's props, then `stable`.
        curveType: by_planner { rendered },
        parMin: by_planner { rendered },
        parMax: by_planner { rendered },
        xmin: by_planner { rendered },
        xmax: by_planner { rendered },
        curve: by_planner { rendered },
        parametric: by_planner { rendered },
        samples: by_planner { rendered, sampled: curve },
        samplesX: by_planner { rendered, sampled: parametric },
        // A boolean in the current core; here a 0/1 cell.
        stable: by_planner { interactive, rendered },
    }
    list {
        names: [throughPoints, through],
        item: throughPoint,
        coords: [throughX, throughY],
        alternate_name: throughPointX,
        attribute: through,
        interactive: true,
        rendered: true,
    }
    // Whether a click switches it: read by the renderer from the
    // literal attribute.
    presentation { switchable, lineWidth, fillOpacity, fillPatternOpacity, fillStyle }
    attributes {
        through: Points,
        parMin: Scalar,
        parMax: Scalar,
        variable: Math,
        splineTension: Number(0.8),
        splineForm: Text,
        stable: Flag(true),
    }
    children: Math { functions: [Function], controls: [BezierControls] },
    planner: Plan(plan),
}

// Planned as a curve, whose table and attributes it starts with.
const _: () = {
    assert!(
        Props::AT.samplesX == plain::Props::AT.samplesX
            && Props::AT.stable == plain::Props::AT.samplesX + 1,
        "an equilibrium curve's props must start as a curve's"
    );
    assert!(
        attr::through.index() == plain::attr::through.index()
            && attr::splineForm.index() == plain::attr::splineForm.index(),
        "an equilibrium curve's attributes must start as a curve's"
    );
};

/// Plans it as a curve, with `stable` a 0/1 cell.
fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let stable = Attrs::of(ctx.record()).stable;
    let stable = Wire::scalar(stable, GivenId::Attr(attr::stable, 0));
    let (mut wiring, wires) = plan_curve(ctx, ComponentType::EquilibriumCurve)?;
    wires.finish(&mut wiring, [stable]);
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "equilibrium_curve.spec.rs"]
mod spec;
