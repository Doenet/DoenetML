//! The distributions a sampler draws from beside the uniform, the gaussian
//! and the sequences (ADR 0079): the log-normal, the normal mixture, the
//! hypergeometric, the binomial and the Poisson, as the current core's
//! `randomNumbers.js` samples them and reports their moments, and what a
//! selection of several values avoids (`excludeCombinations`, `coprime`).
//!
//! Every value is drawn from the stream a draw seeds ([`draw_stream`]): a
//! sample that needs more than one uniform number reads a stream of its
//! own, seeded by the sample's number of the draw's stream, so a draw is
//! still one scope constant (ADR 0037). Parameters that describe no
//! distribution, or one too slow to draw from, give NaN, the samples and
//! the moments alike, as the current core's do.

use super::vector::{draw_stream, normal_quantile};

/// The most draws one value of the hypergeometric, the binomial or the
/// Poisson may take: more is no value, as the current core refuses a draw
/// too slow to make promptly (`MAX_WORK_PER_VARIATE`).
pub(crate) const MAX_WORK: f64 = 1e7;

/// The largest whole number a double counts exactly (`2^53 - 1`).
const MAX_SAFE: f64 = 9_007_199_254_740_991.0;

/// Whether `v` is a whole number a double counts exactly.
fn safe_integer(v: f64) -> bool {
    v.is_finite() && v.fract() == 0.0 && v.abs() <= MAX_SAFE
}

/// A uniform number in `(0, 1)`, `u` in `[0, 1)` moved off 0, which has no
/// logarithm or quantile.
fn off_zero(u: f64) -> f64 {
    let scale = (1u64 << 53) as f64;
    (u * scale + 0.5) / scale
}

/// A whole number below `bound` from `u` in `[0, 1)`.
fn below(u: f64, bound: u64) -> u64 {
    ((u * bound as f64) as u64).min(bound.saturating_sub(1))
}

/// The stream of sample `i` of a draw: its own seed.
fn sample_seed(draw: f64, i: usize) -> f64 {
    draw_stream(draw, i)
}

/// Whether `(logMean, logStandardDeviation)` describe a log-normal: both
/// finite, the spread not negative; a gaussian's rule, as the current
/// core's `validGaussianParameters`.
pub(crate) fn valid_normal(mean: f64, sd: f64) -> bool {
    mean.is_finite() && sd.is_finite() && sd >= 0.0
}

/// `n` log-normal values: the exponential of a normal value of center
/// `mu` and spread `sigma`, from the same stream a gaussian reads.
pub(crate) fn lognormal(draw: f64, mu: f64, sigma: f64, out: &mut [f64]) {
    if !valid_normal(mu, sigma) {
        out.fill(f64::NAN);
        return;
    }
    for (i, o) in out.iter_mut().enumerate() {
        *o = (mu + sigma * normal_quantile(off_zero(draw_stream(draw, i)))).exp();
    }
}

/// The mean and variance of a log-normal, as the current core computes
/// them so neither overflows where the truth is a number.
pub(crate) fn lognormal_moments(mu: f64, sigma: f64) -> (f64, f64) {
    if !valid_normal(mu, sigma) {
        return (f64::NAN, f64::NAN);
    }
    let mean = (mu + (sigma / 2.0) * sigma).exp();
    let variance = if sigma == 0.0 {
        0.0
    } else {
        let log_variance = sigma * sigma;
        let log_factor = if log_variance > 1e-300 {
            (-(-log_variance).exp_m1()).ln()
        } else {
            2.0 * sigma.ln()
        };
        (4.0 * (mu / 2.0 + (sigma / 2.0) * sigma) + log_factor).exp()
    };
    (mean, variance)
}

/// A normal mixture's components: its means, spreads and the share of
/// each, from `k` means, `k` spreads and `k` weights; None where they
/// describe no distribution (`normalMixtureComponents`).
fn mixture(params: &[f64], k: usize) -> Option<(&[f64], &[f64], Vec<f64>)> {
    let (means, rest) = params.split_at(k);
    let (sds, weights) = rest.split_at(k);
    if k == 0
        || !means.iter().all(|m| m.is_finite())
        || !sds.iter().all(|s| s.is_finite() && *s >= 0.0)
        || !weights.iter().all(|w| w.is_finite() && *w >= 0.0)
    {
        return None;
    }
    let total: f64 = weights.iter().sum();
    if !total.is_finite() || total <= 0.0 {
        return None;
    }
    Some((means, sds, weights.iter().map(|w| w / total).collect()))
}

/// `n` values of a normal mixture of `k` components, its parameters `k`
/// means, `k` spreads and `k` weights: each from the component a first
/// uniform number picks in proportion to its weight, then a normal value
/// of it.
pub(crate) fn normal_mixture(draw: f64, params: &[f64], k: usize, out: &mut [f64]) {
    let Some((means, sds, shares)) = mixture(params, k) else {
        out.fill(f64::NAN);
        return;
    };
    for (i, o) in out.iter_mut().enumerate() {
        let seed = sample_seed(draw, i);
        let chosen = seed;
        let mut c = 0;
        let mut cumulative = shares[0];
        while c < k - 1 && chosen >= cumulative {
            c += 1;
            cumulative += shares[c];
        }
        let z = normal_quantile(off_zero(draw_stream(seed, 1)));
        *o = means[c] + sds[c] * z;
    }
}

/// The mean and variance of a normal mixture (the law of total variance,
/// as `normalMixtureMoments`).
pub(crate) fn normal_mixture_moments(params: &[f64], k: usize) -> (f64, f64) {
    let Some((means, sds, shares)) = mixture(params, k) else {
        return (f64::NAN, f64::NAN);
    };
    let mean: f64 = (0..k).map(|i| shares[i] * means[i]).sum();
    let variance = (0..k)
        .map(|i| {
            let offset = means[i] - mean;
            shares[i] * sds[i] * sds[i] + shares[i] * offset * offset
        })
        .sum();
    (mean, variance)
}

/// Whether `(numTotal, numSuccesses, numDraws)` describe a population to
/// draw from promptly (`hypergeometricProblem`).
pub(crate) fn valid_hypergeometric(total: f64, successes: f64, draws: f64) -> bool {
    safe_integer(total)
        && safe_integer(successes)
        && safe_integer(draws)
        && total >= 1.0
        && successes >= 0.0
        && draws >= 0.0
        && successes <= total
        && draws <= total
        && draws.min(total - draws) <= MAX_WORK
}

/// One hypergeometric value from the stream `seed` seeds: the successes
/// among `draws` items drawn one at a time without replacement, drawing
/// the smaller of the taken and the left and tracking the smaller of the
/// successes and the failures (`sampleHypergeometric`).
fn hypergeometric_one(seed: f64, total: u64, successes: u64, draws: u64) -> u64 {
    let complement_draws = draws > total - draws;
    let d = if complement_draws {
        total - draws
    } else {
        draws
    };
    let complement_successes = successes > total - successes;
    let tracked = if complement_successes {
        total - successes
    } else {
        successes
    };
    let (mut tracked_left, mut total_left, mut count) = (tracked, total, 0);
    for t in 0..d as usize {
        if below(draw_stream(seed, t), total_left) < tracked_left {
            count += 1;
            tracked_left -= 1;
        }
        total_left -= 1;
    }
    if complement_draws {
        count = tracked - count;
    }
    if complement_successes {
        count = draws - count;
    }
    count
}

/// `n` hypergeometric values, each from a stream of its own.
pub(crate) fn hypergeometric(draw: f64, total: f64, successes: f64, draws: f64, out: &mut [f64]) {
    if !valid_hypergeometric(total, successes, draws) {
        out.fill(f64::NAN);
        return;
    }
    for (i, o) in out.iter_mut().enumerate() {
        let seed = sample_seed(draw, i);
        *o = hypergeometric_one(seed, total as u64, successes as u64, draws as u64) as f64;
    }
}

/// The mean and variance of a hypergeometric distribution.
pub(crate) fn hypergeometric_moments(total: f64, successes: f64, draws: f64) -> (f64, f64) {
    if !valid_hypergeometric(total, successes, draws) {
        return (f64::NAN, f64::NAN);
    }
    let mean = draws * successes / total;
    let variance = if total == 1.0 {
        0.0
    } else {
        draws * (successes / total) * ((total - successes) / total) * (total - draws)
            / (total - 1.0)
    };
    (mean, variance)
}

/// Whether `(numTrials, probability)` describe a binomial to draw from
/// promptly (`binomialProblem`).
pub(crate) fn valid_binomial(trials: f64, probability: f64) -> bool {
    safe_integer(trials) && (0.0..=MAX_WORK).contains(&trials) && (0.0..=1.0).contains(&probability)
}

/// `n` binomial values: the trials of each, from a stream of its own,
/// that succeed.
pub(crate) fn binomial(draw: f64, trials: f64, probability: f64, out: &mut [f64]) {
    if !valid_binomial(trials, probability) {
        out.fill(f64::NAN);
        return;
    }
    for (i, o) in out.iter_mut().enumerate() {
        let seed = sample_seed(draw, i);
        *o = (0..trials as usize)
            .filter(|&t| draw_stream(seed, t) < probability)
            .count() as f64;
    }
}

/// The mean and variance of a binomial distribution.
pub(crate) fn binomial_moments(trials: f64, probability: f64) -> (f64, f64) {
    if !valid_binomial(trials, probability) {
        return (f64::NAN, f64::NAN);
    }
    (
        trials * probability,
        trials * probability * (1.0 - probability),
    )
}

/// Whether `mean` is a Poisson rate to draw from promptly
/// (`poissonMeanProblem`).
pub(crate) fn valid_poisson(mean: f64) -> bool {
    (0.0..=MAX_WORK).contains(&mean)
}

/// `n` Poisson values: how many exponential waits, from a stream of
/// their own, fit within `mean` (`samplePoisson`).
pub(crate) fn poisson(draw: f64, mean: f64, out: &mut [f64]) {
    if !valid_poisson(mean) {
        out.fill(f64::NAN);
        return;
    }
    for (i, o) in out.iter_mut().enumerate() {
        let seed = sample_seed(draw, i);
        let wait = |t: usize| -off_zero(draw_stream(seed, t)).ln();
        let (mut count, mut t) = (0usize, 0usize);
        let mut total = wait(t);
        while total < mean {
            count += 1;
            t += 1;
            total += wait(t);
        }
        *o = count as f64;
    }
}

/// The mean and variance of a Poisson distribution: its rate, both.
pub(crate) fn poisson_moments(mean: f64) -> (f64, f64) {
    if valid_poisson(mean) {
        (mean, mean)
    } else {
        (f64::NAN, f64::NAN)
    }
}

/// The greatest common divisor of whole numbers, as the current core's
/// `gcd` of several: NaN for a value that is no whole number.
pub(crate) fn gcd(values: &[f64]) -> f64 {
    let mut g: u64 = 0;
    for &v in values {
        if !safe_integer(v) {
            return f64::NAN;
        }
        let mut a = v.abs() as u64;
        let mut b = g;
        while b != 0 {
            (a, b) = (b, a % b);
        }
        g = a;
    }
    g as f64
}

/// Whether values drawn match an excluded combination of `combos`, as
/// many values each, in order: each entry equal to its value (to a
/// relative 1e-14, for round-off), or NaN, which matches anything
/// (`checkForExcludedCombination`).
pub(crate) fn matches_combination(values: &[f64], combos: &[f64]) -> bool {
    let n = values.len();
    if n == 0 {
        return false;
    }
    combos.chunks_exact(n).any(|combo| {
        combo
            .iter()
            .zip(values)
            .all(|(&c, &v)| c.is_nan() || (c - v).abs() <= 1e-14 * c.abs().max(v.abs()))
    })
}

/// Each distribution's values, over many draws, have the moments it
/// reports, and parameters that describe none give NaN.
#[cfg(test)]
mod tests {
    use super::*;

    /// The mean and variance (uncorrected) of five values from `fill` a
    /// draw, over draws spread across `[0, 1)`.
    fn sampled(fill: impl Fn(f64, &mut [f64])) -> (f64, f64) {
        let runs = 2000;
        let mut xs = Vec::new();
        for r in 0..runs {
            let mut out = [0.0; 5];
            fill((r as f64 + 0.37) / runs as f64, &mut out);
            xs.extend(out);
        }
        let n = xs.len() as f64;
        let mean = xs.iter().sum::<f64>() / n;
        let var = xs.iter().map(|x| (x - mean) * (x - mean)).sum::<f64>() / n;
        (mean, var)
    }

    fn close(what: &str, got: (f64, f64), want: (f64, f64), tol: (f64, f64)) {
        assert!(
            (got.0 - want.0).abs() < tol.0,
            "{what} mean {got:?} {want:?}"
        );
        assert!(
            (got.1 - want.1).abs() < tol.1,
            "{what} var {got:?} {want:?}"
        );
    }

    #[test]
    fn values_have_the_moments_reported() {
        let want = lognormal_moments(1.0, 0.25);
        let got = sampled(|d, o| lognormal(d, 1.0, 0.25, o));
        close("lognormal", got, want, (0.05, 0.1));
        let mix = [-4.0, 6.0, 1.0, 2.0, 1.0, 3.0];
        let want = normal_mixture_moments(&mix, 2);
        assert_eq!(want, (3.5, 22.0));
        let got = sampled(|d, o| normal_mixture(d, &mix, 2, o));
        close("mixture", got, want, (0.3, 1.5));
        let want = hypergeometric_moments(20.0, 7.0, 5.0);
        let got = sampled(|d, o| hypergeometric(d, 20.0, 7.0, 5.0, o));
        close("hypergeometric", got, want, (0.05, 0.1));
        let want = hypergeometric_moments(20.0, 15.0, 16.0);
        let got = sampled(|d, o| hypergeometric(d, 20.0, 15.0, 16.0, o));
        close("hypergeometric, complements", got, want, (0.05, 0.1));
        let want = binomial_moments(10.0, 0.3);
        let got = sampled(|d, o| binomial(d, 10.0, 0.3, o));
        close("binomial", got, want, (0.05, 0.15));
        let want = poisson_moments(4.0);
        let got = sampled(|d, o| poisson(d, 4.0, o));
        close("poisson", got, want, (0.1, 0.3));
    }

    #[test]
    fn degenerate_parameters_give_one_value() {
        let mut out = [0.0; 3];
        hypergeometric(0.4, 10.0, 4.0, 10.0, &mut out);
        assert_eq!(out, [4.0; 3]);
        hypergeometric(0.4, 10.0, 0.0, 4.0, &mut out);
        assert_eq!(out, [0.0; 3]);
        binomial(0.4, 6.0, 1.0, &mut out);
        assert_eq!(out, [6.0; 3]);
        poisson(0.4, 0.0, &mut out);
        assert_eq!(out, [0.0; 3]);
        lognormal(0.4, 2.0, 0.0, &mut out);
        assert_eq!(out, [2f64.exp(); 3]);
        assert_eq!(lognormal_moments(1e308, 0.0), (f64::INFINITY, 0.0));
        assert_eq!(hypergeometric_moments(1.0, 1.0, 1.0), (1.0, 0.0));
    }

    #[test]
    fn no_distribution_no_value() {
        type Fill<'a> = &'a dyn Fn(&mut [f64]);
        let cases: [Fill; 9] = [
            &|o| hypergeometric(0.5, 10.0, 11.0, 4.0, o),
            &|o| hypergeometric(0.5, 1e16, 10.0, 5.0, o),
            &|o| hypergeometric(0.5, 1e9, 1.0, 5e8, o),
            &|o| binomial(0.5, 6.5, 0.5, o),
            &|o| binomial(0.5, 6.0, 1.5, o),
            &|o| poisson(0.5, -1.0, o),
            &|o| poisson(0.5, 1e9, o),
            &|o| lognormal(0.5, 0.0, -2.0, o),
            &|o| normal_mixture(0.5, &[0.0, 5.0, 1.0, -2.0, 2.0, 3.0], 2, o),
        ];
        for fill in cases {
            let mut out = [0.0; 2];
            fill(&mut out);
            assert!(out.iter().all(|v| v.is_nan()));
        }
        assert!(lognormal_moments(f64::INFINITY, 1.0).0.is_nan());
        assert!(normal_mixture_moments(&[], 0).0.is_nan());
    }

    #[test]
    fn combinations_match_with_wildcards_and_round_off() {
        let combos = [0.1, 0.3, f64::NAN, 2.0];
        assert!(matches_combination(&[0.1, 0.30000000000000004], &combos));
        assert!(matches_combination(&[7.0, 2.0], &combos));
        assert!(!matches_combination(&[0.3, 0.1], &combos));
        assert_eq!(gcd(&[15.0, 21.0]), 3.0);
        assert_eq!(gcd(&[15.0, 17.0, 21.0]), 1.0);
        assert!(gcd(&[1.5, 2.0]).is_nan());
    }
}
