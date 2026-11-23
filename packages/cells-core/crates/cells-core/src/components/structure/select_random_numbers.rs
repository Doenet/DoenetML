//! `<selectRandomNumbers>`: its definition and its planner, and what the
//! samplers of random and prime numbers share ([`plan_draws`]).

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::{MAX_VEC_IN, byte};
use crate::program::{Dist, Order, VecOp};

component! {
    /// `<selectRandomNumbers type from to step mean standardDeviation
    /// exclude numToSelect>`: a list of numbers (`numbers`, `number1`, ...)
    /// drawn at load from the document seed: `uniform` between `from` and
    /// `to` (0 and 1 by default), `discreteUniform` from `from, from +
    /// step, ..., to` less what it excludes, with replacement, or
    /// `gaussian` about `mean` with `standardDeviation`. The parameters
    /// may read any value no student can change (ADR 0037), which the
    /// check makes sure of, with every draw possible. `numToSelect` is a
    /// literal: the list's length is a fact of the source.
    tags: ["selectRandomNumbers"],
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: by_planner { rendered },
    }
    list {
        names: [numbers, values],
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
        r#type: Text,
        from: Scalar,
        to: Scalar,
        step: Scalar,
        mean: Scalar,
        standardDeviation: Scalar,
        exclude: Scalars,
        numToSelect: Literal(1.0),
    }
    children: None,
    planner: Plan(plan),
}

/// The distribution and parameters a random-number sampler's attributes
/// ask for, and the excludes, as [`plan_draws`] takes them.
pub(super) struct RandomParams {
    /// `type`, as written.
    pub(super) kind: Option<String>,
    pub(super) from: Option<Source>,
    pub(super) to: Option<Source>,
    pub(super) step: Option<Source>,
    pub(super) mean: Option<Source>,
    pub(super) standard_deviation: Option<Source>,
    pub(super) exclude: Vec<Source>,
}

/// How many values a sampler draws, from its literal count attribute
/// `attr`: a whole number the list can hold.
pub(super) fn draw_count(attr: &str, n: Result<f64>) -> Result<usize> {
    let n = n?;
    if n < 0.0 || n.fract() != 0.0 || n > u8::MAX as f64 {
        return Err(Error::BadValue {
            attr: attr.into(),
            text: n.to_string(),
        });
    }
    Ok(n as usize)
}

/// A random-number sampler's list of `n` values ([`plan_draws`]), from
/// the distribution `p` names.
pub(super) fn plan_random(
    ctx: &mut PlanCtx<'_, '_>,
    n: usize,
    p: RandomParams,
) -> Result<ElemWiring> {
    let kind = p.kind.as_deref().map(|t| t.trim().to_ascii_lowercase());
    let tag = ctx.component_type().tag();
    let refuse_unused = |unused: &[(&str, bool)], kind: &str| -> Result<()> {
        match unused.iter().find(|(_, given)| *given) {
            Some((attr, _)) => Err(Error::Unsupported(format!(
                "<{tag} {attr}> with type=\"{kind}\""
            ))),
            None => Ok(()),
        }
    };
    let gaussian_attrs = [
        ("mean", p.mean.is_some()),
        ("standardDeviation", p.standard_deviation.is_some()),
    ];
    // A default `to` is one past a literal `from`: by 1 for a uniform, by
    // the step for a discrete one.
    let one_past = |from: &Source, by: f64| match from {
        Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) => Some(Source::constant(v + by)),
        _ => None,
    };
    match kind.as_deref().unwrap_or("uniform") {
        "uniform" => {
            refuse_unused(&gaussian_attrs, "uniform")?;
            refuse_unused(
                &[
                    ("step", p.step.is_some()),
                    ("exclude", !p.exclude.is_empty()),
                ],
                "uniform",
            )?;
            let from = p.from.unwrap_or_else(|| Source::constant(0.0));
            let to = match p.to {
                Some(to) => to,
                None => match one_past(&from, 1.0) {
                    Some(to) => to,
                    None => {
                        return Err(Error::Unsupported(format!(
                            "<{tag}> with a `from` that is no number needs a `to`"
                        )));
                    }
                },
            };
            plan_draws(ctx, Dist::Uniform, n, vec![from, to], Vec::new())
        }
        "discreteuniform" => {
            refuse_unused(&gaussian_attrs, "discreteUniform")?;
            let from = p.from.unwrap_or_else(|| Source::constant(0.0));
            let step = p.step.unwrap_or_else(|| Source::constant(1.0));
            let to = match p.to {
                Some(to) => to,
                None => match (&step, one_past(&from, 0.0)) {
                    (Source::Leaf(Leaf::Given(s) | Leaf::Const(s)), Some(_)) => {
                        one_past(&from, *s).expect("a literal from")
                    }
                    _ => {
                        return Err(Error::Unsupported(format!(
                            "<{tag}> with a `from` or `step` that is no number needs a `to`"
                        )));
                    }
                },
            };
            let dist = Dist::Sequence {
                replace: true,
                order: Order::Unsorted,
            };
            plan_draws(ctx, dist, n, vec![from, step, to], p.exclude)
        }
        "gaussian" => {
            refuse_unused(
                &[
                    ("from", p.from.is_some()),
                    ("to", p.to.is_some()),
                    ("step", p.step.is_some()),
                    ("exclude", !p.exclude.is_empty()),
                ],
                "gaussian",
            )?;
            let mean = p.mean.unwrap_or_else(|| Source::constant(0.0));
            let sd = p
                .standard_deviation
                .unwrap_or_else(|| Source::constant(1.0));
            plan_draws(ctx, Dist::Gaussian, n, vec![mean, sd], Vec::new())
        }
        other => Err(Error::Unsupported(format!("<{tag} type=\"{other}\">"))),
    }
}

/// The wiring of a sampler's list of `n` values drawn from `dist`: one
/// instruction (`VecOp::Draws`) over hidden ports, a draw (a scope
/// constant), the parameters and the excludes, whose outputs are the
/// entries. A literal parameter is a constant, never state, as no request
/// passes a draw. Whether the parameters are constants, and the
/// distribution never too small to draw from, is the check's (ADR 0037).
/// The caller sets the table's props.
pub(super) fn plan_draws(
    ctx: &mut PlanCtx<'_, '_>,
    dist: Dist,
    n: usize,
    params: Vec<Source>,
    excludes: Vec<Source>,
) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    if 1 + params.len() + excludes.len() > MAX_VEC_IN {
        return Err(Error::Unsupported(format!(
            "<{}> excluding more than {} values",
            ty.tag(),
            MAX_VEC_IN - 1 - params.len()
        )));
    }
    let mut wiring = ElemWiring::with_list(ty, n);
    if n == 0 {
        return Ok(wiring);
    }
    let param = |source: Source| match source {
        Source::Leaf(Leaf::Given(v)) => Source::constant(v),
        source => source,
    };
    let n_exclude = byte(excludes.len());
    let mut args = vec![wiring.hidden(Source::Leaf(Leaf::Scope(ScopeConst::Draw)))];
    for s in params.into_iter().chain(excludes) {
        args.push(wiring.hidden(param(s)));
    }
    let op = VecOp::Draws {
        dist,
        n: byte(n),
        n_exclude,
    };
    let head = wiring.entry(0);
    wiring.set_entries(ElemWiring::vector_from(head, op, args, &[]));
    Ok(wiring)
}

/// Its list: `numToSelect` values from the distribution its `type`
/// names ([`plan_random`]).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let n = draw_count("numToSelect", attrs.numToSelect)?;
    let params = RandomParams {
        kind: attrs.r#type,
        from: attrs.from,
        to: attrs.to,
        step: attrs.step,
        mean: attrs.mean,
        standard_deviation: attrs.standardDeviation,
        exclude: attrs.exclude,
    };
    let mut wiring = plan_random(ctx, n, params)?;
    wiring.set_planned(Planned {
        numComponents: Wire::constant(n as f64),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "select_random_numbers.spec.rs"]
mod spec;
