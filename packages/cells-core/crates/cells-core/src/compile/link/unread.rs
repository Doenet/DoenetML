//! The unread-attribute check (ADR 0021), run when linking (ADR 0027,
//! ADR 0030): every attribute the compile reads has been read once every
//! element is planned, since a build reads none, so an element with an
//! attribute nothing read is boxed in place there, like any failure, and
//! the compile goes on.

use crate::compile::*;

impl Compiler<'_> {
    /// Box in place every element, outside every box, with an attribute
    /// nothing read while planning. What it and what is under it reported
    /// while planning is left out of the diagnostics, as for any box
    /// (`Compiler::drop_reports_of_boxes`). An element the check names with no element
    /// made for it (a child its parent's planner reads) is boxed by
    /// compiling again.
    pub(in crate::compile) fn box_unread_attributes(&mut self) {
        let mut outside: HashSet<NodeId> = self.boxed.clone();
        outside.extend(self.boxed_here.iter().copied());
        let unread = unread_attributes(self.dast, &outside);
        if unread.is_empty() {
            return;
        }
        let mut at: HashMap<NodeId, (TemplateId, ElemId)> = HashMap::new();
        for ti in 0..self.n_templates() {
            for (ei, el) in self
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
                self.restart.get_or_insert(Failure {
                    error,
                    node: Some(node),
                });
                continue;
            };
            self.box_in_place(t, e, error);
        }
    }
}

/// The elements, outside every boxed element, with an attribute nothing
/// read while the document was planned and checked, each with the error
/// for its first such attribute. An attribute the core never looks up
/// would be ignored, and an author's attribute that does nothing is a
/// silent wrong answer (ADR 0016, "no silent NaN"), so the element is
/// refused and boxed (ADR 0013). Attributes a renderer reads from the
/// literal attributes are accepted (`PRESENTATION_ATTRS` and the type's
/// `presentation`), and so is anything in an element the normalizer made
/// (a tag starting with `_`).
/// Reads are recorded by `Dast::attr` over the whole compile; a node
/// inside a boxed element is skipped rather than reported for what its
/// planner never ran to read.
fn unread_attributes(dast: &Dast, boxed: &HashSet<NodeId>) -> Vec<(NodeId, Error)> {
    let presentation = |tag: &str, name: &str| {
        let of_type = ComponentType::from_tag(tag).map_or(&[][..], |k| k.def().presentation);
        crate::components::PRESENTATION_ATTRS
            .iter()
            .chain(of_type)
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
