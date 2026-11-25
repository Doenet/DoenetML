//! A shape over a repeat's points (ADR 0075): the machinery that plans a
//! `<polyline>` or `<polygon>` outlining settled over a structural
//! sequence of points. Its count aliases the source's count, and its item,
//! one point per iteration, aliases the point of that iteration of the
//! source, so a request on a vertex writes the point it is.

use super::Planning;
use crate::compile::*;

/// Planning, a shape over a repeat's points. Reads its own row and its
/// source's (the referent of its one reference), never another element's
/// plan (ADR 0029). What it sets of its own table it finds by its type's
/// declarations: its count is the structural prop, its item the declared
/// one.
impl Planning<'_> {
    /// Shape `e` of template `t`: its count and drag flags, and its item.
    pub(super) fn plan_over_iterations(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let internal = || Error::Internal("a shape over a repeat's points names one".into());
        let own_ty = self.rd.own_row(t, e).component_type;
        let (Some(StructureKind::Repeat { count: own_count }), Some(item)) =
            (own_ty.structure_kind(), own_ty.def().item)
        else {
            return Err(internal());
        };
        let item_ty = item.ty;
        let source = self.over_iterations_source(t, e)?;
        let (st, se) = self
            .rd
            .static_target(&self.ar, t, source)
            .ok_or_else(internal)?;
        let source_ty = self.rd.referent_row(st, se).component_type;
        let Some(StructureKind::Repeat { count }) = source_ty.structure_kind() else {
            return Err(internal());
        };
        let point = self
            .rd
            .point_per_iteration(st, se, item_ty)
            .ok_or_else(internal)?;
        // Its own table: the count, and the drag flags the source has
        // (another shape's), else draggable.
        let mut props = vec![Source::absent(); own_ty.prop_defs().len()];
        let count_name = source_ty.prop_defs()[count].name;
        props[own_count] =
            Source::reference(
                self.rd
                    .plan_with_prop(&mut self.ar, t, source, count_name)?,
            );
        for name in ["draggable", "verticesDraggable"] {
            let Some(port) = own_ty.prop_index(name) else {
                continue;
            };
            props[port] = if source_ty.prop_index(name).is_some() {
                Source::reference(self.rd.plan_with_prop(&mut self.ar, t, source, name)?)
            } else {
                Source::constant(1.0)
            };
        }
        self.tables[t.index()].plans[e.index()].props = props;
        // The item: the point of this iteration of the source, `$r[i]`'s
        // point, read from the shape's body.
        let Body::Repeat { template: sub } = self.rd.own_row(t, e).body else {
            return Err(internal());
        };
        let base = self.ar.refs[source.index()].clone();
        let mut steps = base.steps.clone();
        steps.push(Step::Iter(IndexPlan {
            terms: vec![IndexTerm::Iter(0)],
        }));
        steps.push(Step::Elem(point));
        let shown = display_of(self.rd.dast, &base);
        let mut coord = |name: &'static str| {
            Source::reference(self.ar.push_ref(RefPlan {
                hops: base.hops + 1,
                steps: steps.clone(),
                prop: RefProp::named(item_ty, name),
                entries: Vec::new(),
                display: RefDisplay::Spelled(format!("({shown}[i]).{name}").into()),
                node: NodeId::NONE,
            }))
        };
        let (x, y) = (coord("x"), coord("y"));
        let mut wiring = ElemWiring::of(item_ty);
        wiring.set_planned(prop::point::Planned {
            x: Wire::from(x),
            y: Wire::from(y),
            // Drawn as the shape's vertex, never as a point of its own.
            hide: Wire::constant(1.0),
            // Unconstrained and draggable (ADR 0080, ADR 0070).
            constraintUsed: Wire::constant(0.0),
            draggable: Wire::constant(1.0),
        });
        self.tables[sub.index()].plans[0].props = wiring.finish().0;
        Ok(())
    }

    /// The one reference shape `e` of template `t` reads its vertices from,
    /// as outlining settled it: its `vertices`, else what it extends, or,
    /// for a clone, its original.
    fn over_iterations_source(&mut self, t: TemplateId, e: ElemId) -> Result<RefId> {
        let Elem {
            node,
            name_scope,
            extend,
            cloned,
            ..
        } = *self.rd.own_row(t, e);
        let vertices = (!cloned)
            .then(|| self.rd.dast.attr(node, "vertices"))
            .flatten();
        match (vertices, extend) {
            (Some(a), _) => {
                let m = self.rd.single_macro(a).ok_or_else(|| {
                    Error::Internal("a shape over a repeat's points has one reference".into())
                })?;
                self.rd.plan_ref(&mut self.ar, t, name_scope, m)
            }
            (None, Some(p)) => Ok(p),
            (None, None) => Err(Error::Internal(
                "a shape over a repeat's points reads a reference".into(),
            )),
        }
    }
}
