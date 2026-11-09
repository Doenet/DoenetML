//! `<textInput>`: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<textInput>`: `value` is an essential cell holding a string id (the
    /// `prefill`'s, or ""'s), unless `bindValueTo` or a `$ref` child binds it
    /// to another text cell. Typing interns the text and requests the id.
    /// `immediateValue` is the same cell.
    tags: ["textInput"],
    flags: [copyable],
    reads_as: Text,
    response: Text(value),
    text: Text(value),
    default_prop: value,
    props {
        value: children { attribute: prefill, bind: bindValueTo, text, interactive, rendered },
    }
    attributes {
        prefill: Text,
        bindValueTo: Ref,
    }
    children: Value,
    planner: Plan(plan),
}

/// The position of `value`: the string id of the entered text.
pub const VALUE: usize = Props::AT.value;

/// `value` aliases what a lone `$ref` child names, else what
/// `bindValueTo` names (a child wins); otherwise it is an
/// essential cell holding the id of its `prefill` text (or of "").
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let element = attrs.children.element.is_some();
    let value: Wire = match (attrs.children.value, attrs.bindValueTo) {
        _ if element => {
            return Err(Error::Unsupported(
                "<textInput> with content other than one reference".into(),
            ));
        }
        (ChildValue::Reference(p), _) | (ChildValue::Blank, Some(p)) => Source::reference(p).into(),
        (ChildValue::Blank, None) => {
            let id = ctx.intern(&attrs.prefill.unwrap_or_default());
            Wire::given_text(GivenId::Children(0), id)
        }
        _ => {
            return Err(Error::Unsupported(
                "<textInput> with content other than one reference".into(),
            ));
        }
    };
    let mut wiring = ElemWiring::of(ComponentType::TextInput);
    wiring.set_public(Props { value });
    Ok(wiring)
}
