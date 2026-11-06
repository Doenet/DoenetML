//! Reading the source, which every stage does: an element's literal
//! attributes, its children, and which of them are content.

use crate::compile::*;

/// Reading the source: an element's literal attributes, its children and which
/// of them are content. Read-only; run by every stage.
impl Reader<'_> {
    pub(in crate::compile) fn attr_name_str(&self, el: NodeId, attr: &str) -> Option<StrId> {
        let d = self.dast;
        let a = d.attr(el, attr)?;
        match d.attr_children(a) {
            [t] if d.kind(*t) == NodeKind::Text => Some(d.str_id(*t)),
            _ => None,
        }
    }

    /// Whether a child node is presentation a renderer reads rather than
    /// content a planner does: a `<label>` or `<shortDescription>` element.
    pub(in crate::compile) fn is_presentation_child(&self, n: NodeId) -> bool {
        self.dast.kind(n) == NodeKind::Element
            && matches!(self.dast.str(n), "label" | "shortDescription")
    }

    /// Whether a child node is no content of its element: layout
    /// (`is_blank`) or presentation (`is_presentation_child`).
    pub(in crate::compile) fn is_not_content(&self, n: NodeId) -> bool {
        self.is_blank(n) || self.is_presentation_child(n)
    }

    /// Children of element `e` have `e` as their parent.
    pub(in crate::compile) fn child_scope(&self, _t: TemplateId, e: ElemId) -> ElemId {
        e
    }

    /// An on/off attribute that may also take a value: present and not
    /// `false` or `none` (`simplify`, `simplify="full"`).
    pub(in crate::compile) fn attr_on(&self, el: NodeId, name: &str) -> bool {
        match self.dast.attr(el, name) {
            None => false,
            Some(a) => {
                let text = self.attr_text(a).unwrap_or_default();
                !matches!(text.trim().to_ascii_lowercase().as_str(), "false" | "none")
            }
        }
    }

    /// A boolean attribute: present and empty, or `true`.
    pub(in crate::compile) fn attr_flag(&self, el: NodeId, name: &str) -> bool {
        match self.dast.attr(el, name) {
            None => false,
            Some(a) => {
                let text = self.attr_text(a).unwrap_or_default();
                let text = text.trim();
                text.is_empty() || text.eq_ignore_ascii_case("true")
            }
        }
    }

    pub(in crate::compile) fn attr_text(&self, a: AttrId) -> Option<String> {
        let d = self.dast;
        let mut s = String::new();
        for &n in d.attr_children(a) {
            match d.kind(n) {
                NodeKind::Text => s.push_str(d.str(n)),
                NodeKind::Macro => return None,
                _ => {}
            }
        }
        Some(s)
    }

    pub(in crate::compile) fn single_macro(&self, a: AttrId) -> Option<NodeId> {
        let d = self.dast;
        let mut found = None;
        for &n in d.attr_children(a) {
            match d.kind(n) {
                NodeKind::Macro if found.is_none() => found = Some(n),
                NodeKind::Macro => return None,
                NodeKind::Text if d.str(n).trim().is_empty() => {}
                NodeKind::Text => return None,
                _ => {}
            }
        }
        found
    }

    pub(in crate::compile) fn is_blank(&self, n: NodeId) -> bool {
        match self.dast.kind(n) {
            NodeKind::Text => self.dast.str(n).trim().is_empty(),
            NodeKind::Other => true,
            _ => false,
        }
    }

    pub(in crate::compile) fn literal_attr(&self, a: AttrId, name: &str) -> Result<f64> {
        let text = self.attr_text(a).ok_or_else(|| {
            Error::Banned(format!(
                "'{name}' must be a literal number: it is read before any value is computed"
            ))
        })?;
        text.trim().parse::<f64>().map_err(|_| Error::BadValue {
            attr: name.into(),
            text,
        })
    }

    /// The element children of `e`.
    pub(in crate::compile) fn elem_children(&self, t: TemplateId, e: ElemId) -> Vec<ElemId> {
        self.outlined(t).elems[e.index()]
            .children
            .iter()
            .filter_map(|c| match c {
                Child::Elem(k) => Some(*k),
                _ => None,
            })
            .collect()
    }

    /// The text and `$ref` nodes of an element, blanks left out.
    pub(in crate::compile) fn content_nodes(&self, el: NodeId) -> Vec<NodeId> {
        let d = self.dast;
        d.children(el)
            .iter()
            .copied()
            .filter(|&n| d.kind(n) != NodeKind::Element && !self.is_blank(n))
            .collect()
    }
}
