//! `<equilibriumLine>`: a line of a dynamical system that is stable or
//! not, planned as a line (`line.rs`). A renderer draws it solid when
//! stable and dashed when not; with `switchable`, a click switches it.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<equilibriumLine stable="false" through="(1,2) (3,4)"/>`: a line
    /// with a 0/1 `stable` (1 by default), which the renderer's switch
    /// requests.
    tags: ["equilibriumLine"],
    flags: [copyable, located],
    props {
        // A line's props (`line.rs`), then `stable`.
        x1: by_planner { rendered },
        y1: by_planner { rendered },
        x2: by_planner { rendered },
        y2: by_planner { rendered },
        slope: by_planner,
        xintercept: by_planner,
        yintercept: by_planner,
        coeffvar1: by_planner,
        coeffvar2: by_planner,
        coeff0: by_planner,
        basedOnDirection: by_planner { rendered },
        // A boolean in the current core; here a 0/1 cell.
        stable: by_planner { interactive, rendered },
    }
    list {
        names: [points, endpoints],
        item: point,
        points: [[x1, y1], [x2, y2]],
        // A whole-line drag requests both points.
        interactive: true,
    }
    // Whether a click switches it: read by the renderer from the literal
    // attribute.
    presentation { switchable, lineWidth }
    // A point constrained to it is projected onto it.
    constrain_target { ports: [x1, y1, x2, y2], shape: Line }
    attributes {
        through: Points,
        slope: Scalar,
        parallelTo: Point,
        perpendicularTo: Point,
        equation: Math,
        variables: Text,
        stable: Flag(true),
    }
    params {
        DIST,
        ESS1X, ESS1Y, ESS2X, ESS2Y,
    }
    children: Math,
    planner: Plan(plan),
}

// Planned as a line, whose table, attributes and parameters it starts
// with.
const _: () = {
    use super::line;
    assert!(
        Props::AT.x1 == line::Props::AT.x1
            && Props::AT.basedOnDirection == line::Props::AT.basedOnDirection
            && Props::AT.stable == line::Props::AT.basedOnDirection + 1,
        "an equilibrium line's props must start as a line's"
    );
    assert!(
        attr::through.index() == line::attr::through.index()
            && attr::slope.index() == line::attr::slope.index()
            && attr::parallelTo.index() == line::attr::parallelTo.index()
            && attr::perpendicularTo.index() == line::attr::perpendicularTo.index()
            && attr::equation.index() == line::attr::equation.index()
            && attr::variables.index() == line::attr::variables.index(),
        "an equilibrium line's attributes must start as a line's"
    );
};

/// Plans it as a line, with `stable` a 0/1 cell: a bare or literal flag,
/// or a bound cell, which a copy inherits.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let stable = Attrs::of(ctx.record()).stable;
    let stable = Wire::scalar(stable, GivenId::Attr(attr::stable, 0));
    super::line::plan_as(ctx, ComponentType::EquilibriumLine, [stable])
}

#[cfg(all(test, feature = "testing"))]
#[path = "equilibrium_line.spec.rs"]
mod spec;
