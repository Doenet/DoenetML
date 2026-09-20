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
import { boxPlotSummary } from "../utils/summaryStatistics";

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

    // A series is only meaningful inside a `<chart>`, so the schema should say
    // so: without this it inherits from `_base` and is therefore accepted
    // wherever a base component is — the root of a document, a `<section>`, a
    // `<div>` — where it would be built, drawn by nothing, and never mentioned.
    // Narrowing it to its own type leaves `<chart>`'s child group, which names
    // `series` outright, as the only place it fits, and the language server
    // then reports one written anywhere else. `<shortDescription>`, the chart's
    // other child-only component, is declared the same way.
    static inSchemaOnlyInheritAs = [];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(attributes, returnLabelAttributes());

        // The inherited `styleNumber` falls back to the parent's and then to
        // the enclosing composite's, which is the right rule for a component
        // drawn *inside* something styled and the wrong one here: every series
        // of a chart would come out the color of the chart, and a two-series
        // chart would be two indistinguishable groups of bars. Both fall-backs
        // have to go, not just the parent one — a `<repeat>` inside
        // `<chart styleNumber="2">` takes the chart's number itself, so a
        // series built by one would read it back off the repeat and every
        // repeated series would again be one color.
        //
        // So the attribute is read into a private name and the public
        // `styleNumber` below fills in the series' own position when the author
        // did not choose one, which is the categorical color scale every
        // plotting package applies to a grouping variable. The cost is that
        // `styleNumber` on a wrapper around a series does nothing; it is named
        // on the `<series>` itself.
        attributes.styleNumber = {
            description:
                "The style number this series is drawn with. Defaults to the series' position among the chart's series, so consecutive series are consecutive colors.",
            createComponentOfType: "integer",
            createStateVariable: "styleNumberAttr",
            defaultValue: null,
        };

        // The horizontal coordinates, for the types that place their marks by
        // measurement rather than by position. A `numberList` rather than a
        // list of children, because the values are already the children: the
        // two lists are read together, position by position, and writing one of
        // them as children and the other as an attribute is what keeps that
        // pairing visible in the source.
        attributes.x = {
            createComponentOfType: "numberList",
            description:
                "The horizontal coordinate of each value, for a chart whose marks are placed by measurement. Without it a line or scatter chart draws its marks under `categories`, at 1, 2, 3 and so on. A box plot and a histogram read a series as raw observations and take their positions from the data itself, so neither reads it.",
            highlighted: true,
        };

        return attributes;
    }

    // Include children that can be added by the sugar below.
    static additionalSchemaChildren = ["string"];

    /**
     * Bare numbers are the values:
     * `<series><label>2024</label>41 63 18</series>`.
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

        // Null rather than an empty list when the attribute is absent, because
        // the two mean different things to the chart: no `x` at all puts the
        // series under the categories, where an empty one is a series whose
        // coordinates ran out before its first value.
        stateVariableDefinitions.x = {
            description:
                "The horizontal coordinate of each value, or null when the series has none.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "numberList",
            },
            returnDependencies: () => ({
                xAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "x",
                    variableNames: ["numbers"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        x: dependencyValues.xAttr?.stateValues.numbers ?? null,
                    },
                };
            },
        };

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

        // Everything a box plot draws from this series, computed once. The
        // definition is shared with `<summaryStatistics>`, so a table of
        // quartiles and a box plot of the same numbers cannot disagree on the
        // page.
        //
        // Defined on the series rather than on the chart, and whatever the
        // chart's `type`: these are statistics of a column of numbers, and a
        // column does not stop having a median because it was drawn as bars.
        // What the chart decides is which of them get a mark, not which of them
        // exist. A named series is then readable into a sentence or an
        // `<answer>` beside the picture — the argument #1833 made for binning
        // in the worker rather than in scipy.
        //
        // Anything that is not a finite number is missing data and is left out,
        // which is what `<summaryStatistics>` does with the same column: a
        // symbolic `<math>` has no place in an order statistic, and reading it
        // as zero would move every one of these.
        stateVariableDefinitions.summaryOfValues = {
            description:
                "The five-number summary of this series' values, with the whisker ends and outliers a box plot draws, or null when it has no finite values.",
            returnDependencies: () => ({
                values: {
                    dependencyType: "stateVariable",
                    variableName: "values",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        summaryOfValues: boxPlotSummary(
                            dependencyValues.values.filter((value) =>
                                Number.isFinite(value),
                            ),
                        ),
                    },
                };
            },
        };

        // Each of the five, plus the outliers, read off that one summary.
        //
        // Null for a series with no finite values, which is what
        // `<summaryStatistics>` reports for an empty column: there is no
        // smallest value in no values, and reporting 0 would be a number the
        // data does not contain. `outliers` is the exception — an empty list is
        // the honest answer there, since "which values lie beyond the fences"
        // has one whether or not there are any values to ask it of.
        for (const [name, description] of [
            ["minimum", "The smallest value in this series."],
            ["quartile1", "The first quartile (25th percentile)."],
            ["median", "The median value."],
            ["quartile3", "The third quartile (75th percentile)."],
            ["maximum", "The largest value in this series."],
        ]) {
            stateVariableDefinitions[name] = {
                description,
                public: true,
                shadowingInstructions: {
                    createComponentOfType: "number",
                },
                returnDependencies: () => ({
                    summaryOfValues: {
                        dependencyType: "stateVariable",
                        variableName: "summaryOfValues",
                    },
                }),
                definition({ dependencyValues }) {
                    return {
                        setValue: {
                            [name]:
                                dependencyValues.summaryOfValues?.[name] ??
                                null,
                        },
                    };
                },
            };
        }

        stateVariableDefinitions.outliers = {
            description:
                "The values more than one and a half interquartile ranges beyond the nearer quartile, in the order they were given — the ones a box plot draws as points beyond its whiskers.",
            public: true,
            isArray: true,
            entryPrefixes: ["outlier"],
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnArraySizeDependencies: () => ({
                summaryOfValues: {
                    dependencyType: "stateVariable",
                    variableName: "summaryOfValues",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.summaryOfValues?.outliers.length ?? 0];
            },
            returnArrayDependenciesByKey: () => ({
                globalDependencies: {
                    summaryOfValues: {
                        dependencyType: "stateVariable",
                        variableName: "summaryOfValues",
                    },
                },
            }),
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                const found =
                    globalDependencyValues.summaryOfValues?.outliers ?? [];
                const outliers = {};
                for (const arrayKey of arrayKeys) {
                    outliers[arrayKey] = found[arrayKey];
                }
                return { setValue: { outliers } };
            },
        };

        return stateVariableDefinitions;
    }
}
