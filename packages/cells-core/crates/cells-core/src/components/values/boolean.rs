//! `<boolean>`: its definition and its planner (ADR 0016). Literal
//! content (`true`, `false`, a number, nothing) is an essential 0/1 cell,
//! since DoenetML's boolean value is state (`<updateValue>` writes it). A
//! lone `$ref` aliases the referent. Anything else is a condition
//! (`compile/condition.rs`): comparisons and connectives over numeric
//! math, with `=` between expressions compared in the engine under the
//! compare attributes.

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentType, ComponentTypeInfo, PropDef};
use crate::dast::{NodeId, NodeKind};
use crate::error::{Error, Result};

/// `<boolean>`: `value` is a 0/1 cell. Literal content (`true`, `false`,
/// nothing) makes it essential; a lone `$ref` aliases the referent; a
/// condition or a comparison of expressions makes it derived
/// (`plan`). The compare attributes `symbolicEquality`,
/// `simplifyOnCompare` and `expandOnCompare` are read at plan time.
pub(in crate::components) const BOOLEAN: ComponentTypeInfo = info(&["boolean"], BOOLEAN_PROPS)
    .copyable()
    .default_prop("value");

const BOOLEAN_PROPS: &[PropDef] = &props([children("value")]);

typed_props!(BOOLEAN_PROPS { value } shared_state {
    // The value, when it is the boolean's own state.
    VALUE,
});

pub const VALUE: usize = Props::AT.value;

/// A boolean that extends another component aliases its value;
/// otherwise its content is planned.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    if ctx.extend().is_some() {
        // `<boolean extend="$bi"/>` shares the referent's value whatever
        // its type, so it is an alias, not an `Inherit` (which expand
        // would type-check).
        return ctx.alias_extended("value");
    }
    let d = ctx.dast();
    let nodes: Vec<NodeId> = d
        .children(ctx.node())
        .iter()
        .copied()
        .filter(|&n| !ctx.is_blank(n))
        .collect();
    if let Some(&n) = nodes.iter().find(|&&n| d.kind(n) == NodeKind::Element) {
        return Err(Error::Unsupported(format!(
            "a <{}> inside a <boolean>",
            d.str(n)
        )));
    }
    let macros = nodes
        .iter()
        .filter(|&&n| d.kind(n) == NodeKind::Macro)
        .count();
    let text: String = nodes
        .iter()
        .filter(|&&n| d.kind(n) == NodeKind::Text)
        .map(|&n| d.str(n))
        .collect();
    let text = text.trim();
    let mut plan = ElemPlan::of(ComponentType::Boolean);
    // Literal content is state: `<boolean>false</boolean>` can be set.
    let literal = match (macros, text.to_ascii_lowercase().as_str()) {
        (0, "") => Some(0.0),
        (0, "true") => Some(1.0),
        (0, "false") => Some(0.0),
        // A number is true only when it is 1, as in the current core.
        (0, s) => s.parse::<f64>().ok().map(|v| f64::from(v == 1.0)),
        _ => None,
    };
    let value = if let Some(v) = literal {
        Planned::essential(shared_state::VALUE, v)
    } else if macros == 1 && text.is_empty() {
        SourcePlan::reference(ctx.reference(nodes[0])?).into()
    } else {
        Planned::own(ctx.condition(&nodes, &mut plan)?)
    };
    plan.set_public(Props { value });
    ctx.set_plan(plan);
    Ok(())
}
