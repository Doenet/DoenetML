import {
    attractSegment,
    nearestPointForSegment,
    nearestPointForSegmentAsLine,
} from "../utils/constraintUtils";
import {
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

        attributes.angleThreshold = {
            createComponentOfType: "number",
            createStateVariable: "angleThreshold",
            defaultValue: Math.PI * 0.03,
            public: true,
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
                    variableNames: [
                        "numericalVertices",
                        "numericalXs",
                        "numericalEndpoints",
                    ],
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
                    } else if (object.stateValues.numericalEndpoints) {
                        pointsByObject.push(
                            object.stateValues.numericalEndpoints,
                        );
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
                    variableNames: [
                        "numericalVertices",
                        "closed",
                        "numericalEndpoints",
                    ],
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
                    } else if (object.stateValues.numericalEndpoints) {
                        let endpoints = object.stateValues.numericalEndpoints;
                        let numEndpoints = endpoints.length;
                        let segments = [];
                        for (let i = 1; i < numEndpoints; i++) {
                            segments.push([endpoints[i - 1], endpoints[i]]);
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
                angleThreshold: {
                    dependencyType: "stateVariable",
                    variableName: "angleThreshold",
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

                let angleThreshold = dependencyValues.angleThreshold;

                // Specify whether or not each edge would be constrained
                // and what its constrained location would be.
                // This information will be synthesized across edges by returnVertexConstraintFunctionFromEdges,
                // which will give the resulting constraints in terms of vertices.
                //
                // Most of these constraints are specified independently for each edge,
                // except for a final possible rotation that occurs only if no other constraints occurred.
                let edgeConstraintSub = function (
                    {
                        numericalUnconstrainedEdges,
                        allowRotation,
                        enforceRigid,
                        shrinkThreshold,
                        rotationPoint,
                    },
                    { objectInd },
                ) {
                    let segmentsToAttract =
                        dependencyValues.getSegmentsForObject(objectInd);

                    let numericalConstrainedEdges = [];
                    let constraintUsedForEdge = [];
                    let foundConstraint = false;

                    let almostConstrained = {
                        distance2: Infinity,
                    };

                    let threshold = dependencyValues.threshold;
                    if (shrinkThreshold) {
                        threshold *= 0.2;
                    }
                    let threshold2 = threshold * threshold;

                    for (let [
                        edgeInd,
                        numericalUnconstrainedEdge,
                    ] of numericalUnconstrainedEdges.entries()) {
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
                            segment: numericalUnconstrainedEdge,
                            allowRotation,
                            scales,
                            threshold2,
                            numericalNearestPointFunctions,
                            numericalNearestPointAsLineFunctions,
                        });

                        if (result.constrained) {
                            numericalConstrainedEdges.push(result.segment);
                            constraintUsedForEdge.push(true);
                            foundConstraint = true;
                        } else {
                            numericalConstrainedEdges.push(
                                numericalUnconstrainedEdge,
                            );
                            constraintUsedForEdge.push(false);

                            if (
                                !foundConstraint &&
                                result.distance2 < almostConstrained.distance2
                            ) {
                                almostConstrained = result;
                                almostConstrained.edgeInd = edgeInd;
                            }
                        }
                    }

                    // If no edges were constrained by being near a segment,
                    // then if there was an edge that was almost close enough to be attracted,
                    // rotate that edge if the resulting rotation is small.
                    // Rotate around the centroid of the object
                    if (
                        allowRotation &&
                        enforceRigid &&
                        !foundConstraint &&
                        almostConstrained.distance2 < Infinity
                    ) {
                        let attractedEdgeInd = almostConstrained.edgeInd;
                        let rotateResult = rotateIfClose({
                            attractedEdgeInd,
                            attractingSegment: almostConstrained.segment,
                            angleThreshold,
                            rotationPoint,
                            numericalUnconstrainedEdges,
                        });

                        if (rotateResult) {
                            numericalConstrainedEdges[attractedEdgeInd] =
                                rotateResult;
                            constraintUsedForEdge[attractedEdgeInd] = true;
                            foundConstraint = true;
                        }
                    }

                    // If no edges were constrained by being near a segment,
                    // or rotated because they were close to nearby segment's angle,
                    // then attempt to attract an edge to the angle 0 or pi/2.
                    // If an edge is attracted to that angle, rotate around the centroid of the object
                    if (allowRotation && enforceRigid && !foundConstraint) {
                        let anglesToAttract = [0, Math.PI / 2];

                        let rotateResult = rotateToAttractAngles({
                            numericalUnconstrainedEdges,
                            anglesToAttract,
                            angleThreshold,
                            rotationPoint,
                        });

                        if (rotateResult) {
                            let ind = rotateResult.rotatedEdgeInd;
                            numericalConstrainedEdges[ind] =
                                rotateResult.rotatedEdge;
                            constraintUsedForEdge[ind] = true;
                            foundConstraint = true;
                        }
                    }

                    return {
                        numericalConstrainedEdges,
                        constraintUsedForEdge,
                    };
                };

                // Specify, independently for each vertex, whether or not it would be constrained
                // and what its constrained location would be.
                // This information will be synthesized across vertices by returnVertexConstraintFunction.
                let vertexConstraintSub = function (
                    {
                        numericalUnconstrainedVertices,
                        closed,
                        shrinkThreshold,
                        onlyMoveVertexInd = null,
                    },
                    { objectInd },
                ) {
                    let pointsToAttract =
                        dependencyValues.getPointsForObject(objectInd);
                    let segmentsToAttract =
                        dependencyValues.getSegmentsForObject(objectInd);

                    let numericalConstrainedVertices = [];
                    let constraintUsedForVertex = [];

                    let threshold = dependencyValues.threshold;
                    if (shrinkThreshold) {
                        threshold *= 0.2;
                    }
                    let threshold2 = threshold * threshold;

                    for (let [
                        ind,
                        unconstrainedVertex,
                    ] of numericalUnconstrainedVertices.entries()) {
                        if (
                            onlyMoveVertexInd !== null &&
                            ind !== onlyMoveVertexInd
                        ) {
                            // we skip this vertex
                            numericalConstrainedVertices.push(
                                unconstrainedVertex,
                            );
                            constraintUsedForVertex.push(false);
                            continue;
                        }

                        let closestDistance2 = Infinity;
                        let closestPoint = {};

                        for (let point of pointsToAttract) {
                            if (unconstrainedVertex.length !== point.length) {
                                continue;
                            }

                            let distance2 = unconstrainedVertex.reduce(
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
                            constrainedVertex = closestPoint;
                        } else {
                            // if not attracted to point, try attracting to segment
                            closestDistance2 = Infinity;
                            closestPoint = {};

                            for (let segment of segmentsToAttract) {
                                let point = nearestPointForSegment({
                                    point: unconstrainedVertex,
                                    segment,
                                    scales,
                                });

                                if (point) {
                                    let distance2 = unconstrainedVertex.reduce(
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
                                constrainedVertex = closestPoint;
                            } else {
                                constrainedVertex = unconstrainedVertex;
                            }
                        }

                        numericalConstrainedVertices.push(constrainedVertex);
                        constraintUsedForVertex.push(constraintUsed);
                    }

                    // if any pair of vertices corresponding to an edge have not yet been constrained
                    // check if the edge between the vertices can be constrained by any pointsToAttract

                    let numVertices = numericalUnconstrainedVertices.length;
                    let stopInd = closed ? numVertices : numVertices - 1;

                    let potentialConstraintsForEdges = [];

                    for (
                        let vertexInd1 = 0;
                        vertexInd1 < stopInd;
                        vertexInd1++
                    ) {
                        let vertexInd2 = (vertexInd1 + 1) % numVertices;

                        if (
                            onlyMoveVertexInd !== null &&
                            !(
                                onlyMoveVertexInd === vertexInd1 ||
                                onlyMoveVertexInd === vertexInd2
                            )
                        ) {
                            continue;
                        }

                        if (
                            !(
                                constraintUsedForVertex[vertexInd1] ||
                                constraintUsedForVertex[vertexInd2]
                            )
                        ) {
                            let numericalVertex1 =
                                numericalUnconstrainedVertices[vertexInd1];
                            let numericalVertex2 =
                                numericalUnconstrainedVertices[vertexInd2];

                            let closestSegment;
                            let closestDistance2 = Infinity;

                            for (let attractingPoint of pointsToAttract) {
                                let closestPoint = nearestPointForSegment({
                                    point: attractingPoint,
                                    segment: [
                                        numericalVertex1,
                                        numericalVertex2,
                                    ],
                                    scales,
                                });

                                if (closestPoint) {
                                    let distance2 = closestPoint.reduce(
                                        (a, c, i) =>
                                            a +
                                            Math.pow(c - attractingPoint[i], 2),
                                        0,
                                    );

                                    if (distance2 < closestDistance2) {
                                        if (onlyMoveVertexInd === null) {
                                            // translate the points by attractingPoint - closestPoint
                                            let newPoint1 =
                                                numericalVertex1.map(
                                                    (v, i) =>
                                                        v +
                                                        attractingPoint[i] -
                                                        closestPoint[i],
                                                );

                                            let newPoint2 =
                                                numericalVertex2.map(
                                                    (v, i) =>
                                                        v +
                                                        attractingPoint[i] -
                                                        closestPoint[i],
                                                );

                                            closestSegment = [
                                                newPoint1,
                                                newPoint2,
                                            ];
                                            closestDistance2 = distance2;
                                        } else {
                                            let fixedVertex;
                                            if (
                                                onlyMoveVertexInd === vertexInd1
                                            ) {
                                                fixedVertex = numericalVertex2;
                                            } else {
                                                fixedVertex = numericalVertex1;
                                            }

                                            // find line segment through fixedVertex and attractingPoint,
                                            // with same length as original

                                            let displacement = [
                                                attractingPoint[0] -
                                                    fixedVertex[0],
                                                attractingPoint[1] -
                                                    fixedVertex[1],
                                            ];

                                            let displacementLength = Math.sqrt(
                                                Math.pow(displacement[0], 2) +
                                                    Math.pow(
                                                        displacement[1],
                                                        2,
                                                    ),
                                            );

                                            let desiredLength = Math.sqrt(
                                                Math.pow(
                                                    numericalVertex1[0] -
                                                        numericalVertex2[0],
                                                    2,
                                                ) +
                                                    Math.pow(
                                                        numericalVertex1[1] -
                                                            numericalVertex2[1],
                                                        2,
                                                    ),
                                            );
                                            let ratio =
                                                desiredLength /
                                                displacementLength;

                                            // if ratio is less than 1,
                                            // then the attracting point was beyond the edge of the line segment
                                            // and so the edge itself was not attracted to it.
                                            if (ratio < 1) {
                                                continue;
                                            }

                                            let movedPoint = fixedVertex.map(
                                                (v, i) =>
                                                    v + displacement[i] * ratio,
                                            );

                                            let potentialClosestSegment;
                                            if (
                                                onlyMoveVertexInd === vertexInd1
                                            ) {
                                                potentialClosestSegment = [
                                                    movedPoint,
                                                    numericalVertex2,
                                                ];
                                                distance2 =
                                                    Math.pow(
                                                        numericalVertex1[0] -
                                                            movedPoint[0],
                                                        2,
                                                    ) +
                                                    Math.pow(
                                                        numericalVertex1[1] -
                                                            movedPoint[1],
                                                        2,
                                                    );
                                            } else {
                                                potentialClosestSegment = [
                                                    numericalVertex1,
                                                    movedPoint,
                                                ];

                                                distance2 =
                                                    Math.pow(
                                                        numericalVertex2[0] -
                                                            movedPoint[0],
                                                        2,
                                                    ) +
                                                    Math.pow(
                                                        numericalVertex2[1] -
                                                            movedPoint[1],
                                                        2,
                                                    );
                                            }

                                            if (distance2 < closestDistance2) {
                                                closestDistance2 = distance2;
                                                closestSegment =
                                                    potentialClosestSegment;
                                            }
                                        }
                                    }
                                }
                            }

                            if (closestDistance2 < threshold2) {
                                potentialConstraintsForEdges.push({
                                    vertexInd1,
                                    vertexInd2,
                                    distance2: closestDistance2,
                                    movedSegment: closestSegment,
                                });
                            }
                        }
                    }

                    // since constraints could overlap on edges,
                    // process the constraints starting with the minimal distance,
                    // and use them only if both vertices are still unconstrained.
                    potentialConstraintsForEdges.sort(
                        (a, b) => a.distance2 - b.distance2,
                    );

                    for (let {
                        vertexInd1,
                        vertexInd2,
                        movedSegment,
                    } of potentialConstraintsForEdges) {
                        if (
                            !(
                                constraintUsedForVertex[vertexInd1] ||
                                constraintUsedForVertex[vertexInd2]
                            )
                        ) {
                            constraintUsedForVertex[vertexInd1] = true;
                            constraintUsedForVertex[vertexInd2] = true;

                            numericalConstrainedVertices[vertexInd1] =
                                movedSegment[0];
                            numericalConstrainedVertices[vertexInd2] =
                                movedSegment[1];
                        }
                    }

                    return {
                        numericalConstrainedVertices,
                        constraintUsedForVertex,
                    };
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
                        rotationPoint,
                        shrinkThreshold,
                        vertexIndMoved,
                    },
                    { objectInd },
                ) {
                    // first apply the edge constraint function,
                    // as that may rotate the object
                    let constrainedVertices = edgeConstraintFunction(
                        {
                            unconstrainedVertices,
                            closed,
                            enforceRigid,
                            allowRotation,
                            rotationPoint,
                            shrinkThreshold,
                            vertexIndMoved,
                        },
                        { objectInd },
                    );

                    // then apply the vertex constraint function to the result
                    constrainedVertices = originalVerticesConstraintFunction(
                        {
                            unconstrainedVertices: constrainedVertices,
                            closed,
                            enforceRigid,
                            shrinkThreshold,
                            vertexIndMoved,
                        },
                        { objectInd },
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

// Find the edge whose angle is closest to one of anglesToAttract.
// If it is closer that angleThreshold, then rotate the edge
// around the centroid of the shape in order to match the angle
function rotateToAttractAngles({
    numericalUnconstrainedEdges,
    anglesToAttract,
    angleThreshold,
    rotationPoint,
}) {
    // find the edge with minimal deviation from one of the angles to attract

    let minDAngle = Infinity;
    let attractedEdgeInd;

    for (let [
        edgeInd,
        unconstrainedEdge,
    ] of numericalUnconstrainedEdges.entries()) {
        let edgeAngle = Math.atan(
            (unconstrainedEdge[1][1] - unconstrainedEdge[0][1]) /
                (unconstrainedEdge[1][0] - unconstrainedEdge[0][0]),
        );

        for (let attractingAngle of anglesToAttract) {
            let dAngle =
                me.math.mod(
                    attractingAngle - edgeAngle + Math.PI / 2,
                    Math.PI,
                ) -
                Math.PI / 2;

            if (Math.abs(dAngle) < Math.abs(minDAngle)) {
                minDAngle = dAngle;
                attractedEdgeInd = edgeInd;
            }
        }
    }

    if (!(Math.abs(minDAngle) < angleThreshold)) {
        return null;
    }

    // rotate the attracted edge around the rotation point

    let [cx, cy] = rotationPoint;

    let cos_theta = Math.cos(minDAngle);
    let sin_theta = Math.sin(minDAngle);

    let rotatedEdge = numericalUnconstrainedEdges[attractedEdgeInd].map(
        (point) => {
            let dx = point[0] - cx;
            let dy = point[1] - cy;

            return [
                dx * cos_theta - dy * sin_theta + cx,
                dx * sin_theta + dy * cos_theta + cy,
            ];
        },
    );

    return { rotatedEdgeInd: attractedEdgeInd, rotatedEdge };
}

// Rotate the edge of attractedEdgeInd to match the angle of attractingSegment
// if their angles are similar.
// Rotate around the centroid of the shape.
function rotateIfClose({
    attractedEdgeInd,
    attractingSegment,
    angleThreshold,
    rotationPoint,
    numericalUnconstrainedEdges,
}) {
    let attractingAngle = Math.atan(
        (attractingSegment[1][1] - attractingSegment[0][1]) /
            (attractingSegment[1][0] - attractingSegment[0][0]),
    );
    let edge = numericalUnconstrainedEdges[attractedEdgeInd];
    let edgeAngle = Math.atan(
        (edge[1][1] - edge[0][1]) / (edge[1][0] - edge[0][0]),
    );

    let dAngle =
        me.math.mod(attractingAngle - edgeAngle + Math.PI / 2, Math.PI) -
        Math.PI / 2;

    if (!(Math.abs(dAngle) < angleThreshold)) {
        return null;
    }

    // rotate the attracted edge around the rotation point
    let [cx, cy] = rotationPoint;

    let cos_theta = Math.cos(dAngle);
    let sin_theta = Math.sin(dAngle);

    let rotatedEdge = numericalUnconstrainedEdges[attractedEdgeInd].map(
        (point) => {
            let dx = point[0] - cx;
            let dy = point[1] - cy;

            return [
                dx * cos_theta - dy * sin_theta + cx,
                dx * sin_theta + dy * cos_theta + cy,
            ];
        },
    );

    return rotatedEdge;
}
