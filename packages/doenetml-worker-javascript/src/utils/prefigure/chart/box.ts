/**
 * `<chart type="box">`: one box plot per series, side by side on an axis of
 * series names.
 *
 * The first type whose series holds raw observations rather than one value per
 * category. That is what turns the axis around: a chart of categories reads a
 * series position by position against them, and here a whole series
 * becomes one position — which is `aes(x = group, y = value)`, the standard
 * reading rather than a Doenet-specific one.
 *
 * So a box chart has no categories. Its horizontal axis carries one tick mark
 * per series, named by the series' own `<label>`, and `categories` has nothing
 * to name.
 *
 * `<line>` is drawn here and nowhere else in this folder — the median across
 * each box, the two whiskers and the cap at each of their ends. Written with
 * `p1`/`p2` rather than the `endpoints` pair `components/line.ts` uses;
 * `line.py` reads `endpoints` when it is there and `p1`/`p2` otherwise, and a
 * segment with no `infinite` to declare is shorter said as two points.
 */

import { escapeXml, formatNumber } from "../common";
import { pointStyleAttributes, styleAttributes } from "../style";
import type { DiagnosticRecord } from "@doenet/utils";
import { boxPlotSummary, type BoxPlotSummary } from "../../summaryStatistics";
import {
    autoAxisBounds,
    reconcileBounds,
    snapNumber,
    tickStepForBounds,
    type ChartSeriesValues,
} from "./scale";
import {
    assembleChartDiagram,
    axisTicks,
    type ChartSeriesRendering,
} from "./frame";

/**
 * How much of its one-unit slot a box fills.
 *
 * Narrower than a bar's default, and not for looks: a bar is read by its
 * length, so filling the slot makes it easier to compare, while a box is read
 * by where its edges sit against the axis, and a wide box only makes the
 * vertical distances harder to see. Half a slot leaves as much gap between two
 * boxes as each of them takes.
 *
 * Not an attribute: `barWidth` is one because bars of several series share a
 * slot and dividing it is a real choice, where each box has a slot to itself.
 */
const BOX_WIDTH = 0.5;

/**
 * How wide the cap at the end of a whisker is drawn, as a fraction of the box.
 *
 * Half: a cap as wide as the box reads as a second box edge, and one much
 * narrower disappears.
 */
const CAP_WIDTH_FRACTION = 0.5;

/** One box plot, in data coordinates. */
export type BoxGeometry = {
    /** Which series the box is drawn from, 0-based. */
    seriesIndex: number;
    /** 1-based position along the axis of series names. */
    slot: number;
    /** The name under the box: the series' label, or its position. */
    label: string;
    /**
     * The summary as it is drawn and spoken.
     *
     * The quartiles are interpolated, so two of the three arrive with the dust
     * a floating-point interpolation leaves — the quartiles of
     * `0.1 0.2 0.3 0.4` come out as `0.17500000000000002` and
     * `0.32499999999999996`. Snapped here, for the same reason every other
     * computed coordinate in this folder is snapped: the number is written into
     * the XML and read out by a screen reader, and twelve significant digits is
     * far more than either needs. `<series>`'s own `quartile1` is the
     * unsnapped statistic, which is what `<summaryStatistics>` reports as well.
     */
    summary: BoxPlotSummary;
    /** How far each side of the box reaches from the slot's center. */
    halfWidth: number;
};

export type BoxChartGeometry = {
    kind: "box";
    /**
     * The series drawn, in order, whether or not any of them had observations
     * to summarize. One with none keeps its place, and its name stays on the
     * axis over an empty position, for the reason a bar chart keeps the slot of
     * a value it could not draw: a gap reads as missing data, which is what it
     * is, where a missing position reads as a group that was never given.
     */
    series: { label: string }[];
    boxes: BoxGeometry[];
    /** Every position on the axis, drawn or not, with the name under it. */
    slots: { center: number; label: string }[];
    /** `[xMin, yMin, xMax, yMax]` in data coordinates. */
    bounds: [number, number, number, number];
    /** The spacing between labeled values on the vertical axis. */
    tickStep: number;
    /** How many observations were not finite numbers, and so not summarized. */
    undrawnValues: number;
};

/**
 * The box plots and bounding box for one or more columns of observations.
 *
 * One box per series at x = 1, 2, … n, each filling `BOX_WIDTH` of its
 * one-unit slot. The box runs from the first to the third quartile with the
 * median across it, the whiskers reach the furthest observation within one and
 * a half interquartile ranges of the box, and anything past that is drawn as a
 * point of its own.
 *
 * The vertical axis is the data's, not anchored to zero: a box plot's numbers
 * are positions on a scale rather than lengths measured from a baseline, so
 * forcing zero into the axis of a chart of adult heights would push every box
 * into the top of the picture. Both bounds are rounded outward to the next
 * tick, so no whisker end or outlier is drawn on the frame.
 *
 * The horizontal extent is the one a bar chart of the same number of positions
 * gets — zero to one past the last slot — so the gap before the first box and
 * after the last are equal, and a chart switched from `bar` to `box` does not
 * move its positions sideways.
 */
export function computeBoxChartGeometry({
    series,
    yMinAttr,
    yMaxAttr,
}: {
    series: ChartSeriesValues[];
    yMinAttr: number | null;
    yMaxAttr: number | null;
}): BoxChartGeometry {
    const halfWidth = BOX_WIDTH / 2;

    let undrawnValues = 0;
    const boxes: BoxGeometry[] = [];
    const slots: BoxChartGeometry["slots"] = [];

    /** Every observation that was summarized, for the axis to be sized by. */
    let low = 0;
    let high = 0;
    let anyObservations = false;
    let wholeValues = true;

    series.forEach((oneSeries, seriesIndex) => {
        const slot = seriesIndex + 1;
        const label = oneSeries.label || String(slot);
        slots.push({ center: slot, label });

        // An observation that is not a finite number is missing data. Left out
        // of the summary rather than read as a zero, which would move every
        // quartile of the box drawn from it; counted, because a reader cannot
        // see the difference between an observation that was dropped and one
        // that was never given.
        const observations: number[] = [];
        for (const value of oneSeries.values) {
            if (Number.isFinite(value)) {
                observations.push(value);
            } else {
                undrawnValues++;
            }
        }

        const exact = boxPlotSummary(observations);
        if (exact === null) {
            return;
        }

        for (const observation of observations) {
            low = anyObservations ? Math.min(low, observation) : observation;
            high = anyObservations ? Math.max(high, observation) : observation;
            anyObservations = true;
            wholeValues = wholeValues && Number.isInteger(observation);
        }

        boxes.push({
            seriesIndex,
            slot,
            label,
            summary: {
                ...exact,
                quartile1: snapNumber(exact.quartile1),
                median: snapNumber(exact.median),
                quartile3: snapNumber(exact.quartile3),
            },
            halfWidth,
        });
    });

    const [autoYMin, autoYMax] = autoAxisBounds({
        low,
        high,
        // Whole observations get whole ticks, but the quartiles between them
        // need not be whole — the median of `1 2` is 1.5 — so this decides the
        // labels on the axis and not what may be drawn against them.
        minStep: wholeValues ? 1 : 0,
        baseline: null,
    });
    const [yMin, yMax] = reconcileBounds(
        yMinAttr,
        yMaxAttr,
        autoYMin,
        autoYMax,
    );

    return {
        kind: "box",
        series: series.map(({ label }) => ({ label })),
        boxes,
        slots,
        bounds: [0, yMin, slots.length + 1, yMax],
        tickStep: tickStepForBounds(yMin, yMax, wholeValues),
        undrawnValues,
    };
}

/**
 * A pair of coordinates as PreFigure writes one, `(x,y)`.
 *
 * The horizontal coordinate is computed from a slot and a width, so it is
 * snapped; the vertical one is either an observation as the author wrote it or
 * a statistic snapped already, so it is written as it stands. `point.ts` writes
 * a datum the same way.
 */
function coordinates(x: number, y: number) {
    return `(${formatNumber(snapNumber(x))},${formatNumber(y)})`;
}

/**
 * How tall the box between the two quartiles is drawn.
 *
 * `bottom` and `top` are taken in order, so the height is never negative and
 * the fallback below never has to guess which way the box goes.
 *
 * A rectangle is written as a corner and a size, so PreFigure adds the two back
 * together to find the far corner: both the height and that sum have to stay
 * inside the double range. The distance between quartiles a quarter of the
 * range apart on either side of zero does not — `-3.8e307` to `1.5e308` is
 * already too far — and `formatNumber` answers `null` for anything non-finite,
 * which is not a size PreFigure can read.
 *
 * So the box is drawn as tall as a double allows and stops short of its third
 * quartile, on a chart whose axis spans most of the range a double holds. That
 * is a smaller wrong than a box with no height to draw it by, which is the
 * trade `scale.ts` makes at the same edge for the same reason.
 */
function boxHeight(bottom: number, top: number): number {
    const snapped = snapNumber(top - bottom);
    if (Number.isFinite(bottom + snapped)) {
        return snapped;
    }
    return bottom > 0 ? Number.MAX_VALUE - bottom : Number.MAX_VALUE;
}

/**
 * Whether a value lies in the box the chart is drawn in.
 *
 * Applied to an outlier's coordinates rather than to its marker, for the reason
 * `point.ts` gives: a marker is a symbol standing for a location rather than a
 * shape with an extent, so clipping it cuts the symbol instead of the datum.
 * The boxes and whiskers keep `cliptobbox`, where cutting is right — a whisker
 * is a length, and a bound genuinely truncates it.
 */
function inBounds(value: number, yMin: number, yMax: number): boolean {
    return value >= yMin && value <= yMax;
}

/**
 * Builds the PreFigure XML for a box chart.
 *
 * The vertical axis keeps numeric labels via an explicit `vlabels`; the
 * horizontal axis has its automatic labels suppressed and gets one
 * `<tick-mark>` per series instead.
 *
 * No legend, whichever way `legend` was written. A legend names what a color
 * stands for, and on a box chart the name is already under the box: every other
 * type puts several series in the same space and needs the key to tell them
 * apart, where this one gives each series a position of its own and labels it
 * on the axis. A legend here would spend width to repeat the axis.
 *
 * `boxAnnotationText` and `outlierAnnotationText` are handed in rather than
 * built here. The five numbers of a summary cannot be told apart without words
 * naming them, and a word built in the worker would be English in a document
 * that may be in any language — so the phrasing is assembled where the
 * document's locale is known. The numbers themselves are written here, by the
 * same `formatNumber` that writes them into the picture, so that what a reader
 * hears and what a reader sees cannot be two different roundings of one value.
 */
export function createBoxChartPrefigureXML({
    geometry,
    seriesRendering,
    boxAnnotationText,
    outlierAnnotationText,
    widthPx,
    heightPx,
    xLabel,
    xLabelHasLatex,
    yLabel,
    yLabelHasLatex,
    title,
    shortDescription,
    darkMode = false,
}: {
    geometry: BoxChartGeometry;
    seriesRendering: ChartSeriesRendering[];
    /** What a screen reader hears on each box: its five-number summary. */
    boxAnnotationText: (parts: {
        label: string;
        minimum: string;
        quartile1: string;
        median: string;
        quartile3: string;
        maximum: string;
    }) => string;
    /** The same for one observation drawn beyond a whisker. */
    outlierAnnotationText: (parts: { label: string; value: string }) => string;
    widthPx: number;
    heightPx: number;
    xLabel?: string;
    xLabelHasLatex?: boolean;
    yLabel?: string;
    yLabelHasLatex?: boolean;
    title?: string;
    shortDescription?: string;
    darkMode?: boolean;
}): { xml: string; diagnostics: DiagnosticRecord[] } {
    const diagnostics: DiagnosticRecord[] = [];

    const [, yMin, , yMax] = geometry.bounds;

    // Once per series rather than once per element: every part of a box is
    // drawn from the same `selectedStyle`, so the attribute strings are
    // identical across them, and `styleAttributes` also reports an unsupported
    // fill or line style through `diagnostics` — which the queue deduplicates
    // by message, but there is no reason to hand it the same one six times.
    //
    // The whiskers, the caps and the median are strokes rather than shapes:
    // `<line>` reads only the stroke attributes (`get_1d_attr`, `line.py`), and
    // a fill on one would say nothing.
    const styleForSeries = geometry.series.map((_unused, seriesIndex) => {
        const selectedStyle = seriesRendering[seriesIndex]?.selectedStyle;
        return {
            box: styleAttributes({
                selectedStyle,
                diagnostics,
                warningPrefix: "<chart>",
            }).join(" "),
            stroke: styleAttributes({
                selectedStyle,
                diagnostics,
                warningPrefix: "<chart>",
                includeFill: false,
            }).join(" "),
            outlier: pointStyleAttributes({
                selectedStyle,
                diagnostics,
                warningPrefix: "<chart>",
            }).join(" "),
        };
    });

    const seriesElements: string[][] = geometry.series.map(() => []);
    const seriesAnnotations: string[][] = geometry.series.map(() => []);

    for (const box of geometry.boxes) {
        const { seriesIndex, slot, halfWidth, summary } = box;
        const style = styleForSeries[seriesIndex];
        const withSpace = (attrs: string) => (attrs ? ` ${attrs}` : "");

        const elements = seriesElements[seriesIndex];
        const handle = `box-${seriesIndex + 1}`;

        // Quartile to quartile. Clipped to the box it is drawn in, since a
        // `yMin` above the first quartile or a `yMax` below the third leaves
        // part of the rectangle outside the axes — and PreFigure draws a
        // rectangle unclipped unless asked, so that part would be painted over
        // the names below the frame or off the edge of the picture.
        //
        // A rectangle of no height where the two quartiles coincide, which is
        // what a series of one observation, or of one value repeated, comes to.
        // Drawn rather than skipped: it paints as a line at the value, which is
        // exactly what the summary says — every one of the five numbers is
        // there.
        //
        // The two quartiles are taken in order, so `lower-left` is the corner
        // it says it is. `quantileSeq` compares with a tolerance and can answer
        // with a first quartile above its third on a column whose whole spread
        // falls inside it, and a rectangle written from that pair as it stands
        // has a negative height and its corner at the top. PreFigure reads such
        // a shape from the other corner and draws the same interval, so this is
        // the XML saying what it means rather than a fix to the picture — and
        // it is what lets `boxHeight` fall back to an unsigned height. The
        // annotation below goes on reporting the pair as it came out, which is
        // the honest thing for it to say.
        const boxBottom = Math.min(summary.quartile1, summary.quartile3);
        const boxTop = Math.max(summary.quartile1, summary.quartile3);
        elements.push(
            `<rectangle at="${escapeXml(handle)}" lower-left="${escapeXml(
                coordinates(slot - halfWidth, boxBottom),
            )}" dimensions="${escapeXml(
                `(${formatNumber(snapNumber(halfWidth * 2))},${formatNumber(
                    boxHeight(boxBottom, boxTop),
                )})`,
            )}" cliptobbox="yes"${withSpace(style.box)} />`,
        );

        // Across the box, at the median. Drawn after the rectangle so the fill
        // cannot cover it.
        elements.push(
            `<line p1="${escapeXml(
                coordinates(slot - halfWidth, summary.median),
            )}" p2="${escapeXml(
                coordinates(slot + halfWidth, summary.median),
            )}" cliptobbox="yes"${withSpace(style.stroke)} />`,
        );

        // A whisker from each edge of the box to the furthest observation
        // still inside the fence, with a cap across its end.
        //
        // From the *ordered* edges rather than from `quartile1` and
        // `quartile3` as they came out: on a column whose quartiles
        // `quantileSeq` inverted, pairing the first quartile with the lower
        // whisker starts that whisker at the top of the box and runs it down
        // past the bottom, and the other one back up through it — two lines
        // drawn through the box rather than out of it.
        //
        // Each is drawn only where it would point away from the box.
        // `Math.sign` is zero when the observation is the edge itself — the
        // minimum of a column whose lower quarter is one repeated value, say —
        // so that case is skipped as it always was: the whisker would have no
        // length and the cap would lie along the edge of the box, two marks
        // saying what the box's own edge already says. It is also skipped in
        // the case that rule now covers, where the furthest observation inside
        // the fence is on the wrong side of the edge to be reached outward.
        const whiskers = [
            { from: boxBottom, to: summary.lowerWhisker, outward: -1 },
            { from: boxTop, to: summary.upperWhisker, outward: 1 },
        ];
        const capHalfWidth = halfWidth * CAP_WIDTH_FRACTION;
        for (const {
            from: fromQuartile,
            to: toObservation,
            outward,
        } of whiskers) {
            if (Math.sign(toObservation - fromQuartile) !== outward) {
                continue;
            }
            elements.push(
                `<line p1="${escapeXml(
                    coordinates(slot, fromQuartile),
                )}" p2="${escapeXml(
                    coordinates(slot, toObservation),
                )}" cliptobbox="yes"${withSpace(style.stroke)} />`,
                `<line p1="${escapeXml(
                    coordinates(slot - capHalfWidth, toObservation),
                )}" p2="${escapeXml(
                    coordinates(slot + capHalfWidth, toObservation),
                )}" cliptobbox="yes"${withSpace(style.stroke)} />`,
            );
        }

        // The box carries the whole summary, because the five numbers it
        // reports are not five elements: two of them are the rectangle's own
        // edges, and there is nothing separate to annotate. A reader stopping
        // here hears the distribution in one phrase, which is what a box plot
        // is read for.
        seriesAnnotations[seriesIndex].push(
            `<annotation ref="${escapeXml(handle)}" text="${escapeXml(
                boxAnnotationText({
                    label: box.label,
                    minimum: formatNumber(summary.minimum) ?? "",
                    quartile1: formatNumber(summary.quartile1) ?? "",
                    median: formatNumber(summary.median) ?? "",
                    quartile3: formatNumber(summary.quartile3) ?? "",
                    maximum: formatNumber(summary.maximum) ?? "",
                }),
            )}" />`,
        );

        // Each observation beyond a fence, as a point of its own — which is
        // what makes it reachable in the tree a screen reader walks, and is why
        // they are not drawn as part of the whisker.
        summary.outliers.forEach((outlier, ind) => {
            if (!inBounds(outlier, yMin, yMax)) {
                return;
            }
            const outlierHandle = `outlier-${seriesIndex + 1}-${ind + 1}`;
            elements.push(
                `<point at="${escapeXml(outlierHandle)}" p="${escapeXml(
                    coordinates(slot, outlier),
                )}"${withSpace(style.outlier)} />`,
            );
            seriesAnnotations[seriesIndex].push(
                `<annotation ref="${escapeXml(
                    outlierHandle,
                )}" text="${escapeXml(
                    outlierAnnotationText({
                        label: box.label,
                        value: formatNumber(outlier) ?? "",
                    }),
                )}" />`,
            );
        });
    }

    const xml = assembleChartDiagram({
        bounds: geometry.bounds,
        yTicks: axisTicks(yMin, yMax, geometry.tickStep),
        xTicks: null,
        // A box chart's positions are named by the series' own `<label>`, which
        // may hold an `<m>` — the one type whose axis names can carry math,
        // since a chart of categories names its positions from `categories`, a
        // `textList`, and a histogram names its bins by their cut points. Read off the rendering rather than the geometry, which is
        // renderer-neutral and has no business knowing how a name is typeset.
        // One slot per series, in the same order, so the indices line up.
        slots: geometry.slots.map((slot, seriesIndex) => ({
            ...slot,
            labelHasLatex: Boolean(seriesRendering[seriesIndex]?.labelHasLatex),
        })),
        widthPx,
        heightPx,
        xLabel,
        xLabelHasLatex,
        yLabel,
        yLabelHasLatex,
        title,
        // Never a legend, and so nothing for one to be keyed off or placed by.
        // With no handles to point at there is no entry to write, whatever the
        // author asked for — the same absence a series whose every value was
        // undrawable leaves.
        showLegend: false,
        legendPosition: "outsideright",
        seriesRendering,
        seriesLabels: geometry.series.map(({ label }) => label),
        seriesElements,
        seriesAnnotations,
        seriesKeyHandles: geometry.series.map(() => null),
        legendKeyWidth: 0,
        // Nothing reaches past the frame. A box and its whiskers are drawn
        // inside it and clipped to it, and an outlier's marker — which is a
        // symbol around a datum rather than a shape a clip may cut — is at the
        // center of its slot, half a slot from either side of it, so it never
        // approaches the left or right frame the way a scatter plot's points
        // do.
        //
        // Vertically it can reach the frame, on an authored bound sitting
        // exactly on the outlier, and the base margins already hold it: the
        // seven pixels it reaches against the sixteen above the box and thirty
        // below. Reserving them again was measured and moved nothing — a
        // marker at `yMax` came out one pixel inside a `size="tiny"` picture
        // with the reservation and one pixel inside without it, because
        // `fitMargins` scales what it grants and a crowded frame does not
        // honor the extra. All it did was take seven pixels of drawing area
        // from every chart that had room to spare.
        markOverhang: 0,
        overlayElements: [],
        shortDescription,
        darkMode,
    });

    return { xml, diagnostics };
}
