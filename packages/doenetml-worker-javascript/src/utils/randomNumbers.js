// Beyond this many expected `rng()` calls per variate, the linear-time samplers below
// get noticeably slow. We still return exact samples; the warning just tells an author
// why their document is sluggish.
const WORK_PER_VARIATE_WARNING_THRESHOLD = 1e4;

/**
 * Sample a single hypergeometric variate: the number of successes obtained when drawing
 * `numDraws` items without replacement from a population of `numTotal` items, of which
 * `numSuccesses` are successes.
 *
 * Draws the items one at a time, shrinking the urn as it goes, which is O(numDraws).
 * The two symmetries of the distribution are applied first so that the loop is never
 * longer than it has to be: we can draw the items left behind instead of the items
 * taken, and we can count failures instead of successes.
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

/**
 * Whether `numTotal`, `numSuccesses`, and `numDraws` describe a hypergeometric
 * distribution: a population of at least one item, split into a non-negative number
 * of successes and failures, from which a non-negative number of items is drawn.
 *
 * Shared with the components so that the reported mean and variance are NaN for
 * exactly the parameters whose samples are NaN.
 */
export function validHypergeometricParameters({
    numTotal,
    numSuccesses,
    numDraws,
}) {
    return (
        Number.isInteger(numTotal) &&
        Number.isInteger(numSuccesses) &&
        Number.isInteger(numDraws) &&
        numTotal >= 1 &&
        numSuccesses >= 0 &&
        numDraws >= 0 &&
        numSuccesses <= numTotal &&
        numDraws <= numTotal
    );
}

/**
 * Whether `numTrials` and `probability` describe a binomial distribution: a
 * non-negative whole number of trials, each succeeding with a probability in [0, 1].
 */
export function validBinomialParameters({ numTrials, probability }) {
    return (
        Number.isInteger(numTrials) &&
        numTrials >= 0 &&
        probability >= 0 &&
        probability <= 1
    );
}

/**
 * Whether `mean` describes a Poisson distribution: a finite, non-negative rate.
 * (An infinite mean would make the sampler below loop forever.)
 */
export function validPoissonMean(mean) {
    return Number.isFinite(mean) && mean >= 0;
}

function warnSlowSampling(type, workPerVariate) {
    if (workPerVariate > WORK_PER_VARIATE_WARNING_THRESHOLD) {
        console.warn(
            `Sampling from a ${type} distribution with these parameters requires about ${Math.round(
                workPerVariate,
            )} random draws per sample, which may be slow.`,
        );
    }
}

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
    rng,
}) {
    if (type === "gaussian") {
        if (!(standardDeviation >= 0) || !Number.isFinite(mean)) {
            let message =
                "Invalid mean (" +
                mean +
                ") or standard deviation (" +
                standardDeviation +
                ") for a gaussian random variable.";
            console.warn(message);

            return Array(numSamples).fill(NaN);
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

        return sampledValues;
    } else if (type === "uniform") {
        let sampledValues = [];

        let diff = to - from;

        for (let i = 0; i < numSamples; i++) {
            sampledValues.push(from + rng() * diff);
        }

        return sampledValues;
    } else if (type === "hypergeometric") {
        if (
            !validHypergeometricParameters({
                numTotal,
                numSuccesses,
                numDraws,
            })
        ) {
            console.warn(
                `Invalid numTotal (${numTotal}), numSuccesses (${numSuccesses}), or numDraws (${numDraws}) for a hypergeometric random variable. numTotal must be a positive integer, and numSuccesses and numDraws must be non-negative integers no larger than numTotal.`,
            );

            return Array(numSamples).fill(NaN);
        }

        // the sampler draws whichever of the taken and left-behind groups is smaller
        warnSlowSampling(
            "hypergeometric",
            Math.min(numDraws, numTotal - numDraws),
        );

        return Array.from({ length: numSamples }, () =>
            sampleHypergeometric({ numTotal, numSuccesses, numDraws, rng }),
        );
    } else if (type === "binomial") {
        if (!validBinomialParameters({ numTrials, probability })) {
            console.warn(
                `Invalid numTrials (${numTrials}) or probability (${probability}) for a binomial random variable. numTrials must be a non-negative integer and probability must be between 0 and 1.`,
            );

            return Array(numSamples).fill(NaN);
        }

        warnSlowSampling("binomial", numTrials);

        return Array.from({ length: numSamples }, () =>
            sampleBinomial({ numTrials, probability, rng }),
        );
    } else if (type === "poisson") {
        if (!validPoissonMean(mean)) {
            // the mean arrives already reduced to NaN when the author's value is
            // out of range, so there is nothing informative to echo back here
            console.warn(
                `Invalid mean for a Poisson random variable. It must be a finite, non-negative number.`,
            );

            return Array(numSamples).fill(NaN);
        }

        warnSlowSampling("Poisson", mean);

        return Array.from({ length: numSamples }, () =>
            samplePoisson({ mean, rng }),
        );
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

        return sampledValues;
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
