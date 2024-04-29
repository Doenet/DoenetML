import {
    attractSegment,
    nearestPointForSegment,
    nearestPointForSegmentAsLine,
    returnConstraintGraphInfoDefinitions,
    returnVertexConstraintFunction,
    returnVertexConstraintFunctionFromEdges,
} from "../utils/constraints";
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

        attributes.threshold = {
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
                    variableNames: ["numericalVertices", "numericalXs"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                let pointsByObject = [];

                for (let object of dependencyValues.graphicalChildren) {
                    if (object.stateValues.numericalVertices) {
                        pointsByObject.push(
                            object.stateValues.numericalVertices,
                        );
                    } else if (object.stateValues.numericalXs) {
                        pointsByObject.push([object.stateValues.numericalXs]);
                    } else {
                        pointsByObject.push([]);
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

        stateVariableDefinitions.segmentsByObject = {
            returnDependencies: () => ({
                graphicalChildren: {
                    dependencyType: "child",
                    childGroups: ["graphical"],
                    variableNames: ["numericalVertices", "closed"],
                    variablesOptional: true,
                },
            }),

            definition({ dependencyValues }) {
                let segmentsByObject = [];

                for (let object of dependencyValues.graphicalChildren) {
                    if (object.stateValues.numericalVertices) {
                        let vertices = object.stateValues.numericalVertices;
                        let numVertices = vertices.length;
                        let segments = [];
                        for (let i = 1; i < numVertices; i++) {
                            segments.push([vertices[i - 1], vertices[i]]);
                        }
                        if (object.stateValues.closed) {
                            segments.push([
                                vertices[numVertices - 1],
                                vertices[0],
                            ]);
                        }

                        segmentsByObject.push(segments);
                    } else {
                        segmentsByObject.push([]);
                    }
                }
                return {
                    setValue: {
                        segmentsByObject,
                    },
                };
            },
        };

        stateVariableDefinitions.getSegmentsForObject = {
            returnDependencies: () => ({
                segmentsByObject: {
                    dependencyType: "stateVariable",
                    variableName: "segmentsByObject",
                },
            }),
            definition({ dependencyValues }) {
                let getSegmentsForObject = function (objectInd) {
                    return dependencyValues.segmentsByObject
                        .filter((v, i) => i !== objectInd)
                        .reduce((a, c) => {
                            a.push(...c);
                            return a;
                        }, []);
                };

                return {
                    setValue: {
                        getSegmentsForObject,
                    },
                };
            },
        };

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

        stateVariableDefinitions.verticesConstraintFunction = {
            returnDependencies: () => ({
                getPointsForObject: {
                    dependencyType: "stateVariable",
                    variableName: "getPointsForObject",
                },
                getSegmentsForObject: {
                    dependencyType: "stateVariable",
                    variableName: "getSegmentsForObject",
                },
                threshold: {
                    dependencyType: "stateVariable",
                    variableName: "threshold",
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

                let threshold2 =
                    dependencyValues.threshold * dependencyValues.threshold;

                let edgeConstraintSub = function (
                    { unconstrainedEdges, allowRotation, enforceRigid },
                    { objectInd },
                ) {
                    let pointsToAttract =
                        dependencyValues.getPointsForObject(objectInd);
                    let segmentsToAttract =
                        dependencyValues.getSegmentsForObject(objectInd);

                    let constrainedEdges = [];
                    let constraintUsedForEdge = [];

                    for (let unconstrainedEdge of unconstrainedEdges) {
                        let numericalNearestPointFunctions = [];
                        let numericalNearestPointAsLineFunctions = [];

                        for (let segment of segmentsToAttract) {
                            numericalNearestPointFunctions.push(
                                (point, scales) =>
                                    nearestPointForSegment({
                                        point,
                                        segment,
                                        scales,
                                    }),
                            );
                            numericalNearestPointAsLineFunctions.push(
                                (point, scales) =>
                                    nearestPointForSegmentAsLine({
                                        point,
                                        segment,
                                        scales,
                                    }),
                            );
                        }

                        let result = attractSegment({
                            segment: unconstrainedEdge,
                            allowRotation,
                            scales,
                            threshold2,
                            numericalNearestPointFunctions,
                            numericalNearestPointAsLineFunctions,
                            attractingPoints: pointsToAttract,
                        });

                        if (result.constrained) {
                            constrainedEdges.push(
                                result.segment.map((vertex) =>
                                    vertex.map((v) => me.fromAst(v)),
                                ),
                            );
                            constraintUsedForEdge.push(true);
                        } else {
                            constrainedEdges.push(unconstrainedEdge);
                            constraintUsedForEdge.push(false);
                        }
                    }

                    return { constrainedEdges, constraintUsedForEdge };
                };

                let vertexConstraintSub = function (
                    unconstrainedVertices,
                    objectInd,
                ) {
                    let pointsToAttract =
                        dependencyValues.getPointsForObject(objectInd);
                    let segmentsToAttract =
                        dependencyValues.getSegmentsForObject(objectInd);

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

                        // first check if attracted to point
                        let constraintUsed = false;
                        let constrainedVertex;
                        if (closestDistance2 < threshold2) {
                            constraintUsed = true;
                            constrainedVertex = closestPoint.map((v) =>
                                me.fromAst(v),
                            );
                        } else {
                            // if not attracted to point, try attracting to segment
                            closestDistance2 = Infinity;
                            closestPoint = {};

                            for (let segment of segmentsToAttract) {
                                let point = nearestPointForSegment({
                                    point: numericalVertex,
                                    segment,
                                    scales,
                                });

                                if (point) {
                                    let distance2 = numericalVertex.reduce(
                                        (a, c, i) =>
                                            a +
                                            Math.pow(
                                                (c - point[i]) / scales[i],
                                                2,
                                            ),
                                        0,
                                    );

                                    if (distance2 < closestDistance2) {
                                        closestPoint = point;
                                        closestDistance2 = distance2;
                                    }
                                }
                            }

                            if (closestDistance2 < threshold2) {
                                constraintUsed = true;
                                constrainedVertex = closestPoint.map((v) =>
                                    me.fromAst(v),
                                );
                            } else {
                                constrainedVertex = unconstrainedVertex;
                            }
                        }

                        constrainedVertices.push(constrainedVertex);
                        constraintUsedForVertex.push(constraintUsed);
                    }

                    return { constrainedVertices, constraintUsedForVertex };
                };

                let edgeConstraintFunction =
                    returnVertexConstraintFunctionFromEdges(edgeConstraintSub);

                let originalVerticesConstraintFunction =
                    returnVertexConstraintFunction(vertexConstraintSub);

                let verticesConstraintFunction = function (
                    {
                        unconstrainedVertices,
                        closed,
                        enforceRigid,
                        allowRotation,
                    },
                    { objectInd },
                ) {
                    let constrainedVertices = edgeConstraintFunction(
                        {
                            unconstrainedVertices,
                            closed,
                            enforceRigid,
                            allowRotation,
                        },
                        { objectInd },
                    );

                    constrainedVertices = originalVerticesConstraintFunction(
                        constrainedVertices,
                        enforceRigid,
                        objectInd,
                    );

                    return constrainedVertices;
                };

                return { setValue: { verticesConstraintFunction } };
            },
        };

        stateVariableDefinitions.pointConstraintFunction = {
            returnDependencies: () => ({
                getPointsForObject: {
                    dependencyType: "stateVariable",
                    variableName: "getPointsForObject",
                },
                getSegmentsForObject: {
                    dependencyType: "stateVariable",
                    variableName: "getSegmentsForObject",
                },
                threshold: {
                    dependencyType: "stateVariable",
                    variableName: "threshold",
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

                let pointConstraintFunction = function (
                    unconstrainedXs,
                    objectInd,
                ) {
                    let numericalXs = unconstrainedXs.map((v) =>
                        findFiniteNumericalValue(v),
                    );

                    let pointsToAttract =
                        dependencyValues.getPointsForObject(objectInd);
                    let segmentsToAttract =
                        dependencyValues.getSegmentsForObject(objectInd);

                    let closestDistance2 = Infinity;
                    let closestPoint = {};

                    for (let point of pointsToAttract) {
                        if (numericalXs.length !== point.length) {
                            continue;
                        }

                        let distance2 = numericalXs.reduce(
                            (a, c, i) =>
                                a + Math.pow((c - point[i]) / scales[i], 2),
                            0,
                        );

                        if (distance2 < closestDistance2) {
                            closestPoint = point;
                            closestDistance2 = distance2;
                        }
                    }

                    if (
                        closestDistance2 <
                        dependencyValues.threshold * dependencyValues.threshold
                    ) {
                        return closestPoint.map((v) => me.fromAst(v));
                    } else {
                        // if not attracted to point, try attracting to segment
                        closestDistance2 = Infinity;
                        closestPoint = {};

                        for (let segment of segmentsToAttract) {
                            let point = nearestPointForSegment({
                                point: numericalXs,
                                segment,
                                scales,
                            });

                            if (point) {
                                let distance2 = numericalXs.reduce(
                                    (a, c, i) =>
                                        a +
                                        Math.pow((c - point[i]) / scales[i], 2),
                                    0,
                                );

                                if (distance2 < closestDistance2) {
                                    closestPoint = point;
                                    closestDistance2 = distance2;
                                }
                            }
                        }

                        if (
                            closestDistance2 <
                            dependencyValues.threshold *
                                dependencyValues.threshold
                        ) {
                            return closestPoint.map((v) => me.fromAst(v));
                        } else {
                            return unconstrainedXs;
                        }
                    }
                };

                return { setValue: { pointConstraintFunction } };
            },
        };

        return stateVariableDefinitions;
    }
}
