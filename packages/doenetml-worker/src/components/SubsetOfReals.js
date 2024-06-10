import MathComponent from "./Math";
import {
    buildSubsetFromMathExpression,
    mathExpressionFromSubsetValue,
    mergeIntervals,
    subsets,
} from "@doenet/utils";
import { renameStateVariable } from "../utils/stateVariables";
import me from "math-expressions";

export default class SubsetOfReals extends MathComponent {
    static componentType = "subsetOfReals";
    static rendererType = "math";

    // used when creating new component via adapter or copy prop
    static primaryStateVariableForDefinition = "subsetValue";
    static stateVariableToBeShadowed = "subsetValue";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.createIntervals.defaultValue = true;

        attributes.variable = {
            createComponentOfType: "_variableName",
            createStateVariable: "variable",
            defaultValue: me.fromAst("x"),
        };

        attributes.displayMode = {
            createComponentOfType: "text",
            createStateVariable: "displayMode",
            defaultValue: "intervals",
            public: true,
            toLowerCase: true,
            validValues: ["intervals", "inequalities"],
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // rename unnormalizedValue to unnormalizedValuePreliminary
        renameStateVariable({
            stateVariableDefinitions,
            oldName: "unnormalizedValue",
            newName: "unnormalizedValuePreliminary",
        });

        stateVariableDefinitions.value.shadowingInstructions.createComponentOfType =
            "math";

        stateVariableDefinitions.haveSingleSubsetChild = {
            returnDependencies: () => ({
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                let haveSingleSubsetChild =
                    dependencyValues.mathChildren.length === 1 &&
                    dependencyValues.mathChildren.filter((child) =>
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: child.componentType,
                            baseComponentType: "subsetOfReals",
                        }),
                    ).length === 1;

                return { setValue: { haveSingleSubsetChild } };
            },
        };

        stateVariableDefinitions.subsetValue = {
            stateVariablesDeterminingDependencies: ["haveSingleSubsetChild"],
            returnDependencies({ stateValues }) {
                let dependencies = {
                    haveSingleSubsetChild: {
                        dependencyType: "stateVariable",
                        variableName: "haveSingleSubsetChild",
                    },
                };

                if (stateValues.haveSingleSubsetChild) {
                    dependencies.subsetChild = {
                        dependencyType: "child",
                        childGroups: ["maths"],
                        variableNames: ["subsetValue"],
                    };
                } else {
                    dependencies.unnormalizedValuePreliminary = {
                        dependencyType: "stateVariable",
                        variableName: "unnormalizedValuePreliminary",
                    };
                    dependencies.variable = {
                        dependencyType: "stateVariable",
                        variableName: "variable",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues }) {
                let subsetValue;

                if (dependencyValues.haveSingleSubsetChild) {
                    subsetValue =
                        dependencyValues.subsetChild[0].stateValues.subsetValue;
                } else {
                    subsetValue = buildSubsetFromMathExpression(
                        dependencyValues.unnormalizedValuePreliminary,
                        dependencyValues.variable,
                    );
                }

                return { setValue: { subsetValue } };
            },
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
            }) {
                if (dependencyValues.haveSingleSubsetChild) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "subsetChild",
                                desiredValue:
                                    desiredStateVariableValues.subsetValue,
                                childIndex: 0,
                                variableIndex: 0,
                            },
                        ],
                    };
                } else {
                    let mathExpression = mathExpressionFromSubsetValue({
                        subsetValue: desiredStateVariableValues.subsetValue,
                        variable: dependencyValues.variable,
                        displayMode: await stateValues.displayMode,
                    });

                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "unnormalizedValuePreliminary",
                                desiredValue: mathExpression,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.unnormalizedValue = {
            returnDependencies: () => ({
                subsetValue: {
                    dependencyType: "stateVariable",
                    variableName: "subsetValue",
                },
                displayMode: {
                    dependencyType: "stateVariable",
                    variableName: "displayMode",
                },
                variable: {
                    dependencyType: "stateVariable",
                    variableName: "variable",
                },
            }),
            definition({ dependencyValues }) {
                let unnormalizedValue =
                    mathExpressionFromSubsetValue(dependencyValues);

                return { setValue: { unnormalizedValue } };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let subsetValue = buildSubsetFromMathExpression(
                    desiredStateVariableValues.unnormalizedValue,
                    dependencyValues.variable,
                );

                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "subsetValue",
                            desiredValue: subsetValue,
                        },
                    ],
                };
            },
        };

        const pointAndIntervalDefinitions =
            returnPointsIntervalsFromSubsetStateVariableDefinitions();
        Object.assign(stateVariableDefinitions, pointAndIntervalDefinitions);

        return stateVariableDefinitions;
    }
}

export function returnPointsIntervalsFromSubsetStateVariableDefinitions() {
    let stateVariableDefinitions = {};

    stateVariableDefinitions.pointsFromSubset = {
        additionalStateVariablesDefined: ["intervalsFromSubset"],
        returnDependencies: () => ({
            subsetValue: {
                dependencyType: "stateVariable",
                variableName: "subsetValue",
            },
        }),
        definition({ dependencyValues }) {
            let { points, intervals } = determinePointAndIntervalsFromSubset(
                dependencyValues.subsetValue,
            );

            return {
                setValue: {
                    pointsFromSubset: points,
                    intervalsFromSubset: intervals,
                },
            };
        },
    };

    stateVariableDefinitions.points = {
        additionalStateVariablesDefined: [
            {
                variableName: "pointsClosed",
                public: true,
                isArray: true,
                shadowingInstructions: {
                    createComponentOfType: "boolean",
                },
            },
        ],
        public: true,
        isArray: true,
        shadowingInstructions: {
            createComponentOfType: "math",
        },
        isArray: true,
        entryPrefixes: ["point"],
        returnArraySizeDependencies: () => ({
            pointsFromSubset: {
                dependencyType: "stateVariable",
                variableName: "pointsFromSubset",
            },
        }),
        returnArraySize({ dependencyValues }) {
            return [dependencyValues.pointsFromSubset.length];
        },
        returnArrayDependenciesByKey() {
            let globalDependencies = {
                pointsFromSubset: {
                    dependencyType: "stateVariable",
                    variableName: "pointsFromSubset",
                },
            };
            return { globalDependencies };
        },
        arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
            let points = {};
            let pointsClosed = {};
            for (let arrayKey of arrayKeys) {
                let point = globalDependencyValues.pointsFromSubset[arrayKey];

                points[arrayKey] = me.fromAst(point.value);
                pointsClosed[arrayKey] = point.inSubset;
            }

            return { setValue: { points, pointsClosed } };
        },
    };

    stateVariableDefinitions.allIntervals = {
        additionalStateVariablesDefined: ["allIsolatedPoints"],
        returnDependencies: () => ({
            subsetValue: {
                dependencyType: "stateVariable",
                variableName: "subsetValue",
            },
        }),
        definition({ dependencyValues }) {
            let allIntervals = [];
            let allIsolatedPoints = [];

            // Note: we don't base allIntervals from intervalsFromSubset
            // as the later doesn't include information
            // about whether or not intervals are closed
            let pieces = mergeIntervals(dependencyValues.subsetValue);

            for (let subset of pieces) {
                if (subset.closedInterval) {
                    allIntervals.push(
                        me.fromAst([
                            "interval",
                            ["tuple", subset.left, subset.right],
                            ["tuple", true, true],
                        ]),
                    );
                } else if (subset.openClosedInterval) {
                    allIntervals.push(
                        me.fromAst([
                            "interval",
                            ["tuple", subset.left, subset.right],
                            ["tuple", false, true],
                        ]),
                    );
                } else if (subset.closedOpenInterval) {
                    allIntervals.push(
                        me.fromAst([
                            "interval",
                            ["tuple", subset.left, subset.right],
                            ["tuple", true, false],
                        ]),
                    );
                } else if (subset instanceof subsets.OpenInterval) {
                    allIntervals.push(
                        me.fromAst([
                            "interval",
                            ["tuple", subset.left, subset.right],
                            ["tuple", false, false],
                        ]),
                    );
                } else if (subset instanceof subsets.RealLine) {
                    allIntervals.push(
                        me.fromAst([
                            "interval",
                            ["tuple", -Infinity, Infinity],
                            ["tuple", false, false],
                        ]),
                    );
                } else if (subset instanceof subsets.Singleton) {
                    allIsolatedPoints.push(subset.element);
                }
            }

            return { setValue: { allIntervals, allIsolatedPoints } };
        },
    };

    stateVariableDefinitions.intervals = {
        public: true,
        isArray: true,
        shadowingInstructions: {
            createComponentOfType: "math",
        },
        isArray: true,
        entryPrefixes: ["interval"],
        returnArraySizeDependencies: () => ({
            allIntervals: {
                dependencyType: "stateVariable",
                variableName: "allIntervals",
            },
        }),
        returnArraySize({ dependencyValues }) {
            return [dependencyValues.allIntervals.length];
        },
        returnArrayDependenciesByKey() {
            let globalDependencies = {
                allIntervals: {
                    dependencyType: "stateVariable",
                    variableName: "allIntervals",
                },
            };
            return { globalDependencies };
        },
        arrayDefinitionByKey({ globalDependencyValues }) {
            return {
                setValue: { intervals: globalDependencyValues.allIntervals },
            };
        },
    };

    stateVariableDefinitions.isolatedPoints = {
        public: true,
        isArray: true,
        shadowingInstructions: {
            createComponentOfType: "math",
        },
        isArray: true,
        entryPrefixes: ["isolatedPoint"],
        returnArraySizeDependencies: () => ({
            allIsolatedPoints: {
                dependencyType: "stateVariable",
                variableName: "allIsolatedPoints",
            },
        }),
        returnArraySize({ dependencyValues }) {
            return [dependencyValues.allIsolatedPoints.length];
        },
        returnArrayDependenciesByKey() {
            let globalDependencies = {
                allIsolatedPoints: {
                    dependencyType: "stateVariable",
                    variableName: "allIsolatedPoints",
                },
            };
            return { globalDependencies };
        },
        arrayDefinitionByKey({ globalDependencyValues }) {
            return {
                setValue: {
                    isolatedPoints: globalDependencyValues.allIsolatedPoints,
                },
            };
        },
    };

    return stateVariableDefinitions;
}

export function determinePointAndIntervalsFromSubset(subset) {
    function mergePointsIntervals(result1, result2) {
        let points = [];
        let intervals = [];

        if (result1.points) {
            points = result1.points;
        }
        if (result1.intervals) {
            intervals = result1.intervals;
        }

        if (result2.points) {
            let valuesIn1 = points.map((x) => x.value);

            for (let pt of result2.points) {
                let indIn1 = valuesIn1.indexOf(pt.value);

                if (indIn1 === -1) {
                    points.push(pt);
                } else {
                    points[indIn1].inSubset ||= pt.inSubset;
                }
            }
        }

        if (result2.intervals) {
            intervals.push(...result2.intervals);
        }

        return { points, intervals };
    }

    function pointsIntervalsFromSubset(subset) {
        if (subset === null || subset.isEmpty()) {
            return {};
        }

        if (subset instanceof subsets.Union) {
            let points = [];
            let intervals = [];
            for (let sub2 of subset.subsets) {
                let result = pointsIntervalsFromSubset(sub2);
                ({ points, intervals } = mergePointsIntervals(
                    { points, intervals },
                    result,
                ));
            }

            return { points, intervals };
        } else if (subset instanceof subsets.RealLine) {
            return { intervals: [[-Infinity, Infinity]] };
        } else if (subset instanceof subsets.Singleton) {
            return {
                points: [{ value: subset.element, inSubset: true }],
            };
        } else if (subset instanceof subsets.OpenInterval) {
            let intervals = [[subset.left, subset.right]];
            let points = [];
            if (Number.isFinite(subset.left)) {
                points.push({
                    value: subset.left,
                    inSubset: false,
                });
            }
            if (Number.isFinite(subset.right)) {
                points.push({
                    value: subset.right,
                    inSubset: false,
                });
            }
            return { intervals, points };
        }

        // shouldn't get here
        return {};
    }

    let { points, intervals } = pointsIntervalsFromSubset(subset);

    points ||= [];
    intervals ||= [];

    points.sort((a, b) => a.value - b.value);
    intervals.sort((a, b) => a[0] - b[0]);

    return { points, intervals };
}
