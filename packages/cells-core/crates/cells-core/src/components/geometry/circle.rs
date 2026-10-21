//! `<circle>`: its definition and its planner (ADR 0016). The table names
//! the props; `plan` decides, from which of `center`, `radius` and
//! `through` the author gave, which are essential state and which are
//! derived, and through which operators (ADR 0006). The operators' inverses
//! are in `program/vector.rs`.

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentType, ComponentTypeInfo, ListProp, PropDef};
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::VecOp;

/// `<circle>`: center and radius are derived or essential depending on
/// how the circle is specified (ADR 0006). `cx`, `cy`, `radius` are the
/// numerical center and radius; how they are produced depends on which of
/// `center`, `radius` and `through` the author gave (see `plan`).
pub(in crate::components) const CIRCLE: ComponentTypeInfo = info(&["circle"], CIRCLE_PROPS)
    .copyable()
    .views(&[
        ("center", &["centerX", "centerY"]),
        ("numericalCenter", &["cx", "cy"]),
    ])
    .list(ListProp {
        names: &["throughPoints"],
        item: "throughPoint",
        coords: ["throughX", "throughY"],
        alias: Some("throughPointX"),
    })
    .aliases(&[("centerX1", "centerX"), ("centerX2", "centerY")]);

/// The through points are the circle's list (`throughPoints`), after
/// these.
const CIRCLE_PROPS: &[PropDef] = &props([
    planned("cx"),
    planned("cy"),
    planned("radius"),
    computed("diameter", OpSpec::Scale { k: 2.0 }, &["radius"]),
    computed(
        "circumference",
        OpSpec::Scale {
            k: std::f64::consts::TAU,
        },
        &["radius"],
    ),
    planned("area"),
    // The center as a *reference*: the prescribed center when there is one
    // (so a point extending `$c.center` drags that point alone, as in the
    // current core), else the derived center.
    planned("centerX"),
    planned("centerY"),
    planned("numThroughPoints"),
]);

pub const NUM_THROUGH_POINTS: usize = at(CIRCLE_PROPS, "numThroughPoints");

typed_props!(CIRCLE_PROPS {
    cx,
    cy,
    radius,
    diameter,
    circumference,
    area,
    centerX,
    centerY,
    numThroughPoints,
} roles {
    // The center when it is the circle's own state, and the radius.
    CX, CY, R,
});

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
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemPlan> {
    let at = Props::AT;
    let nan = || Planned::fixed(f64::NAN);
    let center = match ctx.point("center") {
        // Not a point (`center="A"`): no center.
        Err(Error::BadMath { .. }) if !ctx.is_reference("center") => {
            ctx.warn(INVALID_CENTER.0, INVALID_CENTER.1);
            Some(PointPlan::Tuple([
                SourcePlan::Fixed(f64::NAN),
                SourcePlan::Fixed(f64::NAN),
            ]))
        }
        r => r?,
    };
    let radius = ctx.scalar("radius")?;
    let through = ctx.points("through")?;
    let n = through.len();
    let (hc, hr) = (center.is_some(), radius.is_some());
    // The list holds the points given, up to three; more is an error
    // of the author's, warned about below.
    let mut ch = ElemPlan::with_list(ComponentType::Circle, n.min(3));
    // The area goes through a hidden square.
    let r2 = ch.hidden(SourcePlan::computed(
        OpSpec::Mul,
        vec![at.radius, at.radius],
    ));
    // The radius shown is never negative; the prescribed radius, or an
    // essential one (1 by default), behind it receives the clamped value
    // (projection, ADR 0003).
    let radius_plan = |ch: &mut ElemPlan| -> Planned {
        let pres = ch.hidden_planned(match &radius {
            Some(SourcePlan::Literal(v)) => Planned::essential_from(roles::R, "radius", *v),
            Some(other) => other.clone().into(),
            None => Planned::essential(roles::R, 1.0),
        });
        Planned::computed(
            OpSpec::Clamp {
                lo: 0.0,
                hi: f64::INFINITY,
            },
            vec![pres],
        )
    };
    // Through points and the center-as-reference, for `$c.throughPoint1`
    // and `<point extend="$c.center">`. The prescribed center lives on
    // `centerX`/`centerY` and the cases read it from there; without one
    // they alias the derived center.
    let through_points: Vec<[Planned; 2]> = through
        .iter()
        .take(3)
        .enumerate()
        .map(|(i, p)| Planned::point(p, point_roles(i), "through"))
        .collect();
    // Coordinate `j` of through point `k` (0-based).
    let n_public = ch.n_public;
    let tp = |k: usize, j: usize| {
        ComponentType::Circle
            .list_slot(n_public, k + 1, j)
            .expect("a through point the circle holds")
    };
    let [center_x, center_y] = match &center {
        Some(c) => Planned::point(c, [roles::CX, roles::CY], "center"),
        None => [Planned::own(at.cx), Planned::own(at.cy)],
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
            ctx.warn(code, message);
            [nan(), nan(), nan()]
        }
        (None, _, _, 0) => {
            let [cx, cy] = if hc {
                [Planned::own(at.centerX), Planned::own(at.centerY)]
            } else {
                [
                    Planned::essential(roles::CX, 0.0),
                    Planned::essential(roles::CY, 0.0),
                ]
            };
            [cx, cy, radius_plan(&mut ch)]
        }
        (None, true, false, 1) => ElemPlan::vector(
            [at.cx, at.cy, at.radius],
            VecOp::CircleCenterPoint,
            vec![at.centerX, at.centerY, tp(0, 0), tp(0, 1)],
        ),
        (None, false, _, 1) => {
            // The through point sits on top of the circle.
            let radius = radius_plan(&mut ch);
            [
                Planned::own(tp(0, 0)),
                Planned::computed(OpSpec::Sub, vec![tp(0, 1), at.radius]),
                radius,
            ]
        }
        (None, false, true, 2) => {
            let radius = radius_plan(&mut ch);
            let [cx, cy] = ElemPlan::vector(
                [at.cx, at.cy],
                VecOp::CircleTwoPointsRadius,
                vec![tp(0, 0), tp(0, 1), tp(1, 0), tp(1, 1), at.radius],
            );
            [cx, cy, radius]
        }
        (None, false, false, n) => ElemPlan::vector(
            [at.cx, at.cy, at.radius],
            VecOp::CirclePoints { n: byte(n) },
            (0..n).flat_map(|k| [tp(k, 0), tp(k, 1)]).collect(),
        ),
        // A center with two or more points, a radius with three: `over`.
        (None, ..) => unreachable!("an over-determined circle is warned about above"),
    };
    ch.set_public(
        Props {
            cx,
            cy,
            radius,
            diameter: Planned::from_table(ComponentType::Circle, at.diameter),
            circumference: Planned::from_table(ComponentType::Circle, at.circumference),
            area: Planned::computed(
                OpSpec::Scale {
                    k: std::f64::consts::PI,
                },
                vec![r2],
            ),
            centerX: center_x,
            centerY: center_y,
            numThroughPoints: Planned::fixed(n as f64),
        }
        .into_vec(),
    );
    ch.set_list(through_points);
    Ok(ch)
}
