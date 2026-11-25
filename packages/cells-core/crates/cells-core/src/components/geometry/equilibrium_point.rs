//! `<equilibriumPoint>`: a point of a dynamical system that is stable or
//! not, planned as a point (`point.rs`). A renderer draws it filled when
//! stable and open when not; with `switchable`, a click switches it.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::tick::snap::Shape;

component! {
    /// `<equilibriumPoint stable="false" switchable>(4, 0)</equilibriumPoint>`:
    /// a point with a 0/1 `stable` (1 by default), which the renderer's
    /// switch requests.
    tags: ["equilibriumPoint"],
    flags: [copyable, located],
    default_prop: coords,
    props {
        x: by_planner { interactive, rendered },
        y: by_planner { interactive, rendered },
        hide: by_planner { rendered },
        // As a point's (ADR 0080, ADR 0070).
        constraintUsed: by_planner,
        draggable: by_planner { rendered },
        // A boolean in the current core; here a 0/1 cell.
        stable: by_planner { interactive, rendered },
    }
    combined_props {
        coords: [x, y],
    }
    // Whether a click switches it: read by the renderer from the literal
    // attribute.
    presentation { switchable, markerStyle, markerSize }
    sticky: Shape::Point,
    attributes {
        coords: Point,
        x: Scalar,
        y: Scalar,
        hide: Flag(false),
        draggable: Flag(true),
        xs: Scalars,
        stable: Flag(true),
    }
    children: Math {
        constraints: [
            ConstrainTo,
            ConstrainToGrid,
            AttractTo,
            AttractToGrid,
            ConstrainToGraph,
            ConstrainToInterior,
        ],
    },
    planner: Plan(plan),
}

// Planned as a point, whose table and attributes it starts with.
const _: () = assert!(
    Props::AT.x == super::point::X
        && Props::AT.y == super::point::Y
        && Props::AT.hide == super::point::HIDE
        && Props::AT.constraintUsed == super::point::Props::AT.constraintUsed
        && Props::AT.draggable == super::point::Props::AT.draggable
        && attr::coords.index() == super::point::attr::coords.index()
        && attr::x.index() == super::point::attr::x.index()
        && attr::y.index() == super::point::attr::y.index()
        && attr::hide.index() == super::point::attr::hide.index()
        && attr::draggable.index() == super::point::attr::draggable.index()
        && attr::xs.index() == super::point::attr::xs.index(),
    "an equilibrium point's props and attributes must start as a point's"
);

/// Plans it as a point, with `stable` a 0/1 cell: a bare or literal flag,
/// or a bound cell, which a copy inherits.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let stable = Attrs::of(ctx.record()).stable;
    let stable = Wire::scalar(stable, GivenId::Attr(attr::stable, 0));
    super::point::plan_as(ctx, ComponentType::EquilibriumPoint, [stable])
}

#[cfg(all(test, feature = "testing"))]
#[path = "equilibrium_point.spec.rs"]
mod spec;
