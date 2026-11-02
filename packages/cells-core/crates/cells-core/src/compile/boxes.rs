//! Boxing (ADR 0013, ADR 0027, ADR 0030), which outlining, planning and
//! linking all do: an element that fails becomes an `_error` element where
//! it fails, keeping its name, and what is under it dies with it. A failure
//! the compile cannot keep is recorded for `Compiler::compile` to restart
//! from (`box_in_place`).

use crate::compile::*;

impl Compiler<'_> {
    /// Whether element `e` is a box: boxed when outlining, boxed in place, or
    /// under one.
    pub(in crate::compile) fn is_box(&self, t: TemplateId, e: ElemId) -> bool {
        self.compiled.templates[t.index()].elems[e.index()].component_type == ComponentType::Error
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
        self.drop_unregistered_name(t, e);
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
        e
    }

    /// Leaves `e` its name only when the name table holds the name for it:
    /// a box made for a duplicate name never registered it, and carries
    /// none.
    fn drop_unregistered_name(&mut self, t: TemplateId, e: ElemId) {
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

    /// Makes `e` a box: an `_error` element with no props, children or
    /// body, or, `dead`, one under a box, which no build makes.
    pub(in crate::compile) fn make_box(&mut self, t: TemplateId, e: ElemId, dead: bool) {
        let el = &mut self.compiled.templates[t.index()].elems[e.index()];
        el.component_type = ComponentType::Error;
        el.props = Vec::new();
        el.children = Vec::new();
        el.body = Body::Plain;
        el.extend = None;
        el.n_public = NPublic::Table;
        el.hold = Hold::Off;
        el.dead = dead;
    }
}
