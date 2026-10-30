//! `<text>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::dast::{NodeId, NodeKind};
use crate::error::{Error, Result};

component! {
    /// `<text>` with literal content: `value` is a fixed cell holding the
    /// string id of its text (ADR 0009). A cell's meaning is a property of the
    /// operators around it, so a text value never reaches a numeric one.
    tags: ["text"],
    flags: [copyable],
    default_prop: value,
    props {
        value: children { rendered },
    }
    shared_state {
        // The value, when it is the text's own state.
        VALUE,
    }
    planner: Whole(plan),
}

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
        [] => Wire::text_essential(shared_state::VALUE, ctx.intern("")),
        [n] if d.kind(*n) == NodeKind::Text => {
            Wire::text_essential(shared_state::VALUE, d.str_id(*n))
        }
        [n] if d.kind(*n) == NodeKind::Macro => Source::reference(ctx.reference(*n)?).into(),
        _ => {
            return Err(Error::Unsupported(
                "<text> whose content mixes text, references or elements".into(),
            ));
        }
    };
    let mut wiring = ElemWiring::of(ComponentType::Text);
    wiring.set_public(Props { value });
    ctx.set_wiring(wiring);
    Ok(())
}
