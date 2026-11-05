//! Boxing, which outlining, planning and linking all do: an element that
//! fails becomes an `_error` element where it fails, keeping its name, and
//! what is under it dies with it. Boxing writes only its own table; the
//! build reads the box's row instead of what other stages made of it.

use crate::compile::*;

impl Compiler<'_> {
    /// Whether element `e` is a box: boxed when outlining, boxed in place, or
    /// under one.
    pub(in crate::compile) fn is_box(&self, t: TemplateId, e: ElemId) -> bool {
        self.view(t).is_box(e)
    }

    /// Whether element `e` is a box a reader of its type may see now: while
    /// planning, only outlining's.
    pub(in crate::compile) fn is_visible_box(&self, t: TemplateId, e: ElemId) -> bool {
        match &self.tables[t.index()].boxes[e.index()] {
            BoxState::Live => false,
            BoxState::Boxed { by, .. } => self.stage != Stage::Plan || *by == Stage::Outline,
        }
    }

    /// Box element `e` where it failed: it becomes an `_error` element
    /// keeping its name, everything under it (its children, the templates
    /// of its repeats and choices) is dead, and the compile goes on. What
    /// read its facts is boxed in turn when linking.
    ///
    /// A clone is boxed silently. Any other element with no node is boxed
    /// all the same, and the failure recorded (the first, when there are
    /// several) to fail the compile once the stage is done.
    pub(in crate::compile) fn box_in_place(&mut self, t: TemplateId, e: ElemId, error: Error) {
        let Elem { node, cloned, .. } = self.outlined(t).elems[e.index()];
        let doomed = self.subtree(t, e);
        if node != NodeId::NONE {
            self.errors.push(Diagnostic::error(Some(node), &error));
            self.boxed_here.insert(node);
        } else if !cloned {
            self.restart.get_or_insert(Failure { error, node: None });
        }
        for (dt, de) in doomed {
            self.make_box(dt, de, (dt, de) != (t, e));
        }
    }

    /// Drop what boxes leave out of the diagnostics, once every stage that
    /// boxes is done: a box reports its error and nothing else, and what is
    /// under a box reports nothing.
    pub(in crate::compile) fn drop_reports_of_boxes(&mut self) {
        let mut boxes = HashSet::new();
        let mut dead = HashSet::new();
        for t in 0..self.n_templates() {
            let tpl = self.view(TemplateId::from_index(t));
            for (el, b) in tpl.outlined.elems.iter().zip(&tpl.tables.boxes) {
                if let BoxState::Boxed { dead: d, .. } = b
                    && el.node != NodeId::NONE
                {
                    if *d {
                        dead.insert(el.node);
                    }
                    boxes.insert(el.node);
                }
            }
        }
        // A `$ref` child's box is under a box when what it is a child of is.
        for t in 0..self.n_templates() {
            let tpl = self.view(TemplateId::from_index(t));
            for (rc, plan) in tpl
                .outlined
                .ref_children
                .iter()
                .zip(&tpl.tables.ref_child_plans)
            {
                let under_box = match rc.owner {
                    Some(e) => tpl.is_box(e),
                    None => tpl
                        .outlined
                        .parent
                        .is_some_and(|(pt, pe)| self.view(pt).is_box(pe)),
                };
                if *plan == RefChildPlan::Boxed && under_box {
                    dead.insert(rc.node);
                }
            }
        }
        if boxes.is_empty() && dead.is_empty() {
            return;
        }
        let on = |set: &HashSet<NodeId>, d: &Diagnostic| d.node.is_some_and(|n| set.contains(&n));
        self.errors.retain(|d| !on(&dead, d));
        Arc::make_mut(&mut self.compiled.diagnostics).retain(|d| !on(&boxes, d));
    }

    /// Element `e` and everything under it: its children, theirs, and
    /// the elements of every template a repeat or choice among them owns.
    pub(in crate::compile) fn subtree(
        &self,
        t: TemplateId,
        e: ElemId,
    ) -> Vec<(TemplateId, ElemId)> {
        let mut seen: HashSet<(u32, u32)> = HashSet::from([(t.get(), e.get())]);
        let mut out = vec![(t, e)];
        let mut i = 0;
        while i < out.len() {
            let (ct, ce) = out[i];
            i += 1;
            let el = &self.outlined(ct).elems[ce.index()];
            let mut under: Vec<(TemplateId, ElemId)> = el
                .children
                .iter()
                .filter_map(|c| match c {
                    Child::Elem(x) => Some((ct, *x)),
                    _ => None,
                })
                .collect();
            for ti in 0..self.n_templates() {
                let tpl = self.outlined(TemplateId::from_index(ti));
                if tpl.parent == Some((ct, ce)) {
                    let sub = TemplateId::from_index(ti);
                    under.extend((0..tpl.elems.len()).map(|x| (sub, ElemId::from_index(x))));
                }
            }
            for k in under {
                if seen.insert((k.0.get(), k.1.get())) {
                    out.push(k);
                }
            }
        }
        out
    }

    /// The `_error` element standing for boxed node `node`: no children,
    /// no props, and the element's name, so a reference to it resolves and
    /// reads as undefined. A name a sibling already holds is left off.
    pub(in crate::compile) fn push_error_elem(
        &mut self,
        t: TemplateId,
        node: NodeId,
        name_scope: ElemId,
    ) -> ElemId {
        let name = match self.dast.kind(node) {
            NodeKind::Element => self.attr_name_str(node, "name").unwrap_or(StrId::NONE),
            _ => StrId::NONE,
        };
        // A name a sibling holds fails to register, but the element is
        // pushed all the same.
        let e = ElemId::from_index(self.outlined(t).elems.len());
        let _ = self.push_elem(t, node, ComponentType::Error, name, name_scope);
        self.drop_unregistered_name(t, e);
        self.make_box(t, e, false);
        e
    }

    /// Leaves `e` its name only when the name table holds the name for it:
    /// a box made for a duplicate name carries none.
    pub(in crate::compile) fn drop_unregistered_name(&mut self, t: TemplateId, e: ElemId) {
        let el = &self.outlined(t).elems[e.index()];
        if el.name == StrId::NONE {
            return;
        }
        let names = self.names();
        let registered = names
            .id(self.dast.strings.get(el.name))
            .and_then(|id| names.entry(t, el.name_scope, id))
            .is_some_and(|x| x == e.get() || x == AMBIGUOUS);
        if !registered {
            self.outlined_mut(t).elems[e.index()].name = StrId::NONE;
        }
    }

    /// Makes `e` a box in boxing's table: an `_error` element with no
    /// props, children or body as the build sees it, or, `dead`, one under
    /// a box, which no build makes.
    pub(in crate::compile) fn make_box(&mut self, t: TemplateId, e: ElemId, dead: bool) {
        let by = self.stage;
        let row = Box::new(self.elem(t, e).as_box());
        self.tables[t.index()].boxes[e.index()] = BoxState::Boxed { row, by, dead };
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

    /// Boxing writes only its own table: an element boxed while
    /// planning keeps the row outlining made, and so does one under it,
    /// while the build reads the box's row and makes nothing under it.
    #[test]
    fn a_box_keeps_what_outlining_made_of_it() {
        let dast = document([el("graph")
            .name("g")
            .attr("xmin", mac("nope"))
            .child(el("point").name("a").attr("x", "1"))]);
        let compiled = crate::testing::compile(&dast).unwrap();
        let (t, g) = find(&compiled, "g");
        let (_, a) = find(&compiled, "a");
        let tpl = &compiled.templates[t.index()];
        assert!(tpl.view().is_box(g) && !tpl.is_dead(g));
        assert_eq!(tpl.elems[g.index()].component_type, ComponentType::Graph);
        assert_eq!(tpl.elems[g.index()].children.len(), 1);
        assert_eq!(tpl.row(g).component_type, ComponentType::Error);
        assert!(tpl.row(g).children.is_empty());
        assert!(tpl.is_dead(a));
        assert_eq!(tpl.elems[a.index()].component_type, ComponentType::Point);
    }

    /// A `$ref` child that cannot be planned is boxed in planning's table
    /// of `$ref` children: no element is made for it, and the child list
    /// outlining made is left as it made it.
    #[test]
    fn a_ref_child_that_cannot_be_planned_is_boxed_in_planning_table() {
        let dast = document([el("p").name("p").child(mac("nope"))]);
        let compiled = crate::testing::compile(&dast).unwrap();
        let (t, p) = find(&compiled, "p");
        let tpl = &compiled.templates[t.index()];
        assert!(
            tpl.elems
                .iter()
                .all(|e| e.component_type != ComponentType::Error)
        );
        let [Child::Macro(id)] = tpl.elems[p.index()].children[..] else {
            panic!("one $ref child");
        };
        assert_eq!(tpl.tables.ref_child_plans[id.index()], RefChildPlan::Boxed);
        assert!(
            compiled
                .diagnostics
                .iter()
                .any(|d| d.code == "doenet-w0104")
        );
    }
}
