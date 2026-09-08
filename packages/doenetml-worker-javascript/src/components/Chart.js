import BlockComponent from "./abstract/BlockComponent";
import {
    returnSelectedStyleStateVariableDefinition,
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
    barChartLegendHasItems,
    computeBarChartGeometry,
    createBarChartPrefigureXML,
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
 * A chart of its data. `type` picks which chart is drawn; `bar` is the only one
 * implemented so far, one bar per value.
 *
 * Data arrives as one or more `<series>` children, which is the shape every
 * standard statistical plotting package takes: a chart is data, a mark, and a
 * set of encodings mapping the data onto position and color. `type` is the
 * mark; a `<series>` is the group the color encoding splits on. A chart whose
 * children are bare values has one series, built here, so the simple case reads
 * as it always did.
 *
 * One tag with a `type` rather than a tag per chart: a pie chart, a box plot
 * and a scatter plot are all coming, and they differ in how the same list of
 * values is drawn rather than in what an author is doing. `<chart type="pie">`
 * puts that choice where it can be read — and, being an attribute, where it
 * can be computed, so a document can chart the same data both ways without
 * duplicating the tag around it.
 *
 * Rendered with PreFigure rather than JSXGraph, which buys three things a
 * hand-drawn chart would not have: the bars become one compiled SVG however
 * many there are, the horizontal axis can carry category *names* (`<graph>`
 * exposes no custom-tick support at all), and the result is navigable by
 * screen reader through diagcess. See `utils/prefigure/chart.ts`.
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
        // and says why. `bar` is the only chart implemented so far, but it is
        // not the one an author reaches for most often — a pie chart is at
        // least as common, and a scatter plot more so. Defaulting to `bar` now
        // would let documents come to rely on it, and any later change would
        // silently redraw them as something else. Requiring the attribute
        // keeps that door open at the cost of one word in every document.
        //
        // `validValues` rather than `suggestedValues`: the list of charts is
        // closed, so `type="pie"` is an author error today rather than a
        // choice this component declines to constrain, and the language server
        // should say so where it is written. The cost is that an unrecognized
        // value is reported twice — once naming the value that was rejected,
        // once by `chartGeometry` below saying nothing was drawn — which is
        // the pair `<sampleMultivariateRandomNumber type>` already produces,
        // and the second message is worded not to assume the attribute is
        // missing.
        attributes.type = {
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
            ],
        };

        // `aspectRatio`, `barWidth`, `yMin` and `yMax` are each read into a
        // private `…Attr` state variable rather than straight into the name
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
            createComponentOfType: "textList",
            description:
                "The label under each bar. Defaults to the bar's position, 1, 2, 3 and so on.",
            highlighted: true,
        };

        attributes.barWidth = {
            description:
                "How much of each category's slot the bars fill: greater than 0 and at most 1, so the bars may fill their slot but must have some width. The rest is the gap to the next category. With several series side by side, they divide this between them.",
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
            description:
                'Whether to draw a legend naming the series. One is drawn when a series carries a `<label>`; `legend="false"` suppresses it.',
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

        attributes.yMin = {
            description:
                "Lowest value shown on the vertical axis. Defaults to 0, or to the first tick past the smallest value when some are negative, so that bar does not touch the bottom of the frame. Ignored, along with `yMax`, unless it is a finite number below it.",
            createComponentOfType: "number",
            createStateVariable: "yMinAttr",
            defaultValue: null,
        };

        attributes.yMax = {
            description:
                "Highest value shown on the vertical axis. Defaults to the next tick above the tallest bar. Ignored, along with `yMin`, unless it is a finite number above it.",
            createComponentOfType: "number",
            createStateVariable: "yMaxAttr",
            defaultValue: null,
        };

        attributes.displayValues = {
            description:
                "Whether to print each bar's value at its far end — above a bar that rises, below one that falls.",
            createComponentOfType: "boolean",
            createStateVariable: "displayValues",
            defaultValue: false,
            public: true,
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
                "Whether the chart carries annotations to navigate. Always true: they are generated from the bars.",
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
                        "selectedStyle",
                        "hiddenIgnoreParent",
                    ],
                },
                ...returnContentLocaleDependencies(),
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
            description: "How many series the chart draws.",
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
            description: "The label under each bar, in order.",
            public: true,
            isArray: true,
            entryPrefixes: ["category"],
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            // As many as the longest series: every series is drawn against the
            // same categories, so a series that runs short leaves the later
            // slots empty rather than shortening the axis under the others.
            returnArraySizeDependencies: () => ({
                seriesData: {
                    dependencyType: "stateVariable",
                    variableName: "seriesData",
                },
            }),
            returnArraySize({ dependencyValues }) {
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
                            barChartLegendHasItems(
                                dependencyValues.chartGeometry,
                            ),
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
                "The bars and bounding box of the chart, in data coordinates, or null when there is no chart to draw.",
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
                barWidth: {
                    dependencyType: "stateVariable",
                    variableName: "barWidth",
                },
                layout: {
                    dependencyType: "stateVariable",
                    variableName: "layout",
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
            definition({ dependencyValues }) {
                // A type the attribute rejected arrives here as `null`,
                // exactly as a missing one does, so both get the one message —
                // which is why it says no chart was named rather than that the
                // attribute is missing. The value that was rejected has
                // already been named in a message of its own.
                if (dependencyValues.type !== "bar") {
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
                    // A value that is not a finite number gets no bar. Saying
                    // so matters because the alternative reading of a missing
                    // bar is a value of zero, and the author cannot tell the
                    // two apart by looking. The message carries no count, so
                    // the append-only diagnostics queue holds one of it however
                    // often the values change.
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
            },
        };

        // The vertical extent the chart was actually drawn at. Neither `yMin`
        // nor `yMax` the attribute answers that question: both are optional,
        // and both are dropped together when what they ask for is not a box
        // there is room to draw in. So the pair is defined off the geometry,
        // which is where the automatic bounds and the author's are reconciled —
        // and where a chart that was never drawn has no axis to report, which
        // is `null` rather than a number nothing on the screen backs up.
        stateVariableDefinitions.yMin = {
            description:
                "The lowest value shown on the vertical axis, or null when there is no chart to draw.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "yMax",
                    description:
                        "The highest value shown on the vertical axis, or null when there is no chart to draw.",
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
                const bounds = dependencyValues.chartGeometry?.bounds;
                if (!bounds) {
                    return { setValue: { yMin: null, yMax: null } };
                }
                const [, yMin, , yMax] = bounds;
                return { setValue: { yMin, yMax } };
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

                const { xml, diagnostics } = createBarChartPrefigureXML({
                    geometry: dependencyValues.chartGeometry,
                    // Resolved here rather than in the geometry, which is
                    // renderer-neutral and has no view of the page's theme:
                    // what a series is drawn in depends on which theme the
                    // reader is in, where what it is drawn as does not.
                    seriesRendering: dependencyValues.seriesData.map(
                        ({
                            label,
                            labelHasLatex,
                            selectedStyle,
                            unlabeledName,
                        }) => ({
                            label,
                            labelHasLatex,
                            unlabeledName,
                            selectedStyle: resolveSelectedStyleForTheme(
                                selectedStyle,
                                darkMode,
                            ),
                        }),
                    ),
                    widthPx,
                    heightPx: widthPx / dependencyValues.aspectRatio,
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
