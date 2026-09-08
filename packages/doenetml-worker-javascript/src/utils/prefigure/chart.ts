import { darkModeAxisStrokeAttr, escapeXml, formatNumber } from "./common";
import { labelMarkup, THEME_AWARE_LABEL_COLOR_ATTR } from "./label";
import { styleAttributes } from "./style";
import type { DiagnosticRecord } from "@doenet/utils";

/**
 * PreFigure assembly for `<chart type="bar">`.
 *
 * Kept apart from `graph.ts` because a chart is not a graph with bars in it: it
 * owns its own bounding box, its horizontal axis is categorical rather than
 * numeric, and it has no graphical descendants to convert. What it shares with
 * `graph.ts` is the vocabulary — `common.ts` for escaping and formatting,
 * `style.ts` for Doenet styles, `label.ts` for axis labels — not the algorithm.
 *
 * `<tick-mark>` is emitted here and nowhere else in this folder. It places
 * arbitrary text at an arbitrary axis position, which is the only way to get
 * categorical labels: PreFigure's own `hlabels` is a numeric
 * `(start, step, end)` triple (`axes.py`), so category names cannot go through
 * it. Automatic labels are switched off with `decorations="no"` and the
 * vertical axis gets an explicit `vlabels` back, leaving the horizontal axis
 * to the tick marks below.
 *
 * `<label>` is not new — `components/vector.ts` and `components/angle.ts`
 * already emit it — but it is put to two new uses here: the optional value
 * printed at the end of each bar, and the chart's title, drawn above the frame
 * at a `scale` the axis numbers do not use.
 *
 * `<legend>` is emitted here and nowhere else in this folder; `<group>` is
 * shared with `components/curve.ts`, which wraps a multi-piece curve in one.
 * A chart of more than one series wraps each of them in a `<group>`, which is
 * what gives a screen reader a level to stop at between the chart and its bars
 * — grouping components to be annotated together is what `group.py` exists for.
 *
 * A legend is drawn as soon as a series is named, whether the chart has one
 * series or several, and each of its items points at that series' first bar
 * rather than at the group. PreFigure assembles a legend out of the elements
 * its items refer to, reading each one's `fill` for the swatch, so a series'
 * color reaches the legend by the same attribute that draws it and the two
 * cannot drift apart.
 *
 * A legend's background box is filled white by `legend.py` with no attribute to
 * say otherwise, which reads as a hole punched in a chart drawn in dark mode.
 * Its `opacity` and `stroke` *are* attributes, so the box is made transparent
 * and given an outline that follows the page's text color instead.
 *
 * Both axes sit on the edge of the bounding box — the vertical one at x = 0,
 * the horizontal one at the baseline — so their labels would be drawn outside
 * the drawing area and clipped. `<diagram margins>` is the fix: PreFigure adds
 * the margins *outside* `dimensions`, so the inner size is shrunk by them to
 * keep the rendered chart the size the author actually asked for.
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
const CHART_MARGINS_BOTTOM_RIGHT_TOP = [30, 12, 16] as const;

/** Left margin for an axis whose longest label is one character. */
const AXIS_LABEL_MARGIN_BASE = 14;

/**
 * Added per character of the longest axis label. PreFigure draws these at its
 * default size, where a digit is about nine pixels wide; a comma or a minus
 * sign is narrower, so counting every character the same errs toward reserving
 * slightly too much, which is the harmless direction.
 */
const AXIS_LABEL_MARGIN_PER_CHARACTER = 9;

/**
 * Two margins on one axis, scaled to leave the drawing at least half the frame.
 *
 * Returned as written whenever they already fit. When they do not, both shrink
 * by the same factor rather than one absorbing the whole reduction, so a chart
 * too small for its margins keeps their proportions instead of losing an axis
 * to the side that happened to be listed second.
 */
function fitMargins(
    available: number,
    near: number,
    far: number,
    budgetFraction = 1 / 2,
): [number, number] {
    const total = near + far;
    const budget = Math.max(Math.floor(available * budgetFraction), 0);

    if (!Number.isFinite(available) || total <= budget || total <= 0) {
        return [near, far];
    }

    const scale = budget / total;
    return [Math.floor(near * scale), Math.floor(far * scale)];
}

/**
 * How many ticks of a run are measured before the estimate gives up and takes
 * the widest it has seen. The runs this measures hold a handful of ticks by
 * construction; the cap only stops a step that somehow came back too small to
 * close the run from spinning here.
 */
const MAX_TICKS_MEASURED = 64;

/**
 * How wide the vertical axis' numbers will be drawn, in characters.
 *
 * PreFigure formats a tick with thousands separators — 1500 is drawn as
 * `1,500` — so the separators are counted here too, and enough fraction digits
 * are asked for to measure the label as it is drawn: `toLocaleString` rounds to
 * three fraction digits by default, which measures a tick of `0.00005` as the
 * single character `0` and reserves a seventh of the room its label needs.
 *
 * Every tick is measured, not just the two ends, because label length is not
 * monotonic in magnitude once the step is fractional: an axis running from -1
 * to 1 in halves draws `-0.5`, which is wider than either end.
 *
 * Each is snapped before it is measured, for the same reason every other tick
 * value here is: accumulating a step lands on binary noise, and asking for
 * twenty fraction digits then measures all of it. Three steps of `0.00005`
 * reach `0.00015000000000000001`, whose twenty-two characters ask for a margin
 * wider than the whole chart — leaving a plot narrower than its own axis
 * labels, which then run over each other.
 */
function widestTickLabelLength(
    firstTick: number,
    lastTick: number,
    step: number,
): number {
    const asDrawn = (value: number) =>
        Number.isFinite(value)
            ? snapNumber(value).toLocaleString("en-US", {
                  maximumFractionDigits: 20,
              }).length
            : 1;

    let widest = Math.max(asDrawn(firstTick), asDrawn(lastTick), 1);

    if (Number.isFinite(step) && step > 0) {
        const numTicks = Math.min(
            Math.floor((lastTick - firstTick) / step),
            MAX_TICKS_MEASURED,
        );
        for (let ind = 1; ind < numTicks; ind++) {
            widest = Math.max(widest, asDrawn(firstTick + ind * step));
        }
    }

    return widest;
}

/**
 * One series' values, as the geometry needs them.
 *
 * The label rides along because it is what a bar's annotation names the bar's
 * group by, and an annotation is part of the drawing rather than part of how it
 * is styled.
 */
export type ChartSeriesValues = {
    /** The name of the group, or `""` when the series has none. */
    label: string;
    values: number[];
};

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
 * Whether the legend this chart would draw has anything to put in it.
 *
 * An item is a name beside a swatch, and PreFigure builds the swatch out of an
 * element the item points at, so a series needs both a label and a bar: one
 * whose every value is non-finite is named but has nothing to point at, and
 * one drawn from an unnamed series would be a swatch beside a blank line.
 *
 * Exported so that `<chart>`'s `showLegend` asks the same question the XML
 * below is built from, rather than restating it somewhere it could drift.
 * Whether a label carries LaTeX changes how it is written, not whether there
 * is anything to write, so it is not asked here.
 */
export function barChartLegendHasItems(
    geometry: BarChartGeometry | null,
): boolean {
    if (geometry === null) {
        return false;
    }
    const seriesWithABar = new Set(geometry.bars.map((bar) => bar.seriesIndex));
    return geometry.series.some(
        (oneSeries, seriesIndex) =>
            seriesWithABar.has(seriesIndex) &&
            labelMarkup({
                label: oneSeries.label,
                labelHasLatex: false,
            }) !== null,
    );
}

/** How many labeled intervals the vertical axis aims to be divided into. */
const TARGET_TICK_INTERVALS = 5;

/**
 * Rounds away the dust a floating-point multiplication leaves behind, so that
 * `3 * 0.1` is written as `0.3` rather than `0.30000000000000004`.
 *
 * Twelve significant digits is far more than any tick a reader will look at and
 * far fewer than the seventeen it takes to expose binary rounding.
 */
function snapNumber(value: number): number {
    return Number.isFinite(value) ? Number(value.toPrecision(12)) : value;
}

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
 * A running total kept inside the range a double can hold.
 *
 * A stack's height is the sum of its segments, and a sum of finite values need
 * not be finite: two series of `1e308` stack to `Infinity`, which
 * `formatNumber` writes as `null` — a literal `null` in the bounding box, in
 * the axis labels, and in the lower-left corner of every segment stacked above
 * the overflow. Saturating at the largest representable value keeps all three
 * drawable.
 *
 * Saturating the running total is not on its own enough, which is why the
 * segment heights below are measured from it rather than from the values: a
 * rectangle drawn at a saturated base with its own value as its height has a
 * *far corner* that overflows even though both attributes are finite, and
 * PreFigure computes that corner rather than reading it. It came out as
 * `L nan -inf` in the path data of a diagram that otherwise compiled, which is
 * the shape of bug that a check on the emitted XML cannot see.
 */
function saturatingAdd(total: number, value: number): number {
    const sum = total + value;
    if (Number.isFinite(sum)) {
        return sum;
    }
    return sum > 0 ? Number.MAX_VALUE : -Number.MAX_VALUE;
}

/**
 * A tick step that divides `span` into a handful of intervals and lands on
 * numbers a reader recognizes — 1, 2, 5 and their powers of ten, the same
 * ladder every plotting library climbs.
 *
 * `minStep` is 1 for a chart whose scale is whole numbers, so that counts are
 * never labeled 0, 0.5, 1 — which would invite reading half a thing — and 0
 * for one that is not, so that a chart of proportions gets ticks inside the
 * unit interval rather than only at its ends.
 */
function niceTickStep(span: number, minStep: number): number {
    if (Number.isNaN(span) || span <= 0) {
        return Math.max(minStep, 1);
    }

    // A span of `Infinity` is reachable from finite data: values at opposite
    // ends of the double range overflow when subtracted. Falling through to a
    // step of 1 would ask for an impossible number of labels, so scale to the
    // largest magnitude the range can actually hold.
    if (!Number.isFinite(span)) {
        return Math.max(
            minStep,
            snapNumber(Number.MAX_VALUE / TARGET_TICK_INTERVALS),
        );
    }

    const rough = span / TARGET_TICK_INTERVALS;
    const magnitude = 10 ** Math.floor(Math.log10(rough));
    // A subnormal span underflows the power of ten to 0, which would make the
    // step 0 and every tick `NaN`. There is no representable round step below
    // the smallest positive double, so use the value itself.
    if (!(magnitude > 0)) {
        return Math.max(minStep, rough) || Number.MIN_VALUE;
    }
    const normalized = rough / magnitude;

    let step;
    if (normalized <= 1) {
        step = 1;
    } else if (normalized <= 2) {
        step = 2;
    } else if (normalized <= 5) {
        step = 5;
    } else {
        step = 10;
    }

    return Math.max(minStep, snapNumber(step * magnitude));
}

/**
 * The first multiple of `step` at or beyond `value` in `direction`.
 *
 * The division is snapped before it is rounded, so that a value already sitting
 * on a tick is recognized as doing so however the multiplication that produced
 * the step came out in binary.
 */
function tickAtOrBeyond(value: number, step: number, direction: 1 | -1) {
    const ratio = snapNumber(value / step);
    const index = direction === 1 ? Math.ceil(ratio) : Math.floor(ratio);
    return snapNumber(index * step);
}

/**
 * The first multiple of `step` strictly beyond `value` in `direction`, moving
 * one further when `value` already sits exactly on a tick.
 *
 * That last part is what keeps the tallest bar off the frame: a chart of a
 * single value of 80 with a step of 20 goes to 100, not to 80.
 */
function nextTickBeyond(value: number, step: number, direction: 1 | -1) {
    const rounded = tickAtOrBeyond(value, step, direction);
    // Against the *snapped* value: `tickAtOrBeyond` snaps what it returns, so
    // comparing it with the raw datum makes `0.1 + 0.2` look like it is not on
    // the 0.3 tick it was rounded onto. The bound would then be 0.3 — below the
    // value — and the bar would poke out of the top of the box.
    const beyond =
        rounded === snapNumber(value)
            ? snapNumber(rounded + direction * step)
            : rounded;
    // Adding a step to a value near the top of the double range overflows to
    // `Infinity`, which `formatNumber` writes as `null` — so a bar of
    // `Number.MAX_VALUE` would put a literal `null` in the bounding box. Stay
    // at the value itself rather than leave the box unrepresentable; the bar
    // then touches the frame, which is a far smaller problem.
    return Number.isFinite(beyond) ? beyond : value;
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

    /**
     * One tick of headroom past the tallest bar, so it never touches the
     * frame; the same below when any value is negative. A chart with nothing
     * in it still gets one tick of height rather than collapsing.
     */
    function autoBoundsFor(step: number): [number, number] {
        return [
            reachBelow >= 0 ? 0 : nextTickBeyond(reachBelow, step, -1),
            reachAbove <= 0 ? step : nextTickBeyond(reachAbove, step, 1),
        ];
    }

    // Twice, because the box is taller than the data it was built around: a
    // step chosen from the data alone can be a magnitude too small for the box
    // it ends up in, which would leave the axis labeled far more finely than
    // the five-or-so intervals asked for.
    const [firstMin, firstMax] = autoBoundsFor(
        niceTickStep(reachAbove - reachBelow || 1, minStep),
    );
    const [autoYMin, autoYMax] = autoBoundsFor(
        niceTickStep(firstMax - firstMin, minStep),
    );

    let yMin = yMinAttr ?? autoYMin;
    let yMax = yMaxAttr ?? autoYMax;
    if (!Number.isFinite(yMin) || !Number.isFinite(yMax) || !(yMin < yMax)) {
        yMin = autoYMin;
        yMax = autoYMax;
    }

    // The step is settled against the box that ended up being drawn, not
    // against the data alone: `yMin="0" yMax="1000"` over a single bar of
    // height 1 would otherwise keep the step the data asked for and label the
    // axis a thousand times.
    const tickStep = niceTickStep(
        yMax - yMin,
        wholeValues && Number.isInteger(yMin) && Number.isInteger(yMax) ? 1 : 0,
    );

    const slots: BarChartGeometry["slots"] = [];
    for (let ind = 0; ind < numSlots; ind++) {
        const center = ind + 1;
        slots.push({ center, label: labels[ind] ?? String(center) });
    }

    return {
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
        tickStep,
        undrawnValues,
    };
}

/** How a series is drawn and named, alongside the geometry of its bars. */
export type ChartSeriesRendering = {
    label: string;
    labelHasLatex: boolean;
    /**
     * What to call the series in the annotation tree when the author gave it no
     * `<label>`. Localized, so it is built where the document's language is
     * known; the drawing has no way to ask.
     */
    unlabeledName?: string;
    selectedStyle: Record<string, unknown> | undefined;
};

/** Where the legend box sits, and what it is anchored to. */
const LEGEND_PLACEMENTS = {
    // Outside the plot, in a margin widened to hold it. Nothing is drawn there,
    // so these never collide with the data — which the inside placements cannot
    // promise, since a bar chart's tallest bars are exactly where a legend in an
    // upper corner wants to be.
    outsideright: { side: "right", alignment: "se" },
    outsidebottom: { side: "bottom", alignment: "s" },
    // Inside the plot, in the named corner. The author's choice to spend no
    // width or height on the legend, at the risk of it sitting over a mark.
    upperright: { corner: "topRight", alignment: "sw" },
    upperleft: { corner: "topLeft", alignment: "se" },
    lowerright: { corner: "bottomRight", alignment: "nw" },
    lowerleft: { corner: "bottomLeft", alignment: "ne" },
} as const;

/**
 * How wide and how tall PreFigure will draw a legend, in pixels.
 *
 * Estimated rather than measured, for the reason the axis margins are: the text
 * is laid out in PreFigure's own worker and nothing here can ask what came back.
 * `legend.py` builds the box as `outer_padding` either side of a column of
 * labels separated by `vertical-skip`, with a key column beside them — so the
 * height is `2*5 - 7 + n*(labelHeight + 7)` and the width is the widest label
 * plus the key and the paddings.
 *
 * The height is a constant per item, measured against a real render: three
 * items labeled `Q1`/`Q2`/`Q3` came back 61.59px tall against 66 predicted. It
 * over-reserves because the real line box depends on whether the labels happen
 * to carry a descender — `Q` is taller than `2`, and only the browser that laid
 * it out knows. Over-reserving is the safe direction for a margin.
 *
 * The width is summed per character rather than taken as a count times a
 * constant. An axis label is a number, so one constant fits it; a legend label
 * is a word, and a count of characters cannot tell `WWWWWW` from `llllll`. At
 * the 9px per character the axis uses, a legend labeled `WWWWWW` came back
 * 109px wide against 84 predicted and was drawn 5px past the right edge of the
 * picture, while `Population 2024` reserved 26px more than it used.
 */
function estimateLegendSize(labels: string[]): {
    width: number;
    height: number;
} {
    const widest = labels.reduce(
        (widest, label) => Math.max(widest, estimateTextWidth(label)),
        0,
    );
    return {
        width: widest + LEGEND_FURNITURE_WIDTH,
        height: LEGEND_BOX_PADDING + labels.length * LEGEND_ITEM_HEIGHT,
    };
}

/**
 * Roughly how wide a string is drawn at PreFigure's 14px sans-serif, in pixels.
 *
 * Five classes rather than a per-character table, since the only thing asked of
 * this is a margin wide enough: it has to come out over rather than exact, and
 * by as little as it can manage. The figures are rounded up from what real
 * renders came back with — a lowercase letter or a digit is about eight pixels,
 * a capital about eleven, and `m`, `w`, `M` and `W` about thirteen. Against six
 * measured labels this reserves between 1 and 9 pixels more than was drawn, and
 * less than was drawn in none of them.
 */
function estimateTextWidth(text: string): number {
    let width = 0;
    for (const character of text) {
        if (character === " ") {
            width += 4.5;
        } else if (NARROW_CHARACTERS.includes(character)) {
            width += 5;
        } else if (SEMI_NARROW_CHARACTERS.includes(character)) {
            width += 6;
        } else if (WIDE_CHARACTERS.includes(character)) {
            width += 14;
        } else if (character >= "A" && character <= "Z") {
            width += 11.5;
        } else {
            width += 8.5;
        }
    }
    return width;
}

const NARROW_CHARACTERS = "iIl.,:;!|'\u2019";
const SEMI_NARROW_CHARACTERS = 'fjrt()[]{}/\\-\u2013"';
const WIDE_CHARACTERS = "mMwW@";

/** The key swatch and the three paddings `legend.py` puts around the labels. */
const LEGEND_FURNITURE_WIDTH = 30;

/** One label's line box plus the `vertical-skip` under it, at 14px. */
const LEGEND_ITEM_HEIGHT = 21;

/** What is left of the outer padding once the last item's skip is removed. */
const LEGEND_BOX_PADDING = 3;

/**
 * The gap between a legend drawn outside the plot and the edge of the picture.
 *
 * Not a gap between the legend and the plot: PreFigure's own anchor offset is
 * that, and it is the same 4px whichever side the legend is on.
 */
const LEGEND_OUTSIDE_GAP = 8;

/**
 * The offset `legend.py` puts between a legend's anchor and its box, in pixels.
 *
 * PreFigure computes it as `8 * (displacement ± 0.5)`, which comes to 4 for
 * every alignment this file uses. It has to be counted here because the margin
 * has to hold the box *and* the offset PreFigure will add to it — leaving it out
 * is what let an `outsideBottom` legend hang 1.6px past the bottom of the
 * picture.
 */
const LEGEND_ANCHOR_OFFSET = 4;

/**
 * The most of one dimension the margins may take when a legend is drawn outside
 * the plot.
 *
 * `fitMargins` normally leaves the drawing at least half the frame, which is
 * the right rule when the margins hold nothing but axis labels. A legend is
 * different: it is a fixed number of pixels tall whatever the chart's size, so
 * on a small chart the honest choice is a smaller plot rather than a legend
 * scaled into the frame's edge or clipped by it. The author asked for the
 * legend outside; this is what that costs.
 */
const LEGEND_MARGIN_BUDGET = 2 / 3;

/**
 * How much larger than the axis numbers a title is drawn.
 *
 * PreFigure's labels are 14px unless `scale` says otherwise (`label.py`), which
 * is the size of the numbers on the axis — a title at that size would not read
 * as one.
 */
const TITLE_SCALE = 1.4;

/**
 * Room reserved above the drawing for the title, in pixels.
 *
 * The height a line of 14px text scaled by `TITLE_SCALE` occupies, plus a gap
 * to the frame. Estimated rather than measured for the same reason the left
 * margin is: PreFigure lays the text out in its own worker, and nothing here
 * can ask how tall it came out.
 */
const TITLE_MARGIN = 14 * TITLE_SCALE + 10;

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

    const [xMin, yMin, xMax, yMax] = geometry.bounds;
    const bbox = `(${formatNumber(xMin)},${formatNumber(yMin)},${formatNumber(xMax)},${formatNumber(yMax)})`;

    // `decorations="no"` suppresses the automatic labels on both axes; the
    // explicit `vlabels` brings them back on the vertical one only.
    //
    // The run starts at the first multiple of the step inside the box rather
    // than at `yMin`, so every labeled value is a whole number of steps away
    // from zero — the baseline the bars are measured from. Anchoring at `yMin`
    // instead would label a box running from 10 to 95 at 10, 30, 50, 70, 90,
    // every one of them offset from that baseline by half a step. (PreFigure
    // draws no label at zero itself, since that is where the two axes cross.)
    const step = geometry.tickStep;
    const firstTick = tickAtOrBeyond(yMin, step, 1);
    const lastTick = tickAtOrBeyond(yMax, step, -1);
    const vlabels = `(${formatNumber(firstTick)},${formatNumber(step)},${formatNumber(lastTick)})`;

    const [baseBottom, baseRight, baseTop] = CHART_MARGINS_BOTTOM_RIGHT_TOP;

    // Settled before the margins, because a legend drawn outside the plot is
    // held by one of them. Its size does not depend on the plot's, so there is
    // no loop here: the labels decide the legend, the legend decides the
    // margin, the margin decides the drawing area.
    //
    // A series earns a legend entry by having both a label and a mark for the
    // swatch to be read off, so the test is over the geometry rather than over
    // the handles, which are not assigned until the bars are built below.
    const seriesWithABar = new Set(geometry.bars.map((bar) => bar.seriesIndex));
    const legendLabels = geometry.series
        .map(({ label }, seriesIndex) =>
            seriesWithABar.has(seriesIndex) ? label : "",
        )
        .filter((label) => label !== "");
    const legendDrawn = showLegend && legendLabels.length > 0;
    const placement =
        LEGEND_PLACEMENTS[legendPosition] ?? LEGEND_PLACEMENTS.outsideright;
    const legendSize = estimateLegendSize(legendLabels);
    const legendOutside = legendDrawn && "side" in placement;

    // Annotated, since the base margins are literal types off an `as const`
    // tuple and these are widened past them.
    let wantedRight: number = baseRight;
    let wantedBottom: number = baseBottom;
    const legendOnRight = legendOutside && placement.side === "right";
    const legendOnBottom = legendOutside && placement.side === "bottom";
    if (legendOnRight) {
        // PreFigure's offset, then the box, then a gap to the edge of the
        // picture. `baseRight` is *not* added underneath: it is there to hold
        // the half of the outermost axis label that overhangs the corner, and
        // the legend already reserves more than that past the same edge, so
        // adding the two left 20px of every legended chart's width empty.
        // Floored at it anyway, in case the two ever cross.
        wantedRight = Math.max(
            baseRight,
            LEGEND_ANCHOR_OFFSET + legendSize.width + LEGEND_OUTSIDE_GAP,
        );
    } else if (legendOnBottom) {
        // The band the horizontal axis' own labels occupy, then PreFigure's
        // offset, then the box, then a gap to the edge of the picture. Unlike
        // the right, `baseBottom` is a band the legend sits *below* rather than
        // an overhang it covers, so here the two really do add.
        wantedBottom =
            baseBottom +
            LEGEND_ANCHOR_OFFSET +
            legendSize.height +
            LEGEND_OUTSIDE_GAP;
    }

    // No `titleHasLatex` beside the axis labels' flags: a `<title>`'s text
    // arrives already flattened, so `<title><m>\mu</m> counts</title>` reaches
    // here as the string `μ counts` with no LaTeX left in it to typeset, where
    // `<xLabel><m>\mu</m></xLabel>` arrives as `\mu` and is marked up.
    const titleText = labelMarkup({ label: title, labelHasLatex: false });

    // The title is drawn above the frame, so the top margin has to grow to hold
    // it — the margins are what PreFigure adds outside `dimensions`, so a title
    // drawn into a margin sized for the corner of an axis label would be cut
    // off by the edge of the picture.
    const wantedTop = baseTop + (titleText ? TITLE_MARGIN : 0);

    // The left margin has to know the labels before the box is sized, since it
    // is what stops the widest of them being clipped — the labels of
    // `<chart type="bar">1e308</chart>` run to 411 characters and ask for 3713
    // pixels of it.
    const wantedLeft =
        AXIS_LABEL_MARGIN_BASE +
        AXIS_LABEL_MARGIN_PER_CHARACTER *
            widestTickLabelLength(firstTick, lastTick, step);

    // Both pairs are then fitted to the frame, which leaves each of them at
    // most half of it. That is what makes the two dimensions below exact: the
    // margins are drawn around `dimensions`, so a diagram whose margins do not
    // fit is larger than the frame holding it and the renderer clips the
    // difference — which is what a `size="tiny"` chart did, and what an
    // `aspectRatio` of a million does from the other direction, by asking for a
    // frame a fraction of a pixel tall.
    const [marginLeft, marginRight] = fitMargins(
        widthPx,
        wantedLeft,
        wantedRight,
        legendOnRight ? LEGEND_MARGIN_BUDGET : undefined,
    );
    const [marginBottom, marginTop] = fitMargins(
        heightPx,
        wantedBottom,
        wantedTop,
        legendOnBottom ? LEGEND_MARGIN_BUDGET : undefined,
    );

    // Positive without being floored at a pixel, since fitting the margins
    // already leaves at least half the frame to draw in. Flooring at 1 was what
    // made a fraction-of-a-pixel frame hold a 1px drawing.
    const innerWidth = widthPx - marginLeft - marginRight;
    const innerHeight = heightPx - marginBottom - marginTop;
    const dimensions = `(${formatNumber(innerWidth)},${formatNumber(innerHeight)})`;
    const margins = `[${marginLeft},${marginBottom},${marginRight},${marginTop}]`;

    const strokeAttr = darkModeAxisStrokeAttr(darkMode);

    const axisLabelElements = [];
    const xLabelText = labelMarkup({
        label: xLabel,
        labelHasLatex: xLabelHasLatex,
    });
    if (xLabelText) {
        axisLabelElements.push(
            `<xlabel alignment="nw" ${THEME_AWARE_LABEL_COLOR_ATTR}>${xLabelText}</xlabel>`,
        );
    }
    const yLabelText = labelMarkup({
        label: yLabel,
        labelHasLatex: yLabelHasLatex,
    });
    if (yLabelText) {
        axisLabelElements.push(
            `<ylabel alignment="se" ${THEME_AWARE_LABEL_COLOR_ATTR}>${yLabelText}</ylabel>`,
        );
    }

    const axesInner = axisLabelElements.join("");
    const axesAttrs = `axes="all" decorations="no" vlabels="${escapeXml(vlabels)}"${strokeAttr}`;
    const axesElement = axesInner
        ? `<axes ${axesAttrs}>${axesInner}</axes>`
        : `<axes ${axesAttrs} />`;

    const elements: string[] = [];

    // The categorical axis: arbitrary text at an arbitrary position, which is
    // the one thing `hlabels` cannot express. Driven by the slots rather than
    // the bars, so a value with no bar still has its category on the axis —
    // otherwise the gap would read as a missing category rather than as a
    // missing value.
    for (const slot of geometry.slots) {
        elements.push(
            `<tick-mark axis="horizontal" location="${formatNumber(slot.center)}"${strokeAttr} ${THEME_AWARE_LABEL_COLOR_ATTR}>${escapeXml(slot.label)}</tick-mark>`,
        );
    }

    // One series is drawn as it always was, straight into the diagram, and its
    // bars are annotated straight under the figure. Several are each wrapped in
    // a `<group>`, which is what gives a screen reader a level to stop at
    // between the chart and its bars — the reason `<group>` exists in PreFigure
    // at all — and gives the legend an element per series to key off.
    const groupSeries = geometry.series.length > 1;

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

    const annotationElements: string[] = [];
    geometry.series.forEach((oneSeries, seriesIndex) => {
        if (!groupSeries) {
            elements.push(...seriesElements[seriesIndex]);
            annotationElements.push(...seriesAnnotations[seriesIndex]);
            return;
        }

        const groupHandle = `series-${seriesIndex + 1}`;
        elements.push(
            `<group at="${escapeXml(groupHandle)}">${seriesElements[seriesIndex].join("")}</group>`,
        );
        // Named by the series where the author gave it a name, and by the
        // fallback the chart worked out where they did not. A screen reader
        // stopping on this level has to be told which group it has reached,
        // and a bare position number would be indistinguishable from the
        // values and categories announced on the levels either side of it — so
        // the fallback is a localized phrase, built where the document's
        // language is known rather than invented here.
        const seriesName =
            oneSeries.label ||
            seriesRendering[seriesIndex]?.unlabeledName ||
            `${seriesIndex + 1}`;
        annotationElements.push(
            `<annotation ref="${escapeXml(groupHandle)}" text="${escapeXml(seriesName)}">${seriesAnnotations[seriesIndex].join("")}</annotation>`,
        );
    });

    // The legend keys off the bars themselves: PreFigure reads the referenced
    // element's `fill` and draws a swatch of it, so a series' color is named in
    // the legend by the same attribute that draws it and the two cannot drift
    // apart. A series with no bar has nothing to point at and so no entry.
    //
    // `opacity="0"` makes the box behind the legend transparent. PreFigure
    // fills it white with no attribute to say otherwise (`legend.py`), which
    // reads as a hole punched in a chart drawn in dark mode; `stroke` does take
    // an attribute, so the box keeps an outline that follows the page's text
    // color in both themes.
    const legendItems = geometry.series
        .map((oneSeries, seriesIndex) => {
            const handle = seriesKeyHandles[seriesIndex];
            const text = labelMarkup({
                label: oneSeries.label,
                labelHasLatex: seriesRendering[seriesIndex]?.labelHasLatex,
            });
            if (handle === null || !text) {
                return null;
            }
            return `<item ref="${escapeXml(handle)}" ${THEME_AWARE_LABEL_COLOR_ATTR}>${text}</item>`;
        })
        .filter((item) => item !== null);

    let legendElement = "";
    if (legendDrawn && legendItems.length > 0) {
        // PreFigure anchors a legend in *data* coordinates and offers no offset
        // of its own (`legend.py` reads only anchor, alignment, scale,
        // vertical-skip, stroke and opacity), so a legend that belongs in a
        // margin is anchored at a coordinate outside the box and left to the
        // same linear transform as everything else.
        // Pixels to data units, on each axis. Guarded, because the span of a
        // chart of `-1e308` and `1e308` is `Infinity`: an offset scaled by that
        // is `-Infinity`, which `formatNumber` writes as `null`, and
        // `anchor="(1.5,null)"` is XML PreFigure cannot read. A zero scale
        // leaves the anchor on the corner it was measured from, which is
        // finite and drawable, and a chart spanning the whole double range has
        // no legible placement to lose.
        const finiteScale = (span: number, pixels: number) => {
            const scale = span / (pixels || 1);
            return Number.isFinite(scale) ? scale : 0;
        };
        const unitsPerPixelX = finiteScale(xMax - xMin, innerWidth);
        const unitsPerPixelY = finiteScale(yMax - yMin, innerHeight);

        let anchorX;
        let anchorY;
        if (!("side" in placement)) {
            anchorX = placement.corner.endsWith("Right") ? xMax : xMin;
            anchorY = placement.corner.startsWith("top") ? yMax : yMin;
        } else if (placement.side === "right") {
            // `se` puts the box below and right of the anchor, so the corner of
            // the box lands in the margin just past the plot's right edge.
            //
            // Then pulled back inside the picture. The margin was reserved to
            // hold the box, but `fitMargins` caps it, so a small chart with
            // long labels gets a margin narrower than what it was reserved
            // from — and the box, which does not shrink with it, was drawn
            // past the edge of the SVG and clipped: `size="small"` with two
            // thirty-character labels put the legend's right edge at 360px in
            // a 255px picture. Height is not reserved at all, so a chart of
            // enough labeled series ran off the bottom the same way.
            //
            // Overlapping the plot is the lesser fault: a legend over a bar is
            // still readable and still says what the colors mean, and it is
            // what the inside placements do by design. A legend outside the
            // picture is not there at all.
            const overhangRight =
                LEGEND_ANCHOR_OFFSET + legendSize.width + LEGEND_OUTSIDE_GAP;
            const overhangBottom =
                LEGEND_ANCHOR_OFFSET + legendSize.height + LEGEND_OUTSIDE_GAP;
            // Pulled only as far as the picture's own edge. A box wider or
            // taller than the whole picture cannot be placed inside it by
            // moving it, so it keeps overflowing the side it always
            // overflowed; dragging it further would only move the clipped part
            // to the other end.
            const pullLeft = Math.min(
                Math.max(overhangRight - marginRight, 0),
                Math.max(
                    marginLeft +
                        innerWidth +
                        LEGEND_ANCHOR_OFFSET -
                        LEGEND_OUTSIDE_GAP,
                    0,
                ),
            );
            const pullUp = Math.min(
                Math.max(overhangBottom - (innerHeight + marginBottom), 0),
                marginTop,
            );
            anchorX = xMax - pullLeft * unitsPerPixelX;
            anchorY = yMax + pullUp * unitsPerPixelY;
        } else {
            // Below the plot and centered. Placed from the *bottom* of the
            // picture rather than a fixed distance under the axis, so the gap
            // to the edge is the one that was reserved however the margin came
            // out — measuring down from the axis instead left the box flush
            // against the edge, and 1.6px past it, whenever `fitMargins` had to
            // shrink what was asked for.
            //
            // Never above the band the horizontal axis' own labels occupy,
            // which is what the floor is for: a margin too small to hold the
            // legend should let it run off the bottom rather than draw it over
            // the category names.
            const belowAxis = Math.max(
                marginBottom -
                    LEGEND_OUTSIDE_GAP -
                    legendSize.height -
                    LEGEND_ANCHOR_OFFSET,
                baseBottom,
            );
            anchorX = (xMin + xMax) / 2;
            anchorY = yMin - belowAxis * unitsPerPixelY;
        }
        const anchor = `(${formatNumber(anchorX)},${formatNumber(anchorY)})`;
        legendElement = `<legend anchor="${escapeXml(anchor)}" alignment="${placement.alignment}" opacity="0" stroke="currentColor">${legendItems.join("")}</legend>`;
    }

    // Centered above the drawing, in the margin widened for it. A `<label>`
    // rather than PreFigure's `<caption>`, which reaches tactile output only
    // and would leave a visual chart untitled — so the caption is emitted as
    // well as the label rather than instead of it, and a title is a title in
    // every format the diagram is produced in.
    let titleElement = "";
    let captionElement = "";
    if (titleText) {
        const anchor = `(${formatNumber((xMin + xMax) / 2)},${formatNumber(yMax)})`;
        titleElement = `<label anchor="${escapeXml(anchor)}" alignment="north" scale="${TITLE_SCALE}" ${THEME_AWARE_LABEL_COLOR_ATTR}>${titleText}</label>`;
        captionElement = `<caption>${titleText}</caption>`;
    }

    // A figure-level annotation is what diagcess navigates into; without one
    // the per-bar annotations have no parent to hang from. Its text is the
    // author's `<shortDescription>` when there is one — nothing is invented
    // here, so there is no generated English to translate.
    const figureAnnotationText = shortDescription
        ? ` text="${escapeXml(shortDescription)}"`
        : "";
    const annotationsElement = `<annotations><annotation ref="figure"${figureAnnotationText}>${annotationElements.join("")}</annotation></annotations>`;

    const xml = `<diagram dimensions="${escapeXml(dimensions)}" margins="${escapeXml(margins)}"><coordinates bbox="${escapeXml(bbox)}">${axesElement}${elements.join("")}${valueLabelElements.join("")}${titleElement}${legendElement}</coordinates>${captionElement}${annotationsElement}</diagram>`;

    return { xml, diagnostics };
}
