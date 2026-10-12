//! `<circle>`: from any combination of `center`, `radius` and `through`.

use super::*;
use crate::components::prop::circle;

impl Compiler<'_> {
    pub(in crate::build) fn plan_circle(
        &mut self,
        t: TemplateId,
        e: ElemId,
        base: Option<NodeId>,
    ) -> Result<ElemPlan> {
        let d = self.compiled.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let component_type = ComponentType::Circle;
        let center = match self.attr_or_inherited(el, base, "center") {
            Some(a) => Some(match self.plan_point_attr(t, scope, a) {
                // Not a point (`center="A"`): no center, as the current
                // core's warning case.
                Err(Error::BadMath { .. }) if self.single_macro(a).is_none() => {
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
        let mut ch = ElemPlan::new(component_type.prop_defs().len());
        // Computed public props (diameter, circumference) keep their defs;
        // area goes through a hidden square.
        for (i, def) in component_type.prop_defs().iter().enumerate() {
            if let PropFrom::Computed { op, args } = def.from {
                ch.set(i, SourcePlan::from_def(op, &args));
            }
        }
        let r2 = ch.hidden(SourcePlan::computed(
            OpSpec::Mul,
            vec![circle::RADIUS, circle::RADIUS],
        ));
        ch.set(
            circle::AREA,
            SourcePlan::computed(
                OpSpec::Scale {
                    k: std::f64::consts::PI,
                },
                vec![r2],
            ),
        );
        let (hc, hr) = (center.is_some(), radius.is_some());
        // The radius shown is never negative; the prescribed radius, or an
        // essential one (1 by default), behind it receives the clamped value
        // (projection, ADR 0003).
        let radius_plan = |ch: &mut ElemPlan| -> SourcePlan {
            let pres = match &radius {
                Some(SourcePlan::Literal(v)) => {
                    ch.from_attr("r", "radius");
                    ch.essential("r", *v)
                }
                Some(other) => ch.hidden(other.clone()),
                None => ch.essential("r", 1.0),
            };
            SourcePlan::computed(
                OpSpec::Clamp {
                    lo: 0.0,
                    hi: f64::INFINITY,
                },
                vec![pres],
            )
        };
        let nan = || SourcePlan::Fixed(f64::NAN);
        // Through points and the center-as-reference, for `$c.throughPoint1`
        // and `<point extend="$c.center">`.
        let through_slot = |i: usize, j: usize| circle::THROUGH_X1 + 2 * i + j;
        for (i, p) in through.iter().enumerate().take(3) {
            Self::set_point_with_roles(
                &mut ch,
                [through_slot(i, 0), through_slot(i, 1)],
                p,
                POINT_ROLES[i],
                "through",
            );
        }
        for i in through.len()..3 {
            ch.set(through_slot(i, 0), nan());
            ch.set(through_slot(i, 1), nan());
        }
        ch.set(circle::NUM_THROUGH_POINTS, SourcePlan::Fixed(n as f64));
        let (center_x, center_y) = (circle::CENTER_X, circle::CENTER_Y);
        let (tx1, ty1, tx2, ty2) = (
            through_slot(0, 0),
            through_slot(0, 1),
            through_slot(1, 0),
            through_slot(1, 1),
        );
        // The prescribed center lives on `centerX`/`centerY` and the cases
        // read it from there; without one they alias the derived center.
        match &center {
            Some(c) => {
                Self::set_point_with_roles(&mut ch, [center_x, center_y], c, ["cx", "cy"], "center")
            }
            None => {
                ch.set(center_x, SourcePlan::own(circle::CX));
                ch.set(center_y, SourcePlan::own(circle::CY));
            }
        }
        match (hc, hr, n) {
            // The current core warns and gives up on over-determined circles.
            (_, _, n) if n > 3 || (hc && hr && n >= 1) || (hc && n >= 2) || (hr && n >= 3) => {
                ch.set(circle::CX, nan());
                ch.set(circle::CY, nan());
                ch.set(circle::RADIUS, nan());
            }
            (_, _, 0) => {
                if hc {
                    ch.set(circle::CX, SourcePlan::own(center_x));
                    ch.set(circle::CY, SourcePlan::own(center_y));
                } else {
                    ch.set_essential(circle::CX, "cx", 0.0);
                    ch.set_essential(circle::CY, "cy", 0.0);
                }
                let r = radius_plan(&mut ch);
                ch.set(circle::RADIUS, r);
            }
            (true, false, 1) => {
                ch.set_vec(
                    circle::CX,
                    VecOp::CircleCenterPoint,
                    vec![center_x, center_y, tx1, ty1],
                );
            }
            (false, _, 1) => {
                // The through point sits on top of the circle.
                let r = radius_plan(&mut ch);
                ch.set(circle::RADIUS, r);
                ch.set(circle::CX, SourcePlan::own(tx1));
                ch.set(
                    circle::CY,
                    SourcePlan::computed(OpSpec::Sub, vec![ty1, circle::RADIUS]),
                );
            }
            (false, true, 2) => {
                let r = radius_plan(&mut ch);
                ch.set(circle::RADIUS, r);
                ch.set_vec(
                    circle::CX,
                    VecOp::CircleTwoPointsRadius,
                    vec![tx1, ty1, tx2, ty2, circle::RADIUS],
                );
            }
            (false, false, n) => {
                let args: Vec<usize> = (0..2 * n).map(|k| tx1 + k).collect();
                ch.set_vec(circle::CX, VecOp::CirclePoints { n: n as u8 }, args);
            }
            _ => unreachable!(),
        }
        Ok(ch)
    }
}
