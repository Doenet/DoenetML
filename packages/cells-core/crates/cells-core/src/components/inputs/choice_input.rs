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
    list_item: Choices,
    default_prop: selectedIndex,
    sequence: choiceOrder,
    props {
        preliminaryIndex: attr(0.0) { attribute: selectedIndex },
        // `ChoiceIndex` over `preliminaryIndex`, with the number of choices.
        selectedIndex: by_planner { interactive, rendered },
        // The place among its choices, from 1, of the one chosen (the one
        // `choiceOrder` names at `selectedIndex`), 0 for none (ADR 0077).
        selectedChoice: by_planner,
        // The chosen choice's text, empty for none (ADR 0077).
        selectedValue: by_planner { text },
    }
    alternate_names {
        // One selected value, or none: the current core's list of them,
        // shown as its one entry.
        selectedValues: selectedValue,
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
    let mut shuffled_ports: Vec<Port> = Vec::new();
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
        shuffled_ports.extend(ports.iter().copied());
        order.extend(ports.into_iter().map(Wire::own));
    }
    order.extend((order.len() + 1..=n).map(|k| Wire::constant(k as f64)));
    // The choice chosen, by its place among the choices: the place
    // `choiceOrder` names at `selectedIndex`, 0 for none.
    let selected_choice = if shuffled > 1 {
        let mut args = vec![at.selectedIndex];
        args.extend(shuffled_ports.iter().copied());
        for k in shuffled_ports.len() + 1..=n {
            args.push(wiring.hidden(Source::constant(k as f64)));
        }
        let chosen = wiring.hidden(Source::computed(
            OpSpec::Vec(VecOp::Choose { n: byte(n) }),
            args,
        ));
        Source::computed_k(OpSpec::NanTo, chosen, 0.0)
    } else {
        Source::own(at.selectedIndex)
    };
    // Its text, the empty text for none (the first branch). A copy whose
    // choices are its referent's has none of its own to read: missing.
    let choices = ctx.children_playing(crate::components::Role::Choice);
    let selected_value = if choices.len() == n {
        let mut texts =
            vec![wiring.hidden(Source::computed_k(OpSpec::Add, at.selectedChoice, 1.0))];
        texts.push(wiring.hidden(Source::Leaf(Leaf::GivenText(Some(ctx.intern(""))))));
        for choice in choices {
            texts.push(wiring.hidden(choice.port(super::choice::Props::PORTS.text)));
        }
        Source::computed(OpSpec::Vec(VecOp::Choose { n: byte(n + 1) }), texts)
    } else {
        Source::absent()
    };
    wiring.set_sequence("choiceOrder", order);
    wiring.set_planned(Planned {
        preliminaryIndex: attrs.selectedIndex.unwrap_or(Source::given(0.0)).into(),
        selectedIndex: Source::computed_k(OpSpec::ChoiceIndex, at.preliminaryIndex, n as f64)
            .into(),
        selectedChoice: selected_choice.into(),
        selectedValue: selected_value.into(),
    });
    Ok(wiring)
}
