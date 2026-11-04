//! `<text>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<text>` with literal content: `value` is a given value holding the
    /// string id of its text (ADR 0009). A cell's meaning is a property of the
    /// operators around it, so a text value never reaches a numeric one.
    tags: ["text"],
    flags: [copyable],
    default_prop: value,
    props {
        value: children { text, rendered },
    }
    children: Value,
    planner: Whole(plan),
}

pub const VALUE: usize = Props::AT.value;

/// Literal text (or nothing) is a given value holding its string id, since
/// DoenetML's text value is state where a bound `<textInput>` writes it;
/// a lone reference aliases another text's value. A text that extends
/// another is planned from its prop table.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    if ctx.extend().is_some() {
        return ctx.plan_from_table();
    }
    let children = Attrs::of(ctx.record()).children;
    let value = match children.value {
        _ if children.element.is_some() => return Err(mixed()),
        ChildValue::Blank => Wire::given_text(GivenId::Children(0), ctx.intern("")),
        ChildValue::Text { id: Some(id), .. } => Wire::given_text(GivenId::Children(0), id),
        ChildValue::Reference(p) => Source::reference(p).into(),
        ChildValue::Text { id: None, .. } | ChildValue::Math => return Err(mixed()),
    };
    let mut wiring = ElemWiring::of(ComponentType::Text);
    wiring.set_public(Props { value });
    ctx.set_wiring(wiring);
    Ok(())
}

fn mixed() -> Error {
    Error::Unsupported("<text> whose content mixes text, references or elements".into())
}
