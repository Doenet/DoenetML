//! `<not>`: the negation of what a `<boolean>` with its content would be.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<not>`: `operand` is its content as a `<boolean>` reads it (a
    /// literal, one reference, or a condition), and `value` its negation.
    /// A request cannot change it, as in the current core.
    tags: ["not"],
    flags: [copyable],
    value: Boolean,
    props {
        operand: by_planner,
        value: by_planner { rendered },
    }
    children: Value,
    planner: Plan(plan),
}

/// Its content as a `<boolean>`'s (`values::boolean::plan`), negated.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let children = Attrs::of(ctx.record()).children;
    if let Some(tag) = &children.element {
        return Err(Error::Unsupported(format!("a <{tag}> inside a <not>")));
    }
    let mut wiring = ElemWiring::of(ComponentType::Not);
    let literal = match &children.value {
        ChildValue::Blank => Some(0.0),
        ChildValue::Text { text, .. } => match text.trim().to_ascii_lowercase().as_str() {
            "true" => Some(1.0),
            "false" => Some(0.0),
            // A number is true only when it is 1, as in a `<boolean>`.
            s => s.parse::<f64>().ok().map(|v| f64::from(v == 1.0)),
        },
        _ => None,
    };
    let operand = match (literal, children.value) {
        (Some(v), _) => Wire::constant(v),
        (None, ChildValue::Reference(p)) => Source::reference(p).into(),
        (None, _) => Wire::own(ctx.condition(&children.nodes, &mut wiring)?),
    };
    wiring.set_planned(Planned {
        operand,
        value: Wire::computed(OpSpec::Not, vec![Props::PORTS.operand]),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "not.spec.rs"]
mod spec;
