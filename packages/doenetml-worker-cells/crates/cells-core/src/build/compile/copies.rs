//! Copies: `extend` with a prop path, container copies whose children are
//! clones, and the clone elements themselves. The merged-attribute rule for
//! a planned type with overrides is in `geometry/mod.rs` (`plan_geo`).

use super::*;

impl<'a> Compiler<'a> {
    /// `extend="$c.prop"`: the element's value props alias the named prop.
    pub(in crate::build) fn plan_extend_prop(
        &mut self,
        t: TemplateId,
        e: ElemId,
        p: RefId,
    ) -> Result<()> {
        let component_type = self.compiled.templates[t].elems[e].component_type;
        let display = self.compiled.refs[p].display.clone();
        let props = match component_type {
            ComponentType::Point => {
                let hide =
                    ComponentType::Point.prop_defs()[crate::components::prop::point::HIDE].default;
                vec![
                    SourcePlan::coord(p, 0),
                    SourcePlan::coord(p, 1),
                    SourcePlan::Default(hide),
                ]
            }
            ComponentType::Number | ComponentType::NumberInput | ComponentType::MathInput => {
                vec![SourcePlan::reference(p)]
            }
            ComponentType::Math => {
                let id = self.compiled.arena.push(Expr::Cell(p as CellIdx));
                self.compiled.sym_text.insert(id, format!("#{p}"));
                vec![
                    SourcePlan::MathHandle(id, Post::None),
                    SourcePlan::MathValue(id),
                ]
            }
            ComponentType::PointList => {
                self.compiled.templates[t].elems[e].body = Body::PointList { from: p };
                Vec::new()
            }
            _ => return Err(Error::PathTooDeep(display)),
        };
        self.compiled.templates[t].elems[e].props = props;
        Ok(())
    }

    /// `<graph extend="$g" name="g2"/>`: the copy's props alias the
    /// original's and its children are clones, named under the copy.
    pub(in crate::build) fn plan_container_copy(
        &mut self,
        t: TemplateId,
        e: ElemId,
        p: RefId,
    ) -> Result<()> {
        let r = self
            .plan_elem_target(t, p)
            .ok_or_else(|| Error::UncopyableType("graph from another scope".into()))?;
        self.plan_attrs(t, e, Some(p))?;
        let scope = self.child_scope(t, e);
        let kids = self.clone_children(t, r, scope, e)?;
        self.compiled.templates[t].elems[e].children = kids;
        Ok(())
    }

    pub(in crate::build) fn clone_children(
        &mut self,
        t: TemplateId,
        from: ElemId,
        scope: ElemId,
        root: ElemId,
    ) -> Result<Vec<Child>> {
        let kids = self.compiled.templates[t].elems[from].children.clone();
        let mut out = Vec::with_capacity(kids.len());
        for ch in kids {
            match ch {
                Child::Elem(c) => {
                    let (component_type, name) = {
                        let el = &self.compiled.templates[t].elems[c];
                        (el.component_type, el.name)
                    };
                    if matches!(
                        self.compiled.templates[t].elems[c].body,
                        Body::Repeat { .. } | Body::Collect { .. }
                    ) {
                        return Err(Error::UncopyableType(format!(
                            "{} inside a copied container",
                            component_type.tag()
                        )));
                    }
                    let ne =
                        self.push_elem_visible_to(t, NONE, component_type, name, scope, root)?;
                    let label = format!("(copy of {})", self.elem_label(t, c));
                    self.compiled.refs.push(RefPlan {
                        hops: 0,
                        steps: vec![Step::Elem(c)],
                        prop: None,
                        display: label,
                    });
                    let ep = self.compiled.refs.len() - 1;
                    {
                        let el = &mut self.compiled.templates[t].elems[ne];
                        el.extend = Some(ep);
                        el.cloned = true;
                    }
                    let child_scope = if name != NONE { ne } else { scope };
                    let sub = self.clone_children(t, c, child_scope, root)?;
                    self.compiled.templates[t].elems[ne].children = sub;
                    self.pending_elems.push((t, ne));
                    out.push(Child::Elem(ne));
                }
                other => out.push(other),
            }
        }
        Ok(out)
    }
}
