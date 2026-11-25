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
    roles: [BooleanValue],
    value: Boolean,
    props {
        value: children { rendered },
        // Shown neither drawn nor in its parent's text, as a `<text>`'s.
        hide: display,
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
            // A number is not true or false (D47 decision 4): a type mix.
            s if s.parse::<f64>().is_ok() => {
                let message =
                    format!("`{s}` is a number, not true or false: write `true` or `false`");
                let value = ctx.type_mix(None, &message).into();
                wiring.set_planned(Planned { value });
                return Ok(wiring);
            }
            _ => None,
        },
        _ => None,
    };
    let value = match (literal, children.value) {
        (Some(v), _) => Wire::given(GivenId::Children(0), v),
        // A reference to a number, a math or a text is not true or false
        // (D47 decision 4, D68): a type mix, suggesting the comparison.
        (None, ChildValue::Reference(p)) => match ctx.ref_kind(p) {
            Some(
                kind @ (ValueKind::Number | ValueKind::Math | ValueKind::Text | ValueKind::Point),
            ) => {
                let message = ctx.not_a_boolean(p, kind);
                ctx.type_mix(Some(p), &message).into()
            }
            _ => Source::reference(p).into(),
        },
        // A condition: comparisons and connectives.
        (None, _) => Wire::own(ctx.condition(&children.nodes, &mut wiring)?),
    };
    wiring.set_planned(Planned { value });
    Ok(wiring)
}
