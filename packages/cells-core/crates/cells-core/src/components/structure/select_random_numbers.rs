//! `<selectRandomNumbers>`: its definition and its planner, and what the
//! samplers of random and prime numbers share ([`plan_draws`]).

use super::distributions::{self, MoreParams, Reported};
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::{MAX_VEC_IN, byte};
use crate::program::{Avoid, Dist, Order, VecOp};

component! {
    /// `<selectRandomNumbers type from to step mean standardDeviation
    /// exclude numToSelect>`: a list of numbers (`numbers`, `number1`, ...)
    /// drawn at load from the document seed: `uniform` between `from` and
    /// `to` (0 and 1 by default), `discreteUniform` from `from, from +
    /// step, ..., to` less what it excludes, with replacement, or
    /// `gaussian` about `mean` with `standardDeviation`, or `logNormal`,
    /// `normalMixture`, `hypergeometric`, `binomial` or `poisson` with the
    /// current core's parameters (ADR 0079). The parameters
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
        // The parameters of a distribution that has them (ADR 0079).
        logMean: by_planner,
        logStandardDeviation: by_planner,
        logVariance: by_planner,
        numTotal: by_planner,
        numSuccesses: by_planner,
        numDraws: by_planner,
        numTrials: by_planner,
        probability: by_planner,
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
        logMean: Scalar,
        logStandardDeviation: Scalar,
        logVariance: Scalar,
        means: Scalars,
        standardDeviations: Scalars,
        variances: Scalars,
        weights: Scalars,
        numTotal: Scalar,
        numSuccesses: Scalar,
        numDraws: Scalar,
        numTrials: Scalar,
        probability: Scalar,
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
    /// The parameters of the distributions [`super::distributions`]
    /// plans (ADR 0079).
    pub(super) more: MoreParams,
    /// What decides the draw: every parameter, and how many are drawn.
    pub(super) on: DrawOn,
}

/// What a random-number sampler reports of its distribution: its moments,
/// and the parameters of a distribution that has them, each absent for one
/// that does not (ADR 0079).
pub(super) struct RandomProps {
    pub(super) mean: Wire,
    pub(super) variance: Wire,
    pub(super) standard_deviation: Wire,
    pub(super) log_mean: Wire,
    pub(super) log_standard_deviation: Wire,
    pub(super) log_variance: Wire,
    pub(super) num_total: Wire,
    pub(super) num_successes: Wire,
    pub(super) num_draws: Wire,
    pub(super) num_trials: Wire,
    pub(super) probability: Wire,
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
/// the distribution `p` names, and what it reports of it.
pub(super) fn plan_random(
    ctx: &mut PlanCtx<'_, '_>,
    n: usize,
    p: RandomParams,
) -> Result<(ElemWiring, RandomProps)> {
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
    let range_attrs = [
        ("from", p.from.is_some()),
        ("to", p.to.is_some()),
        ("step", p.step.is_some()),
        ("exclude", !p.exclude.is_empty()),
    ];
    let more_attrs = p.more.given();
    // A default `to` is one past a literal `from`: by 1 for a uniform, by
    // the step for a discrete one.
    let one_past = |from: &Source, by: f64| match from {
        Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) => Some(Source::constant(v + by)),
        _ => None,
    };
    let mut reported = Vec::new();
    let (dist, params, excludes) = match kind.as_deref().unwrap_or("uniform") {
        "uniform" => {
            refuse_unused(&gaussian_attrs, "uniform")?;
            refuse_unused(&more_attrs, "uniform")?;
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
            refuse_unused(&more_attrs, "discreteUniform")?;
            let (from, step, to) =
                discrete_bounds(p.from, p.step, p.to, &p.exclude).ok_or_else(|| {
                    Error::Unsupported(format!(
                        "<{tag}> with a `from` or `step` that is no number needs a `to`"
                    ))
                })?;
            let dist = Dist::Sequence {
                replace: true,
                order: Order::Unsorted,
                avoid: Avoid::Nothing,
            };
            (dist, vec![from, step, to], p.exclude)
        }
        "gaussian" => {
            refuse_unused(&range_attrs, "gaussian")?;
            refuse_unused(&more_attrs, "gaussian")?;
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
            let literal = |s: &Source| match s {
                Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) => Some(*v),
                _ => None,
            };
            if let (Some(m), Some(d)) = (literal(&mean), literal(&sd))
                && !crate::program::dists::valid_normal(m, d)
            {
                ctx.warn(
                    "doenet-w0126",
                    &format!(
                        "Invalid mean ({m}) or standardDeviation ({d}) for a gaussian random variable. The mean must be a finite number, and the standardDeviation (or the variance it is derived from) must be finite and non-negative. No numbers can be sampled."
                    ),
                );
            }
            (Dist::Gaussian, vec![mean, sd], Vec::new())
        }
        other => {
            // A poisson's rate is `mean`; no other of these reads the
            // gaussian's parameters or a range.
            let own: &[&str] = match other {
                "lognormal" => &["logMean", "logStandardDeviation", "logVariance"],
                "normalmixture" => &["means", "standardDeviations", "variances", "weights"],
                "hypergeometric" => &["numTotal", "numSuccesses", "numDraws"],
                "binomial" => &["numTrials", "probability"],
                _ => &[],
            };
            let others: Vec<(&str, bool)> = more_attrs
                .iter()
                .filter(|(name, _)| !own.contains(name))
                .copied()
                .collect();
            let gaussian_unused = if other == "poisson" {
                &gaussian_attrs[1..]
            } else {
                &gaussian_attrs[..]
            };
            let Some(planned) = distributions::plan(ctx, other, p.more, p.mean)? else {
                return Err(Error::Unsupported(format!("<{tag} type=\"{other}\">")));
            };
            refuse_unused(gaussian_unused, other)?;
            refuse_unused(&range_attrs, other)?;
            refuse_unused(&others, other)?;
            reported = planned.reported;
            (planned.dist, planned.params, Vec::new())
        }
    };
    let (mut wiring, inputs) = plan_draws(ctx, dist, n, params, excludes, p.on)?;
    let [mean, variance, sd] = moments(&mut wiring, dist, inputs.clone());
    let report = |name: &str| -> Wire {
        match reported.iter().find(|(n, _)| *n == name).map(|(_, r)| r) {
            Some(Reported::Param(k)) => Wire::own(inputs[*k]),
            Some(Reported::Value(v)) => Source::constant(*v).into(),
            Some(Reported::Square(k)) => Wire::computed(OpSpec::Mul, vec![inputs[*k], inputs[*k]]),
            None => Wire::absent(),
        }
    };
    let props = RandomProps {
        mean: Wire::own(mean),
        variance: Wire::own(variance),
        standard_deviation: Wire::own(sd),
        log_mean: report("logMean"),
        log_standard_deviation: report("logStandardDeviation"),
        log_variance: report("logVariance"),
        num_total: report("numTotal"),
        num_successes: report("numSuccesses"),
        num_draws: report("numDraws"),
        num_trials: report("numTrials"),
        probability: report("probability"),
    };
    Ok((wiring, props))
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
    plan_draws_avoiding(ctx, dist, n, params, excludes, Vec::new(), on)
}

/// As [`plan_draws`], the draw also reading, after the excludes, the
/// combinations its values avoid (`combos`, as many as `dist` declares,
/// ADR 0079), which the ports given back leave out.
pub(super) fn plan_draws_avoiding(
    ctx: &mut PlanCtx<'_, '_>,
    dist: Dist,
    n: usize,
    params: Vec<Source>,
    excludes: Vec<Source>,
    combos: Vec<Source>,
    on: DrawOn,
) -> Result<(ElemWiring, Vec<Port>)> {
    let ty = ctx.component_type();
    if 1 + params.len() + excludes.len() + combos.len() > MAX_VEC_IN {
        return Err(Error::Unsupported(format!(
            "<{}> excluding more than {} values and combinations' entries",
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
    let avoided: Vec<Port> = combos
        .into_iter()
        .map(|s| wiring.hidden(param(s)))
        .collect();
    if let Some(draw) = draw {
        let mut inputs = inputs.clone();
        inputs.extend(avoided);
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

/// A random-number sampler's planner after its count `n`: its record's
/// parameters ([`RandomParams`]), every one deciding its draw with the
/// count attribute `$count`, planned by [`plan_random`], and its table's
/// props from what that reports. Each sampler's `Attrs`, `attr` and
/// `Planned` are its own, so this is a macro over their names.
macro_rules! plan_random_sampler {
    ($ctx:ident, $attrs:ident, $n:ident, $count:ident) => {{
        let more = $crate::components::structure::distributions::MoreParams {
            log_mean: $attrs.logMean,
            log_standard_deviation: $attrs.logStandardDeviation,
            log_variance: $attrs.logVariance,
            means: $attrs.means,
            standard_deviations: $attrs.standardDeviations,
            variances: $attrs.variances,
            weights: $attrs.weights,
            num_total: $attrs.numTotal,
            num_successes: $attrs.numSuccesses,
            num_draws: $attrs.numDraws,
            num_trials: $attrs.numTrials,
            probability: $attrs.probability,
        };
        let params = RandomParams {
            kind: $attrs.r#type,
            from: $attrs.from,
            to: $attrs.to,
            step: $attrs.step,
            mean: $attrs.mean,
            standard_deviation: $attrs.standardDeviation,
            variance: $attrs.variance,
            exclude: $attrs.exclude,
            more,
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
                    attr::$count,
                    attr::logMean,
                    attr::logStandardDeviation,
                    attr::logVariance,
                    attr::means,
                    attr::standardDeviations,
                    attr::variances,
                    attr::weights,
                    attr::numTotal,
                    attr::numSuccesses,
                    attr::numDraws,
                    attr::numTrials,
                    attr::probability,
                ],
                children: false,
            },
        };
        let (mut wiring, p) = plan_random($ctx, $n, params)?;
        wiring.set_planned(Planned {
            mean: p.mean,
            variance: p.variance,
            standardDeviation: p.standard_deviation,
            logMean: p.log_mean,
            logStandardDeviation: p.log_standard_deviation,
            logVariance: p.log_variance,
            numTotal: p.num_total,
            numSuccesses: p.num_successes,
            numDraws: p.num_draws,
            numTrials: p.num_trials,
            probability: p.probability,
        });
        Ok(wiring)
    }};
}
pub(super) use plan_random_sampler;

/// Its list: `numToSelect` values from the distribution its `type`
/// names ([`plan_random`]).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let n = draw_count("numToSelect", attrs.numToSelect)?;
    plan_random_sampler!(ctx, attrs, n, numToSelect)
}

#[cfg(test)]
#[path = "select_random_numbers.spec.rs"]
mod spec;

/// How many numbers its record draws (`numToSelect`): a reference to it among
/// a list's children contributes as many (ADR 0041).
fn count(record: &Record) -> Option<usize> {
    draw_count("numToSelect", Attrs::of(record).numToSelect).ok()
}
