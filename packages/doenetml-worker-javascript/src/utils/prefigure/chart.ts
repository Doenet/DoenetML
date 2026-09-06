import { darkModeAxisStrokeAttr, escapeXml, formatNumber } from "./common";
import { labelMarkup, THEME_AWARE_LABEL_COLOR_ATTR } from "./label";
import { styleAttributes } from "./style";
import type { DiagnosticRecord } from "@doenet/utils";

/**
 * PreFigure assembly for `<barChart>`.
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
 * already emit it — but it is put to a new use here: the optional value
 * printed at the end of each bar.
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
 * How wide the vertical axis' numbers will be drawn, in characters.
 *
 * PreFigure formats a tick with thousands separators — 1500 is drawn as
 * `1,500` — so the separators are counted here too. Only the two ends of the
 * run are measured: a label between them cannot be longer than both, since the
 * run is monotonic and a negative end is the longest of its side.
 */
function widestTickLabelLength(firstTick: number, lastTick: number): number {
    const asDrawn = (value: number) =>
        Number.isFinite(value) ? value.toLocaleString("en-US").length : 1;
    return Math.max(asDrawn(firstTick), asDrawn(lastTick), 1);
}

/** The bar geometry a chart renders, in data coordinates. */
export type BarGeometry = {
    /** 1-based position along the categorical axis. */
    center: number;
    label: string;
    value: number;
    lowerLeft: [number, number];
    dimensions: [number, number];
};

export type BarChartGeometry = {
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
 * The bar rectangles and bounding box for a list of values.
 *
 * Bars sit at x = 1, 2, … n and are `barWidth` of their one-unit slot wide, so
 * the gap between them is what is left over. The box starts at x = 0 so the
 * vertical axis has somewhere to be drawn, and ends half a unit past the last
 * bar so the outermost bars are not flush against the frame.
 *
 * `yMax` is the author's when they gave one; otherwise it is rounded up to the
 * next tick so the tallest bar does not touch the top of the box. An empty
 * chart, or one whose values are all zero, still gets a box one tick tall —
 * otherwise the axis would collapse and the chart would look broken rather
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
    values,
    labels,
    barWidth,
    yMinAttr,
    yMaxAttr,
}: {
    values: number[];
    labels: string[];
    barWidth: number;
    yMinAttr: number | null;
    yMaxAttr: number | null;
}): BarChartGeometry {
    // A value that is not a finite number has no bar. Drawing it as zero would
    // put a real datum on the chart that the data does not contain, and
    // `barValues` would still report the `NaN` — so the picture and the public
    // property would disagree. The slot is kept, so the remaining bars stay
    // under their own categories, and it is simply empty.
    const drawable = values.map((value) => Number.isFinite(value));

    // Reduced rather than spread: `Math.max(...values)` throws once the list is
    // longer than the engine's argument limit, which would fail a large chart
    // before any of it could be drawn.
    let largest = 0;
    let smallest = 0;
    let anyDrawable = false;
    for (const [ind, value] of values.entries()) {
        if (!drawable[ind]) {
            continue;
        }
        if (!anyDrawable) {
            largest = value;
            smallest = value;
            anyDrawable = true;
        } else {
            largest = Math.max(largest, value);
            smallest = Math.min(smallest, value);
        }
    }

    // The bars are measured from zero, so zero is always in view even when
    // every value is on one side of it.
    const reachAbove = Math.max(0, largest);
    const reachBelow = Math.min(0, smallest);

    // Whole-number values get whole-number ticks; anything else — proportions,
    // averages — is free to be labeled in fractions.
    const wholeValues = values.every(
        (value, ind) => !drawable[ind] || Number.isInteger(value),
    );
    const minStep = wholeValues ? 1 : 0;

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

    const halfWidth = barWidth / 2;

    const bars = values.flatMap((value, ind) => {
        if (!drawable[ind]) {
            return [];
        }
        const center = ind + 1;
        return [
            {
                center,
                label: labels[ind] ?? String(center),
                value,
                lowerLeft: [center - halfWidth, Math.min(0, value)] as [
                    number,
                    number,
                ],
                dimensions: [barWidth, Math.abs(value)] as [number, number],
            },
        ];
    });

    const slots = values.map((_value, ind) => ({
        center: ind + 1,
        label: labels[ind] ?? String(ind + 1),
    }));

    return {
        bars,
        slots,
        // Every slot still counts toward the width, drawn or not, so a chart
        // with a gap in it keeps its remaining bars under their categories.
        bounds: [0, yMin, values.length + 0.5, yMax],
        tickStep,
        undrawnValues: drawable.filter((canDraw) => !canDraw).length,
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
    widthPx,
    heightPx,
    xLabel,
    xLabelHasLatex,
    yLabel,
    yLabelHasLatex,
    selectedStyle,
    displayValues,
    shortDescription,
    darkMode = false,
}: {
    geometry: BarChartGeometry;
    widthPx: number;
    heightPx: number;
    xLabel?: string;
    xLabelHasLatex?: boolean;
    yLabel?: string;
    yLabelHasLatex?: boolean;
    selectedStyle: Record<string, unknown> | undefined;
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

    const [marginBottom, marginRight, marginTop] =
        CHART_MARGINS_BOTTOM_RIGHT_TOP;

    // The left margin has to know the labels before the box is sized, since it
    // is what stops the widest of them being clipped.
    const marginLeft =
        AXIS_LABEL_MARGIN_BASE +
        AXIS_LABEL_MARGIN_PER_CHARACTER *
            widestTickLabelLength(firstTick, lastTick);
    // The margins are added around `dimensions`, so shrink it by them to keep
    // the chart the size the frame reserved for it. A chart small enough for
    // the margins to swallow it keeps a positive inner size rather than
    // collapsing.
    const innerWidth = Math.max(widthPx - marginLeft - marginRight, 1);
    const innerHeight = Math.max(heightPx - marginBottom - marginTop, 1);
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

    const barAttrs = styleAttributes({
        selectedStyle,
        diagnostics,
        warningPrefix: "<barChart>",
    }).join(" ");

    const elements: string[] = [];
    const annotationElements: string[] = [];

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

    for (const bar of geometry.bars) {
        const handle = `bar-${bar.center}`;
        const lowerLeft = `(${formatNumber(bar.lowerLeft[0])},${formatNumber(bar.lowerLeft[1])})`;
        const barDimensions = `(${formatNumber(bar.dimensions[0])},${formatNumber(bar.dimensions[1])})`;

        elements.push(
            `<rectangle at="${escapeXml(handle)}" lower-left="${escapeXml(lowerLeft)}" dimensions="${escapeXml(barDimensions)}"${barAttrs ? ` ${barAttrs}` : ""} />`,
        );

        if (displayValues) {
            // At the far end of the bar, outside it: above a bar that grows up
            // and below one that hangs down. Anchoring every label at zero
            // instead would print a negative bar's value on the horizontal
            // axis, a whole bar away from the end it belongs to.
            const alignment = bar.value < 0 ? "south" : "north";
            const anchor = `(${formatNumber(bar.center)},${formatNumber(bar.value)})`;
            elements.push(
                `<label anchor="${escapeXml(anchor)}" alignment="${alignment}" ${THEME_AWARE_LABEL_COLOR_ATTR}>${escapeXml(formatNumber(bar.value) ?? "")}</label>`,
            );
        }

        annotationElements.push(
            `<annotation ref="${escapeXml(handle)}" text="${escapeXml(`${bar.label}: ${formatNumber(bar.value)}`)}" />`,
        );
    }

    // A figure-level annotation is what diagcess navigates into; without one
    // the per-bar annotations have no parent to hang from. Its text is the
    // author's `<shortDescription>` when there is one — nothing is invented
    // here, so there is no generated English to translate.
    const figureAnnotationText = shortDescription
        ? ` text="${escapeXml(shortDescription)}"`
        : "";
    const annotationsElement = `<annotations><annotation ref="figure"${figureAnnotationText}>${annotationElements.join("")}</annotation></annotations>`;

    const xml = `<diagram dimensions="${escapeXml(dimensions)}" margins="${escapeXml(margins)}"><coordinates bbox="${escapeXml(bbox)}">${axesElement}${elements.join("")}</coordinates>${annotationsElement}</diagram>`;

    return { xml, diagnostics };
}
