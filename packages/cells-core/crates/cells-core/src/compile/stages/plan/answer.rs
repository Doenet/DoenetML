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

use super::Planning;
use crate::compile::*;
use crate::components::prop::{
    answer, award, boolean, boolean_input, choice, choice_input, math_input, response, text_input,
    when,
};
use crate::limits::MAX_CHOICES;

/// Planning, `<answer>`: its response, awards and credit. Reads the record and
/// what outlining settled, never another element's plan (ADR 0029).
impl<'a> Planning<'a> {
    pub(super) fn plan_answer(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.rd.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = *self.rd.own_row(t, e);
        // An extend of an answer would be the same answer again (REF-7);
        // planned from its own children it was a second answer graded on
        // its own, with no diagnostic. Refused until it is the same one.
        if d.attr_peek(el, "extend").is_some() {
            return Err(Error::Banned(
                "extend on an <answer>: reference its properties instead, as $a.creditAchieved"
                    .into(),
            ));
        }
        let typed_text = self.rd.reject_answer_attrs(el)?;
        let credited = self.rd.num_awards_credited(el)?;
        let text_child = self.rd.answer_text_child(t, e, el);
        let text_answer = typed_text || text_child.is_some();
        let boolean_answer = !text_answer && self.rd.answer_is_boolean(t, e, el);
        let mut inputs = Vec::new();
        let mut awards = Vec::new();
        // The synthetic children outlining made are planned below.
        for k in self.rd.elem_children(t, e) {
            let node = self.rd.owned_row(t, e, k).node;
            // A `<label>` is the answer's, and the input it makes shows it
            // (ADR 0077); a `<shortDescription>` the same.
            if node == NodeId::NONE || self.rd.is_presentation_child(node) {
                continue;
            }
            match self.rd.owned_row(t, e, k).component_type {
                ty if ty.response().is_some() => inputs.push(k),
                ty if ty.plays(Role::Award) => awards.push(k),
                // The text a text answer compares with (ADR 0067).
                _ if text_child == Some(self.rd.owned_row(t, e, k).node) => {}
                // The boolean a boolean answer compares with (ADR 0077).
                ty if boolean_answer && ty.plays(Role::BooleanValue) => {}
                other => {
                    return Err(Error::Unsupported(format!(
                        "a <{}> inside an <answer>",
                        other.tag()
                    )));
                }
            }
        }
        let text_nodes = self.rd.content_nodes(el);
        // A choice input: the submitted index earns its choice's credit.
        if let [ci] = inputs.as_slice()
            && matches!(
                self.rd.owned_row(t, e, *ci).component_type.response(),
                Some(ResponseKind::Index(_))
            )
        {
            if !text_nodes.is_empty() || !awards.is_empty() {
                return Err(Error::Unsupported(
                    "an <answer> with a <choiceInput> and content or awards".into(),
                ));
            }
            return self.plan_choice_answer(t, e, el, *ci);
        }
        if text_answer {
            return self.plan_text_answer(t, e, el, text_child, &inputs, &awards);
        }
        if boolean_answer {
            return self.plan_boolean_answer(t, e, el, &inputs, &awards, credited);
        }
        if inputs.iter().any(|&k| {
            matches!(
                self.rd.owned_row(t, e, k).component_type.response(),
                Some(ResponseKind::Text(_))
            )
        }) {
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
            forms.push(self.rd.award_form(&self.ar, t, a)?);
        }
        // An award comparing an expression needs a response to compare.
        let needs_input = !text_nodes.is_empty() || forms.iter().any(|f| f.when.is_none());

        let ports = answer::Props::PORTS;
        let mut wiring = ElemWiring::of(self.rd.own_row(t, e).component_type);
        let response_attr = d.attr(el, "response");
        let mut response = match (needs_input, response_attr, inputs.as_slice()) {
            (true, Some(a), []) => self.rd.plan_value(
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
                // The expression the input declares its response
                // (`response: Math(expr)`): a mathInput's, a fractionInput's.
                let Some(ResponseKind::Math(expr)) =
                    self.rd.owned_row(t, e, *mi).component_type.response()
                else {
                    return Err(Error::Unsupported(
                        "an <answer> comparing a <booleanInput>: <answer type=\"boolean\">".into(),
                    ));
                };
                Source::alias(Arg::Elem(*mi, Port::table(expr)))
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
            let id = self.rd.plan_sym_math(&mut self.ar, t, scope, &text_nodes)?;
            Source::sym_expr(id, Post::None)
        };
        let mut submitted = Source::Leaf(Leaf::GivenMath(None));
        let weight = self.plan_weight(t, e, el)?;

        if forms.is_empty() {
            let eq = self.equals_op(&[el])?;
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
        let best = credited_awards(&mut wiring, &awards, credited);
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
        let d = self.rd.dast;
        let scope = self.rd.own_row(t, e).name_scope;
        Ok(match d.attr(el, "weight") {
            Some(a) => {
                self.rd
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
            .rd
            .elem_children(t, ci)
            .into_iter()
            .filter(|&k| {
                self.rd
                    .owned_row(t, e, k)
                    .component_type
                    .plays(Role::Choice)
            })
            .collect();
        if choices.is_empty() || choices.len() > MAX_CHOICES {
            return Err(Error::Unsupported(format!(
                "a <choiceInput> with {} choices",
                choices.len()
            )));
        }
        let ports = answer::Props::PORTS;
        let mut wiring = ElemWiring::of(self.rd.own_row(t, e).component_type);
        let weight = self.plan_weight(t, e, el)?;
        // The submitted index is a choice's place as shown: with
        // `shuffleOrder` the choice there is the one `choiceOrder` names
        // (ADR 0053), as the current core's `childIndicesSelected`.
        let shuffled = self
            .parsed
            .record_ref(t, ci)
            .is_some_and(|r| choice_input::Attrs::of(r).shuffleOrder);
        let submitted = if shuffled {
            let first = self.rd.owned_row(t, e, ci).component_type.prop_defs().len();
            let mut order = vec![Arg::Own(ports.submitted)];
            order.extend((0..choices.len()).map(|k| Arg::Elem(ci, Port::table(first + k))));
            Arg::Own(wiring.hidden(Source::op(
                OpSpec::Vec(VecOp::Choose {
                    n: byte(choices.len()),
                }),
                order,
            )))
        } else {
            Arg::Own(ports.submitted)
        };
        let mut args = vec![submitted];
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
    /// response (a string id), or, with none, the value of the one the
    /// answer makes (ADR 0067); the submitted copy is compared with the
    /// answer's content, literal text or one reference, or with each
    /// award's literal text, as the current core compares texts
    /// (`SymKind::TextEquals`).
    fn plan_text_answer(
        &mut self,
        t: TemplateId,
        e: ElemId,
        el: NodeId,
        text_child: Option<NodeId>,
        inputs: &[ElemId],
        awards: &[ElemId],
    ) -> Result<()> {
        let credited = self.rd.num_awards_credited(el)?;
        let ti = match inputs {
            [ti] if matches!(
                self.rd.owned_row(t, e, *ti).component_type.response(),
                Some(ResponseKind::Text(_))
            ) =>
            {
                *ti
            }
            [] => self.plan_implicit_text_input(t, e)?,
            _ => {
                return Err(Error::Unsupported(
                    "<answer type=\"text\"> with an input other than one <textInput>".into(),
                ));
            }
        };
        let equals = OpSpec::Sym(SymKind::TextEquals {
            case_insensitive: self.rd.attr_on(el, "caseInsensitiveMatch"),
        });
        // A `<text>` child's content is the answer's (ADR 0067).
        let content_el = text_child.unwrap_or(el);
        let content = self.rd.content_nodes(content_el);
        let mut wiring = ElemWiring::of(self.rd.own_row(t, e).component_type);
        let weight = self.plan_weight(t, e, el)?;
        if awards.is_empty() {
            if content.is_empty() {
                return Err(Error::Unsupported(
                    "an <answer type=\"text\"> with nothing to check".into(),
                ));
            }
            let scope = self.rd.own_row(t, e).name_scope;
            let correct = self.plan_text_content(t, scope, &mut wiring, content_el)?;
            let ports = answer::Props::PORTS;
            wiring.set_public_sources(answer::Props {
                response: Source::alias(Arg::Elem(ti, text_input::Props::PORTS.value)),
                correct: Source::absent(),
                submitted: Source::Leaf(Leaf::GivenText(None)),
                credit: Source::computed(equals, vec![ports.submitted, correct]),
                weight,
                numSubmissions: Source::given(0.0),
            });
            self.tables[t.index()].plans[e.index()].props = wiring.finish().0;
            return Ok(());
        }
        if !content.is_empty() {
            return Err(Error::Unsupported(
                "an <answer type=\"text\"> with both content and <award> children".into(),
            ));
        }
        let mut planned: Vec<ElemId> = Vec::new();
        for &a in awards {
            let form = self.rd.award_form(&self.ar, t, a)?;
            if form.when.is_some() {
                return Err(Error::Unsupported(
                    "a <when> in an <award> of a text answer".into(),
                ));
            }
            if form.boolean.is_some() {
                return Err(Error::Unsupported("a <boolean> inside an <award>".into()));
            }
            let mut award_wiring = ElemWiring::of(Role::Award.ty());
            let scope = self.rd.own_row(t, e).name_scope;
            let correct = self.plan_text_content(t, scope, &mut award_wiring, form.content_el)?;
            let credit = self.award_credit(t, a, &form.attr_els())?;
            let credit = clamp_credit(&mut award_wiring, credit);
            let holds = award_wiring.hidden(Source::op(
                equals,
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
        let best = credited_awards(&mut wiring, &planned, credited);
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

    /// A boolean answer (ADR 0077): a `<booleanInput>` child's value is
    /// the response, or, with none, the value of the one the answer makes;
    /// the submitted copy is compared with the answer's content (a
    /// condition, `not $b`, or a lone `<boolean>` child), or with each
    /// award's: credit when they are both true or both false.
    fn plan_boolean_answer(
        &mut self,
        t: TemplateId,
        e: ElemId,
        el: NodeId,
        inputs: &[ElemId],
        awards: &[ElemId],
        credited: u8,
    ) -> Result<()> {
        let value = boolean_input::Props::PORTS.value;
        let bi = match inputs {
            [bi] if matches!(
                self.rd.owned_row(t, e, *bi).component_type.response(),
                Some(ResponseKind::Boolean(_))
            ) =>
            {
                *bi
            }
            [] => {
                let bi = self
                    .rd
                    .elem_children(t, e)
                    .into_iter()
                    .find(|&k| {
                        let row = self.rd.owned_row(t, e, k);
                        row.node == NodeId::NONE
                            && row.component_type.plays(Role::ImplicitBooleanInput)
                    })
                    .ok_or_else(|| {
                        Error::Internal("an implicit input outlining did not make".into())
                    })?;
                self.tables[t.index()].plans[bi.index()].props = boolean_input::Props {
                    value: Source::given(0.0),
                }
                .into_vec();
                bi
            }
            _ => {
                return Err(Error::Unsupported(
                    "<answer type=\"boolean\"> with an input other than one <booleanInput>".into(),
                ));
            }
        };
        let compare = self.compare_attrs(&[el])?;
        let scope = self.rd.own_row(t, e).name_scope;
        let mut wiring = ElemWiring::of(self.rd.own_row(t, e).component_type);
        let weight = self.plan_weight(t, e, el)?;
        let ports = answer::Props::PORTS;
        // The `<boolean>` child that is the answer's content, if any.
        let boolean_child = self.rd.elem_children(t, e).into_iter().find(|&k| {
            let row = self.rd.owned_row(t, e, k);
            row.node != NodeId::NONE && row.component_type.plays(Role::BooleanValue)
        });
        let content = self.rd.content_nodes(el);
        let credit = if awards.is_empty() {
            let correct = match boolean_child {
                Some(b) if content.is_empty() => {
                    wiring.hidden(Source::alias(Arg::Elem(b, boolean::Props::PORTS.value)))
                }
                Some(_) => {
                    return Err(Error::Unsupported(
                        "a boolean <answer> with both a <boolean> and other content".into(),
                    ));
                }
                None if content.is_empty() => {
                    return Err(Error::Unsupported(
                        "an <answer type=\"boolean\"> with nothing to check".into(),
                    ));
                }
                None => self.plan_condition_content(t, scope, &content, compare, &mut wiring)?,
            };
            Source::computed(OpSpec::Eq, vec![ports.submitted, correct])
        } else {
            if !content.is_empty() || boolean_child.is_some() {
                return Err(Error::Unsupported(
                    "a boolean <answer> with both content and <award> children".into(),
                ));
            }
            let mut planned = Vec::with_capacity(awards.len());
            for &a in awards {
                let form = self.rd.award_form(&self.ar, t, a)?;
                if form.when.is_some() {
                    return Err(Error::Unsupported(
                        "a <when> in an <award> of a boolean answer".into(),
                    ));
                }
                let mut award_wiring = ElemWiring::of(Role::Award.ty());
                let mut els = form.attr_els();
                els.push(el);
                let compare = self.compare_attrs(&els)?;
                let correct = match form.boolean {
                    Some(b) => award_wiring
                        .hidden(Source::alias(Arg::Elem(b, boolean::Props::PORTS.value))),
                    None => {
                        self.plan_condition_content(t, a, &form.nodes, compare, &mut award_wiring)?
                    }
                };
                let credit = self.award_credit(t, a, &form.attr_els())?;
                let credit = clamp_credit(&mut award_wiring, credit);
                let holds = award_wiring.hidden(Source::op(
                    OpSpec::Eq,
                    vec![Arg::Elem(e, ports.submitted), Arg::Own(correct)],
                ));
                award_wiring.set_public_sources(award::Props {
                    credit,
                    awarded: Source::computed(OpSpec::Mul, vec![award::Props::PORTS.credit, holds]),
                });
                self.tables[t.index()].plans[a.index()].props = award_wiring.finish().0;
                planned.push(a);
            }
            Source::own(credited_awards(&mut wiring, &planned, credited))
        };
        wiring.set_public_sources(answer::Props {
            response: Source::alias(Arg::Elem(bi, value)),
            correct: Source::absent(),
            submitted: Source::given(NO_VALUE),
            credit,
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
        let d = self.rd.dast;
        let mut wiring = ElemWiring::of(Role::Award.ty());
        let credit = self.award_credit(t, form.e, &form.attr_els())?;
        let credit = clamp_credit(&mut wiring, credit);
        let mut els = form.attr_els();
        els.push(answer_el);
        let compare = self.compare_attrs(&els)?;
        let holds = match form.when {
            Some((w, w_el)) => {
                let nodes = self.rd.content_nodes(w_el);
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
                    let p = match self.rd.when_ref(m) {
                        Some(p) => p,
                        None => self.rd.plan_ref(&mut self.ar, t, w, m)?,
                    };
                    if let Some((key, input_type)) = self.rd.input_named(&self.ar, t, p)
                        && !responses.iter().any(|(k, _)| *k == key)
                    {
                        let r = self.outlined_response(t, answer_e, key)?;
                        self.plan_response(t, r, p, input_type);
                        responses.push((key, r));
                    }
                }
                // Each such `$mi` is planned as its response when the
                // condition plans it (`Settled::submitted`).
                let mut when_wiring = ElemWiring::of(Role::When.ty());
                let port = self.plan_condition_content(t, w, &nodes, compare, &mut when_wiring)?;
                when_wiring.set_public_sources(when::Props {
                    value: Source::own(port),
                });
                self.tables[t.index()].plans[w.index()].props = when_wiring.finish().0;
                wiring.hidden(Source::alias(Arg::Elem(w, when::Props::PORTS.value)))
            }
            None if form.from_text => {
                return Err(Error::Unsupported(
                    "a <text> in an <award> of a math answer".into(),
                ));
            }
            None if form.boolean.is_some() => {
                return Err(Error::Unsupported("a <boolean> inside an <award>".into()));
            }
            None => {
                let id = self
                    .rd
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
        self.check_references_are_responses(t, form, responses)?;
        wiring.set_public_sources(award::Props {
            credit,
            awarded: Source::computed(OpSpec::Mul, vec![award::Props::PORTS.credit, holds]),
        });
        self.tables[t.index()].plans[form.e.index()].props = wiring.finish().0;
        Ok(())
    }

    /// `referencesAreResponses="$mi1 $mi2"` on an award (ADR 0077): each
    /// reference an input whose value its `<when>` reads, which is a
    /// response already, as every input a when names is. A reference to
    /// anything else (a point, whose value would be recorded at submit) is
    /// refused.
    fn check_references_are_responses(
        &mut self,
        t: TemplateId,
        form: &AwardForm,
        responses: &[((u32, ElemId), ElemId)],
    ) -> Result<()> {
        let d = self.rd.dast;
        let Some(a) = form
            .attr_els()
            .into_iter()
            .find_map(|el| d.attr(el, "referencesAreResponses"))
        else {
            return Ok(());
        };
        let refused = || {
            Error::Unsupported(
                "<award referencesAreResponses> naming other than an input its <when> reads".into(),
            )
        };
        if form.when.is_none() {
            return Err(refused());
        }
        for &n in d.attr_children(a) {
            match d.kind(n) {
                NodeKind::Macro => {
                    let p = self.rd.plan_ref(&mut self.ar, t, form.e, n)?;
                    let named = self.rd.input_named(&self.ar, t, p);
                    if !named.is_some_and(|(key, _)| responses.iter().any(|(k, _)| *k == key)) {
                        return Err(refused());
                    }
                }
                NodeKind::Text if d.str(n).trim().is_empty() => {}
                NodeKind::Other => {}
                _ => return Err(refused()),
            }
        }
        Ok(())
    }

    /// An award's `credit`: what the attribute says (1 without one), which
    /// is not state, so a literal is a constant.
    fn award_credit(&mut self, t: TemplateId, a: ElemId, els: &[NodeId]) -> Result<Source> {
        let d = self.rd.dast;
        Ok(match els.iter().find_map(|&el| d.attr(el, "credit")) {
            // Literal math (`1/6`): its number, as the current core
            // evaluates a credit (ADR 0077).
            Some(c)
                if let Some(v) = self
                    .rd
                    .attr_text(c)
                    .and_then(|text| constant_number(text.trim())) =>
            {
                Source::constant(v)
            }
            Some(c) => {
                match self
                    .rd
                    .plan_value(&mut self.ar, t, a, "credit", d.attr_children(c), None)?
                {
                    Source::Leaf(Leaf::Given(v)) => Source::constant(v),
                    p => p,
                }
            }
            None => Source::constant(1.0),
        })
    }

    /// The `response` outlining made in answer `e` for the input `key`
    /// names.
    fn outlined_response(&self, t: TemplateId, e: ElemId, key: (u32, ElemId)) -> Result<ElemId> {
        self.rd
            .answer_response(t, e, key)
            .ok_or_else(|| Error::Internal("a response outlining did not make".into()))
    }

    /// Response `r` for the input plan `p` names: its live expression (or
    /// a boolean input's value), the submitted copy, and the copy's value.
    fn plan_response(&mut self, t: TemplateId, r: ElemId, p: RefId, input_type: ComponentType) {
        let mut live = self.ar.refs[p.index()].clone();
        let response = input_type.response().expect("an answer's input");
        let math = matches!(response, ResponseKind::Math(_));
        live.prop = Some(RefProp::of(
            input_type,
            PropSel::At(PropAt::Position(response.prop())),
        ));
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
            .rd
            .elem_children(t, e)
            .into_iter()
            .find(|&k| {
                let el = self.rd.owned_row(t, e, k);
                el.node == NodeId::NONE && el.component_type.plays(Role::ImplicitInput)
            })
            .ok_or_else(|| Error::Internal("an implicit input outlining did not make".into()))?;
        self.tables[t.index()].plans[mi.index()].props = math_input::Props {
            value: Source::computed(
                OpSpec::Sym(SymKind::Evaluate),
                vec![math_input::Props::PORTS.expr],
            ),
            expr: Source::Leaf(Leaf::GivenMath(None)),
            numDimensions: Source::computed(
                OpSpec::Sym(SymKind::Count),
                vec![math_input::Props::PORTS.expr],
            ),
        }
        .into_vec();
        Ok(mi)
    }

    /// The text the content of `el` (a text answer or one of its awards)
    /// writes, as a hidden port of `wiring`: literal text as written, one
    /// reference what it names, and text and references together their
    /// texts one after the other, white space between them kept, joined in
    /// the tick (ADR 0067, ADR 0053).
    fn plan_text_content(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        wiring: &mut ElemWiring,
        el: NodeId,
    ) -> Result<Port> {
        let d = self.rd.dast;
        let nodes: Vec<NodeId> = d
            .children(el)
            .iter()
            .copied()
            .filter(|&n| matches!(d.kind(n), NodeKind::Text | NodeKind::Macro))
            .collect();
        if nodes.iter().all(|&n| d.kind(n) == NodeKind::Text) {
            let text: String = nodes.iter().map(|&n| d.str(n)).collect();
            let id = self.ar.intern_literal(d, text.trim());
            return Ok(wiring.hidden(Source::Leaf(Leaf::GivenText(Some(id)))));
        }
        // Text around a lone reference is white space, which a comparison
        // trims: the reference alone.
        let lone = nodes
            .iter()
            .all(|&n| d.kind(n) == NodeKind::Macro || d.str(n).trim().is_empty())
            && nodes
                .iter()
                .filter(|&&n| d.kind(n) == NodeKind::Macro)
                .count()
                == 1;
        let mut parts = Vec::new();
        for &n in &nodes {
            let source = if d.kind(n) == NodeKind::Macro {
                Source::reference(self.rd.plan_ref(&mut self.ar, t, scope, n)?)
            } else if lone {
                continue;
            } else {
                Source::Leaf(Leaf::GivenText(Some(self.ar.intern_literal(d, d.str(n)))))
            };
            parts.push(wiring.hidden(source));
        }
        if let [one] = parts[..] {
            return Ok(one);
        }
        if parts.len() > usize::from(u8::MAX) {
            return Err(Error::Unsupported(
                "a text answer's content of more than 255 pieces".into(),
            ));
        }
        let join = SymKind::JoinWith {
            n: byte(parts.len()),
            kinds: 0,
            sep: crate::program::texts::Sep::Empty,
        };
        Ok(wiring.hidden(Source::computed(OpSpec::Sym(join), parts)))
    }

    /// Plans text answer `e`'s implicit `<textInput>`, which outlining
    /// made (ADR 0067): an unbound input holding the empty text.
    fn plan_implicit_text_input(&mut self, t: TemplateId, e: ElemId) -> Result<ElemId> {
        let ti = self
            .rd
            .elem_children(t, e)
            .into_iter()
            .find(|&k| {
                let el = self.rd.owned_row(t, e, k);
                el.node == NodeId::NONE && el.component_type.plays(Role::ImplicitTextInput)
            })
            .ok_or_else(|| Error::Internal("an implicit input outlining did not make".into()))?;
        let empty = self.ar.intern_literal(self.rd.dast, "");
        self.tables[t.index()].plans[ti.index()].props = text_input::Props {
            value: Source::Leaf(Leaf::GivenText(Some(empty))),
        }
        .into_vec();
        Ok(ti)
    }

    /// The equality an answer or award compares with.
    fn equals_op(&self, els: &[NodeId]) -> Result<SymKind> {
        Ok(self.compare_attrs(els)?.equals())
    }
}

/// The number literal math text with no reference evaluates to (`1/6`),
/// when it is a finite one; None for a plain number, which a value reads
/// as given.
fn constant_number(text: &str) -> Option<f64> {
    if text.is_empty() || text.parse::<f64>().is_ok() || text.contains('$') {
        return None;
    }
    let mut engine = crate::sym::Engine::new();
    let h = engine.parse(text).ok()?;
    let v = engine.evaluate(h, None);
    v.is_finite().then_some(v)
}

/// An award's or a choice's credit held from 0 to 1, as the current core
/// caps it; a request projects onto the bounds (ADR 0077).
pub(in crate::compile) fn clamp_credit(wiring: &mut ElemWiring, credit: Source) -> Source {
    let given = wiring.hidden(credit);
    let lo = wiring.hidden(Source::constant(0.0));
    let hi = wiring.hidden(Source::constant(1.0));
    Source::computed(OpSpec::Vec(VecOp::Clamp), vec![given, lo, hi])
}

/// The credit of an answer's awards: the best one's, or with
/// `numAwardsCredited` above 1 the sum of the best that many, 1 within
/// round-off of it (`Reduction::TopSum`, ADR 0077).
fn credited_awards(wiring: &mut ElemWiring, awards: &[ElemId], credited: u8) -> Port {
    if credited <= 1 || awards.len() > usize::from(u8::MAX) {
        return best_award(wiring, awards);
    }
    let awarded: Vec<Port> = awards
        .iter()
        .map(|&a| wiring.hidden(Source::alias(Arg::Elem(a, award::Props::PORTS.awarded))))
        .collect();
    wiring.hidden(Source::computed(
        OpSpec::Vec(VecOp::Reduce {
            op: crate::program::Reduction::TopSum { k: credited },
            n: byte(awards.len()),
        }),
        awarded,
    ))
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
