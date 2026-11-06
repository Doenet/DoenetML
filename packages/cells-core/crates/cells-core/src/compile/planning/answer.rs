//! `<answer>`: what it checks and against which response.
//!
//! The forms, as DoenetML sugars them:
//!
//! - `<answer response="$mi">x</answer>`: the response is the named
//!   input's expression; `x` is the correct expression.
//! - `<answer>x</answer>`: the answer owns an implicit `<mathInput>`,
//!   a synthetic child outlining makes.
//! - `<answer><mathInput name="mi"/>x</answer>`: the input child is the
//!   response.
//! - `<answer><award>x</award><award credit="0.5">y</award></answer>`:
//!   each award compares the submitted response with its content; the
//!   response is as above (an implicit input when nothing names one).
//! - `<answer><award><when>$mi = x</when></award></answer>`: each award
//!   holds when its condition does. A `$mi` naming an input stands for the
//!   answer's *submitted* copy of that input (a `response` component,
//!   one per input referenced, which outlining makes), so credit changes
//!   only on submit. No implicit input is made.
//!
//! In every form `credit` is what a submit earns: equality with `correct`,
//! or the most any award gives (`credit` × holds). Other content is
//! refused, never left blank.

use crate::compile::answer::AwardForm;
use crate::compile::*;
use crate::components::prop::{
    answer, award, choice, choice_input, math_input, response, text_input, when,
};
use crate::limits::MAX_CHOICES;

/// Planning, `<answer>`: its response, awards and credit. Reads the record and
/// what outlining settled, never another element's plan (ADR 0029).
impl<'a> Compiler<'a> {
    pub(in crate::compile) fn plan_answer(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.outlined(t).elems[e.index()];
        let text_answer = self.rd().reject_answer_attrs(el)?;
        let mut inputs = Vec::new();
        let mut awards = Vec::new();
        // The synthetic children outlining made are planned below.
        for k in self.rd().elem_children(t, e) {
            if self.outlined(t).elems[k.index()].node == NodeId::NONE {
                continue;
            }
            match self.outlined(t).elems[k.index()].component_type {
                ComponentType::MathInput
                | ComponentType::BooleanInput
                | ComponentType::TextInput
                | ComponentType::ChoiceInput => inputs.push(k),
                ComponentType::Award => awards.push(k),
                other => {
                    return Err(Error::Unsupported(format!(
                        "a <{}> inside an <answer>",
                        other.tag()
                    )));
                }
            }
        }
        let text_nodes = self.rd().content_nodes(el);
        // A choice input: the submitted index earns its choice's credit.
        if let [ci] = inputs.as_slice()
            && self.outlined(t).elems[ci.index()].component_type == ComponentType::ChoiceInput
        {
            if !text_nodes.is_empty() || !awards.is_empty() {
                return Err(Error::Unsupported(
                    "an <answer> with a <choiceInput> and content or awards".into(),
                ));
            }
            return self.plan_choice_answer(t, e, el, *ci);
        }
        if text_answer {
            return self.plan_text_answer(t, e, el, &inputs, &awards);
        }
        if inputs
            .iter()
            .any(|&k| self.outlined(t).elems[k.index()].component_type == ComponentType::TextInput)
        {
            return Err(Error::Unsupported(
                "a <textInput> in an <answer> that is not type=\"text\"".into(),
            ));
        }
        if !text_nodes.is_empty() && !awards.is_empty() {
            return Err(Error::Unsupported(
                "an <answer> with both content and <award> children".into(),
            ));
        }
        if text_nodes.is_empty() && awards.is_empty() {
            return Err(Error::Unsupported(
                "an <answer> with nothing to check".into(),
            ));
        }
        let mut forms = Vec::with_capacity(awards.len());
        for &a in &awards {
            forms.push(self.rd().award_form(t, a)?);
        }
        // An award comparing an expression needs a response to compare.
        let needs_input = !text_nodes.is_empty() || forms.iter().any(|f| f.when.is_none());

        let ports = answer::Props::PORTS;
        let mut wiring = ElemWiring::of(ComponentType::Answer);
        let response_attr = d.attr(el, "response");
        let mut response = match (needs_input, response_attr, inputs.as_slice()) {
            (true, Some(a), []) => self.rd().plan_value(
                &mut self.ar,
                t,
                scope,
                "response",
                d.attr_children(a),
                Some("expr"),
            )?,
            (true, Some(_), _) => {
                return Err(Error::Unsupported(
                    "an <answer> with both response= and an input child".into(),
                ));
            }
            (true, None, [mi]) => {
                if self.outlined(t).elems[mi.index()].component_type != ComponentType::MathInput {
                    return Err(Error::Unsupported(
                        "an <answer> comparing a <booleanInput>: <answer type=\"boolean\">".into(),
                    ));
                }
                Source::alias(Arg::Elem(*mi, math_input::Props::PORTS.expr))
            }
            (true, None, []) => {
                let mi = self.plan_implicit_input(t, e)?;
                Source::alias(Arg::Elem(mi, math_input::Props::PORTS.expr))
            }
            (true, None, _) => {
                return Err(Error::Unsupported(
                    "an <answer> with several input children".into(),
                ));
            }
            (false, Some(_), _) => {
                return Err(Error::Unsupported(
                    "response= on an <answer> whose awards have a <when>".into(),
                ));
            }
            // Set from the first referenced input below.
            (false, None, _) => Source::absent(),
        };
        let correct = if text_nodes.is_empty() {
            Source::absent()
        } else {
            let id = self
                .rd()
                .plan_sym_math(&mut self.ar, t, scope, &text_nodes)?;
            Source::sym_expr(id, Post::None)
        };
        let mut submitted = Source::Leaf(Leaf::GivenMath(None));
        let weight = self.plan_weight(t, e, el)?;

        if forms.is_empty() {
            let eq = self.equals_op(&[el]);
            wiring.set_public_sources(answer::Props {
                response,
                correct,
                submitted,
                credit: Source::computed(OpSpec::Sym(eq), vec![ports.submitted, ports.correct]),
                weight,
                numSubmissions: Source::given(0.0),
            });
            self.tables[t.index()].plans[e.index()].props = wiring.finish().0;
            return Ok(());
        }

        // Awards. Inputs the whens reference get a `response` child each.
        let mut responses: Vec<((u32, ElemId), ElemId)> = Vec::new();
        for form in &forms {
            self.plan_award(t, e, el, form, &mut responses)?;
        }
        let awards: Vec<ElemId> = forms.iter().map(|f| f.e).collect();
        let best = best_award(&mut wiring, &awards);
        if !needs_input && let Some(&(_, r)) = responses.first() {
            response = Source::alias(Arg::Elem(r, response::Props::PORTS.response));
            submitted = Source::alias(Arg::Elem(r, response::Props::PORTS.submitted));
        }
        wiring.set_public_sources(answer::Props {
            response,
            correct,
            submitted,
            credit: Source::own(best),
            weight,
            numSubmissions: Source::given(0.0),
        });
        self.tables[t.index()].plans[e.index()].props = wiring.finish().0;
        Ok(())
    }

    /// An answer's `weight` (1 when omitted), its references looked up from
    /// the answer's scope like any other attribute's.
    fn plan_weight(&mut self, t: TemplateId, e: ElemId, el: NodeId) -> Result<Source> {
        let d = self.dast;
        let scope = self.outlined(t).elems[e.index()].name_scope;
        Ok(match d.attr(el, "weight") {
            Some(a) => {
                self.rd()
                    .plan_value(&mut self.ar, t, scope, "weight", d.attr_children(a), None)?
            }
            None => Source::constant(1.0),
        })
    }

    /// `<answer><choiceInput>...</choiceInput></answer>`: the response is
    /// the chosen index, the submitted copy is its own cell, and the credit
    /// is the submitted choice's `credit` (0 while nothing is chosen).
    fn plan_choice_answer(
        &mut self,
        t: TemplateId,
        e: ElemId,
        el: NodeId,
        ci: ElemId,
    ) -> Result<()> {
        let choices: Vec<ElemId> = self
            .rd()
            .elem_children(t, ci)
            .into_iter()
            .filter(|&k| self.outlined(t).elems[k.index()].component_type == ComponentType::Choice)
            .collect();
        if choices.is_empty() || choices.len() > MAX_CHOICES {
            return Err(Error::Unsupported(format!(
                "a <choiceInput> with {} choices",
                choices.len()
            )));
        }
        let ports = answer::Props::PORTS;
        let mut wiring = ElemWiring::of(ComponentType::Answer);
        let weight = self.plan_weight(t, e, el)?;
        let mut args = vec![Arg::Own(ports.submitted)];
        args.extend(
            choices
                .iter()
                .map(|&c| Arg::Elem(c, choice::Props::PORTS.credit)),
        );
        let chosen = wiring.hidden(Source::op(
            OpSpec::Vec(VecOp::Choose {
                n: byte(choices.len()),
            }),
            args,
        ));
        wiring.set_public_sources(answer::Props {
            response: Source::alias(Arg::Elem(ci, choice_input::Props::PORTS.selectedIndex)),
            correct: Source::absent(),
            submitted: Source::given(0.0),
            credit: Source::computed_k(OpSpec::NanTo, chosen, 0.0),
            weight,
            numSubmissions: Source::given(0.0),
        });
        self.tables[t.index()].plans[e.index()].props = wiring.finish().0;
        Ok(())
    }

    /// `<answer type="text">`: a `<textInput>` child's value is the
    /// response (a string id); the submitted copy is compared with each
    /// award's literal text, trimmed, by id.
    fn plan_text_answer(
        &mut self,
        t: TemplateId,
        e: ElemId,
        el: NodeId,
        inputs: &[ElemId],
        awards: &[ElemId],
    ) -> Result<()> {
        let d = self.dast;
        let ti = match inputs {
            [ti] if self.outlined(t).elems[ti.index()].component_type
                == ComponentType::TextInput =>
            {
                *ti
            }
            _ => {
                return Err(Error::Unsupported(
                    "<answer type=\"text\"> needs one <textInput> child".into(),
                ));
            }
        };
        if awards.is_empty() {
            return Err(Error::Unsupported(
                "<answer type=\"text\"> without <award> children".into(),
            ));
        }
        let mut wiring = ElemWiring::of(ComponentType::Answer);
        let weight = self.plan_weight(t, e, el)?;
        let mut planned: Vec<ElemId> = Vec::new();
        for &a in awards {
            let form = self.rd().award_form(t, a)?;
            if form.when.is_some() {
                return Err(Error::Unsupported(
                    "a <when> in an <award> of a text answer".into(),
                ));
            }
            let mut text = String::new();
            for &n in &form.nodes {
                if d.kind(n) != NodeKind::Text {
                    return Err(Error::Unsupported(
                        "a reference in an <award> of a text answer".into(),
                    ));
                }
                text.push_str(d.str(n));
            }
            let id = self.ar.intern_literal(self.dast, text.trim()).to_value();
            let mut award_wiring = ElemWiring::of(ComponentType::Award);
            let credit = self.award_credit(t, a, form.el)?;
            let correct = award_wiring.hidden(Source::constant(id));
            let holds = award_wiring.hidden(Source::op(
                OpSpec::Eq,
                vec![
                    Arg::Elem(e, answer::Props::PORTS.submitted),
                    Arg::Own(correct),
                ],
            ));
            award_wiring.set_public_sources(award::Props {
                credit,
                awarded: Source::computed(OpSpec::Mul, vec![award::Props::PORTS.credit, holds]),
            });
            self.tables[t.index()].plans[a.index()].props = award_wiring.finish().0;
            planned.push(a);
        }
        let best = best_award(&mut wiring, &planned);
        wiring.set_public_sources(answer::Props {
            response: Source::alias(Arg::Elem(ti, text_input::Props::PORTS.value)),
            correct: Source::absent(),
            submitted: Source::Leaf(Leaf::GivenText(None)),
            credit: Source::own(best),
            weight,
            numSubmissions: Source::given(0.0),
        });
        self.tables[t.index()].plans[e.index()].props = wiring.finish().0;
        Ok(())
    }

    /// `awarded` of one award: its `credit` times whether it holds.
    fn plan_award(
        &mut self,
        t: TemplateId,
        answer_e: ElemId,
        answer_el: NodeId,
        form: &AwardForm,
        responses: &mut Vec<((u32, ElemId), ElemId)>,
    ) -> Result<()> {
        let d = self.dast;
        let mut wiring = ElemWiring::of(ComponentType::Award);
        let credit = self.award_credit(t, form.e, form.el)?;
        let compare = self.compare_attrs(&[form.el, answer_el]);
        let holds = match form.when {
            Some((w, w_el)) => {
                let nodes = self.rd().content_nodes(w_el);
                if let Some(&n) = d
                    .children(w_el)
                    .iter()
                    .find(|&&n| d.kind(n) == NodeKind::Element)
                {
                    return Err(Error::Unsupported(format!(
                        "a <{}> inside a <when>",
                        d.str(n)
                    )));
                }
                // Each input a `$mi` names has a response, planned once.
                for &m in nodes.iter().filter(|&&n| d.kind(n) == NodeKind::Macro) {
                    // Planned when outlining made the responses.
                    let p = match self.settled().when_refs.get(&m) {
                        Some(&p) => p,
                        None => self.rd().plan_ref(&mut self.ar, t, w, m)?,
                    };
                    if let Some((key, input_type)) = self.rd().input_named(&self.ar, t, p)
                        && !responses.iter().any(|(k, _)| *k == key)
                    {
                        let r = self.outlined_response(t, answer_e, key)?;
                        self.plan_response(t, r, p, input_type);
                        responses.push((key, r));
                    }
                }
                // Each such `$mi` is planned as its response when the
                // condition plans it (`Settled::submitted`).
                let mut when_wiring = ElemWiring::of(ComponentType::When);
                let port = self.plan_condition_content(t, w, &nodes, compare, &mut when_wiring)?;
                when_wiring.set_public_sources(when::Props {
                    value: Source::own(port),
                });
                self.tables[t.index()].plans[w.index()].props = when_wiring.finish().0;
                wiring.hidden(Source::alias(Arg::Elem(w, when::Props::PORTS.value)))
            }
            None => {
                let id = self
                    .rd()
                    .plan_sym_math(&mut self.ar, t, form.e, &form.nodes)?;
                let correct = wiring.hidden(Source::sym_expr(id, Post::None));
                wiring.hidden(Source::op(
                    OpSpec::Sym(compare.equals()),
                    vec![
                        Arg::Elem(answer_e, answer::Props::PORTS.submitted),
                        Arg::Own(correct),
                    ],
                ))
            }
        };
        wiring.set_public_sources(award::Props {
            credit,
            awarded: Source::computed(OpSpec::Mul, vec![award::Props::PORTS.credit, holds]),
        });
        self.tables[t.index()].plans[form.e.index()].props = wiring.finish().0;
        Ok(())
    }

    /// An award's `credit`: what the attribute says (1 without one), which
    /// is not state, so a literal is a constant.
    fn award_credit(&mut self, t: TemplateId, a: ElemId, el: NodeId) -> Result<Source> {
        let d = self.dast;
        Ok(match d.attr(el, "credit") {
            Some(c) => match self.rd().plan_value(
                &mut self.ar,
                t,
                a,
                "credit",
                d.attr_children(c),
                None,
            )? {
                Source::Leaf(Leaf::Given(v)) => Source::constant(v),
                p => p,
            },
            None => Source::constant(1.0),
        })
    }

    /// The `response` outlining made in answer `e` for the input `key`
    /// names.
    fn outlined_response(&self, t: TemplateId, e: ElemId, key: (u32, ElemId)) -> Result<ElemId> {
        self.settled()
            .answer_responses
            .get(&(t, e))
            .and_then(|rs| rs.iter().find(|(k, _)| *k == key))
            .map(|&(_, r)| r)
            .ok_or_else(|| Error::Internal("a response outlining did not make".into()))
    }

    /// Response `r` for the input plan `p` names: its live expression (or
    /// a boolean input's value), the submitted copy, and the copy's value.
    fn plan_response(&mut self, t: TemplateId, r: ElemId, p: RefId, input_type: ComponentType) {
        let mut live = self.ar.refs[p.index()].clone();
        let math = input_type == ComponentType::MathInput;
        let name = if math { "expr" } else { "value" };
        live.prop = RefProp::named(input_type, name);
        debug_assert!(live.prop.is_some(), "an input has its value prop");
        let live = Source::reference(self.ar.push_ref(live));
        let submitted_port = response::Props::PORTS.submitted;
        let (submitted, value) = if math {
            (
                Source::Leaf(Leaf::GivenMath(None)),
                Source::computed(OpSpec::Sym(SymKind::Evaluate), vec![submitted_port]),
            )
        } else {
            (Source::given(0.0), Source::own(submitted_port))
        };
        self.tables[t.index()].plans[r.index()].props = response::Props {
            response: live,
            submitted,
            value,
        }
        .into_vec();
    }

    /// Plans answer `e`'s implicit input, which outlining made.
    fn plan_implicit_input(&mut self, t: TemplateId, e: ElemId) -> Result<ElemId> {
        let mi = self
            .rd()
            .elem_children(t, e)
            .into_iter()
            .find(|&k| {
                let el = &self.outlined(t).elems[k.index()];
                el.node == NodeId::NONE && el.component_type == ComponentType::MathInput
            })
            .ok_or_else(|| Error::Internal("an implicit input outlining did not make".into()))?;
        self.tables[t.index()].plans[mi.index()].props = math_input::Props {
            value: Source::computed(
                OpSpec::Sym(SymKind::Evaluate),
                vec![math_input::Props::PORTS.expr],
            ),
            expr: Source::Leaf(Leaf::GivenMath(None)),
        }
        .into_vec();
        Ok(mi)
    }

    /// The equality an answer or award compares with.
    fn equals_op(&self, els: &[NodeId]) -> SymKind {
        self.compare_attrs(els).equals()
    }
}

/// The best of an answer's awards: the largest `awarded` among them, as a
/// hidden port of `wiring`, folded pairwise.
fn best_award(wiring: &mut ElemWiring, awards: &[ElemId]) -> Port {
    let mut best = None;
    for &a in awards {
        let awarded = wiring.hidden(Source::alias(Arg::Elem(a, award::Props::PORTS.awarded)));
        best = Some(match best {
            None => awarded,
            Some(b) => wiring.hidden(Source::computed(OpSpec::Max, vec![b, awarded])),
        });
    }
    best.expect("an award")
}
