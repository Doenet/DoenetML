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
 * not Tukey's hinges, which differ on some sample sizes. The median is the 50th
 * percentile, arrived at here rather than asked for, for the reason its own
 * note gives. `SummaryStatistics.js` carries the note on why the term
 * "five-number summary" is used unattributed; nothing here needs to repeat it,
 * but nothing here may change the calculation either.
 */

import me from "math-expressions";

const { quantileSeq } = me.math;

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

/**
 * The median: the middle observation, or the midpoint of the two middle ones.
 *
 * The 50th percentile, computed here rather than asked of math-expressions,
 * because both of the ways math-expressions can answer it are wrong at one end
 * of the double range.
 * `me.math.median` averages the two middle values as `(a + b) / 2`, which
 * overflows before it halves: the median of `1e308 1.5e308` came back
 * `Infinity`, and a box plot of that column drew its median line at a
 * coordinate PreFigure cannot read. `quantileSeq(column, 0.5)` interpolates as
 * `a * 0.5 + b * 0.5` instead, which cannot overflow but underflows at the
 * other end: the median of two copies of `Number.MIN_VALUE` halves each of
 * them to zero and reports `0`, a number the column does not contain.
 *
 * Summing and halving is exact for a normal double, so the sum is taken first
 * and only a sum too large to hold falls back to halving each side — the guard
 * `scale.ts` and `bar.ts` use at the same edge. Measured against an exact
 * reference (each double as a BigInt ratio, rounded to nearest at the end),
 * this is the correctly rounded midpoint on all of 56,000 random columns across
 * seven magnitude bands, where each of the two math-expressions forms is wrong
 * on some of them.
 *
 * Sorting a copy, and by value: the input belongs to the caller, and
 * math-expressions compares with a relative and absolute tolerance, which puts
 * the middle values of a column whose spread is below the tolerance in an order
 * that is not the column's own.
 */
export function median(column: number[]): number {
    const sorted = [...column].sort((a, b) => a - b);
    const middle = sorted.length >> 1;
    if (sorted.length % 2 === 1) {
        return sorted[middle];
    }
    const below = sorted[middle - 1];
    const above = sorted[middle];
    const sum = below + above;
    return Number.isFinite(sum) ? sum / 2 : below / 2 + above / 2;
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
     * stops. An observation rather than the fence itself, so that a whisker
     * ends on a value the data holds rather than on an arithmetic consequence
     * of the quartiles.
     *
     * A column with no such observation reports its quartile here instead —
     * see the note on the fallback in `boxPlotSummary`. A box plot then draws
     * no whisker on that side, the quartile being the box's own edge.
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
 * leave its position on the axis empty. Four of the five throw on an empty
 * array — a `reduce` without an initial value, and math-expressions' own
 * quantile alike — and the median answers `NaN`, so the check is not merely for
 * tidiness.
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

    // Computed from the quartiles as they came out, before anything rounds them
    // for a picture: an observation sitting exactly on a fence is on a knife
    // edge already, and moving the fence by a twelfth-digit rounding would
    // decide the question by accident rather than by the rule.
    //
    // Taken in order, so that the lower fence is never the higher of the two.
    // `quantileSeq` compares with a tolerance, and a column whose values all
    // fall within it — three readings agreeing to twelve significant digits,
    // say — can come back with a first quartile above its third. Ordering them
    // costs nothing on a column that is already in order and keeps that one
    // from having every observation of it declared an outlier.
    //
    // A column spanning the whole double range has an infinite interquartile
    // range, which puts both fences at infinity and leaves every observation
    // inside them. That is the right answer as well as the drawable one: a
    // spread that large has no outliers to speak of.
    const boxBottom = Math.min(lowerQuartile, upperQuartile);
    const boxTop = Math.max(lowerQuartile, upperQuartile);
    const interquartileRange = boxTop - boxBottom;
    const lowerFence = boxBottom - OUTLIER_FENCE_IQRS * interquartileRange;
    const upperFence = boxTop + OUTLIER_FENCE_IQRS * interquartileRange;

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

    // Both quartiles lie between the fences by construction, so a column whose
    // observations bracket its own quartiles has one inside them and the two
    // whiskers are observations. The fallback is for the column that does not:
    // a spread narrow enough that `quantileSeq`'s tolerance answers with
    // quartiles the column has no observation near.
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
