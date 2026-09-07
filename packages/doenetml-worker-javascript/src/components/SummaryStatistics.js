import BlockComponent from "./abstract/BlockComponent";
import me from "math-expressions";
const { mean, std, variance, median, quantileSeq } = me.math;
import { numberToMathExpression, roundForDisplay } from "../utils/math";
import { returnBreakStringsIntoMathsBySpacesSugarInstruction } from "../utils/mathOperatorChildren";
import {
    buildNumberDisplayParameters,
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayAttributes,
    returnNumberDisplayStateVariableDefinitions,
} from "../utils/numberDisplay";

/**
 * Every statistic this component reports, in the order the table displays them.
 *
 * This single table drives the `statisticsToDisplay` attribute's `validValues`,
 * that state variable's selection, and the public state variable defined for
 * each statistic — so the set an author may write, the set that can be
 * displayed, and the set that can be read as a property cannot drift apart.
 *
 * `compute` maps the data column to the statistic. The three entries without
 * one are defined by hand further down: `count` because it reports 0 for an
 * empty column where the others report nothing, and `stderr` and `range`
 * because they are computed from other statistics rather than from the column.
 */
const STATISTICS = [
    {
        value: "mean",
        description: "The arithmetic mean of the values.",
        compute: mean,
    },
    {
        value: "stdev",
        description: "The sample standard deviation.",
        compute: std,
    },
    {
        value: "variance",
        description: "The sample variance.",
        compute: variance,
    },
    { value: "stderr", description: "The standard error of the mean." },
    { value: "count", description: "The number of non-missing values." },
    {
        value: "minimum",
        description: "The smallest value.",
        // Reduced rather than spread, as `<barChart>` reduces for the same
        // reason: `Math.min(...column)` throws once the column is longer than
        // the engine's argument limit, and a column that long is exactly what
        // summarizing a simulation produces.
        compute: (column) => column.reduce((a, c) => (c < a ? c : a)),
    },
    {
        value: "quartile1",
        description: "The first quartile (25th percentile).",
        compute: (column) => quantileSeq(column, 0.25),
    },
    { value: "median", description: "The median value.", compute: median },
    {
        value: "quartile3",
        description: "The third quartile (75th percentile).",
        compute: (column) => quantileSeq(column, 0.75),
    },
    {
        value: "maximum",
        description: "The largest value.",
        compute: (column) => column.reduce((a, c) => (c > a ? c : a)),
    },
    { value: "range", description: "The maximum minus the minimum." },
    {
        value: "sum",
        description: "The sum of the values.",
        compute: (column) => column.reduce((a, c) => a + c),
    },
];

/**
 * The subset of `STATISTICS` that `statisticsToDisplay="fiveNumberSummary"`
 * selects — the five values a box plot draws.
 *
 * Named rather than left to the author to list, for the reason `default` and
 * `all` are named: a document that says `fiveNumberSummary` says what it means,
 * where one listing five statistics only says what it shows. The term is taught
 * as a term, so the source should be able to use it.
 *
 * Not attributed to Tukey anywhere an author reads, because these are not his.
 * He defined the summary over hinges; `quartile1` and `quartile3` here are
 * interpolated percentiles, which differ on some sample sizes — over
 * `1 2 3 4 5 6` these give 2.25 and 4.75 where hinges give 2 and 5. R keeps the
 * two apart as `fivenum` and `quantile`. The unattributed name is what every
 * textbook uses for min/Q1/median/Q3/max however the quartiles are computed, so
 * it is accurate; "Tukey's" would promise the other calculation.
 */
const FIVE_NUMBER_SUMMARY = [
    "minimum",
    "quartile1",
    "median",
    "quartile3",
    "maximum",
];

/** The subset of `STATISTICS` that `statisticsToDisplay="default"` selects. */
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
 * The state variable definition for one statistic computed straight from the
 * data column.
 *
 * `compute` is called only for a non-empty column: every one of them throws on
 * an empty array — a `reduce` without an initial value, and math-expressions'
 * own statistics alike — so an empty column reports `null`, nothing to show,
 * instead.
 */
function returnColumnStatisticDefinition({
    value: name,
    description,
    compute,
}) {
    return {
        description,
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
            const column = dependencyValues.dataColumn;
            return {
                setValue: { [name]: column.length ? compute(column) : null },
            };
        },
    };
}

/**
 * One statistic, as the table should show it: a rounded string, `null` where
 * there is no value to show, or — for `count` alone — the number itself.
 *
 * The statistics are plain numbers, but `roundForDisplay` works on
 * math-expressions, so each is lifted into one and rendered back to a string —
 * a renderer cannot put an `Expression` in a table cell. `padZeros` and
 * `avoidScientificNotation` are settings of that rendering rather than of the
 * rounding, which is why they are applied by `toString` instead.
 *
 * `count` is exempt from all of it: it is an exact tally, and rounding it to
 * three significant digits would report 1234 observations as 1230.
 */
function displayedStatistic(statistic, value, dependencyValues) {
    if (value === null) {
        return null;
    }
    if (statistic === "count") {
        return value;
    }
    return roundForDisplay({
        value: numberToMathExpression(value),
        dependencyValues,
    }).toString(buildNumberDisplayParameters(dependencyValues));
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
            // The one attribute that decides what this component shows, so it
            // is the one the reference page should open on. The five
            // number-display attributes beside it come from
            // `returnNumberDisplayAttributes` and are left in their
            // `number-display` group: they shape how the numbers are written
            // rather than choose which ones are written.
            highlighted: true,
            // `default`, `all` and `fiveNumberSummary` are selections over
            // the statistics rather than statistics of their own, so they are
            // listed here rather than in `STATISTICS`.
            validValues: [
                {
                    value: "default",
                    description: `The default selection: ${DEFAULT_STATISTICS.join(", ")}.`,
                },
                { value: "all", description: "Every statistic listed here." },
                {
                    value: "fiveNumberSummary",
                    description: `The five-number summary: ${FIVE_NUMBER_SUMMARY.join(", ")}.`,
                },
                ...STATISTICS.map(({ value, description }) => ({
                    value,
                    description,
                })),
            ],
            description:
                'Which summary statistics to display (or "default" / "all" / "fiveNumberSummary").',
        };

        Object.assign(attributes, returnNumberDisplayAttributes());

        return attributes;
    }

    // Include children that can be added by the sugar below.
    static additionalSchemaChildren = ["string"];

    /**
     * Bare numbers are summarized directly:
     * `<summaryStatistics>4 9 2</summaryStatistics>`. Unconditional, with no
     * `type` to consult — every statistic here is arithmetic, so a value that
     * is not a number has nothing to contribute. This is the sugar `<sum>` and
     * `<mean>` use, which is what these statistics are, and it reads a bare
     * `1/2` as half rather than as nothing.
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
                const options = STATISTICS.map((entry) => entry.value);

                // Already lower-cased and filtered to `validValues` by the
                // attribute machinery.
                const desiredStats = dependencyValues.statisticsToDisplayPrelim;

                // `default`, `all` and `fiveNumberSummary` stand for a set of
                // statistics rather than excluding the ones named beside them,
                // so each is expanded in place and the whole request is
                // unioned: `statisticsToDisplay="default sum"` is the default
                // selection and the sum, not the default selection alone.
                // Matched lower-cased, which is why the third reads
                // `fivenumbersummary` here and `fiveNumberSummary` above.
                const requested = new Set();
                for (const stat of desiredStats) {
                    if (stat === "default") {
                        for (const s of DEFAULT_STATISTICS) requested.add(s);
                    } else if (stat === "all") {
                        for (const s of options) requested.add(s);
                    } else if (stat === "fivenumbersummary") {
                        for (const s of FIVE_NUMBER_SUMMARY) requested.add(s);
                    } else {
                        requested.add(stat);
                    }
                }

                // Reading the selection back out of `options` rather than out
                // of `requested` puts it in the canonical order, so two
                // documents asking for the same set read the same way
                // whatever order each asked in.
                const statisticsToDisplay = options.filter((stat) =>
                    requested.has(stat),
                );

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
                    // than of children. A symbolic `<math>` evaluates to `NaN`
                    // and a complex one to an object, and neither is finite.
                    if (Number.isFinite(numericalValue)) {
                        dataColumn.push(numericalValue);
                    }
                }

                return { setValue: { dataColumn } };
            },
        };

        // The three statistics that are not computed from the column. They are
        // slotted into `STATISTICS` order below, which is also where each takes
        // its description from, so the schema and the reference page list all
        // twelve in the order the table shows them.
        const derivedStatistics = {};

        derivedStatistics.count = {
            // Unlike the other statistics, an empty column has an answer here:
            // no values were given, which is 0 rather than nothing.
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
                return {
                    setValue: { count: dependencyValues.dataColumn.length },
                };
            },
        };

        derivedStatistics.stderr = {
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

        derivedStatistics.range = {
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

        // Every statistic is highlighted: they are what the component is for,
        // each is separately quotable in a sentence, and the docs' Highlighted
        // section is the only one open by default. Without this the reference
        // page offers a reader nothing but closed sections.
        for (let statistic of STATISTICS) {
            stateVariableDefinitions[statistic.value] = {
                ...(statistic.compute
                    ? returnColumnStatisticDefinition(statistic)
                    : {
                          description: statistic.description,
                          ...derivedStatistics[statistic.value],
                      }),
                highlighted: true,
            };
        }

        stateVariableDefinitions.summaryStatistics = {
            description:
                "The statistics being displayed, as the table should show them, keyed by statistic.",
            forRenderer: true,
            stateVariablesDeterminingDependencies: ["statisticsToDisplay"],
            returnDependencies({ stateValues }) {
                let dependencies = {};

                for (let variableName of [
                    "displayDigits",
                    "displayDecimals",
                    "displaySmallAsZero",
                    "padZeros",
                    "avoidScientificNotation",
                ]) {
                    dependencies[variableName] = {
                        dependencyType: "stateVariable",
                        variableName,
                    };
                }

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

                // Built in `STATISTICS` order rather than in the order the
                // author asked for them, so that two documents showing the
                // same set read the same way. The renderer draws the columns
                // in the order it finds them here.
                for (let { value: statistic } of STATISTICS) {
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
