//! What both outlining and planning read of an `<answer>`'s source:
//! which of its attributes are out of scope, each award's form (its
//! `<when>`, or its content), and which input a reference names.

use crate::compile::*;

/// The `type` of an `<answer>`: what it compares.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(in crate::compile) enum AnswerType {
    /// An expression, the default.
    Math,
    /// A text (ADR 0067).
    Text,
    /// A boolean (ADR 0077).
    Boolean,
}

/// An `<award>` as read from the DAST: its `<when>`, or its content.
pub(in crate::compile) struct AwardForm {
    pub(in crate::compile) e: ElemId,
    pub(in crate::compile) el: NodeId,
    pub(in crate::compile) when: Option<(ElemId, NodeId)>,
    pub(in crate::compile) nodes: Vec<NodeId>,
    /// The element whose children are the content: the award, or its
    /// `<math>` or `<text>` child.
    pub(in crate::compile) content_el: NodeId,
    /// Whether the content is a `<text>` child's, which only a text
    /// answer compares (ADR 0067).
    pub(in crate::compile) from_text: bool,
    /// The awards it extends (`<award extend="$aw" credit="0.5"/>`, ADR
    /// 0077), nearest first: where an attribute it does not give is read.
    pub(in crate::compile) based_on: Vec<NodeId>,
    /// Its one `<boolean>` child, which only a boolean answer compares
    /// (ADR 0077).
    pub(in crate::compile) boolean: Option<ElemId>,
}

impl AwardForm {
    /// The award's own node, then each it extends: where its attributes
    /// are read, nearest first.
    pub(in crate::compile) fn attr_els(&self) -> Vec<NodeId> {
        let mut els = vec![self.el];
        els.extend(&self.based_on);
        els
    }
}

/// Reading the source, an `<answer>`: the attributes out of scope, each award's
/// form and the input a reference names. Read-only; run by outlining and
/// planning.
impl SourceReader<'_> {
    /// Attributes that change what an answer checks and are out of scope.
    /// Returns whether the answer is `type="text"`.
    pub(in crate::compile) fn reject_answer_attrs(&self, el: NodeId) -> Result<bool> {
        Ok(self.answer_type(el)? == AnswerType::Text)
    }

    /// The `type` an answer gives (`math` when none), its other
    /// attributes out of scope refused.
    pub(in crate::compile) fn answer_type(&self, el: NodeId) -> Result<AnswerType> {
        let d = self.dast;
        let mut ty = AnswerType::Math;
        if let Some(a) = d.attr(el, "type") {
            let given = self.attr_text(a).unwrap_or_default();
            match given.trim().to_ascii_lowercase().as_str() {
                "math" => {}
                "text" => ty = AnswerType::Text,
                "boolean" => ty = AnswerType::Boolean,
                other => {
                    return Err(Error::Unsupported(format!("<answer type=\"{other}\">")));
                }
            }
        }
        let text = ty == AnswerType::Text;
        // A text answer compares without regard to case when asked (ADR
        // 0067); a math answer's case-insensitive match is not modelled.
        self.reject_compare_attrs(el, "answer", text)?;
        Ok(ty)
    }

    /// Whether answer `e` (at `el`) compares a boolean (ADR 0077): it is
    /// `type="boolean"`, or, with no `type`, its one element child is a
    /// `<boolean>` with no other content, or each of its awards holds a
    /// `<boolean>` alone, as the current core infers one.
    pub(in crate::compile) fn answer_is_boolean(
        &self,
        t: TemplateId,
        e: ElemId,
        el: NodeId,
    ) -> bool {
        if let Some(a) = self.dast.attr_peek(el, "type") {
            return self
                .attr_text(a)
                .unwrap_or_default()
                .trim()
                .eq_ignore_ascii_case("boolean");
        }
        let kids: Vec<(ElemId, &Elem)> = self
            .elem_children(t, e)
            .into_iter()
            .map(|k| (k, &self.outlined(t).elems[k.index()]))
            .filter(|(_, k)| k.node != NodeId::NONE && !self.is_presentation_child(k.node))
            .collect();
        let lone_boolean = |k: ElemId, node: NodeId| {
            let kids = self.elem_children(t, k);
            kids.len() == 1
                && self.outlined(t).elems[kids[0].index()]
                    .component_type
                    .plays(Role::BooleanValue)
                && self.content_nodes(node).is_empty()
        };
        match kids[..] {
            [(_, k)] if k.component_type.plays(Role::BooleanValue) => {
                self.content_nodes(el).is_empty()
            }
            [] => false,
            _ => kids.iter().all(|&(k, row)| {
                row.component_type.plays(Role::Award) && lone_boolean(k, row.node)
            }),
        }
    }

    /// The `<choice>` children of answer `el` when they are its content
    /// alone (ADR 0088): no text or reference, and no element child but
    /// them and its presentation children. The current core wraps them in
    /// a `<choiceInput>`.
    pub(in crate::compile) fn answer_choices(&self, el: NodeId) -> Option<Vec<NodeId>> {
        let d = self.dast;
        if !self.content_nodes(el).is_empty() {
            return None;
        }
        let choices: Vec<NodeId> = d
            .children(el)
            .iter()
            .copied()
            .filter(|&n| d.kind(n) == NodeKind::Element && !self.is_presentation_child(n))
            .collect();
        (!choices.is_empty() && choices.iter().all(|&n| d.str(n) == "choice")).then_some(choices)
    }

    /// How many of answer `el`'s awards are credited (`numAwardsCredited`,
    /// 1 without one): a literal positive integer (ADR 0077).
    pub(in crate::compile) fn num_awards_credited(&self, el: NodeId) -> Result<u8> {
        let Some(a) = self.dast.attr(el, "numAwardsCredited") else {
            return Ok(1);
        };
        let text = self.attr_text(a).unwrap_or_default();
        match text.trim().parse::<u8>() {
            Ok(n) if n >= 1 => Ok(n),
            _ => Err(Error::Unsupported(format!(
                "<answer numAwardsCredited=\"{}\">: only a literal positive integer is modelled",
                text.trim()
            ))),
        }
    }

    /// The `<text>` child that makes answer `e` (at `el`) a text answer
    /// without `type="text"`, as the current core infers one (ADR 0067):
    /// its one element child, a `<text>`, with no other content, and no
    /// `type` but `text`.
    pub(in crate::compile) fn answer_text_child(
        &self,
        t: TemplateId,
        e: ElemId,
        el: NodeId,
    ) -> Option<NodeId> {
        if let Some(a) = self.dast.attr_peek(el, "type")
            && self.attr_text(a).unwrap_or_default().trim() != "text"
        {
            return None;
        }
        let kids: Vec<&Elem> = self
            .elem_children(t, e)
            .into_iter()
            .map(|k| &self.outlined(t).elems[k.index()])
            .filter(|k| k.node != NodeId::NONE && !self.is_presentation_child(k.node))
            .collect();
        match kids[..] {
            [k] if k.component_type.plays(Role::TextValue) && self.content_nodes(el).is_empty() => {
                Some(k.node)
            }
            _ => None,
        }
    }

    /// Attributes of an answer or award that change how responses compare
    /// and are not modelled: refused, never ignored. `caseInsensitiveMatch`
    /// is modelled on a text answer (`case_ok`).
    fn reject_compare_attrs(&self, el: NodeId, tag: &str, case_ok: bool) -> Result<()> {
        const OUT_OF_SCOPE: &[&str] = &[
            "nSignErrorsMatched",
            "nPeriodicSetMatchesRequired",
            "caseInsensitiveMatch",
            "matchBlanks",
            "splitSymbols",
        ];
        for &name in OUT_OF_SCOPE {
            if case_ok && name == "caseInsensitiveMatch" {
                continue;
            }
            if self.dast.attr(el, name).is_some() {
                return Err(Error::Unsupported(format!("<{tag} {name}>")));
            }
        }
        Ok(())
    }

    pub(in crate::compile) fn award_form(
        &self,
        ar: &Arenas,
        t: TemplateId,
        a: ElemId,
    ) -> Result<AwardForm> {
        self.award_form_within(ar, t, a, 0)
    }

    /// An award's form, `depth` extends in.
    fn award_form_within(
        &self,
        ar: &Arenas,
        t: TemplateId,
        a: ElemId,
        depth: usize,
    ) -> Result<AwardForm> {
        let d = self.dast;
        let el = self.outlined(t).elems[a.index()].node;
        if d.attr(el, "feedback").is_some() {
            return Err(Error::Unsupported("<award feedback>".into()));
        }
        // `<award extend="$aw" credit="0.5"/>`: the content of the award it
        // names, an award beside it in the same scope, compared under its
        // own attributes, else that award's (ADR 0077).
        if d.attr(el, "extend").is_some() {
            let unsupported = |what: &str| Error::Unsupported(format!("<award extend> {what}"));
            let r = self.outlined(t).elems[a.index()]
                .extend
                .and_then(|p| self.plan_elem_target(ar, t, p))
                .filter(|&r| {
                    r != a
                        && self.outlined(t).elems[r.index()]
                            .component_type
                            .plays(Role::Award)
                })
                .ok_or_else(|| unsupported("of other than an award in the same scope"))?;
            if depth > 8 {
                return Err(unsupported("of a chain of more than 8 awards"));
            }
            if !self.elem_children(t, a).is_empty() || !self.content_nodes(el).is_empty() {
                return Err(unsupported("with content of its own"));
            }
            self.reject_compare_attrs(el, "award", false)?;
            let base = self.award_form_within(ar, t, r, depth + 1)?;
            if base.when.is_some() {
                return Err(unsupported("of an award with a <when>"));
            }
            let mut based_on = vec![base.el];
            based_on.extend(base.based_on);
            return Ok(AwardForm {
                e: a,
                el,
                based_on,
                ..base
            });
        }
        self.reject_compare_attrs(el, "award", false)?;
        let mut when = None;
        // `<award><math>2 + $a</math></award>`: the math is the content;
        // `<award><text>yes</text></award>`, the text, for a text answer
        // (ADR 0067).
        let mut math_child = None;
        let mut boolean = None;
        for k in self.elem_children(t, a) {
            let ty = self.outlined(t).elems[k.index()].component_type;
            // A `<math>` that settled as math, not as a point or a tuple.
            let math = matches!(ty.def().settle, Some(Settle::FromMathText(_)))
                || ty.plays(Role::TextValue);
            match ty {
                _ if ty.plays(Role::When) && when.is_none() => {
                    when = Some((k, self.outlined(t).elems[k.index()].node))
                }
                _ if ty.plays(Role::BooleanValue)
                    && boolean.is_none()
                    && math_child.is_none()
                    && when.is_none() =>
                {
                    boolean = Some(k)
                }
                _ if math && math_child.is_none() && when.is_none() => {
                    math_child = Some(self.outlined(t).elems[k.index()].node)
                }
                _ if ty.plays(Role::When) => {
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
        let content_el = math_child.unwrap_or(el);
        let from_text = math_child.is_some_and(|m| {
            self.elem_children(t, a).into_iter().any(|k| {
                let kid = &self.outlined(t).elems[k.index()];
                kid.node == m && kid.component_type.plays(Role::TextValue)
            })
        });
        let nodes = match math_child {
            Some(m) if self.content_nodes(el).is_empty() => self.content_nodes(m),
            Some(_) => {
                return Err(Error::Unsupported(
                    "an <award> with both a <math> and text".into(),
                ));
            }
            None => self.content_nodes(el),
        };
        if boolean.is_some() {
            if math_child.is_some() || when.is_some() || !nodes.is_empty() {
                return Err(Error::Unsupported(
                    "an <award> with both a <boolean> and other content".into(),
                ));
            }
            return Ok(AwardForm {
                e: a,
                el,
                when,
                nodes,
                content_el,
                from_text,
                based_on: Vec::new(),
                boolean,
            });
        }
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
                content_el,
                from_text,
                based_on: Vec::new(),
                boolean: None,
            }),
        }
    }

    /// The input a reference plan names (`$mi`, `$mi.value`), as (hops,
    /// element) and its type; None for anything else.
    pub(in crate::compile) fn input_named(
        &self,
        ar: &Arenas,
        t: TemplateId,
        p: RefId,
    ) -> Option<((u32, ElemId), ComponentType)> {
        let r = &ar.refs[p.index()];
        if !r.prop.is_none_or(|p| p.is("value")) {
            return None;
        }
        let (cur_t, x) = self.static_target(ar, t, p)?;
        let input_type = self.outlined(cur_t).elems[x.index()].component_type;
        matches!(
            input_type.response(),
            Some(ResponseKind::Math(_) | ResponseKind::Boolean(_))
        )
        .then_some(((r.hops, x), input_type))
    }
}
