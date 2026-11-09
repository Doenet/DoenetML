//! `<choiceInput>`: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<choiceInput>`: `selectedIndex` is the 1-based position of the chosen
    /// `<choice>` child, 0 for none. The input's own state is
    /// `preliminaryIndex`, and `selectedIndex` is it when it names a choice,
    /// else 0, so a request for another index (NaN, a fraction, out of
    /// range) chooses none. Choices are shown in document order
    /// (`shuffleOrder` is not modelled); `selectMultiple` is refused.
    tags: ["choiceInput"],
    flags: [copyable],
    response: Index(selectedIndex),
    default_prop: selectedIndex,
    props {
        preliminaryIndex: attr(0.0) { attribute: selectedIndex },
        // `ChoiceIndex` over `preliminaryIndex`, with the number of choices.
        selectedIndex: by_planner { interactive, rendered },
    }
    attributes {
        selectedIndex: Value,
        selectMultiple: On,
    }
    // Its choices are built as components, and counted here.
    children: Rendered {
        choices: [Choice],
    },
    planner: Plan(plan),
}

/// The position of `selectedIndex`: the 1-based position of the chosen `<choice>`, 0
/// for none.
pub const SELECTED_INDEX: usize = Props::AT.selectedIndex;

/// Its choices must be `<choice>` elements; `selectMultiple` is refused.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    if attrs.selectMultiple {
        return Err(Error::Unsupported("<choiceInput selectMultiple>".into()));
    }
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(ComponentType::ChoiceInput);
    wiring.set_public(Props {
        preliminaryIndex: attrs.selectedIndex.unwrap_or(Source::given(0.0)).into(),
        selectedIndex: Source::computed_k(
            OpSpec::ChoiceIndex,
            at.preliminaryIndex,
            attrs.choices.len() as f64,
        )
        .into(),
    });
    Ok(wiring)
}
