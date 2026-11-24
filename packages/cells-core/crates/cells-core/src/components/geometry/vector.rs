//! `<vector>`: its definition and its planner. A vector is given by any two
//! of its tail, its head and its displacement (`pair.rs`); `(a, b)`
//! children are its displacement.

use super::pair::{PairGiven, plan_pair};
use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::program::VecOp;

component! {
    /// `<vector tail="(1,2)" head="(3,4)"/>`, `<vector>(2,2)</vector>`: its
    /// tail, its head, and the displacement `x`, `y` from the first to the
    /// second. Drawn as an arrow in a graph, and as its displacement
    /// elsewhere.
    tags: ["vector"],
    flags: [copyable, located],
    // `<vector extend="$r.direction"/>`: the value is its displacement
    // (ADR 0068).
    extend_value: Attr(displacement),
    props {
        // A whole-vector drag requests both points; an end's drag, that
        // end and the other where it is.
        tailX: by_planner { interactive, rendered },
        tailY: by_planner { interactive, rendered },
        headX: by_planner { interactive, rendered },
        headY: by_planner { interactive, rendered },
        // The displacement, shown outside a graph.
        x: by_planner { rendered },
        y: by_planner { rendered },
        magnitude: by_planner,
    }
    combined_props {
        tail: [tailX, tailY],
        head: [headX, headY],
        displacement: [x, y],
    }
    alternate_names {
        tailX1: tailX,
        tailX2: tailY,
        headX1: headX,
        headX2: headY,
        x1: x,
        x2: y,
    }
    // Whether a renderer lets an end be dragged.
    presentation { draggable, headDraggable, tailDraggable }
    attributes {
        tail: Point,
        head: Point,
        displacement: Point,
    }
    params {
        // The tail and displacement when not given: (0, 0) and (1, 0).
        TAILX, TAILY, DISPLACEMENTX, DISPLACEMENTY,
    }
    children: Math,
    planner: Plan(plan),
}

/// Plans a vector from any two of `tail`, `head` and `displacement` (or
/// its `(a, b)` children); given all three, `head` is ignored, as in the
/// current core.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let attrs = Attrs::of(ctx.record());
    let point = |p: Option<PointAttr>, a: Attr| -> Result<Option<[Wire; 2]>> {
        Ok(match p {
            Some(p) => Some(Wire::point(&p.point()?, a, 0)),
            None => None,
        })
    };
    let displacement = match (attrs.displacement, &attrs.children) {
        (Some(d), _) => Some(Wire::point(&d.point()?, attr::displacement, 0)),
        // The `(a, b)` children, which a copy then shares.
        (None, Some(nodes)) => {
            let p = GivenPoint::Tuple(ctx.tuple(nodes)?);
            Some(Wire::point_given(&p, |j| GivenId::Children(j as u32)))
        }
        (None, None) => None,
    };
    let given = PairGiven {
        start: point(attrs.tail, attr::tail)?,
        end: point(attrs.head, attr::head)?,
        offset: displacement,
        start_default: Wire::point_or_default(
            None,
            attr::tail,
            0,
            ([param::TAILX, param::TAILY], [0.0, 0.0]),
        ),
        offset_default: Wire::point_or_default(
            None,
            attr::displacement,
            0,
            ([param::DISPLACEMENTX, param::DISPLACEMENTY], [1.0, 0.0]),
        ),
    };
    let mut wiring = ElemWiring::of(ComponentType::Vector);
    let [tx, ty, hx, hy, x, y] = plan_pair(
        ctx,
        &mut wiring,
        [at.tailX, at.tailY, at.headX, at.headY, at.x, at.y],
        given,
        (
            "doenet-w0007",
            "Vector is prescribed by head, tail, and displacement.  Ignoring specified head.",
        ),
    );
    // The magnitude is a circle's radius about the tail through the head:
    // a request on it moves the head along the vector.
    let circle = wiring.hidden_vector(
        VecOp::CircleCenterPoint,
        vec![at.tailX, at.tailY, at.headX, at.headY],
    );
    wiring.set_planned(Planned {
        tailX: tx,
        tailY: ty,
        headX: hx,
        headY: hy,
        x,
        y,
        magnitude: Wire::own(circle[2]),
    });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "vector.spec.rs"]
mod spec;
