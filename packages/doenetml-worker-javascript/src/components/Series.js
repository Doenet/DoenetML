import BaseComponent from "./abstract/BaseComponent";
import {
    returnLabelAttributes,
    returnLabelStateVariableDefinitions,
} from "../utils/label";
import { returnSelectedStyleStateVariableDefinition } from "@doenet/utils";
import {
    numericValuesFromValueChildren,
    returnBreakStringsIntoMathsBySpacesSugarInstruction,
} from "../utils/mathOperatorChildren";

/**
 * One group of data within a `<chart>`: the values, a label to name them by,
 * and a style to draw them in.
 *
 * Every standard statistical plotting package describes a chart as data, a mark
 * and a set of encodings that map fields onto position and color. `<chart>`
 * already carries the mark, as `type`; a `<series>` is the group the color
 * encoding splits on, and its children are the values the position encoding
 * reads. That is what makes a chart of two years' populations, or a box plot
 * with one box per treatment, expressible without a second tag per chart type.
 *
 * A chart whose children are bare values has one series all the same — the
 * chart builds it — so a series is something an author writes only when there
 * is more than one group, or when a group needs a name or a color of its own.
 *
 * What a series' values *mean* is the chart's business, not this component's: a
 * bar chart reads one value per category, a box plot reads a column of
 * observations. Nothing here decides between those, which is why this holds
 * values rather than, say, heights.
 */
export default class Series extends BaseComponent {
    static componentType = "series";

    static componentDocs = {
        summary:
            "One group of data within a `<chart>`, with its own label and style.",
        // A series is only ever written inside a chart, and what it means
        // depends on the chart drawn from it, so it is documented where that is
        // explained rather than on a page of its own.
        docsSlug: "chart",
    };

    // Not drawn on its own: a series is read by the `<chart>` around it, which
    // is what turns values into a picture.
    static rendererType = undefined;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(attributes, returnLabelAttributes());

        // The inherited `styleNumber` falls back to the parent's, which is the
        // right rule for a component drawn *inside* something styled and the
        // wrong one here: every series of a chart would come out the color of
        // the chart, and a two-series chart would be two indistinguishable
        // groups of bars. So the attribute is read into a private name and the
        // public `styleNumber` below fills in the series' own position when the
        // author did not choose one, which is the categorical color scale every
        // plotting package applies to a grouping variable.
        attributes.styleNumber = {
            description:
                "The style number this series is drawn with. Defaults to the series' position among the chart's series, so consecutive series are consecutive colors.",
            createComponentOfType: "integer",
            createStateVariable: "styleNumberAttr",
            defaultValue: null,
        };

        return attributes;
    }

    // Include children that can be added by the sugar below.
    static additionalSchemaChildren = ["string"];

    /**
     * Bare numbers are the values: `<series label="2024">41 63 18</series>`.
     * The same sugar `<chart>` and `<summaryStatistics>` use, so `1/2` is half
     * rather than `NaN`. Component children — a `<label>`, or the `<number>`s a
     * referenced list expands into — are left alone.
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
            {
                group: "labels",
                componentTypes: ["label"],
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

        // A `<label>` child rather than a `label` attribute, which is how every
        // other component that carries one takes it, and which brings LaTeX
        // with it: `<label><m>\mu = 0</m></label>` reaches the chart's legend as
        // math rather than as the characters of its source.
        Object.assign(
            stateVariableDefinitions,
            returnLabelStateVariableDefinitions(),
        );

        // The position among the chart's series when the author named no style,
        // so that consecutive series are consecutive colors. Offset by the
        // chart's own `styleNumber`, so `<chart styleNumber="3">` starts its
        // series at 3 and a one-series chart is drawn in exactly the style the
        // chart asked for.
        stateVariableDefinitions.styleNumber = {
            description:
                "The style number this series is drawn with; defaults to its position among the chart's series.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                styleNumberAttr: {
                    dependencyType: "stateVariable",
                    variableName: "styleNumberAttr",
                },
                seriesStyleNumbers: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "chart",
                    variableName: "seriesStyleNumbers",
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                if (dependencyValues.styleNumberAttr !== null) {
                    return {
                        setValue: {
                            styleNumber: dependencyValues.styleNumberAttr,
                        },
                    };
                }

                // A series outside a `<chart>` has no position to take, and no
                // chart to be drawn in either. Style 1 is what every other
                // component defaults to.
                const styleNumber =
                    dependencyValues.seriesStyleNumbers?.[componentIdx] ?? 1;

                return { setValue: { styleNumber } };
            },
        };

        Object.assign(
            stateVariableDefinitions,
            returnSelectedStyleStateVariableDefinition(),
        );

        stateVariableDefinitions.values = {
            description: "The values in this series, in order.",
            public: true,
            isArray: true,
            entryPrefixes: ["value"],
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
                const numericValues = numericValuesFromValueChildren(
                    globalDependencyValues.valueChildren,
                );
                const values = {};
                for (const arrayKey of arrayKeys) {
                    values[arrayKey] = numericValues[arrayKey];
                }
                return { setValue: { values } };
            },
        };

        return stateVariableDefinitions;
    }
}
