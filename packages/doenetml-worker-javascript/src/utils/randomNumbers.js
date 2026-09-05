import { codedDiagnostic } from "./diagnostics";

// The samplers below are exact, but each takes time linear in its parameters and runs
// synchronously on the worker thread. A warning cannot call back a loop that is already
// running, so parameters whose inner loop would exceed this many draws are refused
// outright, exactly as impossible parameters are: mistyping an extra zero or two then
// yields NaN and an explanation instead of a frozen activity. The limit sits far above
// any classroom-scale population and holds one variate to roughly a tenth of a second.
//
// This bounds the work for a single variate, not for the component as a whole:
// `numSamples` multiplies it, and is left unbounded here just as it is for the
// distributions that predate these.
const MAX_WORK_PER_VARIATE = 1e7;

// The number of distinct values a double can hold in [0, 1), and so the finest
// resolution any sampler here can draw at.
const TWO_TO_THE_53 = 0x20000000000000;

// Well below the hard limit a document is merely sluggish rather than stuck, which is
// worth saying but not worth refusing.
const WORK_PER_VARIATE_WARNING_THRESHOLD = 1e6;

/**
 * Sample a single hypergeometric variate: the number of successes obtained when drawing
 * `numDraws` items without replacement from a population of `numTotal` items, of which
 * `numSuccesses` are successes.
 *
 * Draws the items one at a time, shrinking the urn as it goes. The two symmetries of
 * the distribution are applied first so that the loop is never longer than it has to
 * be: we can draw the items left behind instead of the items taken, and we can count
 * failures instead of successes. That makes it O(min(numDraws, numTotal - numDraws)).
 */
export function sampleHypergeometric({
    numTotal,
    numSuccesses,
    numDraws,
    rng,
}) {
    // draw the smaller of the taken and left-behind groups
    const complementDraws = numDraws > numTotal - numDraws;
    const draws = complementDraws ? numTotal - numDraws : numDraws;

    // track the smaller of the successes and failures
    const complementSuccesses = numSuccesses > numTotal - numSuccesses;
    const tracked = complementSuccesses
        ? numTotal - numSuccesses
        : numSuccesses;

    let trackedLeft = tracked;
    let totalLeft = numTotal;
    let count = 0;

    for (let i = 0; i < draws; i++) {
        if (uniformBelow(rng, totalLeft) < trackedLeft) {
            count++;
            trackedLeft--;
        }
        totalLeft--;
    }

    // undo the substitutions, innermost first
    if (complementDraws) {
        count = tracked - count;
    }
    if (complementSuccesses) {
        count = numDraws - count;
    }

    return count;
}

/**
 * Sample a single multivariate hypergeometric variate: the vector of per-category
 * counts obtained when drawing `numDraws` items without replacement from a population
 * partitioned into categories of sizes `numInCategories`.
 *
 * Draws each category's count in turn as a univariate hypergeometric against the part
 * of the population not yet accounted for, which is exact rather than an approximation.
 * The last category takes whatever draws remain, so the counts always sum to `numDraws`.
 */
export function sampleMultivariateHypergeometric({
    numInCategories,
    numDraws,
    rng,
}) {
    const counts = [];

    let remainingInPopulation = numInCategories.reduce((a, c) => a + c, 0);
    let remainingDraws = numDraws;

    for (let i = 0; i < numInCategories.length - 1; i++) {
        const count = sampleHypergeometric({
            numTotal: remainingInPopulation,
            numSuccesses: numInCategories[i],
            numDraws: remainingDraws,
            rng,
        });

        counts.push(count);
        remainingInPopulation -= numInCategories[i];
        remainingDraws -= count;
    }

    // whatever is left must come from the final category
    counts.push(remainingDraws);

    return counts;
}

/**
 * Sample a single binomial variate: the number of successes in `numTrials` independent
 * trials that each succeed with probability `probability`. Runs the trials directly,
 * which is O(numTrials).
 */
export function sampleBinomial({ numTrials, probability, rng }) {
    let count = 0;
    for (let i = 0; i < numTrials; i++) {
        if (preciseUniform(rng) < probability) {
            count++;
        }
    }
    return count;
}

/**
 * One draw from the exponential distribution with rate 1.
 *
 * The generator's range is [0, 1), so it can return exactly zero, and `-log(0)` is
 * infinite — which would end a Poisson sample early and bias it low. Redrawing on a
 * zero is how the Box-Muller transform in `sampleFromRandomNumbers` below handles the
 * same hazard, and it leaves the distribution exact: it rejects a single point, which
 * the exponential distribution gives no weight to.
 */
function sampleExponential(rng) {
    let uniform = 0;
    while (uniform === 0) {
        uniform = preciseUniform(rng);
    }
    return -Math.log(uniform);
}

/**
 * Sample a single Poisson variate with the given mean, by counting how many
 * exponential interarrival times fit within `mean`. This is Knuth's method written
 * with logarithms: accumulating `-log(rng())` until the total reaches `mean` is
 * equivalent to multiplying uniforms until the product drops below e^(-mean), but
 * the sum does not underflow the way the product does once `mean` exceeds about 745.
 * Takes O(mean) draws on average.
 */
export function samplePoisson({ mean, rng }) {
    let count = 0;
    let total = sampleExponential(rng);

    while (total < mean) {
        count++;
        total += sampleExponential(rng);
    }

    return count;
}

/**
 * One uniform draw from [0, 1) with the full 53 bits of a double, and the whole
 * number behind it.
 *
 * `seedrandom.alea`, which Core supplies, returns exact multiples of 2^-32 — only
 * about four billion distinct values. That is ample for the distributions that
 * predate these, but not for the samplers below, which compare against quantities
 * that can legitimately be far smaller: a 32-bit draw can only answer such a
 * comparison with its single zero value, so the event happens with probability
 * 2^-32 rather than the one asked for.
 *
 * Two draws are combined explicitly rather than calling the generator's own
 * `double()`, so that the result depends on nothing but the sequence `rng` yields:
 * a generator without that method produces the same numbers here, and a variant
 * stays reproducible. Both halves are exact, since 2^32 divides evenly by 2^26 and
 * 2^27, so no value is favored.
 *
 * 53 bits is where this ends, not merely where it currently stops: it is the whole
 * resolution of the number type. `uniformBelow` below sidesteps it for the
 * hypergeometric, which needs only whole numbers and so can be exact across every
 * population it accepts. `sampleBinomial` cannot, because a probability is a real
 * number: one smaller than 2^-53 is below the finest value a draw can take, so it
 * occurs at that floor rather than at its own rate. Distinguishing the two would
 * take on the order of 2^53 samples, and the smallest population the floor is
 * wrong for holds nine quadrillion items.
 *
 * Only the samplers added alongside this use it. The gaussian, uniform and
 * discrete-uniform paths keep their single 32-bit draw, because changing how many
 * values they consume would renumber every variant of every document already
 * written against them.
 */
function preciseUniformInteger(rng) {
    const high = Math.floor(rng() * 0x4000000); // 26 bits
    const low = Math.floor(rng() * 0x8000000); // 27 bits
    return high * 0x8000000 + low;
}

function preciseUniform(rng) {
    return preciseUniformInteger(rng) / TWO_TO_THE_53;
}

/**
 * A whole number drawn uniformly from [0, `bound`), exactly, for any `bound` up to
 * 2^53.
 *
 * Comparing a [0, 1) draw against `successes / total` would not be exact: that
 * quotient rarely lands on the 2^53 grid, so the number of grid points below it is
 * rounded up, and one extra point out of 2^53 is a factor of two when the quotient
 * is itself near 2^-53. Drawing the integer instead removes the quotient.
 *
 * Values at or above the largest whole multiple of `bound` are rejected and redrawn
 * rather than folded back in, since folding is what would leave the low remainders
 * likelier than the high ones. How often that costs a redraw depends on the bound:
 * the discarded band is narrower than `bound` out of 2^53, so nothing of ordinary
 * size ever reaches it, but once `bound` passes 2^52 the largest whole multiple is
 * the bound itself and close to half of all draws are discarded. That is the worst
 * it gets — the accepted range is always more than half of 2^53, so this takes
 * fewer than two draws on average whatever the bound.
 */
function uniformBelow(rng, bound) {
    // the largest multiple of `bound` that fits, so every remainder is equally likely
    const limit = Math.floor(TWO_TO_THE_53 / bound) * bound;

    let drawn = preciseUniformInteger(rng);
    while (drawn >= limit) {
        drawn = preciseUniformInteger(rng);
    }

    return drawn % bound;
}

/**
 * Whether `mean` and `standardDeviation` describe a gaussian distribution that can
 * be sampled from. An infinite spread passes a bare `>= 0` test but produces
 * infinite or NaN values, so finiteness is checked on both.
 *
 * Shared with the component, so that the reported moments are NaN for exactly the
 * parameters whose samples are NaN — the same guarantee the discrete distributions
 * give.
 */
export function validGaussianParameters({ mean, standardDeviation }) {
    return (
        Number.isFinite(mean) &&
        Number.isFinite(standardDeviation) &&
        standardDeviation >= 0
    );
}

/** How many draws `sampleHypergeometric` makes for one variate. */
function hypergeometricWork({ numTotal, numDraws }) {
    // it draws whichever of the taken and left-behind groups is smaller
    return Math.min(numDraws, numTotal - numDraws);
}

/**
 * How a parameter is written into a diagnostic: the number the author gave, or the
 * sentinel `"not-set"` for one they left off.
 *
 * The hypergeometric parameters are the only ones with no default, so an omitted
 * one reaches a message as `null` — a word out of the implementation rather than
 * anything the author typed, and omitting one is the first way most authors reach
 * that message. The catalog selects on the sentinel and says "not set" in the
 * reader's language instead.
 */
function reportedValue(value) {
    return value == null ? "not-set" : value;
}

/**
 * The result for parameters nothing can be sampled from: a full-length run of NaN,
 * so that a caller never has to special-case the failure, alongside the reason.
 */
function unsampleable(numSamples, problem) {
    return {
        sampledValues: Array(numSamples).fill(NaN),
        diagnostics: [problem],
    };
}

/**
 * Why `numTotal`, `numSuccesses`, and `numDraws` cannot be sampled from, or `null` if
 * they can. A usable set describes a population of at least one item, split into a
 * non-negative number of successes and failures, from which a non-negative number of
 * items is drawn few enough times to finish promptly.
 */
function hypergeometricProblem({ numTotal, numSuccesses, numDraws }) {
    if (
        // Safe integers, not merely whole ones: `Number.isInteger(1e308)` is true,
        // but nothing about a count that large works. Adjacent whole numbers stop
        // being distinguishable, so the sampler's `totalLeft--` changes nothing, and
        // far enough out `numDraws * numSuccesses` overflows and the reported mean
        // becomes Infinity.
        //
        // Capping at 2^53 is what makes the counts themselves exact, which is what
        // the sampler needs. It does not make their products exact — multiplying two
        // values near the cap already rounds — but it does keep them finite, which
        // is all the moment formulas need. Nine quadrillion is no real limit on a
        // population.
        !Number.isSafeInteger(numTotal) ||
        !Number.isSafeInteger(numSuccesses) ||
        !Number.isSafeInteger(numDraws) ||
        numTotal < 1 ||
        numSuccesses < 0 ||
        numDraws < 0 ||
        numSuccesses > numTotal ||
        numDraws > numTotal
    ) {
        return codedDiagnostic({
            type: "warning",
            code: "doenet-w0127",
            args: {
                numTotal: reportedValue(numTotal),
                numSuccesses: reportedValue(numSuccesses),
                numDraws: reportedValue(numDraws),
            },
        });
    }

    if (hypergeometricWork({ numTotal, numDraws }) > MAX_WORK_PER_VARIATE) {
        return codedDiagnostic({
            type: "warning",
            code: "doenet-w0128",
            args: { numTotal, numDraws, maxDraws: MAX_WORK_PER_VARIATE },
        });
    }

    return null;
}

/**
 * Whether `numTotal`, `numSuccesses`, and `numDraws` describe a hypergeometric
 * distribution this can actually sample from.
 *
 * Shared with the components so that the reported mean and variance are NaN for
 * exactly the parameters whose samples are NaN.
 */
export function validHypergeometricParameters(parameters) {
    return hypergeometricProblem(parameters) === null;
}

/**
 * Why `numTrials` and `probability` cannot be sampled from, or `null` if they can. A
 * usable set is a non-negative whole number of trials, each succeeding with a
 * probability in [0, 1], few enough to finish promptly.
 */
function binomialProblem({ numTrials, probability }) {
    if (
        // safe integers, for the reason given on the hypergeometric above
        !Number.isSafeInteger(numTrials) ||
        numTrials < 0 ||
        !(probability >= 0) ||
        !(probability <= 1)
    ) {
        return codedDiagnostic({
            type: "warning",
            code: "doenet-w0129",
            args: { numTrials, probability },
        });
    }

    if (numTrials > MAX_WORK_PER_VARIATE) {
        return codedDiagnostic({
            type: "warning",
            code: "doenet-w0130",
            args: { numTrials, maxDraws: MAX_WORK_PER_VARIATE },
        });
    }

    return null;
}

/**
 * Whether `numTrials` and `probability` describe a binomial distribution this can
 * actually sample from. Shared with the components, as above.
 */
export function validBinomialParameters(parameters) {
    return binomialProblem(parameters) === null;
}

/**
 * Why `mean` cannot be sampled from as a Poisson rate, or `null` if it can. A usable
 * rate is finite, non-negative, and small enough to finish promptly — `samplePoisson`
 * makes about `mean` draws, and an infinite mean would never terminate at all.
 */
function poissonMeanProblem(mean) {
    if (!Number.isFinite(mean) || mean < 0) {
        // the rate as the author wrote it, which is what reaches here — the reported
        // `mean` is already NaN for anything unusable and could not be echoed back
        return codedDiagnostic({
            type: "warning",
            code: "doenet-w0131",
            args: { mean },
        });
    }

    if (mean > MAX_WORK_PER_VARIATE) {
        return codedDiagnostic({
            type: "warning",
            code: "doenet-w0132",
            args: { mean, maxDraws: MAX_WORK_PER_VARIATE },
        });
    }

    return null;
}

/**
 * Whether `mean` describes a Poisson distribution this can actually sample from.
 * Shared with the components, as above.
 */
export function validPoissonMean(mean) {
    return poissonMeanProblem(mean) === null;
}

/**
 * Whether `numInCategories` and `numDraws` describe a multivariate hypergeometric
 * distribution: a population split into at least one category of a non-negative whole
 * number of items, from which a non-negative whole number of items no larger than the
 * whole population is drawn.
 *
 * Shared with the component so that the reported means and variances are NaN for
 * exactly the parameters whose samples are NaN. Insisting on at least one category
 * also keeps `sampleMultivariateHypergeometric` from being handed an empty partition,
 * which has no final category to absorb the remaining draws.
 */
export function validMultivariateHypergeometricParameters({
    numInCategories,
    numDraws,
}) {
    return (
        numInCategories.length > 0 &&
        numInCategories.every((num) => Number.isInteger(num) && num >= 0) &&
        Number.isInteger(numDraws) &&
        numDraws >= 0 &&
        numDraws <= numInCategories.reduce((a, c) => a + c, 0)
    );
}

/**
 * A notice that a document will be sluggish, or nothing when it will not. Below the
 * hard limit the samples are still drawn; this only tells the author why the page
 * feels slow, which they cannot learn from anywhere else.
 */
function slowSamplingDiagnostics(distribution, workPerVariate) {
    // Inclusive at the threshold: both reference pages describe the notice as
    // starting *from* a million draws per value.
    if (workPerVariate < WORK_PER_VARIATE_WARNING_THRESHOLD) {
        return [];
    }

    return [
        codedDiagnostic({
            type: "warning",
            code: "doenet-w0133",
            args: { distribution, draws: Math.round(workPerVariate) },
        }),
    ];
}

/**
 * Draw `numSamples` independent values from the distribution named by `type`.
 *
 * Returns the samples alongside any diagnostics they raised, rather than logging
 * them: a browser console is not somewhere an author looks, so a caller in a state
 * variable definition passes these on as `sendDiagnostics` and they reach whoever
 * is reading the document. Unusable parameters give a full-length run of NaN, so a
 * caller never has to special-case the failure.
 */
export function sampleFromRandomNumbers({
    type,
    numSamples,
    standardDeviation,
    mean,
    to,
    from,
    step,
    exclude,
    numDiscreteValues,
    numTotal,
    numSuccesses,
    numDraws,
    numTrials,
    probability,
    poissonMean,
    rng,
}) {
    // `numSamples` is declared as a number, not an integer, so it can arrive
    // fractional or NaN. The long-standing loops here take the ceiling of a
    // fractional count, and `Array(1.5)` throws outright rather than rounding, so
    // settle on one whole count up front and use it in every branch. Anything below
    // one draws nothing, which is what the callers' `numSamples < 1` short-circuit
    // already does for the values that reach them; a count that is not a finite
    // number draws nothing too, rather than throwing or looping forever.
    const numToSample =
        Number.isFinite(numSamples) && numSamples >= 1
            ? Math.ceil(numSamples)
            : 0;

    if (type === "gaussian") {
        if (!validGaussianParameters({ mean, standardDeviation })) {
            return unsampleable(
                numToSample,
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0126",
                    args: { mean, standardDeviation },
                }),
            );
        }

        let sampledValues = [];

        for (let i = 0; i < numToSample; i++) {
            // Standard Normal variate using Box-Muller transform.
            let u = 0,
                v = 0;
            while (u === 0) {
                u = rng();
            }
            while (v === 0) {
                v = rng();
            }
            let standardNormal =
                Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

            // transform to correct parameters
            sampledValues.push(mean + standardDeviation * standardNormal);
        }

        return { sampledValues, diagnostics: [] };
    } else if (type === "uniform") {
        let sampledValues = [];

        let diff = to - from;

        for (let i = 0; i < numToSample; i++) {
            sampledValues.push(from + rng() * diff);
        }

        return { sampledValues, diagnostics: [] };
    } else if (type === "hypergeometric") {
        const problem = hypergeometricProblem({
            numTotal,
            numSuccesses,
            numDraws,
        });
        if (problem) {
            return unsampleable(numToSample, problem);
        }

        return {
            sampledValues: Array.from({ length: numToSample }, () =>
                sampleHypergeometric({ numTotal, numSuccesses, numDraws, rng }),
            ),
            diagnostics: slowSamplingDiagnostics(
                "hypergeometric",
                hypergeometricWork({ numTotal, numDraws }),
            ),
        };
    } else if (type === "binomial") {
        const problem = binomialProblem({ numTrials, probability });
        if (problem) {
            return unsampleable(numToSample, problem);
        }

        return {
            sampledValues: Array.from({ length: numToSample }, () =>
                sampleBinomial({ numTrials, probability, rng }),
            ),
            diagnostics: slowSamplingDiagnostics("binomial", numTrials),
        };
    } else if (type === "poisson") {
        // the rate as the author gave it, not the reported `mean`, which is already
        // NaN for anything unusable and so cannot say what was wrong with it
        const problem = poissonMeanProblem(poissonMean);
        if (problem) {
            return unsampleable(numToSample, problem);
        }

        return {
            sampledValues: Array.from({ length: numToSample }, () =>
                samplePoisson({ mean: poissonMean, rng }),
            ),
            diagnostics: slowSamplingDiagnostics("poisson", poissonMean),
        };
    } else {
        // discreteuniform
        let sampledValues = [];

        if (numDiscreteValues > 0) {
            let indexMap = [...Array(numDiscreteValues).keys()];

            if (exclude.length > 0) {
                indexMap = [];
                let numOrigValues = Math.round((to - from) / step + 1);
                for (let i = 0; i < numOrigValues; i++) {
                    let val = from + i * step;
                    if (!exclude.includes(val)) {
                        indexMap.push(i);
                    }
                }
            }

            for (let i = 0; i < numToSample; i++) {
                // random integer from 0 to numDiscreteValues-1
                let ind = Math.floor(rng() * numDiscreteValues);

                // adjust for excludes
                ind = indexMap[ind];

                sampledValues.push(from + step * ind);
            }
        }

        return { sampledValues, diagnostics: [] };
    }
}

/**
 * Draw one vector-valued sample from the multivariate distribution named by `type`,
 * returning one number per category — or one NaN per category, with a warning, when
 * the parameters describe no such distribution.
 */
export function sampleFromMultivariateDistribution({
    type,
    numInCategories,
    numDraws,
    rng,
}) {
    // "hypergeometric" is the only type currently offered, and the `type` attribute's
    // validValues keep any other from reaching here
    if (
        !validMultivariateHypergeometricParameters({
            numInCategories,
            numDraws,
        })
    ) {
        console.warn(
            `Invalid numInCategories (${numInCategories}) or numDraws (${numDraws}) for a multivariate ${type} random variable. numInCategories must be a non-empty list of non-negative integers, and numDraws must be a non-negative integer no larger than their sum.`,
        );

        return Array(numInCategories.length).fill(NaN);
    }

    const numTotal = numInCategories.reduce((a, c) => a + c, 0);

    // Upper bound on the work: every category but the last costs a univariate
    // hypergeometric draw against the part of the population not yet accounted for,
    // and none of those is more work than a draw against the whole population.
    warnSlowSampling(
        "multivariate hypergeometric",
        (numInCategories.length - 1) * Math.min(numDraws, numTotal - numDraws),
    );

    return sampleMultivariateHypergeometric({ numInCategories, numDraws, rng });
}

export function sampleFromNumberList({
    possibleValues,
    numUniqueRequired = 1,
    numSamples = 1,
    rng,
}) {
    let numPossibleValues = possibleValues.length;

    if (numUniqueRequired === 1) {
        let sampledValues = [];
        for (let ind = 0; ind < numSamples; ind++) {
            // random number in [0, 1)
            let rand = rng();
            // random integer from 0 to numPossibleValues-1
            let ind = Math.floor(rand * numPossibleValues);

            sampledValues.push(possibleValues[ind]);
        }

        return sampledValues;
    }

    // need to select more than one value without replacement
    // shuffle array and choose first elements
    // https://stackoverflow.com/a/12646864
    let shuffledValues = [...possibleValues];
    for (let i = shuffledValues.length - 1; i > 0; i--) {
        const rand = rng();
        const j = Math.floor(rand * (i + 1));
        [shuffledValues[i], shuffledValues[j]] = [
            shuffledValues[j],
            shuffledValues[i],
        ];
    }

    let sampledValues = shuffledValues.slice(0, numSamples);

    return sampledValues;
}
