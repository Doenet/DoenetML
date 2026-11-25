//! `<ray>`: its definition and its planner. A ray is given by any two of
//! its endpoint, a point it passes through and its direction (`pair.rs`).

use super::pair::{PairGiven, plan_pair};
use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<ray endpoint="(1,2)" through="(3,4)"/>`, or with a `direction`:
    /// its endpoint, a point it passes through, and the direction from the
    /// first to the second.
    tags: ["ray"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        // A whole-ray drag requests both points.
        endpointX: by_planner { interactive, rendered },
        endpointY: by_planner { interactive, rendered },
        throughX: by_planner { interactive, rendered },
        throughY: by_planner { interactive, rendered },
        directionX: by_planner,
        directionY: by_planner,
    }
    combined_props {
        endpoint: [endpointX, endpointY],
        through: [throughX, throughY],
        direction: [directionX, directionY],
    }
    alternate_names {
        endpointX1: endpointX,
        endpointX2: endpointY,
        throughX1: throughX,
        throughX2: throughY,
        directionX1: directionX,
        directionX2: directionY,
    }
    // A point constrained to it is moved onto it (ADR 0080).
    // Its style overrides (ADR 0084), over its style's.
    presentation { lineStyle, lineWidth }
    constrain_target { ports: [endpointX, endpointY, throughX, throughY], shape: Ray }
    attributes {
        endpoint: Point,
        through: Point,
        direction: Point,
    }
    params {
        // The endpoint and direction when not given: (0, 0) and (1, 0).
        ENDPOINTX, ENDPOINTY, DIRECTIONX, DIRECTIONY,
    }
    children: None,
    planner: Plan(plan),
}

/// Plans a ray from any two of `endpoint`, `through` and `direction`;
/// given all three, `through` is ignored, as in the current core.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let attrs = Attrs::of(ctx.record());
    let point = |p: Option<PointAttr>, a: Attr| -> Result<Option<[Wire; 2]>> {
        Ok(match p {
            Some(p) => Some(Wire::point(&p.point()?, a, 0)),
            None => None,
        })
    };
    let given = PairGiven {
        start: point(attrs.endpoint, attr::endpoint)?,
        end: point(attrs.through, attr::through)?,
        offset: point(attrs.direction, attr::direction)?,
        start_default: Wire::point_or_default(
            None,
            attr::endpoint,
            0,
            ([param::ENDPOINTX, param::ENDPOINTY], [0.0, 0.0]),
        ),
        offset_default: Wire::point_or_default(
            None,
            attr::direction,
            0,
            ([param::DIRECTIONX, param::DIRECTIONY], [1.0, 0.0]),
        ),
    };
    let mut wiring = ElemWiring::of(ComponentType::Ray);
    let [ex, ey, tx, ty, dx, dy] = plan_pair(
        ctx,
        &mut wiring,
        [
            at.endpointX,
            at.endpointY,
            at.throughX,
            at.throughY,
            at.directionX,
            at.directionY,
        ],
        given,
        (
            "doenet-w0005",
            "Ray is prescribed by through, endpoint, and direction.  Ignoring specified through.",
        ),
    );
    wiring.set_planned(Planned {
        endpointX: ex,
        endpointY: ey,
        throughX: tx,
        throughY: ty,
        directionX: dx,
        directionY: dy,
    });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "ray.spec.rs"]
mod spec;
