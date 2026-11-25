//! The distributions a random-number sampler draws from beside the
//! uniform, the discrete uniform and the gaussian (ADR 0079): `logNormal`,
//! `normalMixture`, `hypergeometric`, `binomial` and `poisson`, with the
//! current core's parameters and defaults (`SampleRandomNumbers.js`).
//! Their values and moments are `VecOp::Draws` and `VecOp::Moments` of a
//! [`Dist`] ([`crate::program::dists`]); parameters written as literals
//! that describe no distribution are the current core's warning, the
//! values and moments NaN.

use crate::compile::api::*;
use crate::error::{Error, Result};
use crate::limits::MAX_VEC_IN;
use crate::program::Dist;
use crate::program::dists;

/// The attributes of the distributions this module plans, as a sampler's
/// record gives them.
#[derive(Default)]
pub(crate) struct MoreParams {
    pub(crate) log_mean: Option<Source>,
    pub(crate) log_standard_deviation: Option<Source>,
    pub(crate) log_variance: Option<Source>,
    pub(crate) means: Vec<Source>,
    pub(crate) standard_deviations: Vec<Source>,
    pub(crate) variances: Vec<Source>,
    pub(crate) weights: Vec<Source>,
    pub(crate) num_total: Option<Source>,
    pub(crate) num_successes: Option<Source>,
    pub(crate) num_draws: Option<Source>,
    pub(crate) num_trials: Option<Source>,
    pub(crate) probability: Option<Source>,
}

impl MoreParams {
    /// Each attribute, by name, and whether it was given.
    pub(crate) fn given(&self) -> [(&'static str, bool); 12] {
        [
            ("logMean", self.log_mean.is_some()),
            (
                "logStandardDeviation",
                self.log_standard_deviation.is_some(),
            ),
            ("logVariance", self.log_variance.is_some()),
            ("means", !self.means.is_empty()),
            ("standardDeviations", !self.standard_deviations.is_empty()),
            ("variances", !self.variances.is_empty()),
            ("weights", !self.weights.is_empty()),
            ("numTotal", self.num_total.is_some()),
            ("numSuccesses", self.num_successes.is_some()),
            ("numDraws", self.num_draws.is_some()),
            ("numTrials", self.num_trials.is_some()),
            ("probability", self.probability.is_some()),
        ]
    }
}

/// How a parameter of a distribution this module plans is reported as a
/// prop: the parameter's port among those [`super::select_random_numbers::plan_draws`] gives
/// (by its position), or a value of its own.
#[derive(Clone)]
pub(crate) enum Reported {
    /// The parameter at this position.
    Param(usize),
    /// A literal the planner computed (a variance given for a deviation).
    Value(f64),
    /// The square of the parameter at this position.
    Square(usize),
}

/// The parameters a sampler reports beside its moments, each by name.
pub(crate) type ReportedParams = Vec<(&'static str, Reported)>;

/// A distribution this module plans: its [`Dist`], its parameters in the
/// order the draw reads them, and what the sampler reports of them.
pub(crate) struct Planned {
    pub(crate) dist: Dist,
    pub(crate) params: Vec<Source>,
    pub(crate) reported: ReportedParams,
}

/// The literal value of `s`, if it is one.
fn literal(s: &Source) -> Option<f64> {
    match s {
        Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) => Some(*v),
        _ => None,
    }
}

/// The literal values of `params`, when every one is a literal (a missing
/// one NaN, as [`Source::absent`] is).
fn literals(params: &[Source]) -> Option<Vec<f64>> {
    params.iter().map(literal).collect()
}

/// A deviation given as a variance: its square root, of a literal. A
/// variance that is no literal is refused: the root would be an operator
/// over a draw's parameter, which a draw reads as written.
fn root(tag: &str, attr: &str, variance: &Source) -> Result<(Source, f64)> {
    match literal(variance) {
        Some(v) => Ok((Source::constant(v.sqrt()), v)),
        None => Err(Error::Unsupported(format!(
            "<{tag} {attr}> that is no number"
        ))),
    }
}

/// Plans the distribution `kind` names (lower case), when this module
/// knows it; None for another. Warns, as the current core does, when its
/// parameters, all literals, describe no distribution.
pub(crate) fn plan(
    ctx: &mut PlanCtx<'_, '_>,
    kind: &str,
    p: MoreParams,
    mean: Option<Source>,
) -> Result<Option<Planned>> {
    let tag = ctx.component_type().tag();
    Ok(Some(match kind {
        "lognormal" => {
            let mu = p.log_mean.unwrap_or_else(|| Source::constant(0.0));
            let (sigma, log_variance) = match (p.log_variance, p.log_standard_deviation) {
                (Some(v), _) => {
                    let (sd, v) = root(tag, "logVariance", &v)?;
                    (sd, Reported::Value(v))
                }
                (None, Some(sd)) => (sd, Reported::Square(1)),
                (None, None) => (Source::constant(1.0), Reported::Value(1.0)),
            };
            let params = vec![mu, sigma];
            if let Some([mu, sigma]) = literals(&params).as_deref().map(|v| [v[0], v[1]])
                && !dists::valid_normal(mu, sigma)
            {
                ctx.warn(
                    "doenet-w0165",
                    &format!(
                        "Invalid logMean ({mu}) or logStandardDeviation ({sigma}) for a lognormal random variable. These describe the normal distribution the values are the exponential of: the logMean must be a finite number, and the logStandardDeviation (or the logVariance it is derived from) must be finite and non-negative. No numbers can be sampled."
                    ),
                );
            }
            Planned {
                dist: Dist::LogNormal,
                params,
                reported: vec![
                    ("logMean", Reported::Param(0)),
                    ("logStandardDeviation", Reported::Param(1)),
                    ("logVariance", log_variance),
                ],
            }
        }
        "normalmixture" => mixture(ctx, p)?,
        "hypergeometric" => {
            let params: Vec<Source> = [p.num_total, p.num_successes, p.num_draws]
                .into_iter()
                .map(|s| s.unwrap_or_else(Source::absent))
                .collect();
            if let Some(v) = literals(&params) {
                let (total, successes, draws) = (v[0], v[1], v[2]);
                let shown = |x: f64| {
                    if x.is_nan() {
                        "not set".to_string()
                    } else {
                        x.to_string()
                    }
                };
                if !dists::valid_hypergeometric(total, successes, draws) {
                    if draws.min(total - draws) > dists::MAX_WORK
                        && dists::valid_hypergeometric(total, successes, 0.0)
                    {
                        ctx.warn(
                            "doenet-w0128",
                            &format!(
                                "Drawing {draws} items from a population of {total} would need more than {} random draws for each sample, which would stop the page from responding. Reduce numDraws, or bring it closer to numTotal.",
                                dists::MAX_WORK
                            ),
                        );
                    } else {
                        ctx.warn(
                            "doenet-w0127",
                            &format!(
                                "Invalid numTotal ({}), numSuccesses ({}), or numDraws ({}) for a hypergeometric random variable. numTotal must be a positive whole number, and numSuccesses and numDraws must be non-negative whole numbers no larger than numTotal. All three must also stay below about nine quadrillion, past which whole numbers can no longer be counted exactly.",
                                shown(total),
                                shown(successes),
                                shown(draws)
                            ),
                        );
                    }
                }
            }
            Planned {
                dist: Dist::Hypergeometric,
                params,
                reported: vec![
                    ("numTotal", Reported::Param(0)),
                    ("numSuccesses", Reported::Param(1)),
                    ("numDraws", Reported::Param(2)),
                ],
            }
        }
        "binomial" => {
            let params = vec![
                p.num_trials.unwrap_or_else(|| Source::constant(1.0)),
                p.probability.unwrap_or_else(|| Source::constant(0.5)),
            ];
            if let Some(v) = literals(&params) {
                let (trials, probability) = (v[0], v[1]);
                if !dists::valid_binomial(trials, probability) {
                    if trials > dists::MAX_WORK && dists::valid_binomial(0.0, probability) {
                        if trials.fract() == 0.0 && trials <= 9_007_199_254_740_991.0 {
                            ctx.warn(
                                "doenet-w0130",
                                &format!(
                                    "Running {trials} trials would need more than {} random draws for each sample, which would stop the page from responding. Reduce numTrials.",
                                    dists::MAX_WORK
                                ),
                            );
                        } else {
                            binomial_invalid(ctx, trials, probability);
                        }
                    } else {
                        binomial_invalid(ctx, trials, probability);
                    }
                }
            }
            Planned {
                dist: Dist::Binomial,
                params,
                reported: vec![
                    ("numTrials", Reported::Param(0)),
                    ("probability", Reported::Param(1)),
                ],
            }
        }
        "poisson" => {
            let params = vec![mean.unwrap_or_else(|| Source::constant(1.0))];
            if let Some(v) = literals(&params) {
                let mean = v[0];
                if !(mean.is_finite() && mean >= 0.0) {
                    ctx.warn(
                        "doenet-w0131",
                        &format!(
                            "Invalid mean ({mean}) for a poisson random variable. The mean must be a finite, non-negative number."
                        ),
                    );
                } else if mean > dists::MAX_WORK {
                    ctx.warn(
                        "doenet-w0132",
                        &format!(
                            "A poisson mean of {mean} would need more than {} random draws for each sample, which would stop the page from responding. Reduce the mean.",
                            dists::MAX_WORK
                        ),
                    );
                }
            }
            Planned {
                dist: Dist::Poisson,
                params,
                reported: Vec::new(),
            }
        }
        _ => return Ok(None),
    }))
}

/// The current core's warning for a binomial's parameters
/// (`doenet-w0129`).
fn binomial_invalid(ctx: &mut PlanCtx<'_, '_>, trials: f64, probability: f64) {
    ctx.warn(
        "doenet-w0129",
        &format!(
            "Invalid numTrials ({trials}) or probability ({probability}) for a binomial random variable. numTrials must be a non-negative whole number below about nine quadrillion, past which whole numbers can no longer be counted exactly, and probability must be between 0 and 1."
        ),
    );
}

/// The most components a normal mixture's draw reads: three parameters
/// each, after the draw.
const MAX_COMPONENTS: usize = (MAX_VEC_IN - 1) / 3;

/// A normal mixture: one component per mean, its spread and weight each
/// given one per component or once for all (`standardDeviations` from
/// `variances` when those are given; a spread of 1 and equal weights by
/// default). Lists of other lengths, or no means, describe no
/// distribution: the warning, and the values and moments NaN.
fn mixture(ctx: &mut PlanCtx<'_, '_>, p: MoreParams) -> Result<Planned> {
    let tag = ctx.component_type().tag();
    let k = p.means.len();
    if k > MAX_COMPONENTS {
        return Err(Error::Unsupported(format!(
            "<{tag} type=\"normalMixture\"> of more than {MAX_COMPONENTS} components"
        )));
    }
    let sds: Vec<Source> = if !p.variances.is_empty() {
        p.variances
            .iter()
            .map(|v| root(tag, "variances", v).map(|(sd, _)| sd))
            .collect::<Result<_>>()?
    } else if !p.standard_deviations.is_empty() {
        p.standard_deviations.clone()
    } else {
        vec![Source::constant(1.0)]
    };
    let weights = if p.weights.is_empty() {
        vec![Source::constant(1.0)]
    } else {
        p.weights.clone()
    };
    let each = |list: Vec<Source>| -> Option<Vec<Source>> {
        match list.len() {
            n if n == k => Some(list),
            1 => Some(vec![list[0].clone(); k]),
            _ => None,
        }
    };
    let shown = |list: &[Source]| -> String {
        if list.is_empty() {
            return "not set".into();
        }
        list.iter()
            .map(|s| literal(s).map_or("?".into(), |v| v.to_string()))
            .collect::<Vec<_>>()
            .join(", ")
    };
    let warn = |ctx: &mut PlanCtx<'_, '_>| {
        let sds_written = if p.variances.is_empty() {
            shown(&sds)
        } else {
            shown(&p.variances)
        };
        ctx.warn(
            "doenet-w0166",
            &format!(
                "Invalid means ({}), standardDeviations ({}), or weights ({}) for a normal mixture random variable. means must list at least one component and give a finite number for each. standardDeviations (or the variances they are derived from) and weights must each give either one finite, non-negative value per component or a single value standing for all of them, and the weights must add up to a total that is positive and finite. No numbers can be sampled.",
                shown(&p.means),
                sds_written,
                shown(&weights)
            ),
        );
    };
    let (Some(sd_each), Some(weight_each)) = (each(sds.clone()), each(weights.clone())) else {
        warn(ctx);
        return Ok(no_mixture());
    };
    if k == 0 {
        warn(ctx);
        return Ok(no_mixture());
    }
    let mut params = p.means.clone();
    params.extend(sd_each);
    params.extend(weight_each);
    if let Some(v) = literals(&params)
        && dists::normal_mixture_moments(&v, k).0.is_nan()
    {
        warn(ctx);
    }
    Ok(Planned {
        dist: Dist::NormalMixture { k: k as u8 },
        params,
        reported: Vec::new(),
    })
}

/// A normal mixture that is no distribution: one component of no values.
fn no_mixture() -> Planned {
    Planned {
        dist: Dist::NormalMixture { k: 1 },
        params: vec![Source::absent(), Source::absent(), Source::absent()],
        reported: Vec::new(),
    }
}
