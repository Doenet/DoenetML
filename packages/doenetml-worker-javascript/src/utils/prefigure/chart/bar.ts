/**
 * `<chart type="bar">`: one `<rectangle>` per value, standing on a baseline of
 * zero under an axis of category names.
 */

import { escapeXml, formatNumber } from "../common";
import { THEME_AWARE_LABEL_COLOR_ATTR } from "../label";
import { styleAttributes } from "../style";
import type { DiagnosticRecord } from "@doenet/utils";
import {
    autoAxisBounds,
    reconcileBounds,
    saturatingAdd,
    snapNumber,
    tickStepForBounds,
    type ChartSeriesValues,
} from "./scale";
import {
    assembleChartDiagram,
    axisTicks,
    LEGEND_PLACEMENTS,
    LEGEND_SWATCH_KEY_WIDTH,
    type ChartSeriesRendering,
} from "./frame";

/** How the bars of several series share a category's slot. */
export type BarLayout = "grouped" | "stacked";

/** The bar geometry a chart renders, in data coordinates. */
export type BarGeometry = {
    /** Which series the bar belongs to, 0-based. */
    seriesIndex: number;
    /** 1-based position along the categorical axis. */
    slot: number;
    /** The category the slot is labeled by. */
    label: string;
    value: number;
    lowerLeft: [number, number];
    dimensions: [number, number];
};

export type BarChartGeometry = {
    kind: "bar";
    /**
     * The series drawn, in order, whether or not any of their values could be.
     * One whose every value is non-finite is kept rather than dropped: it is a
     * group of the data that happens to be empty, not a group that is absent,
     * so it keeps its place in the order and a screen reader still reaches it
     * by name. It gets no swatch in the legend, since PreFigure builds one out
     * of an element the item points at and there is no bar to point at.
     */
    series: { label: string }[];
    bars: BarGeometry[];
    /**
     * Every position on the categorical axis, drawn or not, with the category
     * it is labeled by. A value that is not a finite number has a slot but no
     * bar, and the slot is what keeps its category on the axis.
     */
    slots: { center: number; label: string }[];
    /** `[xMin, yMin, xMax, yMax]` in data coordinates. */
    bounds: [number, number, number, number];
    /** The spacing between labeled values on the vertical axis. */
    tickStep: number;
    /** How many values had no bar because they were not finite numbers. */
    undrawnValues: number;
};

/**
 * How tall a stacked segment between `base` and `top` is drawn, snapped.
 *
 * Measuring the height as a difference is what keeps a segment based at the
 * saturation ceiling from overflowing, but snapping that difference can undo
 * it: `toPrecision(12)` rounds, and rounding *up* a height that was measured
 * against the largest representable number puts `base + height` back over the
 * edge. A base of `1.798e302` under a saturated total came out as a rectangle
 * whose far corner was `Infinity`, which PreFigure drew as
 * `L nan -inf` — the same shape of bug the difference was introduced to fix.
 *
 * So the snapped height is used only while the corner it reconstructs is still
 * finite, and the exact difference is the fallback. The last case shrinks by
 * one part in 2^52, which no picture can show, and exists because subtracting
 * and adding back can itself round over the ceiling.
 */
function segmentHeight(base: number, top: number): number {
    const exact = top - base;
    const snapped = snapNumber(exact);
    if (Number.isFinite(base + snapped)) {
        return snapped;
    }
    if (Number.isFinite(base + exact)) {
        return exact;
    }
    return exact * (1 - Number.EPSILON);
}

/**
 * The bar rectangles and bounding box for one or more series of values.
 *
 * Slots sit at x = 1, 2, … n, one per category, and the bars of a slot occupy
 * `barWidth` of that one-unit slot between them — so the gap between slots is
 * what is left over. The box starts at x = 0 so the vertical axis has somewhere
 * to be drawn, and ends one full unit past the last slot — one slot at each end
 * — so that the gap before the first slot and the gap after the last are equal
 * whatever `barWidth` is. Ending half a unit past the last *center* instead
 * left the trailing gap a fraction of the leading one, and none at all at
 * `barWidth="1"`, where the last bar sat flush against the frame.
 *
 * `layout` decides how the series share a slot. Under `grouped` they stand side
 * by side and divide `barWidth` evenly between them, so one series is drawn
 * exactly as it would be alone; under `stacked` they sit on top of one another
 * at the full width, positives climbing from zero and negatives hanging from
 * it. Stacking the two directions separately is what keeps a mixed-sign stack
 * from drawing its bars through each other, and it is what every plotting
 * package does with the same data.
 *
 * `yMax` is the author's when they gave one; otherwise it is rounded up to the
 * next tick so the tallest bar does not touch the top of the box — measured
 * against the stack totals under `stacked`, since that is what is drawn. An
 * empty chart, or one whose values are all zero, still gets a box one tick tall
 * — otherwise the axis would collapse and the chart would look broken rather
 * than empty.
 *
 * Bounds that do not describe a finite positive range — `yMin` at or above
 * `yMax`, or either of them not a finite number — are dropped in favor of the
 * automatic ones: a box of zero or negative height has no drawing in it to be
 * worth honoring the author's request over. `NaN` fails the comparison on its
 * own, but an infinity does not: `yMin="-Infinity"` compares as below every
 * `yMax` and would reach `formatNumber`, which answers `null` for anything
 * non-finite and would write the literal `null` into the bounding box.
 */
export function computeBarChartGeometry({
    series,
    labels,
    barWidth,
    layout,
    yMinAttr,
    yMaxAttr,
}: {
    series: ChartSeriesValues[];
    labels: string[];
    barWidth: number;
    layout: BarLayout;
    yMinAttr: number | null;
    yMaxAttr: number | null;
}): BarChartGeometry {
    // Every series is drawn against the same categories, so the axis is as long
    // as the longest of them. A series that runs short simply has no bar in the
    // slots past its end, which is the same absence a non-finite value leaves.
    const numSlots = series.reduce(
        (widest, oneSeries) => Math.max(widest, oneSeries.values.length),
        0,
    );

    // A value that is not a finite number has no bar. Drawing it as zero would
    // put a real datum on the chart that the data does not contain, and
    // `values` would still report the `NaN` — so the picture and the public
    // property would disagree. The slot is kept, so the remaining bars stay
    // under their own categories, and it is simply empty.
    const drawable = series.map((oneSeries) =>
        oneSeries.values.map((value) => Number.isFinite(value)),
    );

    let undrawnValues = 0;
    for (const seriesDrawable of drawable) {
        for (const canDraw of seriesDrawable) {
            if (!canDraw) {
                undrawnValues++;
            }
        }
    }

    // Whole-number values get whole-number ticks; anything else — proportions,
    // averages — is free to be labeled in fractions.
    const wholeValues = series.every((oneSeries, seriesInd) =>
        oneSeries.values.every(
            (value, ind) =>
                !drawable[seriesInd][ind] || Number.isInteger(value),
        ),
    );
    const minStep = wholeValues ? 1 : 0;

    const halfSlot = barWidth / 2;
    const stacked = layout === "stacked";
    // Under `grouped` the series divide the slot between them; under `stacked`
    // each takes the whole of it, since they are drawn one above another.
    const oneBarWidth = stacked
        ? barWidth
        : barWidth / Math.max(series.length, 1);

    // How far each slot's stack has climbed above zero and hung below it. Both
    // stay at zero under `grouped`, where every bar is measured from the
    // baseline, so one pass builds the bars either way.
    const stackAbove = new Array(numSlots).fill(0);
    const stackBelow = new Array(numSlots).fill(0);

    const bars: BarGeometry[] = [];

    // Series-major, so a series' bars are contiguous: the drawing groups them
    // under one annotation, and the legend keys off the first of them.
    series.forEach((oneSeries, seriesIndex) => {
        oneSeries.values.forEach((value, ind) => {
            if (!drawable[seriesIndex][ind]) {
                return;
            }

            const slot = ind + 1;
            const center = stacked
                ? slot
                : slot - halfSlot + (seriesIndex + 0.5) * oneBarWidth;

            // A stacked segment's `height` is the distance between the two ends
            // it is actually drawn at, not the magnitude of its value: a
            // segment given its own value as a height at a base already at the
            // ceiling has a far corner beyond the double range, which PreFigure
            // resolves to `nan`/`-inf` in the path it draws. Measuring between
            // the ends instead leaves the last segment flat against the
            // ceiling. `value` is untouched, so the annotation still reads the
            // datum the author gave.
            //
            // Snapped like every other computed coordinate here, because
            // subtracting one running total from another leaves the same dust
            // that dividing a slot does: three stacked series of 0.1, 0.2 and
            // 0.3 measure out as 0.1, 0.20000000000000004 and
            // 0.30000000000000004. A bar under `grouped` is measured from zero
            // and so is the author's own number, which is left exactly as
            // written.
            let base;
            let height;
            if (!stacked) {
                base = Math.min(0, value);
                height = Math.abs(value);
            } else if (value < 0) {
                const bottom = saturatingAdd(stackBelow[ind], value);
                height = segmentHeight(bottom, stackBelow[ind]);
                base = bottom;
                stackBelow[ind] = bottom;
            } else {
                base = stackAbove[ind];
                const top = saturatingAdd(base, value);
                height = segmentHeight(base, top);
                stackAbove[ind] = top;
            }

            // Snapped for the reason every tick value here is: a bar's corner
            // is reached by dividing the slot and adding the divisions back up,
            // and the dust that leaves would be written into the XML — the
            // first bar of two would start at `0.6000000000000001` where a
            // chart of one series starts at `0.6`, for a picture that is the
            // same to the pixel.
            bars.push({
                seriesIndex,
                slot,
                label: labels[ind] ?? String(slot),
                value,
                lowerLeft: [
                    snapNumber(center - oneBarWidth / 2),
                    snapNumber(base),
                ],
                dimensions: [snapNumber(oneBarWidth), height],
            });
        });
    });

    // The bars are measured from zero, so zero is always in view even when
    // every value is on one side of it. Under `stacked` what has to fit is the
    // total of a slot rather than any one value in it, which is what the two
    // running sums above already hold.
    //
    // Reduced rather than spread: `Math.max(...values)` throws once the list is
    // longer than the engine's argument limit, which would fail a large chart
    // before any of it could be drawn.
    let reachAbove = 0;
    let reachBelow = 0;
    if (stacked) {
        for (let ind = 0; ind < numSlots; ind++) {
            reachAbove = Math.max(reachAbove, stackAbove[ind]);
            reachBelow = Math.min(reachBelow, stackBelow[ind]);
        }
    } else {
        for (const bar of bars) {
            reachAbove = Math.max(reachAbove, bar.value);
            reachBelow = Math.min(reachBelow, bar.value);
        }
    }

    const [autoYMin, autoYMax] = autoAxisBounds({
        low: reachBelow,
        high: reachAbove,
        minStep,
        baseline: 0,
    });

    const [yMin, yMax] = reconcileBounds(
        yMinAttr,
        yMaxAttr,
        autoYMin,
        autoYMax,
    );

    const slots: BarChartGeometry["slots"] = [];
    for (let ind = 0; ind < numSlots; ind++) {
        const center = ind + 1;
        slots.push({ center, label: labels[ind] ?? String(center) });
    }

    return {
        kind: "bar",
        series: series.map(({ label }) => ({ label })),
        bars,
        slots,
        // Every slot still counts toward the width, drawn or not, so a chart
        // with a gap in it keeps its remaining bars under their categories.
        //
        // The box ends one unit past the last slot, which is where the gap
        // beyond the last bar comes out the same size as the gap before the
        // first one: both are `1 - barWidth/2`. Ending half a unit past the
        // center instead leaves the last bar six times closer to the frame than
        // the first at the default width, and flush against it at
        // `barWidth="1"`.
        bounds: [0, yMin, numSlots + 1, yMax],
        tickStep: tickStepForBounds(yMin, yMax, wholeValues),
        undrawnValues,
    };
}

/**
 * Builds the PreFigure XML for a bar chart.
 *
 * The vertical axis keeps numeric labels via an explicit `vlabels`; the
 * horizontal axis has its automatic labels suppressed and gets one
 * `<tick-mark>` per category instead.
 */
export function createBarChartPrefigureXML({
    geometry,
    seriesRendering,
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
    geometry: BarChartGeometry;
    seriesRendering: ChartSeriesRendering[];
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

    // Once per series, not once per bar: every bar of a series is drawn from
    // the same `selectedStyle`, so the attribute string is identical across
    // them, and `styleAttributes` also reports an unsupported fill or line
    // style through `diagnostics` — which the queue deduplicates by message,
    // but there is no reason to hand it the same one per bar to discard.
    const seriesStyleAttrs = geometry.series.map((_unused, seriesIndex) =>
        styleAttributes({
            selectedStyle: seriesRendering[seriesIndex]?.selectedStyle,
            diagnostics,
            warningPrefix: "<chart>",
        }).join(" "),
    );

    const seriesElements: string[][] = geometry.series.map(() => []);
    const seriesAnnotations: string[][] = geometry.series.map(() => []);
    /** The handle of each series' first bar, for the legend to point at. */
    const seriesKeyHandles: (string | null)[] = geometry.series.map(() => null);
    /**
     * The `displayValues` labels, held back until every rectangle is drawn.
     *
     * SVG paints in document order, and under `stacked` the next series' bar
     * begins exactly where this one's ends — which is exactly where this one's
     * label is anchored. Emitted alongside their own bars, every label but the
     * topmost ends up beneath the segment above it. They are decoration rather
     * than structure — nothing annotates them — so they lose nothing by leaving
     * their series' `<group>` and being drawn over the whole chart instead.
     */
    const valueLabelElements: string[] = [];

    for (const bar of geometry.bars) {
        const handle = `bar-${bar.seriesIndex + 1}-${bar.slot}`;
        if (seriesKeyHandles[bar.seriesIndex] === null) {
            seriesKeyHandles[bar.seriesIndex] = handle;
        }

        const barAttrs = seriesStyleAttrs[bar.seriesIndex] ?? "";

        const lowerLeft = `(${formatNumber(bar.lowerLeft[0])},${formatNumber(bar.lowerLeft[1])})`;
        const barDimensions = `(${formatNumber(bar.dimensions[0])},${formatNumber(bar.dimensions[1])})`;

        // Trimmed to the box it is drawn in. Every bar is measured from zero,
        // so a `yMin` above zero, or a `yMax` below the tallest value, leaves
        // part of a bar outside the axes — and PreFigure draws a rectangle
        // unclipped unless asked (`cliptobbox` defaults to `no` for this
        // element), so that part would be painted over the category labels
        // below the frame, or above it, and off the edge of the picture.
        // Asking for the clip is what makes a bound cut the bars off at the
        // frame: a bar lying entirely outside the box disappears, and one
        // crossing the edge is drawn as far as the box goes.
        seriesElements[bar.seriesIndex].push(
            `<rectangle at="${escapeXml(handle)}" lower-left="${escapeXml(lowerLeft)}" dimensions="${escapeXml(barDimensions)}" cliptobbox="yes"${barAttrs ? ` ${barAttrs}` : ""} />`,
        );

        if (displayValues) {
            // At the far end of the bar, outside it: above a bar that grows up
            // and below one that hangs down. Anchoring every label at zero
            // instead would print a negative bar's value on the horizontal
            // axis, a whole bar away from the end it belongs to. Under
            // `stacked` the bar does not start at zero, so the end is where the
            // rectangle ends rather than at its own value.
            const alignment = bar.value < 0 ? "south" : "north";
            const barTop =
                bar.value < 0
                    ? bar.lowerLeft[1]
                    : bar.lowerLeft[1] + bar.dimensions[1];
            const anchorX = bar.lowerLeft[0] + bar.dimensions[0] / 2;
            // Snapped for the reason the bars' own corners are: both are
            // reached by adding the geometry back up, and the dust that leaves
            // would be written into the XML — a grouped bar of three series
            // would be labeled at `0.7333333333334999`, and the top of a stack
            // of 0.1, 0.2 and 0.3 at `0.6000000000000001`.
            const anchor = `(${formatNumber(snapNumber(anchorX))},${formatNumber(snapNumber(barTop))})`;
            valueLabelElements.push(
                `<label anchor="${escapeXml(anchor)}" alignment="${alignment}" ${THEME_AWARE_LABEL_COLOR_ATTR}>${escapeXml(formatNumber(bar.value) ?? "")}</label>`,
            );
        }

        seriesAnnotations[bar.seriesIndex].push(
            `<annotation ref="${escapeXml(handle)}" text="${escapeXml(`${bar.label}: ${formatNumber(bar.value)}`)}" />`,
        );
    }

    const xml = assembleChartDiagram({
        bounds: geometry.bounds,
        yTicks: axisTicks(yMin, yMax, geometry.tickStep),
        xTicks: null,
        slots: geometry.slots,
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
        seriesLabels: geometry.series.map(({ label }) => label),
        seriesElements,
        seriesAnnotations,
        seriesKeyHandles,
        legendKeyWidth: LEGEND_SWATCH_KEY_WIDTH,
        // A bar is drawn inside the box and clipped to it.
        markOverhang: 0,
        overlayElements: valueLabelElements,
        shortDescription,
        darkMode,
    });

    return { xml, diagnostics };
}
