/**
 * `<chart type="pie">`: one `<arc sector="yes">` per value, partitioning the
 * turn in proportion.
 *
 * The one type with no axes, so it does not use `assembleChartDiagram` — it
 * assembles its own frame from the legend, title and annotation helpers in
 * `frame.ts`, and its bounding box is chosen so that one data unit is the same
 * number of pixels on both axes, which is what makes the arc a circle.
 */

import { escapeXml, formatNumber } from "../common";
import { labelMarkup, THEME_AWARE_LABEL_COLOR_ATTR } from "../label";
import { styleAttributes } from "../style";
import type { DiagnosticRecord } from "@doenet/utils";
import { saturatingAdd, snapNumber, type ChartSeriesValues } from "./scale";
import {
    AXIS_LABEL_LINE_HEIGHT,
    estimateTextWidth,
    figureAnnotations,
    fitMargins,
    LEGEND_ANCHOR_OFFSET,
    LEGEND_OUTSIDE_GAP,
    LEGEND_PLACEMENTS,
    LEGEND_SWATCH_KEY_WIDTH,
    legendMarkup,
    OUTSIDE_MARGIN_BUDGET,
    planLegend,
    TITLE_MARGIN,
    titleMarkup,
    type LegendEntry,
} from "./frame";

/** One slice of a pie: a share of the whole turn, with the datum it stands for. */
export type PieSliceGeometry = {
    /** The category the slice is named by. */
    label: string;
    value: number;
    /** The slice's share of the total, in `[0, 1]`. */
    fraction: number;
    /**
     * Where the slice begins, in degrees clockwise from twelve o'clock, and how
     * far it runs from there.
     *
     * Clockwise from the top because that is where every statistical package
     * starts a pie, and in those terms rather than PreFigure's own — which
     * measures counterclockwise from three o'clock — because this geometry
     * describes the chart rather than the drawing of it. The XML builder does
     * the conversion.
     */
    startAngle: number;
    sweep: number;
};

/**
 * The slices of a pie, as shares of a total.
 *
 * No `bounds`, unlike the other two: a pie has no axes, so there is no extent
 * in data coordinates to report and nothing for an author's `xMin`/`yMax` to
 * describe. What replaces them is the total, which is the thing every slice is
 * measured against and the one number a pie has that its values do not already
 * give.
 */
export type PieChartGeometry = {
    kind: "pie";
    /**
     * The one series drawn, or empty on a chart that was given no series at
     * all. Kept so that a pie's geometry has the same shape as the other two.
     */
    series: { label: string }[];
    /**
     * One per value that is a share of the total — finite and not negative —
     * in the order they were given. A value of zero is among them, with a
     * sweep of zero: it is a real datum whose share is nothing, which is not
     * the same as a value that could not be read.
     */
    slices: PieSliceGeometry[];
    /** The total the shares are of. */
    total: number;
    /**
     * How many values went into the total: those that are finite and not
     * negative, whatever they came to. Zero where every value was rejected,
     * which is what tells a pie whose values came to nothing from one whose
     * values were never shares in the first place.
     */
    valuesInTotal: number;
    /** How many values had no slice because they were not finite numbers. */
    undrawnValues: number;
    /** How many values had no slice because they were negative. */
    negativeValues: number;
    /** How many series the chart was given beyond the one it drew. */
    undrawnSeries: number;
};

/**
 * The slices for a pie chart: one angular range per value, in proportion.
 *
 * Slices run clockwise from twelve o'clock in the order the values were given,
 * rather than sorted by size, which is what every statistical package does and
 * what keeps a pie beside a bar chart of the same data readable as the same
 * data.
 *
 * A pie draws one series. Concentric rings are not a standard chart and a
 * donut is a styling variant rather than a second group, so a chart given
 * several series draws the first and reports the rest as undrawn.
 *
 * Only a value that is a share of a total gets a slice. A value that is not a
 * finite number cannot be one, and a negative value is not merely undrawable
 * but meaningless here: a bar hangs below the baseline it is measured from, and
 * a pie has no baseline to hang anything from. Both are counted so the chart
 * can say so, and neither is included in the total, so the slices that are
 * drawn are shares of what was actually charted and together fill the circle.
 */
export function computePieChartGeometry({
    series,
    labels,
}: {
    series: ChartSeriesValues[];
    labels: string[];
}): PieChartGeometry {
    const values = series[0]?.values ?? [];

    let undrawnValues = 0;
    let negativeValues = 0;
    let total = 0;
    let largest = 0;
    const shares: { label: string; value: number }[] = [];

    values.forEach((value, ind) => {
        if (!Number.isFinite(value)) {
            undrawnValues++;
            return;
        }
        if (value < 0) {
            negativeValues++;
            return;
        }
        // Saturating, for the reason a stacked bar's running total is: a sum of
        // finite values need not be finite, and `Infinity` here would reach
        // the caller as a total that is not a number to report.
        total = saturatingAdd(total, value);
        largest = Math.max(largest, value);
        shares.push({ label: labels[ind] ?? String(ind + 1), value });
    });

    const slices: PieSliceGeometry[] = [];
    // A total of zero has no shares to take of it, and dividing by it would put
    // `NaN` in every angle. Nothing is drawn, and the caller says so.
    if (total > 0) {
        // Every value against the largest of them, and the shares taken of
        // *that* sum rather than of `total`. The ratios are the same either
        // way in exact arithmetic, and only this way in the arithmetic there
        // is: `total` saturates once the values sum past the top of the double
        // range, and a share of a saturated total is not the share the data
        // has. Two values of `1e308` came out as a 200-degree slice and a
        // 160-degree one, and three of them drew two slices and left the third
        // with nothing. Scaled, each value is at most 1, so their sum is at
        // most the number of values and cannot overflow whatever the data.
        //
        // `largest` is above zero wherever this runs, since a total above zero
        // takes at least one value above zero to reach.
        let scaledTotal = 0;
        for (const { value } of shares) {
            scaledTotal += value / largest;
        }

        /** How much of the turn the slices so far have used. */
        let turned = 0;
        for (const { label, value } of shares) {
            const fraction = value / largest / scaledTotal;
            // Held inside the one turn there is. The shares add to one now
            // rather than to more, so this is the rounding guard it looks
            // like: it stops the last slice of a run whose fractions each
            // rounded up from reaching past twelve o'clock.
            const sweep = Math.min(fraction, Math.max(1 - turned, 0)) * 360;
            slices.push({
                label,
                value,
                fraction,
                // Snapped like every other computed coordinate here: the angles
                // are reached by accumulating shares, and three equal ones
                // would otherwise start at `120.00000000000001`.
                startAngle: snapNumber(turned * 360),
                sweep: snapNumber(sweep),
            });
            turned += sweep / 360;
        }
    }

    return {
        kind: "pie",
        series: series.length > 0 ? [{ label: series[0].label }] : [],
        slices,
        total,
        valuesInTotal: shares.length,
        undrawnValues,
        negativeValues,
        undrawnSeries: Math.max(series.length - 1, 0),
    };
}

/**
 * The radius every pie is drawn at, in data units.
 *
 * One, because `assemblePieDiagram` chooses a bounding box in which one unit is
 * the same number of pixels on both axes and the shorter side of the drawing
 * area is two units across — so a radius of one is a circle inscribed in the
 * drawing area, and the room outside it is the margins rather than a fraction
 * of the box held back here.
 */
const PIE_RADIUS = 1;

/**
 * Room outside the pie, in pixels, on every side.
 *
 * The pie touches the drawing area's shorter edge, so its stroke — half of
 * `thickness`, two pixels by default — is painted just outside it, and PreFigure
 * puts the margins outside `dimensions`. Eight leaves that clear with a little
 * air to spare.
 */
const PIE_PADDING = 8;

/**
 * The eight compass alignments, by octant counterclockwise from due east.
 *
 * `label.py` accepts these as `alignment` and draws the text away from its
 * anchor in the named direction, which is what puts a slice's name outside the
 * arc rather than across it. The order is PreFigure's own `alignment_circle`.
 */
const COMPASS_ALIGNMENTS = [
    "east",
    "northeast",
    "north",
    "northwest",
    "west",
    "southwest",
    "south",
    "southeast",
] as const;

/**
 * The compass alignment that draws a label away from the center along `degrees`,
 * measured counterclockwise from due east.
 */
function compassAlignment(degrees: number): string {
    const octant = Math.round(degrees / 45);
    return COMPASS_ALIGNMENTS[((octant % 8) + 8) % 8];
}

/** How much room a pie's slice names need beyond the drawing area, in pixels. */
type SliceLabelBands = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

/**
 * Which margin a slice's name reaches into, by the alignment it is drawn with.
 *
 * A name aligned away from the center is drawn entirely to one side of its
 * anchor, so it reaches into the margin on that side and no other. `north` and
 * `south` reach into no side margin, and `east` and `west` into neither cap:
 * both are centered on the other axis, on an anchor that sits at the middle of
 * the pie in that direction, so what they reach toward is the pie rather than
 * the edge of the picture. A name wider than the whole pie is the exception,
 * and is the case a legend larger than its chart already is.
 */
const SLICE_LABEL_REACH: Record<
    string,
    { side: "left" | "right" | null; cap: "top" | "bottom" | null }
> = {
    east: { side: "right", cap: null },
    northeast: { side: "right", cap: "top" },
    southeast: { side: "right", cap: "bottom" },
    west: { side: "left", cap: null },
    northwest: { side: "left", cap: "top" },
    southwest: { side: "left", cap: "bottom" },
    north: { side: null, cap: "top" },
    south: { side: null, cap: "bottom" },
};

/**
 * Everything around a pie's slices: the frame, the title, the legend and the
 * annotation tree.
 *
 * Separate from `assembleChartDiagram` because a pie is the one type with no
 * axes: there is no `<axes>` element, no tick marks, no axis names, and none of
 * the margin is holding a run of numbers. What the two share is the furniture
 * that does not depend on axes — the legend, the title, the annotations — and
 * they share it through `frame.ts`'s helpers rather than through a branch.
 *
 * The bounding box is settled *after* the margins here, the reverse of the
 * other assembly. It has to be: a pie has to come out round, and PreFigure
 * scales an `<arc>`'s radius by each axis separately (`circle.py`), so one data
 * unit must be the same number of pixels either way — which is a fact about the
 * drawing area, and the drawing area is what is left once the margins are
 * taken. Nothing is lost by the order, because none of a pie's margins is
 * measured against the box the way an axis label's is.
 */
function assemblePieDiagram({
    widthPx,
    heightPx,
    title,
    showLegend,
    legendPosition,
    legendEntries,
    sliceLabelBands,
    elements,
    overlayElements,
    annotationElements,
    shortDescription,
}: {
    widthPx: number;
    heightPx: number;
    title?: string;
    showLegend: boolean;
    legendPosition: keyof typeof LEGEND_PLACEMENTS;
    /** One per slice the legend can name, in the order they are drawn. */
    legendEntries: LegendEntry[];
    /**
     * How far the text drawn beyond the rim reaches into each margin, in
     * pixels. All zero when nothing is drawn there — the names are in the
     * legend and no value was asked for — and a value alone is enough to make
     * them otherwise.
     */
    sliceLabelBands: SliceLabelBands;
    /** The arcs, in the order they are drawn. */
    elements: string[];
    /** Drawn after every arc, so no later slice can cover a label. */
    overlayElements: string[];
    annotationElements: string[];
    shortDescription?: string;
}): string {
    // A pie's key is a swatch of fill, like a bar's: PreFigure reads the
    // referenced arc's own `fill` (`legend.py`), and an arc has one.
    const legend = planLegend({
        entries: legendEntries,
        showLegend,
        legendPosition,
        legendKeyWidth: LEGEND_SWATCH_KEY_WIDTH,
    });

    // No `titleHasLatex`, for the reason `assembleChartDiagram` gives: a
    // `<title>`'s text arrives already flattened.
    const titleText = labelMarkup({ label: title, labelHasLatex: false });

    // Every side holds the pie's stroke and a little air, and whichever sides
    // the slice labels are drawn toward hold those as well.
    const wantedLeft = PIE_PADDING + sliceLabelBands.left;

    /** The width an outside-right legend needs, offset and gap included. */
    const legendWidthRoom =
        LEGEND_ANCHOR_OFFSET + legend.size.width + LEGEND_OUTSIDE_GAP;
    /** The same for one below the pie, which is measured by its height. */
    const legendHeightRoom =
        LEGEND_ANCHOR_OFFSET + legend.size.height + LEGEND_OUTSIDE_GAP;

    // Text beyond the rim gets the same larger share of the frame a legend
    // outside the plot does, and for the same reason: a string is a fixed width
    // whatever the chart's size, so squeezing the margin only clips it. Even
    // that share runs out eventually, which is the case a legend larger than
    // its chart already is.
    const textBeyondRim =
        sliceLabelBands.left > 0 ||
        sliceLabelBands.right > 0 ||
        sliceLabelBands.top > 0 ||
        sliceLabelBands.bottom > 0;

    /** The most of the width the two side margins may take between them. */
    const sideBudget = Math.floor(
        widthPx *
            (legend.onRight || textBeyondRim ? OUTSIDE_MARGIN_BUDGET : 1 / 2),
    );

    /**
     * How far past the drawing area the text at the rim reaches on the right,
     * and so how far a legend placed in that same margin starts beyond it.
     *
     * The counterpart of the axis numbers' band on a chart with axes. At zero
     * the two share the margin and are drawn in the same place, which is what
     * put `1200000` under the legend box of a six-slice pie.
     */
    let rightOfPlot = 0;
    let wantedRight = PIE_PADDING + sliceLabelBands.right;
    let wantedBottom = PIE_PADDING + sliceLabelBands.bottom;
    if (legend.onRight) {
        const pastTheText = sliceLabelBands.right + legendWidthRoom;
        // Past the text when the frame can hold both margins as asked, and
        // beside it when it cannot. `fitMargins` shrinks the two side margins
        // in proportion, so asking for the sum on a frame too small for it
        // takes from the *left* margin as well: a `size="small"` pie of
        // seven-digit values had one of them drawn four pixels off the left
        // edge, while the legend still covered the value opposite. A legend
        // over a number is the lesser fault — the same trade `legendMarkup`
        // makes when it pulls a box back inside rather than let it be clipped.
        if (wantedLeft + Math.max(wantedRight, pastTheText) <= sideBudget) {
            rightOfPlot = sliceLabelBands.right;
            wantedRight = Math.max(wantedRight, pastTheText);
        } else {
            wantedRight = Math.max(wantedRight, legendWidthRoom);
        }
    } else if (legend.onBottom) {
        wantedBottom += legendHeightRoom;
    }
    const wantedTop =
        PIE_PADDING + sliceLabelBands.top + (titleText ? TITLE_MARGIN : 0);

    const [marginLeft, marginRight] = fitMargins(
        widthPx,
        wantedLeft,
        wantedRight,
        legend.onRight || textBeyondRim ? OUTSIDE_MARGIN_BUDGET : undefined,
    );
    const [marginBottom, marginTop] = fitMargins(
        heightPx,
        wantedBottom,
        wantedTop,
        legend.onBottom || textBeyondRim ? OUTSIDE_MARGIN_BUDGET : undefined,
    );

    const innerWidth = widthPx - marginLeft - marginRight;
    const innerHeight = heightPx - marginBottom - marginTop;

    // The shorter side of the drawing area is two units across and the longer
    // one proportionally more, which is what makes a unit the same number of
    // pixels on both axes and the pie a circle rather than an ellipse. A
    // drawing area with no extent has no proportion to take, and falls back to
    // a square box so that the coordinates stay numbers. Nothing an author can
    // write reaches that: the frame is always some pixels across, and
    // `fitMargins` never takes all of them.
    const shorterSide = Math.min(innerWidth, innerHeight);
    const usable = shorterSide > 0 && Number.isFinite(shorterSide);
    const halfWidth = usable ? innerWidth / shorterSide : 1;
    const halfHeight = usable ? innerHeight / shorterSide : 1;
    const unitsPerPixel = usable ? 2 / shorterSide : 0;

    const bounds: [number, number, number, number] = [
        -halfWidth,
        -halfHeight,
        halfWidth,
        halfHeight,
    ];

    const dimensions = `(${formatNumber(innerWidth)},${formatNumber(innerHeight)})`;
    const margins = `[${marginLeft},${marginBottom},${marginRight},${marginTop}]`;
    const bbox = `(${formatNumber(bounds[0])},${formatNumber(bounds[1])},${formatNumber(bounds[2])},${formatNumber(bounds[3])})`;

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
            unitsPerPixelX: unitsPerPixel,
            unitsPerPixelY: unitsPerPixel,
        },
        rightOfPlot,
    });

    const { titleElement, captionElement } = titleMarkup({
        titleText,
        bounds,
        // Above the text beyond the rim where that shares the top margin,
        // which is where the label of a slice pointing straight up is drawn.
        // Both are anchored at the top of the box and drawn upwards from it, so
        // without the lift a pie of eight equal slices drew its first name
        // through its own title. The margin already holds both bands.
        lift: sliceLabelBands.top,
        roomAbove: marginTop,
        unitsPerPixelY: unitsPerPixel,
    });

    const annotationsElement = figureAnnotations(
        shortDescription,
        annotationElements,
    );

    return `<diagram dimensions="${escapeXml(dimensions)}" margins="${escapeXml(margins)}"><coordinates bbox="${escapeXml(bbox)}">${elements.join("")}${overlayElements.join("")}${titleElement}${legendElement}</coordinates>${captionElement}${annotationsElement}</diagram>`;
}

/**
 * Builds the PreFigure XML for a pie chart.
 *
 * One `<arc sector="yes">` per slice, which is a run of arcs whose ranges
 * partition the turn in proportion to the values: `sector` closes each one back
 * to the center, so the wedge is a filled shape rather than a curve.
 *
 * The angles are converted here rather than in the geometry. PreFigure measures
 * them counterclockwise from three o'clock, as trigonometry does; a pie is read
 * clockwise from twelve, as every statistical package draws it. So the geometry
 * says what the chart means and this says how to draw it.
 *
 * Each slice is filled from its own style, which is the one place a chart colors
 * *within* a series rather than across series: a pie of one series still needs a
 * color per slice, since the slices are what a reader tells apart.
 */
export function createPieChartPrefigureXML({
    geometry,
    sliceStyles,
    widthPx,
    heightPx,
    title,
    showLegend,
    legendPosition,
    displayValues,
    shortDescription,
}: {
    geometry: PieChartGeometry;
    /** The style each slice is drawn in, in the order the slices are given. */
    sliceStyles: (Record<string, unknown> | undefined)[];
    widthPx: number;
    heightPx: number;
    title?: string;
    showLegend: boolean;
    legendPosition: keyof typeof LEGEND_PLACEMENTS;
    displayValues: boolean;
    shortDescription?: string;
}): { xml: string; diagnostics: DiagnosticRecord[] } {
    const diagnostics: DiagnosticRecord[] = [];

    const elements: string[] = [];
    const overlayElements: string[] = [];
    const annotationElements: string[] = [];
    const legendEntries: LegendEntry[] = [];

    // A slice's name goes in the legend when there is one and beyond the rim
    // when there is not, rather than in both places: the legend is what a pie's
    // categories are usually read from, and repeating them around the arcs
    // would say the same thing twice on a picture with no room to spare.
    const namesBeyondRim = !showLegend;
    const sliceLabelBands: SliceLabelBands = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    };

    geometry.slices.forEach((slice, sliceIndex) => {
        // A slice of no sweep gets no arc. PreFigure draws a sector by walking
        // a hundred points along its rim and closing back to the center, so a
        // sweep of zero comes out as a stroked line from the center to the rim
        // — a radius nobody asked for, drawn for a value whose share of the
        // total really is nothing. The value is still reported by `values`, and
        // an arc that is not there is what keeps it out of the legend too.
        if (!(slice.sweep > 0)) {
            return;
        }

        const handle = `slice-${sliceIndex + 1}`;
        const sliceAttrs = styleAttributes({
            selectedStyle: sliceStyles[sliceIndex],
            diagnostics,
            warningPrefix: "<chart>",
        }).join(" ");

        const startDegrees = snapNumber(90 - slice.startAngle);
        const endDegrees = snapNumber(startDegrees - slice.sweep);
        const range = `(${formatNumber(startDegrees)},${formatNumber(endDegrees)})`;

        elements.push(
            `<arc at="${escapeXml(handle)}" center="(0,0)" radius="${PIE_RADIUS}" range="${escapeXml(range)}" sector="yes"${sliceAttrs ? ` ${sliceAttrs}` : ""} />`,
        );

        // Along the middle of the slice, which is the one direction out of it
        // that no neighbor is nearer to.
        const midDegrees = snapNumber(startDegrees - slice.sweep / 2);
        const midRadians = (midDegrees * Math.PI) / 180;
        const atTheRim = `(${formatNumber(snapNumber(PIE_RADIUS * Math.cos(midRadians)))},${formatNumber(snapNumber(PIE_RADIUS * Math.sin(midRadians)))})`;

        if (!namesBeyondRim) {
            legendEntries.push({
                label: slice.label,
                // A category is a `textList` entry, which is text and nothing
                // else — there is no LaTeX in it to typeset.
                labelHasLatex: false,
                handle,
            });
        }

        // What is drawn beyond the rim: the slice's name where the legend is
        // not holding it, and its value where the author asked for one.
        //
        // Beyond the rim rather than inside the slice. Every other type draws
        // its value clear of its marks too — at a bar's far end, above a
        // point. Nothing is painted over a mark, so the text keeps the page's
        // own color and reads against the page whatever the slice is filled
        // with. Inside, it would not: the fifth built-in style fills black at
        // seven tenths opacity, which composites to `#4d4d4d` and leaves black
        // text at 2.5:1 against it, and a patterned fill has no single color
        // to contrast with at all.
        //
        // One label rather than two, so there is one thing to place and one
        // width to reserve, and the number reads as the named slice's own.
        const name = namesBeyondRim ? slice.label.trim() : "";
        const shown = displayValues ? (formatNumber(slice.value) ?? "") : "";
        const rimText = name && shown ? `${name} (${shown})` : name || shown;

        if (rimText) {
            const alignment = compassAlignment(midDegrees);
            const reach = SLICE_LABEL_REACH[alignment];
            if (reach?.side) {
                // Rounded up rather than down, so the band is never
                // narrower than the width it was estimated from.
                sliceLabelBands[reach.side] = Math.max(
                    sliceLabelBands[reach.side],
                    Math.ceil(estimateTextWidth(rimText)),
                );
            }
            if (reach?.cap) {
                sliceLabelBands[reach.cap] = AXIS_LABEL_LINE_HEIGHT;
            }
            overlayElements.push(
                `<label anchor="${escapeXml(atTheRim)}" alignment="${alignment}" ${THEME_AWARE_LABEL_COLOR_ATTR}>${escapeXml(rimText)}</label>`,
            );
        }

        annotationElements.push(
            `<annotation ref="${escapeXml(handle)}" text="${escapeXml(`${slice.label}: ${formatNumber(slice.value)}`)}" />`,
        );
    });

    const xml = assemblePieDiagram({
        widthPx,
        heightPx,
        title,
        showLegend,
        legendPosition,
        legendEntries,
        sliceLabelBands,
        elements,
        overlayElements,
        annotationElements,
        shortDescription,
    });

    return { xml, diagnostics };
}
