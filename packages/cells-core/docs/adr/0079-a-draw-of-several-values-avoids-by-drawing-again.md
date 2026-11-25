# A sampler draws from more distributions, and a draw of several values avoids by drawing again

Status: proposed 2026-11-25. Sweep 4's random draws. Builds on ADR 0037
(a load-time choice reads constants, and the compile evaluates them),
ADR 0059 (a copy shares its referent's draw), ADR 0067 (the multivariate
hypergeometric) and ADR 0085 (a variant names its draws). Decision 3
replaces ADR 0037 decision 5's "`excludeCombinations` stays
unsupported".

## Context

The current core's `<sampleRandomNumbers>` and `<selectRandomNumbers>`
(`SampleRandomNumbers.js`, `utils/randomNumbers.js`) draw from eight
distributions; the cells core drew from three (`uniform`,
`discreteUniform`, `gaussian`) and refused the rest: `logNormal`,
`normalMixture`, `hypergeometric`, `binomial` and `poisson`. Its
`<selectFromSequence>` and `<selectPrimeNumbers>` refused
`excludeCombinations` (combinations of values a selection of several must
not be, `_` matching any value) and `<selectFromSequence>` refused
`coprime` (several values with no common factor). The current core meets
both by drawing again, up to 200 times, until the values avoid what they
must, and refuses before it draws what it can tell will fail: combinations
excluding over 70% of the draws (`doenet-e0044`, `e0051`), and a `coprime`
selection of values that are no positive whole numbers (`e0041`), whose
`from` and `step` share a factor (`e0042`), or of one value but 1
(`e0043`).

## Decision

1. **Each distribution is a [`Dist`](crate::program::Dist).**
   `LogNormal` (logMean, logStandardDeviation), `NormalMixture { k }` (k
   means, k standard deviations, k weights), `Hypergeometric` (numTotal,
   numSuccesses, numDraws), `Binomial` (numTrials, probability) and
   `Poisson` (mean), drawn by the `VecOp::Draws` the other samplers use
   and reported by its `VecOp::Moments` (`program/dists.rs`). Parameters
   and defaults are the current core's: a log-normal's spread from
   `logVariance` when given, else `logStandardDeviation`, else 1; a
   mixture's spreads and weights one per mean or one for all (spreads from
   `variances` when given; 1 and equal weights by default); a binomial of
   one fair trial; a Poisson of rate 1; a hypergeometric with no default,
   a missing parameter the missing value. Parameters that describe no
   distribution, or one slower to draw than the current core's limit (1e7
   draws a value), give NaN values and moments, as the current core's do;
   when they are literals, the planner raises the current core's warning
   (`doenet-w0126`..`w0132`, `w0165`, `w0166`), which depends on the
   source alone. A sampler reports `logMean`, `logStandardDeviation`,
   `logVariance`, `numTotal`, `numSuccesses`, `numDraws`, `numTrials` and
   `probability` for the distribution that has them, the missing value
   for another.
2. **A value that needs several uniform numbers reads a stream of its
   own.** Value *i* of a draw is seeded by the *i*-th number of the
   draw's stream (`draw_stream`), and reads the stream that seeds: a
   hypergeometric's items one at a time, a binomial's trials, a Poisson's
   waits, a mixture's component then its normal value. The draw is still
   one scope constant (ADR 0037), shared by a copy (ADR 0059); the
   current core's random stream is not reproduced (ADR 0085). A variant
   never forces these draws: only a selection from a sequence's is
   counted.
3. **A selection of several values avoids by drawing again.** A
   `Dist::Sequence` or `Dist::Primes` carries what its values avoid
   ([`Avoid`](crate::program::Avoid)): nothing, a common factor
   (`coprime`), or `m` combinations, each as many inputs as values drawn,
   read by the draw after its excludes (a `_` the missing value, matching
   any). The draw draws again from streams of its own, up to 200 times,
   until its values avoid it, and gives no value when they never do; with
   nothing to avoid, its first draw is the values, as before. A
   combination is a parenthesized group (`(1 _ 3)`), a group with
   references (`($a 2)`), or a reference to a list (`$ec`), cut to the
   values drawn and dropped when shorter, as the current core takes it;
   letters are compared as their numbers and math by its place in the
   sequence, both as literals only.
4. **What the current core refuses before it draws is refused when
   compiled, from literals.** Over 70% of the draws excluded, counted as
   the current core estimates it (merging contained combinations, less
   those counted twice), is a `cells-choice-domain` error on the
   selection; so are `e0041`..`e0043`, and values left that all share a
   factor (the current core's `e0045`, which it reaches after 200 draws).
   `coprime` beside `excludeCombinations`, or on letters or math, is the
   current core's warning (`w0052`, `w0051`) and ignored. Parameters that
   are references are left to the draw, which gives no value when it
   cannot avoid. A selection with `coprime` is not counted for unique
   variants unless `coprime` is literally false, as the current core
   counts it.

## Consequences

- `selectsamplerandomnumbers.test.ts` passes 76 of 105 (from 38),
  `selectfromsequence.test.ts` 48 of 63 (from 21),
  `selectprimenumbers.test.ts` 23 of 30 (from 15).
- A `<selectFromSequence>` with `to` and `step` and no `from` counts its
  run down from `to` toward 1, as a `<sequence>` does (`to="8" step="2"`
  is 2, 4, 6, 8), when both are literals; before, it started at 1.
- Combinations take inputs of the draw's: a selection of `n` values with
  `m` combinations reads `m n` beside its parameters and excludes, within
  the 64 an instruction reads. Ten combinations of ten values are refused
  as unsupported.
- Not done: a mixture's `means`, `standardDeviations`, `variances` and
  `weights` read back as lists, and `<sampleMultivariateRandomNumber>`'s
  `means` and `variances`: each is a list prop beside the type's list, a
  second (and third) named sequence the core declares one of at most (ADR
  0053); the warnings' arguments as numbers (the cells core's are text);
  the current core's notice of a slow draw (`w0133`); combinations naming
  letters or math by a reference.
