//! `<selectFromSequence>`: its definition and its planner.

use super::select_prime_numbers::order;
use super::select_random_numbers::{draw_count, plan_draws};
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::{MAX_VEC_IN, byte};
use crate::program::{Dist, VecOp, sequence_parameters};

component! {
    /// `<selectFromSequence from to step length exclude numToSelect
    /// withReplacement sort>`: `numToSelect` numbers of the sequence `from,
    /// from + step, ..., to` (1 to 10 by default, `length` counting it as
    /// a `<sequence>` does), less what it excludes, drawn at load from the
    /// document seed, no value twice unless `withReplacement`, in the
    /// order drawn unless `sort` says otherwise. Its picks are its list
    /// (`values`, `number1`, ...), each its own row (ADR 0041), and `value`
    /// is the first, so a select of one reads as a number. The parameters
    /// may read any value no student can change (ADR 0037), which the
    /// check makes sure of, with every draw possible; `numToSelect` is a
    /// literal. A copy draws what its referent drew unless it gives a
    /// parameter of its own (ADR 0059). Letters, math, `excludeCombinations`
    /// and `coprime` are not supported.
    tags: ["selectFromSequence"],
    flags: [copyable],
    default_prop: values,
    props {
        numComponents: list_len { rendered },
        value: by_planner,
        hide: by_planner { rendered },
    }
    list {
        names: [values, selectedValues, numbers],
        item: number,
        values: number of Number,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        from: Scalar,
        to: Scalar,
        step: Scalar,
        length: Scalar,
        numToSelect: Literal(1.0),
        r#type: Text,
        exclude: Scalars,
        excludeCombinations: Written,
        coprime: Written,
        sort: Text,
        withReplacement: Bool(false),
        hide: Flag(false),
    }
    static_count: count,
    children: None,
    planner: Plan(plan),
}

/// The position of `value`: the first number drawn.
pub const VALUE: usize = Props::AT.value;

/// What decides its draw: every parameter of the sequence, how many it
/// draws and whether one may come twice. Not the order it shows them in,
/// nor whether it is hidden: a copy sorting what its referent drew draws
/// the same numbers (ADR 0059).
const DRAW_ON: DrawOn = DrawOn {
    attrs: &[
        attr::from,
        attr::to,
        attr::step,
        attr::length,
        attr::numToSelect,
        attr::r#type,
        attr::exclude,
        attr::excludeCombinations,
        attr::withReplacement,
    ],
    children: false,
};

/// `from`, `step` and `to` as the planner wires them: the attributes
/// themselves when `to` is given and `length` is not, else, from literal
/// parameters, the sequence a `<sequence>` counts from whichever are
/// given (1 to 10 by default).
fn bounds(attrs: &Attrs) -> Result<(Source, Source, Source)> {
    let literal = |source: &Option<Source>| match source {
        None => Some(None),
        Some(Source::Leaf(Leaf::Given(v) | Leaf::Const(v))) => Some(Some(*v)),
        Some(_) => None,
    };
    if let (Some(to), None) = (&attrs.to, &attrs.length) {
        let one = || Source::constant(1.0);
        return Ok((
            attrs.from.clone().unwrap_or_else(one),
            attrs.step.clone().unwrap_or_else(one),
            to.clone(),
        ));
    }
    let (Some(from), Some(to), Some(step), Some(length)) = (
        literal(&attrs.from),
        literal(&attrs.to),
        literal(&attrs.step),
        literal(&attrs.length),
    ) else {
        return Err(Error::Unsupported(
            "<selectFromSequence> with a `length`, or no `to`, and a parameter that is no number"
                .into(),
        ));
    };
    let (from, step, length) = sequence_parameters(from, to, step, length).ok_or_else(|| {
        Error::Unsupported("<selectFromSequence> with from, to, step and length all given".into())
    })?;
    if !(length.is_finite() && length >= 1.0 && length.fract() == 0.0) {
        return Err(Error::BadValue {
            attr: "length".into(),
            text: length.to_string(),
        });
    }
    let to = from + step * (length - 1.0);
    Ok((
        Source::constant(from),
        Source::constant(step),
        Source::constant(to),
    ))
}

/// Its picks, from `from, from + step, ..., to` less what it excludes. One
/// pick is a `VecOp::SequencePick` over hidden ports, the draw, `from`,
/// `step`, `to` and each exclude, which the draw, a scope constant,
/// indexes; several are a `VecOp::Draws` of the sequence over the same
/// ports ([`plan_draws`]). Either folds where its parameters are
/// constants of its scope or one around it. The planner does no
/// arithmetic on a parameter that is no literal: whether the sequence is
/// ever too short is the check's.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    for (banned, written) in [
        ("excludeCombinations", attrs.excludeCombinations),
        ("coprime", attrs.coprime),
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
    let (from, step, to) = bounds(&attrs)?;
    let n = draw_count("numToSelect", attrs.numToSelect)?;
    let order = order(attrs.sort)?;
    let hide = Wire::scalar(attrs.hide, GivenId::Attr(attr::hide, 0));
    let mut wiring = if n == 1 {
        one_pick(ctx, from, step, to, attrs.exclude)?
    } else {
        let dist = Dist::Sequence {
            replace: attrs.withReplacement,
            order,
        };
        plan_draws(ctx, dist, n, vec![from, step, to], attrs.exclude, DRAW_ON)?.0
    };
    let value = if n == 0 {
        Wire::absent()
    } else {
        Wire::own(wiring.entry(0))
    };
    wiring.set_planned(Planned { value, hide });
    Ok(wiring)
}

/// One pick: a `VecOp::SequencePick`, as every select of one number has
/// drawn since ADR 0037, so its value at a seed is the one it always was.
fn one_pick(
    ctx: &mut PlanCtx<'_, '_>,
    from: Source,
    step: Source,
    to: Source,
    exclude: Vec<Source>,
) -> Result<ElemWiring> {
    if 4 + exclude.len() > MAX_VEC_IN {
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
    let mut wiring = ElemWiring::with_list(ctx.component_type(), 1);
    let draw = wiring.draw(DRAW_ON);
    let from = wiring.hidden(param(from));
    let step = wiring.hidden(param(step));
    let to = wiring.hidden(param(to));
    let n_exclude = byte(exclude.len());
    let mut args = vec![draw, from, step, to];
    for x in exclude {
        args.push(wiring.hidden(param(x)));
    }
    wiring.set_entries(vec![
        Source::vector(VecOp::SequencePick { n_exclude }, args).into(),
    ]);
    Ok(wiring)
}

/// How many numbers its record draws (`numToSelect`): a reference to it
/// among a list's children contributes as many (ADR 0041).
fn count(record: &Record) -> Option<usize> {
    draw_count("numToSelect", Attrs::of(record).numToSelect).ok()
}

#[cfg(test)]
#[path = "select_from_sequence.spec.rs"]
mod spec;
