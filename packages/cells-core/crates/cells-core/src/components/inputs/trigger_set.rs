//! `<triggerSet>`: a button that presses the buttons inside it.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::document::ActionView;
use crate::error::Result;
use crate::tick::Request;

component! {
    /// `<triggerSet>`: a button that, when pressed, presses every
    /// `<updateValue>` and `<callAction>` inside it at once, in one tick;
    /// what is inside waits on nothing of its own (ADR 0042). Its
    /// `<label>` is the button's text; hidden when something else presses
    /// it.
    tags: ["triggerSet"],
    flags: [container],
    triggers { when: triggerWhen }
    props {
        // Read by the core when a tick settles (ADR 0042).
        triggerWhen: by_planner { read_by_action },
        hide: by_planner { rendered },
    }
    attributes {
        triggerWhen: Content,
        triggerWith: After(Act),
        triggerWhenObjectsClicked: After(Click),
        triggerWhenObjectsFocused: After(Focus),
        hide: Flag(false),
    }
    actions { trigger: press, triggerActions: press }
    planner: Plan(plan),
}

/// What presses it.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let mut wiring = ElemWiring::of(ComponentType::TriggerSet);
    let pressed_otherwise = attrs.triggerWhen.is_some()
        || attrs.triggerWith
        || attrs.triggerWhenObjectsClicked
        || attrs.triggerWhenObjectsFocused;
    let when = super::trigger_when(ctx, attrs.triggerWhen, &mut wiring)?;
    wiring.set_public(Props {
        triggerWhen: when,
        hide: if pressed_otherwise {
            Wire::constant(1.0)
        } else {
            Wire::scalar(attrs.hide, GivenId::Attr(attr::hide, 0))
        },
    });
    Ok(wiring)
}

/// `trigger` (and the current core's `triggerActions`): presses each
/// child, in order, in one tick.
fn press(view: &ActionView<'_>, _args: &[f64]) -> Vec<Request> {
    let children: Vec<_> = view.children().collect();
    children
        .into_iter()
        .flat_map(|c| view.act(c, "trigger"))
        .collect()
}

#[cfg(all(test, feature = "testing"))]
#[path = "trigger_set.spec.rs"]
mod spec;
