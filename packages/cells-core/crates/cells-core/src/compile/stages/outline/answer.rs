//! An answer's synthetic children, made when outlining: its implicit
//! `<mathInput>`, the `<choiceInput>` its `<choice>`s are sugar for, and a
//! `response` per input its whens read.

use super::Outlining;
use crate::compile::*;

/// Outlining, `<answer>`: its implicit `<mathInput>` and a `response` per input
/// its whens read. Makes elements; plans nothing (ADR 0030).
impl Outlining<'_> {
    /// Add every answer's synthetic children, in the order the walk made
    /// the answers, after every element the walk and the container copies
    /// made.
    pub(super) fn add_answer_children(&mut self) {
        let made = self.work.to_plan.clone();
        let answers: Vec<(TemplateId, ElemId)> = made
            .into_iter()
            .filter(|&(t, e)| {
                let el = &self.outlined(t).elems[e.index()];
                el.component_type.def().machinery == Some(Machinery::Answer)
                    && !el.cloned
                    && el.node != NodeId::NONE
            })
            .collect();
        for (t, e) in answers {
            // An answer the planner refuses is boxed then; what is made
            // for it here dies with it.
            let _ = self.add_answer_children_of(t, e);
        }
    }

    /// Add answer `e`'s synthetic children. Stops early where the answer's
    /// planner would refuse it.
    fn add_answer_children_of(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.dast;
        let el = self.outlined(t).elems[e.index()].node;
        // An answer of `<choice>`s holds its input already (ADR 0088).
        if self.rd().elem_children(t, e).into_iter().any(|k| {
            self.outlined(t).elems[k.index()]
                .component_type
                .plays(Role::ImplicitChoiceInput)
                && self.outlined(t).elems[k.index()].node == NodeId::NONE
        }) {
            return Ok(());
        }
        let text_answer =
            self.rd().reject_answer_attrs(el)? || self.rd().answer_text_child(t, e, el).is_some();
        // A boolean answer with no input of its own checks one it makes
        // (ADR 0077).
        if self.rd().answer_is_boolean(t, e, el) {
            let has_input = self.rd().elem_children(t, e).into_iter().any(|k| {
                self.outlined(t).elems[k.index()]
                    .component_type
                    .response()
                    .is_some()
            });
            if !has_input {
                self.add_implicit_input(t, e, Role::ImplicitBooleanInput);
            }
            return Ok(());
        }
        // A text answer with no input of its own types into one it makes
        // (ADR 0067).
        if text_answer {
            let has_input = self.rd().elem_children(t, e).into_iter().any(|k| {
                self.outlined(t).elems[k.index()]
                    .component_type
                    .response()
                    .is_some()
            });
            if !has_input {
                self.add_implicit_input(t, e, Role::ImplicitTextInput);
            }
            return Ok(());
        }
        let mut inputs = Vec::new();
        let mut awards = Vec::new();
        for k in self.rd().elem_children(t, e) {
            if self
                .rd()
                .is_presentation_child(self.outlined(t).elems[k.index()].node)
            {
                continue;
            }
            match self.outlined(t).elems[k.index()].component_type {
                ty if matches!(ty.response(), Some(ResponseKind::Index(_))) => return Ok(()),
                ty if ty.response().is_some() => inputs.push(k),
                ty if ty.plays(Role::Award) => awards.push(k),
                _ => return Ok(()),
            }
        }
        let mut forms = Vec::with_capacity(awards.len());
        for &a in &awards {
            forms.push(self.rd().award_form(&self.ar, t, a)?);
        }
        let needs_input =
            !self.rd().content_nodes(el).is_empty() || forms.iter().any(|f| f.when.is_none());
        if needs_input && d.attr(el, "response").is_none() && inputs.is_empty() {
            self.add_implicit_input(t, e, Role::ImplicitInput);
        }
        let mut keys = Vec::new();
        for form in &forms {
            let Some((w, w_el)) = form.when else {
                continue;
            };
            if d.children(w_el)
                .iter()
                .any(|&n| d.kind(n) == NodeKind::Element)
            {
                return Ok(());
            }
            for m in self.rd().content_nodes(w_el) {
                if d.kind(m) != NodeKind::Macro {
                    continue;
                }
                let p = Reader::new(self.dast, &self.settled).plan_ref(&mut self.ar, t, w, m)?;
                self.settled.when_refs.insert(m, p);
                if let Some((key, _)) = self.rd().input_named(&self.ar, t, p) {
                    let r = match keys.iter().find(|(k, _)| *k == key) {
                        Some(&(_, r)) => r,
                        None => {
                            let r = self.add_response(t, e);
                            keys.push((key, r));
                            self.settled
                                .answer_responses
                                .entry((t, e))
                                .or_default()
                                .push((key, r));
                            r
                        }
                    };
                    // The `$mi` stands for the submitted copy, from here on.
                    self.settled.submitted.insert(m, r);
                }
            }
        }
        Ok(())
    }

    /// Add a `response` child to answer `e`.
    fn add_response(&mut self, t: TemplateId, e: ElemId) -> ElemId {
        let r = self
            .push_elem(t, NodeId::NONE, Role::Response.ty(), StrId::NONE, e)
            .expect("unnamed");
        self.outlined_mut(t).elems[e.index()]
            .children
            .push(Child::Elem(r));
        r
    }

    /// The children of answer `e` (at `el`) whose content is the
    /// `<choice>`s `choices` alone (ADR 0088): its presentation children,
    /// then the `<choiceInput>` the choices are sugar for, made here with
    /// no source of its own and the choices as its children, which the
    /// answer plans from its own attributes (`shuffleOrder`,
    /// `preserveLastChoice`), as the current core wraps them.
    pub(super) fn add_answer_choice_input(
        &mut self,
        t: TemplateId,
        e: ElemId,
        el: NodeId,
        choices: &[NodeId],
    ) -> Vec<Child> {
        let d = self.dast;
        let ci = self
            .push_elem(
                t,
                NodeId::NONE,
                Role::ImplicitChoiceInput.ty(),
                StrId::NONE,
                e,
            )
            .expect("unnamed");
        let mut kids = Vec::new();
        for &n in d.children(el) {
            if self.rd().is_presentation_child(n) {
                kids.push(Child::Elem(self.add_elem(t, n, e)));
            }
        }
        let options = choices
            .iter()
            .map(|&n| Child::Elem(self.add_elem(t, n, ci)))
            .collect();
        self.outlined_mut(t).elems[ci.index()].children = options;
        kids.push(Child::Elem(ci));
        kids
    }

    /// Add the input DoenetML sugars into an answer that names none (the
    /// type playing `role`: a `<mathInput>`, or a text answer's
    /// `<textInput>`): an unbound input, first among the answer's children.
    fn add_implicit_input(&mut self, t: TemplateId, e: ElemId, role: Role) {
        let mi = self
            .push_elem(t, NodeId::NONE, role.ty(), StrId::NONE, e)
            .expect("unnamed");
        self.outlined_mut(t).elems[e.index()]
            .children
            .insert(0, Child::Elem(mi));
    }
}
