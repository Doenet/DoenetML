/**
 * The five-number summary, and the box-plot rules built on top of it.
 *
 * Here rather than in either component that needs it, because
 * `<summaryStatistics>` and `<chart type="box">` report the same numbers about
 * the same data and a document may show both: a table of quartiles beside a box
 * plot of the column it summarizes. Two implementations of "the first quartile"
 * would eventually disagree on the page, and the reader would have no way to
 * tell which was wrong.
 *
 * The quartiles are math-expressions' `quantileSeq` — interpolated percentiles,
 * not Tukey's hinges, which differ on some sample sizes. `SummaryStatistics.js`
 * carries the note on why the term "five-number summary" is used unattributed;
 * nothing here needs to repeat it, but nothing here may change the calculation
 * either.
 */

import me from "math-expressions";

const { median: medianOf, quantileSeq } = me.math;

/**
 * How far past the quartiles an observation may lie and still be drawn as part
 * of the distribution rather than apart from it.
 *
 * Tukey's rule, and the only rule implemented: an observation more than one and
 * a half interquartile ranges beyond the near quartile is an outlier, and the
 * whisker stops at the furthest one that is not. A `whiskers` attribute — a
 * plain minimum-to-maximum pair, or a multiplier of the author's — would slot
 * in here without changing anything about how a box is drawn.
 */
const OUTLIER_FENCE_IQRS = 1.5;

/**
 * The smallest of a column.
 *
 * Reduced rather than spread, as `<chart>` and `<summaryStatistics>` both
 * reduce for the same reason: `Math.min(...column)` throws once the column is
 * longer than the engine's argument limit, and a column that long is exactly
 * what summarizing a simulation produces.
 */
export function smallest(column: number[]): number {
    return column.reduce((a, c) => (c < a ? c : a));
}

/** The largest of a column, reduced for the reason `smallest` is. */
export function largest(column: number[]): number {
    return column.reduce((a, c) => (c > a ? c : a));
}

/** The 25th percentile, interpolated. */
export function quartile1(column: number[]): number {
    return quantileSeq(column, 0.25);
}

/** The median. */
export function median(column: number[]): number {
    return medianOf(column);
}

/** The 75th percentile, interpolated. */
export function quartile3(column: number[]): number {
    return quantileSeq(column, 0.75);
}

/**
 * The five-number summary of a column, with everything a box plot draws from
 * it: where each whisker stops, and which observations lie beyond them.
 */
export type BoxPlotSummary = {
    minimum: number;
    quartile1: number;
    median: number;
    quartile3: number;
    maximum: number;
    /**
     * The furthest observation within the fence at each end — where the whisker
     * stops. An observation, never the fence itself: a whisker is drawn to a
     * datum that is there, so that its end is a value in the data rather than
     * an arithmetic consequence of the quartiles.
     */
    lowerWhisker: number;
    upperWhisker: number;
    /** The observations beyond the fences, in the order they were given. */
    outliers: number[];
};

/**
 * Everything a box plot needs about one column of observations, or `null` for
 * an empty one.
 *
 * Null rather than a summary of nothing, which is what `<summaryStatistics>`
 * reports for an empty column and what a box plot needs to know in order to
 * leave its position on the axis empty. Every statistic here throws on an empty
 * array — a `reduce` without an initial value, and math-expressions' own
 * statistics alike — so the check is not merely for tidiness.
 *
 * The column must hold finite numbers only. Anything else is missing data, and
 * whether missing data is worth a message is a question for the component that
 * read it: `<summaryStatistics>` counts non-missing values and says nothing,
 * while a chart says so, because a reader cannot see the difference between an
 * observation that was dropped and one that was never given.
 */
export function boxPlotSummary(column: number[]): BoxPlotSummary | null {
    if (column.length === 0) {
        return null;
    }

    const lowerQuartile = quartile1(column);
    const upperQuartile = quartile3(column);
    const interquartileRange = upperQuartile - lowerQuartile;

    // Computed from the quartiles as they came out, before anything rounds them
    // for a picture: an observation sitting exactly on a fence is on a knife
    // edge already, and moving the fence by a twelfth-digit rounding would
    // decide the question by accident rather than by the rule.
    //
    // A column spanning the whole double range has an infinite interquartile
    // range, which puts both fences at infinity and leaves every observation
    // inside them. That is the right answer as well as the drawable one: a
    // spread that large has no outliers to speak of.
    const lowerFence = lowerQuartile - OUTLIER_FENCE_IQRS * interquartileRange;
    const upperFence = upperQuartile + OUTLIER_FENCE_IQRS * interquartileRange;

    const outliers: number[] = [];
    let lowerWhisker = Infinity;
    let upperWhisker = -Infinity;
    for (const observation of column) {
        if (observation < lowerFence || observation > upperFence) {
            outliers.push(observation);
            continue;
        }
        lowerWhisker = Math.min(lowerWhisker, observation);
        upperWhisker = Math.max(upperWhisker, observation);
    }

    // Both quartiles lie between the fences by construction, so at least one
    // observation is always inside them and the two whiskers are always
    // observations. The fallback is there for the reader rather than for the
    // arithmetic.
    return {
        minimum: smallest(column),
        quartile1: lowerQuartile,
        median: median(column),
        quartile3: upperQuartile,
        maximum: largest(column),
        lowerWhisker: Number.isFinite(lowerWhisker)
            ? lowerWhisker
            : lowerQuartile,
        upperWhisker: Number.isFinite(upperWhisker)
            ? upperWhisker
            : upperQuartile,
        outliers,
    };
}
