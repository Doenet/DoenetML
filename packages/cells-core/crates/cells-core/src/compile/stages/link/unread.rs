//! The unread-attribute check, run when linking: an element with an
//! attribute nothing read is boxed in place, like any failure, and the
//! compile goes on.

use super::Linking;
use crate::compile::*;

/// Linking, unread attributes: an element with an attribute nothing read is
/// boxed in place (ADR 0021).
impl Linking<'_, '_> {
    /// Box in place every element, outside every box, with an attribute
    /// nothing read while planning; what is under it is left out of the
    /// diagnostics. A node the check names with no element made for it is
    /// boxed by compiling again. The root component cannot be boxed, since
    /// every other one is inside it: an attribute nothing read on it is a
    /// warning, returned, and the document goes on (DIAG-5).
    pub(super) fn box_unread_attributes(&mut self) -> Vec<Diagnostic> {
        let mut warnings = Vec::new();
        let unread = unread_attributes(self.rd.dast, &self.boxes.all());
        if unread.is_empty() {
            return warnings;
        }
        let mut at: HashMap<NodeId, (TemplateId, ElemId)> = HashMap::new();
        for ti in 0..self.tables.len() {
            for (ei, el) in self
                .rd
                .outlined(TemplateId::from_index(ti))
                .elems
                .iter()
                .enumerate()
            {
                if el.node != NodeId::NONE && !el.cloned {
                    at.entry(el.node)
                        .or_insert((TemplateId::from_index(ti), ElemId::from_index(ei)));
                }
            }
        }
        for (node, error) in unread {
            let Some(&(t, e)) = at.get(&node) else {
                self.boxes.fail(error, Some(node));
                continue;
            };
            if (t, e) == (TemplateId::new(0), ElemId::from_index(0)) {
                warnings.push(Diagnostic::warning(
                    error.code(),
                    Some(node),
                    format!("{error}; it is ignored"),
                ));
                continue;
            }
            self.boxes
                .box_in_place(&self.rd.settled().templates, self.tables, t, e, error);
        }
        warnings
    }
}

/// The elements, outside every boxed element, with an attribute nothing
/// read while the document was planned and checked, each with the error
/// for its first such attribute. Presentation attributes
/// (`PRESENTATION_ATTRS` and the type's `presentation`) and anything in an
/// element the normalizer made (a tag starting with `_`) are accepted.
fn unread_attributes(dast: &Dast, boxed: &HashSet<NodeId>) -> Vec<(NodeId, Error)> {
    let presentation = |tag: &str, name: &str| {
        let ty = ComponentType::from_tag(tag);
        let of_type = ty.map_or(&[][..], |k| k.def().presentation);
        let of_anchor = match ty.and_then(|k| k.anchor_props()) {
            Some(_) => crate::components::ANCHOR_PRESENTATION_ATTRS,
            None => &[],
        };
        crate::components::PRESENTATION_ATTRS
            .iter()
            .chain(of_type)
            .chain(of_anchor)
            .any(|p| p.eq_ignore_ascii_case(name))
    };
    let mut out = Vec::new();
    let mut stack = vec![Dast::ROOT];
    while let Some(n) = stack.pop() {
        if boxed.contains(&n) {
            continue;
        }
        if dast.kind(n) == NodeKind::Element {
            let tag = dast.str(n);
            // The normalizer's own elements (`_repeatSetup`) and what they
            // hold are the sugar's, not the author's.
            if tag.starts_with('_') {
                continue;
            }
            let unread = dast
                .attrs(n)
                .find(|&a| !dast.attr_read(a) && !presentation(tag, dast.attr_name(a)));
            if let Some(a) = unread {
                out.push((
                    n,
                    Error::UnsupportedAttribute {
                        tag: dast.str(n).to_string(),
                        attr: dast.attr_name(a).to_string(),
                    },
                ));
                continue;
            }
        }
        stack.extend(dast.children(n).iter().rev().copied());
    }
    out
}
