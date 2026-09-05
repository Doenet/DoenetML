import BlockComponent from "./abstract/BlockComponent";
import { returnSelectedStyleStateVariableDefinition } from "@doenet/utils";
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
    computeBarChartGeometry,
    createBarChartPrefigureXML,
} from "../utils/prefigure/chart";
import { resolveSelectedStyleForTheme } from "../utils/prefigure/style";

/** The width-to-height ratio a chart is drawn at when none is asked for. */
const DEFAULT_ASPECT_RATIO = 1.5;

/** How much of its slot a bar fills when no width is asked for. */
const DEFAULT_BAR_WIDTH = 0.8;

/**
 * A bar chart of its number children, one bar per value.
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
export default class BarChart extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }

    static componentType = "barChart";

    static componentDocs = {
        summary: "A bar chart of a list of values, one bar per value.",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(
            attributes,
            returnSizeAttributes({ componentName: "bar chart" }),
        );

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
            description: "Aspect ratio (width / height) for the bar chart.",
            createComponentOfType: "number",
            createStateVariable: "aspectRatioAttr",
            defaultValue: DEFAULT_ASPECT_RATIO,
        };

        attributes.categories = {
            createComponentOfType: "_componentListWithSelectableType",
            description:
                "The label under each bar. Defaults to the bar's position, 1, 2, 3 and so on.",
            highlighted: true,
        };

        // The `categories` attribute is a `_componentListWithSelectableType`,
        // whose own `type` resolves through a `parentStateVariable` of this
        // name; without the state variable, text labels would be read as
        // numbers. See #1825.
        attributes.type = {
            createPrimitiveOfType: "string",
            createStateVariable: "type",
            defaultValue: null,
            highlighted: true,
            description:
                "How to read the `categories`: as numbers, math expressions, text or booleans.",
            validValues: [
                { value: "number", description: "Read categories as numbers." },
                {
                    value: "math",
                    description: "Read categories as math expressions.",
                },
                { value: "text", description: "Read categories as text." },
                {
                    value: "boolean",
                    description: "Read categories as booleans.",
                },
            ],
        };

        attributes.barWidth = {
            description:
                "How much of each bar's slot the bar fills, between 0 and 1. The rest is the gap to the next bar.",
            createComponentOfType: "number",
            createStateVariable: "barWidthAttr",
            defaultValue: DEFAULT_BAR_WIDTH,
        };

        attributes.yMin = {
            description:
                "Lowest value shown on the vertical axis. Defaults to 0, or to the smallest value when some are negative. Ignored, along with `yMax`, unless it is a finite number below it.",
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
            description: "Whether to print each bar's value above it.",
            createComponentOfType: "boolean",
            createStateVariable: "displayValues",
            defaultValue: false,
            public: true,
        };

        attributes.showBorder = {
            description: "Whether to render a border around the bar chart.",
            createComponentOfType: "boolean",
            createStateVariable: "showBorder",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.displayMode = {
            description: "How to size the bar chart.",
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
                "Horizontal alignment of the bar chart within its container.",
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
    static returnChildGroups() {
        return [
            returnAxisLabelChildGroup({ axis: "x" }),
            returnAxisLabelChildGroup({ axis: "y" }),
            {
                group: "shortDescriptions",
                componentTypes: ["shortDescription"],
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
            returnSizeStateVariableDefinitions({ componentName: "bar chart" }),
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
        // scope. The fallback is documented on `barChart.mdx` instead.
        stateVariableDefinitions.aspectRatio = {
            description: "The aspect ratio (width / height) of the bar chart.",
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
                const aspectRatio =
                    Number.isFinite(requested) && requested > 0
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
                "How much of its slot each bar fills, between 0 and 1.",
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
                            code: "doenet-w0142",
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
        // parent, so for `<barChart>` the answer is always yes; leaving it
        // false would emit the annotations and then never let anyone reach
        // them.
        stateVariableDefinitions.hasAuthorAnnotations = {
            description:
                "Whether the bar chart carries annotations to navigate. Always true: they are generated from the bars.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { hasAuthorAnnotations: true } }),
        };

        stateVariableDefinitions.shortDescription = {
            description: "A short accessibility description of the bar chart.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                shortDescriptionChild: {
                    dependencyType: "child",
                    childGroups: ["shortDescriptions"],
                    variableNames: ["text"],
                },
                decorative: {
                    dependencyType: "stateVariable",
                    variableName: "decorative",
                },
            }),
            definition({ dependencyValues }) {
                let shortDescription = "";
                const diagnostics = [];
                if (dependencyValues.shortDescriptionChild.length > 0) {
                    const child =
                        dependencyValues.shortDescriptionChild[
                            dependencyValues.shortDescriptionChild.length - 1
                        ];
                    shortDescription = child.stateValues.text.trim();
                }
                if (shortDescription === "" && !dependencyValues.decorative) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "accessibility",
                            level: 1,
                            code: "doenet-a0001",
                            args: { component: "barChart" },
                        }),
                    );
                }

                return {
                    setValue: { shortDescription },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        stateVariableDefinitions.barValues = {
            description: "The value of each bar, in order.",
            public: true,
            isArray: true,
            entryPrefixes: ["barValue"],
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnArraySizeDependencies: () => ({
                valueChildren: {
                    dependencyType: "child",
                    childGroups: ["numbers", "maths"],
                    variableNames: ["value"],
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.valueChildren.length];
            },
            returnArrayDependenciesByKey: () => ({
                globalDependencies: {
                    valueChildren: {
                        dependencyType: "child",
                        childGroups: ["numbers", "maths"],
                        variableNames: ["value"],
                    },
                },
            }),
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                const barValues = {};
                for (const arrayKey of arrayKeys) {
                    const child =
                        globalDependencyValues.valueChildren[arrayKey];
                    const value = child?.stateValues.value;
                    // A `<math>` child arrives as a math-expression; a
                    // `<number>` child as a plain number.
                    barValues[arrayKey] =
                        typeof value?.evaluate_to_constant === "function"
                            ? value.evaluate_to_constant()
                            : value;
                }
                return { setValue: { barValues } };
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
            returnArraySizeDependencies: () => ({
                barValues: {
                    dependencyType: "stateVariable",
                    variableName: "barValues",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.barValues.length];
            },
            returnArrayDependenciesByKey: () => ({
                globalDependencies: {
                    categoriesAttr: {
                        dependencyType: "attributeComponent",
                        attributeName: "categories",
                        variableNames: ["values"],
                    },
                },
            }),
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                const declared =
                    globalDependencyValues.categoriesAttr?.stateValues.values;
                const categories = {};
                for (const arrayKey of arrayKeys) {
                    const ind = Number(arrayKey);
                    const declaredLabel = declared?.[ind];
                    categories[arrayKey] =
                        declaredLabel === undefined
                            ? String(ind + 1)
                            : String(declaredLabel);
                }
                return { setValue: { categories } };
            },
        };

        // Renderer-neutral: bar rectangles and bounds in data coordinates,
        // with nothing PreFigure-specific in it. Every input it reads has
        // already been checked by the state variable above it, so this is
        // geometry and nothing else.
        stateVariableDefinitions.chartGeometry = {
            description:
                "The bars and bounding box of the chart, in data coordinates.",
            returnDependencies: () => ({
                barValues: {
                    dependencyType: "stateVariable",
                    variableName: "barValues",
                },
                categories: {
                    dependencyType: "stateVariable",
                    variableName: "categories",
                },
                barWidth: {
                    dependencyType: "stateVariable",
                    variableName: "barWidth",
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
                return {
                    setValue: {
                        chartGeometry: computeBarChartGeometry({
                            values: dependencyValues.barValues,
                            labels: dependencyValues.categories,
                            barWidth: dependencyValues.barWidth,
                            yMinAttr: dependencyValues.yMinAttr,
                            yMaxAttr: dependencyValues.yMaxAttr,
                        }),
                    },
                };
            },
        };

        // The vertical extent the chart was actually drawn at. Neither `yMin`
        // nor `yMax` the attribute answers that question: both are optional,
        // and both are dropped together when what they ask for is not a box
        // there is room to draw in. So the pair is defined off the geometry,
        // which is where the automatic bounds and the author's are reconciled.
        stateVariableDefinitions.yMin = {
            description: "The lowest value shown on the vertical axis.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "yMax",
                    description:
                        "The highest value shown on the vertical axis.",
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
                const [, yMin, , yMax] = dependencyValues.chartGeometry.bounds;
                return { setValue: { yMin, yMax } };
            },
        };

        stateVariableDefinitions.prefigureXML = {
            description:
                "The PreFigure-formatted XML rendered for this bar chart.",
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
                displayValues: {
                    dependencyType: "stateVariable",
                    variableName: "displayValues",
                },
                shortDescription: {
                    dependencyType: "stateVariable",
                    variableName: "shortDescription",
                },
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition({ dependencyValues }) {
                const darkMode =
                    dependencyValues.document?.stateValues.theme === "dark";

                const widthPx = dependencyValues.width?.size ?? 425;

                const { xml, diagnostics } = createBarChartPrefigureXML({
                    geometry: dependencyValues.chartGeometry,
                    widthPx,
                    heightPx: widthPx / dependencyValues.aspectRatio,
                    xLabel: dependencyValues.xLabel,
                    xLabelHasLatex: dependencyValues.xLabelHasLatex,
                    yLabel: dependencyValues.yLabel,
                    yLabelHasLatex: dependencyValues.yLabelHasLatex,
                    selectedStyle: resolveSelectedStyleForTheme(
                        dependencyValues.selectedStyle,
                        darkMode,
                    ),
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
