/**
 * PreFigure assembly for `<chart>` — bars, points and the lines through them.
 *
 * Kept apart from `graph.ts` because a chart is not a graph with data in it: it
 * owns its own bounding box, it sizes its own axes from the data, and it has no
 * graphical descendants to convert. What it shares with `graph.ts` is the
 * vocabulary — `common.ts` for escaping and formatting, `style.ts` for Doenet
 * styles, `label.ts` for axis labels — not the algorithm.
 *
 * `<tick-mark>` is emitted here and nowhere else in this folder. It places
 * arbitrary text at an arbitrary axis position, which is the only way to get
 * categorical labels: PreFigure's own `hlabels` is a numeric
 * `(start, step, end)` triple (`axes.py`), so category names cannot go through
 * it. Automatic labels are switched off with `decorations="no"`; the vertical
 * axis gets an explicit `vlabels` back, and the horizontal one gets `hlabels`
 * when its positions are measurements and tick marks when they are names.
 *
 * `<label>` is not new — `components/vector.ts` and `components/angle.ts`
 * already emit it — but it is put to two new uses here: the optional value
 * printed at the end of each mark, and the chart's title, drawn above the frame
 * at a `scale` the axis numbers do not use.
 *
 * `<legend>` is emitted here and nowhere else in this folder; `<group>` is
 * shared with `components/curve.ts`, which wraps a multi-piece curve in one.
 * A chart of more than one series wraps each of them in a `<group>`, which is
 * what gives a screen reader a level to stop at between the chart and its marks
 * — grouping components to be annotated together is what `group.py` exists for.
 *
 * A legend is drawn as soon as a series is named, whether the chart has one
 * series or several, and each of its items points at one of that series' own
 * marks rather than at the group. PreFigure assembles a legend out of the
 * elements its items refer to, reading each one's `fill` for the swatch — or
 * drawing a segment of the stroke where there is no fill, which is what puts a
 * line in a line chart's legend. So a series' color reaches the legend by the
 * same attribute that draws it and the two cannot drift apart.
 *
 * A legend's background box is filled white by `legend.py` with no attribute to
 * say otherwise, which reads as a hole punched in a chart drawn in dark mode.
 * Its `opacity` and `stroke` *are* attributes, so the box is made transparent
 * and given an outline that follows the page's text color instead.
 *
 * The axes sit on or near the edge of the bounding box, so their labels would
 * be drawn outside the drawing area and clipped. `<diagram margins>` is the
 * fix: PreFigure adds the margins *outside* `dimensions`, so the inner size is
 * shrunk by them to keep the rendered chart the size the author actually asked
 * for.
 */

/**
 * Room reserved outside the plotting area, in pixels, as
 * `[left, bottom, right, top]`: the left for the vertical axis' numbers, the
 * bottom for the category names, the top and right for the half of the
 * outermost label that falls past the corner it is drawn at.
 *
 * Only the left margin depends on the data, and it has to: it was fixed at 46px
 * on the assumption that axis numbers run to a handful of digits, and a chart
 * of counts in the thousands clipped the leading digit off `1,500` — an
 * entirely ordinary sample size, not an exotic one. PreFigure lays the text out
 * in the worker and nothing here can ask how wide it came out, so the width is
 * estimated from the longest label the axis will carry.
 */

import { labelMarkup } from "../label";
import type { BarChartGeometry } from "./bar";
import type { PointChartGeometry } from "./point";
import type { PieChartGeometry } from "./pie";

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

export type { ChartSeriesValues } from "./scale";
export type { ChartSeriesRendering } from "./frame";

/** Any of the geometries a `<chart>` produces, whichever type was named. */
export type ChartGeometry =
    BarChartGeometry | PointChartGeometry | PieChartGeometry;

/**
 * Whether the legend this chart would draw has anything to put in it.
 *
 * An item is a name beside a swatch, and PreFigure builds the swatch out of an
 * element the item points at, so whatever the legend names needs both a name
 * and something drawn: a series whose every value is undrawable is named but
 * has nothing to point at, and one drawn from an unnamed series would be a
 * swatch beside a blank line. What is named is the series on every type but
 * one — a pie names its slices, since that is the level its colors are chosen
 * at.
 *
 * Exported so that `<chart>`'s `showLegend` asks the same question the XML
 * below is built from, rather than restating it somewhere it could drift.
 * Whether a label carries LaTeX changes how it is written, not whether there
 * is anything to write, so it is not asked here.
 */
export function chartLegendHasItems(geometry: ChartGeometry | null): boolean {
    if (geometry === null) {
        return false;
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
