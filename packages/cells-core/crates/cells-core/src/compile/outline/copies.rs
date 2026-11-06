//! Container copies (`<graph extend="$g"/>`) given their clones when
//! outlining, once every name is in the table.

use super::Outlining;
use crate::compile::*;

/// Outlining, extends and container copies: every `extend`'s reference, and
/// container copies' clones, made once every name is in the table. Plans
/// nothing else (ADR 0030).
impl Outlining<'_> {
    /// Plan every other element's `extend`, once the container copies
    /// have their clones. One that cannot be planned boxes its element.
    pub(in crate::compile) fn plan_extends(&mut self) {
        let made = self.work.to_plan.clone();
        for (t, e) in made {
            let el = &self.outlined(t).elems[e.index()];
            if el.node == NodeId::NONE
                || el.cloned
                || el.extend.is_some()
                || self.tables[t.index()].is_box(e)
                || self.dast.attr_peek(el.node, "extend").is_none()
            {
                continue;
            }
            if let Err(error) = self.with_clones(|cp| cp.plan_extend(t, e)) {
                self.boxes
                    .box_in_place(&self.settled.templates, &mut self.tables, t, e, error);
            }
        }
    }

    /// Give every container copy its clones. A copy of a copy is expanded
    /// after its referent, whatever the document's order.
    pub(in crate::compile) fn expand_container_copies(&mut self) {
        for (t, e) in std::mem::take(&mut self.container_copies) {
            // Nothing is expanding between two copies here, so none is
            // reached again; were one, it is boxed like any failure.
            if let Err(error) = self.expand_container_copy(t, e) {
                self.boxes
                    .box_in_place(&self.settled.templates, &mut self.tables, t, e, error);
            }
        }
    }

    /// Give container copy `e` its children: clones of its referent's,
    /// named under the copy, followed by the children written inside the
    /// copy. A copy that fails is boxed, and the clones it made die with
    /// it. The one error returned is a copy reached again while it expands,
    /// a cycle, which is its reader's failure.
    pub(in crate::compile) fn expand_container_copy(
        &mut self,
        t: TemplateId,
        e: ElemId,
    ) -> Result<()> {
        let key = (t, e);
        if self.expanded.contains(&key) || self.tables[t.index()].is_box(e) {
            // A copy boxed before its clones were made has none to read.
            self.outlined_mut(t).elems[e.index()].clones_pending = false;
            return Ok(());
        }
        if !self.expanding.insert(key) {
            return Err(Error::Cycle(self.rd().elem_label(t, e)));
        }
        let n = self.outlined(t).elems.len();
        let r = self.expand_container_copy_inner(t, e);
        self.expanding.remove(&key);
        self.expanded.insert(key);
        // Its clones are made, or it is boxed and has none to read.
        self.outlined_mut(t).elems[e.index()].clones_pending = false;
        if let Err(error) = r {
            for x in n..self.outlined(t).elems.len() {
                self.boxes.make_box(
                    &self.settled.templates,
                    &mut self.tables,
                    t,
                    ElemId::from_index(x),
                    true,
                );
            }
            self.boxes
                .box_in_place(&self.settled.templates, &mut self.tables, t, e, error);
        }
        Ok(())
    }

    fn expand_container_copy_inner(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let p = self
            .with_clones(|cp| cp.plan_extend(t, e))?
            .expect("a container copy extends");
        // `<graph extend="$x.prop"/>` is no container copy: planning refuses
        // it as an extend of a prop.
        if self.ar.refs[p.index()].prop.is_some() {
            return Ok(());
        }
        let r = self
            .rd()
            .plan_elem_target(&self.ar, t, p)
            .ok_or_else(|| Error::UncopyableType("graph from another scope".into()))?;
        // A referent that is itself a copy has its clones first; one that
        // is a box has none to clone.
        self.with_clones(|cp| cp.rd().ref_target(&cp.ar, t, p).map(drop))?;
        Reader::new(self.dast, &self.settled).referent_type(
            &self.ar,
            self.boxes.visible(&self.tables),
            &mut self.work.reads,
            t,
            e,
            p,
        )?;
        let scope = self.rd().child_scope(t, e);
        let kids = self.clone_children(t, r, scope, e)?;
        // The clones come first, then the copy's own children.
        self.outlined_mut(t).elems[e.index()]
            .children
            .splice(0..0, kids);
        Ok(())
    }

    pub(in crate::compile) fn clone_children(
        &mut self,
        t: TemplateId,
        from: ElemId,
        scope: ElemId,
        root: ElemId,
    ) -> Result<Vec<Child>> {
        let kids = self.outlined(t).elems[from.index()].children.clone();
        let mut out = Vec::with_capacity(kids.len());
        for ch in kids {
            match ch {
                Child::Elem(c) => {
                    // A copy among the children has its clones first; a
                    // clone takes the type outlining settled for its original.
                    if self.is_container_copy(t, c) {
                        self.expand_container_copy(t, c)?;
                    }
                    let el = self.rd().outlined_elem(t, c)?;
                    let (component_type, name) = (el.component_type, el.name);
                    let repeat = matches!(el.body, Body::Repeat { .. });
                    if repeat
                        || matches!(
                            component_type,
                            ComponentType::Collect | ComponentType::Polyline
                        )
                    {
                        return Err(Error::UncopyableType(format!(
                            "{} inside a copied container",
                            component_type.tag()
                        )));
                    }
                    let ne = self.push_elem_visible_to(
                        t,
                        NodeId::NONE,
                        component_type,
                        name,
                        scope,
                        root,
                    )?;
                    let plan = RefPlan {
                        hops: 0,
                        steps: vec![Step::Elem(c)],
                        prop: None,
                        display: RefDisplay::Spelled(
                            format!("(copy of {})", self.rd().elem_label(t, c)).into(),
                        ),
                        node: NodeId::NONE,
                    };
                    let ep = self.ar.push_ref(plan);
                    {
                        let el = &mut self.outlined_mut(t).elems[ne.index()];
                        el.extend = Some(ep);
                        el.cloned = true;
                    }
                    // The clone took its original's row: it reads it (ADR
                    // 0032), and is boxed with it should the original be
                    // boxed later.
                    record_read(&mut self.work.reads, t, ne, ep);
                    let child_scope = if name != StrId::NONE { ne } else { scope };
                    let sub = self.clone_children(t, c, child_scope, root)?;
                    self.outlined_mut(t).elems[ne.index()].children = sub;
                    self.work.to_plan.push((t, ne));
                    out.push(Child::Elem(ne));
                }
                other => out.push(other),
            }
        }
        Ok(out)
    }

    /// The reference in `e`'s `extend`, planned once, when outlining, from
    /// where `e` sits.
    pub(in crate::compile) fn plan_extend(
        &mut self,
        t: TemplateId,
        e: ElemId,
    ) -> Result<Option<RefId>> {
        if let Some(p) = self.outlined(t).elems[e.index()].extend {
            return Ok(Some(p));
        }
        let Elem {
            node, name_scope, ..
        } = self.outlined(t).elems[e.index()];
        let Some(a) = self.dast.attr(node, "extend") else {
            return Ok(None);
        };
        let m = self.rd().single_macro(a).ok_or_else(|| Error::BadValue {
            attr: "extend".into(),
            text: self.rd().attr_text(a).unwrap_or_default(),
        })?;
        let p = Reader::new(self.dast, &self.settled).plan_ref(&mut self.ar, t, name_scope, m)?;
        // `<math extend="$n"/>`, `<mathInput extend="$m"/>`: an extend
        // across related types is the referent's value as the element's
        // type (REF-5, ADR 0025), so it is the extend of its default prop,
        // decided here from the types outlining settled. An unrelated pair
        // is left to the build, which refuses it once both types are
        // known. A container copy names its referent itself.
        let component_type = self.outlined(t).elems[e.index()].component_type;
        if !component_type.container()
            && self.ar.refs[p.index()].prop.is_none()
            && let Ok(Some(rt)) = self.rd().ref_target_type(&self.ar, t, p)
            && rt != component_type
        {
            // `<boolean extend="$x"/>` reads `x`'s `value` whatever its
            // type: the coercion of a referent's value to a boolean (until
            // ADR 0032's table of coercions lands, here, not in a planner).
            let dp = if component_type == ComponentType::Boolean {
                Some("value")
            } else if ComponentType::extends_as(rt, component_type) {
                rt.default_prop()
            } else {
                None
            };
            if let Some(dp) = dp {
                let named = self.rd().prop_named(&self.ar, t, p, dp)?;
                let r = self.ar.ref_mut(p);
                r.prop = named;
                let base = std::mem::replace(&mut r.display, RefDisplay::Written);
                r.display = RefDisplay::Prop(Box::new(base), dp);
            }
        }
        self.outlined_mut(t).elems[e.index()].extend = Some(p);
        Ok(Some(p))
    }

    /// Whether `e` is a container copy (`<graph extend="$g"/>`), which
    /// outlining gives its clones.
    pub(in crate::compile) fn is_container_copy(&self, t: TemplateId, e: ElemId) -> bool {
        let el = &self.outlined(t).elems[e.index()];
        el.node != NodeId::NONE
            && !el.cloned
            && el.component_type.container()
            && self.dast.attr_peek(el.node, "extend").is_some()
    }
}

/// Outlining, a read that needs clones: run again once the container copy it
/// reached has its clones.
impl Outlining<'_> {
    /// Run `f`, which reads what outlining made through references: when it
    /// reaches a container copy whose clones are not made yet
    /// ([`Error::AwaitsClones`]), make them, and run it again from the start.
    pub(in crate::compile) fn with_clones<T>(
        &mut self,
        mut f: impl FnMut(&mut Self) -> Result<T>,
    ) -> Result<T> {
        loop {
            let n = self.ar.refs.len();
            match f(self) {
                Err(Error::AwaitsClones { template, elem }) => {
                    // What the attempt planned is planned again.
                    self.ar.truncate_refs(n);
                    self.expand_container_copy(TemplateId::new(template), ElemId::new(elem))?;
                }
                r => return r,
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::compile::*;
    use crate::testing::dast::{document, el, mac};

    /// Template and element of the element named `name`.
    fn find(compiled: &Compiled, name: &str) -> (TemplateId, ElemId) {
        for (ti, tpl) in compiled.plans.templates.iter().enumerate() {
            for (ei, e) in tpl.elems.iter().enumerate() {
                if e.name != StrId::NONE && compiled.dast.strings.get(e.name).trim() == name {
                    return (TemplateId::from_index(ti), ElemId::from_index(ei));
                }
            }
        }
        panic!("no element named {name}");
    }

    /// Every `extend` is planned when outlining; a copy of a point is a
    /// copy, while a point extending a prop aliases it.
    #[test]
    fn outlining_plans_every_extend_and_planning_decides_the_copy() {
        let dast = document([
            el("point").name("P").attr("x", "1").attr("y", "2"),
            el("point").name("Q").attr("extend", mac("P")),
            el("circle").name("c"),
            el("point").name("R").attr("extend", mac("c.center")),
        ]);
        let compiled = crate::testing::compile(&dast).unwrap();
        for (name, copy) in [("Q", true), ("R", false)] {
            let (t, e) = find(&compiled, name);
            let tpl = &compiled.plans.templates[t.index()];
            assert!(tpl.elems[e.index()].extend.is_some(), "{name}");
            assert_eq!(tpl.plan(e).extend.is_some(), copy, "{name}");
        }
    }
}
