//! `<updateValue>`: a button that sets another component's value.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::document::ActionView;
use crate::error::Result;
use crate::tick::Request;

component! {
    /// `<updateValue target="$a" newValue="$b"/>`: `target` aliases the
    /// target's value cell, so pressing it is a request on that cell for
    /// `newValue`'s current value. A button with its `<label>` as its
    /// text; hidden when something else presses it (`triggerWhen`,
    /// `triggerWith`, a click or focus on what it names, ADR 0042).
    tags: ["updateValue"],
    triggers { when: triggerWhen }
    props {
        // Pressing it, or its `<triggerSet>`, requests it (`trigger`).
        target: by_planner { written_by_action },
        newValue: by_planner { read_by_action },
        // Read by the core when a tick settles (ADR 0042).
        triggerWhen: by_planner { read_by_action },
        hide: by_planner { rendered },
    }
    attributes {
        target: Value,
        newValue: Content,
        r#type: Text,
        triggerWhen: Content,
        triggerWith: After(Act),
        triggerWhenObjectsClicked: After(Click),
        triggerWhenObjectsFocused: After(Focus),
        hide: Flag(false),
    }
    actions { trigger: update, updateValue: update }
    children: None,
    planner: Plan(plan),
}

/// The position of `target`: an alias of the target's value cell.
pub const TARGET: usize = Props::AT.target;
/// The position of `newValue`: the value it requests.
pub const NEW_VALUE: usize = Props::AT.newValue;

/// Its target and new value, read as a table's attributes are, and what
/// presses it.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let mut wiring = ElemWiring::of(ComponentType::UpdateValue);
    let pressed_otherwise = attrs.triggerWhen.is_some()
        || attrs.triggerWith
        || attrs.triggerWhenObjectsClicked
        || attrs.triggerWhenObjectsFocused;
    let when = super::trigger_when(ctx, attrs.triggerWhen, &mut wiring)?;
    let target = match attrs.target {
        Some(s) => Wire::scalar(s, GivenId::Attr(attr::target, 0)),
        None => Wire::absent(),
    };
    let new_value = new_value(ctx, attrs.newValue, attrs.r#type.as_deref(), &mut wiring)?;
    wiring.set_planned(Planned {
        target,
        newValue: new_value,
        triggerWhen: when,
        hide: if pressed_otherwise {
            Wire::constant(1.0)
        } else {
            Wire::scalar(attrs.hide, GivenId::Attr(attr::hide, 0))
        },
    });
    Ok(wiring)
}

/// Its `newValue`: a literal (`true` and `false` are 1 and 0), one
/// reference, a condition as a `<boolean>`'s content is (`not $b`), or
/// else math text. With `type="boolean"` it is read as a `<boolean>`'s
/// content; `type="text"` takes only a reference, since a tick makes no
/// text (`number` and `math` are both math here). Absent when not given.
fn new_value(
    ctx: &mut PlanCtx<'_, '_>,
    v: Option<ValueChildren>,
    ty: Option<&str>,
    wiring: &mut ElemWiring,
) -> Result<Wire> {
    let Some(v) = v else {
        return Ok(Wire::absent());
    };
    match ty.map(|t| t.trim().to_ascii_lowercase()).as_deref() {
        None | Some("math" | "number") => {}
        Some("boolean") => return super::trigger_when(ctx, Some(v), wiring),
        Some("text") => {
            return match v.value {
                ChildValue::Reference(p) => Ok(Source::reference(p).into()),
                _ => Err(crate::error::Error::Unsupported(
                    "<updateValue type=\"text\"> with a new value other than one reference".into(),
                )),
            };
        }
        Some(other) => {
            return Err(crate::error::Error::Unsupported(format!(
                "<updateValue type=\"{other}\">"
            )));
        }
    }
    let given = |x: f64| Wire::given(GivenId::Attr(attr::newValue, 0), x);
    Ok(match &v.value {
        ChildValue::Blank => Wire::absent(),
        ChildValue::Reference(p) => Source::reference(*p).into(),
        ChildValue::Text { text, .. } if text.trim().eq_ignore_ascii_case("true") => given(1.0),
        ChildValue::Text { text, .. } if text.trim().eq_ignore_ascii_case("false") => given(0.0),
        // A condition (`not $b`, `$n > 2`) where it reads as one, else
        // math.
        _ if reads_as_condition(ctx, &v.nodes) => Wire::own(ctx.condition(&v.nodes, wiring)?),
        _ => Wire::scalar(ctx.value_of(&v)?, GivenId::Attr(attr::newValue, 0)),
    })
}

/// Whether text reads as a condition: a comparison, a connective or a
/// truth value among its tokens, or text math cannot read.
fn reads_as_condition(ctx: &mut PlanCtx<'_, '_>, nodes: &[crate::dast::NodeId]) -> bool {
    match ctx.math_tokens(nodes) {
        Ok((tokens, _)) => tokens.iter().any(|t| match t {
            Token::Ident(w) => matches!(w.as_str(), "not" | "and" | "or" | "true" | "false"),
            Token::Op(c) => "<>!≠≤≥".contains(*c),
            Token::Eq => true,
            _ => false,
        }),
        Err(_) => true,
    }
}

/// `trigger` (and the current core's `updateValue`): requests
/// `newValue`'s current value on its target.
fn update(view: &ActionView<'_>, _args: &[f64]) -> Vec<Request> {
    let at = Props::AT;
    vec![view.request(at.target, view.value(at.newValue))]
}

#[cfg(all(test, feature = "testing"))]
#[path = "update_value.spec.rs"]
mod spec;
