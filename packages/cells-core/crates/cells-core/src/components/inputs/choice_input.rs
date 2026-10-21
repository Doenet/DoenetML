//! `<choiceInput>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentTypeInfo, PropDef};
use crate::dast::NodeKind;
use crate::error::{Error, Result};

/// `<choiceInput>`: `selectedIndex` is the 1-based position of the chosen
/// `<choice>` child, 0 for none; it is the input's own state. Choices are
/// shown in document order (`shuffleOrder` is not modelled);
/// `selectMultiple` is refused.
pub(in crate::components) const CHOICE_INPUT: ComponentTypeInfo =
    info(&["choiceInput"], CHOICE_INPUT_PROPS)
        .copyable()
        .default_prop("selectedIndex");

const CHOICE_INPUT_PROPS: &[PropDef] = &props([attr("selectedIndex", 0.0)]);

pub const SELECTED_INDEX: usize = at(CHOICE_INPUT_PROPS, "selectedIndex");

/// Its choices must be `<choice>` elements; `selectMultiple` is refused.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>, _props: &mut [Option<SourcePlan>]) -> Result<()> {
    let d = ctx.dast();
    let el = ctx.node();
    if ctx.attr_on(el, "selectMultiple") {
        return Err(Error::Unsupported("<choiceInput selectMultiple>".into()));
    }
    for &n in d.children(el) {
        match d.kind(n) {
            NodeKind::Text if d.str(n).trim().is_empty() => {}
            NodeKind::Other => {}
            NodeKind::Element if d.str(n) == "choice" => {}
            _ => {
                return Err(Error::Unsupported(
                    "the children of <choiceInput> must be <choice> elements".into(),
                ));
            }
        }
    }
    Ok(())
}
