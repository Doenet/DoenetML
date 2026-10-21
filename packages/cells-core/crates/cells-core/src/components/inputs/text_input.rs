//! `<textInput>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentType, ComponentTypeInfo, PropDef};
use crate::dast::{NodeId, NodeKind};
use crate::error::{Error, Result};

/// `<textInput>`: `value` is an essential cell holding a string id (the
/// `prefill`'s, or ""'s), unless `bindValueTo` or a `$ref` child binds it
/// to another text cell. Typing interns the text (`Document::intern`) and
/// requests the id. Planned by `plan`; `immediateValue` is the
/// same cell.
pub(in crate::components) const TEXT_INPUT: ComponentTypeInfo =
    info(&["textInput"], TEXT_INPUT_PROPS)
        .copyable()
        .default_prop("value");

const TEXT_INPUT_PROPS: &[PropDef] =
    &props([children("value").attribute("prefill").bind("bindValueTo")]);

pub const VALUE: usize = at(TEXT_INPUT_PROPS, "value");

typed_props!(TEXT_INPUT_PROPS { value } roles {
    // The value, when it is the input's own state.
    VALUE,
});

/// `value` aliases what a lone `$ref` child names, else what
/// `bindValueTo` names (a child wins, as in DoenetML); otherwise it is an
/// essential cell holding the id of its `prefill` text (or of ""). A text
/// input that extends another is planned from its prop table.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    if ctx.extend().is_some() {
        return ctx.plan_from_table();
    }
    let d = ctx.dast();
    let el = ctx.node();
    let nodes: Vec<NodeId> = d
        .children(el)
        .iter()
        .copied()
        .filter(|&n| !ctx.is_blank(n))
        .collect();
    let mut plan = ElemPlan::of(ComponentType::TextInput);
    match (nodes.as_slice(), d.attr(el, "bindValueTo")) {
        ([n], _) if d.kind(*n) == NodeKind::Macro => {
            plan.set(VALUE, SourcePlan::reference(ctx.reference(*n)?))
        }
        ([], Some(a)) => {
            let m = ctx.single_macro(a).ok_or_else(|| Error::BadValue {
                attr: "bindValueTo".into(),
                text: ctx.attr_text(a).unwrap_or_default(),
            })?;
            plan.set(VALUE, SourcePlan::reference(ctx.reference(m)?));
        }
        ([], None) => {
            let text = match d.attr(el, "prefill") {
                Some(a) => ctx.attr_text(a).unwrap_or_default(),
                None => String::new(),
            };
            let id = ctx.intern(&text);
            plan.set_text_essential(VALUE, roles::VALUE, id as f64);
        }
        _ => {
            return Err(Error::Unsupported(
                "<textInput> with content other than one reference".into(),
            ));
        }
    }
    ctx.set_plan(plan);
    Ok(())
}
