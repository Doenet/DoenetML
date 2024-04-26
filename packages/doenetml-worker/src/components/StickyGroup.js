import { returnConstraintGraphInfoDefinitions } from "../utils/constraints";
import { findFiniteNumericalValue } from "../utils/math";
import GraphicalComponent from "./abstract/GraphicalComponent";
import me from "math-expressions";

export default class StickyGroup extends GraphicalComponent {
    static componentType = "stickyGroup";
    static rendererType = "containerInline";
    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.relativeToGraphScales = {
            createComponentOfType: "boolean",
            createStateVariable: "relativeToGraphScales",
            defaultValue: false,
            public: true,
        };

        attributes.pointThreshold = {
            createComponentOfType: "number",
        };

        attributes.lineThreshold = {
            createComponentOfType: "number",
        };

        return attributes;
    }

    static returnChildGroups() {
        let groups = super.returnChildGroups();
        groups.push({
            group: "graphical",
            componentTypes: ["_graphical"],
        });
        return groups;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        let graphInfoDefinitions = returnConstraintGraphInfoDefinitions();

        Object.assign(stateVariableDefinitions, graphInfoDefinitions);

        stateVariableDefinitions.numObjects = {
            returnDependencies: () => ({
                graphicalChildren: {
                    dependencyType: "child",
                    childGroups: ["graphical"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numObjects: dependencyValues.graphicalChildren.length,
                    },
                };
            },
        };

        stateVariableDefinitions.numObjects = {
            returnDependencies: () => ({
                graphicalChildren: {
                    dependencyType: "child",
                    childGroups: ["graphical"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numObjects: dependencyValues.graphicalChildren.length,
                    },
                };
            },
        };

        stateVariableDefinitions.pointsByObject = {
            returnDependencies: () => ({
                graphicalChildren: {
                    dependencyType: "child",
                    childGroups: ["graphical"],
                    variableNames: ["vertices", "xs"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                let pointsByObject = [];

                for (let object of dependencyValues.graphicalChildren) {
                    if (object.stateValues.vertices) {
                        pointsByObject.push(object.stateValues.vertices);
                    } else if (object.stateValues.xs) {
                        pointsByObject.push([object.stateValues.xs]);
                    }
                }
                return {
                    setValue: {
                        pointsByObject,
                    },
                };
            },
        };

        stateVariableDefinitions.getPointsForObject = {
            returnDependencies: () => ({
                pointsByObject: {
                    dependencyType: "stateVariable",
                    variableName: "pointsByObject",
                },
            }),
            definition({ dependencyValues }) {
                let getPointsForObject = function (objectInd) {
                    return dependencyValues.pointsByObject
                        .filter((v, i) => i !== objectInd)
                        .reduce((a, c) => {
                            a.push(...c);
                            return a;
                        }, []);
                };

                return {
                    setValue: {
                        getPointsForObject,
                    },
                };
            },
        };

        stateVariableDefinitions.pointThreshold = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            hasEssential: true,
            returnDependencies: () => ({
                pointThresholdAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "pointThreshold",
                    variableNames: ["value"],
                },

                graphXmin: {
                    dependencyType: "stateVariable",
                    variableName: "graphXmin",
                },
                relativeToGraphScales: {
                    dependencyType: "stateVariable",
                    variableName: "relativeToGraphScales",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.pointThresholdAttr) {
                    return {
                        setValue: {
                            pointThreshold:
                                dependencyValues.pointThresholdAttr.stateValues
                                    .value,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            pointThreshold: {
                                get defaultValue() {
                                    let useRelative =
                                        dependencyValues.relativeToGraphScales &&
                                        dependencyValues.graphXmin !== null;

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
                if (dependencyValues.pointThresholdAttr) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "pointThresholdAttr",
                                desiredValue:
                                    desiredStateVariableValues.pointThreshold,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "pointThreshold",
                                value: desiredStateVariableValues.pointThreshold,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.verticesConstraintFunction = {
            returnDependencies: () => ({
                getPointsForObject: {
                    dependencyType: "stateVariable",
                    variableName: "getPointsForObject",
                },
                pointThreshold: {
                    dependencyType: "stateVariable",
                    variableName: "pointThreshold",
                },
                relativeToGraphScales: {
                    dependencyType: "stateVariable",
                    variableName: "relativeToGraphScales",
                },
                scales: {
                    dependencyType: "stateVariable",
                    variableName: "scales",
                },
            }),
            definition({ dependencyValues }) {
                let scales;

                if (dependencyValues.relativeToGraphScales) {
                    scales = dependencyValues.scales || [1, 1, 1];
                } else {
                    scales = [1, 1, 1];
                }

                let verticesConstraintFunction = function (
                    unconstrainedVertices,
                    objectInd,
                    enforceRigid = true,
                ) {
                    let pointsToAttract =
                        dependencyValues.getPointsForObject(objectInd);

                    let constrainedVertices = [];
                    let constraintUsedForVertex = [];

                    for (let unconstrainedVertex of unconstrainedVertices) {
                        let numericalVertex = unconstrainedVertex.map((v) =>
                            findFiniteNumericalValue(v),
                        );

                        let closestDistance2 = Infinity;
                        let closestPoint = {};

                        for (let point of pointsToAttract) {
                            if (numericalVertex.length !== point.length) {
                                continue;
                            }

                            let distance2 = numericalVertex.reduce(
                                (a, c, i) =>
                                    a + Math.pow((c - point[i]) / scales[i], 2),
                                0,
                            );

                            if (distance2 < closestDistance2) {
                                closestPoint = point;
                                closestDistance2 = distance2;
                            }
                        }

                        let constraintUsed = false;
                        let constrainedVertex;
                        if (
                            closestDistance2 <
                            dependencyValues.pointThreshold *
                                dependencyValues.pointThreshold
                        ) {
                            constraintUsed = true;
                            constrainedVertex = closestPoint.map((v) =>
                                me.fromAst(v),
                            );
                        } else {
                            constrainedVertex = unconstrainedVertex;
                        }

                        constrainedVertices.push(constrainedVertex);
                        constraintUsedForVertex.push(constraintUsed);
                    }

                    if (constraintUsedForVertex.every((v) => !v)) {
                        return unconstrainedVertices;
                    } else if (!enforceRigid) {
                        return constrainedVertices;
                    }

                    // since have constrained vertices, and we treat them as constraining
                    // the vertices as a whole,
                    // find the minimum deviation
                    // from an unconstrained vertex to the corresponding constrained vertex
                    // and add that deviation to all unconstrained vertices
                    // to be the new constrained vertices
                    let minDeviation = [];
                    let minDeviationMagnitude2 = Infinity;
                    for (let vertexInd in unconstrainedVertices) {
                        if (!constraintUsedForVertex[vertexInd]) {
                            continue;
                        }

                        let deviation = [];
                        let deviationMag2 = 0;

                        let unconstrainedVertex =
                            unconstrainedVertices[vertexInd];
                        let constrainedVertex = constrainedVertices[vertexInd];

                        for (let dim in unconstrainedVertex) {
                            let unconstrainedX =
                                unconstrainedVertex[dim].evaluate_to_constant();
                            let constrainedX =
                                constrainedVertex[dim].evaluate_to_constant();
                            let dx = constrainedX - unconstrainedX;
                            deviation.push(dx);
                            deviationMag2 += dx * dx;
                        }

                        if (deviationMag2 < minDeviationMagnitude2) {
                            minDeviationMagnitude2 = deviationMag2;
                            minDeviation = deviation;
                        }
                    }

                    if (minDeviationMagnitude2 > 0) {
                        // we had a non-zero deviation from the unconstrained,
                        // so move all vertices by that amount

                        return unconstrainedVertices.map(
                            (unconstrainedVertex) =>
                                unconstrainedVertex.map((v, i) =>
                                    me.fromAst(
                                        v.evaluate_to_constant() +
                                            minDeviation[i],
                                    ),
                                ),
                        );
                    } else {
                        // there were no deviations so just use the unconstrained vertices
                        return unconstrainedVertices;
                    }
                };

                return { setValue: { verticesConstraintFunction } };
            },
        };

        return stateVariableDefinitions;
    }
}
