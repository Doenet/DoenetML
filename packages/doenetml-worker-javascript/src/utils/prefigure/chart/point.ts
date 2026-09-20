/**
 * `<chart type="line">` and `<chart type="scatter">`: a `<point>` per value,
 * with or without a `<polygon closed="no">` through them.
 *
 * One type, two shapes. They are the same points and the same axes, and differ
 * only in whether a path joins them.
 */

import { escapeXml, formatNumber } from "../common";
import { THEME_AWARE_LABEL_COLOR_ATTR } from "../label";
import { pointStyleAttributes, styleAttributes } from "../style";
import type { DiagnosticRecord } from "@doenet/utils";
import {
    autoAxisBounds,
    reconcileBounds,
    tickStepForBounds,
    type ChartSeriesValues,
} from "./scale";
import {
    assembleChartDiagram,
    axisTicks,
    LEGEND_LINE_KEY_WIDTH,
    LEGEND_PLACEMENTS,
    LEGEND_SWATCH_KEY_WIDTH,
    type ChartSeriesRendering,
} from "./frame";

/**
 * One series' values for a chart drawn as points, with the horizontal
 * coordinates when the author gave them.
 *
 * `x` is `null` for a series whose points sit under categories rather than at
 * measured positions — a line chart of counts per region, where the horizontal
 * axis carries names and the spacing between them means nothing.
 */
export type ChartPointSeriesValues = ChartSeriesValues & {
    x: number[] | null;
};

/** One drawn point, in data coordinates. */
export type ChartPointMark = {
    /** Which series the point belongs to, 0-based. */
    seriesIndex: number;
    x: number;
    y: number;
    /** 1-based position along a categorical axis, or null on a numeric one. */
    slot: number | null;
    /** The category the point sits under, or "" on a numeric axis. */
    label: string;
};

export type PointChartGeometry = {
    kind: "point";
    /** The series drawn, in order, whether or not any of their points could be. */
    series: { label: string }[];
    points: ChartPointMark[];
    /**
     * Every position on a categorical horizontal axis, with the category it is
     * labeled by — or null when the axis is numeric and carries its own
     * numbers instead.
     */
    slots: { center: number; label: string }[] | null;
    /** `[xMin, yMin, xMax, yMax]` in data coordinates. */
    bounds: [number, number, number, number];
    /** The spacing between labeled values on the vertical axis. */
    tickStep: number;
    /** The same on the horizontal axis, or null when it is categorical. */
    xTickStep: number | null;
    /** How many values could not be drawn as a point. */
    undrawnValues: number;
};

/**
 * The points and bounding box for a chart drawn as points — a scatter plot, or
 * a line chart, which is the same points with a path through them.
 *
 * The horizontal axis is whichever kind the data asks for. A series with an `x`
 * makes it numeric, because the positions are measurements and the distance
 * between them is part of what the chart says; a series without one puts its
 * points at 1, 2, … n under `categories`, exactly where a bar chart puts its
 * bars. Reading either kind is what lets one type serve both a time series and
 * a category-by-category comparison without being two components.
 *
 * Unlike a bar chart, neither axis is anchored to zero: a point is not a length
 * measured from a baseline, so there is nothing for the axis to be measured
 * from, and forcing zero in would push a scatter of adult heights into the top
 * fifth of the picture. Both axes are instead rounded outward to the next tick
 * past the data, so no point is drawn on the frame.
 */
export function computePointChartGeometry({
    series,
    labels,
    xMinAttr,
    xMaxAttr,
    yMinAttr,
    yMaxAttr,
}: {
    series: ChartPointSeriesValues[];
    labels: string[];
    xMinAttr: number | null;
    xMaxAttr: number | null;
    yMinAttr: number | null;
    yMaxAttr: number | null;
}): PointChartGeometry {
    // One series carrying an `x` settles the axis for all of them: two series
    // cannot be read against each other if one is placed by measurement and the
    // other by position. A series with no `x` of its own is then a series whose
    // every value is missing a coordinate, so none of it is drawn and the
    // warning below says so — putting it at 1, 2, … n instead would place it by
    // position on an axis measured in something else, which is a claim the
    // author did not make.
    const numericAxis = series.some((oneSeries) => oneSeries.x !== null);

    const numSlots = series.reduce(
        (widest, oneSeries) => Math.max(widest, oneSeries.values.length),
        0,
    );

    const points: ChartPointMark[] = [];
    let undrawnValues = 0;

    // Series-major, as the bars are, so a series' points are contiguous: the
    // drawing groups them under one annotation and the legend keys off the
    // first of them.
    series.forEach((oneSeries, seriesIndex) => {
        oneSeries.values.forEach((y, ind) => {
            const slot = ind + 1;
            const x = numericAxis ? (oneSeries.x?.[ind] ?? NaN) : slot;

            // A point needs both coordinates, so a `y` with no `x` beside it
            // is as undrawable as a `y` that is not a number — which is what a
            // series given fewer horizontal coordinates than values produces
            // from the position the coordinates run out.
            if (!Number.isFinite(x) || !Number.isFinite(y)) {
                undrawnValues++;
                return;
            }

            points.push({
                seriesIndex,
                x,
                y,
                slot: numericAxis ? null : slot,
                label: numericAxis ? "" : (labels[ind] ?? String(slot)),
            });
        });

        // The mirror of the case above, which the loop cannot reach because it
        // walks the values: a coordinate with no value beside it is a point
        // with only one coordinate, exactly as undrawable as a value with no
        // coordinate. Counting only one direction meant
        // `<series x="1 2 3">4 9</series>` dropped its third coordinate in
        // silence while `<series x="1 2">4 9 2</series>` said so.
        if (numericAxis) {
            undrawnValues += Math.max(
                0,
                (oneSeries.x?.length ?? 0) - oneSeries.values.length,
            );
        }
    });

    /** Whole-number data gets whole-number ticks. */
    function wholeAlong(pick: (point: ChartPointMark) => number) {
        return points.every((point) => Number.isInteger(pick(point)));
    }

    let low = 0;
    let high = 0;
    let first = true;
    for (const point of points) {
        if (first) {
            low = point.y;
            high = point.y;
            first = false;
        } else {
            low = Math.min(low, point.y);
            high = Math.max(high, point.y);
        }
    }

    const wholeY = wholeAlong((point) => point.y);
    const [autoYMin, autoYMax] = autoAxisBounds({
        low,
        high,
        minStep: wholeY ? 1 : 0,
        baseline: null,
    });
    const [yMin, yMax] = reconcileBounds(
        yMinAttr,
        yMaxAttr,
        autoYMin,
        autoYMax,
    );

    if (!numericAxis) {
        return {
            kind: "point",
            series: series.map(({ label }) => ({ label })),
            points,
            slots: Array.from({ length: numSlots }, (_unused, ind) => ({
                center: ind + 1,
                label: labels[ind] ?? String(ind + 1),
            })),
            // The same horizontal extent a bar chart of the same categories
            // gets, so a `<chart type>` switched between them does not move the
            // data sideways. The vertical pair is the two charts' own: a bar
            // chart's includes zero and this one's does not.
            bounds: [0, yMin, numSlots + 1, yMax],
            tickStep: tickStepForBounds(yMin, yMax, wholeY),
            xTickStep: null,
            undrawnValues,
        };
    }

    let xLow = 0;
    let xHigh = 0;
    let firstX = true;
    for (const point of points) {
        if (firstX) {
            xLow = point.x;
            xHigh = point.x;
            firstX = false;
        } else {
            xLow = Math.min(xLow, point.x);
            xHigh = Math.max(xHigh, point.x);
        }
    }

    const wholeX = wholeAlong((point) => point.x);
    const [autoXMin, autoXMax] = autoAxisBounds({
        low: xLow,
        high: xHigh,
        minStep: wholeX ? 1 : 0,
        baseline: null,
    });
    const [xMin, xMax] = reconcileBounds(
        xMinAttr,
        xMaxAttr,
        autoXMin,
        autoXMax,
    );

    return {
        kind: "point",
        series: series.map(({ label }) => ({ label })),
        points,
        slots: null,
        bounds: [xMin, yMin, xMax, yMax],
        tickStep: tickStepForBounds(yMin, yMax, wholeY),
        xTickStep: tickStepForBounds(xMin, xMax, wholeX),
        undrawnValues,
    };
}

/**
 * How a point chart's marks are joined up.
 *
 * The two types differ in this and in nothing else: they are the same points,
 * with or without a path through them.
 */
export type PointChartShape = "scatter" | "line";

/**
 * How far a marker reaches past the point it stands for, in pixels.
 *
 * PreFigure draws a `size="5"` circle with a 4px stroke, so it paints five
 * pixels out plus half the stroke. A point chart's marks therefore extend past
 * the box the way an axis label extends past its corner, and the margins have
 * to hold both — otherwise a marker at the edge lands on the title above it or
 * the legend beside it.
 */
const MARKER_OVERHANG = 7;

/** A point as PreFigure writes a coordinate pair, `(x,y)`. */
function pointCoordinates(point: ChartPointMark) {
    return `(${formatNumber(point.x)},${formatNumber(point.y)})`;
}

/**
 * Whether a point lies in the box, and so has a mark to draw.
 *
 * A marker is a symbol standing for a location rather than a shape with an
 * extent of its own, so `cliptobbox` is the wrong tool for keeping one inside
 * the frame: it cuts the symbol rather than the datum. A point at `(2,19.6)`
 * under a `yMax` of 20 is *in* the chart, and its circle came back with the
 * top five pixels sliced off flat — the marker reaches five pixels past a
 * datum four tenths of a unit from the edge.
 *
 * So the box is applied to the point instead of to its drawing: one inside is
 * drawn whole, one outside is not drawn at all. A bar keeps `cliptobbox`,
 * where cutting is the right answer because a bar is a length a bound
 * genuinely truncates, and so does the line, whose path should stop at the
 * frame.
 */
function pointInBounds(
    point: ChartPointMark,
    [xMin, yMin, xMax, yMax]: [number, number, number, number],
): boolean {
    return (
        point.x >= xMin && point.x <= xMax && point.y >= yMin && point.y <= yMax
    );
}

/**
 * Builds the PreFigure XML for a scatter plot or a line chart.
 *
 * One `<point>` per datum rather than PreFigure's own `<scatter>`, which
 * rewrites itself into a `<repeat>` of points sharing a single `point-text`
 * (`statistics.py`) — so every point in a series would carry the same
 * annotation. A point per datum gives each its own coordinates in the tree a
 * screen reader walks, which is the whole reason a chart renders through
 * PreFigure rather than being drawn by hand.
 *
 * A line adds a `<polygon closed="no">` through the series' points in the order
 * they were given. Not sorted by `x`: a path through time is a real chart, and
 * reordering it would quietly draw something else.
 */
export function createPointChartPrefigureXML({
    geometry,
    shape,
    seriesRendering,
    markers,
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
    geometry: PointChartGeometry;
    shape: PointChartShape;
    seriesRendering: ChartSeriesRendering[];
    /** Whether a line chart draws a marker at each of its points. */
    markers: boolean;
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

    const [xMin, yMin, xMax, yMax] = geometry.bounds;

    // A scatter is nothing but its points, so it always draws them; a line
    // draws them unless the author turned them off, which is what a series long
    // enough for its markers to merge into the line needs.
    const drawMarkers = shape === "scatter" || markers;
    const drawLine = shape === "line";

    const seriesElements: string[][] = geometry.series.map(() => []);
    const seriesAnnotations: string[][] = geometry.series.map(() => []);
    const seriesKeyHandles: (string | null)[] = geometry.series.map(() => null);
    /** Drawn after every series, so a later one cannot cover a value label. */
    const valueLabelElements: string[] = [];
    const pointsBySeries: ChartPointMark[][] = geometry.series.map(() => []);

    for (const point of geometry.points) {
        pointsBySeries[point.seriesIndex]?.push(point);
    }

    pointsBySeries.forEach((seriesPoints, seriesIndex) => {
        const selectedStyle = seriesRendering[seriesIndex]?.selectedStyle;

        if (drawLine && seriesPoints.length > 0) {
            // `includeFill: false`, because a polyline is a stroke: a fill on an
            // open path is painted across the region the path would enclose if
            // it were closed, which for a line chart is the area under it.
            const lineAttrs = styleAttributes({
                selectedStyle,
                diagnostics,
                warningPrefix: "<chart>",
                includeFill: false,
            }).join(" ");

            const handle = `line-${seriesIndex + 1}`;
            const coordinates = seriesPoints.map(pointCoordinates).join(",");

            seriesElements[seriesIndex].push(
                `<polygon at="${escapeXml(handle)}" points="${escapeXml(`[${coordinates}]`)}" closed="no" cliptobbox="yes"${lineAttrs ? ` ${lineAttrs}` : ""} />`,
            );

            // The line is what the legend points at for this series: its stroke
            // is the color the series is read by, and PreFigure draws a line
            // swatch for a key with no fill, which is what a line chart's
            // legend should show.
            seriesKeyHandles[seriesIndex] = handle;

            // With no markers there is nothing else in the series to annotate,
            // so the line carries the whole of it. That is a chart a screen
            // reader can reach but not walk point by point, which is the cost
            // of `markers="false"` and is why it is not the default.
            //
            // Named by the series where the author gave it a name, and by the
            // localized fallback the chart worked out where they did not —
            // the same rule the group level uses. A bare position number would
            // be indistinguishable from the coordinates announced around it,
            // and a phrase built here would be English generated in the
            // worker, which the annotations deliberately never contain. For
            // the same reason nothing here says how many points there are.
            if (!drawMarkers) {
                const rendering = seriesRendering[seriesIndex];
                seriesAnnotations[seriesIndex].push(
                    `<annotation ref="${escapeXml(handle)}" text="${escapeXml(
                        rendering?.label ||
                            rendering?.unlabeledName ||
                            `${seriesIndex + 1}`,
                    )}" />`,
                );
            }
        }

        // A value label is anchored to a pair of coordinates rather than to a
        // marker, so it is drawn whether or not there is one there: an author
        // who wrote both `displayValues` and `markers="false"` asked for a line
        // with its numbers printed along it, and dropping them would leave an
        // attribute doing nothing with nothing said about it.
        if (displayValues) {
            for (const point of seriesPoints) {
                if (!pointInBounds(point, geometry.bounds)) {
                    continue;
                }
                valueLabelElements.push(
                    `<label anchor="${escapeXml(pointCoordinates(point))}" alignment="north" ${THEME_AWARE_LABEL_COLOR_ATTR}>${escapeXml(formatNumber(point.y) ?? "")}</label>`,
                );
            }
        }

        if (!drawMarkers) {
            return;
        }

        const pointAttrs = pointStyleAttributes({
            selectedStyle,
            diagnostics,
            warningPrefix: "<chart>",
        }).join(" ");

        seriesPoints.forEach((point, ind) => {
            if (!pointInBounds(point, geometry.bounds)) {
                return;
            }

            const handle = `point-${seriesIndex + 1}-${ind + 1}`;
            if (seriesKeyHandles[seriesIndex] === null) {
                seriesKeyHandles[seriesIndex] = handle;
            }

            seriesElements[seriesIndex].push(
                `<point at="${escapeXml(handle)}" p="${escapeXml(pointCoordinates(point))}"${pointAttrs ? ` ${pointAttrs}` : ""} />`,
            );

            // On a categorical axis the position is a name, so the annotation
            // reads the way the bar chart's does; on a numeric one it is a
            // measurement and both coordinates are what the reader needs.
            const spoken = point.label
                ? `${point.label}: ${formatNumber(point.y)}`
                : `${formatNumber(point.x)}, ${formatNumber(point.y)}`;

            seriesAnnotations[seriesIndex].push(
                `<annotation ref="${escapeXml(handle)}" text="${escapeXml(spoken)}" />`,
            );
        });
    });

    const xml = assembleChartDiagram({
        bounds: geometry.bounds,
        yTicks: axisTicks(yMin, yMax, geometry.tickStep),
        xTicks:
            geometry.xTickStep === null
                ? null
                : axisTicks(xMin, xMax, geometry.xTickStep),
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
        // A line chart keys its legend off the line, which PreFigure draws as
        // a segment rather than a swatch, and a segment is wider.
        legendKeyWidth: drawLine
            ? LEGEND_LINE_KEY_WIDTH
            : LEGEND_SWATCH_KEY_WIDTH,
        markOverhang: drawMarkers ? MARKER_OVERHANG : 0,
        overlayElements: valueLabelElements,
        shortDescription,
        darkMode,
    });

    return { xml, diagnostics };
}
