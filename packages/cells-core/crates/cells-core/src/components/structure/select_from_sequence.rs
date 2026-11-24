//! `<selectFromSequence>`: its definition and its planner.

use super::select_prime_numbers::order;
use super::select_random_numbers::{draw_count, plan_draws};
use crate::compile::api::*;
use crate::components::define::*;
use crate::components::values::typed_sequence::{
    SeqKind, TypedParams, choose, letter_run, math_port, math_values,
};
use crate::error::{Error, Result};
use crate::limits::{MAX_VEC_IN, byte};
use crate::program::{Dist, Order, VecOp, sequence_parameters};

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
    /// parameter of its own (ADR 0059). `type="letters"` and `type="math"`
    /// draw among the values a `<sequence>` of that type lists, counted
    /// when the document is compiled, which a draw of their places picks
    /// (ADR 0074). `excludeCombinations` and `coprime` are not supported.
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
        exclude: Entries,
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
    let mut attrs = Attrs::of(ctx.record());
    for (banned, written) in [
        ("excludeCombinations", attrs.excludeCombinations),
        ("coprime", attrs.coprime),
    ] {
        if written {
            return Err(Error::Unsupported(format!("<selectFromSequence {banned}>")));
        }
    }
    let kind = SeqKind::of(attrs.r#type.as_deref());
    if kind != SeqKind::Number {
        return plan_typed(ctx, attrs, kind);
    }
    let exclude = exclude_sources(ctx, std::mem::take(&mut attrs.exclude))?;
    let (from, step, to) = bounds(&attrs)?;
    let n = draw_count("numToSelect", attrs.numToSelect)?;
    let order = order(attrs.sort)?;
    let hide = Wire::scalar(attrs.hide, GivenId::Attr(attr::hide, 0));
    let mut wiring = if n == 1 {
        one_pick(ctx, from, step, to, exclude)?
    } else {
        let dist = Dist::Sequence {
            replace: attrs.withReplacement,
            order,
        };
        plan_draws(ctx, dist, n, vec![from, step, to], exclude, DRAW_ON)?.0
    };
    let value = if n == 0 {
        Wire::absent()
    } else {
        Wire::own(wiring.entry(0))
    };
    wiring.set_planned(Planned { value, hide });
    Ok(wiring)
}

/// Its excludes, each piece a number or a reference, as a list writes
/// them (with spaces), a reference to a static sequence its entries (ADR
/// 0041, decision 9). Math (`2+1`, `2,`) is refused.
fn exclude_sources(ctx: &mut PlanCtx<'_, '_>, pieces: Vec<ListPiece>) -> Result<Vec<Source>> {
    ctx.list_entries(pieces, f64::INFINITY)?
        .into_iter()
        .map(|entry| match entry {
            ListEntry::Ref(p) => Ok(Source::reference(p)),
            ListEntry::Text(_, text) => {
                text.parse::<f64>()
                    .map(Source::given)
                    .map_err(|_| Error::BadValue {
                        attr: "exclude".into(),
                        text,
                    })
            }
            ListEntry::Math(_) => Err(Error::BadValue {
                attr: "exclude".into(),
                text: "math with a reference".into(),
            }),
        })
        .collect()
}

/// A draw among letters or math (ADR 0074), from literal parameters.
/// Letters are drawn as numbers, as a select of numbers draws them (a
/// `VecOp::Draws` of the run, less its excludes, without replacement
/// unless `withReplacement`, sorted by number as `sort` says), each entry
/// the letters of its number (`SymKind::Letters`), every one of which the
/// planner interns. Math values are computed when the document is
/// compiled, each a hidden port shown (a pick is fixed), and the draw is
/// of their places, each entry the value at its place ([`choose`]); math
/// is never sorted, as the current core leaves it.
fn plan_typed(ctx: &mut PlanCtx<'_, '_>, attrs: Attrs, kind: SeqKind) -> Result<ElemWiring> {
    let tag = ctx.component_type().tag();
    let written = attrs.r#type.as_deref().unwrap_or("").trim().to_string();
    let text = |ctx: &PlanCtx<'_, '_>, name: &str, source: &Option<Source>| match source {
        None => Ok(None),
        Some(s) => ctx.source_text(s).map(Some).ok_or_else(|| {
            Error::Unsupported(format!(
                "<{tag} type=\"{written}\"> whose `{name}` is no literal"
            ))
        }),
    };
    let length = match &attrs.length {
        None => None,
        Some(Source::Leaf(Leaf::Given(v) | Leaf::Const(v))) => Some(*v),
        Some(_) => {
            return Err(Error::Unsupported(format!(
                "<{tag} type=\"{written}\"> whose `length` is no number"
            )));
        }
    };
    let exclude = ctx
        .list_entries(attrs.exclude.clone(), f64::INFINITY)?
        .into_iter()
        .map(|entry| match entry {
            ListEntry::Text(_, text) => Ok(text),
            _ => Err(Error::Unsupported(format!(
                "<{tag} type=\"{written}\"> excluding a value that is no literal"
            ))),
        })
        .collect::<Result<Vec<_>>>()?;
    let params = TypedParams {
        from: text(ctx, "from", &attrs.from)?,
        to: text(ctx, "to", &attrs.to)?,
        step: text(ctx, "step", &attrs.step)?,
        length,
        exclude,
    };
    let n = draw_count("numToSelect", attrs.numToSelect)?;
    let hide = Wire::scalar(attrs.hide, GivenId::Attr(attr::hide, 0));
    let replace = attrs.withReplacement;
    let mut wiring = ElemWiring::with_entries(ctx.component_type(), n, kind.entry());
    let constant = |wiring: &mut ElemWiring, v: f64| wiring.hidden(Source::constant(v));
    let entries: Vec<Wire> = match kind {
        SeqKind::Letters => {
            let run = letter_run(&params)?;
            run.interned(ctx)?;
            if 4 + run.exclude.len() > MAX_VEC_IN {
                return Err(Error::Unsupported(format!(
                    "<{tag}> excluding more than {} values",
                    MAX_VEC_IN - 4
                )));
            }
            let order = order(attrs.sort)?;
            let picks = draws(&mut wiring, n, replace, order, |w| {
                let mut params = vec![
                    constant(w, run.from),
                    constant(w, run.step),
                    constant(w, run.to()),
                ];
                params.extend(run.exclude.iter().map(|&x| constant(w, x)));
                params
            });
            picks.into_iter().map(|p| run.of_port(p).into()).collect()
        }
        SeqKind::Math => {
            let values: Vec<Port> = math_values(&params)?
                .into_iter()
                .map(|t| math_port(&mut wiring, t))
                .collect();
            let m = values.len() as f64;
            let picks = draws(&mut wiring, n, replace, Order::Unsorted, |w| {
                let one = constant(w, 1.0);
                vec![one, one, constant(w, m)]
            });
            picks
                .into_iter()
                .map(|p| choose(&mut wiring, p, &values).into())
                .collect()
        }
        SeqKind::Number => unreachable!("numbers are drawn as numbers"),
    };
    let value = if n == 0 {
        Wire::absent()
    } else {
        wiring.set_entries(entries);
        Wire::own(wiring.entry(0))
    };
    wiring.set_planned(Planned { value, hide });
    Ok(wiring)
}

/// `n` values drawn (`VecOp::Draws` of `Dist::Sequence`) from the run
/// whose `from`, `step`, `to` and excludes `params` makes, hidden ports of
/// `wiring`; none for none.
fn draws(
    wiring: &mut ElemWiring,
    n: usize,
    replace: bool,
    order: Order,
    params: impl FnOnce(&mut ElemWiring) -> Vec<Port>,
) -> Vec<Port> {
    if n == 0 {
        return Vec::new();
    }
    let draw = wiring.draw(DRAW_ON);
    let params = params(wiring);
    let op = VecOp::Draws {
        dist: Dist::Sequence { replace, order },
        n: byte(n),
        n_exclude: byte(params.len() - 3),
    };
    let mut args = vec![draw];
    args.extend(params);
    wiring.hidden_vector(op, args)
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
