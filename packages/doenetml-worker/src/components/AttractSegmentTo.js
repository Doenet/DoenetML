import {
    attractSegmentEndpoints,
    findAttractedPoint,
} from "../utils/constraints";
import SegmentConstraintComponent from "./abstract/SegmentConstraintComponent";
import me from "math-expressions";

export default class AttractSegmentTo extends SegmentConstraintComponent {
    static componentType = "attractSegmentTo";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.relativeToGraphScales = {
            createComponentOfType: "boolean",
            createStateVariable: "relativeToGraphScales",
            defaultValue: false,
            public: true,
        };

        attributes.threshold = {
            createComponentOfType: "number",
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "graphical",
                componentTypes: ["_graphical"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.threshold = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            hasEssential: true,
            returnDependencies: () => ({
                thresholdAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "threshold",
                    variableNames: ["value"],
                },
                constraintsAncestor: {
                    dependencyType: "ancestor",
                    componentType: "constraints",
                    variableNames: ["graphXmin"],
                },
                relativeToGraphScales: {
                    dependencyType: "stateVariable",
                    variableName: "relativeToGraphScales",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.thresholdAttr) {
                    return {
                        setValue: {
                            threshold:
                                dependencyValues.thresholdAttr.stateValues
                                    .value,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            threshold: {
                                get defaultValue() {
                                    let useRelative =
                                        dependencyValues.relativeToGraphScales &&
                                        dependencyValues.constraintsAncestor !==
                                            null &&
                                        dependencyValues.constraintsAncestor
                                            .stateValues.graphXmin !== null;

                                    return useRelative ? 0.02 : 0.5;
                                },
                            },
                        },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.thresholdAttr) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "thresholdAttr",
                                desiredValue:
                                    desiredStateVariableValues.threshold,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "threshold",
                                value: desiredStateVariableValues.threshold,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.nearestPointFunctions = {
            returnDependencies: () => ({
                graphicalChildren: {
                    dependencyType: "child",
                    childGroups: ["graphical"],
                    variableNames: ["nearestPoint"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let nearestPointFunctions = [];
                let warnings = [];

                for (let child of dependencyValues.graphicalChildren) {
                    if (!child.stateValues.nearestPoint) {
                        warnings.push({
                            message: `Cannot attract to a <${child.componentType}> as it doesn't have a nearestPoint state variable.`,
                            level: 1,
                        });
                        continue;
                    }
                    nearestPointFunctions.push(child.stateValues.nearestPoint);
                }

                return {
                    setValue: { nearestPointFunctions },
                    sendWarnings: warnings,
                };
            },
        };

        stateVariableDefinitions.applyConstraint = {
            returnDependencies() {
                let dependencies = {
                    nearestPointFunctions: {
                        dependencyType: "stateVariable",
                        variableName: "nearestPointFunctions",
                    },
                    threshold: {
                        dependencyType: "stateVariable",
                        variableName: "threshold",
                    },
                    relativeToGraphScales: {
                        dependencyType: "stateVariable",
                        variableName: "relativeToGraphScales",
                    },
                    constraintsAncestor: {
                        dependencyType: "ancestor",
                        componentType: "constraints",
                        variableNames: ["scales"],
                    },
                };

                return dependencies;
            },
            definition({ dependencyValues }) {
                let scales;

                if (dependencyValues.relativeToGraphScales) {
                    scales = dependencyValues.constraintsAncestor?.stateValues
                        .scales || [1, 1, 1];
                } else {
                    scales = [1, 1, 1];
                }

                let numericalNearestPointFunctions =
                    dependencyValues.nearestPointFunctions.map(
                        (f) =>
                            function (point, scales) {
                                let variables = {};
                                for (let ind = 0; ind < point.length; ind++) {
                                    let varName = "x" + (ind + 1);
                                    variables[varName] = me.fromAst(point[ind]);
                                }

                                let nearestPointAsVariables = f({
                                    variables,
                                    scales,
                                });

                                if (nearestPointAsVariables === undefined) {
                                    return null;
                                }

                                let nearestPoint = [];
                                for (let ind = 0; ind < point.length; ind++) {
                                    let varName = "x" + (ind + 1);
                                    if (
                                        nearestPointAsVariables[varName] ===
                                        undefined
                                    ) {
                                        break;
                                    }
                                    nearestPoint.push(
                                        nearestPointAsVariables[varName],
                                    );
                                }
                                if (nearestPoint.length !== point.length) {
                                    return null;
                                }

                                return nearestPoint;
                            },
                    );

                return {
                    setValue: {
                        applyConstraint: function (
                            segment,
                            allowRotation,
                            enforceRigid,
                        ) {
                            let threshold2 =
                                dependencyValues.threshold *
                                dependencyValues.threshold;

                            let result = attractSegmentEndpoints(
                                segment,
                                allowRotation,
                                enforceRigid,
                                scales,
                                threshold2,
                                numericalNearestPointFunctions,
                            );

                            if (!result.constrained) {
                                return {};
                            }

                            // found a segment where the endpoints were attracted
                            let attractedSegment = result.segment;

                            // check to see that the midpoint is attracted without moving
                            let deviationThreshold2 = 1e-6 ** 2;
                            let midpoint = [
                                (attractedSegment[0][0] +
                                    attractedSegment[1][0]) /
                                    2,
                                (attractedSegment[0][1] +
                                    attractedSegment[1][1]) /
                                    2,
                            ];

                            let closestMidpoint = findAttractedPoint({
                                point: midpoint,
                                scales,
                                threshold2: deviationThreshold2,
                                numericalNearestPointFunctions,
                            });

                            if (closestMidpoint) {
                                // Midpoint of segment is also attracted without moving, so it on the attractor.
                                // Return the result from attracting the endpoints
                                return result;
                            } else {
                                // The midpoint wasn't on the attractor, so the segment is not considered attracted.
                                return {};
                            }
                        },
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
