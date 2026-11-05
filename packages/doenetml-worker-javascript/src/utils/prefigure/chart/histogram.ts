/**
 * `<chart type="histogram">`: one `<rectangle>` per bin, standing on a baseline
 * of zero against a numeric axis of cut points.
 *
 * The second type whose series holds raw observations rather than one value per
 * category. A box plot, the first, summarizes those observations into five
 * numbers on their own scale; a histogram counts them, so it is the one type
 * whose bars are measured in something the data does not contain — how many
 * observations fall between each pair of cut points.
 *
 * The bars are adjacent, with no gap between them. That is the whole visual
 * difference between a histogram and a bar chart of categories — a gap says the
 * positions are separate things, and here they are neighboring stretches of one
 * continuous scale — which is why `barWidth` has nothing to say about this type.
 *
 * The counting is `utils/binning.ts`, shared with `<binCounts>` so that a table
 * of counts and a histogram of the same column cannot disagree on the page. The
 * cut points are chosen here when the author names none, because that is the
 * question the two components answer differently: `<binCounts>` requires them,
 * and a chart has data to choose them from.
 */

import { escapeXml, formatNumber } from "../common";
import { THEME_AWARE_LABEL_COLOR_ATTR } from "../label";
import { styleAttributes } from "../style";
import type { DiagnosticRecord } from "@doenet/utils";
import {
    countValuesInBins,
    cutPointsAscend,
    type BinClosed,
} from "../../binning";
import {
    autoAxisBounds,
    niceTickStep,
    reconcileBounds,
    snapNumber,
    tickAtOrBeyond,
    tickStepForBounds,
    type ChartSeriesValues,
} from "./scale";
import {
    assembleChartDiagram,
    axisTicks,
    LEGEND_PLACEMENTS,
    LEGEND_SWATCH_KEY_WIDTH,
    type AxisTicks,
    type ChartSeriesRendering,
} from "./frame";

/**
 * The most bins an author may ask for by number.
 *
 * A bin is a rectangle and an annotation, so a count in the thousands is a
 * drawing no reader can see and a tree no reader can walk — and `bins="1e9"` is
 * a typo that would otherwise hang the worker building it. Cut points written
 * out are not held to this: however many there are, the author wrote them, and
 * `<binCounts>` counts between as many as it is given.
 */
export const MAX_REQUESTED_BINS = 1000;

/**
 * How many labeled cut points the horizontal axis aims for.
 *
 * Every label lands on a cut point, so this is reached by labeling every k-th
 * of them rather than by choosing a step of its own — which is what keeps the
 * numbers under the axis the numbers the bars are divided at, however many bins
 * there are.
 */
const TARGET_EDGE_LABELS = 6;

/**
 * The most labels the horizontal axis will carry before giving up on labeling
 * cut points.
 *
 * Only an authored bound can ask for more: the stride above keeps the bins
 * themselves to a handful of labels, and a box stretching far past the
 * outermost cut points is what turns that handful into a row of numbers with no
 * space between them.
 */
const MAX_EDGE_LABELS = 16;

/** One bin, in data coordinates: the stretch it covers and what fell in it. */
export type HistogramBinGeometry = {
    /** 0-based position along the axis, and the order the bins are drawn in. */
    index: number;
    /** The cut points the bin runs between. */
    lower: number;
    upper: number;
    /** How many observations fell in it — the height of its bar. */
    count: number;
};

export type HistogramChartGeometry = {
    kind: "histogram";
    /**
     * The one series drawn, or none at all. Unlike every other type this is not
     * the chart's series list: a histogram draws one of them, so the others are
     * counted in `undrawnSeries` and are not here to be given a place in the
     * picture they do not appear in.
     */
    series: { label: string }[];
    bins: HistogramBinGeometry[];
    /** The cut points, in order: `n + 1` of them for `n` bins. */
    edges: number[];
    /** `[xMin, yMin, xMax, yMax]` in data coordinates. */
    bounds: [number, number, number, number];
    /** The spacing between labeled counts on the vertical axis. */
    tickStep: number;
    /** Which values the horizontal axis is labeled at. */
    xTicks: AxisTicks;
    /** How many observations were not finite numbers, and so not counted. */
    undrawnValues: number;
    /**
     * How many observations fell outside the outermost cut points. Only an
     * author's cut points can leave any: chosen bins cover the data.
     */
    uncountedValues: number;
    /** How many series past the first were not drawn. */
    undrawnSeries: number;
    /**
     * What was wrong with `bins`, when the cut points had to be chosen from the
     * data instead of read from it.
     */
    binsProblem: "count" | "cutPoints" | null;
};

/**
 * How many bins to divide a sample of `count` observations into, by Sturges'
 * rule: one more than the base-2 logarithm, rounded up.
 *
 * Sturges because it is the rule a reader is most likely to have been taught
 * and the one R's `hist` uses by default, so a histogram Doenet draws and a
 * histogram drawn in class from the same sample come out with the same number
 * of bars. It is a target rather than the answer: the width is rounded to a
 * number a reader recognizes, which usually yields a few bins fewer.
 *
 * Freedman–Diaconis is the better rule for a skewed sample and is the one to
 * reach for if this is ever made an author's choice; it needs the interquartile
 * range, which `utils/summaryStatistics.ts` already computes.
 */
function sturgesBinCount(count: number): number {
    return Math.max(1, Math.ceil(Math.log2(count)) + 1);
}

/**
 * The cut points from a lowest edge, a width and a count, each one snapped.
 *
 * Built by multiplying out from the first edge rather than by adding the width
 * repeatedly, so that the dust of one addition is not carried into every edge
 * after it. Stops early at an edge past the top of the double range, which
 * `formatNumber` writes as `null` — a bin with no upper cut point is not one a
 * picture can hold — and at an edge the snap did not move past the one before
 * it, since a bin between two equal cut points holds nothing. Either stop can
 * leave fewer cut points than were asked for, or a single one; the callers
 * check what came back.
 */
function edgesFrom(lowest: number, width: number, count: number): number[] {
    const edges = [snapNumber(lowest)];
    for (let ind = 1; ind <= count; ind++) {
        const edge = snapNumber(lowest + ind * width);
        if (!Number.isFinite(edge) || edge <= edges[edges.length - 1]) {
            break;
        }
        edges.push(edge);
    }
    return edges;
}

/**
 * A width off the 1, 2, 5 ladder for a sample with no spread — a column of one
 * observation, or of one value repeated.
 *
 * There is no span to divide, so the width comes from the magnitude of the
 * value itself: a lone observation at 7 gets a bin one or two wide, and one at
 * 7000 a bin in the thousands. A bin of some fixed width would be the whole
 * picture at one magnitude and invisible at the other.
 */
function widthWithoutSpread(value: number, minStep: number): number {
    return niceTickStep(Math.abs(value) || 1, minStep);
}

/**
 * The cut points a histogram chooses when the author names none.
 *
 * Sturges' rule says how many bins to aim for; the width is then rounded up to
 * the nearest 1, 2 or 5 times a power of ten, and the first cut point is the
 * multiple of that width at or below the smallest observation. Both roundings
 * are what make the cut points numbers a reader recognizes — the axis is
 * labeled at them, and `binEdges` reports them into a sentence, so a histogram
 * running from 2.7143 to 9.5714 would be a chart no document could describe.
 *
 * Rounding the width up rather than to the nearest keeps the bin count at or
 * below the target, and starting at a multiple of the width is what lets the
 * axis be labeled at every k-th cut point and still land on round numbers.
 */
function automaticEdges(observations: number[], minStep: number): number[] {
    const low = observations.reduce((a, c) => (c < a ? c : a));
    const high = observations.reduce((a, c) => (c > a ? c : a));

    const width =
        high > low
            ? niceTickStep(
                  high - low,
                  minStep,
                  sturgesBinCount(observations.length),
              )
            : widthWithoutSpread(low, minStep);

    const lowest = tickAtOrBeyond(low, width, -1);

    // One bin more than the span needs, since the lowest cut point is at or
    // below the smallest observation; the loop below trims any that the
    // rounding of the width left empty at the top.
    const edges = edgesFrom(
        lowest,
        width,
        Math.max(1, Math.ceil(snapNumber((high - lowest) / width))) + 1,
    );
    while (edges.length > 2 && edges[edges.length - 2] >= high) {
        edges.pop();
    }

    // A spread the twelfth digit cannot resolve — two observations a few ulps
    // apart — leaves one cut point behind, which is no bin at all and so a
    // picture with nothing in it. One bin across the data is what that sample
    // supports.
    if (edges.length < 2) {
        return [low, high];
    }

    // Widened to the data where the rounding left it outside. Both roundings
    // above are to twelve significant digits, which is short of what a double
    // holds, so a cut point meant to sit at or below the smallest observation
    // can come out just above it — and then the smallest observation falls in
    // no bin, which is a bar one shorter and an observation gone from a picture
    // that had room for it. It takes a sample whose spread is tiny beside its
    // own magnitude to get there, and the outermost bin coming out a hair wider
    // than its neighbors is a far smaller wrong than a sample the chart quietly
    // drops.
    if (edges[0] > low) {
        edges[0] = low;
    }
    if (edges[edges.length - 1] < high) {
        edges[edges.length - 1] = high;
    }
    return edges;
}

/**
 * The cut points for a requested number of equal-width bins.
 *
 * The count is exact: an author who asks for five bins gets five, and
 * `binCounts` reports five numbers. So the edges are the data's own range
 * divided evenly rather than rounded to anything, and the axis is labeled at
 * whatever numbers that produces — which is the cost of naming a count rather
 * than letting the chart choose.
 *
 * A column with no spread has no range to divide, so it gets the same nice
 * width a chosen bin would have, split into the number of bins asked for.
 */
function requestedEdges(
    observations: number[],
    binCount: number,
    minStep: number,
): number[] {
    const low = observations.reduce((a, c) => (c < a ? c : a));
    const high = observations.reduce((a, c) => (c > a ? c : a));

    if (!(high > low)) {
        const width = widthWithoutSpread(low, minStep);
        const edges = edgesFrom(
            tickAtOrBeyond(low, width, -1),
            width / binCount,
            binCount,
        );
        // Only if that nice width fits around the value. Near the ends of the
        // double range it does not: the multiple of the width below a value of
        // `1e308` is off the range, and a width split into a thousand is a step
        // the twelfth digit cannot see — either way the bins come out not
        // holding the observation they were built around, which is a chart of
        // one value that counts none. A bin at the value is the picture that
        // sample supports, and it costs the requested count, which the branch
        // below also gives up where the range is too narrow to divide.
        if (
            edges.length > 1 &&
            edges[0] <= low &&
            edges[edges.length - 1] >= high
        ) {
            return edges;
        }
        return [low, high];
    }

    // The outermost cut points are the observations themselves, unsnapped: the
    // range is the data's own, and there is no arithmetic here for a snap to
    // tidy up. Rounding them to twelve significant digits would move them by
    // however much the thirteenth digit was worth, and it rounds to nearest —
    // so half the time it moves the cut point *inward*, past the observation it
    // came from, which then falls in no bin. The interior cut points are
    // interpolated and do carry dust, so those are snapped.
    const edges = [low];
    for (let ind = 1; ind < binCount; ind++) {
        // Interpolated from both ends rather than stepped by a width, so that
        // the edges stay inside the range however the division rounds, and so
        // that a span too wide for a double to hold — a column reaching both
        // ends of the range — does not overflow on the way.
        const fraction = ind / binCount;
        edges.push(snapNumber(low * (1 - fraction) + high * fraction));
    }
    edges.push(high);

    // A range narrow enough that dividing it moves nothing — the double next to
    // its neighbor, divided in ten — leaves cut points that repeat, and a bin
    // between two equal cut points can hold nothing. One bin across the whole
    // range is the honest answer there, and it is the picture the data supports.
    return edges.every((edge, ind) => ind === 0 || edge > edges[ind - 1])
        ? edges
        : [edges[0], edges[edges.length - 1]];
}

/**
 * Which values the horizontal axis is labeled at.
 *
 * Every label lands on a cut point wherever the bins are of one width, by
 * labeling every k-th of them: the numbers under a histogram's axis are the
 * numbers its bars are divided at, which is what lets a reader read a bar's
 * stretch off the axis rather than off the ends of a bar. The stride keeps a
 * histogram of thirty bins from writing thirty numbers under itself.
 *
 * An authored bound can leave axis beyond the outermost cut points, and the
 * labels carry on across it at the same spacing rather than stopping where the
 * bars do — a stretch of numbered axis with no numbers under it reads as a
 * drawing that was cut off.
 *
 * Cut points of differing widths have no one spacing to label at, so the axis
 * is numbered the way every other numeric axis in this folder is: a nice step
 * anchored at zero. The bars then show where the cut points are and `binEdges`
 * reports them, which is what an author who wrote uneven cut points already
 * knows. A bound far enough outside the bins to want more labels than a reader
 * can take in falls back to the same thing.
 */
function edgeTicks(
    edges: number[],
    [xMin, xMax]: [number, number],
    wholeEdges: boolean,
    edgesChosenByChart: boolean,
): AxisTicks {
    function niceTicks() {
        return axisTicks(xMin, xMax, tickStepForBounds(xMin, xMax, wholeEdges));
    }

    if (edges.length < 2) {
        return niceTicks();
    }

    // Two forms of the same width, and they are not interchangeable. The step
    // the axis is labeled by is snapped, because it is written into the XML;
    // the width the other widths are *compared* to is the difference itself,
    // because a snap is a rounding of ours and the differences it is held
    // against carry none. Compared against the snapped one, an author's evenly
    // spaced cut points whose width is not already round to twelve digits —
    // sixths of an interval, sevenths, anything from a `<sequence>` — were
    // called unevenly binned and numbered at ordinary ticks instead of at the
    // cut points.
    const exactWidth = edges[1] - edges[0];
    const width = snapNumber(exactWidth);
    // Of one width, to within the precision the cut points are kept at rather
    // than to the last bit. A requested count divides the data's own range, and
    // the cut points that come of it are snapped to twelve significant digits
    // one at a time while the outermost two are the observations themselves —
    // so a width between two of them carries the rounding of both, which is
    // about a part in 1e12 *of the cut points*, not of the width. Asked for
    // exact equality, nearly every `bins="5"` over data with more digits than a
    // textbook's answered "these bins are uneven" and took the fallback below,
    // which is the branch for cut points that really are of differing widths.
    //
    // The slack is therefore measured against the largest cut point, at ten of
    // those roundings. Against the *pair* being compared instead, a set of bins
    // straddling zero still failed: the width every other width is held to is
    // read off the first two cut points, so it carries their rounding, and the
    // pairs either side of zero are finer-grained than that and were asked to
    // match it exactly.
    //
    // Only for cut points this file chose. Ones an author wrote carry no
    // rounding of ours — they are the numbers they typed — so they are held to
    // a few of the last bits a double has, which is what tells
    // `bins="0.1 0.2 0.30000000000000004"` (even) from
    // `bins="1000000000000 1000000000001 1000000000003"` (not). Given our own
    // slack, the second of those is called even, and then labeled every unit
    // at cut points half of which are not cut points at all.
    //
    // It is nowhere near anything an author can mean by an uneven bin:
    // `bins="0 5 10 20"` is out by a whole bin width, which is a billion times
    // this. What it admits cannot be seen either, since the labels are stepped
    // from the first cut point.
    //
    // Being measured against the cut points rather than against the width, the
    // slack grows with how far the cut points sit from zero: bins a billion
    // times narrower than their own distance from the origin can be called even
    // when they are not, and are then labeled evenly. That is the trade for
    // labeling a narrow spread at a high magnitude at all, which is the case
    // this exists for; the stride caps how many labels a mistake can misplace.
    const scale = edges.reduce(
        (largest, edge) => Math.max(largest, Math.abs(edge)),
        0,
    );
    const slackPerWidth = scale * (edgesChosenByChart ? 1e-11 : 1e-14);
    const uniform = edges.every(
        (edge, ind) =>
            ind === 0 ||
            Math.abs(edge - edges[ind - 1] - exactWidth) <= slackPerWidth,
    );
    // A width of nothing is two cut points that repeat, which `<binCounts>`
    // accepts and this draws as a bar of no width: there is nothing to step by.
    if (!uniform || !(width > 0)) {
        return niceTicks();
    }

    const stride = Math.max(
        1,
        Math.ceil((edges.length - 1) / TARGET_EDGE_LABELS),
    );
    const step = snapNumber(width * stride);
    if (!(step > 0)) {
        return niceTicks();
    }

    // How many steps from the first cut point each end of the box is, taken to
    // the nearest whole one where it is within a part in a billion of it. Three
    // bins of 0.2 reach 0.6, and `0.6 / 0.2` is 2.9999999999999996, so a bare
    // floor stops the labels one cut point short of the last bar; and the step
    // is itself a twelve-digit rounding of a width, so the ratio at the far end
    // can sit a little under the whole number it means by more than twelve
    // digits can hide — which left a five-bin chart labeled to its fourth cut
    // point and not its fifth.
    const stepsToEdge = (value: number, round: (v: number) => number) => {
        const ratio = (value - edges[0]) / step;
        const nearest = Math.round(ratio);
        // The second term is the slack the uniformity test above allows,
        // written in steps instead of in cut points. Without it the two
        // disagree about how precisely the cut points are known, and this one
        // asks for more than they carry: a width snapped to twelve significant
        // digits is out by about `scale * 5e-12`, which is that much of a
        // *step* once the bins are narrow beside their own distance from zero —
        // eleven barometric pressures around 1013 in six bins are out by 90
        // times what a ratio-relative tolerance alone allows. The floor then
        // takes a whole label off the end, and the last bar loses the number
        // under it.
        const slack =
            Math.abs(ratio) * 1e-9 +
            (Math.abs(ratio) * slackPerWidth) / Math.abs(width) +
            1e-9;
        return Math.abs(ratio - nearest) <= slack ? nearest : round(ratio);
    };
    const firstIndex = stepsToEdge(xMin, Math.ceil);
    const lastIndex = stepsToEdge(xMax, Math.floor);
    if (
        !(lastIndex > firstIndex) ||
        lastIndex - firstIndex + 1 > MAX_EDGE_LABELS
    ) {
        return niceTicks();
    }

    // The two ends are written as the cut points they are, rather than
    // recomputed from the step. PreFigure draws no label outside the bounding
    // box, and a recomputed end lands a hair outside it about two thirds of the
    // time on data carrying more than twelve digits: the box runs from the
    // first cut point to the last, which are observations as the data gave
    // them, while `edges[0] + index * step` carries the rounding of a snapped
    // width. The bar's own far end then has no number under it — the one label
    // a reader most needs, since it is where the bars stop. PreFigure rounds
    // what it draws to about six digits, so an exact observation here is no
    // uglier on the axis than a snapped one.
    //
    // Clamped as well as chosen, for the ends that are not cut points: an
    // authored bound is the edge of the box, and the same rounding can put the
    // last label a hair beyond it.
    const labelFor = (index: number) => {
        const edgeIndex = index * stride;
        return edgeIndex >= 0 && edgeIndex < edges.length
            ? edges[edgeIndex]
            : snapNumber(edges[0] + index * step);
    };

    return {
        first: Math.max(labelFor(firstIndex), xMin),
        last: Math.min(labelFor(lastIndex), xMax),
        step,
    };
}

/**
 * The bins and bounding box for a column of observations.
 *
 * The horizontal axis is the scale the observations were measured on, running
 * from the first cut point to the last so the bars fill it; the vertical axis
 * is counts, from zero, because a bar's height is a number of things and a
 * baseline anywhere else would draw a count of four as though it were a count
 * of one.
 *
 * One series: a histogram of two samples drawn into the same bars would have to
 * stack them or make them transparent, and neither is a decision this needs in
 * order to be useful. The rest are counted for the message that says so.
 */
export function computeHistogramChartGeometry({
    series,
    bins,
    closed,
    xMinAttr,
    xMaxAttr,
    yMinAttr,
    yMaxAttr,
}: {
    series: ChartSeriesValues[];
    /** What the author wrote for `bins`, or null where they wrote nothing. */
    bins: number[] | null;
    closed: BinClosed;
    xMinAttr: number | null;
    xMaxAttr: number | null;
    yMinAttr: number | null;
    yMaxAttr: number | null;
}): HistogramChartGeometry {
    const drawnSeries = series.slice(0, 1);

    // An observation that is not a finite number is missing data: left out of
    // the counts rather than counted somewhere, and counted separately so the
    // chart can say so. A reader cannot see the difference between an
    // observation that was dropped and one that was never given.
    const observations: number[] = [];
    let undrawnValues = 0;
    for (const value of drawnSeries[0]?.values ?? []) {
        if (Number.isFinite(value)) {
            observations.push(value);
        } else {
            undrawnValues++;
        }
    }

    // Whole observations get whole ticks on the count axis whatever the data
    // is — a count is always a whole number — and whole cut points on the other
    // one, so a sample of test scores is not binned at 2.5.
    const wholeValues = observations.every((value) => Number.isInteger(value));
    const minStep = wholeValues ? 1 : 0;

    /** One cut point describes no bin, so a lone number is a bin count. */
    const requestedCount = bins?.length === 1 ? bins[0] : null;
    const requestedEdgePoints = (bins?.length ?? 0) > 1 ? bins : null;

    let binsProblem: HistogramChartGeometry["binsProblem"] = null;
    if (
        requestedCount !== null &&
        !(
            Number.isInteger(requestedCount) &&
            requestedCount >= 1 &&
            requestedCount <= MAX_REQUESTED_BINS
        )
    ) {
        binsProblem = "count";
    }
    // Cut points that do not climb describe a bin running backwards, which has
    // no width to draw and whose count comes out negative. Reported rather than
    // sorted into order, because which order the author meant is exactly what
    // is unclear — the same reading `<binCounts>` gives the same list, so a
    // list one of them rejects is a list the other rejects too.
    //
    // Every cut point has to be a finite number as well, which is where the two
    // part company: `<binCounts>` counts happily into a bin with no far end,
    // and a bar with no far end is not one a picture can hold.
    if (
        requestedEdgePoints !== null &&
        (!requestedEdgePoints.every((edge) => Number.isFinite(edge)) ||
            !cutPointsAscend(requestedEdgePoints))
    ) {
        binsProblem = "cutPoints";
    }

    let edges: number[];
    if (drawnSeries.length === 0) {
        // No series, so nothing to bin and nothing to draw bins for: a chart
        // whose only series is hidden is a chart with no data, not a chart of
        // empty bins.
        edges = [];
    } else if (observations.length === 0) {
        // Nothing to bin. An author's cut points are still drawn: a histogram
        // being written, with its bins named and its data yet to arrive, is an
        // empty picture of the right shape rather than a blank one.
        edges =
            binsProblem === null && requestedEdgePoints !== null
                ? requestedEdgePoints
                : [];
    } else if (binsProblem !== null) {
        edges = automaticEdges(observations, minStep);
    } else if (requestedEdgePoints !== null) {
        edges = requestedEdgePoints;
    } else if (requestedCount !== null) {
        edges = requestedEdges(observations, requestedCount, minStep);
    } else {
        edges = automaticEdges(observations, minStep);
    }

    const counts =
        edges.length > 1
            ? countValuesInBins({ values: observations, edges, closed })
            : [];

    const binGeometry: HistogramBinGeometry[] = counts.map((count, index) => ({
        index,
        lower: edges[index],
        upper: edges[index + 1],
        count,
    }));

    // Every observation lies in exactly one bin or outside them all — the bins
    // are adjacent, so there is no gap between them to fall into — which makes
    // the difference between the sample and its total the number that fell
    // outside the outermost cut points.
    const uncountedValues =
        observations.length - counts.reduce((total, count) => total + count, 0);

    const tallest = counts.reduce((a, c) => (c > a ? c : a), 0);
    const [autoYMin, autoYMax] = autoAxisBounds({
        low: 0,
        high: tallest,
        minStep: 1,
        baseline: 0,
    });
    const [yMin, yMax] = reconcileBounds(
        yMinAttr,
        yMaxAttr,
        autoYMin,
        autoYMax,
    );

    // The bars fill the horizontal axis, so its bounds are the outermost cut
    // points rather than a tick beyond them: a histogram is a partition of a
    // stretch of the scale, and space past the last cut point would suggest
    // the stretch goes on. A chart with no bins at all still gets a box, the
    // way an empty bar chart does, rather than an axis of no width.
    //
    // Cut points that all coincide — `bins="2 2 2"`, which describes two bins
    // of no width and which `<binCounts>` counts into quite happily — would
    // make the two bounds one number, and a box of no width is one PreFigure
    // resolves to `nan` in every coordinate it draws: not an empty picture but
    // a broken one. The axis opens out around them instead, the way one around
    // a run of identical values does, and the bars stand in it as the lines of
    // no width they are.
    const lastEdge = edges[edges.length - 1];
    const [autoXMin, autoXMax] =
        edges.length < 2
            ? [0, 1]
            : lastEdge > edges[0]
              ? [edges[0], lastEdge]
              : autoAxisBounds({
                    low: edges[0],
                    high: lastEdge,
                    minStep,
                    baseline: null,
                });
    const [xMin, xMax] = reconcileBounds(
        xMinAttr,
        xMaxAttr,
        autoXMin,
        autoXMax,
    );

    const wholeEdges = edges.every((edge) => Number.isInteger(edge));

    return {
        kind: "histogram",
        series: drawnSeries.map(({ label }) => ({ label })),
        bins: binGeometry,
        edges,
        bounds: [xMin, yMin, xMax, yMax],
        tickStep: tickStepForBounds(yMin, yMax, true),
        // Whether the cut points are ours or the author's decides how exactly
        // the axis holds them to being of one width: ours carry a twelve-digit
        // rounding, and theirs carry none.
        xTicks: edgeTicks(
            edges,
            [xMin, xMax],
            wholeEdges,
            binsProblem !== null || requestedEdgePoints === null,
        ),
        undrawnValues,
        uncountedValues,
        undrawnSeries: Math.max(series.length - 1, 0),
        binsProblem,
    };
}

/**
 * How wide a bin is drawn.
 *
 * A rectangle is written as a corner and a size, so PreFigure adds the two back
 * together to find the far corner, and both the width and that sum have to stay
 * inside the double range. Cut points a quarter of the range apart on either
 * side of zero are already too far — `formatNumber` answers `null` for anything
 * non-finite, which is not a size PreFigure can read — so such a bin is drawn
 * as wide as a double allows and stops short of its own upper cut point. That
 * is a smaller wrong than a bar with no width, which is the trade `scale.ts`
 * makes at the same edge for the same reason. Reached by cut points an author
 * wrote, and by the outermost of the chart's own where widening them onto the
 * data put an observation at one end of the double range and a cut point at the
 * other.
 */
function binWidth(lower: number, upper: number): number {
    const snapped = snapNumber(upper - lower);
    if (Number.isFinite(lower + snapped)) {
        return snapped;
    }
    return lower > 0 ? Number.MAX_VALUE - lower : Number.MAX_VALUE;
}

/**
 * Builds the PreFigure XML for a histogram.
 *
 * The vertical axis keeps numeric labels via an explicit `vlabels`, and the
 * horizontal one is numbered at the cut points via `hlabels` — the Phase 2
 * numeric axis, rather than the `<tick-mark>` per position a bar chart or a box
 * plot gets. A histogram's positions are stretches of a scale, and the scale is
 * what the reader reads a bar against.
 *
 * `binAnnotationText` is handed in rather than built here: a bar's height is a
 * count, and a count spoken as a bare number beside two cut points would be a
 * third number with nothing to say which of the three it is. The word that
 * names it has to be assembled where the document's locale is known. The
 * numbers themselves are written here, by the same `formatNumber` that writes
 * them into the picture, so that what a reader hears and what a reader sees
 * cannot be two different roundings of one value.
 */
export function createHistogramChartPrefigureXML({
    geometry,
    seriesRendering,
    binAnnotationText,
    widthPx,
    heightPx,
    xLabel,
    xLabelHasLatex,
    yLabel,
    yLabelHasLatex,
    title,
    showLegend,
    legendPosition,
    displayValues,
    shortDescription,
    darkMode = false,
}: {
    geometry: HistogramChartGeometry;
    seriesRendering: ChartSeriesRendering[];
    /** What a screen reader hears on each bar: its stretch and its count. */
    binAnnotationText: (parts: {
        from: string;
        to: string;
        count: string;
    }) => string;
    widthPx: number;
    heightPx: number;
    xLabel?: string;
    xLabelHasLatex?: boolean;
    yLabel?: string;
    yLabelHasLatex?: boolean;
    title?: string;
    showLegend: boolean;
    legendPosition: keyof typeof LEGEND_PLACEMENTS;
    displayValues: boolean;
    shortDescription?: string;
    darkMode?: boolean;
}): { xml: string; diagnostics: DiagnosticRecord[] } {
    const diagnostics: DiagnosticRecord[] = [];

    const [, yMin, , yMax] = geometry.bounds;

    // Once per series rather than once per bar: every bar is drawn from the one
    // series' `selectedStyle`, so the attribute string is identical across
    // them, and `styleAttributes` also reports an unsupported fill or line
    // style through `diagnostics` — which the queue deduplicates by message,
    // but there is no reason to hand it the same one per bin.
    const barAttrs = geometry.series.length
        ? styleAttributes({
              selectedStyle: seriesRendering[0]?.selectedStyle,
              diagnostics,
              warningPrefix: "<chart>",
          }).join(" ")
        : "";

    const elements: string[] = [];
    const annotations: string[] = [];
    /** The handle of the first bar, for the legend to point at. */
    let keyHandle: string | null = null;
    /** Held back until every bar is drawn, so none can be painted over. */
    const valueLabelElements: string[] = [];

    for (const bin of geometry.bins) {
        const handle = `bin-${bin.index + 1}`;
        if (keyHandle === null) {
            keyHandle = handle;
        }

        const width = binWidth(bin.lower, bin.upper);
        const lowerLeft = `(${formatNumber(bin.lower)},0)`;
        const dimensions = `(${formatNumber(width)},${formatNumber(bin.count)})`;

        // Clipped to the box it is drawn in, since an authored bound can leave
        // part of a bar outside the axes — and PreFigure draws a rectangle
        // unclipped unless asked, so that part would be painted over the
        // numbers below the frame or off the edge of the picture.
        //
        // A bar of no height where nothing fell in the bin, which paints as a
        // line along the baseline. Drawn rather than skipped: a bin an
        // observation might have fallen into and did not is part of the shape
        // of the distribution, and it is the only thing a screen reader can
        // stop on to hear that the count there is zero.
        elements.push(
            `<rectangle at="${escapeXml(handle)}" lower-left="${escapeXml(lowerLeft)}" dimensions="${escapeXml(dimensions)}" cliptobbox="yes"${barAttrs ? ` ${barAttrs}` : ""} />`,
        );

        if (displayValues) {
            // Above the bar, centered on it — the same placement a bar chart's
            // value labels take, and for the same reason: at the far end of
            // what is being measured, outside it. A count is never negative, so
            // there is no bar hanging below the baseline to label underneath.
            const anchor = `(${formatNumber(snapNumber(bin.lower + width / 2))},${formatNumber(bin.count)})`;
            valueLabelElements.push(
                `<label anchor="${escapeXml(anchor)}" alignment="north" ${THEME_AWARE_LABEL_COLOR_ATTR}>${escapeXml(formatNumber(bin.count) ?? "")}</label>`,
            );
        }

        annotations.push(
            `<annotation ref="${escapeXml(handle)}" text="${escapeXml(
                binAnnotationText({
                    from: formatNumber(bin.lower) ?? "",
                    to: formatNumber(bin.upper) ?? "",
                    count: formatNumber(bin.count) ?? "",
                }),
            )}" />`,
        );
    }

    const xml = assembleChartDiagram({
        bounds: geometry.bounds,
        yTicks: axisTicks(yMin, yMax, geometry.tickStep),
        xTicks: geometry.xTicks,
        // Numbered rather than named: the positions are stretches of a numeric
        // scale, which is what `slots` cannot express.
        slots: null,
        widthPx,
        heightPx,
        xLabel,
        xLabelHasLatex,
        yLabel,
        yLabelHasLatex,
        title,
        showLegend,
        legendPosition,
        seriesRendering,
        // The drawn series alone, so the bars are not wrapped in a `<group>`
        // for a screen reader to stop at: one group of data has no level
        // between the figure and its marks worth walking.
        seriesLabels: geometry.series.map(({ label }) => label),
        seriesElements: geometry.series.map(() => elements),
        seriesAnnotations: geometry.series.map(() => annotations),
        seriesKeyHandles: geometry.series.map(() => keyHandle),
        legendKeyWidth: LEGEND_SWATCH_KEY_WIDTH,
        // A bar is drawn inside the box and clipped to it.
        markOverhang: 0,
        overlayElements: valueLabelElements,
        shortDescription,
        darkMode,
    });

    return { xml, diagnostics };
}
