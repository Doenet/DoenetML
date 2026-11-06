//! What both outlining and planning read of an `<answer>`'s source:
//! which of its attributes are out of scope, each award's form (its
//! `<when>`, or its content), and which input a reference names.

use crate::compile::*;

/// An `<award>` as read from the DAST: its `<when>`, or its content.
pub(in crate::compile) struct AwardForm {
    pub(in crate::compile) e: ElemId,
    pub(in crate::compile) el: NodeId,
    pub(in crate::compile) when: Option<(ElemId, NodeId)>,
    pub(in crate::compile) nodes: Vec<NodeId>,
}

/// Reading the source, an `<answer>`: the attributes out of scope, each award's
/// form and the input a reference names. Read-only; run by outlining and
/// planning.
impl Compiler<'_> {
    /// Attributes that change what an answer checks and are out of scope.
    /// Returns whether the answer is `type="text"`.
    pub(in crate::compile) fn reject_answer_attrs(&self, el: NodeId) -> Result<bool> {
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

    pub(in crate::compile) fn award_form(&self, t: TemplateId, a: ElemId) -> Result<AwardForm> {
        let d = self.dast;
        let el = self.outlined(t).elems[a.index()].node;
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
            match self.outlined(t).elems[k.index()].component_type {
                ComponentType::When if when.is_none() => {
                    when = Some((k, self.outlined(t).elems[k.index()].node))
                }
                ComponentType::Math if math_child.is_none() && when.is_none() => {
                    math_child = Some(self.outlined(t).elems[k.index()].node)
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

    /// The input a reference plan names (`$mi`, `$mi.value`), as (hops,
    /// element) and its type; None for anything else.
    pub(in crate::compile) fn input_named(
        &self,
        t: TemplateId,
        p: RefId,
    ) -> Option<((u32, ElemId), ComponentType)> {
        let r = &self.plans.refs[p.index()];
        if !r.prop.is_none_or(|p| p.is("value")) {
            return None;
        }
        let (cur_t, x) = self.static_target(t, p)?;
        let input_type = self.outlined(cur_t).elems[x.index()].component_type;
        matches!(
            input_type,
            ComponentType::MathInput | ComponentType::BooleanInput
        )
        .then_some(((r.hops, x), input_type))
    }
}
