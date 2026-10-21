//! `<text>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentType, ComponentTypeInfo, PropDef};
use crate::dast::{NodeId, NodeKind};
use crate::error::{Error, Result};

/// `<text>` with literal content: `value` is a fixed cell holding the
/// string id of its text (ADR 0009). A cell's meaning is a property of
/// the operators around it, so a text value never reaches a numeric one.
pub(in crate::components) const TEXT: ComponentTypeInfo =
    info(&["text"], TEXT_PROPS).copyable().default_prop("value");

const TEXT_PROPS: &[PropDef] = &props([children("value")]);

typed_props!(TEXT_PROPS { value } roles {
    // The value, when it is the text's own state.
    VALUE,
});

pub const VALUE: usize = Props::AT.value;

/// Literal text (or nothing) is an essential cell holding its string id,
/// since DoenetML's text value is state (a bound `<textInput>` writes it);
/// a lone reference aliases another text's value. A text that extends
/// another is planned from its prop table.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    if ctx.extend().is_some() {
        return ctx.plan_from_table();
    }
    let d = ctx.dast();
    let nodes: Vec<NodeId> = d
        .children(ctx.node())
        .iter()
        .copied()
        .filter(|&n| !ctx.is_blank(n))
        .collect();
    let value = match nodes.as_slice() {
        [] => Planned::text_essential(roles::VALUE, ctx.intern("") as f64),
        [n] if d.kind(*n) == NodeKind::Text => {
            Planned::text_essential(roles::VALUE, d.str_id(*n) as f64)
        }
        [n] if d.kind(*n) == NodeKind::Macro => SourcePlan::reference(ctx.reference(*n)?).into(),
        _ => {
            return Err(Error::Unsupported(
                "<text> whose content mixes text, references or elements".into(),
            ));
        }
    };
    let mut plan = ElemPlan::of(ComponentType::Text);
    plan.set_public(Props { value }.into_vec());
    ctx.set_plan(plan);
    Ok(())
}
