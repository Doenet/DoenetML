//! Boxing (ADR 0013, ADR 0027, ADR 0030, ADR 0031), which outlining,
//! planning and linking all do: an element that fails becomes an `_error`
//! element where it fails, keeping its name, and what is under it dies with
//! it. Boxing writes only its own table (`Template::boxes`): what outlining
//! and planning made of a box is left as they made it, and the build reads
//! the box's row instead (`Template::row`). A failure the compile cannot
//! keep is recorded for `Compiler::compile` to restart from
//! (`box_in_place`).

use crate::compile::*;

impl Compiler<'_> {
    /// Whether element `e` is a box: boxed when outlining, boxed in place, or
    /// under one.
    pub(in crate::compile) fn is_box(&self, t: TemplateId, e: ElemId) -> bool {
        self.compiled.templates[t.index()].is_box(e)
    }

    /// The stage running now, which a box records (`BoxState::Boxed::by`).
    fn stage(&self) -> Stage {
        if self.outlining.is_some() {
            Stage::Outline
        } else if self.planning.is_some() {
            Stage::Plan
        } else {
            Stage::Link
        }
    }

    /// Whether element `e` is a box a reader of its type may see now: while
    /// planning, only outlining's, so that planning does not depend on its
    /// own order (ADR 0031); a reader of a box made while planning is boxed
    /// when linking (`box_readers_of_boxes`).
    pub(in crate::compile) fn is_visible_box(&self, t: TemplateId, e: ElemId) -> bool {
        match &self.compiled.templates[t.index()].boxes[e.index()] {
            BoxState::Live => false,
            BoxState::Boxed { by, .. } => self.planning.is_none() || *by == Stage::Outline,
        }
    }

    /// Box element `e` where it failed (ADR 0027): it becomes an `_error`
    /// element keeping its name, everything under it (its children, the
    /// templates of its repeats and choices) is dead, and the compile goes
    /// on. No plan reads another's (ADR 0029), so whatever was planned
    /// under it is dropped unread.
    ///
    /// But a container copy that cloned what is under it took its type,
    /// and an element with no node has nowhere to carry the error: then
    /// this compile cannot stand. `e` is boxed all the same, so the stage
    /// runs on over a consistent compile, and the failure is recorded
    /// (the first, when there are several) for `compile` to end the
    /// compile with once the stage is done: `e`'s node is boxed before
    /// compiling again, and with no node the load fails. Every failure is
    /// handled here the same way whatever failed before it.
    pub(in crate::compile) fn box_in_place(&mut self, t: TemplateId, e: ElemId, error: Error) {
        let node = self.compiled.templates[t.index()].elems[e.index()].node;
        let doomed = self.subtree(t, e);
        let cloned = doomed
            .iter()
            .any(|&(dt, de)| self.cloned().contains(&(dt.get(), de.get())));
        if node == NodeId::NONE || cloned {
            self.restart.get_or_insert(Failure {
                error,
                node: (node != NodeId::NONE).then_some(node),
            });
        } else {
            self.errors.push(Diagnostic::error(Some(node), &error));
            self.boxed_here.insert(node);
        }
        for (dt, de) in doomed {
            self.make_box(dt, de, (dt, de) != (t, e));
        }
    }

    /// What boxes leave out of the diagnostics, once every stage that boxes
    /// is done (ADR 0031): a box reports its error and nothing else, and
    /// what is under a box reports nothing, whichever stage boxed it and
    /// whatever was reported before. Boxing itself removes no other
    /// stage's report.
    pub(in crate::compile) fn drop_reports_of_boxes(&mut self) {
        let mut boxes = HashSet::new();
        let mut dead = HashSet::new();
        for tpl in &self.compiled.templates {
            for (el, b) in tpl.elems.iter().zip(&tpl.boxes) {
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
        let templates = &self.compiled.templates;
        for tpl in templates {
            for (rc, plan) in tpl.ref_children.iter().zip(&tpl.ref_child_plans) {
                let under_box = match rc.owner {
                    Some(e) => tpl.is_box(e),
                    None => tpl
                        .parent
                        .is_some_and(|(pt, pe)| templates[pt.index()].is_box(pe)),
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
            let el = &self.compiled.templates[ct.index()].elems[ce.index()];
            let mut under: Vec<(TemplateId, ElemId)> = el
                .children
                .iter()
                .filter_map(|c| match c {
                    Child::Elem(x) => Some((ct, *x)),
                    _ => None,
                })
                .collect();
            for (ti, tpl) in self.compiled.templates.iter().enumerate() {
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
    /// reads as undefined rather than being an unknown reference of its
    /// own (ADR 0027). A name a sibling already holds (the box of a
    /// duplicate name) is left off.
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
        let e = ElemId::from_index(self.compiled.templates[t.index()].elems.len());
        let _ = self.push_elem(t, node, ComponentType::Error, name, name_scope);
        self.drop_unregistered_name(t, e);
        self.make_box(t, e, false);
        e
    }

    /// Leaves `e` its name only when the name table holds the name for it:
    /// a box made for a duplicate name never registered it, and carries
    /// none. Outlining's, where it pushes the element: only outlining names
    /// elements, so a name a later stage boxes is registered.
    pub(in crate::compile) fn drop_unregistered_name(&mut self, t: TemplateId, e: ElemId) {
        let el = &self.compiled.templates[t.index()].elems[e.index()];
        if el.name == StrId::NONE {
            return;
        }
        let names = self.names();
        let registered = names
            .id(self.dast.strings.get(el.name))
            .and_then(|id| names.entry(t, el.name_scope, id))
            .is_some_and(|x| x == e.get() || x == AMBIGUOUS);
        if !registered {
            self.compiled.templates[t.index()].elems[e.index()].name = StrId::NONE;
        }
    }

    /// Makes `e` a box in boxing's table: an `_error` element with no
    /// props, children or body as the build sees it (`Elem::as_box`), or,
    /// `dead`, one under a box, which no build makes. What other stages
    /// made of it stays as they made it.
    pub(in crate::compile) fn make_box(&mut self, t: TemplateId, e: ElemId, dead: bool) {
        let by = self.stage();
        let tpl = &mut self.compiled.templates[t.index()];
        let row = Box::new(tpl.elems[e.index()].as_box());
        tpl.boxes[e.index()] = BoxState::Boxed { row, by, dead };
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

    /// Boxing writes only its own table (ADR 0031): an element boxed while
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
        assert!(tpl.is_box(g) && !tpl.is_dead(g));
        assert_eq!(tpl.elems[g.index()].component_type, ComponentType::Graph);
        assert_eq!(tpl.elems[g.index()].children.len(), 1);
        assert_eq!(tpl.row(g).component_type, ComponentType::Error);
        assert!(tpl.row(g).children.is_empty());
        assert!(tpl.is_dead(a));
        assert_eq!(tpl.elems[a.index()].component_type, ComponentType::Point);
    }

    /// A `$ref` child that cannot be planned is boxed in planning's table
    /// of `$ref` children (ADR 0031): no element is made for it, and the
    /// child list outlining made is left as it made it.
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
        assert_eq!(tpl.ref_child_plans[id.index()], RefChildPlan::Boxed);
        assert!(
            compiled
                .diagnostics
                .iter()
                .any(|d| d.code == "doenet-w0104")
        );
    }
}
