//! Lint: the diagnostics that are facts about the DAST alone, found by
//! one walk over its elements before anything is compiled. Today the
//! accessibility rules: a `<graph>` needs a `<shortDescription>` child or
//! `decorative`; an input needs one, or a `<label>` child, a `label`
//! attribute or `labelIsName`. Lint reads attributes with
//! [`Dast::attr_peek`], which records no read.

use std::collections::BTreeMap;

use crate::components::ComponentType;
use crate::dast::{Dast, NodeId, NodeKind};
use crate::diagnostics::Diagnostic;

/// The lint's diagnostics for `dast`, in node order.
pub fn lint(dast: &Dast) -> Vec<Diagnostic> {
    NodeId::below(dast.len())
        .filter(|&n| dast.kind(n) == NodeKind::Element)
        .filter_map(|n| ComponentType::from_tag(dast.str(n)).map(|t| (n, t)))
        .filter_map(|(n, t)| accessibility(dast, n, t))
        .collect()
}

fn accessibility(d: &Dast, el: NodeId, component_type: ComponentType) -> Option<Diagnostic> {
    let has_child = |tag: &str| {
        d.children(el)
            .iter()
            .any(|&n| d.kind(n) == NodeKind::Element && d.str(n) == tag)
    };
    let described = has_child("shortDescription");
    let (code, message) = match component_type {
        ComponentType::Graph if !described && d.attr_peek(el, "decorative").is_none() => (
            "doenet-a0001",
            "For accessibility, `<graph>` must either have a short description or be specified as decorative.",
        ),
        ComponentType::MathInput
        | ComponentType::NumberInput
        | ComponentType::TextInput
        | ComponentType::BooleanInput
        | ComponentType::ChoiceInput
        | ComponentType::Slider
            if !described
                && !has_child("label")
                && d.attr_peek(el, "label").is_none()
                && d.attr_peek(el, "labelIsName").is_none() =>
        {
            (
                "doenet-a0003",
                "For accessibility, `<{tag}>` must have a short description or a label.",
            )
        }
        _ => return None,
    };
    let tag = component_type.tag();
    let mut args = BTreeMap::new();
    args.insert("component", tag.to_string());
    Some(Diagnostic::accessibility(
        1,
        code,
        el,
        message.replace("{tag}", tag),
        args,
    ))
}
