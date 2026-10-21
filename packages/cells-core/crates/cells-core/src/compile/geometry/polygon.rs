//! `<polygon>`: vertices, and the rigid or similarity transform a drag
//! keeps.

use super::*;
use crate::components::prop::polygon;

impl Compiler<'_> {
    pub(in crate::compile) fn plan_polygon(
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
        let vertices = match self.attr_or_inherited(el, base, "vertices") {
            Some(a) => self.plan_point_list(t, scope, a)?,
            None => Vec::new(),
        };
        let n = vertices.len();
        if n > crate::components::MAX_VERTICES {
            return Err(Error::Unsupported(format!(
                "a polygon with more than {} vertices",
                crate::components::MAX_VERTICES
            )));
        }
        // The vertices are the list (ADR 0016), as many as given.
        let mut ch = ElemPlan::with_list(ComponentType::Polygon, n);
        let n_public = ch.n_public;
        let vertex = |k: usize, j: usize| {
            ComponentType::Polygon
                .list_slot(n_public, k + 1, j)
                .expect("a vertex the polygon holds")
        };
        let flag = |me: &Self, name: &str, default: bool| -> bool {
            match me.attr_or_inherited(el, base, name) {
                None => default,
                Some(a) => {
                    let text = me.attr_text(a).unwrap_or_default();
                    let text = text.trim();
                    text.is_empty() || text.eq_ignore_ascii_case("true")
                }
            }
        };
        let rigid = flag(self, "rigid", false);
        let similar = flag(self, "preserveSimilarity", false);
        let pivot_point = match self.attr_or_inherited(el, base, "rotationCenter") {
            Some(a)
                if flag(self, "rotateAround", false)
                    || self
                        .attr_or_inherited(el, base, "rotateAround")
                        .and_then(|r| self.attr_text(r))
                        .is_some_and(|r| r.trim() == "point") =>
            {
                Some(self.plan_point_attr(t, scope, a)?)
            }
            _ => None,
        };
        let rigid_opts = if rigid || similar {
            let rotate_around = self
                .attr_or_inherited(el, base, "rotateAround")
                .and_then(|a| self.attr_text(a))
                .unwrap_or_default();
            let pivot = match rotate_around.trim() {
                "vertex" => {
                    let k = self
                        .attr_or_inherited(el, base, "rotationVertex")
                        .and_then(|a| self.attr_text(a))
                        .and_then(|s| s.trim().parse::<usize>().ok())
                        .unwrap_or(1);
                    Pivot::Vertex(byte(k.saturating_sub(1)))
                }
                "point" if pivot_point.is_some() => Pivot::Point,
                _ => Pivot::Centroid,
            };
            let min_shrink = self
                .attr_or_inherited(el, base, "minShrink")
                .and_then(|a| self.attr_text(a))
                .and_then(|s| s.trim().parse::<f64>().ok())
                .unwrap_or(0.1);
            Some(RigidOpts {
                // `rigid` forbids dilation; `preserveSimilarity` allows it
                // unless `allowDilation` says otherwise.
                dilate: !rigid && flag(self, "allowDilation", true),
                rotate: flag(self, "allowRotation", true),
                translate: flag(self, "allowTranslation", true),
                min_shrink,
                pivot,
            })
        } else {
            None
        };
        ch.set(polygon::NUM_VERTICES, SourcePlan::Fixed(n as f64));
        if rigid_opts.is_some() && n > crate::components::MAX_RIGID_VERTICES {
            return Err(Error::Unsupported(format!(
                "a rigid polygon with more than {} vertices",
                crate::components::MAX_RIGID_VERTICES
            )));
        }
        match rigid_opts {
            // Rigid: the document declares the coupling, so one instruction
            // owns every vertex.
            Some(opts) if n > 0 => {
                let mut args = Vec::with_capacity(2 * n + 2);
                for (k, v) in vertices.iter().enumerate() {
                    let [x, y] =
                        Self::point_slots_with_roles(&mut ch, v, point_roles(k), "vertices");
                    args.push(x);
                    args.push(y);
                }
                // The pivot point rides along as two more inputs, NaN when
                // the shape rotates about a centroid or vertex.
                match &pivot_point {
                    Some(pp) => {
                        let [x, y] = ch.hidden_point(pp);
                        args.push(x);
                        args.push(y);
                    }
                    None => {
                        args.push(ch.hidden(SourcePlan::Fixed(f64::NAN)));
                        args.push(ch.hidden(SourcePlan::Fixed(f64::NAN)));
                    }
                }
                ch.set_vec(vertex(0, 0), VecOp::Shape { n: byte(n), opts }, args);
            }
            // Free: the vertices are the points; a vertex may be defined
            // from its siblings without a cycle.
            _ => {
                for (k, v) in vertices.iter().enumerate() {
                    Self::set_point_with_roles(
                        &mut ch,
                        [vertex(k, 0), vertex(k, 1)],
                        v,
                        point_roles(k),
                        "vertices",
                    );
                }
            }
        }
        Ok(ch)
    }
}
