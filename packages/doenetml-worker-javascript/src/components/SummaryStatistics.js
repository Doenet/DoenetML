import BlockComponent from "./abstract/BlockComponent";
import me from "math-expressions";
const { mean, std, variance, median, quantileSeq } = me.math;
import { roundForDisplay } from "../utils/math";
import {
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayAttributes,
    returnNumberDisplayStateVariableDefinitions,
} from "../utils/numberDisplay";

/**
 * The individual statistics `statisticsToDisplay` can name, in the order they
 * are displayed.
 *
 * This single list drives both the attribute's `validValues` and the
 * `statisticsToDisplay` state variable's selection, so the set an author may
 * write and the set that can be displayed cannot drift apart.
 */
const STATISTIC_VALUES = [
    { value: "mean", description: "The arithmetic mean." },
    { value: "stdev", description: "The standard deviation." },
    { value: "variance", description: "The variance." },
    { value: "stderr", description: "The standard error." },
    {
        value: "count",
        description: "The number of non-missing values.",
    },
    { value: "minimum", description: "The smallest value." },
    { value: "quartile1", description: "The first quartile." },
    { value: "median", description: "The median." },
    { value: "quartile3", description: "The third quartile." },
    { value: "maximum", description: "The largest value." },
    {
        value: "range",
        description: "The maximum minus the minimum.",
    },
    { value: "sum", description: "The sum of the values." },
];

/** The subset of `STATISTIC_VALUES` that `statisticsToDisplay="default"` selects. */
const DEFAULT_STATISTICS = [
    "mean",
    "stdev",
    "count",
    "minimum",
    "quartile1",
    "median",
    "quartile3",
    "maximum",
];

/**
 * One statistic, as the table should show it.
 *
 * The statistics are plain numbers, but `roundForDisplay` works on
 * math-expressions, so each is lifted into one and rendered back to a string —
 * a renderer cannot put an `Expression` in a table cell.
 *
 * `count` is exempt: it is an exact tally, and rounding it to three significant
 * digits would report 1234 observations as 1230.
 */
function displayedStatistic(statistic, value, dependencyValues) {
    if (value === null) {
        return null;
    }
    if (statistic === "count") {
        return value;
    }
    return roundForDisplay({
        value: me.fromAst(value),
        dependencyValues,
    }).toString();
}

export default class SummaryStatistics extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "summaryStatistics";

    static componentDocs = {
        summary:
            "Summary statistics (mean, median, etc.) for a list of numbers.",
    };
    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.statisticsToDisplay = {
            createComponentOfType: "textList",
            createStateVariable: "statisticsToDisplayPrelim",
            defaultValue: ["default"],
            toLowerCase: true,
            // `default` and `all` are selections over the statistics rather
            // than statistics of their own, so they are listed here rather
            // than in `STATISTIC_VALUES`.
            validValues: [
                {
                    value: "default",
                    description: `The default selection: ${DEFAULT_STATISTICS.join(", ")}.`,
                },
                { value: "all", description: "Every statistic listed here." },
                ...STATISTIC_VALUES,
            ],
            description:
                'Which summary statistics to display (or "default" / "all").',
        };

        Object.assign(attributes, returnNumberDisplayAttributes());

        return attributes;
    }

    static returnChildGroups() {
        return [
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
            returnNumberDisplayStateVariableDefinitions(),
        );

        stateVariableDefinitions.statisticsToDisplay = {
            description: "Which summary statistics to display.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "textList",
            },
            returnDependencies: () => ({
                statisticsToDisplayPrelim: {
                    dependencyType: "stateVariable",
                    variableName: "statisticsToDisplayPrelim",
                },
            }),
            definition: function ({ dependencyValues }) {
                const options = STATISTIC_VALUES.map((entry) => entry.value);

                let statisticsToDisplay = [];

                // Already lower-cased and filtered to `validValues` by the
                // attribute machinery.
                let desiredStats = dependencyValues.statisticsToDisplayPrelim;

                if (desiredStats.includes("default")) {
                    statisticsToDisplay = [...DEFAULT_STATISTICS];
                } else if (desiredStats.includes("all")) {
                    statisticsToDisplay = [...options];
                } else {
                    for (let stat of options) {
                        if (desiredStats.includes(stat)) {
                            statisticsToDisplay.push(stat);
                        }
                    }
                }

                return { setValue: { statisticsToDisplay } };
            },
        };

        stateVariableDefinitions.dataColumn = {
            description: "The numeric values being summarized.",
            returnDependencies: () => ({
                valueChildren: {
                    dependencyType: "child",
                    childGroups: ["numbers", "maths"],
                    variableNames: ["value"],
                },
            }),
            definition({ dependencyValues }) {
                const dataColumn = [];
                for (let child of dependencyValues.valueChildren) {
                    const value = child.stateValues.value;
                    // A `<math>` child arrives as a math-expression, a
                    // `<number>` child as a plain number.
                    const numericalValue =
                        typeof value?.evaluate_to_constant === "function"
                            ? value.evaluate_to_constant()
                            : value;
                    // Anything that is not a number is missing data, which is
                    // why `count` is the count of non-missing values rather
                    // than of children.
                    if (Number.isFinite(numericalValue)) {
                        dataColumn.push(numericalValue);
                    }
                }

                return { setValue: { dataColumn } };
            },
        };

        stateVariableDefinitions.count = {
            description: "The number of values in the data column.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                dataColumn: {
                    dependencyType: "stateVariable",
                    variableName: "dataColumn",
                },
            }),
            definition({ dependencyValues }) {
                let count = null;
                if (dependencyValues.dataColumn) {
                    count = dependencyValues.dataColumn.length;
                }

                return { setValue: { count } };
            },
        };

        stateVariableDefinitions.sum = {
            description: "The sum of the values.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                dataColumn: {
                    dependencyType: "stateVariable",
                    variableName: "dataColumn",
                },
            }),
            definition({ dependencyValues }) {
                let sum = null;
                if (dependencyValues.dataColumn?.length) {
                    sum = dependencyValues.dataColumn.reduce((a, c) => a + c);
                }

                return { setValue: { sum } };
            },
        };

        stateVariableDefinitions.mean = {
            description: "The arithmetic mean of the values.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                dataColumn: {
                    dependencyType: "stateVariable",
                    variableName: "dataColumn",
                },
            }),
            definition({ dependencyValues }) {
                let computedMean = null;
                if (dependencyValues.dataColumn?.length) {
                    computedMean = mean(dependencyValues.dataColumn);
                }
                return { setValue: { mean: computedMean } };
            },
        };

        stateVariableDefinitions.stdev = {
            description: "The sample standard deviation.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                dataColumn: {
                    dependencyType: "stateVariable",
                    variableName: "dataColumn",
                },
            }),
            definition({ dependencyValues }) {
                let computedStdev = null;
                if (dependencyValues.dataColumn?.length) {
                    computedStdev = std(dependencyValues.dataColumn);
                }

                return { setValue: { stdev: computedStdev } };
            },
        };

        stateVariableDefinitions.variance = {
            description: "The sample variance.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                dataColumn: {
                    dependencyType: "stateVariable",
                    variableName: "dataColumn",
                },
            }),
            definition({ dependencyValues }) {
                let computedVariance = null;
                if (dependencyValues.dataColumn?.length) {
                    computedVariance = variance(dependencyValues.dataColumn);
                }

                return { setValue: { variance: computedVariance } };
            },
        };

        stateVariableDefinitions.stderr = {
            description: "The standard error of the mean.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                stdev: {
                    dependencyType: "stateVariable",
                    variableName: "stdev",
                },
                count: {
                    dependencyType: "stateVariable",
                    variableName: "count",
                },
            }),
            definition({ dependencyValues }) {
                let stderr = null;
                if (dependencyValues.stdev !== null) {
                    stderr =
                        dependencyValues.stdev /
                        Math.sqrt(dependencyValues.count);
                }

                return { setValue: { stderr } };
            },
        };

        stateVariableDefinitions.minimum = {
            description: "The minimum value.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                dataColumn: {
                    dependencyType: "stateVariable",
                    variableName: "dataColumn",
                },
            }),
            definition({ dependencyValues }) {
                let minimum = null;
                if (dependencyValues.dataColumn?.length) {
                    minimum = Math.min(...dependencyValues.dataColumn);
                }
                return { setValue: { minimum } };
            },
        };

        stateVariableDefinitions.maximum = {
            description: "The maximum value.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                dataColumn: {
                    dependencyType: "stateVariable",
                    variableName: "dataColumn",
                },
            }),
            definition({ dependencyValues }) {
                let maximum = null;
                if (dependencyValues.dataColumn?.length) {
                    maximum = Math.max(...dependencyValues.dataColumn);
                }
                return { setValue: { maximum } };
            },
        };

        stateVariableDefinitions.median = {
            description: "The median value.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                dataColumn: {
                    dependencyType: "stateVariable",
                    variableName: "dataColumn",
                },
            }),
            definition({ dependencyValues }) {
                let computedMedian = null;
                if (dependencyValues.dataColumn?.length) {
                    computedMedian = median(dependencyValues.dataColumn);
                }
                return { setValue: { median: computedMedian } };
            },
        };

        stateVariableDefinitions.quartile1 = {
            description: "The first quartile (25th percentile).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                dataColumn: {
                    dependencyType: "stateVariable",
                    variableName: "dataColumn",
                },
            }),
            definition({ dependencyValues }) {
                let quartile1 = null;
                if (dependencyValues.dataColumn?.length) {
                    quartile1 = quantileSeq(dependencyValues.dataColumn, 0.25);
                }
                return { setValue: { quartile1 } };
            },
        };

        stateVariableDefinitions.quartile3 = {
            description: "The third quartile (75th percentile).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                dataColumn: {
                    dependencyType: "stateVariable",
                    variableName: "dataColumn",
                },
            }),
            definition({ dependencyValues }) {
                let quartile3 = null;
                if (dependencyValues.dataColumn?.length) {
                    quartile3 = quantileSeq(dependencyValues.dataColumn, 0.75);
                }
                return { setValue: { quartile3 } };
            },
        };

        stateVariableDefinitions.range = {
            description: "The range (maximum − minimum).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                minimum: {
                    dependencyType: "stateVariable",
                    variableName: "minimum",
                },
                maximum: {
                    dependencyType: "stateVariable",
                    variableName: "maximum",
                },
            }),
            definition({ dependencyValues }) {
                let range = null;
                if (dependencyValues.minimum !== null) {
                    range = dependencyValues.maximum - dependencyValues.minimum;
                }

                return { setValue: { range } };
            },
        };

        stateVariableDefinitions.summaryStatistics = {
            forRenderer: true,
            stateVariablesDeterminingDependencies: ["statisticsToDisplay"],
            returnDependencies({ stateValues }) {
                let dependencies = {
                    displayDigits: {
                        dependencyType: "stateVariable",
                        variableName: "displayDigits",
                    },
                    displayDecimals: {
                        dependencyType: "stateVariable",
                        variableName: "displayDecimals",
                    },
                    displaySmallAsZero: {
                        dependencyType: "stateVariable",
                        variableName: "displaySmallAsZero",
                    },
                };

                // Only the statistics actually being displayed are depended
                // on, so a document asking for the mean does not compute
                // quartiles it will never show.
                for (let statistic of stateValues.statisticsToDisplay) {
                    dependencies[statistic] = {
                        dependencyType: "stateVariable",
                        variableName: statistic,
                    };
                }

                return dependencies;
            },
            definition({ dependencyValues }) {
                let summaryStatistics = {};

                for (let { value: statistic } of STATISTIC_VALUES) {
                    const value = dependencyValues[statistic];
                    if (value === undefined) {
                        continue;
                    }
                    summaryStatistics[statistic] = displayedStatistic(
                        statistic,
                        value,
                        dependencyValues,
                    );
                }

                return { setValue: { summaryStatistics } };
            },
        };

        return stateVariableDefinitions;
    }

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
