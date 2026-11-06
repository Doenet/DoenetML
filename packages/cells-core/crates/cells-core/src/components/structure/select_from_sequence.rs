//! `<selectFromSequence>`: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<selectFromSequence from to step>`: one number of the sequence, drawn
    /// at load from the document seed. The attributes must be
    /// literals; `numToSelect` other than 1 is not supported.
    tags: ["selectFromSequence"],
    flags: [copyable],
    renders: Never,
    default_prop: value,
    props {
        value: by_planner,
    }
    attributes {
        from: Literal(1.0),
        to: Literal(NO_VALUE),
        step: Literal(1.0),
        numToSelect: Literal(1.0),
        r#type: Text,
        exclude: Written,
        excludeCombinations: Written,
        sortResults: Written,
        withReplacement: Written,
    }
    children: None,
    planner: Plan(plan),
}

pub const VALUE: usize = Props::AT.value;

/// Its `value` is one of `from, from + step, ..., to`, picked per instance
/// at expansion.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    for (banned, written) in [
        ("exclude", attrs.exclude),
        ("excludeCombinations", attrs.excludeCombinations),
        ("sortResults", attrs.sortResults),
        ("withReplacement", attrs.withReplacement),
    ] {
        if written {
            return Err(Error::Unsupported(format!("<selectFromSequence {banned}>")));
        }
    }
    if let Some(ty) = &attrs.r#type
        && ty.trim() != "number"
    {
        return Err(Error::Unsupported(
            "<selectFromSequence> of letters or math".into(),
        ));
    }
    if attrs.numToSelect? != 1.0 {
        return Err(Error::Unsupported(
            "<selectFromSequence numToSelect>".into(),
        ));
    }
    let from = attrs.from?;
    let step = attrs.step?;
    let to = attrs.to?;
    if to.is_nan() || step == 0.0 {
        return Err(Error::Unsupported(
            "<selectFromSequence> needs literal from, to and a nonzero step".into(),
        ));
    }
    let count = ((to - from) / step + 1e-10).floor() + 1.0;
    if count < 1.0 {
        return Err(Error::Unsupported(
            "<selectFromSequence> with an empty sequence".into(),
        ));
    }
    let mut wiring = ElemWiring::of(ComponentType::SelectFromSequence);
    wiring.set_public(Props {
        value: Source::Leaf(Leaf::Scope(ScopeConst::SequencePick {
            from,
            step,
            count: count as u32,
        }))
        .into(),
    });
    Ok(wiring)
}
