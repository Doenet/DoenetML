//! `<endpoint>`: the endpoint of an interval, open or closed, planned as a
//! point (`point.rs`). A renderer draws it open or filled; with
//! `switchable`, a click switches it.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::tick::snap::Shape;

component! {
    /// `<endpoint open switchable>(4, 0)</endpoint>`: a point with a 0/1
    /// `open` (0 by default), which the renderer's switch requests.
    tags: ["endpoint"],
    flags: [copyable, located],
    default_prop: coords,
    props {
        x: by_planner { interactive, rendered },
        y: by_planner { interactive, rendered },
        hide: by_planner { rendered },
        // A boolean in the current core; here a 0/1 cell.
        open: by_planner { interactive, rendered },
    }
    combined_props {
        coords: [x, y],
    }
    // Whether a click switches it: read by the renderer from the literal
    // attribute.
    presentation { switchable }
    sticky: Shape::Point,
    attributes {
        coords: Point,
        x: Scalar,
        y: Scalar,
        hide: Flag(false),
        open: Flag(false),
    }
    children: Math {
        constraints: [ConstrainTo, ConstrainToGrid],
    },
    planner: Plan(plan),
}

// Planned as a point, whose table and attributes it starts with.
const _: () = assert!(
    Props::AT.x == super::point::X
        && Props::AT.y == super::point::Y
        && Props::AT.hide == super::point::HIDE
        && attr::coords.index() == super::point::attr::coords.index()
        && attr::x.index() == super::point::attr::x.index()
        && attr::y.index() == super::point::attr::y.index()
        && attr::hide.index() == super::point::attr::hide.index(),
    "an endpoint's props and attributes must start as a point's"
);

/// Plans it as a point, with `open` a 0/1 cell: a bare or literal flag, or
/// a bound cell, which a copy inherits.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let open = Attrs::of(ctx.record()).open;
    let open = Wire::scalar(open, GivenId::Attr(attr::open, 0));
    super::point::plan_as(ctx, ComponentType::Endpoint, [open])
}

#[cfg(all(test, feature = "testing"))]
#[path = "endpoint.spec.rs"]
mod spec;
