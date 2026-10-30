//! `<circle>`: its definition and its planner (ADR 0016). The table names
//! the props; `plan` decides, from which of `center`, `radius` and
//! `through` the author gave, which are essential state and which are
//! derived, and through which operators (ADR 0006). The operators' inverses
//! are in `program/vector.rs`.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::VecOp;
use std::f64::consts::TAU;

component! {
    /// `<circle>`: center and radius are derived or essential depending on how
    /// the circle is specified (ADR 0006). `cx`, `cy`, `radius` are the
    /// numerical center and radius; how they are produced depends on which of
    /// `center`, `radius` and `through` the author gave (see `plan`). The
    /// through points are its list, after these props.
    tags: ["circle"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        // A whole-circle drag requests the center.
        cx: by_planner { interactive, rendered },
        cy: by_planner { interactive, rendered },
        radius: by_planner { rendered },
        diameter: computed(OpSpec::Mul, [radius, (2.0)]),
        circumference: computed(OpSpec::Mul, [radius, (TAU)]),
        area: by_planner,
        // The center as a *reference*: the prescribed center when there is
        // one (so a point extending `$c.center` drags that point alone, as
        // in the current core), else the derived center.
        centerX: by_planner,
        centerY: by_planner,
        numThroughPoints: by_planner,
    }
    combined_props {
        center: [centerX, centerY],
        numericalCenter: [cx, cy],
    }
    list {
        names: [throughPoints],
        item: throughPoint,
        coords: [throughX, throughY],
        alternate_name: throughPointX,
        attribute: through,
        max: 3,
        // The center's request moves them.
        interactive: true,
    }
    alternate_names {
        centerX1: centerX,
        centerX2: centerY,
    }
    attributes {
        center,
        radius,
        through,
    }
    shared_state {
        // The center when it is the circle's own state, and the radius.
        CX, CY, R,
    }
    planner: Plan(plan),
}

/// Why a circle cannot be what its attributes ask, as the current core's
/// warnings say it (codes of `packages/i18n/src/diagnostics.ts`).
const TOO_MANY_THROUGH: (&str, &str) = (
    "doenet-w0028",
    "Cannot calculate circle through more than 3 points.",
);
const RADIUS_CENTER_AND_THROUGH: (&str, &str) = (
    "doenet-w0029",
    "Cannot calculate circle with specified radius, center and through points.",
);
const CENTER_AND_THROUGH_POINTS: (&str, &str) = (
    "doenet-w0030",
    "Cannot calculate circle with specified center through more than 1 point.",
);
const RADIUS_AND_THROUGH_POINTS: (&str, &str) = (
    "doenet-w0032",
    "Cannot create circle through more than two points with a specified radius.",
);
const INVALID_CENTER: (&str, &str) = (
    "doenet-w0033",
    "Invalid center or through points of circle.",
);

/// Plans a circle from any combination of `center`, `radius` and
/// `through`.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::AT;
    let center = match ctx.point(attr::center) {
        // Not a point (`center="A"`): no center.
        Err(Error::BadMath { .. }) if !ctx.is_reference(attr::center) => {
            let w = ctx.warn(INVALID_CENTER.0, INVALID_CENTER.1);
            Some(GivenPoint::Tuple([
                Source::undefined(w),
                Source::undefined(w),
            ]))
        }
        r => r?,
    };
    let radius = ctx.scalar(attr::radius)?;
    let through = ctx.points(attr::through)?;
    let n = through.len();
    let (hc, hr) = (center.is_some(), radius.is_some());
    // The list holds the points given, up to three; more is an error
    // of the author's, warned about below.
    let mut wiring = ElemWiring::with_list(ComponentType::Circle, n.min(3));
    // The area goes through a hidden square.
    let r2 = wiring.hidden(Source::computed(OpSpec::Mul, vec![at.radius, at.radius]));
    // The radius shown is never negative; the prescribed radius, or an
    // essential one (1 by default), behind it receives the clamped value
    // (projection, ADR 0003).
    let radius_wire = |wiring: &mut ElemWiring| -> Wire {
        let pres = wiring.hidden_wire(match &radius {
            Some(Source::Literal(v)) => Wire::essential_from(shared_state::R, attr::radius, *v),
            Some(other) => other.clone().into(),
            None => Wire::essential(shared_state::R, 1.0),
        });
        Wire::from(Source::computed_k(OpSpec::Max, pres, 0.0))
    };
    // Through points and the center-as-reference, for `$c.throughPoint1`
    // and `<point extend="$c.center">`. The prescribed center lives on
    // `centerX`/`centerY` and the cases read it from there; without one
    // they alias the derived center.
    let through_points: Vec<[Wire; 2]> = through
        .iter()
        .take(3)
        .enumerate()
        .map(|(i, p)| Wire::point(p, shared_point_state(i), attr::through))
        .collect();
    // Coordinate `j` of through point `k` (0-based).
    let n_public = wiring.n_public;
    let tp = |k: usize, j: usize| {
        ComponentType::Circle
            .list_slot(n_public, k + 1, j)
            .expect("a through point the circle holds")
    };
    let [center_x, center_y] = match &center {
        Some(c) => Wire::point(c, [shared_state::CX, shared_state::CY], attr::center),
        None => [Wire::own(at.cx), Wire::own(at.cy)],
    };
    let over = if n > 3 {
        Some(TOO_MANY_THROUGH)
    } else if hc && hr && n >= 1 {
        Some(RADIUS_CENTER_AND_THROUGH)
    } else if hc && n >= 2 {
        Some(CENTER_AND_THROUGH_POINTS)
    } else if hr && n >= 3 {
        Some(RADIUS_AND_THROUGH_POINTS)
    } else {
        None
    };
    let [cx, cy, radius] = match (over, hc, hr, n) {
        (Some((code, message)), ..) => {
            let w = ctx.warn(code, message);
            [Wire::undefined(w), Wire::undefined(w), Wire::undefined(w)]
        }
        (None, _, _, 0) => {
            let [cx, cy] = if hc {
                [Wire::own(at.centerX), Wire::own(at.centerY)]
            } else {
                [
                    Wire::essential(shared_state::CX, 0.0),
                    Wire::essential(shared_state::CY, 0.0),
                ]
            };
            [cx, cy, radius_wire(&mut wiring)]
        }
        (None, true, false, 1) => ElemWiring::vector(
            [at.cx, at.cy, at.radius],
            VecOp::CircleCenterPoint,
            vec![at.centerX, at.centerY, tp(0, 0), tp(0, 1)],
        ),
        (None, false, _, 1) => {
            // The through point sits on top of the circle.
            let radius = radius_wire(&mut wiring);
            [
                Wire::own(tp(0, 0)),
                Wire::computed(OpSpec::Sub, vec![tp(0, 1), at.radius]),
                radius,
            ]
        }
        (None, false, true, 2) => {
            let radius = radius_wire(&mut wiring);
            let [cx, cy] = ElemWiring::vector(
                [at.cx, at.cy],
                VecOp::CircleTwoPointsRadius,
                vec![tp(0, 0), tp(0, 1), tp(1, 0), tp(1, 1), at.radius],
            );
            [cx, cy, radius]
        }
        (None, false, false, n) => ElemWiring::vector(
            [at.cx, at.cy, at.radius],
            VecOp::CirclePoints { n: byte(n) },
            (0..n).flat_map(|k| [tp(k, 0), tp(k, 1)]).collect(),
        ),
        // A center with two or more points, a radius with three: `over`.
        (None, ..) => unreachable!("an over-determined circle is warned about above"),
    };
    wiring.set_public(Props {
        cx,
        cy,
        radius,
        diameter: Wire::from_table(ComponentType::Circle, at.diameter),
        circumference: Wire::from_table(ComponentType::Circle, at.circumference),
        area: Source::computed_k(OpSpec::Mul, r2, std::f64::consts::PI).into(),
        centerX: center_x,
        centerY: center_y,
        numThroughPoints: Wire::fixed(n as f64),
    });
    wiring.set_list(through_points);
    Ok(wiring)
}
