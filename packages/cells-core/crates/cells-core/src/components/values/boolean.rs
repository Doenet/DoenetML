//! `<boolean>`: its definition and its planner. Literal content is an
//! essential 0/1 cell, a lone `$ref` aliases the referent, and anything
//! else is a condition.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<boolean>`: `value` is a 0/1 cell. Literal content (`true`, `false`,
    /// nothing) makes it essential; a lone `$ref` aliases the referent; a
    /// condition or a comparison of expressions makes it derived. The
    /// compare attributes `symbolicEquality`, `simplifyOnCompare` and
    /// `expandOnCompare` are read at plan time.
    tags: ["boolean"],
    flags: [copyable],
    text: Boolean(value),
    extend_value: Scalar(value),
    default_prop: value,
    props {
        value: children { rendered },
    }
    children: Value,
    planner: Plan(plan),
}

/// The position of `value`: 1 for true, 0 for false.
pub const VALUE: usize = Props::AT.value;

/// Its content: a literal, one reference, or a condition.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let children = Attrs::of(ctx.record()).children;
    if let Some(tag) = &children.element {
        return Err(Error::Unsupported(format!("a <{tag}> inside a <boolean>")));
    }
    let mut wiring = ElemWiring::of(ComponentType::Boolean);
    // Literal content is state: `<boolean>false</boolean>` can be set.
    let literal = match &children.value {
        ChildValue::Blank => Some(0.0),
        ChildValue::Text { text, .. } => match text.trim().to_ascii_lowercase().as_str() {
            "true" => Some(1.0),
            "false" => Some(0.0),
            // A number is true only when it is 1, as in the current core.
            s => s.parse::<f64>().ok().map(|v| f64::from(v == 1.0)),
        },
        _ => None,
    };
    let value = match (literal, children.value) {
        (Some(v), _) => Wire::given(GivenId::Children(0), v),
        (None, ChildValue::Reference(p)) => Source::reference(p).into(),
        // A condition: comparisons and connectives.
        (None, _) => Wire::own(ctx.condition(&children.nodes, &mut wiring)?),
    };
    wiring.set_public(Props { value });
    Ok(wiring)
}
