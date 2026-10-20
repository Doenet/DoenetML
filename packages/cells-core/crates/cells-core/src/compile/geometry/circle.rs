//! `<circle>`: from any combination of `center`, `radius` and `through`.

use super::*;
use crate::components::prop::circle;

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

impl Compiler<'_> {
    pub(in crate::compile) fn plan_circle(
        &mut self,
        t: TemplateId,
        e: ElemId,
        base: Option<NodeId>,
    ) -> Result<ElemPlan> {
        let d = self.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let at = circle::Props::AT;
        let nan = || Planned::fixed(f64::NAN);
        let center = match self.attr_or_inherited(el, base, "center") {
            Some(a) => Some(match self.plan_point_attr(t, scope, a) {
                // Not a point (`center="A"`): no center.
                Err(Error::BadMath { .. }) if self.single_macro(a).is_none() => {
                    self.warn(el, INVALID_CENTER.0, INVALID_CENTER.1);
                    PointPlan::Tuple([SourcePlan::Fixed(f64::NAN), SourcePlan::Fixed(f64::NAN)])
                }
                r => r?,
            }),
            None => None,
        };
        let radius = match self.attr_or_inherited(el, base, "radius") {
            Some(a) => Some(self.plan_scalar(t, scope, "radius", d.attr_children(a))?),
            None => None,
        };
        let through = match self.attr_or_inherited(el, base, "through") {
            Some(a) => self.plan_point_list(t, scope, a)?,
            None => Vec::new(),
        };
        let n = through.len();
        let (hc, hr) = (center.is_some(), radius.is_some());
        let mut ch = ElemPlan::of(ComponentType::Circle);
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
        let [
            [through_x1, through_y1],
            [through_x2, through_y2],
            [through_x3, through_y3],
        ] = std::array::from_fn(|i| match through.get(i) {
            Some(p) => planned_point(p, POINT_ROLES[i], "through"),
            None => [nan(), nan()],
        });
        let [center_x, center_y] = match &center {
            Some(c) => planned_point(c, [roles::CX, roles::CY], "center"),
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
                self.warn(el, code, message);
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
                vec![at.centerX, at.centerY, at.throughX1, at.throughY1],
            ),
            (None, false, _, 1) => {
                // The through point sits on top of the circle.
                let radius = radius_plan(&mut ch);
                [
                    Planned::own(at.throughX1),
                    Planned::computed(OpSpec::Sub, vec![at.throughY1, at.radius]),
                    radius,
                ]
            }
            (None, false, true, 2) => {
                let radius = radius_plan(&mut ch);
                let [cx, cy] = ElemPlan::vector(
                    [at.cx, at.cy],
                    VecOp::CircleTwoPointsRadius,
                    vec![
                        at.throughX1,
                        at.throughY1,
                        at.throughX2,
                        at.throughY2,
                        at.radius,
                    ],
                );
                [cx, cy, radius]
            }
            (None, false, false, n) => {
                let through_slots = [
                    at.throughX1,
                    at.throughY1,
                    at.throughX2,
                    at.throughY2,
                    at.throughX3,
                    at.throughY3,
                ];
                ElemPlan::vector(
                    [at.cx, at.cy, at.radius],
                    VecOp::CirclePoints { n: byte(n) },
                    through_slots[..2 * n].to_vec(),
                )
            }
            // A center with two or more points, a radius with three: `over`.
            (None, ..) => unreachable!("an over-determined circle is warned about above"),
        };
        ch.set_public(
            circle::Props {
                cx,
                cy,
                radius,
                diameter: table_prop(ComponentType::Circle, at.diameter),
                circumference: table_prop(ComponentType::Circle, at.circumference),
                area: Planned::computed(
                    OpSpec::Scale {
                        k: std::f64::consts::PI,
                    },
                    vec![r2],
                ),
                centerX: center_x,
                centerY: center_y,
                throughX1: through_x1,
                throughY1: through_y1,
                throughX2: through_x2,
                throughY2: through_y2,
                throughX3: through_x3,
                throughY3: through_y3,
                numThroughPoints: Planned::fixed(n as f64),
            }
            .into_vec(),
        );
        Ok(ch)
    }
}

/// A point's two coordinates as planned slots: a literal coordinate is
/// essential state with its role, given by `attr`.
fn planned_point(p: &PointPlan, roles: [Role; 2], attr: &'static str) -> [Planned; 2] {
    std::array::from_fn(|j| match p.coord(j) {
        SourcePlan::Literal(v) => Planned::essential_from(roles[j], attr, v),
        other => other.into(),
    })
}

/// A prop the type's table computes from its other props, as the table
/// says.
fn table_prop(component_type: ComponentType, i: usize) -> Planned {
    match component_type.prop_defs()[i].from {
        PropFrom::Computed { op, args } => SourcePlan::from_def(op, &args).into(),
        _ => unreachable!(
            "{} is not computed by the table",
            component_type.prop_defs()[i].name
        ),
    }
}
