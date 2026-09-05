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
        if (rng() * totalLeft < trackedLeft) {
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
 * Sample a single binomial variate: the number of successes in `numTrials` independent
 * trials that each succeed with probability `probability`. Runs the trials directly,
 * which is O(numTrials).
 */
export function sampleBinomial({ numTrials, probability, rng }) {
    let count = 0;
    for (let i = 0; i < numTrials; i++) {
        if (rng() < probability) {
            count++;
        }
    }
    return count;
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
    let total = -Math.log(rng());

    while (total < mean) {
        count++;
        total -= Math.log(rng());
    }

    return count;
}

/** How many draws `sampleHypergeometric` makes for one variate. */
function hypergeometricWork({ numTotal, numDraws }) {
    // it draws whichever of the taken and left-behind groups is smaller
    return Math.min(numDraws, numTotal - numDraws);
}

/**
 * Why `numTotal`, `numSuccesses`, and `numDraws` cannot be sampled from, or `null` if
 * they can. A usable set describes a population of at least one item, split into a
 * non-negative number of successes and failures, from which a non-negative number of
 * items is drawn few enough times to finish promptly.
 */
function hypergeometricProblem({ numTotal, numSuccesses, numDraws }) {
    if (
        !Number.isInteger(numTotal) ||
        !Number.isInteger(numSuccesses) ||
        !Number.isInteger(numDraws) ||
        numTotal < 1 ||
        numSuccesses < 0 ||
        numDraws < 0 ||
        numSuccesses > numTotal ||
        numDraws > numTotal
    ) {
        return codedDiagnostic({
            type: "warning",
            code: "doenet-w0127",
            args: { numTotal, numSuccesses, numDraws },
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
        !Number.isInteger(numTrials) ||
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
        // the mean arrives already reduced to NaN when the author's value is out of
        // range, so there is nothing informative to echo back here
        return codedDiagnostic({ type: "warning", code: "doenet-w0131" });
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
 * A notice that a document will be sluggish, or `null` when it will not. Below the
 * hard limit the samples are still drawn; this only tells the author why the page
 * feels slow, which they cannot learn from anywhere else.
 */
function slowSamplingDiagnostic(distribution, workPerVariate) {
    if (workPerVariate <= WORK_PER_VARIATE_WARNING_THRESHOLD) {
        return null;
    }

    return codedDiagnostic({
        type: "warning",
        code: "doenet-w0133",
        args: { distribution, draws: Math.round(workPerVariate) },
    });
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
    if (type === "gaussian") {
        if (!(standardDeviation >= 0) || !Number.isFinite(mean)) {
            return {
                sampledValues: Array(numSamples).fill(NaN),
                diagnostics: [
                    codedDiagnostic({
                        type: "warning",
                        code: "doenet-w0126",
                        args: { mean, standardDeviation },
                    }),
                ],
            };
        }

        let sampledValues = [];

        for (let i = 0; i < numSamples; i++) {
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

        for (let i = 0; i < numSamples; i++) {
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
            return {
                sampledValues: Array(numSamples).fill(NaN),
                diagnostics: [problem],
            };
        }

        const slow = slowSamplingDiagnostic(
            "hypergeometric",
            hypergeometricWork({ numTotal, numDraws }),
        );

        return {
            sampledValues: Array.from({ length: numSamples }, () =>
                sampleHypergeometric({ numTotal, numSuccesses, numDraws, rng }),
            ),
            diagnostics: slow ? [slow] : [],
        };
    } else if (type === "binomial") {
        const problem = binomialProblem({ numTrials, probability });
        if (problem) {
            return {
                sampledValues: Array(numSamples).fill(NaN),
                diagnostics: [problem],
            };
        }

        const slow = slowSamplingDiagnostic("binomial", numTrials);

        return {
            sampledValues: Array.from({ length: numSamples }, () =>
                sampleBinomial({ numTrials, probability, rng }),
            ),
            diagnostics: slow ? [slow] : [],
        };
    } else if (type === "poisson") {
        // the rate as the author gave it, not the reported `mean`, which is already
        // NaN for anything unusable and so cannot say what was wrong with it
        const problem = poissonMeanProblem(poissonMean);
        if (problem) {
            return {
                sampledValues: Array(numSamples).fill(NaN),
                diagnostics: [problem],
            };
        }

        const slow = slowSamplingDiagnostic("poisson", poissonMean);

        return {
            sampledValues: Array.from({ length: numSamples }, () =>
                samplePoisson({ mean: poissonMean, rng }),
            ),
            diagnostics: slow ? [slow] : [],
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

            for (let i = 0; i < numSamples; i++) {
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
