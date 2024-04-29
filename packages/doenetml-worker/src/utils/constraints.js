import me from "math-expressions";
import { findFiniteNumericalValue } from "./math";

export function applyConstraintFromComponentConstraints(
    variables,
    applyComponentConstraint,
) {
    let newVariables = {};
    let constrained = false;

    for (let varName in variables) {
        let result = applyComponentConstraint({
            [varName]: variables[varName],
        });
        if (result.constrained) {
            constrained = true;
            newVariables[varName] = result.variables[varName];
        }
    }
    if (constrained) {
        return {
            constrained,
            variables: newVariables,
        };
    } else {
        return {};
    }
}

export function returnConstraintGraphInfoDefinitions() {
    return {
        scales: {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                graphAncestor: {
                    dependencyType: "ancestor",
                    componentType: "graph",
                    variableNames: ["xscale", "yscale"],
                },
                shadowedConstraints: {
                    dependencyType: "shadowSource",
                    variableNames: ["scales"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.graphAncestor) {
                    let SVs = dependencyValues.graphAncestor.stateValues;
                    let scales = [SVs.xscale, SVs.yscale, 1];

                    if (scales.every((x) => Number.isFinite(x) && x > 0)) {
                        return { setValue: { scales } };
                    }
                } else if (dependencyValues.shadowedConstraints) {
                    // if we are shadowing a constraints and not in a graph
                    // use the scales from the shadow
                    // Rationale: if we copy a component to a location outside a graph
                    // (e.g. to display the coordinates of a point)
                    // we don't intend to remove the constraints imposed by the graph.
                    return {
                        setValue: {
                            scales: dependencyValues.shadowedConstraints
                                .stateValues.scales,
                        },
                    };
                }

                return { setValue: { scales: [1, 1, 1] } };
            },
        },

        graphXmin: {
            additionalStateVariablesDefined: [
                "graphXmax",
                "graphYmin",
                "graphYmax",
            ],
            returnDependencies: () => ({
                graphAncestor: {
                    dependencyType: "ancestor",
                    componentType: "graph",
                    variableNames: ["xmin", "xmax", "ymin", "ymax"],
                },
                shadowedConstraints: {
                    dependencyType: "shadowSource",
                    variableNames: [
                        "graphXmin",
                        "graphXmax",
                        "graphYmin",
                        "graphYmax",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (!dependencyValues.graphAncestor) {
                    if (dependencyValues.shadowedConstraints) {
                        // if we are shadowing a constraints and not in a graph
                        // use the limits from the shadow
                        // Rationale: if we copy a component to a location outside a graph
                        // (e.g. to display the coordinates of a point)
                        // we don't intend to remove the constraints imposed by the graph.
                        let { graphXmin, graphXmax, graphYmin, graphYmax } =
                            dependencyValues.shadowedConstraints.stateValues;
                        return {
                            setValue: {
                                graphXmin,
                                graphXmax,
                                graphYmin,
                                graphYmax,
                            },
                        };
                    } else {
                        return {
                            setValue: {
                                graphXmin: null,
                                graphXmax: null,
                                graphYmin: null,
                                graphYmax: null,
                            },
                        };
                    }
                }

                let graphXmin = dependencyValues.graphAncestor.stateValues.xmin;
                let graphXmax = dependencyValues.graphAncestor.stateValues.xmax;
                let graphYmin = dependencyValues.graphAncestor.stateValues.ymin;
                let graphYmax = dependencyValues.graphAncestor.stateValues.ymax;

                if (
                    [graphXmin, graphXmax, graphYmin, graphYmax].every(
                        Number.isFinite,
                    )
                ) {
                    return {
                        setValue: {
                            graphXmin,
                            graphXmax,
                            graphYmin,
                            graphYmax,
                        },
                    };
                } else {
                    return {
                        setValue: {
                            graphXmin: null,
                            graphXmax: null,
                            graphYmin: null,
                            graphYmax: null,
                        },
                    };
                }
            },
        },
    };
}

export function returnStickyGroupDefinitions() {
    return {
        inStickyGroup: {
            returnDependencies: () => ({
                stickyParent: {
                    dependencyType: "parentIdentity",
                    parentComponentType: "stickyGroup",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        inStickyGroup: Boolean(dependencyValues.stickyParent),
                    },
                };
            },
        },
        stickyVerticesConstraintFunction: {
            returnDependencies: () => ({
                verticesConstraintFunction: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "stickyGroup",
                    variableName: "verticesConstraintFunction",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        stickyVerticesConstraintFunction:
                            dependencyValues.verticesConstraintFunction,
                    },
                };
            },
        },
        stickyPointConstraintFunction: {
            returnDependencies: () => ({
                pointConstraintFunction: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "stickyGroup",
                    variableName: "pointConstraintFunction",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        stickyPointConstraintFunction:
                            dependencyValues.pointConstraintFunction,
                    },
                };
            },
        },
        stickyObjectIndex: {
            returnDependencies: () => ({
                countAmongSiblings: {
                    dependencyType: "countAmongSiblings",
                    componentType: "_graphical",
                    includeInheritedComponentTypes: true,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        stickyObjectIndex:
                            dependencyValues.countAmongSiblings - 1,
                    },
                };
            },
        },
    };
}

// Create a vertex constraint function that applies the origin constraintFunction
// to the vertices and optionally find the best rigid translation is closest to the constraint.
//
// If enforceRigid is true, then after evaluation constraintFunction,
// it attempts to find translations that, if applying constraintFunction again,
// maximizes the number of vertices that are constrained but don't move
export function returnVertexConstraintFunction(constraintFunction) {
    return function (unconstrainedVertices, enforceRigid, ...args) {
        let { constrainedVertices, constraintUsedForVertex } =
            constraintFunction(unconstrainedVertices, ...args);

        if (constraintUsedForVertex.every((v) => !v)) {
            return unconstrainedVertices;
        } else if (!enforceRigid) {
            return constrainedVertices;
        }

        // Since have constrained vertices and we keep the shape rigid,
        // we look for a translation that "best" satisfies the constraints.
        // For each vertex that was constrained,
        // we translate all vertices to make that vertex's constraint,
        // apply the constraint again, and count how many vertices were both
        // constrained and did not move.
        // We pick the translation that maximizes this count.
        // To break ties, we pick the minimum translation.

        let translationResults = [];

        let numericalUnconstrainedVertices = unconstrainedVertices.map(
            (vertex) => vertex.map((v) => v.evaluate_to_constant()),
        );

        let maxConstrainedUnmoved = 0;

        for (let vertexInd in unconstrainedVertices) {
            if (!constraintUsedForVertex[vertexInd]) {
                continue;
            }

            let translation = [];

            let numericalUnconstrainedVertex =
                numericalUnconstrainedVertices[vertexInd];
            let constrainedVertex = constrainedVertices[vertexInd];

            for (let dim in numericalUnconstrainedVertex) {
                let numericalUnconstrainedX = numericalUnconstrainedVertex[dim];
                let constrainedX =
                    constrainedVertex[dim].evaluate_to_constant();
                let dx = constrainedX - numericalUnconstrainedX;
                translation.push(dx);
            }

            let translatedVertices = numericalUnconstrainedVertices.map(
                (numericalUnconstrainedVertex) =>
                    numericalUnconstrainedVertex.map((v, i) =>
                        me.fromAst(v + translation[i]),
                    ),
            );

            // try constraining from the translation
            let {
                constrainedVertices: newVertices,
                constraintUsedForVertex: newConstraintsUsed,
            } = constraintFunction(translatedVertices, ...args);

            let numVerticesConstrainedUnmoved = 0;

            for (let vertexInd2 in translatedVertices) {
                if (!newConstraintsUsed[vertexInd2]) {
                    continue;
                }

                // TODO: make a relative threshold?
                let threshold = 1e-6;

                // vertex was constrained, check if each component didn't move more than the threshold
                let moved = false;
                let translatedVertex = translatedVertices[vertexInd2];
                let newVertex = newVertices[vertexInd2];

                for (let dim in numericalUnconstrainedVertex) {
                    let translatedVertexX =
                        translatedVertex[dim].evaluate_to_constant();
                    let newX = newVertex[dim].evaluate_to_constant();
                    let dx = newX - translatedVertexX;

                    if (Math.abs(dx) > threshold) {
                        moved = true;
                        break;
                    }
                }

                if (!moved) {
                    numVerticesConstrainedUnmoved++;
                }
            }

            if (numVerticesConstrainedUnmoved > maxConstrainedUnmoved) {
                // reset the translation results as we found a better option
                translationResults = [
                    {
                        translation,
                        vertexInd,
                    },
                ];
                maxConstrainedUnmoved = numVerticesConstrainedUnmoved;
            } else if (numVerticesConstrainedUnmoved == maxConstrainedUnmoved) {
                translationResults.push({
                    translation,
                    vertexInd,
                });
            }
        }

        if (translationResults.length === 1) {
            // we found the unique best choice
            let translation = translationResults[0].translation;
            return numericalUnconstrainedVertices.map((unconstrainedVertex) =>
                unconstrainedVertex.map((v, i) =>
                    me.fromAst(v + translation[i]),
                ),
            );
        }

        // Have multiple best choices.
        // Break tie by finding the minimum translation.
        let minTranslation = [];
        let minTranslationMagnitude2 = Infinity;
        for (result of translationResults) {
            let translation = result.translation;
            let translationMag2 = translation.reduce((a, c) => a + c * c, 0);

            if (translationMag2 < minTranslationMagnitude2) {
                minTranslationMagnitude2 = translationMag2;
                minTranslation = translation;
            }
        }

        if (minTranslationMagnitude2 > 0) {
            // we had a non-zero deviation from the unconstrained,
            // so move all vertices by that amount

            return numericalUnconstrainedVertices.map((unconstrainedVertex) =>
                unconstrainedVertex.map((v, i) =>
                    me.fromAst(v + minTranslation[i]),
                ),
            );
        } else {
            // there were no deviations so just use the unconstrained vertices
            return unconstrainedVertices;
        }
    };
}

export function returnVertexConstraintFunctionFromEdges(constraintFunction) {
    return function (
        { unconstrainedVertices, closed, enforceRigid, allowRotation },
        ...args
    ) {
        let unconstrainedEdges = [];
        for (let ind = 1; ind < unconstrainedVertices.length; ind++) {
            unconstrainedEdges.push([
                unconstrainedVertices[ind - 1],
                unconstrainedVertices[ind],
            ]);
        }
        if (closed) {
            unconstrainedEdges.push([
                unconstrainedVertices[unconstrainedVertices.length - 1],
                unconstrainedVertices[0],
            ]);
        }

        let { constrainedEdges, constraintUsedForEdge } = constraintFunction(
            { unconstrainedEdges, allowRotation, enforceRigid },
            ...args,
        );

        if (constraintUsedForEdge.every((v) => !v)) {
            return unconstrainedVertices;
        }

        let numericalUnconstrainedVertices = unconstrainedVertices.map(
            (vertex) => vertex.map((v) => v.evaluate_to_constant()),
        );

        let numericalUnconstrainedEdges = [];
        for (let ind = 1; ind < numericalUnconstrainedVertices.length; ind++) {
            numericalUnconstrainedEdges.push([
                numericalUnconstrainedVertices[ind - 1],
                numericalUnconstrainedVertices[ind],
            ]);
        }
        if (closed) {
            numericalUnconstrainedEdges.push([
                numericalUnconstrainedVertices[
                    numericalUnconstrainedVertices.length - 1
                ],
                numericalUnconstrainedVertices[0],
            ]);
        }

        let numericalConstrainedEdges = {};

        // for each constrained edge, calculate the deviation from the unconstrained edge to constrained edge
        let deviation2ByEdge = [];
        for (let edgeInd in unconstrainedEdges) {
            if (!constraintUsedForEdge[edgeInd]) {
                continue;
            }

            let numericalConstrainedEdge = (numericalConstrainedEdges[edgeInd] =
                constrainedEdges[edgeInd].map((vertex) =>
                    vertex.map((v) => v.evaluate_to_constant()),
                ));

            let numericalUnconstrainedEdge =
                numericalUnconstrainedEdges[edgeInd];

            let deviation2 = 0;

            // just add up the squared deviation for each vertex of the edge
            for (let vertexInd in numericalUnconstrainedEdge) {
                let numericalUnconstrainedVertex =
                    numericalUnconstrainedEdge[vertexInd];
                let numericalConstrainedVertex =
                    numericalConstrainedEdge[vertexInd];

                for (let dim in numericalUnconstrainedVertex) {
                    let numericalUnconstrainedX =
                        numericalUnconstrainedVertex[dim];
                    let numericalConstrainedX = numericalConstrainedVertex[dim];
                    deviation2 += Math.pow(
                        numericalUnconstrainedX - numericalConstrainedX,
                        2,
                    );
                }
            }

            deviation2ByEdge.push({ edgeInd, deviation2 });
        }

        if (!enforceRigid) {
            // if not enforcing rigid, the move the vertices
            // according to the edges, starting with the edges that moved the least,
            // and ignoring later edges that aren't consistent with the earlier ones

            deviation2ByEdge.sort((a, b) => a.deviation2 - b.deviation2);

            let constrainedVertices = [...unconstrainedVertices];

            let vertexIndsConstrained = [];
            let diffThreshold2 = 1e-6 ** 2;

            for (let { edgeInd, deviation2 } of deviation2ByEdge) {
                let vertexInd1 = Number(edgeInd);
                let vertexInd2 =
                    (vertexInd1 + 1) % numericalUnconstrainedVertices.length;

                if (vertexIndsConstrained.includes(vertexInd1)) {
                    // This vertex is being constrained again.
                    // Check that we got the same value again
                    let vec1 = constrainedVertices[vertexInd1].map((v) =>
                        v.evaluate_to_constant(),
                    );
                    let vec2 = numericalConstrainedEdges[edgeInd][0];

                    if (
                        Math.pow(vec1[0] - vec2[0], 2) +
                            Math.pow(vec1[1] - vec2[1], 2) >
                        diffThreshold2
                    ) {
                        // inconsistent position for vertexInd1, so skip
                        continue;
                    }
                }
                if (vertexIndsConstrained.includes(vertexInd2)) {
                    // This vertex is being constrained again.
                    // Check that we got the same value again
                    let vec1 = constrainedVertices[vertexInd2].map((v) =>
                        v.evaluate_to_constant(),
                    );
                    let vec2 = numericalConstrainedEdges[edgeInd][1];

                    if (
                        Math.pow(vec1[0] - vec2[0], 2) +
                            Math.pow(vec1[1] - vec2[1], 2) >
                        diffThreshold2
                    ) {
                        // inconsistent position for vertexInd2, so skip
                        continue;
                    }
                }

                constrainedVertices[vertexInd1] = constrainedEdges[edgeInd][0];
                constrainedVertices[vertexInd2] = constrainedEdges[edgeInd][1];
                vertexIndsConstrained.push(vertexInd1);
                vertexIndsConstrained.push(vertexInd2);
            }

            return constrainedVertices;
        }

        // find the edge that was constrained and moved the minimal amount
        let minDeviationInd = null;
        let minDeviation2 = Infinity;

        for (let { edgeInd, deviation2 } of deviation2ByEdge) {
            if (deviation2 < minDeviation2) {
                minDeviation2 = deviation2;
                minDeviationInd = Number(edgeInd);
            }
        }

        // We need a rigid transformation.
        // Rotate and translate all vertices according to the transformation of minDeviationInd

        let numericalUnconstrainedEdge =
            numericalUnconstrainedEdges[minDeviationInd];
        let numericalConstrainedEdge =
            numericalConstrainedEdges[minDeviationInd];

        // translate based on how the first vertex moved
        let translation = numericalConstrainedEdge[0].map(
            (v, i) => v - numericalUnconstrainedEdge[0][i],
        );

        let constrained_rel = [
            numericalConstrainedEdge[1][0] - numericalConstrainedEdge[0][0],
            numericalConstrainedEdge[1][1] - numericalConstrainedEdge[0][1],
        ];
        let unconstrained_rel = [
            numericalUnconstrainedEdge[1][0] - numericalUnconstrainedEdge[0][0],
            numericalUnconstrainedEdge[1][1] - numericalUnconstrainedEdge[0][1],
        ];

        // rotate around constrained vertex based on change in angle
        let theta =
            Math.atan2(constrained_rel[1], constrained_rel[0]) -
            Math.atan2(unconstrained_rel[1], unconstrained_rel[0]);
        let sin_theta = Math.sin(theta);
        let cos_theta = Math.cos(theta);

        let constrainedVertices = numericalUnconstrainedVertices.map(
            (vertex) => {
                let dx =
                    vertex[0] + translation[0] - numericalConstrainedEdge[0][0];
                let dy =
                    vertex[1] + translation[1] - numericalConstrainedEdge[0][1];

                let x = me.fromAst(
                    numericalConstrainedEdge[0][0] +
                        dx * cos_theta -
                        dy * sin_theta,
                );
                let y = me.fromAst(
                    numericalConstrainedEdge[0][1] +
                        dx * sin_theta +
                        dy * cos_theta,
                );

                return [x, y];
            },
        );

        return constrainedVertices;
    };
}

// Attract the point of point/numericalPoint
// to the closest point based on the nearestPointFunctions.
// If that point is within sqrt(threshold2) of the original point,
// return that as the attracted point.
//
// point: an array with values as math-expressions.
// numericalPoint: point with values converted to numbers
//
// If did not attract to a point within the threshold return null,
// else return the attracted point as an array of numbers

function findAttractedSegmentPointsSub({
    point1,
    point2,
    scales,
    threshold2,
    numericalNearestPointFunction,
    numericalNearestPointAsLineFunction,
    verifyNotOneSided = true,
}) {
    let eps2 = 1e-6 ** 2;

    // Need both points to be attracted when potentially extending attractor as a line,
    // with distance less than threshold
    let nearestPoint1 = numericalNearestPointAsLineFunction(point1, scales);
    if (!nearestPoint1) {
        return { success: false };
    }

    let distance2 = nearestPoint1.reduce(
        (a, c, i) => a + Math.pow(c - point1[i], 2),
        0,
    );
    if (distance2 >= threshold2) {
        return { success: false };
    }

    let nearestPoint2 = numericalNearestPointAsLineFunction(point2, scales);
    if (!nearestPoint2) {
        return { success: false };
    }
    distance2 = nearestPoint2.reduce(
        (a, c, i) => a + Math.pow(c - point2[i], 2),
        0,
    );
    if (distance2 >= threshold2) {
        return { success: false };
    }

    if (verifyNotOneSided) {
        // check if one point is attracted without extending as line
        // to the same point as when attracting with extending
        let nearestPoint1NotExtend = numericalNearestPointFunction(
            point1,
            scales,
        );
        let nearestPoint1Unchanged =
            nearestPoint1NotExtend &&
            nearestPoint1NotExtend.every(
                (v, i) => Math.abs(v - nearestPoint1[i]) < 1e-6,
            );

        let nearestPoint2NotExtend = numericalNearestPointFunction(
            point2,
            scales,
        );
        let nearestPoint2Unchanged =
            nearestPoint2NotExtend &&
            nearestPoint2NotExtend.every(
                (v, i) => Math.abs(v - nearestPoint2[i]) < 1e-6,
            );

        if (!(nearestPoint1Unchanged || nearestPoint2Unchanged)) {
            // Both points moved when attracting without extending as line.
            // If they were both attracted to the same point,
            // then they were on the same side of the segment (as opposed to straddling the segment),
            // and we exclude this case.
            distance2 = nearestPoint1NotExtend.reduce(
                (a, c, i) => a + Math.pow(c - nearestPoint2NotExtend[i], 2),
                0,
            );
            if (distance2 < eps2) {
                return { success: false };
            }
        }
    }

    return {
        success: true,
        nearestPoint1,
        nearestPoint2,
    };
}

function findAttractedSegmentPoints({
    point1,
    point2,
    allowRotation,
    scales,
    threshold2,
    numericalNearestPointFunction,
    numericalNearestPointAsLineFunction,
}) {
    let result = findAttractedSegmentPointsSub({
        point1,
        point2,
        scales,
        threshold2,
        numericalNearestPointFunction,
        numericalNearestPointAsLineFunction,
        verifyNotOneSided: true,
    });

    if (!result.success) {
        return { success: false };
    }

    let { nearestPoint1, nearestPoint2 } = result;

    if (!allowRotation) {
        let original_rel = [point2[0] - point1[0], point2[1] - point1[1]];

        let moved_rel = [
            nearestPoint2[0] - nearestPoint1[0],
            nearestPoint2[1] - nearestPoint1[1],
        ];

        let dTheta =
            Math.atan2(moved_rel[1], moved_rel[0]) -
            Math.atan2(original_rel[1], original_rel[0]);

        // make dTheta be between -pi and pi
        dTheta = me.math.mod(dTheta + Math.PI, 2 * Math.PI) - Math.PI;

        // we had a rotation, so don't attract
        if (Math.abs(dTheta) > 1e-6) {
            return { success: false };
        }
    }

    // If the attracted points are the same distances apart as point1 and point2, we're done.
    let originalDistance2 = point1.reduce(
        (a, c, i) => a + Math.pow(c - point2[i], 2),
        0,
    );
    let newDistance2 = nearestPoint1.reduce(
        (a, c, i) => a + Math.pow(c - nearestPoint2[i], 2),
        0,
    );

    let deviationThreshold2 = 1e-6 ** 2;
    if (Math.abs(originalDistance2 - newDistance2) < deviationThreshold2) {
        let distance2 =
            nearestPoint1.reduce(
                (a, c, i) => a + Math.pow(c - point1[i], 2),
                0,
            ) +
            nearestPoint2.reduce(
                (a, c, i) => a + Math.pow(c - point2[i], 2),
                0,
            );

        if (distance2 < threshold2) {
            return {
                success: true,
                distance2,
                segment: [nearestPoint1, nearestPoint2],
            };
        } else {
            return { success: false };
        }
    }

    // If the points were pulled further apart, consider the segment not attracted.
    if (newDistance2 > originalDistance2) {
        return { success: false };
    }

    // In general, the points will be pushed together (unless they started with the same deviation from the line).
    let expandFactor = Math.sqrt(originalDistance2 / newDistance2);

    // We try expanding both points outward to make the be the correct distance apart
    // and check to see if they are attracted without moving.
    // The amount that we move each point outward is proportional to how much it moved
    // when originally being attracted.
    // With this algorithm, a point that started on the attractor doesn't move,
    // preventing observed strange behavior when enforceRigid was false
    // where the line segment length would keep increasing.

    let deviation1 = Math.sqrt(
        point1.reduce((a, c, i) => a + Math.pow(c - nearestPoint1[i], 2), 0),
    );
    let deviation2 = Math.sqrt(
        point2.reduce((a, c, i) => a + Math.pow(c - nearestPoint2[i], 2), 0),
    );

    let p1 = deviation1 / (deviation1 + deviation2);
    let p2 = 1 - p1;

    let expandFactor1 = (expandFactor - 1) * p1 + 1;
    let expandFactor2 = (expandFactor - 1) * p2 + 1;

    let extendedPoint1 = nearestPoint2.map(
        (v, i) => v + (nearestPoint1[i] - v) * expandFactor1,
    );

    let extendedPoint2 = nearestPoint1.map(
        (v, i) => v + (nearestPoint2[i] - v) * expandFactor2,
    );

    let eps2 = 1e-6 ** 2;

    result = findAttractedSegmentPointsSub({
        point1: extendedPoint1,
        point2: extendedPoint2,
        scales,
        threshold2: eps2,
        numericalNearestPointFunction,
        numericalNearestPointAsLineFunction,
        verifyNotOneSided: false,
    });

    if (!result.success) {
        return { success: false };
    }

    let distance2 =
        extendedPoint1.reduce((a, c, i) => a + Math.pow(c - point1[i], 2), 0) +
        extendedPoint2.reduce((a, c, i) => a + Math.pow(c - point2[i], 2), 0);

    if (distance2 < threshold2) {
        return {
            success: true,
            distance2,
            segment: [extendedPoint1, extendedPoint2],
        };
    } else {
        return { success: false };
    }
}

// Attract the points of segment to the closest points
// based on the nearestPointFunctions.
//
// The attracted segment will be the same length as the original segment
// and the endpoints will have moved less than a total squared distance of threshold2.
//
// If allowRotation is true, then the segment could have rotated when attracting.
//
export function attractSegment({
    segment,
    allowRotation,
    scales,
    threshold2,
    numericalNearestPointFunctions,
    numericalNearestPointAsLineFunctions,
    attractingPoints,
}) {
    let point1 = segment[0];
    let point2 = segment[1];

    if (point1.length != point2.length) {
        return {};
    }

    let numericalPoint1 = point1.map((v) => findFiniteNumericalValue(v));
    let numericalPoint2 = point2.map((v) => findFiniteNumericalValue(v));

    let closestSegment;
    let minDeviation2 = Infinity;

    for (let [
        ind,
        numericalNearestPointFunction,
    ] of numericalNearestPointFunctions.entries()) {
        let numericalNearestPointAsLineFunction =
            numericalNearestPointAsLineFunctions[ind];

        let result = findAttractedSegmentPoints({
            point1: numericalPoint1,
            point2: numericalPoint2,
            allowRotation,
            scales,
            threshold2,
            numericalNearestPointFunction,
            numericalNearestPointAsLineFunction,
        });

        if (!result.success) {
            continue;
        }

        if (result.distance2 < minDeviation2) {
            minDeviation2 = result.distance2;
            closestSegment = result.segment;
        }
    }

    if (attractingPoints) {
        for (let attractingPoint of attractingPoints) {
            let closestPoint = nearestPointForSegment({
                point: attractingPoint,
                segment: [numericalPoint1, numericalPoint2],
                scales,
            });

            // multiply distance2 by 2 since it is distance between just one pair of points
            // rather than two pairs of points.
            let distance2 =
                closestPoint.reduce(
                    (a, c, i) => a + Math.pow(c - attractingPoint[i], 2),
                    0,
                ) * 2;

            if (distance2 < minDeviation2) {
                // translate the points by attractingPoint - closestPoint
                let newPoint1 = numericalPoint1.map(
                    (v, i) => v + attractingPoint[i] - closestPoint[i],
                );

                let newPoint2 = numericalPoint2.map(
                    (v, i) => v + attractingPoint[i] - closestPoint[i],
                );

                closestSegment = [newPoint1, newPoint2];
                minDeviation2 = distance2;
            }
        }
    }

    if (minDeviation2 < threshold2) {
        return {
            constrained: true,
            segment: closestSegment,
        };
    }

    // consider the segment not attracted
    return {};
}

// Find the point on `segment` that is closest to `point`,
// scaling axes according to `scales`.
export function nearestPointForSegment({ point, segment, scales }) {
    let A1 = segment[0][0];
    let A2 = segment[0][1];
    let B1 = segment[1][0];
    let B2 = segment[1][1];

    let haveConstants =
        Number.isFinite(A1) &&
        Number.isFinite(A2) &&
        Number.isFinite(B1) &&
        Number.isFinite(B2);

    // only implement for
    // - 2D
    // - constant endpoints and
    // - non-degenerate parameters
    if (segment[0].length !== 2 || !haveConstants || (B1 === A1 && B2 === A2)) {
        return null;
    }

    let xscale = scales[0];
    let yscale = scales[1];

    let BA1 = (B1 - A1) / xscale;
    let BA2 = (B2 - A2) / yscale;
    let denom = BA1 * BA1 + BA2 * BA2;

    let t =
        (((point[0] - A1) / xscale) * BA1 + ((point[1] - A2) / yscale) * BA2) /
        denom;

    if (t <= 0) {
        return [A1, A2];
    } else if (t >= 1) {
        return [B1, B2];
    } else {
        return [A1 + t * BA1 * xscale, A2 + t * BA2 * yscale];
    }
}

// Find the point on extended line of `segment` that is closest to `point`,
// scaling axes according to `scales`.
export function nearestPointForSegmentAsLine({ point, segment, scales }) {
    let A1 = segment[0][0];
    let A2 = segment[0][1];
    let B1 = segment[1][0];
    let B2 = segment[1][1];

    let haveConstants =
        Number.isFinite(A1) &&
        Number.isFinite(A2) &&
        Number.isFinite(B1) &&
        Number.isFinite(B2);

    // only implement for
    // - 2D
    // - constant endpoints and
    // - non-degenerate parameters
    if (segment[0].length !== 2 || !haveConstants || (B1 === A1 && B2 === A2)) {
        return null;
    }

    let xscale = scales[0];
    let yscale = scales[1];

    let BA1 = (B1 - A1) / xscale;
    let BA2 = (B2 - A2) / yscale;
    let denom = BA1 * BA1 + BA2 * BA2;

    let t =
        (((point[0] - A1) / xscale) * BA1 + ((point[1] - A2) / yscale) * BA2) /
        denom;

    return [A1 + t * BA1 * xscale, A2 + t * BA2 * yscale];
}
