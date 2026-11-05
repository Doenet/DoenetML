/**
 * Everything a chart is drawn *in*: the margins, the axes and their labels, the
 * legend, the title and the annotation tree.
 *
 * The frame is the same whichever marks go inside it, which is why it lives
 * apart from them. `assembleChartDiagram` is the whole picture for a type with
 * axes; a pie has no axes and assembles its own frame out of the legend, title
 * and annotation helpers here.
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
 * already emit it — but it is put to two new uses in this folder: the optional
 * value printed beside each mark, and the chart's title, drawn above the frame
 * at a `scale` the axis numbers do not use.
 *
 * `<group>` is shared with `components/curve.ts`, which wraps a multi-piece
 * curve in one. A chart of more than one series wraps each of them in a
 * `<group>`, which is what gives a screen reader a level to stop at between the
 * chart and its marks — grouping components to be annotated together is what
 * `group.py` exists for.
 *
 * `<legend>` is emitted here and nowhere else in this folder. A legend's
 * background box is filled white by `legend.py` with no attribute to say
 * otherwise, which reads as a hole punched in a chart drawn in dark mode. Its
 * `opacity` and `stroke` *are* attributes, so the box is made transparent and
 * given an outline that follows the page's text color instead.
 *
 * The axes sit on or near the edge of the bounding box, so their labels would
 * be drawn outside the drawing area and clipped. `<diagram margins>` is the
 * fix: PreFigure adds the margins *outside* `dimensions`, so the inner size is
 * shrunk by them to keep the rendered chart the size the author actually asked
 * for.
 */

import { escapeXml, formatNumber, darkModeAxisStrokeAttr } from "../common";
import { labelMarkup, THEME_AWARE_LABEL_COLOR_ATTR } from "../label";
import { midpoint, snapNumber, tickAtOrBeyond } from "./scale";

/**
 * Room reserved outside the plotting area, in pixels, as
 * `[bottom, right, top]`: the bottom for the category names, and the top and
 * right for the half of the outermost label that falls past the corner it is
 * drawn at.
 *
 * The left margin is not here because it is the one that depends on the data,
 * and it has to: it was fixed at 46px on the assumption that axis numbers run
 * to a handful of digits, and a chart of counts in the thousands clipped the
 * leading digit off `1,500` — an entirely ordinary sample size, not an exotic
 * one. PreFigure lays the text out in the worker and nothing here can ask how
 * wide it came out, so the width is estimated from the longest label the axis
 * will carry.
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
 * One line of an axis' *name* — `<xLabel>` or `<yLabel>` — drawn at PreFigure's
 * default size. Measured: the laid-out box of a single line of that text comes
 * back 14px tall, and the four pixels on top of it are the gap that keeps the
 * second line clear of the first.
 */
export const AXIS_LABEL_LINE_HEIGHT = 18;

/**
 * Two margins on one axis, scaled to leave the drawing at least half the frame.
 *
 * Returned as written whenever they already fit. When they do not, both shrink
 * by the same factor rather than one absorbing the whole reduction, so a chart
 * too small for its margins keeps their proportions instead of losing an axis
 * to the side that happened to be listed second.
 */
export function fitMargins(
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

/** How a series is drawn and named, alongside the geometry of its marks. */
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
export const LEGEND_PLACEMENTS = {
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
function estimateLegendSize(
    labels: string[],
    keyWidth: number,
): {
    width: number;
    height: number;
} {
    const widest = labels.reduce(
        (widest, label) => Math.max(widest, estimateTextWidth(label)),
        0,
    );
    return {
        width: widest + keyWidth,
        height: LEGEND_BOX_PADDING + labels.length * LEGEND_ITEM_HEIGHT,
    };
}

/**
 * Roughly how wide a string is drawn at PreFigure's 14px sans-serif, in pixels.
 *
 * Classes rather than a per-character table, since the only thing asked of this
 * is a margin wide enough: it has to come out over rather than exact, and by as
 * little as it can manage. Every printable ASCII character was measured from a
 * real render — a legend of six copies of it, less the fixed furniture, divided
 * by six — and each class is set just above the widest character in it. The
 * tightest margin is 0.21px (`O` and `Q`), the widest label surplus about 26px
 * on fifteen characters, and no ASCII character is reserved short.
 *
 * The classes are not the ones a reader would guess, which is why they are
 * measured: `%` is 11.9px and `&` 10.3px, wider than any lowercase letter,
 * while `|` is 7.7px rather than the hairline its shape suggests. All three
 * were previously reserved at the lowercase width, and a legend labeled
 * `%%%%%%` was drawn 12.6px past the right edge of the picture. Capitals span
 * 7.4px (`F`) to 11.0px (`O`), so treating them alike wasted 20px on an
 * all-capitals label.
 *
 * Text outside ASCII falls to the default and can be reserved short. A CJK
 * ideograph is about a full em — some 14px here — so a Chinese or Japanese
 * label is under-reserved from two characters up, which is why the ranges
 * below are given the widest class. That much cannot be checked against the
 * build service: it has no font for those glyphs and draws every one of them
 * at a uniform 8.4px, so the figure comes from typography rather than from a
 * measurement, unlike everything else here.
 */
export function estimateTextWidth(text: string): number {
    let width = 0;
    for (const character of text) {
        if (character === " ") {
            width += 4.5;
        } else if (NARROW_CHARACTERS.includes(character)) {
            width += 5.5;
        } else if (SEMI_NARROW_CHARACTERS.includes(character)) {
            width += 7;
        } else if (
            WIDE_CHARACTERS.includes(character) ||
            character.codePointAt(0)! >= FULL_WIDTH_FIRST_CODE_POINT
        ) {
            width += 13.6;
        } else if (BROAD_CHARACTERS.includes(character)) {
            width += 11.2;
        } else {
            width += 9.5;
        }
    }
    return width;
}

/** Measured at 3.3 to 5.0px: `'` is the narrowest thing drawn. */
const NARROW_CHARACTERS = "ijlIJ'.,:;!()-[]\u2019";

/** 5.0 to 6.3px. */
const SEMI_NARROW_CHARACTERS = 'ftr/\\{}"_?\u2013';

/** 11.3 to 13.3px, the widest glyphs there are. */
const WIDE_CHARACTERS = "mwMW@%";

/** 10.2 to 11.0px: the round capitals, and `&`. */
const BROAD_CHARACTERS = "GDUHNOQ&";

/**
 * Where the classes above stop describing the text.
 *
 * Hangul begins at U+1100 and CJK, kana and the emoji planes follow, all of
 * them about an em wide. Latin, Greek and Cyrillic sit below it and are close
 * enough to the measured classes to use them.
 */
const FULL_WIDTH_FIRST_CODE_POINT = 0x1100;

/**
 * The key and the three paddings `legend.py` puts around the labels, for a key
 * that is a swatch of fill — a bar or a point.
 */
export const LEGEND_SWATCH_KEY_WIDTH = 30;

/**
 * The same, for a key that is a line.
 *
 * PreFigure draws a line chart's key as a segment of the stroke rather than a
 * block of the fill, and a segment is longer than a swatch: measured against a
 * real render, the same label came back 56.894px wide in a bar chart's legend
 * and 70.894px in a line chart's. Reserving the swatch width for both is a
 * legend 14px wider than its margin, which is the margin's whole job to
 * prevent.
 */
export const LEGEND_LINE_KEY_WIDTH = 44;

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
export const LEGEND_OUTSIDE_GAP = 8;

/**
 * The offset `legend.py` puts between a legend's anchor and its box, in pixels.
 *
 * PreFigure computes it as `8 * (displacement ± 0.5)`, which comes to 4 for
 * every alignment this file uses. It has to be counted here because the margin
 * has to hold the box *and* the offset PreFigure will add to it — leaving it out
 * is what let an `outsideBottom` legend hang 1.6px past the bottom of the
 * picture.
 */
export const LEGEND_ANCHOR_OFFSET = 4;

/**
 * The most of one dimension the margins may take when something the author put
 * *outside* the plot is drawn there — a legend, or a pie's slice names.
 *
 * `fitMargins` normally leaves the drawing at least half the frame, which is
 * the right rule when the margins hold nothing but axis labels: those grow with
 * the numbers on the axis and shrinking them costs a digit at worst. A legend
 * and a name are different: both are a fixed number of pixels whatever the
 * chart's size, so on a small chart the honest choice is a smaller drawing
 * rather than text scaled into the frame's edge or clipped by it. The author
 * asked for it outside; this is what that costs.
 */
export const OUTSIDE_MARGIN_BUDGET = 2 / 3;

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
export const TITLE_MARGIN = 14 * TITLE_SCALE + 10;

/** A run of labeled values on one axis. */
export type AxisTicks = { first: number; last: number; step: number };

/**
 * The run of labeled values inside `min`…`max`, a whole number of steps from
 * zero.
 *
 * Anchoring at `min` instead would label a box running from 10 to 95 at 10, 30,
 * 50, 70, 90, every one of them offset from zero by half a step — and zero is
 * the baseline a bar chart's bars are measured from. (PreFigure draws no label
 * where the two axes cross.)
 */
export function axisTicks(min: number, max: number, step: number): AxisTicks {
    return {
        first: tickAtOrBeyond(min, step, 1),
        last: tickAtOrBeyond(max, step, -1),
        step,
    };
}

/** The `(start, step, end)` triple PreFigure's `hlabels`/`vlabels` take. */
function axisLabelsAttr({ first, last, step }: AxisTicks) {
    return `(${formatNumber(first)},${formatNumber(step)},${formatNumber(last)})`;
}

/** How wide the widest label on an axis will be drawn, in pixels. */
function axisLabelWidth(ticks: AxisTicks) {
    return (
        AXIS_LABEL_MARGIN_PER_CHARACTER *
        widestTickLabelLength(ticks.first, ticks.last, ticks.step)
    );
}

/** One line of a legend: a name, and the element its swatch is read off. */
export type LegendEntry = {
    label: string;
    labelHasLatex: boolean;
    /**
     * The handle of the element the swatch is built from, or null where there
     * is none — a series whose every value was undrawable, or a slice of no
     * sweep.
     */
    handle: string | null;
};

/**
 * What a legend will cost and where it will go, settled before the margins.
 *
 * Before, because a legend drawn outside the plot is held by one of them and
 * its size does not depend on the plot's: the entries decide the legend, the
 * legend decides the margin, the margin decides the drawing area. So there is
 * no loop to iterate here.
 */
type LegendPlan = {
    /** The entries that will actually be written, in order. */
    items: { label: string; markup: string; handle: string }[];
    /** Whether a legend is drawn at all. */
    drawn: boolean;
    placement: (typeof LEGEND_PLACEMENTS)[keyof typeof LEGEND_PLACEMENTS];
    size: { width: number; height: number };
    /** In a margin widened to hold it, rather than in a corner of the plot. */
    onRight: boolean;
    onBottom: boolean;
};

/**
 * Which legend entries survive, and how much room they will need.
 *
 * An entry needs both a name and something drawn to point at, for the reason
 * `chartLegendHasItems` gives — and the two questions are asked here together
 * so that the box is measured against exactly the entries that go in it.
 */
export function planLegend({
    entries,
    showLegend,
    legendPosition,
    legendKeyWidth,
}: {
    entries: LegendEntry[];
    showLegend: boolean;
    legendPosition: keyof typeof LEGEND_PLACEMENTS;
    /** How wide the key beside each label is drawn. */
    legendKeyWidth: number;
}): LegendPlan {
    const items = entries.flatMap((entry) => {
        const markup = labelMarkup({
            label: entry.label,
            labelHasLatex: entry.labelHasLatex,
        });
        if (entry.handle === null || markup === null) {
            return [];
        }
        return [{ label: entry.label, markup, handle: entry.handle }];
    });

    const drawn = showLegend && items.length > 0;
    const placement =
        LEGEND_PLACEMENTS[legendPosition] ?? LEGEND_PLACEMENTS.outsideright;
    const outside = drawn && "side" in placement;

    return {
        items,
        drawn,
        placement,
        size: estimateLegendSize(
            items.map((item) => item.label),
            legendKeyWidth,
        ),
        onRight: outside && "side" in placement && placement.side === "right",
        onBottom: outside && "side" in placement && placement.side === "bottom",
    };
}

/** The frame a legend or a title is placed in, once the margins are settled. */
type ChartFrame = {
    marginLeft: number;
    marginRight: number;
    marginBottom: number;
    marginTop: number;
    innerWidth: number;
    innerHeight: number;
    /** Data units per pixel, for everything anchored by a distance on screen. */
    unitsPerPixelX: number;
    unitsPerPixelY: number;
};

/**
 * The `<legend>` element, anchored where the plan and the frame put it.
 *
 * PreFigure anchors a legend in *data* coordinates and takes no offset
 * attribute — `legend.py` reads only anchor, alignment, scale, vertical-skip,
 * stroke and opacity. So a legend that belongs in a margin is anchored at a
 * coordinate outside the box and left to the same linear transform as
 * everything else. It does apply an offset of its own on top of that, which
 * `LEGEND_ANCHOR_OFFSET` accounts for.
 *
 * `opacity="0"` makes the box behind it transparent. PreFigure fills it white
 * with no attribute to say otherwise, which reads as a hole punched in a chart
 * drawn in dark mode; `stroke` does take an attribute, so the box keeps an
 * outline that follows the page's text color in both themes.
 *
 * `rightOfPlot` is how far past the plot's right edge the vertical axis'
 * numbers reach, and so how far a legend placed in that same margin has to
 * start beyond it. Zero on a chart whose numbers are on the left, and on one
 * with no axes at all.
 */
export function legendMarkup({
    plan,
    bounds,
    frame,
    rightOfPlot,
}: {
    plan: LegendPlan;
    bounds: [number, number, number, number];
    frame: ChartFrame;
    rightOfPlot: number;
}): string {
    if (!plan.drawn) {
        return "";
    }

    const [xMin, yMin, xMax, yMax] = bounds;
    const { placement } = plan;
    const {
        marginLeft,
        marginRight,
        marginBottom,
        marginTop,
        innerWidth,
        innerHeight,
        unitsPerPixelX,
        unitsPerPixelY,
    } = frame;

    let anchorX;
    let anchorY;
    if (!("side" in placement)) {
        anchorX = placement.corner.endsWith("Right") ? xMax : xMin;
        anchorY = placement.corner.startsWith("top") ? yMax : yMin;
    } else if (placement.side === "right") {
        // `se` puts the box below and right of the anchor, so the corner of
        // the box lands in the margin just past the plot's right edge —
        // past the vertical axis' numbers as well, on a chart drawn
        // entirely to the left of zero, where PreFigure puts them in that
        // same margin.
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
            rightOfPlot +
            LEGEND_ANCHOR_OFFSET +
            plan.size.width +
            LEGEND_OUTSIDE_GAP;
        const overhangBottom =
            LEGEND_ANCHOR_OFFSET + plan.size.height + LEGEND_OUTSIDE_GAP;
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
        anchorX = xMax + (rightOfPlot - pullLeft) * unitsPerPixelX;
        anchorY = yMax + pullUp * unitsPerPixelY;
    } else {
        // Below the plot and centered, placed from the *bottom* of the
        // picture rather than a fixed distance under the axis: the gap to
        // the edge is then the one that was reserved, however the margin
        // came out. Measuring down from the axis instead left the box
        // flush against the edge, and 1.6px past it, whenever `fitMargins`
        // had to shrink what was asked for.
        //
        // The floor is the top of the picture, for the reason the right-hand
        // placement pulls its box back inside: `fitMargins` caps the
        // margin, the box does not shrink with it, and a floor at the band
        // the category names occupy is what let the legend run off the
        // bottom of the picture instead — a `size="small"` chart was
        // outside from four named series, and outside by 70px at eight.
        // Rising over the category names is the lesser fault, and it is
        // what the other outside placement already chooses.
        //
        // `fitMargins` only ever shrinks, so the first term is at most the
        // band the axis labels were reserved, and equals it whenever the
        // margin was granted in full: an uncrowded chart is placed exactly
        // where it was before.
        const belowAxis = Math.max(
            marginBottom -
                LEGEND_OUTSIDE_GAP -
                plan.size.height -
                LEGEND_ANCHOR_OFFSET,
            -(marginTop + innerHeight),
        );
        anchorX = midpoint(xMin, xMax);
        anchorY = yMin - belowAxis * unitsPerPixelY;
    }

    const anchor = `(${formatNumber(anchorX)},${formatNumber(anchorY)})`;
    const items = plan.items
        .map(
            (item) =>
                `<item ref="${escapeXml(item.handle)}" ${THEME_AWARE_LABEL_COLOR_ATTR}>${item.markup}</item>`,
        )
        .join("");
    return `<legend anchor="${escapeXml(anchor)}" alignment="${placement.alignment}" opacity="0" stroke="currentColor">${items}</legend>`;
}

/**
 * The chart's title, drawn above the frame, and the caption beside it.
 *
 * A `<label>` rather than PreFigure's `<caption>` alone, which reaches tactile
 * output only and would leave a visual chart untitled — so the caption is
 * emitted as well as the label rather than instead of it, and a title is a
 * title in every format the diagram is produced in.
 *
 * `lift` raises it clear of anything else sharing the top margin, in pixels.
 * That is the horizontal axis' own labels on a chart drawn entirely below
 * zero, where PreFigure puts them up there, or a pie's slice names; both are
 * anchored to the top of the box and drawn upwards from it, so without the lift
 * they would be drawn over each other.
 *
 * `roomAbove` is the top margin as it was actually granted. The lift is asked
 * for against the band the other text wanted, and `fitMargins` may have given
 * less than that — so raising the title by the full band lifts it past the room
 * there is and off the top of the picture. A `size="small"` pie with a legend
 * below it, its values at the rim and a title drew that title's box seven and a
 * half pixels outside. Clamped, the title touches the text it was clearing
 * instead, which is the same trade every other crowded margin here makes.
 *
 * `TITLE_MARGIN` is six pixels more than the room a title needs — its box is
 * 19.6px tall and PreFigure moves a `north` label a further 4px past its
 * anchor, so 23.6 is enough — which is why a clamped title sits six pixels
 * below the edge rather than flush against it. Subtracting the measured 23.6
 * would buy at most two pixels of lift back, and only where a name pointing
 * due north fills the whole cap band.
 */
export function titleMarkup({
    titleText,
    bounds,
    lift,
    roomAbove,
    unitsPerPixelY,
}: {
    titleText: string | null;
    bounds: [number, number, number, number];
    lift: number;
    roomAbove: number;
    unitsPerPixelY: number;
}): { titleElement: string; captionElement: string } {
    if (!titleText) {
        return { titleElement: "", captionElement: "" };
    }

    const raised = Math.min(lift, Math.max(roomAbove - TITLE_MARGIN, 0));

    const [xMin, , xMax, yMax] = bounds;
    const anchor = `(${formatNumber(midpoint(xMin, xMax))},${formatNumber(
        yMax + raised * unitsPerPixelY,
    )})`;
    return {
        titleElement: `<label anchor="${escapeXml(anchor)}" alignment="north" scale="${TITLE_SCALE}" ${THEME_AWARE_LABEL_COLOR_ATTR}>${titleText}</label>`,
        captionElement: `<caption>${titleText}</caption>`,
    };
}

/**
 * The annotation tree a screen reader navigates.
 *
 * A figure-level annotation is what diagcess navigates into; without one the
 * per-mark annotations have no parent to hang from. Its text is the author's
 * `<shortDescription>` when there is one — nothing is invented here, so there
 * is no generated English to translate.
 */
export function figureAnnotations(
    shortDescription: string | undefined,
    annotationElements: string[],
): string {
    const figureAnnotationText = shortDescription
        ? ` text="${escapeXml(shortDescription)}"`
        : "";
    return `<annotations><annotation ref="figure"${figureAnnotationText}>${annotationElements.join("")}</annotation></annotations>`;
}

/**
 * Everything around the marks: the frame, the axes, the tick marks, the title,
 * the legend and the annotation tree.
 *
 * Shared because it is the same for every chart type — what differs between a
 * bar chart and a scatter plot is the marks, not the picture they are drawn
 * in. Each caller hands over its marks already grouped by series, and gets the
 * whole diagram back.
 */
export function assembleChartDiagram({
    bounds,
    yTicks,
    xTicks,
    slots,
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
    seriesLabels,
    seriesElements,
    seriesAnnotations,
    seriesKeyHandles,
    legendKeyWidth,
    markOverhang,
    overlayElements,
    shortDescription,
    darkMode,
}: {
    bounds: [number, number, number, number];
    yTicks: AxisTicks;
    /** Null when the horizontal axis carries category names instead of numbers. */
    xTicks: AxisTicks | null;
    /**
     * Null when the horizontal axis is numeric. `labelHasLatex` says the name
     * carries math to typeset rather than characters to print — true only of a
     * box chart, whose positions are named by a `<label>` that may hold an
     * `<m>`, where a chart of categories names them from `categories`, which is
     * a `textList` and so is text and nothing else.
     */
    slots: { center: number; label: string; labelHasLatex?: boolean }[] | null;
    widthPx: number;
    heightPx: number;
    xLabel?: string;
    xLabelHasLatex?: boolean;
    yLabel?: string;
    yLabelHasLatex?: boolean;
    title?: string;
    showLegend: boolean;
    legendPosition: keyof typeof LEGEND_PLACEMENTS;
    seriesRendering: ChartSeriesRendering[];
    seriesLabels: string[];
    seriesElements: string[][];
    seriesAnnotations: string[][];
    seriesKeyHandles: (string | null)[];
    /** How wide the key beside each legend label is drawn. */
    legendKeyWidth: number;
    /**
     * How far this chart's marks reach past the box, in pixels. Zero for bars,
     * which are drawn inside it and clipped to it.
     */
    markOverhang: number;
    /**
     * Drawn after every series, so nothing a later series draws can cover it.
     * A `displayValues` label sits at the end of its own mark, which under
     * `stacked` is where the next segment starts.
     */
    overlayElements: string[];
    shortDescription?: string;
    darkMode: boolean;
}): string {
    const [xMin, yMin, xMax, yMax] = bounds;
    const bbox = `(${formatNumber(xMin)},${formatNumber(yMin)},${formatNumber(xMax)},${formatNumber(yMax)})`;

    const [rawBottom, rawRight, rawTop] = CHART_MARGINS_BOTTOM_RIGHT_TOP;

    // Every side has to hold whatever the marks stick out by, since a marker
    // sits on the box rather than inside it.
    const baseBottom = rawBottom + markOverhang;
    const baseRight = rawRight + markOverhang;
    const baseTop = rawTop + markOverhang;

    // A series earns a legend entry by having both a label and a mark for the
    // swatch to be read off, which is exactly the series its caller gave a key
    // handle.
    const legend = planLegend({
        entries: seriesLabels.map((label, seriesIndex) => ({
            label,
            labelHasLatex: Boolean(seriesRendering[seriesIndex]?.labelHasLatex),
            handle: seriesKeyHandles[seriesIndex],
        })),
        showLegend,
        legendPosition,
        legendKeyWidth,
    });

    // Which side of the box each axis' labels land on, which is not always the
    // near one. `position_axes` (`axes.py`) keeps an axis against the frame the
    // data starts from while the data straddles zero or lies above it, and
    // moves it to the frame *past* the data when the data lies entirely at or
    // below zero: with `yMax` at or below zero the horizontal axis and its
    // labels go to the top of the box, and with `xMax` at or below zero the
    // vertical axis and its numbers go to the right. Reserving the near margin
    // for labels drawn against the far one is a margin holding nothing and a
    // drawing running past the edge of the picture — a scatter of negative `x`
    // had its whole vertical axis numbered outside the picture, and one of
    // negative values had the numbers on its horizontal axis cut in half by the
    // top edge.
    //
    // Both are reachable only where an axis is free of zero, so a bar chart
    // reaches neither on its own: its horizontal extent runs from zero to the
    // number of categories, and its vertical axis runs past zero to the data.
    // An author who writes an all-negative `yMin`/`yMax` pair on one reaches
    // the first, and is held by the same reservation.
    const xLabelsOnTop = yMax <= 0;
    const yLabelsOnRight = xMax <= 0;

    /** The band the vertical axis' numbers occupy, on whichever side. */
    const yLabelBand = AXIS_LABEL_MARGIN_BASE + axisLabelWidth(yTicks);
    /** The band the horizontal axis' numbers or category names occupy. */
    const xLabelBand = baseBottom;

    // Annotated, since the base margins are literal types off an `as const`
    // tuple and these are widened past them.
    // A number on the horizontal axis is centered on its tick, so the
    // outermost two hang half their width past the corners of the box. A
    // categorical axis has none, and its category names are drawn as tick
    // marks that PreFigure centers itself.
    const halfWidestXLabel = xTicks ? Math.ceil(axisLabelWidth(xTicks) / 2) : 0;

    /**
     * How far past the plot's right edge the vertical axis' numbers reach, and
     * so how far anything else placed in that margin has to start beyond it.
     */
    const rightOfPlot = yLabelsOnRight ? yLabelBand : 0;

    let wantedRight: number = Math.max(
        baseRight,
        halfWidestXLabel,
        rightOfPlot,
    );
    let wantedBottom: number = xLabelsOnTop ? baseTop : xLabelBand;
    if (legend.onRight) {
        // PreFigure's offset, then the box, then a gap to the edge of the
        // picture, all beyond whatever the axis numbers already took of the
        // same margin. `baseRight` is *not* added underneath: it is there to
        // hold the half of the outermost axis label that overhangs the corner,
        // and the legend already reserves more than that past the same edge, so
        // adding the two left 20px of every legended chart's width empty.
        // Floored at it anyway, in case the two ever cross.
        wantedRight = Math.max(
            wantedRight,
            rightOfPlot +
                LEGEND_ANCHOR_OFFSET +
                legend.size.width +
                LEGEND_OUTSIDE_GAP,
        );
    } else if (legend.onBottom) {
        // The band the horizontal axis' own labels occupy, then PreFigure's
        // offset, then the box, then a gap to the edge of the picture. Unlike
        // the right, that band is one the legend sits *below* rather than an
        // overhang it covers, so here the two really do add.
        wantedBottom +=
            LEGEND_ANCHOR_OFFSET + legend.size.height + LEGEND_OUTSIDE_GAP;
    }

    // No `titleHasLatex` beside the axis labels' flags: a `<title>`'s text
    // arrives already flattened, so `<title><m>\mu</m> counts</title>` reaches
    // here as the string `μ counts` with no LaTeX left in it to typeset, where
    // `<xLabel><m>\mu</m></xLabel>` arrives as `\mu` and is marked up.
    const titleText = labelMarkup({ label: title, labelHasLatex: false });

    // The title is drawn above the frame, so the top margin has to grow to hold
    // it — the margins are what PreFigure adds outside `dimensions`, so a title
    // drawn into a margin sized for the corner of an axis label would be cut
    // off by the edge of the picture. Above the horizontal axis' own labels
    // where those are up there too, which is why the band is the base rather
    // than added to it.
    const wantedTop =
        (xLabelsOnTop ? xLabelBand : baseTop) + (titleText ? TITLE_MARGIN : 0);

    // The left margin has to know the labels before the box is sized, since it
    // is what stops the widest of them being clipped — the labels of
    // `<chart type="bar">1e308</chart>` run to 411 characters and ask for 3713
    // pixels of it.
    // The vertical axis' numbers usually set the left margin, but on a chart
    // of small counts against large x values they do not, which is why it
    // takes the larger of the two — and on a chart drawn entirely to the left
    // of zero they are not there at all, having moved to the right margin.
    const wantedLeft = Math.max(
        yLabelsOnRight ? 0 : yLabelBand,
        halfWidestXLabel,
        markOverhang,
    );

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
        legend.onRight ? OUTSIDE_MARGIN_BUDGET : undefined,
    );
    const [marginBottom, marginTop] = fitMargins(
        heightPx,
        wantedBottom,
        wantedTop,
        legend.onBottom ? OUTSIDE_MARGIN_BUDGET : undefined,
    );

    // Positive without being floored at a pixel, since fitting the margins
    // already leaves at least half the frame to draw in. Flooring at 1 was what
    // made a fraction-of-a-pixel frame hold a 1px drawing.
    const innerWidth = widthPx - marginLeft - marginRight;
    const innerHeight = heightPx - marginBottom - marginTop;
    const dimensions = `(${formatNumber(innerWidth)},${formatNumber(innerHeight)})`;
    const margins = `[${marginLeft},${marginBottom},${marginRight},${marginTop}]`;

    // Pixels to data units, on each axis, for everything anchored at a
    // coordinate but placed by a distance in the picture. Guarded, because the
    // span of a chart of `-1e308` and `1e308` is `Infinity`: an offset scaled
    // by that is `-Infinity`, which `formatNumber` writes as `null`, and
    // `anchor="(1.5,null)"` is XML PreFigure cannot read. A zero scale leaves
    // the anchor on the corner it was measured from, which is finite and
    // drawable, and a chart spanning the whole double range has no legible
    // placement to lose.
    const finiteScale = (span: number, pixels: number) => {
        const scale = span / (pixels || 1);
        return Number.isFinite(scale) ? scale : 0;
    };
    const unitsPerPixelX = finiteScale(xMax - xMin, innerWidth);
    const unitsPerPixelY = finiteScale(yMax - yMin, innerHeight);

    const strokeAttr = darkModeAxisStrokeAttr(darkMode);

    // Each axis' name is anchored at the far end of that axis — `<xlabel>` at
    // the right end of the horizontal one, `<ylabel>` at the top of the
    // vertical one (`apply_axis_labels`, `axes.py`) — and the alignment is what
    // decides which way it is drawn from there. `nw` and `se` draw it into the
    // plot while the axis is against the near frame. Against the far one they
    // draw it out of the plot instead, into a margin holding the axis' numbers:
    // a `<yLabel>` on a chart left of zero ran 78px past the right edge of the
    // picture, and an `<xLabel>` on one below zero was drawn over the numbers on
    // its own axis. Mirrored, so the name keeps the place it has always had —
    // just inside the plot, at the end of the axis it names.
    const axisLabelElements = [];
    const xLabelText = labelMarkup({
        label: xLabel,
        labelHasLatex: xLabelHasLatex,
    });
    if (xLabelText) {
        axisLabelElements.push(
            `<xlabel alignment="${xLabelsOnTop ? "sw" : "nw"}" ${THEME_AWARE_LABEL_COLOR_ATTR}>${xLabelText}</xlabel>`,
        );
    }
    const yLabelText = labelMarkup({
        label: yLabel,
        labelHasLatex: yLabelHasLatex,
    });
    if (yLabelText) {
        // The two anchors are the same point when both axes have moved — the
        // right end of the horizontal one and the top of the vertical one are
        // both the top right corner — so on a chart drawn below *and* left of
        // zero the two names would be drawn on top of each other. Dropped a
        // line, which is the only direction there is room in: the horizontal
        // axis' name stays under the axis it names, and the vertical axis' name
        // sits under it, still beside the axis *it* names.
        const secondLine =
            xLabelsOnTop && yLabelsOnRight && xLabelText
                ? ` offset="(0,-${AXIS_LABEL_LINE_HEIGHT})"`
                : "";
        axisLabelElements.push(
            `<ylabel alignment="${yLabelsOnRight ? "sw" : "se"}"${secondLine} ${THEME_AWARE_LABEL_COLOR_ATTR}>${yLabelText}</ylabel>`,
        );
    }

    const axesInner = axisLabelElements.join("");
    const hlabelsAttr = xTicks
        ? ` hlabels="${escapeXml(axisLabelsAttr(xTicks))}"`
        : "";
    const axesAttrs = `axes="all" decorations="no" vlabels="${escapeXml(axisLabelsAttr(yTicks))}"${hlabelsAttr}${strokeAttr}`;
    const axesElement = axesInner
        ? `<axes ${axesAttrs}>${axesInner}</axes>`
        : `<axes ${axesAttrs} />`;

    const elements: string[] = [];

    // The categorical axis: arbitrary text at an arbitrary position, which is
    // the one thing `hlabels` cannot express. Driven by the slots rather than
    // the marks, so a value with no mark still has its category on the axis —
    // otherwise the gap would read as a missing category rather than as a
    // missing value.
    for (const slot of slots ?? []) {
        // A tick mark's content goes through PreFigure's own label machinery
        // (`tick_mark`, `axes.py`), so an `<m>` in it is typeset the way one in
        // a legend entry is — and a name that arrives as `\(x\)` without being
        // marked up is drawn as those six characters. Only asked of a name that
        // carries math: without the flag this is the plain `escapeXml` it has
        // always been, which is what every other type still gets.
        const name = slot.labelHasLatex
            ? (labelMarkup({
                  label: slot.label,
                  labelHasLatex: true,
              }) ?? escapeXml(slot.label))
            : escapeXml(slot.label);
        elements.push(
            `<tick-mark axis="horizontal" location="${formatNumber(slot.center)}"${strokeAttr} ${THEME_AWARE_LABEL_COLOR_ATTR}>${name}</tick-mark>`,
        );
    }

    // One series is drawn straight into the diagram, and its marks are
    // annotated straight under the figure. Several are each wrapped in a
    // `<group>`, which is what gives a screen reader a level to stop at
    // between the chart and its marks — the reason `<group>` exists in
    // PreFigure at all — and gives the legend an element per series to key
    // off.
    const groupSeries = seriesLabels.length > 1;

    const annotationElements: string[] = [];
    seriesLabels.forEach((seriesLabel, seriesIndex) => {
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
            seriesLabel ||
            seriesRendering[seriesIndex]?.unlabeledName ||
            `${seriesIndex + 1}`;
        annotationElements.push(
            `<annotation ref="${escapeXml(groupHandle)}" text="${escapeXml(seriesName)}">${seriesAnnotations[seriesIndex].join("")}</annotation>`,
        );
    });

    // The legend keys off the marks themselves: PreFigure reads the referenced
    // element's own `fill` and `stroke` (`legend.py`), drawing a filled swatch
    // for a bar or a point and a segment of stroke for a line, which carries no
    // fill. A series' color is therefore named in the legend by the same
    // attributes that draw it and the two cannot drift apart, and a series with
    // no mark has nothing to point at and so no entry.
    const legendElement = legendMarkup({
        plan: legend,
        bounds,
        frame: {
            marginLeft,
            marginRight,
            marginBottom,
            marginTop,
            innerWidth,
            innerHeight,
            unitsPerPixelX,
            unitsPerPixelY,
        },
        rightOfPlot,
    });

    // Centered above the drawing, in the margin widened for it, and raised
    // clear of the horizontal axis' labels where those share the top margin.
    const { titleElement, captionElement } = titleMarkup({
        titleText,
        bounds,
        lift: xLabelsOnTop ? xLabelBand : 0,
        roomAbove: marginTop,
        unitsPerPixelY,
    });

    const annotationsElement = figureAnnotations(
        shortDescription,
        annotationElements,
    );

    const xml = `<diagram dimensions="${escapeXml(dimensions)}" margins="${escapeXml(margins)}"><coordinates bbox="${escapeXml(bbox)}">${axesElement}${elements.join("")}${overlayElements.join("")}${titleElement}${legendElement}</coordinates>${captionElement}${annotationsElement}</diagram>`;

    return xml;
}
