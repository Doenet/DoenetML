//! `<choiceInput>`: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::VecOp;

component! {
    /// `<choiceInput>`: `selectedIndex` is the 1-based position of the
    /// chosen `<choice>` as shown, 0 for none. The input's own state is
    /// `preliminaryIndex`, and `selectedIndex` is it when it names a choice,
    /// else 0, so a request for another index (NaN, a fraction, out of
    /// range) chooses none. The choices are shown in `choiceOrder`, a
    /// second public sequence over its own ports (ADR 0053), one cell a
    /// choice: entry `k` is the 1-based position among its `<choice>`
    /// children of the choice shown `k`-th. That is document order, or
    /// with `shuffleOrder` an order drawn at load from the seed (ADR 0037),
    /// the last choice kept last with `preserveLastChoice`.
    /// `selectMultiple` is refused.
    tags: ["choiceInput"],
    flags: [copyable],
    response: Index(selectedIndex),
    needs: Label,
    default_prop: selectedIndex,
    sequence: choiceOrder,
    props {
        preliminaryIndex: attr(0.0) { attribute: selectedIndex },
        // `ChoiceIndex` over `preliminaryIndex`, with the number of choices.
        selectedIndex: by_planner { interactive, rendered },
    }
    // Whether a renderer shows it as a dropdown.
    presentation { inline }
    attributes {
        selectedIndex: Value,
        selectMultiple: On,
        shuffleOrder: On,
        preserveLastChoice: On,
    }
    // Its choices are built as components, and counted here.
    children: Rendered {
        choices: [Choice],
    },
    planner: Plan(plan),
}

/// The position of `selectedIndex`: the 1-based position of the chosen
/// `<choice>` as shown, 0 for none.
pub const SELECTED_INDEX: usize = Props::AT.selectedIndex;

/// Its choices must be `<choice>` elements; `selectMultiple` is refused.
/// `choiceOrder` is the positions in order, or a shuffle of them by a
/// draw (of all but the last, with `preserveLastChoice`).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    if attrs.selectMultiple {
        return Err(Error::Unsupported("<choiceInput selectMultiple>".into()));
    }
    let n = attrs.choices.len();
    let at = Props::PORTS;
    let mut wiring = ElemWiring::with_list(ComponentType::ChoiceInput, n);
    // How many of the positions are shuffled: none without
    // `shuffleOrder`, all but the last with `preserveLastChoice`.
    let shuffled = match (attrs.shuffleOrder, attrs.preserveLastChoice) {
        (false, _) => 0,
        (true, false) => n,
        (true, true) => n.saturating_sub(1),
    };
    let mut order: Vec<Wire> = Vec::with_capacity(n);
    if shuffled > 1 {
        if shuffled > crate::limits::MAX_VEC_IN - 1 {
            return Err(Error::Unsupported(format!(
                "<choiceInput shuffleOrder> of more than {} choices",
                crate::limits::MAX_VEC_IN - 1
            )));
        }
        // What decides the order drawn: the choices, and which of them
        // are shuffled.
        let draw = wiring.draw(DrawOn {
            attrs: &[attr::shuffleOrder, attr::preserveLastChoice],
            children: true,
        });
        let mut args = vec![draw];
        args.extend((1..=shuffled).map(|k| wiring.hidden(Source::constant(k as f64))));
        let ports = wiring.hidden_vector(VecOp::Shuffle { n: byte(shuffled) }, args);
        order.extend(ports.into_iter().map(Wire::own));
    }
    order.extend((order.len() + 1..=n).map(|k| Wire::constant(k as f64)));
    wiring.set_companion(order);
    wiring.set_planned(Planned {
        preliminaryIndex: attrs.selectedIndex.unwrap_or(Source::given(0.0)).into(),
        selectedIndex: Source::computed_k(OpSpec::ChoiceIndex, at.preliminaryIndex, n as f64)
            .into(),
    });
    Ok(wiring)
}
