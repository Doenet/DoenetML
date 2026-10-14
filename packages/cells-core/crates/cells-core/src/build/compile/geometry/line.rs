//! `<line>` and `<lineSegment>`: from points, an equation, or a point and a
//! slope or direction.

use super::*;
use crate::components::prop::{line, segment};

impl Compiler<'_> {
    /// Variable names of a line's equation (`variables="(s,t)"` or `"s t"`).
    pub(in crate::build) fn line_variables(
        &self,
        el: NodeId,
        base: Option<NodeId>,
    ) -> (String, String) {
        match self
            .attr_or_inherited(el, base, "variables")
            .and_then(|a| self.attr_text(a))
        {
            Some(text) => {
                let names: Vec<String> = text
                    .split(|c: char| !c.is_alphanumeric())
                    .filter(|s| !s.is_empty())
                    .map(str::to_string)
                    .collect();
                if names.len() == 2 {
                    (names[0].clone(), names[1].clone())
                } else {
                    ("x".into(), "y".into())
                }
            }
            None => ("x".into(), "y".into()),
        }
    }

    pub(in crate::build) fn plan_line(
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
        let component_type = ComponentType::Line;
        let mut ch = ElemPlan::new(component_type.prop_defs().len());
        let through = match self.attr_or_inherited(el, base, "through") {
            Some(a) => self.plan_point_list(t, scope, a)?,
            None => Vec::new(),
        };
        let slope = self.attr_or_inherited(el, base, "slope");
        let parallel = self.attr_or_inherited(el, base, "parallelTo");
        let perpendicular = self.attr_or_inherited(el, base, "perpendicularTo");
        let equation_attr = self.attr_or_inherited(el, base, "equation");
        let own_children = self.math_children(el);
        let base_children = base.map(|b| self.math_children(b)).unwrap_or_default();
        let equation_nodes: Option<Vec<NodeId>> = if let Some(a) = equation_attr {
            Some(d.attr_children(a).to_vec())
        } else if !own_children.is_empty() {
            Some(own_children)
        } else if !base_children.is_empty()
            && through.is_empty()
            && slope.is_none()
            && parallel.is_none()
            && perpendicular.is_none()
        {
            Some(base_children)
        } else {
            None
        };
        if through.len() > 2 {
            return Err(Error::Unsupported(
                "a line through more than two points".into(),
            ));
        }

        if let Some(nodes) = equation_nodes {
            // Equation mode: coefficients are the state, points follow.
            let (vx, vy) = self.line_variables(el, base);
            let (toks, text) = self.math_tokens(t, scope, &nodes)?;
            let sides = super::expr::split_top(&toks, &Token::Eq);
            if sides.len() != 2 {
                return Err(Error::BadMath {
                    text,
                    reason: "a line equation needs one '='".into(),
                });
            }
            let (lhs, rhs) = (
                self.parse_tokens(&sides[0], &text)?,
                self.parse_tokens(&sides[1], &text)?,
            );
            let diff = self.compiled.arena.push(Expr::Sub(lhs, rhs));
            // A referenced <math> whose expression carries the variables
            // (`$m` standing for `2x`) is inlined, so it takes part in the
            // linear extraction instead of being an opaque cell.
            let diff = self.inline_symbolic_maths(t, diff);
            let coeffs = match super::expr::linear_coeffs(&mut self.compiled.arena, diff, &vx, &vy)
            {
                // A symbolic or nonlinear equation is not a line here.
                None => [
                    SourcePlan::Fixed(f64::NAN),
                    SourcePlan::Fixed(f64::NAN),
                    SourcePlan::Fixed(f64::NAN),
                ],
                Some([a, b, c]) => [
                    self.plan_from_expr(a),
                    self.plan_from_expr(b),
                    self.plan_from_expr(c),
                ],
            };
            let [a, b, c] = coeffs;
            ch.set(line::COEFFVAR1, a);
            ch.set(line::COEFFVAR2, b);
            ch.set(line::COEFF0, c);
            ch.set_vec(
                line::X1,
                VecOp::LinePointsFromCoeffs,
                vec![line::COEFFVAR1, line::COEFFVAR2, line::COEFF0],
            );
            let q = ch.hidden(SourcePlan::computed(
                OpSpec::Div,
                vec![line::COEFFVAR1, line::COEFFVAR2],
            ));
            ch.set(line::SLOPE, SourcePlan::computed(OpSpec::Negate, vec![q]));
            let xi = ch.hidden(SourcePlan::computed(
                OpSpec::Div,
                vec![line::COEFF0, line::COEFFVAR1],
            ));
            ch.set(
                line::XINTERCEPT,
                SourcePlan::computed(OpSpec::Negate, vec![xi]),
            );
            let yi = ch.hidden(SourcePlan::computed(
                OpSpec::Div,
                vec![line::COEFF0, line::COEFFVAR2],
            ));
            ch.set(
                line::YINTERCEPT,
                SourcePlan::computed(OpSpec::Negate, vec![yi]),
            );
            ch.set(line::BASED_ON_DIRECTION, SourcePlan::Fixed(0.0));
            return Ok(ch);
        }

        let direction_mode =
            through.len() < 2 && (slope.is_some() || parallel.is_some() || perpendicular.is_some());
        // First point: a through point or the essential default, which the
        // current core takes as (1, 0) for a two-point line and (0, 0) when a
        // slope or direction gives the second point (`ESS1`, `ESS2`).
        if direction_mode {
            Self::set_point_or_default(
                &mut ch,
                [line::X1, line::Y1],
                through.first(),
                POINT_ROLES[0],
                "through",
                ESS2,
            );
            let dist = ch.essential("dist", 1.0);
            if let Some(a) = slope {
                let m = self.plan_scalar(t, scope, "slope", d.attr_children(a))?;
                let m = ch.hidden(m);
                ch.set_vec(
                    line::X2,
                    VecOp::PolarSlope,
                    vec![line::X1, line::Y1, m, dist],
                );
            } else {
                let (a, perp) = match (parallel, perpendicular) {
                    (Some(a), _) => (a, false),
                    (None, Some(a)) => (a, true),
                    _ => unreachable!(),
                };
                let [ux, uy] = self.plan_direction(t, scope, a, &mut ch)?;
                ch.set_vec(
                    line::X2,
                    VecOp::PolarDirection {
                        perpendicular: perp,
                    },
                    vec![line::X1, line::Y1, ux, uy, dist],
                );
            }
            ch.set(line::BASED_ON_DIRECTION, SourcePlan::Fixed(1.0));
        } else {
            // The line's points are the through points (or essential
            // defaults) themselves; a whole-line drag is a point group.
            Self::set_point_or_default(
                &mut ch,
                [line::X1, line::Y1],
                through.first(),
                POINT_ROLES[0],
                "through",
                ESS1,
            );
            Self::set_point_or_default(
                &mut ch,
                [line::X2, line::Y2],
                through.get(1),
                POINT_ROLES[1],
                "through",
                ESS2,
            );
            ch.set(line::BASED_ON_DIRECTION, SourcePlan::Fixed(0.0));
        }
        // slope, intercepts and coefficients from the two points:
        // a = y2 - y1, b = x1 - x2, c = -(a x1 + b y1). The slope is the
        // points' ratio even for a slope-based line, as in the current core
        // (NaN when the points coincide).
        let dy = ch.hidden(SourcePlan::computed(OpSpec::Sub, vec![line::Y2, line::Y1]));
        let dx = ch.hidden(SourcePlan::computed(OpSpec::Sub, vec![line::X2, line::X1]));
        ch.set(line::SLOPE, SourcePlan::computed(OpSpec::Div, vec![dy, dx]));
        let q = ch.hidden(SourcePlan::computed(
            OpSpec::Div,
            vec![line::Y1, line::SLOPE],
        ));
        ch.set(
            line::XINTERCEPT,
            SourcePlan::computed(OpSpec::Sub, vec![line::X1, q]),
        );
        let mx = ch.hidden(SourcePlan::computed(
            OpSpec::Mul,
            vec![line::SLOPE, line::X1],
        ));
        ch.set(
            line::YINTERCEPT,
            SourcePlan::computed(OpSpec::Sub, vec![line::Y1, mx]),
        );
        ch.set(line::COEFFVAR1, SourcePlan::own(dy));
        ch.set(
            line::COEFFVAR2,
            SourcePlan::computed(OpSpec::Sub, vec![line::X1, line::X2]),
        );
        let ax = ch.hidden(SourcePlan::computed(
            OpSpec::Mul,
            vec![line::COEFFVAR1, line::X1],
        ));
        let by = ch.hidden(SourcePlan::computed(
            OpSpec::Mul,
            vec![line::COEFFVAR2, line::Y1],
        ));
        let sum = ch.hidden(SourcePlan::computed(OpSpec::Add, vec![ax, by]));
        ch.set(
            line::COEFF0,
            SourcePlan::computed(OpSpec::Negate, vec![sum]),
        );
        Ok(ch)
    }

    /// Two hidden slots holding a direction: a point or tuple's coordinates,
    /// or another line's `point2 - point1`.
    pub(in crate::build) fn plan_direction(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        a: u32,
        ch: &mut ElemPlan,
    ) -> Result<[usize; 2]> {
        match self.plan_point_attr(t, scope, a)? {
            PointPlan::Ref(p) => {
                let target_type = self
                    .plan_elem_target(t, p)
                    .map(|e| self.compiled.templates[t].elems[e].component_type);
                match target_type {
                    Some(ComponentType::Line | ComponentType::LineSegment) => {
                        let x1 = self.plan_with_prop(p, "x1");
                        let y1 = self.plan_with_prop(p, "y1");
                        let x2 = self.plan_with_prop(p, "x2");
                        let y2 = self.plan_with_prop(p, "y2");
                        let ux = ch.hidden(SourcePlan::Op(
                            OpSpec::Sub,
                            vec![Arg::Ref(x2, Sel::Whole), Arg::Ref(x1, Sel::Whole)],
                        ));
                        let uy = ch.hidden(SourcePlan::Op(
                            OpSpec::Sub,
                            vec![Arg::Ref(y2, Sel::Whole), Arg::Ref(y1, Sel::Whole)],
                        ));
                        Ok([ux, uy])
                    }
                    _ => Ok(Self::point_slots(ch, &PointPlan::Ref(p))),
                }
            }
            p => Ok(Self::point_slots(ch, &p)),
        }
    }

    pub(in crate::build) fn plan_segment(
        &mut self,
        t: TemplateId,
        e: ElemId,
        base: Option<NodeId>,
    ) -> Result<ElemPlan> {
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let mut ch = ElemPlan::new(ComponentType::LineSegment.prop_defs().len());
        let ends = match self.attr_or_inherited(el, base, "endpoints") {
            Some(a) => self.plan_point_list(t, scope, a)?,
            None => Vec::new(),
        };
        Self::set_point_or_default(
            &mut ch,
            [segment::X1, segment::Y1],
            ends.first(),
            POINT_ROLES[0],
            "endpoints",
            ESS1,
        );
        Self::set_point_or_default(
            &mut ch,
            [segment::X2, segment::Y2],
            ends.get(1),
            POINT_ROLES[1],
            "endpoints",
            ESS2,
        );
        Ok(ch)
    }
}
