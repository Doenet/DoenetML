//! `<text>`: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<text>` with literal content: `value` is a given value holding the
    /// string id of its text. A text value never reaches a numeric one.
    tags: ["text"],
    flags: [copyable],
    roles: [TextValue],
    value: Text,
    props {
        value: children { text, rendered },
        ..anchor
    }
    children: Value,
    planner: Plan(plan),
}

/// The position of `value`: the string id of the text.
pub const VALUE: usize = Props::AT.value;

/// Literal text (or nothing) is a given value holding its string id; a
/// lone reference aliases another text's value.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let children = Attrs::of(ctx.record()).children;
    let value = match children.value {
        _ if children.element.is_some() => return Err(mixed()),
        ChildValue::Blank => Wire::given_text(GivenId::Children(0), ctx.intern("")),
        ChildValue::Text { id: Some(id), .. } => Wire::given_text(GivenId::Children(0), id),
        ChildValue::Reference(p) => return Ok(of_reference(ctx, p)),
        ChildValue::Text { id: None, .. } | ChildValue::Math => return Err(mixed()),
    };
    let mut wiring = ElemWiring::of(ComponentType::Text);
    wiring.set_planned(Planned { value });
    Ok(wiring)
}

/// A text of one reference (ADR 0041 decision 5, ADR 0053): a static
/// sequence's entries joined with commas (one text entry aliased, as a
/// text), a value the records say is no text its text, made in the tick;
/// anything else an alias, as before.
fn of_reference(ctx: &mut PlanCtx<'_, '_>, p: crate::compile::api::RefId) -> ElemWiring {
    let mut wiring = ElemWiring::of(ComponentType::Text);
    let one = ListEntry::Ref(p);
    let value = match ctx.reference_entries(p) {
        Some(entries) => {
            let kind = entries.first().and_then(|e| ctx.entry_kind(e));
            match &entries[..] {
                [ListEntry::Ref(q)] if kind == Some(ValueKind::Text) => {
                    Source::reference(*q).into()
                }
                _ => super::joined(&mut wiring, entries, kind == Some(ValueKind::Boolean)).into(),
            }
        }
        None => match ctx.entry_kind(&one) {
            Some(k @ (ValueKind::Number | ValueKind::Math | ValueKind::Boolean)) => {
                super::joined(&mut wiring, vec![one], k == ValueKind::Boolean).into()
            }
            _ => Source::reference(p).into(),
        },
    };
    wiring.set_planned(Planned { value });
    wiring
}

fn mixed() -> Error {
    Error::Unsupported("<text> whose content mixes text, references or elements".into())
}
