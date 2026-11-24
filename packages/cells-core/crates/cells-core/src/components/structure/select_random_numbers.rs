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
        numComponents: list_len { rendered },
        // The distribution's, from its parameters.
        mean: by_planner,
        variance: by_planner,
        standardDeviation: by_planner,
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
        variance: Scalar,
        exclude: Scalars,
        numToSelect: Literal(1.0),
    }
    static_count: count,
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
    /// A gaussian's variance, for its standard deviation when that is
    /// not given.
    pub(super) variance: Option<Source>,
    pub(super) exclude: Vec<Source>,
    /// What decides the draw: every parameter, and how many are drawn.
    pub(super) on: DrawOn,
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
) -> Result<(ElemWiring, [Port; 3])> {
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
        ("variance", p.variance.is_some()),
    ];
    // A default `to` is one past a literal `from`: by 1 for a uniform, by
    // the step for a discrete one.
    let one_past = |from: &Source, by: f64| match from {
        Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) => Some(Source::constant(v + by)),
        _ => None,
    };
    let (dist, params, excludes) = match kind.as_deref().unwrap_or("uniform") {
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
            (Dist::Uniform, vec![from, to], Vec::new())
        }
        "discreteuniform" => {
            refuse_unused(&gaussian_attrs, "discreteUniform")?;
            let (from, step, to) =
                discrete_bounds(p.from, p.step, p.to, &p.exclude).ok_or_else(|| {
                    Error::Unsupported(format!(
                        "<{tag}> with a `from` or `step` that is no number needs a `to`"
                    ))
                })?;
            let dist = Dist::Sequence {
                replace: true,
                order: Order::Unsorted,
            };
            (dist, vec![from, step, to], p.exclude)
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
            let sd = match (p.standard_deviation, p.variance) {
                (Some(sd), _) => sd,
                (None, None) => Source::constant(1.0),
                // A variance is the square of the deviation it stands for.
                (None, Some(Source::Leaf(Leaf::Given(v) | Leaf::Const(v)))) => {
                    Source::constant(v.sqrt())
                }
                (None, Some(_)) => {
                    return Err(Error::Unsupported(format!(
                        "<{tag} variance> that is no number"
                    )));
                }
            };
            (Dist::Gaussian, vec![mean, sd], Vec::new())
        }
        other => return Err(Error::Unsupported(format!("<{tag} type=\"{other}\">"))),
    };
    let (mut wiring, inputs) = plan_draws(ctx, dist, n, params, excludes, p.on)?;
    let moments = moments(&mut wiring, dist, inputs);
    Ok((wiring, moments))
}

/// A discrete uniform sampler's `from`, `step` and `to`, defaulted as the
/// current core defaults them from literals: with no `to`, the first two
/// values from `from` (0 by default) that it does not exclude; with no
/// `from`, the values below `to` down to 0, ending at `to`. None when `to`
/// is missing and `from`, `step` or an exclude is no literal.
fn discrete_bounds(
    from: Option<Source>,
    step: Option<Source>,
    to: Option<Source>,
    excludes: &[Source],
) -> Option<(Source, Source, Source)> {
    let literal = |s: &Source| match s {
        Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) => Some(*v),
        _ => None,
    };
    let step = step.unwrap_or_else(|| Source::constant(1.0));
    let s = literal(&step);
    match (from, to) {
        (from, None) => {
            let from = from.unwrap_or_else(|| Source::constant(0.0));
            let (mut f, s) = (literal(&from)?, s?);
            let excluded: Vec<f64> = excludes.iter().map(literal).collect::<Option<_>>()?;
            // Bounded, so a step of 0 among excludes cannot loop; the
            // check refuses what is left.
            let mut k = 0;
            while excluded.contains(&f) && k < excluded.len() {
                f += s;
                k += 1;
            }
            let mut i = 1.0;
            while excluded.contains(&(f + i * s)) && i <= excluded.len() as f64 {
                i += 1.0;
            }
            Some((Source::constant(f), step, Source::constant(f + i * s)))
        }
        (None, Some(to)) => match (literal(&to), s) {
            (Some(t), Some(s)) if s != 0.0 => {
                let count = (t / s + 1.0).floor();
                let f = if count >= 1.0 {
                    t - (count - 1.0) * s
                } else {
                    0.0
                };
                Some((Source::constant(f), step, to))
            }
            _ => Some((Source::constant(0.0), step, to)),
        },
        (Some(from), Some(to)) => Some((from, step, to)),
    }
}

/// The wiring of a sampler's list of `n` values drawn from `dist`: one
/// instruction (`VecOp::Draws`) over hidden ports, a draw (a scope
/// constant), the parameters and the excludes, whose outputs are the
/// entries. A literal parameter is a constant, never state, as no request
/// passes a draw. Whether the parameters are constants, and the
/// distribution never too small to draw from, is the check's (ADR 0037).
/// A copy shares the draw unless it gives something in `on` (ADR 0059).
/// The caller sets the table's props; it is given the ports holding the
/// parameters and the excludes, in order, which the moments read.
pub(super) fn plan_draws(
    ctx: &mut PlanCtx<'_, '_>,
    dist: Dist,
    n: usize,
    params: Vec<Source>,
    excludes: Vec<Source>,
    on: DrawOn,
) -> Result<(ElemWiring, Vec<Port>)> {
    let ty = ctx.component_type();
    if 1 + params.len() + excludes.len() > MAX_VEC_IN {
        return Err(Error::Unsupported(format!(
            "<{}> excluding more than {} values",
            ty.tag(),
            MAX_VEC_IN - 1 - params.len()
        )));
    }
    let mut wiring = ElemWiring::with_list(ty, n);
    let param = |source: Source| match source {
        Source::Leaf(Leaf::Given(v)) => Source::constant(v),
        source => source,
    };
    let n_exclude = byte(excludes.len());
    let draw = (n > 0).then(|| wiring.draw(on));
    let inputs: Vec<Port> = params
        .into_iter()
        .chain(excludes)
        .map(|s| wiring.hidden(param(s)))
        .collect();
    if let Some(draw) = draw {
        let op = VecOp::Draws {
            dist,
            n: byte(n),
            n_exclude,
        };
        let mut args = vec![draw];
        args.extend(&inputs);
        let head = wiring.entry(0);
        wiring.set_entries(ElemWiring::vector_from(head, op, args, &[]));
    }
    Ok((wiring, inputs))
}

/// The mean, variance and standard deviation of the distribution a
/// sampler draws from (`VecOp::Moments`), over the ports [`plan_draws`]
/// gave: hidden ports, which the sampler's props alias.
fn moments(wiring: &mut ElemWiring, dist: Dist, inputs: Vec<Port>) -> [Port; 3] {
    let n_exclude = byte(inputs.len() - dist.n_params());
    let ports = wiring.hidden_vector(VecOp::Moments { dist, n_exclude }, inputs);
    [ports[0], ports[1], ports[2]]
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
        variance: attrs.variance,
        exclude: attrs.exclude,
        on: DrawOn {
            attrs: &[
                attr::r#type,
                attr::from,
                attr::to,
                attr::step,
                attr::mean,
                attr::standardDeviation,
                attr::variance,
                attr::exclude,
                attr::numToSelect,
            ],
            children: false,
        },
    };
    let (mut wiring, [mean, variance, sd]) = plan_random(ctx, n, params)?;
    wiring.set_planned(Planned {
        mean: Wire::own(mean),
        variance: Wire::own(variance),
        standardDeviation: Wire::own(sd),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "select_random_numbers.spec.rs"]
mod spec;

/// How many numbers its record draws (`numToSelect`): a reference to it among
/// a list's children contributes as many (ADR 0041).
fn count(record: &Record) -> Option<usize> {
    draw_count("numToSelect", Attrs::of(record).numToSelect).ok()
}
