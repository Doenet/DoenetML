//! `<selectFromSequence>`: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::{MAX_VEC_IN, byte};
use crate::program::VecOp;

component! {
    /// `<selectFromSequence from to step exclude>`: one number of the
    /// sequence, drawn at load from the document seed. The parameters may
    /// read any value no student can change (ADR 0037), which the check
    /// makes sure of, with every draw possible; `numToSelect` other than 1
    /// is not supported.
    tags: ["selectFromSequence"],
    flags: [copyable],
    renders: Never,
    default_prop: value,
    props {
        value: by_planner,
    }
    attributes {
        from: Scalar,
        to: Scalar,
        step: Scalar,
        numToSelect: Literal(1.0),
        r#type: Text,
        exclude: Scalars,
        excludeCombinations: Written,
        sortResults: Written,
        withReplacement: Written,
    }
    children: None,
    planner: Plan(plan),
}

pub const VALUE: usize = Props::AT.value;

/// Its `value` is one of `from, from + step, ..., to`, less what it
/// excludes, which the draw, a scope constant, indexes (`VecOp::
/// SequencePick`): an instruction over hidden ports, the draw, `from`,
/// `step`, `to` and each exclude, which folds where its parameters are
/// constants of its scope or one around it. The planner does no
/// arithmetic: whether the sequence is ever empty is the check's.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    for (banned, written) in [
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
    let Some(to) = attrs.to else {
        return Err(Error::Unsupported(
            "<selectFromSequence> needs a `to`".into(),
        ));
    };
    if 4 + attrs.exclude.len() > MAX_VEC_IN {
        return Err(Error::Unsupported(format!(
            "<selectFromSequence> excluding more than {} values",
            MAX_VEC_IN - 4
        )));
    }
    // A literal parameter is a constant: never state, as no request
    // passes a pick.
    let param = |source: Source| match source {
        Source::Leaf(Leaf::Given(v)) => Source::constant(v),
        source => source,
    };
    let mut wiring = ElemWiring::of(ComponentType::SelectFromSequence);
    let draw = wiring.hidden(Source::Leaf(Leaf::Scope(ScopeConst::Draw)));
    let from = wiring.hidden(param(attrs.from.unwrap_or_else(|| Source::constant(1.0))));
    let step = wiring.hidden(param(attrs.step.unwrap_or_else(|| Source::constant(1.0))));
    let to = wiring.hidden(param(to));
    let n_exclude = byte(attrs.exclude.len());
    let mut args = vec![draw, from, step, to];
    for x in attrs.exclude {
        args.push(wiring.hidden(param(x)));
    }
    wiring.set_public_sources(Props {
        value: Source::vector(VecOp::SequencePick { n_exclude }, args),
    });
    Ok(wiring)
}
