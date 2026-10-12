//! `<point>`: coordinates, and constraint children that wrap them in a
//! projection.

use super::*;
use crate::components::prop::point;

impl Compiler<'_> {
    /// `<point>`: coordinates from `coords`, from `x`/`y`, or from `(a, b)`
    /// children; constraint children wrap them in a projection.
    pub(in crate::build) fn plan_point(
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
        let mut ch = ElemPlan::new(ComponentType::Point.prop_defs().len());
        let own_children = self.math_children(el);
        let base_children = base.map(|b| self.math_children(b)).unwrap_or_default();
        if let Some(a) = self.attr_or_inherited(el, base, "coords") {
            let p = self.plan_point_attr(t, scope, a)?;
            Self::set_point_with_roles(&mut ch, [point::X, point::Y], &p, ["x", "y"], "coords");
        } else if self.attr_or_inherited(el, base, "x").is_some()
            || self.attr_or_inherited(el, base, "y").is_some()
            || (own_children.is_empty() && base_children.is_empty())
        {
            for (i, name) in ["x", "y"].into_iter().enumerate() {
                match self.attr_or_inherited(el, base, name) {
                    Some(a) => {
                        let plan = self.plan_scalar(t, scope, name, d.attr_children(a))?;
                        if let SourcePlan::Literal(v) = plan {
                            ch.from_attr(name, name);
                            ch.set_essential(i, name, v);
                        } else {
                            ch.set(i, plan);
                        }
                    }
                    None => ch.set_essential(i, name, 0.0),
                }
            }
        } else {
            let nodes = if own_children.is_empty() {
                base_children
            } else {
                own_children
            };
            let p = PointPlan::Tuple(self.plan_tuple(t, scope, &nodes)?);
            Self::set_point_with_roles(&mut ch, [point::X, point::Y], &p, ["x", "y"], "children");
        }
        // `hide` is a 0/1 cell: a bare or literal flag, or a bound cell; a
        // copy inherits the original's.
        match self.attr_or_inherited(el, base, "hide") {
            Some(a) if self.single_macro(a).is_some() => {
                let plan = self.plan_scalar(t, scope, "hide", d.attr_children(a))?;
                ch.set(point::HIDE, plan);
            }
            Some(_) => {
                // The copy's own attribute wins: `hide="false"` reveals a
                // copy of a hidden point, as in the current core.
                let owner = if d.attr(el, "hide").is_some() {
                    el
                } else {
                    base.unwrap()
                };
                let on = self.attr_flag(owner, "hide");
                ch.set(point::HIDE, SourcePlan::Literal(if on { 1.0 } else { 0.0 }));
            }
            None => ch.set(
                point::HIDE,
                if base.is_some() {
                    SourcePlan::Inherit
                } else {
                    SourcePlan::Default(0.0)
                },
            ),
        }
        // Constraints may sit directly under the point or in <constraints>.
        let mut constraints: Vec<NodeId> = Vec::new();
        for node in std::iter::once(el).chain(base) {
            for &n in d.children(node) {
                if d.kind(n) == NodeKind::Element {
                    if d.str(n) == "constraints" {
                        constraints.extend(
                            d.children(n)
                                .iter()
                                .copied()
                                .filter(|&c| d.kind(c) == NodeKind::Element),
                        );
                    } else {
                        constraints.push(n);
                    }
                }
            }
            if !constraints.is_empty() {
                break;
            }
        }
        if let Some(&c) = constraints.first() {
            if constraints.len() > 1 {
                return Err(Error::Unsupported(
                    "more than one constraint on a point".into(),
                ));
            }
            self.wrap_constraint(t, scope, &mut ch, c)?;
        }
        Ok(ch)
    }

    /// Move the planned coordinates of a point to hidden raw slots and make
    /// the public `x`, `y` their projection onto the constraint.
    pub(in crate::build) fn wrap_constraint(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        ch: &mut ElemPlan,
        c: NodeId,
    ) -> Result<()> {
        let d = self.compiled.dast;
        let (px, py) = (
            ch.props[point::X].take().expect("x planned"),
            ch.props[point::Y].take().expect("y planned"),
        );
        let raw_x = ch.hidden(px);
        let raw_y = ch.hidden(py);
        // The raw coordinates are the essential state now; keep their roles.
        for role in ["x", "y"] {
            if let Some(slot) = ch.roles.get_mut(role) {
                *slot = own_slot(if role == "x" { raw_x } else { raw_y });
            }
        }
        match d.str(c) {
            "constrainToGrid" => {
                let num = |me: &Self, name: &str, default: f64| -> Result<f64> {
                    match d.attr(c, name) {
                        None => Ok(default),
                        Some(a) => me
                            .attr_text(a)
                            .and_then(|s| s.trim().parse::<f64>().ok())
                            .ok_or_else(|| Error::BadLiteralParam(name.into())),
                    }
                };
                let (dx, dy) = (num(self, "dx", 1.0)?, num(self, "dy", 1.0)?);
                let (xo, yo) = (num(self, "xoffset", 0.0)?, num(self, "yoffset", 0.0)?);
                let snap = |ch: &mut ElemPlan, raw: usize, step: f64, offset: f64| -> SourcePlan {
                    let mut cur = raw;
                    if offset != 0.0 {
                        cur = ch.hidden(SourcePlan::computed(
                            OpSpec::Offset { k: -offset },
                            vec![cur],
                        ));
                    }
                    if step != 1.0 {
                        cur = ch.hidden(SourcePlan::computed(
                            OpSpec::Scale { k: 1.0 / step },
                            vec![cur],
                        ));
                    }
                    cur = ch.hidden(SourcePlan::computed(OpSpec::Round, vec![cur]));
                    if step != 1.0 {
                        cur = ch.hidden(SourcePlan::computed(OpSpec::Scale { k: step }, vec![cur]));
                    }
                    if offset != 0.0 {
                        return SourcePlan::computed(OpSpec::Offset { k: offset }, vec![cur]);
                    }
                    SourcePlan::own(cur)
                };
                let px = snap(ch, raw_x, dx, xo);
                let py = snap(ch, raw_y, dy, yo);
                ch.set(point::X, px);
                ch.set(point::Y, py);
            }
            "constrainTo" => {
                let m = d
                    .children(c)
                    .iter()
                    .copied()
                    .find(|&n| d.kind(n) == NodeKind::Macro)
                    .ok_or_else(|| {
                        Error::Unsupported("<constrainTo> without a reference".into())
                    })?;
                let p = self.plan_ref(t, scope, m)?;
                let target = self.plan_elem_target(t, p).ok_or_else(|| {
                    Error::Unsupported(
                        "<constrainTo> must name a component in the same scope".into(),
                    )
                })?;
                let refs = |me: &mut Self, ch: &mut ElemPlan, props: &[&str]| -> Vec<usize> {
                    props
                        .iter()
                        .map(|pr| ch.hidden(SourcePlan::reference(me.plan_with_prop(p, pr))))
                        .collect()
                };
                match self.compiled.templates[t].elems[target].component_type {
                    ComponentType::Circle => {
                        let c = refs(self, ch, &["cx", "cy", "radius"]);
                        ch.set_vec(
                            point::X,
                            VecOp::ProjectCircle,
                            vec![raw_x, raw_y, c[0], c[1], c[2]],
                        );
                    }
                    ComponentType::Line | ComponentType::LineSegment => {
                        let l = refs(self, ch, &["x1", "y1", "x2", "y2"]);
                        ch.set_vec(
                            point::X,
                            VecOp::ProjectLine,
                            vec![raw_x, raw_y, l[0], l[1], l[2], l[3]],
                        );
                    }
                    other => {
                        return Err(Error::Unsupported(format!(
                            "constrainTo a <{}>",
                            other.tag()
                        )));
                    }
                }
            }
            other => return Err(Error::Unsupported(format!("<{other}> constraint"))),
        }
        Ok(())
    }
}
