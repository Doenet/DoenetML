//! Container copies (`<graph extend="$g"/>`) given their clones when
//! outlining, once every name is in the table (ADR 0027, step 5).

use super::Outlining;
use crate::compile::*;

impl Compiler<'_> {
    /// After the container copies have their clones, every other
    /// element's `extend` is planned (ADR 0031), so planning reads the
    /// reference from outlining's row. One that cannot be planned boxes its
    /// element here, as planning did.
    pub(in crate::compile) fn plan_extends(&mut self, o: &mut Outlining) {
        let made = o.work.to_plan.clone();
        for (t, e) in made {
            let el = &self.outlined(t).elems[e.index()];
            if el.node == NodeId::NONE
                || el.cloned
                || el.extend.is_some()
                || self.is_box(t, e)
                || self.dast.attr_peek(el.node, "extend").is_none()
            {
                continue;
            }
            if let Err(error) = self.with_clones(o, |cp| cp.plan_extend(t, e)) {
                self.box_in_place(t, e, error);
            }
        }
    }

    /// The end of outlining (ADR 0027): every container copy gets its
    /// clones, now that every name is in the table, so the element set is
    /// complete before anything is planned. A copy of a copy is expanded
    /// after its referent, whatever the document's order.
    pub(in crate::compile) fn expand_container_copies(&mut self, o: &mut Outlining) {
        for (t, e) in std::mem::take(&mut o.container_copies) {
            // Nothing is expanding between two copies here, so none is
            // reached again; were one, it is boxed like any failure.
            if let Err(error) = self.expand_container_copy(o, t, e) {
                self.box_in_place(t, e, error);
            }
        }
    }

    /// Give container copy `e` its children: clones of its referent's,
    /// named under the copy, followed by the children written inside the
    /// copy (REF-4 of the principles: added after the referent's). A copy
    /// that fails is boxed, and the clones it made die with it. The one
    /// error returned is a copy reached again while it expands, a cycle,
    /// which is its reader's failure.
    pub(in crate::compile) fn expand_container_copy(
        &mut self,
        o: &mut Outlining,
        t: TemplateId,
        e: ElemId,
    ) -> Result<()> {
        let key = (t.get(), e.get());
        if o.expanded.contains(&key) || self.is_box(t, e) {
            // A copy boxed before its clones were made has none to read.
            self.outlined_mut(t).elems[e.index()].clones_pending = false;
            return Ok(());
        }
        if !o.expanding.insert(key) {
            return Err(Error::Cycle(self.elem_label(t, e)));
        }
        let n = self.outlined(t).elems.len();
        let r = self.expand_container_copy_inner(o, t, e);
        o.expanding.remove(&key);
        o.expanded.insert(key);
        // Its clones are made, or it is boxed and has none to read.
        self.outlined_mut(t).elems[e.index()].clones_pending = false;
        if let Err(error) = r {
            for x in n..self.outlined(t).elems.len() {
                self.make_box(t, ElemId::from_index(x), true);
            }
            self.box_in_place(t, e, error);
        }
        Ok(())
    }

    fn expand_container_copy_inner(
        &mut self,
        o: &mut Outlining,
        t: TemplateId,
        e: ElemId,
    ) -> Result<()> {
        let p = self
            .with_clones(o, |cp| cp.plan_extend(t, e))?
            .expect("a container copy extends");
        // `<graph extend="$x.prop"/>` is no container copy: planning refuses
        // it as an extend of a prop.
        if self.compiled.refs[p.index()].prop.is_some() {
            return Ok(());
        }
        let r = self
            .plan_elem_target(t, p)
            .ok_or_else(|| Error::UncopyableType("graph from another scope".into()))?;
        // A referent that is itself a copy has its clones first; one that
        // is a box has none to clone.
        self.with_clones(o, |cp| cp.ref_target(t, p).map(drop))?;
        self.referent_type(&mut o.work.reads, t, e, p)?;
        let scope = self.child_scope(t, e);
        let mut kids = self.clone_children(o, t, r, scope, e)?;
        let own = std::mem::take(&mut self.outlined_mut(t).elems[e.index()].children);
        kids.extend(own);
        self.outlined_mut(t).elems[e.index()].children = kids;
        Ok(())
    }

    pub(in crate::compile) fn clone_children(
        &mut self,
        o: &mut Outlining,
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
                        self.expand_container_copy(o, t, c)?;
                    }
                    let el = self.outlined_elem(t, c)?;
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
                    self.compiled.refs.push(RefPlan {
                        hops: 0,
                        steps: vec![Step::Elem(c)],
                        prop: None,
                        display: RefDisplay::Spelled(
                            format!("(copy of {})", self.elem_label(t, c)).into(),
                        ),
                        node: NodeId::NONE,
                    });
                    let ep = RefId::from_index(self.compiled.refs.len() - 1);
                    {
                        let el = &mut self.outlined_mut(t).elems[ne.index()];
                        el.extend = Some(ep);
                        el.cloned = true;
                    }
                    // The clone took its original's row: it reads it (ADR
                    // 0032), and is boxed with it should the original be
                    // boxed later.
                    Self::record_read(&mut o.work.reads, t, ne, ep);
                    let child_scope = if name != StrId::NONE { ne } else { scope };
                    let sub = self.clone_children(o, t, c, child_scope, root)?;
                    self.outlined_mut(t).elems[ne.index()].children = sub;
                    o.work.to_plan.push((t, ne));
                    out.push(Child::Elem(ne));
                }
                other => out.push(other),
            }
        }
        Ok(out)
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

impl Compiler<'_> {
    /// Run `f`, which reads what outlining made through references (ADR
    /// 0031): when it reaches a container copy whose clones are not made
    /// yet (`Error::AwaitsClones`), make them, and run it again from where
    /// it began. A copy reached again while it is expanding is a cycle
    /// (`expand_container_copy`), so this ends.
    pub(in crate::compile) fn with_clones<T>(
        &mut self,
        o: &mut Outlining,
        mut f: impl FnMut(&mut Self) -> Result<T>,
    ) -> Result<T> {
        loop {
            let n = self.compiled.refs.len();
            match f(self) {
                Err(Error::AwaitsClones { template, elem }) => {
                    // What the attempt planned is planned again.
                    self.compiled.refs.truncate(n);
                    self.expand_container_copy(o, TemplateId::new(template), ElemId::new(elem))?;
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
        for (ti, tpl) in compiled.templates.iter().enumerate() {
            for (ei, e) in tpl.elems.iter().enumerate() {
                if e.name != StrId::NONE && compiled.dast.strings.get(e.name).trim() == name {
                    return (TemplateId::from_index(ti), ElemId::from_index(ei));
                }
            }
        }
        panic!("no element named {name}");
    }

    /// Every `extend` is planned when outlining, in outlining's row (ADR
    /// 0031); whether the element is a copy of what it names is planning's:
    /// a copy of a point is, a point extending a prop aliases it instead.
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
            let tpl = &compiled.templates[t.index()];
            assert!(tpl.elems[e.index()].extend.is_some(), "{name}");
            assert_eq!(tpl.plan(e).extend.is_some(), copy, "{name}");
        }
    }
}
