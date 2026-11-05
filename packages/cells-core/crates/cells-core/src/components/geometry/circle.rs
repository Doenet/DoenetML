//! `<circle>`: its definition and its planner, which decides from which of
//! `center`, `radius` and `through` the author gave which props are
//! essential state and which are derived.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::VecOp;
use std::f64::consts::TAU;

component! {
    /// `<circle>`: `cx`, `cy`, `radius` are the numerical center and radius,
    /// derived or essential depending on which of `center`, `radius` and
    /// `through` the author gave. The through points are its list, after
    /// these props.
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
    // A point constrained to a circle is projected onto it.
    constrain_target { ports: [cx, cy, radius], op: ProjectCircle }
    attributes {
        center: Point,
        radius: Scalar,
        through: Points(3),
    }
    children: None,
    planner: Plan(plan),
}

/// Why a circle cannot be what its attributes ask: warning code and
/// message.
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
    let at = Props::PORTS;
    let attrs = Attrs::of(ctx.record());
    let center = match attrs.center {
        // Not a point (`center="A"`): no center.
        Some(PointAttr::NotAPoint(Error::BadMath { .. })) => {
            let w = ctx.warn(INVALID_CENTER.0, INVALID_CENTER.1);
            Some(GivenPoint::Tuple([
                Source::undefined(w),
                Source::undefined(w),
            ]))
        }
        Some(p) => Some(p.point()?),
        None => None,
    };
    let radius = attrs.radius;
    let through = attrs.through;
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
            Some(source) => Wire::scalar(source.clone(), GivenId::Attr(attr::radius, 0)),
            None => Wire::given_by(attr::radius, 1.0),
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
        .map(|(i, p)| Wire::point(p, attr::through, i))
        .collect();
    // Coordinate `j` of through point `k` (0-based): a port of the list.
    let tps: Vec<[Port; 2]> = wiring.items().collect();
    let tp = |k: usize, j: usize| tps[k][j];
    let [center_x, center_y] = match &center {
        Some(c) => Wire::point(c, attr::center, 0),
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
                    Wire::given(GivenId::Attr(attr::center, 0), 0.0),
                    Wire::given(GivenId::Attr(attr::center, 1), 0.0),
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
        numThroughPoints: Wire::constant(n as f64),
    });
    wiring.set_list(through_points);
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "circle.spec.rs"]
mod spec;
