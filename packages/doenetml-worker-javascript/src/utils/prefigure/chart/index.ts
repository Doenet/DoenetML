/**
 * PreFigure assembly for `<chart>` — bars, points and the lines through them,
 * pies, box plots, and histograms.
 *
 * Kept apart from `graph.ts` because a chart is not a graph with data in it: it
 * owns its own bounding box, it sizes its own axes from the data, and it has no
 * graphical descendants to convert. What it shares with `graph.ts` is the
 * vocabulary — `common.ts` for escaping and formatting, `style.ts` for Doenet
 * styles, `label.ts` for labels — not the algorithm.
 *
 * One module per subject, each with its own overview:
 *
 * - `scale.ts` — the arithmetic behind an axis: rounding, tick steps, bounds.
 * - `frame.ts` — what a chart is drawn *in*: the margins, the axes and their
 *   labels, the legend, the title and the annotation tree.
 * - `bar.ts`, `point.ts`, `pie.ts`, `box.ts`, `histogram.ts` — one chart type
 *   each: the geometry its values come to, and the marks drawn from it.
 *
 * This file is what the rest of the worker imports. It holds the union of the
 * geometries and the one question `<chart>` asks about a legend before any XML
 * is built, and re-exports each type's own two functions.
 */

import { labelMarkup } from "../label";
import type { BarChartGeometry } from "./bar";
import type { PointChartGeometry } from "./point";
import type { PieChartGeometry } from "./pie";
import type { BoxChartGeometry } from "./box";
import type { HistogramChartGeometry } from "./histogram";

export type { BarChartGeometry, BarGeometry, BarLayout } from "./bar";
export { computeBarChartGeometry, createBarChartPrefigureXML } from "./bar";

export type {
    ChartPointMark,
    ChartPointSeriesValues,
    PointChartGeometry,
    PointChartShape,
} from "./point";
export {
    computePointChartGeometry,
    createPointChartPrefigureXML,
} from "./point";

export type { PieChartGeometry, PieSliceGeometry } from "./pie";
export { computePieChartGeometry, createPieChartPrefigureXML } from "./pie";

export type { BoxChartGeometry, BoxGeometry } from "./box";
export { computeBoxChartGeometry, createBoxChartPrefigureXML } from "./box";

export type { HistogramBinGeometry, HistogramChartGeometry } from "./histogram";
export {
    computeHistogramChartGeometry,
    createHistogramChartPrefigureXML,
    MAX_REQUESTED_BINS,
} from "./histogram";

export type { ChartSeriesValues } from "./scale";
export type { ChartSeriesRendering } from "./frame";

/** Any of the geometries a `<chart>` produces, whichever type was named. */
export type ChartGeometry =
    | BarChartGeometry
    | PointChartGeometry
    | PieChartGeometry
    | BoxChartGeometry
    | HistogramChartGeometry;

/**
 * Whether the legend this chart would draw has anything to put in it.
 *
 * An item is a name beside a swatch, and PreFigure builds the swatch out of an
 * element the item points at, so whatever the legend names needs both a name
 * and something drawn: a series whose every value is undrawable is named but
 * has nothing to point at, and one drawn from an unnamed series would be a
 * swatch beside a blank line. What is named is usually the series: a pie names
 * its slices, since that is the level its colors are chosen at, and a box chart
 * names nothing, having already named each series on its axis.
 *
 * Exported so that `<chart>`'s `showLegend` asks the same question the XML
 * builders ask, rather than restating it somewhere it could drift.
 * Whether a label carries LaTeX changes how it is written, not whether there
 * is anything to write, so it is not asked here.
 */
export function chartLegendHasItems(geometry: ChartGeometry | null): boolean {
    if (geometry === null) {
        return false;
    }

    // A box chart names each series on the axis, under the box drawn from it,
    // so it has nothing left for a legend to say. The types that draw several
    // series into the same space need a key to tell them apart, and a
    // histogram, which draws one, names that one the way a bar chart of one
    // group does.
    if (geometry.kind === "box") {
        return false;
    }

    // A histogram draws one series, so what its legend can name is that series
    // — the same rule as a bar chart of one group, applied to the one mark a
    // histogram has to point at.
    if (geometry.kind === "histogram") {
        return (
            geometry.bins.length > 0 &&
            geometry.series.some(
                (oneSeries) =>
                    labelMarkup({
                        label: oneSeries.label,
                        labelHasLatex: false,
                    }) !== null,
            )
        );
    }

    // A pie is the one type that colors *within* a series, so its legend names
    // the slices rather than the series. The rule is the same one applied a
    // level down: a slice earns an entry by having an arc for the swatch to be
    // read off, which a slice of no sweep does not.
    if (geometry.kind === "pie") {
        return geometry.slices.some(
            (slice) =>
                slice.sweep > 0 &&
                labelMarkup({
                    label: slice.label,
                    labelHasLatex: false,
                }) !== null,
        );
    }

    // Whichever kind of mark this chart is drawn from. A series earns an entry
    // by having one, because the entry points at a mark for its swatch to be
    // read off — which is the same question for a bar, a point and a line.
    const marks = geometry.kind === "bar" ? geometry.bars : geometry.points;
    const seriesWithAMark = new Set(marks.map((mark) => mark.seriesIndex));
    return geometry.series.some(
        (oneSeries, seriesIndex) =>
            seriesWithAMark.has(seriesIndex) &&
            labelMarkup({
                label: oneSeries.label,
                labelHasLatex: false,
            }) !== null,
    );
}
