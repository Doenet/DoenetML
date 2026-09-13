import BlockComponent from "./abstract/BlockComponent";
import {
    returnSelectedStyleStateVariableDefinition,
    selectStyleForStyleNumber,
    widthsBySize,
} from "@doenet/utils";
import { codedDiagnostic } from "../utils/diagnostics";
import {
    returnSizeAttributes,
    returnSizeStateVariableDefinitions,
} from "../utils/componentSize";
import {
    returnAxisLabelChildGroup,
    returnAxisLabelStateVariableDefinitions,
} from "../utils/axisLabel";
import {
    chartLegendHasItems,
    computeBarChartGeometry,
    computeBoxChartGeometry,
    computeHistogramChartGeometry,
    computePieChartGeometry,
    computePointChartGeometry,
    createBarChartPrefigureXML,
    createBoxChartPrefigureXML,
    createHistogramChartPrefigureXML,
    createPieChartPrefigureXML,
    MAX_REQUESTED_BINS,
    createPointChartPrefigureXML,
} from "../utils/prefigure/chart";
import { resolveSelectedStyleForTheme } from "../utils/prefigure/style";
import {
    numericValuesFromValueChildren,
    returnBreakStringsIntoMathsBySpacesSugarInstruction,
} from "../utils/mathOperatorChildren";
import { returnShortDescriptionStateVariableDefinition } from "../utils/shortDescription";
import {
    contentTranslator,
    returnContentLocaleDependencies,
} from "../utils/contentLocale";

/** The width-to-height ratio a chart is drawn at when none is asked for. */
const DEFAULT_ASPECT_RATIO = 1.5;

/** How much of its slot a bar fills when no width is asked for. */
const DEFAULT_BAR_WIDTH = 0.8;

/**
 * The types this component knows how to draw, each with a branch in
 * `chartGeometry`.
 *
 * A second list beside `type`'s own `validValues`, and deliberately so: the
 * attribute decides what an author may write and this decides what can be
 * drawn from it. They agree today, and the day they do not — a type named in
 * the schema before its geometry lands — the chart draws nothing and says so
 * rather than falling through a branch that is not there yet.
 */
const DRAWABLE_TYPES = new Set([
    "bar",
    "line",
    "scatter",
    "pie",
    "box",
    "histogram",
]);

/**
 * A chart of its data. `type` picks which chart is drawn: one bar per value, a
 * path through them, or a point at each.
 *
 * Data arrives as one or more `<series>` children, which is the shape every
 * standard statistical plotting package takes: a chart is data, a mark, and a
 * set of encodings mapping the data onto position and color. `type` is the
 * mark; a `<series>` is the group the color encoding splits on. A chart whose
 * children are bare values has one series, built here, so the simple case reads
 * as it always did.
 *
 * One tag with a `type` rather than a tag per chart: a bar chart, a pie chart
 * and a scatter plot differ in how the same list of values is drawn rather
 * than in what an author is doing. `type` puts that choice where it can be
 * read — and, being an attribute, where it can be computed, so a document can
 * chart the same data both ways without duplicating the tag around it.
 *
 * Rendered with PreFigure rather than JSXGraph, which buys three things a
 * hand-drawn chart would not have: the bars become one compiled SVG however
 * many there are, the horizontal axis can carry category *names* (`<graph>`
 * exposes no custom-tick support at all), and the result is navigable by
 * screen reader through diagcess. See `utils/prefigure/chart/`.
 *
 * The geometry lives in its own state variable and `prefigureXML` is a thin
 * serialization of it, so the chart's meaning does not depend on how it is
 * drawn — if PreFigure's compile-per-change ever proves too slow for a chart
 * that resamples, an SVG renderer can go behind the same component without
 * touching what an author writes.
 */
export default class Chart extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }

    static componentType = "chart";

    static componentDocs = {
        summary:
            "A chart of one or more series of values. `type` picks which chart is drawn.",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(
            attributes,
            returnSizeAttributes({ componentName: "chart" }),
        );

        // Deliberately has no default, so `<chart>` on its own draws nothing
        // and says why. `bar` would be the obvious default and is not the one
        // an author reaches for most often — a pie chart is at least as
        // common. Defaulting to it would let documents come to rely on the
        // default rather than on a type they named, and any later change would
        // silently redraw them as something else. Requiring the attribute
        // keeps that door open at the cost of one word in every document.
        //
        // `validValues` rather than `suggestedValues`: the list of charts is
        // closed, so `type="donut"` is an author error rather than a
        // choice this component declines to constrain, and the language server
        // should say so where it is written. The cost is that an unrecognized
        // value is reported twice — once naming the value that was rejected,
        // once by `chartGeometry` below saying nothing was drawn — which is
        // the pair `<sampleMultivariateRandomNumber type>` already produces,
        // and the second message is worded not to assume the attribute is
        // missing.
        attributes.type = {
            groupName: "marks",
            description:
                "Which chart to draw. Required; there is no default, and `<chart>` with no type draws nothing.",
            createComponentOfType: "text",
            createStateVariable: "type",
            defaultValue: null,
            public: true,
            toLowerCase: true,
            highlighted: true,
            validValues: [
                {
                    value: "bar",
                    description:
                        "A bar chart: one bar per value, standing on a baseline of zero, under a horizontal axis of category names.",
                },
                {
                    value: "line",
                    description:
                        "A line chart: a path through each series' values in the order given, under category names or against an `x` of their own.",
                },
                {
                    value: "scatter",
                    description:
                        "A scatter plot: one point per value, against an `x` of its own, or under category names where no series carries one.",
                },
                {
                    value: "pie",
                    description:
                        "A pie chart: one slice per value, each a share of the total, named by the category names. Draws one series and has no axes.",
                },
                {
                    value: "box",
                    description:
                        "A box plot per series, side by side under an axis of the series' names. A series holds raw observations rather than one value per category.",
                },
                {
                    value: "histogram",
                    description:
                        "A histogram: one bar per bin, adjacent with no gap, over a numeric axis of cut points. A series holds raw observations, and the bars' heights are how many fall in each bin. Draws one series.",
                },
            ],
        };

        // The same attribute `<binCounts>` takes, read the same way, so that a
        // table of counts and a histogram of one column can be given the same
        // bins. One number is a number of bins rather than a cut point, which
        // costs nothing to read: a single cut point describes no interval, so
        // there is no list of one for it to be confused with.
        attributes.bins = {
            groupName: "marks",
            createComponentOfType: "numberList",
            description:
                "How to divide a histogram's scale: a whole number of equal-width bins, from 1 to 1000, or two or more finite cut points, each at least as large as the one before it. Omit it and the bins are chosen from the data. Only a histogram draws with it.",
            highlighted: true,
        };

        attributes.closed = {
            groupName: "marks",
            description:
                "Which end of each of a histogram's bins includes its cut point. Each outermost cut point belongs to its own bin whichever end is closed, so an observation sitting exactly on the first or the last of them is counted.",
            createComponentOfType: "text",
            createStateVariable: "closed",
            defaultValue: "left",
            public: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "left",
                    description:
                        "Bins are `[a, b)`, matching NumPy and the usual textbook class interval.",
                },
                {
                    value: "right",
                    description:
                        "Bins are `(a, b]`, matching R, pandas and Excel.",
                },
            ],
        };

        // `aspectRatio`, `barWidth` and both pairs of bounds are each read into
        // a private `…Attr` state variable rather than straight into the name
        // they share with the attribute. The public name is then defined below
        // as *what the chart was drawn with*, which is not always what was
        // asked for: a ratio CSS would reject, a bar width that is not a
        // fraction of a slot, and bounds that describe no box to draw in are
        // all replaced. Reading back a number the picture does not show would
        // be worse than not exposing it at all.
        //
        // `<graph>` splits its own bounds the same way — its `xMin` attribute
        // is read into a private `xminPrelim` and the public `xMin` reports
        // the axis that was drawn.
        attributes.aspectRatio = {
            description: "Aspect ratio (width / height) for the chart.",
            createComponentOfType: "number",
            createStateVariable: "aspectRatioAttr",
            defaultValue: DEFAULT_ASPECT_RATIO,
        };

        // A `textList` rather than a `_componentListWithSelectableType`. The
        // categorical axis places its bars at 1, 2, 3 whatever the categories
        // say, so a category is a label and nothing else: `categories="1 5 6"`
        // spaces its bars evenly and writes 1, 5, 6 under them, exactly as
        // three words would be. Reading them as numbers would therefore decide
        // nothing, and could only go wrong: the selectable type falls back to
        // `number`, which writes a `NaN` under every bar of
        // `categories="North South East"`. Numbers referenced in from a
        // `<tally>` are converted to their text, which is what a label is.
        attributes.categories = {
            groupName: "axes",
            createComponentOfType: "textList",
            description:
                "The name of each position in the data: the label under each position on the horizontal axis, or the name of each slice of a pie. Defaults to the position itself, 1, 2, 3 and so on. A line or scatter chart whose series carry an `x` is placed by measurement instead and has no positions to name; a bar chart and a pie name theirs whatever else the series carry. A box plot's positions are its series, each named by its own `<label>`, and a histogram's are its bins, each named by the cut points it runs between.",
            highlighted: true,
        };

        attributes.barWidth = {
            groupName: "marks",
            description:
                "How much of each category's slot the bars fill: greater than 0 and at most 1, so the bars may fill their slot but must have some width. The rest is the gap to the next category. With several series side by side, they divide this between them. Only a bar chart draws with it.",
            createComponentOfType: "number",
            createStateVariable: "barWidthAttr",
            defaultValue: DEFAULT_BAR_WIDTH,
        };

        // `grouped` rather than `stacked` by default: side-by-side bars can be
        // compared category by category *and* series by series, where a stack
        // only ever answers the first question — every segment above the bottom
        // one starts at a different place, so their lengths are what a reader
        // has to compare by eye. Stacking earns its place when the total is the
        // point, which is a choice about the data rather than the usual case.
        //
        // One series is drawn identically either way, so this matters only once
        // there is something to arrange.
        attributes.layout = {
            groupName: "marks",
            description:
                "How the bars of several series share a category's slot.",
            createComponentOfType: "text",
            createStateVariable: "layout",
            defaultValue: "grouped",
            public: true,
            toLowerCase: true,
            // Alongside `type` and `categories` in the open section of the
            // generated attribute table: it decides how a multi-series chart is
            // read, which is not something to find by expanding "Other".
            highlighted: true,
            validValues: [
                {
                    value: "grouped",
                    description:
                        "Side by side within the category's slot, each series taking an equal share of it.",
                },
                {
                    value: "stacked",
                    description:
                        "One above another from the baseline, so each slot shows its total. Negative values stack downward.",
                },
            ],
        };

        // A boolean is enough to say this: a legend names the series, so a
        // chart whose series carry no labels has nothing to put in one, and
        // "draw a legend" and "draw one where there is something to show" are
        // the same instruction. Whether one appears is `showLegend` below.
        attributes.legend = {
            groupName: "legend",
            description:
                'Whether to draw a legend naming the series — or, on a pie, naming the slices. A legend is drawn when a series carries a `<label>`, and on a pie whenever there is a slice to name; `legend="false"` suppresses it, and a pie then writes its slice names around the rim instead. A box plot names each series under the box drawn from it and never draws a legend.',
            createComponentOfType: "boolean",
            createStateVariable: "legend",
            defaultValue: true,
            public: true,
        };

        // Outside the plot by default, which is where ggplot2 and Vega-Lite
        // both put a legend: a legend in a corner of the plot sits exactly
        // where a bar chart's tallest bars do, and no corner is reliably free —
        // a legend three series deep occupies the top third of the right-hand
        // edge, which four tall bars will always reach.
        //
        // The four inside corners are kept, under the same names `<legend>`
        // uses inside a `<graph>`, because they cost no width or height: they
        // are the author's choice to spend nothing on the legend and watch
        // where it lands. `outsideRight` spends width and `outsideBottom`
        // spends height, which is the trade to make when the series labels are
        // long enough that the first is expensive.
        attributes.legendPosition = {
            groupName: "legend",
            description: "Where the legend sits.",
            createComponentOfType: "text",
            createStateVariable: "legendPosition",
            defaultValue: "outsideRight",
            public: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "outsideRight",
                    description:
                        "To the right of the chart, outside the plot, in a margin widened to hold it. Never overlaps the data.",
                },
                {
                    value: "outsideBottom",
                    description:
                        "Below the chart, under the category names, outside the plot. Never overlaps the data, and spends height rather than width.",
                },
                {
                    value: "upperRight",
                    description: "Place the legend in the upper-right corner.",
                },
                {
                    value: "upperLeft",
                    description: "Place the legend in the upper-left corner.",
                },
                {
                    value: "lowerRight",
                    description: "Place the legend in the lower-right corner.",
                },
                {
                    value: "lowerLeft",
                    description: "Place the legend in the lower-left corner.",
                },
            ],
        };

        // Only the types that place their marks along a measured horizontal
        // axis have an `x` to bound. On a categorical axis the positions are 1,
        // 2, 3 whatever the categories say, so there is nothing an author could
        // usefully ask for and these are ignored.
        attributes.xMin = {
            groupName: "axes",
            description:
                "Leftmost value shown on the horizontal axis, for a chart with a numeric one. Defaults to the first tick below the smallest `x`, or on a histogram to its first cut point, since its bars fill the axis. If `xMin` and `xMax` do not describe a box — both finite, with `xMin` below `xMax` — the axis is chosen from the data instead. A pie has no axes and reads neither.",
            createComponentOfType: "number",
            createStateVariable: "xMinAttr",
            defaultValue: null,
        };

        attributes.xMax = {
            groupName: "axes",
            description:
                "Rightmost value shown on the horizontal axis, for a chart with a numeric one. Defaults to the first tick above the largest `x`, or on a histogram to its last cut point, since its bars fill the axis. If `xMin` and `xMax` do not describe a box — both finite, with `xMin` below `xMax` — the axis is chosen from the data instead. A pie has no axes and reads neither.",
            createComponentOfType: "number",
            createStateVariable: "xMaxAttr",
            defaultValue: null,
        };

        attributes.yMin = {
            groupName: "axes",
            description:
                "Lowest value shown on the vertical axis. Defaults to 0 for a bar chart, whose bars are measured from it, and for a histogram, whose bars are counts, or to the first tick past the smallest value — which is what a bar chart with negative values gets, and what a line, scatter or box chart always gets. If `yMin` and `yMax` do not describe a box — both finite, with `yMin` below `yMax` — the axis is chosen from the data instead. A pie has no axes and reads neither.",
            createComponentOfType: "number",
            createStateVariable: "yMinAttr",
            defaultValue: null,
        };

        attributes.yMax = {
            groupName: "axes",
            description:
                "Highest value shown on the vertical axis. Defaults to the next tick above the largest value, or on a histogram above the tallest count. If `yMin` and `yMax` do not describe a box — both finite, with `yMin` below `yMax` — the axis is chosen from the data instead. A pie has no axes and reads neither.",
            createComponentOfType: "number",
            createStateVariable: "yMaxAttr",
            defaultValue: null,
        };

        attributes.displayValues = {
            groupName: "marks",
            description:
                "Whether to print each value beside its mark: at a bar's far end — above one that rises, below one that falls — above a line or scatter chart's point, and beyond the rim of a pie's slice. A histogram prints how many observations fell in each bin above its bar. A box plot reports five numbers at each position rather than one, and does not draw with it.",
            createComponentOfType: "boolean",
            createStateVariable: "displayValues",
            defaultValue: false,
            public: true,
        };

        // True by default, and not only because a short series reads better
        // with them: a marker is an element, and an element is what an
        // annotation can point at. With markers off, the line carries one
        // annotation for the whole series and a screen reader can reach the
        // chart but not walk it — which is a real cost, and so a choice rather
        // than a default.
        attributes.markers = {
            groupName: "marks",
            description:
                "Whether a line chart draws a marker at each of its points. A scatter plot is its markers, so it always draws them. Only a line chart draws with it.",
            createComponentOfType: "boolean",
            createStateVariable: "markers",
            defaultValue: true,
            public: true,
            // Alongside `layout`, which is the same thing for a bar chart: the
            // one control over how a type arranges what it draws. Turning
            // markers off also costs a screen reader the ability to walk the
            // series point by point, which is not a trade to make from a
            // collapsed section of the table.
            highlighted: true,
        };

        attributes.showBorder = {
            description: "Whether to render a border around the chart.",
            createComponentOfType: "boolean",
            createStateVariable: "showBorder",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.displayMode = {
            description: "How to size the chart.",
            createComponentOfType: "text",
            createStateVariable: "displayMode",
            validValues: [
                {
                    value: "block",
                    description: "Display as a block element on its own line.",
                },
                {
                    value: "inline",
                    description: "Render inline with surrounding text.",
                },
            ],
            defaultValue: "block",
            toLowerCase: true,
            forRenderer: true,
            public: true,
        };

        attributes.horizontalAlign = {
            description:
                "Horizontal alignment of the chart within its container.",
            createComponentOfType: "text",
            createStateVariable: "horizontalAlign",
            validValues: [
                {
                    value: "center",
                    description: "Center the chart horizontally.",
                },
                {
                    value: "left",
                    description: "Align the chart to the left edge.",
                },
                {
                    value: "right",
                    description: "Align the chart to the right edge.",
                },
            ],
            defaultValue: "center",
            toLowerCase: true,
            forRenderer: true,
            public: true,
        };

        attributes.decorative = {
            description:
                "Whether the chart is purely decorative (excluded from a11y tree).",
            createPrimitiveOfType: "boolean",
            createStateVariable: "decorative",
            defaultValue: false,
            public: true,
            forRenderer: true,
        };

        return attributes;
    }

    /**
     * No `annotations` group, unlike `<graph>`: a chart writes its own
     * annotations out of the bars it drew, so an authored `<annotations>` child
     * would have nothing to describe and would be silently dropped. Better that
     * it be reported as a child this is not.
     */
    // Include children that can be added by the sugar below.
    static additionalSchemaChildren = ["string"];

    /**
     * Bare numbers are read as values: `<chart type="bar">41 63 18</chart>`.
     * Unconditional, with nothing to consult — a charted value is a number
     * whatever chart is drawn from it, and the categories are labels that no
     * reading of the values touches. Broken into maths rather than numbers, as
     * `<sum>` and `<mean>` do, so that `1/2` is half rather than `NaN`.
     */
    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push(
            returnBreakStringsIntoMathsBySpacesSugarInstruction(),
        );

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            returnAxisLabelChildGroup({ axis: "x" }),
            returnAxisLabelChildGroup({ axis: "y" }),
            {
                group: "titles",
                componentTypes: ["title"],
            },
            {
                group: "shortDescriptions",
                componentTypes: ["shortDescription"],
            },
            {
                group: "series",
                componentTypes: ["series"],
            },
            {
                group: "numbers",
                componentTypes: ["number"],
            },
            {
                group: "maths",
                componentTypes: ["math"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnSelectedStyleStateVariableDefinition(),
            returnSizeStateVariableDefinitions({ componentName: "chart" }),
            returnAxisLabelStateVariableDefinitions({ axis: "x" }),
            returnAxisLabelStateVariableDefinitions({ axis: "y" }),
        );

        // Checked here rather than at each use, because the ratio has two
        // consumers that would otherwise disagree: the renderer writes it
        // straight into CSS `aspect-ratio` on the chart's box, and
        // `prefigureXML` divides the width by it to get the drawing's height.
        // CSS drops an `aspect-ratio` that is not a positive finite number as
        // invalid, leaving the box with no height at all while the drawing
        // inside it was built at some other ratio entirely.
        //
        // Silently, unlike `barWidth` below: `<graph>` warns about its own bad
        // `aspectRatio` with a message naming `<graph>` and its default of 1,
        // so there is nothing here to reuse and a chart-specific one is out of
        // scope. What an author has instead is this state variable, which is
        // public: `$chart.aspectRatio` reports the ratio the chart was drawn
        // at, so the substitution can at least be read back.
        stateVariableDefinitions.aspectRatio = {
            description: "The aspect ratio (width / height) of the chart.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                aspectRatioAttr: {
                    dependencyType: "stateVariable",
                    variableName: "aspectRatioAttr",
                },
            }),
            definition({ dependencyValues }) {
                const requested = dependencyValues.aspectRatioAttr;
                // Finite and positive is not enough: the drawing's height is
                // the width divided by this, and dividing by a subnormal
                // overflows to `Infinity`, which `formatNumber` writes as
                // `null` — so PreFigure would be handed a diagram it cannot
                // compile. What has to be finite is the height it produces, at
                // the widest the chart can be.
                const heightAtWidest = widthsBySize.full / requested;
                const aspectRatio =
                    Number.isFinite(requested) &&
                    requested > 0 &&
                    Number.isFinite(heightAtWidest)
                        ? requested
                        : DEFAULT_ASPECT_RATIO;

                return { setValue: { aspectRatio } };
            },
        };

        // A bar fills a fraction of its one-unit slot, so a width at or below
        // zero draws nothing and one above 1 makes neighboring bars overlap.
        // Checked here rather than where the rectangles are laid out, so that
        // `chartGeometry` is handed a width it can use as given and the number
        // read back from the chart is the one it was drawn with.
        stateVariableDefinitions.barWidth = {
            groupName: "marks",
            description:
                "How much of its slot each bar fills: greater than 0 and at most 1.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                barWidthAttr: {
                    dependencyType: "stateVariable",
                    variableName: "barWidthAttr",
                },
            }),
            definition({ dependencyValues }) {
                const requested = dependencyValues.barWidthAttr;
                if (requested > 0 && requested <= 1) {
                    return { setValue: { barWidth: requested } };
                }

                return {
                    setValue: { barWidth: DEFAULT_BAR_WIDTH },
                    sendDiagnostics: [
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0143",
                            args: { barWidth: String(requested) },
                        }),
                    ],
                };
            },
        };

        // The PreFigure renderer starts diagcess — the thing that makes the
        // drawing walkable by a screen reader — only when this is true, because
        // for `<graph>` it means "the author wrote an `<annotations>` child".
        // A chart always writes its own, one per bar under a figure-level
        // parent, so for `<chart>` the answer is always yes; leaving it
        // false would emit the annotations and then never let anyone reach
        // them.
        stateVariableDefinitions.hasAuthorAnnotations = {
            description:
                "Whether the chart carries annotations to navigate. Always true: they are generated from the marks the chart drew.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { hasAuthorAnnotations: true } }),
        };

        Object.assign(
            stateVariableDefinitions,
            returnShortDescriptionStateVariableDefinition({
                componentType: "chart",
                componentName: "chart",
            }),
        );

        // The style number each `<series>` child takes when its author named
        // none: the chart's own, then one more for every series after the
        // first, which is the categorical color scale a grouping variable gets
        // in every plotting package. Keyed by component index rather than
        // ordered, because it is the series that reads it and a series knows
        // only its own index.
        //
        // The chart works this out rather than the series, because a series
        // cannot see its siblings. The direction of the dependency is what
        // keeps it acyclic: this reads the series children's identities and
        // nothing they compute, so a series may read it back to settle its
        // style.
        stateVariableDefinitions.seriesStyleNumbers = {
            description:
                "The default style number for each series child, by component index.",
            returnDependencies: () => ({
                seriesChildren: {
                    dependencyType: "child",
                    childGroups: ["series"],
                },
                styleNumber: {
                    dependencyType: "stateVariable",
                    variableName: "styleNumber",
                },
            }),
            definition({ dependencyValues }) {
                const seriesStyleNumbers = {};
                dependencyValues.seriesChildren.forEach((child, ind) => {
                    seriesStyleNumbers[child.componentIdx] =
                        dependencyValues.styleNumber + ind;
                });
                return { setValue: { seriesStyleNumbers } };
            },
        };

        // The one place the two ways of giving a chart its data are reconciled,
        // so that everything downstream sees a list of series whatever was
        // written. A chart with `<series>` children has those; a chart with
        // bare values has one series holding them, drawn in the chart's own
        // style and carrying no label — which is exactly a chart of one
        // unnamed group, and needs no legend.
        stateVariableDefinitions.seriesData = {
            description:
                "Each series' label, values and style, in the order they are drawn.",
            returnDependencies: () => ({
                seriesChildren: {
                    dependencyType: "child",
                    childGroups: ["series"],
                    variableNames: [
                        "label",
                        "labelHasLatex",
                        "values",
                        "x",
                        "styleNumber",
                        "selectedStyle",
                        "hiddenIgnoreParent",
                    ],
                },
                ...returnContentLocaleDependencies(),
                styleNumber: {
                    dependencyType: "stateVariable",
                    variableName: "styleNumber",
                },
                valueChildren: {
                    dependencyType: "child",
                    childGroups: ["numbers", "maths"],
                    variableNames: ["value"],
                },
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
            }),
            definition({ dependencyValues }) {
                const { seriesChildren, valueChildren } = dependencyValues;

                if (seriesChildren.length === 0) {
                    return {
                        setValue: {
                            seriesData: [
                                {
                                    label: "",
                                    labelHasLatex: false,
                                    values: numericValuesFromValueChildren(
                                        valueChildren,
                                    ),
                                    // Bare values carry no coordinates, so the
                                    // horizontal axis stays categorical — which
                                    // is what makes `<chart type="line">4 9 2`
                                    // draw a line over three categories rather
                                    // than refuse for want of an `x`.
                                    x: null,
                                    // The chart's own, which is what a series
                                    // written out with no style of its own
                                    // would have taken.
                                    styleNumber: dependencyValues.styleNumber,
                                    selectedStyle:
                                        dependencyValues.selectedStyle,
                                    unlabeledName: contentTranslator(
                                        dependencyValues,
                                    )("chart-unlabeled-series", {
                                        position: "1",
                                    }),
                                },
                            ],
                        },
                    };
                }

                const t = contentTranslator(dependencyValues);

                // A hidden series is dropped rather than drawn and hidden,
                // which is what `hide` means for a drawn child of a container:
                // `<graph><point hide /></graph>` puts nothing on the page
                // either. Dropping it here rather than at the drawing keeps
                // `values`, `numSeries`, the categories the axis is as long as,
                // and the picture all describing the same chart — a hidden
                // series still reports its own `values` through its own name,
                // exactly as a hidden `<point>` still reports its coordinates.
                //
                // Its *position* is not reclaimed: `seriesStyleNumbers` is
                // assigned from the child list, so hiding the second of three
                // leaves the third the color it already had rather than
                // recoloring the chart around it.
                // `hiddenIgnoreParent` rather than `hidden`, which is the
                // whole distinction: a series hidden on its own account is not
                // part of the chart, while one hidden only because the chart is
                // still holds data an author may be writing about beside the
                // picture. `hidden` is inherited, so filtering on it would let
                // `<chart hide>` empty the chart it was meant only to conceal.
                //
                // It is the right test rather than merely a narrower one: it
                // recurses through composites, so a `<group hide>` around a
                // series takes that series out whether or not the chart itself
                // is hidden — which reading the series' own `hide` gets wrong.
                const seriesData = seriesChildren
                    .filter((child) => !child.stateValues.hiddenIgnoreParent)
                    .map((child, ind) => ({
                        label: child.stateValues.label,
                        labelHasLatex: child.stateValues.labelHasLatex,
                        values: child.stateValues.values,
                        // Null on a series that gave none, which is what puts
                        // the chart on a categorical axis rather than a
                        // numeric one.
                        x: child.stateValues.x,
                        // Carried alongside the resolved style because a pie
                        // needs the *number* rather than the style: its slices
                        // take a run of numbers starting from this one.
                        styleNumber: child.stateValues.styleNumber,
                        selectedStyle: child.stateValues.selectedStyle,
                        // Built here, where the document's language is known.
                        // The drawing has no way to ask, and a bare position
                        // number is what a screen reader would otherwise
                        // announce between a category and a value.
                        unlabeledName: t("chart-unlabeled-series", {
                            position: String(ind + 1),
                        }),
                    }));

                // A value written beside the series is not a series of its own
                // and is not part of any of them, so there is nowhere on the
                // chart to draw it. Dropping it silently would leave the author
                // reading a chart that is missing data they can see in their
                // source.
                return {
                    setValue: { seriesData },
                    sendDiagnostics:
                        valueChildren.length > 0
                            ? [
                                  codedDiagnostic({
                                      type: "warning",
                                      code: "doenet-w0147",
                                  }),
                              ]
                            : [],
                };
            },
        };

        stateVariableDefinitions.numSeries = {
            groupName: "data",
            highlighted: true,
            description:
                "How many series the chart holds: its `<series>` children that are not hidden, or one for a chart of bare values. Not necessarily how many are drawn — a pie and a histogram each draw the first of them and no more.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                seriesData: {
                    dependencyType: "stateVariable",
                    variableName: "seriesData",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { numSeries: dependencyValues.seriesData.length },
            }),
        };

        // `values` rather than `barValues`: what a chart is given is values,
        // and only the drawing of them is bar-shaped. A pie chart takes the
        // same numbers, so naming it after the mark would leave a `pieValues`
        // beside it reporting the identical ones.
        //
        // Every series' values, one after another. A chart of one series — the
        // usual chart — reports exactly the values it was given, and a chart of
        // several reports all of its data; `$series.values` on a named series
        // is how one group is read on its own.
        stateVariableDefinitions.values = {
            groupName: "data",
            highlighted: true,
            description: "Every value charted, series by series.",
            public: true,
            isArray: true,
            entryPrefixes: ["value"],
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnArraySizeDependencies: () => ({
                seriesData: {
                    dependencyType: "stateVariable",
                    variableName: "seriesData",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [
                    dependencyValues.seriesData.reduce(
                        (total, oneSeries) => total + oneSeries.values.length,
                        0,
                    ),
                ];
            },
            returnArrayDependenciesByKey: () => ({
                globalDependencies: {
                    seriesData: {
                        dependencyType: "stateVariable",
                        variableName: "seriesData",
                    },
                },
            }),
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                const flattened = globalDependencyValues.seriesData.flatMap(
                    (oneSeries) => oneSeries.values,
                );
                const values = {};
                for (const arrayKey of arrayKeys) {
                    values[arrayKey] = flattened[arrayKey];
                }
                return { setValue: { values } };
            },
        };

        stateVariableDefinitions.categories = {
            groupName: "axes",
            description:
                "The name of each position in the data, in order: the label under each bar, or the name of each slice of a pie. Empty on a box plot, whose positions are its series, and on a histogram, whose positions are its bins.",
            public: true,
            isArray: true,
            entryPrefixes: ["category"],
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            // As many as the longest series: every series is drawn against the
            // same categories, so a series that runs short leaves the later
            // slots empty rather than shortening the axis under the others.
            //
            // None at all on the two types whose series holds observations
            // rather than one value per category. A box plot's positions are
            // its series, named by their own labels; a histogram's are the bins
            // it divided the scale into, named by the numbers they run between.
            // Reporting one category per observation would name a hundred
            // positions on a chart that has three.
            returnArraySizeDependencies: () => ({
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                seriesData: {
                    dependencyType: "stateVariable",
                    variableName: "seriesData",
                },
            }),
            returnArraySize({ dependencyValues }) {
                if (
                    dependencyValues.type === "box" ||
                    dependencyValues.type === "histogram"
                ) {
                    return [0];
                }
                return [
                    dependencyValues.seriesData.reduce(
                        (longest, oneSeries) =>
                            Math.max(longest, oneSeries.values.length),
                        0,
                    ),
                ];
            },
            returnArrayDependenciesByKey: () => ({
                globalDependencies: {
                    categoriesAttr: {
                        dependencyType: "attributeComponent",
                        attributeName: "categories",
                        variableNames: ["texts"],
                    },
                },
            }),
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                const declared =
                    globalDependencyValues.categoriesAttr?.stateValues.texts;
                const categories = {};
                for (const arrayKey of arrayKeys) {
                    const ind = Number(arrayKey);
                    // A category past the end of every series never reaches
                    // this loop, whose keys are sized by the longest of them; a
                    // slot with no category of its own falls back to its
                    // position.
                    const declaredLabel = declared?.[ind];
                    categories[arrayKey] =
                        declaredLabel === undefined
                            ? String(ind + 1)
                            : declaredLabel;
                }
                return { setValue: { categories } };
            },
        };

        // The last `<title>` child, the way the last `<xLabel>` child wins on
        // the axis: a chart written twice over should read as the later of the
        // two rather than as an error about the earlier.
        stateVariableDefinitions.title = {
            groupName: "marks",
            description:
                "The chart's title, or the empty string when it has none.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                titleChildren: {
                    dependencyType: "child",
                    childGroups: ["titles"],
                    variableNames: ["text", "hiddenIgnoreParent"],
                },
            }),
            definition({ dependencyValues }) {
                const titleChild =
                    dependencyValues.titleChildren[
                        dependencyValues.titleChildren.length - 1
                    ];
                // A hidden title is no title. The text is drawn into the
                // diagram rather than rendered as a child component, so `hide`
                // reaches it only by being read here — where a hidden
                // `<label>` child is already handled the same way
                // (`utils/label.ts`).
                return {
                    setValue: {
                        title: titleChild?.stateValues.hiddenIgnoreParent
                            ? ""
                            : (titleChild?.stateValues.text ?? ""),
                    },
                };
            },
        };

        // Whether a legend is drawn, not whether one was asked for, so the
        // value an author reads back is the one they can see.
        //
        // Both conditions the drawing makes are here, and the second is asked
        // of the geometry rather than of the data, by the same test the XML
        // builds its items from. A label alone is not enough: an item's swatch
        // is built from a bar it points at, so a named series whose every value
        // is non-finite gets no item, and a chart of nothing but such series
        // gets no legend however it was labeled. Asking the data instead would
        // leave `$chart.showLegend` true beside a chart with no legend in it —
        // the kind of property it is worse to expose than to omit.
        stateVariableDefinitions.showLegend = {
            groupName: "legend",
            description: "Whether a legend is drawn.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                legend: {
                    dependencyType: "stateVariable",
                    variableName: "legend",
                },
                chartGeometry: {
                    dependencyType: "stateVariable",
                    variableName: "chartGeometry",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        showLegend:
                            dependencyValues.legend &&
                            chartLegendHasItems(dependencyValues.chartGeometry),
                    },
                };
            },
        };

        // Renderer-neutral: bar rectangles and bounds in data coordinates,
        // with nothing PreFigure-specific in it. Every input it reads has
        // already been checked by the state variable above it, so this is
        // geometry and nothing else.
        //
        // Null when `type` names no chart this component knows how to draw,
        // which is the one place that decision is made: everything downstream —
        // the axis the chart reports, the XML it renders, the frame the
        // renderer puts around it — reads the absence from here rather than
        // re-deciding it against `type`. A second chart type adds a branch to
        // this definition and nothing below it changes shape.
        //
        // Only what is *drawn* is gated here. The checks above still run and
        // still report on a chart with no type: `barWidth="5"` is wrong however
        // the values are drawn, and a chart with no `<shortDescription>` will
        // be inaccessible the moment a type is named. Holding those back would
        // mean naming the type is what reveals the next problem.
        stateVariableDefinitions.chartGeometry = {
            description:
                "The marks of the chart, in data coordinates, with the bounds they are drawn in where the type has any, or null when there is no chart to draw.",
            returnDependencies: () => ({
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                seriesData: {
                    dependencyType: "stateVariable",
                    variableName: "seriesData",
                },
                categories: {
                    dependencyType: "stateVariable",
                    variableName: "categories",
                },
                // The attribute rather than the state variable, which fills in
                // the positions where the author named nothing: what the box
                // branch below has to know is whether they wrote any, not what
                // the axis would have been labeled.
                categoriesAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "categories",
                    variableNames: ["texts"],
                },
                barWidth: {
                    dependencyType: "stateVariable",
                    variableName: "barWidth",
                },
                // The private name the attribute is read into, so that
                // `usedDefault` can say whether a width was asked for at all —
                // which is what the histogram branch below has to know, the
                // public `barWidth` being 0.8 either way.
                barWidthAttr: {
                    dependencyType: "stateVariable",
                    variableName: "barWidthAttr",
                },
                binsAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "bins",
                    variableNames: ["numbers"],
                },
                closed: {
                    dependencyType: "stateVariable",
                    variableName: "closed",
                },
                layout: {
                    dependencyType: "stateVariable",
                    variableName: "layout",
                },
                xMinAttr: {
                    dependencyType: "stateVariable",
                    variableName: "xMinAttr",
                },
                xMaxAttr: {
                    dependencyType: "stateVariable",
                    variableName: "xMaxAttr",
                },
                yMinAttr: {
                    dependencyType: "stateVariable",
                    variableName: "yMinAttr",
                },
                yMaxAttr: {
                    dependencyType: "stateVariable",
                    variableName: "yMaxAttr",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                // A type the attribute rejected arrives here as `null`,
                // exactly as a missing one does, so both get the one message —
                // which is why it says no chart was named rather than that the
                // attribute is missing. The value that was rejected has
                // already been named in a message of its own.
                const { type } = dependencyValues;

                if (!DRAWABLE_TYPES.has(type)) {
                    return {
                        setValue: { chartGeometry: null },
                        sendDiagnostics: [
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0146",
                            }),
                        ],
                    };
                }

                if (type === "bar") {
                    const geometry = computeBarChartGeometry({
                        series: dependencyValues.seriesData.map(
                            ({ label, values }) => ({ label, values }),
                        ),
                        labels: dependencyValues.categories,
                        barWidth: dependencyValues.barWidth,
                        layout: dependencyValues.layout,
                        yMinAttr: dependencyValues.yMinAttr,
                        yMaxAttr: dependencyValues.yMaxAttr,
                    });

                    return {
                        setValue: { chartGeometry: geometry },
                        // A value that is not a finite number gets no bar.
                        // Saying so matters because the alternative reading of
                        // a missing bar is a value of zero, and the author
                        // cannot tell the two apart by looking. The message
                        // carries no count, so the append-only diagnostics
                        // queue holds one of it however often the values
                        // change.
                        sendDiagnostics:
                            geometry.undrawnValues > 0
                                ? [
                                      codedDiagnostic({
                                          type: "warning",
                                          code: "doenet-w0144",
                                      }),
                                  ]
                                : [],
                    };
                }

                if (type === "pie") {
                    const geometry = computePieChartGeometry({
                        series: dependencyValues.seriesData.map(
                            ({ label, values }) => ({ label, values }),
                        ),
                        labels: dependencyValues.categories,
                    });

                    // Four separate things can go wrong with a pie and they
                    // are reported separately, because the fix for each is
                    // different: a value that is not a number, a value that is
                    // negative, a total with no share to take of it, and more
                    // series than a pie draws. A chart can hit more than one.
                    const sendDiagnostics = [];
                    if (geometry.undrawnValues > 0) {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0149",
                            }),
                        );
                    }
                    if (geometry.negativeValues > 0) {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0150",
                            }),
                        );
                    }
                    // Only where there were values to total. A pie whose every
                    // value was rejected has already been told why, and a pie
                    // with no values at all is one being written rather than
                    // one that is wrong.
                    if (geometry.valuesInTotal > 0 && !(geometry.total > 0)) {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0151",
                            }),
                        );
                    }
                    if (geometry.undrawnSeries > 0) {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0152",
                            }),
                        );
                    }

                    return {
                        setValue: { chartGeometry: geometry },
                        sendDiagnostics,
                    };
                }

                if (type === "box") {
                    const geometry = computeBoxChartGeometry({
                        series: dependencyValues.seriesData.map(
                            ({ label, values }) => ({ label, values }),
                        ),
                        yMinAttr: dependencyValues.yMinAttr,
                        yMaxAttr: dependencyValues.yMaxAttr,
                    });

                    const sendDiagnostics = [];
                    // An observation that is not a finite number is left out of
                    // the summary. Saying so matters more here than on a bar
                    // chart, where the reader can see the empty slot: a
                    // dropped observation moves every quartile of the box drawn
                    // from it and leaves nothing on the page to notice.
                    if (geometry.undrawnValues > 0) {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0154",
                            }),
                        );
                    }
                    // The names in `categories` are text an author wrote
                    // for a reader, and a box plot has no positions for them
                    // to name — the same reason an `<xLabel>` on a pie is
                    // reported rather than dropped in silence.
                    if (
                        dependencyValues.categoriesAttr?.stateValues.texts
                            ?.length > 0
                    ) {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0155",
                            }),
                        );
                    }

                    return {
                        setValue: { chartGeometry: geometry },
                        sendDiagnostics,
                    };
                }

                if (type === "histogram") {
                    const geometry = computeHistogramChartGeometry({
                        series: dependencyValues.seriesData.map(
                            ({ label, values }) => ({ label, values }),
                        ),
                        bins:
                            dependencyValues.binsAttr?.stateValues.numbers ??
                            null,
                        closed: dependencyValues.closed,
                        xMinAttr: dependencyValues.xMinAttr,
                        xMaxAttr: dependencyValues.xMaxAttr,
                        yMinAttr: dependencyValues.yMinAttr,
                        yMaxAttr: dependencyValues.yMaxAttr,
                    });

                    const sendDiagnostics = [];
                    // An observation that is not a finite number falls in no
                    // bin. Saying so matters more here than on a bar chart,
                    // where the reader can see the empty slot: a dropped
                    // observation lowers a bar by one and leaves nothing on
                    // the page to notice.
                    if (geometry.undrawnValues > 0) {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0156",
                            }),
                        );
                    }
                    if (geometry.undrawnSeries > 0) {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0157",
                            }),
                        );
                    }
                    if (geometry.binsProblem === "count") {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0158",
                                args: {
                                    bins: String(
                                        dependencyValues.binsAttr?.stateValues
                                            .numbers[0],
                                    ),
                                    maximum: String(MAX_REQUESTED_BINS),
                                },
                            }),
                        );
                    }
                    if (geometry.binsProblem === "cutPoints") {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0159",
                            }),
                        );
                    }
                    // Information rather than a warning, and only where the
                    // author wrote the cut points: bins the chart chose cover
                    // the data, and bins an author chose may deliberately leave
                    // some of it out. A reader cannot see what is missing
                    // either way.
                    if (geometry.uncountedValues > 0) {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "info",
                                code: "doenet-i0052",
                            }),
                        );
                    }
                    // The names in `categories` are text an author wrote for a
                    // reader, and a histogram has no positions for them to
                    // name — the same reason a box plot reports them rather
                    // than dropping them in silence.
                    if (
                        dependencyValues.categoriesAttr?.stateValues.texts
                            ?.length > 0
                    ) {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0160",
                            }),
                        );
                    }
                    // A gap between the bars is what says the positions are
                    // separate things, and a histogram's are neighboring
                    // stretches of one scale, so there is no slot for a width
                    // to be a fraction of.
                    if (!usedDefault.barWidthAttr) {
                        sendDiagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0161",
                            }),
                        );
                    }

                    return {
                        setValue: { chartGeometry: geometry },
                        sendDiagnostics,
                    };
                }

                // `line` and `scatter` are the same points, drawn with or
                // without a path through them, so they share their geometry
                // and differ only in what is made of it below.
                const geometry = computePointChartGeometry({
                    series: dependencyValues.seriesData.map(
                        ({ label, values, x }) => ({ label, values, x }),
                    ),
                    labels: dependencyValues.categories,
                    xMinAttr: dependencyValues.xMinAttr,
                    xMaxAttr: dependencyValues.xMaxAttr,
                    yMinAttr: dependencyValues.yMinAttr,
                    yMaxAttr: dependencyValues.yMaxAttr,
                });

                return {
                    setValue: { chartGeometry: geometry },
                    // A point needs both of its coordinates, so this covers a
                    // value that is not a finite number *and* a value whose
                    // `x` ran out — the second of which is what a series given
                    // fewer coordinates than values produces, and is otherwise
                    // indistinguishable from having asked for fewer points.
                    sendDiagnostics:
                        geometry.undrawnValues > 0
                            ? [
                                  codedDiagnostic({
                                      type: "warning",
                                      code: "doenet-w0148",
                                  }),
                              ]
                            : [],
                };
            },
        };

        // The style each slice of a pie is drawn in: the drawn series' number,
        // then one more for every slice after the first — the same categorical
        // color scale `seriesStyleNumbers` hands the series of every other
        // type, applied a level down. A pie is the one chart that colors
        // *within* a series, because its slices rather than its groups are what
        // a reader tells apart.
        //
        // The run starts at the *series'* number rather than the chart's, which
        // are the same number until a `<series>` names one of its own. That is
        // the only reading of `<series styleNumber="4">` a pie has: the
        // attribute names one color, and a pie needs a color per slice, so what
        // it can say is where the run begins. A bar chart of the same markup
        // draws its bars in style 4, and this draws the first slice in style 4.
        //
        // Resolved here rather than in the drawing because a style number
        // means whatever the document's `<styleDefinition>` children and the
        // reader's palette say it does, and only the core can ask.
        //
        // The count is read off the geometry rather than the data, so that a
        // slice's number follows the order the slices are drawn in. A value
        // that got no share of the total is not a slice and takes no number; a
        // value of zero is a slice and takes one, keeping the colors of the
        // slices after it where they were.
        stateVariableDefinitions.sliceStyles = {
            description:
                "The style each of a pie's slices takes, in the order they are given — including one whose share of the total is nothing and so is never drawn.",
            returnDependencies: () => ({
                chartGeometry: {
                    dependencyType: "stateVariable",
                    variableName: "chartGeometry",
                },
                seriesData: {
                    dependencyType: "stateVariable",
                    variableName: "seriesData",
                },
                styleNumber: {
                    dependencyType: "stateVariable",
                    variableName: "styleNumber",
                },
                ancestorWithStyle: {
                    dependencyType: "ancestor",
                    variableNames: [
                        "styleDefinitions",
                        "activeStylePaletteName",
                        "readerStyleOverrides",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                const geometry = dependencyValues.chartGeometry;
                const numSlices =
                    geometry?.kind === "pie" ? geometry.slices.length : 0;

                // The series a pie draws is the first one, and the chart's own
                // number stands in where there is no series to ask — a chart
                // whose every series is hidden, which has no slices either.
                const runStart =
                    dependencyValues.seriesData[0]?.styleNumber ??
                    dependencyValues.styleNumber;

                const sliceStyles = [];
                for (let ind = 0; ind < numSlices; ind++) {
                    sliceStyles.push(
                        selectStyleForStyleNumber({
                            styleNumber: runStart + ind,
                            ancestorWithStyle:
                                dependencyValues.ancestorWithStyle,
                        }),
                    );
                }

                return { setValue: { sliceStyles } };
            },
        };

        // The vertical extent the chart was actually drawn at. Neither `yMin`
        // nor `yMax` the attribute answers that question: both are optional,
        // and both are dropped together when what they ask for is not a box
        // there is room to draw in. So the pair is defined off the geometry,
        // which is where the automatic bounds and the author's are reconciled —
        // and where a chart that was never drawn has no axis to report, which
        // is `null` rather than a number nothing on the screen backs up.
        // The horizontal extent the chart was actually drawn at, for the same
        // reason the vertical pair is defined off the geometry: both bounds are
        // optional and both are dropped together when what they ask for is not
        // a box there is room to draw in. Null on a chart with a categorical
        // axis as well as on one that was never drawn — the positions there are
        // 1, 2, 3 whatever the categories say, so there is no measured extent
        // to report.
        stateVariableDefinitions.xMin = {
            groupName: "axes",
            description:
                "The leftmost value shown on the horizontal axis, or null when it is not a numeric axis.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "xMax",
                    groupName: "axes",
                    description:
                        "The rightmost value shown on the horizontal axis, or null when it is not a numeric axis.",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "number",
                    },
                },
            ],
            returnDependencies: () => ({
                chartGeometry: {
                    dependencyType: "stateVariable",
                    variableName: "chartGeometry",
                },
            }),
            definition({ dependencyValues }) {
                const geometry = dependencyValues.chartGeometry;
                // A measured horizontal axis belongs to a histogram, whose
                // bars divide a numeric scale, and to a point chart whose
                // series carried an `x`. Everywhere else there is no measured
                // extent to report: `slots` is the categorical axis'
                // positions, so a point chart that has them is one whose axis
                // carries names instead, a bar chart's positions are always
                // categories, a box plot's are always its series, and a pie
                // has no axes at all.
                if (
                    geometry?.kind !== "histogram" &&
                    (geometry?.kind !== "point" || geometry.slots)
                ) {
                    return { setValue: { xMin: null, xMax: null } };
                }
                const [xMin, , xMax] = geometry.bounds;
                return { setValue: { xMin, xMax } };
            },
        };

        stateVariableDefinitions.yMin = {
            groupName: "axes",
            description:
                "The lowest value shown on the vertical axis, or null when the chart has no axes or was not drawn.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "yMax",
                    groupName: "axes",
                    description:
                        "The highest value shown on the vertical axis, or null when the chart has no axes or was not drawn.",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "number",
                    },
                },
            ],
            returnDependencies: () => ({
                chartGeometry: {
                    dependencyType: "stateVariable",
                    variableName: "chartGeometry",
                },
            }),
            definition({ dependencyValues }) {
                const geometry = dependencyValues.chartGeometry;
                // A pie is drawn in no axes, so it has no vertical extent to
                // report — the same absence a chart that was never drawn has.
                if (!geometry || geometry.kind === "pie") {
                    return { setValue: { yMin: null, yMax: null } };
                }
                const [, yMin, , yMax] = geometry.bounds;
                return { setValue: { yMin, yMax } };
            },
        };

        // The cut points a histogram divided its scale at, and how many
        // observations fell between each pair of them.
        //
        // Readable back because that is the whole reason a histogram is binned
        // here rather than by the drawing: a document can say how many fell in
        // the tallest bin, ask about it in an `<answer>`, or put the counts in
        // a table beside the picture. A chart of any other type reports none of
        // either, having divided nothing.
        //
        // Both are read off the geometry rather than recomputed from `bins`, so
        // that what is reported is what was drawn: cut points the chart chose
        // for itself are reported the same way the author's are, and a `bins`
        // that described no set of intervals reports the bins that replaced it.
        stateVariableDefinitions.binEdges = {
            groupName: "data",
            highlighted: true,
            description:
                "The cut points a histogram's bins run between, in order: one more than the number of bins. Empty for every other type.",
            public: true,
            isArray: true,
            entryPrefixes: ["binEdge"],
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnArraySizeDependencies: () => ({
                chartGeometry: {
                    dependencyType: "stateVariable",
                    variableName: "chartGeometry",
                },
            }),
            returnArraySize({ dependencyValues }) {
                const geometry = dependencyValues.chartGeometry;
                return [
                    geometry?.kind === "histogram" ? geometry.edges.length : 0,
                ];
            },
            returnArrayDependenciesByKey: () => ({
                globalDependencies: {
                    chartGeometry: {
                        dependencyType: "stateVariable",
                        variableName: "chartGeometry",
                    },
                },
            }),
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                const geometry = globalDependencyValues.chartGeometry;
                const edges =
                    geometry?.kind === "histogram" ? geometry.edges : [];
                const binEdges = {};
                for (const arrayKey of arrayKeys) {
                    binEdges[arrayKey] = edges[arrayKey];
                }
                return { setValue: { binEdges } };
            },
        };

        stateVariableDefinitions.binCounts = {
            groupName: "data",
            highlighted: true,
            description:
                "How many observations fell in each of a histogram's bins, in order — the height of each bar. Empty for every other type.",
            public: true,
            isArray: true,
            entryPrefixes: ["binCount"],
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnArraySizeDependencies: () => ({
                chartGeometry: {
                    dependencyType: "stateVariable",
                    variableName: "chartGeometry",
                },
            }),
            returnArraySize({ dependencyValues }) {
                const geometry = dependencyValues.chartGeometry;
                return [
                    geometry?.kind === "histogram" ? geometry.bins.length : 0,
                ];
            },
            returnArrayDependenciesByKey: () => ({
                globalDependencies: {
                    chartGeometry: {
                        dependencyType: "stateVariable",
                        variableName: "chartGeometry",
                    },
                },
            }),
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                const geometry = globalDependencyValues.chartGeometry;
                const bins =
                    geometry?.kind === "histogram" ? geometry.bins : [];
                const binCounts = {};
                for (const arrayKey of arrayKeys) {
                    binCounts[arrayKey] = bins[arrayKey]?.count;
                }
                return { setValue: { binCounts } };
            },
        };

        stateVariableDefinitions.prefigureXML = {
            description:
                "The PreFigure-formatted XML rendered for this chart, or null when there is no chart to draw.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                chartGeometry: {
                    dependencyType: "stateVariable",
                    variableName: "chartGeometry",
                },
                width: {
                    dependencyType: "stateVariable",
                    variableName: "width",
                },
                aspectRatio: {
                    dependencyType: "stateVariable",
                    variableName: "aspectRatio",
                },
                xLabel: {
                    dependencyType: "stateVariable",
                    variableName: "xLabel",
                },
                xLabelHasLatex: {
                    dependencyType: "stateVariable",
                    variableName: "xLabelHasLatex",
                },
                yLabel: {
                    dependencyType: "stateVariable",
                    variableName: "yLabel",
                },
                yLabelHasLatex: {
                    dependencyType: "stateVariable",
                    variableName: "yLabelHasLatex",
                },
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                markers: {
                    dependencyType: "stateVariable",
                    variableName: "markers",
                },
                title: {
                    dependencyType: "stateVariable",
                    variableName: "title",
                },
                showLegend: {
                    dependencyType: "stateVariable",
                    variableName: "showLegend",
                },
                legendPosition: {
                    dependencyType: "stateVariable",
                    variableName: "legendPosition",
                },
                displayValues: {
                    dependencyType: "stateVariable",
                    variableName: "displayValues",
                },
                shortDescription: {
                    dependencyType: "stateVariable",
                    variableName: "shortDescription",
                },
                seriesData: {
                    dependencyType: "stateVariable",
                    variableName: "seriesData",
                },
                sliceStyles: {
                    dependencyType: "stateVariable",
                    variableName: "sliceStyles",
                },
                // For the words a box plot's annotations need. A bar is
                // announced as its category and its value and a point as its
                // coordinates, because there the position says which number is
                // which; five numbers at one position have nothing but their
                // naming to tell them apart, and a name built here would be
                // English in a document that may be in any language.
                ...returnContentLocaleDependencies(),
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition({ dependencyValues }) {
                // No geometry, no drawing: `chartGeometry` has already said
                // why, and the renderer takes a null here as "put nothing on
                // the page", frame and all.
                if (dependencyValues.chartGeometry === null) {
                    return { setValue: { prefigureXML: null } };
                }

                const darkMode =
                    dependencyValues.document?.stateValues.theme === "dark";

                const widthPx = dependencyValues.width?.size ?? 425;
                const heightPx = widthPx / dependencyValues.aspectRatio;

                // A pie takes none of what follows: it has no axes to name, and
                // its colors are chosen per slice rather than per series, so
                // the style it draws with is a list rather than one series'.
                if (dependencyValues.type === "pie") {
                    // An axis name on a pie is authored text with nowhere to
                    // go, which is worse than an ignored attribute: the author
                    // wrote something for the reader and it is not on the page.
                    // Reported rather than dropped in silence, the way an
                    // `<annotations>` child of a chart is reported as a child
                    // this is not.
                    const axisNames = [
                        dependencyValues.xLabel,
                        dependencyValues.yLabel,
                    ].some((name) => name?.trim());

                    const { xml, diagnostics } = createPieChartPrefigureXML({
                        geometry: dependencyValues.chartGeometry,
                        sliceStyles: dependencyValues.sliceStyles.map((style) =>
                            resolveSelectedStyleForTheme(style, darkMode),
                        ),
                        widthPx,
                        heightPx,
                        title: dependencyValues.title,
                        showLegend: dependencyValues.showLegend,
                        legendPosition: dependencyValues.legendPosition,
                        displayValues: dependencyValues.displayValues,
                        shortDescription: dependencyValues.shortDescription,
                    });

                    if (axisNames) {
                        diagnostics.push(
                            codedDiagnostic({
                                type: "warning",
                                code: "doenet-w0153",
                            }),
                        );
                    }

                    return {
                        setValue: { prefigureXML: xml },
                        sendDiagnostics: diagnostics,
                    };
                }

                // Resolved once, for the box branch below and the shared
                // path after it.
                const seriesRendering = dependencyValues.seriesData.map(
                    ({
                        label,
                        labelHasLatex,
                        selectedStyle,
                        unlabeledName,
                    }) => ({
                        label,
                        labelHasLatex,
                        unlabeledName,
                        // Resolved here rather than in the geometry, which is
                        // renderer-neutral and has no view of the page's
                        // theme: what a series is drawn in depends on which
                        // theme the reader is in, where what it is drawn as
                        // does not.
                        selectedStyle: resolveSelectedStyleForTheme(
                            selectedStyle,
                            darkMode,
                        ),
                    }),
                );

                if (dependencyValues.type === "box") {
                    const t = contentTranslator(dependencyValues);

                    const { xml, diagnostics } = createBoxChartPrefigureXML({
                        geometry: dependencyValues.chartGeometry,
                        seriesRendering,
                        // Named the way a bar's annotation is — the label on
                        // the axis, then what is drawn there — so that a box
                        // read on its own says which group it summarizes.
                        boxAnnotationText: ({ label, ...summary }) =>
                            `${label}: ${t("chart-box-summary", summary)}`,
                        outlierAnnotationText: ({ label, value }) =>
                            `${label}: ${t("chart-box-outlier", { value })}`,
                        widthPx,
                        heightPx,
                        xLabel: dependencyValues.xLabel,
                        xLabelHasLatex: dependencyValues.xLabelHasLatex,
                        yLabel: dependencyValues.yLabel,
                        yLabelHasLatex: dependencyValues.yLabelHasLatex,
                        title: dependencyValues.title,
                        shortDescription: dependencyValues.shortDescription,
                        darkMode,
                    });

                    return {
                        setValue: { prefigureXML: xml },
                        sendDiagnostics: diagnostics,
                    };
                }

                if (dependencyValues.type === "histogram") {
                    const t = contentTranslator(dependencyValues);

                    const { xml, diagnostics } =
                        createHistogramChartPrefigureXML({
                            geometry: dependencyValues.chartGeometry,
                            seriesRendering,
                            // The two cut points and the count, with the count
                            // named: a bar's height is a number of things, and
                            // three bare numbers in a row say nothing about
                            // which of them is which.
                            binAnnotationText: (parts) =>
                                t("chart-histogram-bin", parts),
                            widthPx,
                            heightPx,
                            xLabel: dependencyValues.xLabel,
                            xLabelHasLatex: dependencyValues.xLabelHasLatex,
                            yLabel: dependencyValues.yLabel,
                            yLabelHasLatex: dependencyValues.yLabelHasLatex,
                            title: dependencyValues.title,
                            showLegend: dependencyValues.showLegend,
                            legendPosition: dependencyValues.legendPosition,
                            displayValues: dependencyValues.displayValues,
                            shortDescription: dependencyValues.shortDescription,
                            darkMode,
                        });

                    return {
                        setValue: { prefigureXML: xml },
                        sendDiagnostics: diagnostics,
                    };
                }

                const shared = {
                    geometry: dependencyValues.chartGeometry,
                    seriesRendering,
                    widthPx,
                    heightPx,
                    xLabel: dependencyValues.xLabel,
                    xLabelHasLatex: dependencyValues.xLabelHasLatex,
                    yLabel: dependencyValues.yLabel,
                    yLabelHasLatex: dependencyValues.yLabelHasLatex,
                    title: dependencyValues.title,
                    showLegend: dependencyValues.showLegend,
                    legendPosition: dependencyValues.legendPosition,
                    displayValues: dependencyValues.displayValues,
                    shortDescription: dependencyValues.shortDescription,
                    darkMode,
                };

                // The one place the type decides how the geometry is drawn.
                // `chartGeometry` has already decided *which* geometry there
                // is, so a type that reached here is one this knows about.
                const { xml, diagnostics } =
                    dependencyValues.type === "bar"
                        ? createBarChartPrefigureXML(shared)
                        : createPointChartPrefigureXML({
                              ...shared,
                              shape: dependencyValues.type,
                              markers: dependencyValues.markers,
                          });

                return {
                    setValue: { prefigureXML: xml },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        return stateVariableDefinitions;
    }

    /**
     * Records the chart scrolling into and out of the viewport, the same event
     * `<graph>`, `<image>` and the other framed block components record, so a
     * chart is not a hole in an activity's record of what was looked at.
     */
    recordVisibilityChange({ isVisible }) {
        this.coreFunctions.requestRecordEvent({
            verb: "visibilityChanged",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
            },
            result: { isVisible },
        });
    }
}
