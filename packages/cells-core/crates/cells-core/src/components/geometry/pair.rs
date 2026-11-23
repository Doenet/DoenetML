//! What a ray and a vector share: two points and the offset between them,
//! given by any two of a start, an end and an offset (a ray's endpoint,
//! through point and direction; a vector's tail, head and displacement).

use crate::compile::api::*;
use crate::program::{OpSpec, PairBy, VecOp};

/// What the author gave of a two-point shape, each point's wires as its
/// attribute plans them, and the defaults of the start and the offset.
pub(super) struct PairGiven {
    /// The first point (a ray's endpoint, a vector's tail).
    pub start: Option<[Wire; 2]>,
    /// The second point (a ray's through point, a vector's head).
    pub end: Option<[Wire; 2]>,
    /// The offset from the first to the second (a direction, a
    /// displacement).
    pub offset: Option<[Wire; 2]>,
    /// The first point when neither it nor the end and offset are given.
    pub start_default: [Wire; 2],
    /// The offset when neither it nor the end is given.
    pub offset_default: [Wire; 2],
}

/// The wires of a two-point shape's start, end and offset ports, `[sx, sy,
/// ex, ey, ox, oy]`, the start's and end's consecutive, as the current core
/// makes them from what was given:
///
/// - an offset with a start: the end follows (an end given too is ignored,
///   warned about as `overprescribed`);
/// - an offset with an end: the start follows;
/// - an end, with a start or its default: the offset follows;
/// - otherwise the start (or its default) and the offset's default.
///
/// The end follows the start and offset through one `Pair` instruction, so
/// a drag of both points keeps them where they were asked, and a drag of
/// the start alone keeps the offset, as the current core's updates do.
pub(super) fn plan_pair(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    ports: [Port; 6],
    given: PairGiven,
    overprescribed: (&'static str, &'static str),
) -> [Wire; 6] {
    let [sx, sy, ex, ey, ox, oy] = ports;
    let PairGiven {
        start,
        end,
        offset,
        start_default,
        offset_default,
    } = given;
    let pair = |wiring: &mut ElemWiring, p: [Wire; 2], by: PairBy| -> [Wire; 4] {
        let [px, py] = p.map(|w| wiring.hidden_wire(w));
        ElemWiring::vector([sx, sy, ex, ey], VecOp::Pair { by }, vec![px, py, ox, oy])
    };
    let (points, [o0, o1]) = match (offset, start, end) {
        (Some(o), Some(s), end) => {
            if end.is_some() {
                let _ = ctx.warn(overprescribed.0, overprescribed.1);
            }
            (pair(wiring, s, PairBy::Offset), o)
        }
        (Some(o), None, Some(e)) => (pair(wiring, e, PairBy::Back), o),
        (Some(o), None, None) => (pair(wiring, start_default, PairBy::Offset), o),
        // Both points are what was given; the offset is their difference,
        // and a request on it moves the end.
        (None, s, Some(e)) => {
            let [s0, s1] = s.unwrap_or(start_default);
            let [e0, e1] = e;
            let offset = [
                Wire::computed(OpSpec::Sub, vec![ex, sx]),
                Wire::computed(OpSpec::Sub, vec![ey, sy]),
            ];
            ([s0, s1, e0, e1], offset)
        }
        (None, s, None) => (
            pair(wiring, s.unwrap_or(start_default), PairBy::Offset),
            offset_default,
        ),
    };
    let [s0, s1, e0, e1] = points;
    [s0, s1, e0, e1, o0, o1]
}
