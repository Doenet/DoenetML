//! An answer's synthetic children, made when outlining: its implicit
//! `<mathInput>` and a `response` per input its whens read.

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
                el.component_type == ComponentType::Answer && !el.cloned && el.node != NodeId::NONE
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
        if self.rd().reject_answer_attrs(el)? {
            return Ok(());
        }
        let mut inputs = Vec::new();
        let mut awards = Vec::new();
        for k in self.rd().elem_children(t, e) {
            match self.outlined(t).elems[k.index()].component_type {
                ComponentType::ChoiceInput => return Ok(()),
                ComponentType::MathInput
                | ComponentType::BooleanInput
                | ComponentType::TextInput => inputs.push(k),
                ComponentType::Award => awards.push(k),
                _ => return Ok(()),
            }
        }
        let mut forms = Vec::with_capacity(awards.len());
        for &a in &awards {
            forms.push(self.rd().award_form(t, a)?);
        }
        let needs_input =
            !self.rd().content_nodes(el).is_empty() || forms.iter().any(|f| f.when.is_none());
        if needs_input && d.attr(el, "response").is_none() && inputs.is_empty() {
            self.add_implicit_input(t, e);
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
            .push_elem(t, NodeId::NONE, ComponentType::Response, StrId::NONE, e)
            .expect("unnamed");
        self.outlined_mut(t).elems[e.index()]
            .children
            .push(Child::Elem(r));
        r
    }

    /// Add the `<mathInput>` DoenetML sugars into an answer that names no
    /// input: an unbound input, first among the answer's children.
    fn add_implicit_input(&mut self, t: TemplateId, e: ElemId) {
        let mi = self
            .push_elem(t, NodeId::NONE, ComponentType::MathInput, StrId::NONE, e)
            .expect("unnamed");
        self.outlined_mut(t).elems[e.index()]
            .children
            .insert(0, Child::Elem(mi));
    }
}
