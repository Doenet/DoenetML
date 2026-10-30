//! `<choiceInput>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::dast::NodeKind;
use crate::error::{Error, Result};

component! {
    /// `<choiceInput>`: `selectedIndex` is the 1-based position of the chosen
    /// `<choice>` child, 0 for none. The input's own state is
    /// `preliminaryIndex`, and `selectedIndex` is it when it names a choice,
    /// else 0, so a request for another index (NaN, a fraction, out of
    /// range) chooses none, as in the current core. Choices are shown in
    /// document order (`shuffleOrder` is not modelled); `selectMultiple` is
    /// refused.
    tags: ["choiceInput"],
    flags: [copyable],
    default_prop: selectedIndex,
    props {
        preliminaryIndex: attr(0.0) { attribute: selectedIndex },
        // `ChoiceIndex` over `preliminaryIndex`, with the number of choices.
        selectedIndex: by_planner { interactive, rendered },
    }
    planner: PropsThen(plan),
}

pub const SELECTED_INDEX: usize = Props::AT.selectedIndex;

/// Its choices must be `<choice>` elements; `selectMultiple` is refused.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>, props: &mut [Option<Source>]) -> Result<()> {
    let d = ctx.dast();
    let el = ctx.node();
    if ctx.attr_on(el, "selectMultiple") {
        return Err(Error::Unsupported("<choiceInput selectMultiple>".into()));
    }
    let mut n_choices = 0;
    for &n in d.children(el) {
        match d.kind(n) {
            NodeKind::Text if d.str(n).trim().is_empty() => {}
            NodeKind::Other => {}
            NodeKind::Element if d.str(n) == "choice" => n_choices += 1,
            _ => {
                return Err(Error::Unsupported(
                    "the children of <choiceInput> must be <choice> elements".into(),
                ));
            }
        }
    }
    let at = Props::AT;
    props[at.selectedIndex] = Some(Source::computed_k(
        OpSpec::ChoiceIndex,
        at.preliminaryIndex,
        n_choices as f64,
    ));
    Ok(())
}
