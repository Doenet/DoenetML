import { findFiniteNumericalValue } from "../utils/math";
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

                let nearestPointFunctions =
                    dependencyValues.nearestPointFunctions;

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
                                nearestPointFunctions,
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
                                point: midpoint.map((v) => me.fromAst(v)),
                                numericalPoint: midpoint,
                                scales,
                                threshold2: deviationThreshold2,
                                nearestPointFunctions,
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
function findAttractedPoint({
    point,
    numericalPoint,
    scales,
    threshold2,
    nearestPointFunctions,
}) {
    let closestDistance2 = Infinity;
    let closestPoint;

    // convert to the variables format expected by numericalPointFunctions
    let variables = {};
    for (let ind = 0; ind < point.length; ind++) {
        let varName = "x" + (ind + 1);
        variables[varName] = point[ind];
    }

    for (let nearestPointFunction of nearestPointFunctions) {
        let nearestPointAsVariables = nearestPointFunction({
            variables,
            scales,
        });

        if (nearestPointAsVariables === undefined) {
            continue;
        }

        let nearestPoint = [];
        for (let ind = 0; ind < point.length; ind++) {
            let varName = "x" + (ind + 1);
            if (nearestPointAsVariables[varName] === undefined) {
                break;
            }
            nearestPoint.push(nearestPointAsVariables[varName]);
        }
        if (nearestPoint.length !== point.length) {
            continue;
        }

        let distance2 = 0;

        for (let ind = 0; ind < point.length; ind++) {
            distance2 += Math.pow(numericalPoint[ind] - nearestPoint[ind], 2);
        }

        if (distance2 < closestDistance2) {
            closestPoint = nearestPoint;
            closestDistance2 = distance2;
        }
    }

    if (closestDistance2 > threshold2) {
        closestPoint = null;
    }

    return closestPoint;
}

function attractSegmentEndpoints(
    segment,
    allowRotation,
    enforceRigid,
    scales,
    threshold2,
    nearestPointFunctions,
) {
    let point1 = segment[0];
    let point2 = segment[1];

    if (point1.length != point2.length) {
        return {};
    }

    let numericalPoint1 = point1.map((v) => findFiniteNumericalValue(v));
    let numericalPoint2 = point2.map((v) => findFiniteNumericalValue(v));

    // attempt to find attraction points for point1 and point2

    let closestPoint1 = findAttractedPoint({
        point: point1,
        numericalPoint: numericalPoint1,
        scales,
        threshold2,
        nearestPointFunctions,
    });

    if (!closestPoint1) {
        return {};
    }

    let closestPoint2 = findAttractedPoint({
        point: point2,
        numericalPoint: numericalPoint2,
        scales,
        threshold2,
        nearestPointFunctions,
    });

    if (!closestPoint2) {
        return {};
    }

    // Succeeded in attracting both point1 and point2.

    if (!allowRotation) {
        let original_rel = [
            numericalPoint2[0] - numericalPoint1[0],
            numericalPoint2[1] - numericalPoint1[1],
        ];

        let moved_rel = [
            closestPoint2[0] - closestPoint1[0],
            closestPoint2[1] - closestPoint1[1],
        ];

        let dtheta =
            Math.atan2(moved_rel[1], moved_rel[0]) -
            Math.atan2(original_rel[1], original_rel[0]);

        // make dtheta be between -pi and pi
        dtheta = me.math.mod(dtheta + Math.PI, 2 * Math.PI) - Math.PI;

        // we had a rotation, so don't attract
        if (Math.abs(dtheta) > 1e-6) {
            return {};
        }
    }

    // If the attracted points are the same distances apart as point1 and point2, we're done.
    let originalDistance2 = numericalPoint1.reduce(
        (a, c, i) => a + Math.pow(c - numericalPoint2[i], 2),
        0,
    );

    let newDistance2 = closestPoint1.reduce(
        (a, c, i) => a + Math.pow(c - closestPoint2[i], 2),
        0,
    );

    let deviationThreshold2 = 1e-6 ** 2;

    if (Math.abs(originalDistance2 - newDistance2) < deviationThreshold2) {
        return {
            constrained: true,
            segment: [closestPoint1, closestPoint2],
        };
    }

    // If the points were pulled further apart, consider the segment not attracted.
    if (newDistance2 > originalDistance2) {
        return {};
    }

    // In general, the points will be pushed together (unless they started with the same deviation from the line).
    let expandFactor = Math.sqrt(originalDistance2 / newDistance2);

    // First we try expanding both points outward to make the be the correct distance apart
    // and check to see if they are attracted without moving.

    // We start out with a more complex algorithm in choosing how much to move each point.
    // This is the only algorithm we will allow when enforceRigid is false.
    // It is designed to make sure a point that started on the attractor doesn't move,
    // preventing the point not being moved from precessing and increasing the line segment length.
    // The amount that we move each point outward is proportional to how much it moved
    // when originally being attracted

    let deviation1 = Math.sqrt(
        numericalPoint1.reduce(
            (a, c, i) => a + Math.pow(c - closestPoint1[i], 2),
            0,
        ),
    );
    let deviation2 = Math.sqrt(
        numericalPoint2.reduce(
            (a, c, i) => a + Math.pow(c - closestPoint2[i], 2),
            0,
        ),
    );

    let p1 = deviation1 / (deviation1 + deviation2);
    let p2 = 1 - p1;

    let expandFactor1 = (expandFactor - 1) * p1 + 1;
    let expandFactor2 = (expandFactor - 1) * p2 + 1;

    let extendedPoint1 = closestPoint2.map(
        (v, i) => v + (closestPoint1[i] - v) * expandFactor1,
    );

    let extendedPoint2 = closestPoint1.map(
        (v, i) => v + (closestPoint2[i] - v) * expandFactor2,
    );

    // See if extended point 1 is attracted without moving more than deviation threshold
    let closestPoint1Extended = findAttractedPoint({
        point: extendedPoint1.map((v) => me.fromAst(v)),
        numericalPoint: extendedPoint1,
        scales,
        threshold2: deviationThreshold2,
        nearestPointFunctions,
    });

    if (closestPoint1Extended) {
        // See if extended point 2 is attracted without moving more than deviation threshold
        let closestPoint2Extended = findAttractedPoint({
            point: extendedPoint2.map((v) => me.fromAst(v)),
            numericalPoint: extendedPoint2,
            scales,
            threshold2: deviationThreshold2,
            nearestPointFunctions,
        });

        if (closestPoint2Extended) {
            // both extended point were still on the attractor,
            // so consider the points attracted

            return {
                constrained: true,
                segment: [closestPoint1Extended, closestPoint2Extended],
            };
        }
    }

    if (!enforceRigid) {
        // If we aren't enforcing rigid, then we stop here.
        // Extending in one direction or the other can lead to the line segment growing
        // when dragging a point past the end of the attractor, which is strange behavior.
        return {};
    }

    // Next check that the segment could still be attracted to a segment/ray,
    // but that one point started a little past an endpoint.
    // Try moving either endpoint out to make them the correct distance apart
    // and then see if they are attracted without moving.

    extendedPoint1 = closestPoint2.map(
        (v, i) => v + (closestPoint1[i] - v) * expandFactor,
    );

    // See if extended point 1 is attracted without moving more than deviation threshold
    closestPoint1Extended = findAttractedPoint({
        point: extendedPoint1.map((v) => me.fromAst(v)),
        numericalPoint: extendedPoint1,
        scales,
        threshold2: deviationThreshold2,
        nearestPointFunctions,
    });

    if (closestPoint1Extended) {
        return {
            constrained: true,
            segment: [closestPoint1Extended, closestPoint2],
        };
    }

    // We didn't get an unmoved point when extending closest point1, so try extending closest point2

    extendedPoint2 = closestPoint1.map(
        (v, i) => v + (closestPoint2[i] - v) * expandFactor,
    );

    // See if extended point 1 is attracted without moving more than deviation threshold
    let closestPoint2Extended = findAttractedPoint({
        point: extendedPoint2.map((v) => me.fromAst(v)),
        numericalPoint: extendedPoint2,
        scales,
        threshold2: deviationThreshold2,
        nearestPointFunctions,
    });

    if (closestPoint2Extended) {
        return {
            constrained: true,
            segment: [closestPoint1, closestPoint2Extended],
        };
    }

    // consider the segment not attracted
    return {};
}
