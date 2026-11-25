//! `<vector>`: its definition and its planner. A vector is given by any two
//! of its tail, its head and its displacement (`pair.rs`); `(a, b)`
//! children are its displacement.

use super::pair::{PairGiven, plan_pair};
use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::VecOp;

component! {
    /// `<vector tail="(1,2)" head="(3,4)"/>`, `<vector>(2,2)</vector>`: its
    /// tail, its head, and the displacement `x`, `y` from the first to the
    /// second. Drawn as an arrow in a graph, and as its displacement
    /// elsewhere.
    tags: ["vector"],
    flags: [copyable, located],
    // `<vector extend="$r.direction"/>`: the value is its displacement
    // (ADR 0073).
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
        // What a drag may move (ADR 0070): the whole vector, its head
        // alone and its tail alone, 0/1 cells, each end's as given, else
        // the vector's.
        draggable: by_planner { rendered },
        headDraggable: by_planner { rendered },
        tailDraggable: by_planner { rendered },
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
    // A point constrained to it is moved onto the segment from its tail
    // to its head (ADR 0080).
    constrain_target { ports: [tailX, tailY, headX, headY], shape: Segment }
    attributes {
        tail: Point,
        head: Point,
        displacement: Point,
        // The displacement's coordinates, as `xs="3 4"` or each alone,
        // as the current core reads them (ADR 0080).
        x: Scalar,
        y: Scalar,
        xs: Scalars,
        draggable: Flag(true),
        headDraggable: OptFlag,
        tailDraggable: OptFlag,
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
    // The displacement: `displacement`, else the `(a, b)` children, else
    // `xs`, else `x` and `y`, a coordinate not given 0, as in the current
    // core.
    let displacement = match (attrs.displacement, &attrs.children) {
        (Some(d), _) => Some(Wire::point(&d.point()?, attr::displacement, 0)),
        // The `(a, b)` children, which a copy then shares.
        (None, Some(nodes)) => {
            let p = GivenPoint::Tuple(ctx.tuple(nodes)?);
            Some(Wire::point_given(&p, |j| GivenId::Children(j as u32)))
        }
        (None, None) if !attrs.xs.is_empty() => {
            let [x, y] = <[Source; 2]>::try_from(attrs.xs).map_err(|xs| {
                Error::Unsupported(format!("a vector with {} coordinates", xs.len()))
            })?;
            Some([
                Wire::scalar(x, GivenId::Attr(attr::xs, 0)),
                Wire::scalar(y, GivenId::Attr(attr::xs, 1)),
            ])
        }
        (None, None) if attrs.x.is_some() || attrs.y.is_some() => {
            let coord = |a: Attr, s: Option<Source>| {
                Wire::attr(a, s).unwrap_or_else(|| Wire::given_by(a, 0.0))
            };
            Some([coord(attr::x, attrs.x), coord(attr::y, attrs.y)])
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
    let [draggable, head_draggable] = super::drag::flags(
        attrs.draggable.clone(),
        attr::draggable,
        attrs.headDraggable,
        attr::headDraggable,
        at.draggable,
    );
    let tail_draggable =
        Wire::attr(attr::tailDraggable, attrs.tailDraggable).unwrap_or(Wire::own(at.draggable));
    wiring.set_planned(Planned {
        tailX: tx,
        tailY: ty,
        headX: hx,
        headY: hy,
        x,
        y,
        magnitude: Wire::own(circle[2]),
        draggable,
        headDraggable: head_draggable,
        tailDraggable: tail_draggable,
    });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "vector.spec.rs"]
mod spec;
