//! `<boolean>`: its definition and its planner (ADR 0016). Literal
//! content (`true`, `false`, a number, nothing) is an essential 0/1 cell,
//! since DoenetML's boolean value is state (`<updateValue>` writes it). A
//! lone `$ref` aliases the referent. Anything else is a condition
//! (`compile/planning/condition.rs`): comparisons and connectives over numeric
//! math, with `=` between expressions compared in the engine under the
//! compare attributes.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<boolean>`: `value` is a 0/1 cell. Literal content (`true`, `false`,
    /// nothing) makes it essential; a lone `$ref` aliases the referent; a
    /// condition or a comparison of expressions makes it derived (`plan`). The
    /// compare attributes `symbolicEquality`, `simplifyOnCompare` and
    /// `expandOnCompare` are read at plan time.
    tags: ["boolean"],
    flags: [copyable],
    default_prop: value,
    props {
        value: children { rendered },
    }
    children: Value,
    planner: Plan(plan),
}

pub const VALUE: usize = Props::AT.value;

/// Its content: a literal, one reference, or a condition. (A boolean
/// extending a component of another type reads its `value`, which
/// outlining settles: `Compiler::plan_extend`.)
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
