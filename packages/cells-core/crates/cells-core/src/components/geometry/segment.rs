//! `<lineSegment>`: its definition and its planner. Its two endpoints are
//! its own state, or the points `endpoints` names; a missing endpoint is
//! essential state at its default. With fewer than two endpoints, a
//! `midpoint`, `slope` or `length` places it instead, as the current core
//! does; its midpoint, slope and length are props a request may set.

use super::{DEFAULT_FIRST_POINT, DEFAULT_SECOND_POINT};
use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::program::VecOp;
use crate::tick::snap::Shape;

component! {
    /// `<lineSegment endpoints="$a $b">`.
    tags: ["lineSegment"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        x1: by_planner { rendered },
        y1: by_planner { rendered },
        x2: by_planner { rendered },
        y2: by_planner { rendered },
        // Its midpoint (a request translates it), slope (a request turns it
        // about its midpoint) and length (a request scales it about its
        // midpoint).
        mx: by_planner,
        my: by_planner,
        slope: by_planner,
        length: by_planner,
        // Whether a whole drag, and an endpoint's, may move it (ADR 0070).
        draggable: by_planner { rendered },
        endpointsDraggable: by_planner { rendered },
        // 1 when a midpoint, slope or length places it, so a renderer's
        // drag of one end asks for the other where it is, as the current
        // core's moveLineSegment does.
        basedOnSlopeOrMidpoint: by_planner { rendered },
    }
    combined_props {
        midpoint: [mx, my],
        // The current core's names of its two points.
        endpoint1: [x1, y1],
        endpoint2: [x2, y2],
    }
    list {
        names: [points, endpoints],
        item: point,
        points: [[x1, y1], [x2, y2]],
        // An endpoint drag requests one, a whole-segment drag both.
        interactive: true,
    }
    sticky: Shape::Open,
    // A point constrained to a segment is projected onto its line (as
    // the current core's segment is not yet clamped here).
    constrain_target { ports: [x1, y1, x2, y2], shape: Segment }
    attributes {
        endpoints: Points,
        midpoint: Point,
        slope: Scalar,
        length: Scalar,
        midpointOffset: Scalar,
        draggable: Flag(true),
        endpointsDraggable: OptFlag,
    }
    params {
        // A missing endpoint's coordinates.
        ESS1X, ESS1Y, ESS2X, ESS2Y,
        // The slope and signed length that place it when no attribute
        // gives them.
        SLOPE, LENGTH,
    }
    children: None,
    planner: Plan(plan),
}

/// The position of `x1`: the first endpoint's x-coordinate.
pub const X1: usize = Props::AT.x1;
/// The position of `y1`: the first endpoint's y-coordinate.
pub const Y1: usize = Props::AT.y1;
/// The position of `x2`: the second endpoint's x-coordinate.
pub const X2: usize = Props::AT.x2;
/// The position of `y2`: the second endpoint's y-coordinate.
pub const Y2: usize = Props::AT.y2;
// Read as (x, y) pairs by a sticky group, like a point's.
const _: () = assert!(
    Y1 == X1 + 1 && X2 == X1 + 2 && Y2 == X1 + 3,
    "a segment's endpoints must be x1 y1 x2 y2"
);

/// Plans a segment from its `endpoints`: the first two points it names,
/// each defaulted when missing. With fewer than two, a `midpoint`,
/// `slope` or `length` places it, as the current core's cases do: one
/// endpoint and the midpoint (`SegmentMirror`); else an anchor, the
/// endpoint, the midpoint or the origin, and a slope (0 by default) and
/// signed length (1) from it (`SegmentPolar`). `midpointOffset` says where
/// along the segment, from -1 at the first end to 1 at the second, the
/// given midpoint sits.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let attrs = Attrs::of(ctx.record());
    let ends = attrs.endpoints;
    let mut wiring = ElemWiring::of(ComponentType::LineSegment);
    let midpoint = attrs.midpoint.map(PointAttr::point).transpose()?;
    let placed = midpoint.is_some() || attrs.slope.is_some() || attrs.length.is_some();
    // Where the given midpoint sits along it, from 0 at the first end:
    // `(1 + midpointOffset) / 2`, the offset held in [-1, 1].
    let along = |wiring: &mut ElemWiring| -> Port {
        let Some(offset) = Wire::attr(attr::midpointOffset, attrs.midpointOffset.clone()) else {
            return wiring.hidden(Source::constant(0.5));
        };
        let offset = wiring.hidden_wire(offset);
        let low = wiring.hidden(Source::computed_k(OpSpec::Max, offset, -1.0));
        let held = wiring.hidden(Source::computed_k(OpSpec::Min, low, 1.0));
        let shifted = wiring.hidden(Source::computed_k(OpSpec::Add, held, 1.0));
        wiring.hidden(Source::computed_k(OpSpec::Mul, shifted, 0.5))
    };
    let placed = placed && ends.len() < 2;
    let [x1, y1, x2, y2] = match (ends.as_slice(), &midpoint) {
        (ends, _) if !placed => {
            let first = ([param::ESS1X, param::ESS1Y], DEFAULT_FIRST_POINT);
            let second = ([param::ESS2X, param::ESS2Y], DEFAULT_SECOND_POINT);
            let [x1, y1] = Wire::point_or_default(ends.first(), attr::endpoints, 0, first);
            let [x2, y2] = Wire::point_or_default(ends.get(1), attr::endpoints, 1, second);
            [x1, y1, x2, y2]
        }
        ([e1], Some(m)) => {
            let mut args = wiring.hidden_point_of(e1, attr::endpoints, 0).to_vec();
            args.extend(wiring.hidden_point_of(m, attr::midpoint, 0));
            args.push(along(&mut wiring));
            ends_of(VecOp::SegmentMirror, args)
        }
        (ends, m) => {
            let (anchor, t) = match (ends.first(), m) {
                (Some(e1), _) => (wiring.hidden_point_of(e1, attr::endpoints, 0), None),
                (None, Some(m)) => (wiring.hidden_point_of(m, attr::midpoint, 0), Some(())),
                (None, None) => {
                    let origin = ([param::ESS1X, param::ESS1Y], [0.0, 0.0]);
                    let p = Wire::point_or_default(None, attr::endpoints, 0, origin);
                    (p.map(|w| wiring.hidden_wire(w)), None)
                }
            };
            let slope = Wire::attr(attr::slope, attrs.slope.clone())
                .unwrap_or_else(|| Wire::param(param::SLOPE, 0.0));
            let length = Wire::attr(attr::length, attrs.length.clone())
                .unwrap_or_else(|| Wire::param(param::LENGTH, 1.0));
            let mut args = anchor.to_vec();
            args.push(wiring.hidden_wire(slope));
            args.push(wiring.hidden_wire(length));
            // An end is the anchor at 0; a midpoint sits where its offset
            // says.
            let t = match t {
                Some(()) => along(&mut wiring),
                None => wiring.hidden(Source::constant(0.0)),
            };
            args.push(t);
            ends_of(VecOp::SegmentPolar, args)
        }
    };
    let ends = vec![at.x1, at.y1, at.x2, at.y2];
    let [mx, my] = ElemWiring::vector([at.mx, at.my], VecOp::Centroid { n: 2 }, ends.clone());
    let [slope, length] = ElemWiring::vector([at.slope, at.length], VecOp::SegmentMeasures, ends);
    let [draggable, endpoints_draggable] = super::drag::flags(
        attrs.draggable,
        attr::draggable,
        attrs.endpointsDraggable,
        attr::endpointsDraggable,
        at.draggable,
    );
    wiring.set_planned(Planned {
        x1,
        y1,
        x2,
        y2,
        mx,
        my,
        slope,
        length,
        draggable,
        endpointsDraggable: endpoints_draggable,
        basedOnSlopeOrMidpoint: Wire::constant(if placed { 1.0 } else { 0.0 }),
    });
    Ok(wiring)
}

/// The segment's two ends as the outputs of `op` over `args`, at its own
/// endpoint ports.
fn ends_of(op: VecOp, args: Vec<Port>) -> [Wire; 4] {
    let at = Props::PORTS;
    ElemWiring::vector([at.x1, at.y1, at.x2, at.y2], op, args)
}

#[cfg(all(test, feature = "testing"))]
#[path = "segment.spec.rs"]
mod spec;
