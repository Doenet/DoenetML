//! `<callAction>`: a button that calls another component's action.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::document::ActionView;
use crate::error::Result;
use crate::tick::Request;

component! {
    /// `<callAction target="$ans" actionName="submitAnswer">`: a button
    /// whose press calls the action `actionName` of the component `target`
    /// names (ADR 0040). Its `<label>` is the button's text. An action
    /// that would change which components exist or draw again
    /// (`addChildren`, `deleteChildren`, `resample`) is not one the core
    /// has (ADR 0037).
    tags: ["callAction"],
    props {
        hide: by_planner { rendered },
    }
    attributes { target: Component, actionName: Text, hide: Flag(false) }
    actions { trigger: call, callAction: call }
    children: None,
    planner: Plan(plan),
}

/// The diagnostic code of an `actionName` its target's type does not list.
const NO_SUCH_ACTION: &str = "cells-no-such-action";
/// The diagnostic code of an action that would change which components
/// exist, or draw a sample again.
const UNSUPPORTED_ACTION: &str = "cells-action-unsupported";
/// The current core's actions that add, delete or redraw components: the
/// cells core keeps the components and their draws fixed (ADR 0037).
const CHANGES_COMPONENTS: &[&str] = &["addChildren", "deleteChildren", "resample"];

/// Warns of an `actionName` its target's type does not list, when the
/// target is an element of this scope.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    if let (Some(target), Some(name)) = (attrs.target, &attrs.actionName)
        && let Some(ty) = ctx.reference_type(target)?
    {
        let name = name.trim();
        if CHANGES_COMPONENTS
            .iter()
            .any(|a| a.eq_ignore_ascii_case(name))
        {
            let _ = ctx.warn(
                UNSUPPORTED_ACTION,
                &format!(
                    "<callAction actionName=\"{name}\">: the components of a document and \
                     its random draws are fixed, so the button does nothing"
                ),
            );
        } else if !ty
            .def()
            .actions
            .iter()
            .any(|a| a.name.eq_ignore_ascii_case(name))
        {
            let _ = ctx.warn(
                NO_SUCH_ACTION,
                &format!(
                    "<callAction actionName=\"{name}\">: a <{}> has no such action",
                    ty.tag()
                ),
            );
        }
    }
    let mut wiring = ElemWiring::of(ComponentType::CallAction);
    wiring.set_public(Props {
        hide: Wire::scalar(attrs.hide, GivenId::Attr(attr::hide, 0)),
    });
    Ok(wiring)
}

/// `trigger` (and the current core's `callAction`): the requests of the
/// target's action `actionName`; none without a target, or one whose type
/// lists no such action.
fn call(view: &ActionView<'_>, _args: &[f64]) -> Vec<Request> {
    match (view.target(), view.attr_text("actionName")) {
        (Some(target), Some(name)) => view.act(target, name.trim()),
        _ => Vec::new(),
    }
}

#[cfg(all(test, feature = "testing"))]
#[path = "call_action.spec.rs"]
mod spec;
