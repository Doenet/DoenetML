//! `<answer>`: what it checks and against which response.
//!
//! The forms, as DoenetML sugars them:
//!
//! - `<answer response="$mi">x</answer>`: the response is the named
//!   input's expression; `x` is the correct expression.
//! - `<answer>x</answer>`: the answer owns an implicit `<mathInput>`,
//!   created here as a synthetic child.
//! - `<answer><mathInput name="mi"/>x</answer>`: the input child is the
//!   response.
//! - `<answer><award>x</award><award credit="0.5">y</award></answer>`:
//!   each award compares the submitted response with its content; the
//!   response is as above (an implicit input when nothing names one).
//! - `<answer><award><when>$mi = x</when></award></answer>`: each award
//!   holds when its condition does. A `$mi` naming an input stands for the
//!   answer's *submitted* copy of that input (a `response` component,
//!   one per input referenced), so credit changes only on submit. No
//!   implicit input is made.
//!
//! In every form `credit` is what a submit earns: equality with `correct`,
//! or the most any award gives (`credit` × holds). Other content (choices,
//! text answers, `matchPartial`, feedback) is refused, never left blank.

use super::*;
use crate::components::prop::{
    answer, award, choice, choice_input, math_input, response, text_input, when,
};

/// Most choices one `Choose` reads: the choice cell and one credit each.
const MAX_CHOICES: usize = crate::program::MAX_VEC_IN - 1;

/// An `<award>` as read from the DAST: its `<when>`, or its content.
struct AwardForm {
    e: ElemId,
    el: NodeId,
    when: Option<(ElemId, NodeId)>,
    nodes: Vec<NodeId>,
}

impl<'a> Compiler<'a> {
    pub(in crate::compile) fn plan_answer(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let text_answer = self.reject_answer_attrs(el)?;
        let mut inputs = Vec::new();
        let mut awards = Vec::new();
        for k in self.elem_children(t, e) {
            match self.compiled.templates[t].elems[k].component_type {
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
        let text_nodes = self.content_nodes(el);
        // A choice input: the submitted index earns its choice's credit.
        if let [ci] = inputs.as_slice()
            && self.compiled.templates[t].elems[*ci].component_type == ComponentType::ChoiceInput
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
        if inputs.iter().any(|&k| {
            self.compiled.templates[t].elems[k].component_type == ComponentType::TextInput
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
            forms.push(self.award_form(t, a)?);
        }
        // An award comparing an expression needs a response to compare.
        let needs_input = !text_nodes.is_empty() || forms.iter().any(|f| f.when.is_none());

        let mut plan = ElemPlan::new(ComponentType::Answer.prop_defs().len());
        let response_attr = d.attr(el, "response");
        let response = match (needs_input, response_attr, inputs.as_slice()) {
            (true, Some(a), []) => {
                self.plan_value(t, scope, "response", d.attr_children(a), Some("expr"))?
            }
            (true, Some(_), _) => {
                return Err(Error::Unsupported(
                    "an <answer> with both response= and an input child".into(),
                ));
            }
            (true, None, [mi]) => {
                if self.compiled.templates[t].elems[*mi].component_type != ComponentType::MathInput
                {
                    return Err(Error::Unsupported(
                        "an <answer> comparing a <booleanInput>: <answer type=\"boolean\">".into(),
                    ));
                }
                SourcePlan::Alias(Arg::Elem(*mi, own_slot(math_input::EXPR)))
            }
            (true, None, []) => {
                let mi = self.add_implicit_input(t, e);
                SourcePlan::Alias(Arg::Elem(mi, own_slot(math_input::EXPR)))
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
            (false, None, _) => SourcePlan::Fixed(f64::NAN),
        };
        plan.set(answer::RESPONSE, response);
        plan.set(
            answer::CORRECT,
            if text_nodes.is_empty() {
                SourcePlan::Fixed(f64::NAN)
            } else {
                let id = self.plan_sym_math(t, scope, &text_nodes)?;
                SourcePlan::SymExpr(id, Post::None)
            },
        );
        plan.set(answer::SUBMITTED, SourcePlan::MathEssential(None));
        let weight = match d.attr(el, "weight") {
            Some(a) => self.plan_value(t, scope, "weight", d.attr_children(a), None)?,
            None => SourcePlan::Fixed(1.0),
        };
        plan.set(answer::WEIGHT, weight);
        plan.set(answer::NUM_SUBMISSIONS, SourcePlan::Literal(0.0));

        if forms.is_empty() {
            let eq = self.equals_op(&[el]);
            plan.set(
                answer::CREDIT,
                SourcePlan::Op(
                    OpSpec::Sym(eq),
                    vec![
                        Arg::Own(own_slot(answer::SUBMITTED)),
                        Arg::Own(own_slot(answer::CORRECT)),
                    ],
                ),
            );
            self.compiled.templates[t].elems[e].props = plan.finish();
            return Ok(());
        }

        // Awards. Inputs the whens reference get a `response` child each.
        let mut responses: Vec<((u32, ElemId), ElemId)> = Vec::new();
        for form in &forms {
            self.plan_award(t, e, el, form, &mut responses)?;
        }
        let mut best = plan.hidden(SourcePlan::Alias(Arg::Elem(
            forms[0].e,
            own_slot(award::AWARDED),
        )));
        for form in &forms[1..] {
            let next = plan.hidden(SourcePlan::Alias(Arg::Elem(
                form.e,
                own_slot(award::AWARDED),
            )));
            best = plan.hidden(SourcePlan::computed(OpSpec::Max, vec![best, next]));
        }
        plan.set(answer::CREDIT, SourcePlan::own(best));
        if !needs_input && let Some(&(_, r)) = responses.first() {
            plan.set(
                answer::RESPONSE,
                SourcePlan::Alias(Arg::Elem(r, own_slot(response::RESPONSE))),
            );
            plan.set(
                answer::SUBMITTED,
                SourcePlan::Alias(Arg::Elem(r, own_slot(response::SUBMITTED))),
            );
        }
        self.compiled.templates[t].elems[e].props = plan.finish();
        Ok(())
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
        let d = self.dast;
        let choices: Vec<ElemId> = self
            .elem_children(t, ci)
            .into_iter()
            .filter(|&k| {
                self.compiled.templates[t].elems[k].component_type == ComponentType::Choice
            })
            .collect();
        if choices.is_empty() || choices.len() > MAX_CHOICES {
            return Err(Error::Unsupported(format!(
                "a <choiceInput> with {} choices",
                choices.len()
            )));
        }
        let mut plan = ElemPlan::new(ComponentType::Answer.prop_defs().len());
        plan.set(
            answer::RESPONSE,
            SourcePlan::Alias(Arg::Elem(ci, own_slot(choice_input::SELECTED_INDEX))),
        );
        plan.set(answer::CORRECT, SourcePlan::Fixed(f64::NAN));
        plan.set(answer::SUBMITTED, SourcePlan::Literal(0.0));
        let weight = match d.attr(el, "weight") {
            Some(a) => self.plan_value(t, e, "weight", d.attr_children(a), None)?,
            None => SourcePlan::Fixed(1.0),
        };
        plan.set(answer::WEIGHT, weight);
        plan.set(answer::NUM_SUBMISSIONS, SourcePlan::Literal(0.0));
        let mut args = vec![Arg::Own(own_slot(answer::SUBMITTED))];
        args.extend(
            choices
                .iter()
                .map(|&c| Arg::Elem(c, own_slot(choice::CREDIT))),
        );
        let chosen = plan.hidden(SourcePlan::Op(
            OpSpec::Vec(VecOp::Choose {
                n: choices.len() as u8,
            }),
            args,
        ));
        plan.set(
            answer::CREDIT,
            SourcePlan::computed(OpSpec::NanTo { k: 0.0 }, vec![chosen]),
        );
        self.compiled.templates[t].elems[e].props = plan.finish();
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
            [ti] if self.compiled.templates[t].elems[*ti].component_type
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
        let mut plan = ElemPlan::new(ComponentType::Answer.prop_defs().len());
        plan.set(
            answer::RESPONSE,
            SourcePlan::Alias(Arg::Elem(ti, own_slot(text_input::VALUE))),
        );
        plan.set(answer::CORRECT, SourcePlan::Fixed(f64::NAN));
        plan.set(answer::SUBMITTED, SourcePlan::TextLiteral(f64::NAN));
        let weight = match d.attr(el, "weight") {
            Some(a) => self.plan_value(t, e, "weight", d.attr_children(a), None)?,
            None => SourcePlan::Fixed(1.0),
        };
        plan.set(answer::WEIGHT, weight);
        plan.set(answer::NUM_SUBMISSIONS, SourcePlan::Literal(0.0));
        let mut best = None;
        for &a in awards {
            let form = self.award_form(t, a)?;
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
            let id = self.intern_literal(text.trim()) as f64;
            let mut ap = ElemPlan::new(ComponentType::Award.prop_defs().len());
            let credit = match d.attr(form.el, "credit") {
                Some(c) => match self.plan_value(t, a, "credit", d.attr_children(c), None)? {
                    SourcePlan::Literal(v) => SourcePlan::Fixed(v),
                    p => p,
                },
                None => SourcePlan::Fixed(1.0),
            };
            ap.set(award::CREDIT, credit);
            let correct = ap.hidden(SourcePlan::Fixed(id));
            let holds = ap.hidden(SourcePlan::Op(
                OpSpec::Eq,
                vec![
                    Arg::Elem(e, own_slot(answer::SUBMITTED)),
                    Arg::Own(own_slot(correct)),
                ],
            ));
            ap.set(
                award::AWARDED,
                SourcePlan::computed(OpSpec::Mul, vec![award::CREDIT, holds]),
            );
            self.compiled.templates[t].elems[a].props = ap.finish();
            let awarded = plan.hidden(SourcePlan::Alias(Arg::Elem(a, own_slot(award::AWARDED))));
            best = Some(match best {
                None => awarded,
                Some(b) => plan.hidden(SourcePlan::computed(OpSpec::Max, vec![b, awarded])),
            });
        }
        plan.set(answer::CREDIT, SourcePlan::own(best.expect("an award")));
        self.compiled.templates[t].elems[e].props = plan.finish();
        Ok(())
    }

    /// `<choiceInput>`: its choices must be `<choice>` elements;
    /// `selectMultiple` is refused.
    pub(super) fn plan_choice_input(
        &mut self,
        el: NodeId,
        _props: &mut [Option<SourcePlan>],
    ) -> Result<()> {
        let d = self.dast;
        if self.attr_on(el, "selectMultiple") {
            return Err(Error::Unsupported("<choiceInput selectMultiple>".into()));
        }
        for &n in d.children(el) {
            match d.kind(n) {
                NodeKind::Text if d.str(n).trim().is_empty() => {}
                NodeKind::Other => {}
                NodeKind::Element if d.str(n) == "choice" => {}
                _ => {
                    return Err(Error::Unsupported(
                        "the children of <choiceInput> must be <choice> elements".into(),
                    ));
                }
            }
        }
        Ok(())
    }

    /// Attributes that change what an answer checks and are out of scope.
    /// Returns whether the answer is `type="text"`.
    fn reject_answer_attrs(&self, el: NodeId) -> Result<bool> {
        let d = self.dast;
        self.reject_compare_attrs(el, "answer")?;
        let mut text = false;
        if let Some(a) = d.attr(el, "type") {
            let ty = self.attr_text(a).unwrap_or_default();
            match ty.trim() {
                "math" => {}
                "text" => text = true,
                other => {
                    return Err(Error::Unsupported(format!("<answer type=\"{other}\">")));
                }
            }
        }
        if self.attr_on(el, "matchPartial") {
            return Err(Error::Unsupported("<answer matchPartial>".into()));
        }
        if let Some(a) = d.attr(el, "numAwardsCredited")
            && self.attr_text(a).unwrap_or_default().trim() != "1"
        {
            return Err(Error::Unsupported("<answer numAwardsCredited>".into()));
        }
        Ok(text)
    }

    /// Attributes of an answer or award that change how responses compare
    /// and are not modelled: refused, never ignored.
    fn reject_compare_attrs(&self, el: NodeId, tag: &str) -> Result<()> {
        const OUT_OF_SCOPE: &[&str] = &[
            "allowedErrorInNumbers",
            "allowedErrorIsAbsolute",
            "includeErrorInNumberExponents",
            "nSignErrorsMatched",
            "nPeriodicSetMatchesRequired",
            "unorderedCompare",
            "matchByExactPositions",
            "caseInsensitiveMatch",
            "matchBlanks",
            "splitSymbols",
        ];
        for &name in OUT_OF_SCOPE {
            if self.dast.attr(el, name).is_some() {
                return Err(Error::Unsupported(format!("<{tag} {name}>")));
            }
        }
        Ok(())
    }

    /// The element children of `e`.
    fn elem_children(&self, t: TemplateId, e: ElemId) -> Vec<ElemId> {
        self.compiled.templates[t].elems[e]
            .children
            .iter()
            .filter_map(|c| match c {
                Child::Elem(k) => Some(*k),
                _ => None,
            })
            .collect()
    }

    /// The text and `$ref` nodes of an element, blanks left out.
    fn content_nodes(&self, el: NodeId) -> Vec<NodeId> {
        let d = self.dast;
        d.children(el)
            .iter()
            .copied()
            .filter(|&n| d.kind(n) != NodeKind::Element && !self.is_blank(n))
            .collect()
    }

    fn award_form(&self, t: TemplateId, a: ElemId) -> Result<AwardForm> {
        let d = self.dast;
        let el = self.compiled.templates[t].elems[a].node;
        if d.attr(el, "feedback").is_some() {
            return Err(Error::Unsupported("<award feedback>".into()));
        }
        if d.attr(el, "extend").is_some() {
            return Err(Error::Unsupported("<award extend>".into()));
        }
        self.reject_compare_attrs(el, "award")?;
        let mut when = None;
        // `<award><math>2 + $a</math></award>`: the math is the content.
        let mut math_child = None;
        for k in self.elem_children(t, a) {
            match self.compiled.templates[t].elems[k].component_type {
                ComponentType::When if when.is_none() => {
                    when = Some((k, self.compiled.templates[t].elems[k].node))
                }
                ComponentType::Math if math_child.is_none() && when.is_none() => {
                    math_child = Some(self.compiled.templates[t].elems[k].node)
                }
                ComponentType::When => {
                    return Err(Error::Unsupported("two <when>s in an <award>".into()));
                }
                other => {
                    return Err(Error::Unsupported(format!(
                        "a <{}> inside an <award>",
                        other.tag()
                    )));
                }
            }
        }
        let nodes = match math_child {
            Some(m) if self.content_nodes(el).is_empty() => self.content_nodes(m),
            Some(_) => {
                return Err(Error::Unsupported(
                    "an <award> with both a <math> and text".into(),
                ));
            }
            None => self.content_nodes(el),
        };
        match (when, nodes.is_empty()) {
            (Some(_), false) => Err(Error::Unsupported(
                "an <award> with both a <when> and content".into(),
            )),
            (None, true) => Err(Error::Unsupported("an empty <award>".into())),
            _ => Ok(AwardForm {
                e: a,
                el,
                when,
                nodes,
            }),
        }
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
        let mut ap = ElemPlan::new(ComponentType::Award.prop_defs().len());
        let credit = match d.attr(form.el, "credit") {
            Some(a) => match self.plan_value(t, form.e, "credit", d.attr_children(a), None)? {
                // How much an award gives is not state.
                SourcePlan::Literal(v) => SourcePlan::Fixed(v),
                p => p,
            },
            None => SourcePlan::Fixed(1.0),
        };
        ap.set(award::CREDIT, credit);
        let compare = self.compare_attrs(&[form.el, answer_el]);
        let holds = match form.when {
            Some((w, w_el)) => {
                let nodes = self.content_nodes(w_el);
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
                // Each `$mi` naming an input reads the submitted copy.
                let mut subst = HashMap::new();
                for &m in nodes.iter().filter(|&&n| d.kind(n) == NodeKind::Macro) {
                    let p = self.plan_ref(t, w, m)?;
                    if let Some((key, input_type)) = self.input_named(t, p) {
                        let r = match responses.iter().find(|(k, _)| *k == key) {
                            Some(&(_, r)) => r,
                            None => {
                                let r = self.add_response(t, answer_e, p, input_type);
                                responses.push((key, r));
                                r
                            }
                        };
                        let mut sub = self.compiled.refs[p].clone();
                        sub.hops = 0;
                        sub.steps = vec![Step::Elem(r)];
                        self.compiled.refs.push(sub);
                        subst.insert(m, self.compiled.refs.len() - 1);
                    }
                }
                let mut wp = ElemPlan::new(ComponentType::When.prop_defs().len());
                self.ref_subst = subst;
                let planned = self.plan_condition_content(t, w, &nodes, compare, &mut wp);
                self.ref_subst.clear();
                let slot = planned?;
                wp.set(when::VALUE, SourcePlan::own(slot));
                self.compiled.templates[t].elems[w].props = wp.finish();
                ap.hidden(SourcePlan::Alias(Arg::Elem(w, own_slot(when::VALUE))))
            }
            None => {
                let id = self.plan_sym_math(t, form.e, &form.nodes)?;
                let correct = ap.hidden(SourcePlan::SymExpr(id, Post::None));
                let eq = if compare.syntactic {
                    SymKind::EqualsSyntax
                } else {
                    SymKind::Equals
                };
                ap.hidden(SourcePlan::Op(
                    OpSpec::Sym(eq),
                    vec![
                        Arg::Elem(answer_e, own_slot(answer::SUBMITTED)),
                        Arg::Own(own_slot(correct)),
                    ],
                ))
            }
        };
        ap.set(
            award::AWARDED,
            SourcePlan::computed(OpSpec::Mul, vec![award::CREDIT, holds]),
        );
        self.compiled.templates[t].elems[form.e].props = ap.finish();
        Ok(())
    }

    /// The input a reference plan names (`$mi`, `$mi.value`), as (hops,
    /// element) and its type; None for anything else.
    fn input_named(&self, t: TemplateId, p: RefId) -> Option<((u32, ElemId), ComponentType)> {
        let r = &self.compiled.refs[p];
        if !matches!(r.prop.as_deref(), None | Some("value")) {
            return None;
        }
        let mut x = None;
        for step in &r.steps {
            match step {
                Step::Elem(e) => x = Some(*e),
                _ => return None,
            }
        }
        let x = x?;
        let mut cur_t = t;
        for _ in 0..r.hops {
            cur_t = self.compiled.templates[cur_t].parent?.0;
        }
        let input_type = self.compiled.templates[cur_t].elems[x].component_type;
        matches!(
            input_type,
            ComponentType::MathInput | ComponentType::BooleanInput
        )
        .then_some(((r.hops, x), input_type))
    }

    /// A `response` child of answer `e` for the input plan `p` names: its
    /// live expression (or a boolean input's value), the submitted copy,
    /// and the copy's value.
    fn add_response(
        &mut self,
        t: TemplateId,
        e: ElemId,
        p: RefId,
        input_type: ComponentType,
    ) -> ElemId {
        let r = self
            .push_elem(t, NONE, ComponentType::Response, NONE, e)
            .expect("unnamed");
        let mut live = self.compiled.refs[p].clone();
        let math = input_type == ComponentType::MathInput;
        live.prop = Some(if math { "expr" } else { "value" }.into());
        self.compiled.refs.push(live);
        let live = SourcePlan::reference(self.compiled.refs.len() - 1);
        let (submitted, value) = if math {
            (
                SourcePlan::MathEssential(None),
                SourcePlan::computed(OpSpec::Sym(SymKind::Evaluate), vec![response::SUBMITTED]),
            )
        } else {
            (
                SourcePlan::Literal(0.0),
                SourcePlan::own(response::SUBMITTED),
            )
        };
        let mut props =
            vec![SourcePlan::Fixed(f64::NAN); ComponentType::Response.prop_defs().len()];
        props[response::RESPONSE] = live;
        props[response::SUBMITTED] = submitted;
        props[response::VALUE] = value;
        self.compiled.templates[t].elems[r].props = props;
        self.compiled.templates[t].elems[e]
            .children
            .push(Child::Elem(r));
        r
    }

    /// The `<mathInput>` DoenetML sugars into an answer that names no
    /// input: an unbound input, first among the answer's children.
    fn add_implicit_input(&mut self, t: TemplateId, e: ElemId) -> ElemId {
        let mi = self
            .push_elem(t, NONE, ComponentType::MathInput, NONE, e)
            .expect("unnamed");
        let mut props =
            vec![SourcePlan::Fixed(f64::NAN); ComponentType::MathInput.prop_defs().len()];
        props[math_input::EXPR] = SourcePlan::MathEssential(None);
        props[math_input::VALUE] =
            SourcePlan::computed(OpSpec::Sym(SymKind::Evaluate), vec![math_input::EXPR]);
        self.compiled.templates[t].elems[mi].props = props;
        self.compiled.templates[t].elems[e]
            .children
            .insert(0, Child::Elem(mi));
        mi
    }

    /// The equality an answer or award compares with.
    fn equals_op(&self, els: &[NodeId]) -> SymKind {
        if self.compare_attrs(els).syntactic {
            SymKind::EqualsSyntax
        } else {
            SymKind::Equals
        }
    }

    /// An `<award>` is planned by its answer; one elsewhere has no plan.
    pub(super) fn plan_award_elem(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        if self.compiled.templates[t].elems[e].props.is_empty() {
            return Err(Error::Unsupported("an <award> outside an <answer>".into()));
        }
        Ok(())
    }

    /// A `<when>` is planned by its answer; one elsewhere has no plan.
    pub(super) fn plan_when_elem(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        if self.compiled.templates[t].elems[e].props.is_empty() {
            return Err(Error::Unsupported("a <when> outside an <award>".into()));
        }
        Ok(())
    }
}
