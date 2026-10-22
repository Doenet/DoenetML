//! `<selectFromSequence>`: its definition and its planner (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<selectFromSequence from to step>`: one number of the sequence, drawn
    /// at load from the document seed (ADR 0009). The attributes must be
    /// literals; `numToSelect` other than 1 is not supported.
    tags: ["selectFromSequence"],
    flags: [copyable],
    default_prop: value,
    props {
        value: by_planner,
    }
    planner: PropsThen(plan),
}

pub const VALUE: usize = Props::AT.value;

/// Its `value` is one of `from, from + step, ..., to`, picked per instance
/// at expansion.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>, props: &mut [Option<Source>]) -> Result<()> {
    let d = ctx.dast();
    let el = ctx.node();
    let num = |name: &str, default: f64| -> Result<f64> {
        match d.attr(el, name) {
            None => Ok(default),
            Some(a) => ctx.literal_number(a, name),
        }
    };
    for banned in [
        "exclude",
        "excludeCombinations",
        "sortResults",
        "withReplacement",
    ] {
        if d.attr(el, banned).is_some() {
            return Err(Error::Unsupported(format!("<selectFromSequence {banned}>")));
        }
    }
    if let Some(a) = d.attr(el, "type")
        && ctx.attr_text(a).unwrap_or_default().trim() != "number"
    {
        return Err(Error::Unsupported(
            "<selectFromSequence> of letters or math".into(),
        ));
    }
    if num("numToSelect", 1.0)? != 1.0 {
        return Err(Error::Unsupported(
            "<selectFromSequence numToSelect>".into(),
        ));
    }
    let from = num("from", 1.0)?;
    let step = num("step", 1.0)?;
    let to = num("to", NO_VALUE)?;
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
    props[Props::AT.value] = Some(Source::SequencePick {
        from,
        step,
        count: count as u32,
    });
    Ok(())
}
