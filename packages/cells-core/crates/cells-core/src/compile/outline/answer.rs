//! An answer's synthetic children, made when outlining (ADR 0030): its
//! implicit `<mathInput>` and a `response` per input its whens read. The
//! answer's planner (`planning/answer.rs`) plans them.

use crate::compile::*;

impl Compiler<'_> {
    /// The end of outlining (ADR 0030): every answer's synthetic children,
    /// its implicit `<mathInput>` and a `response` per input its whens
    /// read, in the order the walk made the answers. They follow every
    /// element the walk and the container copies made.
    pub(in crate::compile) fn add_answer_children(&mut self) {
        let made = self.outlining().work.to_plan.clone();
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

    /// `add_answer_children` for answer `e`, deciding as `plan_answer`
    /// does. Where the planner refuses the answer, this stops early.
    fn add_answer_children_of(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.dast;
        let el = self.outlined(t).elems[e.index()].node;
        if self.reject_answer_attrs(el)? {
            return Ok(());
        }
        let mut inputs = Vec::new();
        let mut awards = Vec::new();
        for k in self.elem_children(t, e) {
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
            forms.push(self.award_form(t, a)?);
        }
        let needs_input =
            !self.content_nodes(el).is_empty() || forms.iter().any(|f| f.when.is_none());
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
            for m in self.content_nodes(w_el) {
                if d.kind(m) != NodeKind::Macro {
                    continue;
                }
                let p = self.plan_ref(t, w, m)?;
                self.outlining().work.settled.when_refs.insert(m, p);
                if let Some((key, _)) = self.input_named(t, p) {
                    let r = match keys.iter().find(|(k, _)| *k == key) {
                        Some(&(_, r)) => r,
                        None => {
                            let r = self.add_response(t, e);
                            keys.push((key, r));
                            self.outlining()
                                .work
                                .settled
                                .answer_responses
                                .entry((t.get(), e.get()))
                                .or_default()
                                .push((key, r));
                            r
                        }
                    };
                    // The `$mi` stands for the submitted copy, from here on.
                    self.outlining().work.settled.submitted.insert(m, r);
                }
            }
        }
        Ok(())
    }

    /// A `response` child of answer `e`, which its planner plans
    /// (`plan_response`).
    fn add_response(&mut self, t: TemplateId, e: ElemId) -> ElemId {
        let r = self
            .push_elem(t, NodeId::NONE, ComponentType::Response, StrId::NONE, e)
            .expect("unnamed");
        self.outlined_mut(t).elems[e.index()]
            .children
            .push(Child::Elem(r));
        r
    }

    /// The `<mathInput>` DoenetML sugars into an answer that names no
    /// input: an unbound input, first among the answer's children, which
    /// its planner plans (`plan_implicit_input`).
    fn add_implicit_input(&mut self, t: TemplateId, e: ElemId) {
        let mi = self
            .push_elem(t, NodeId::NONE, ComponentType::MathInput, StrId::NONE, e)
            .expect("unnamed");
        self.outlined_mut(t).elems[e.index()]
            .children
            .insert(0, Child::Elem(mi));
    }
}
