import me from "math-expressions";

/**
 * Given a list of attribute names that are being ignored, builds a
 * human-readable phrase like "slope is" or "slope and length are" or
 * "slope, length, and midpointOffset are".
 */
export function buildIgnoredPhrase(ignored) {
    if (ignored.length === 1) {
        return `${ignored[0]} is`;
    } else if (ignored.length === 2) {
        return `${ignored[0]} and ${ignored[1]} are`;
    } else {
        return `${ignored.slice(0, -1).join(", ")}, and ${ignored.slice(-1)} are`;
    }
}

export function directionFromSlope(slope) {
    if (slope === Infinity || slope === -Infinity) {
        return [0, Math.sign(slope)];
    }
    if (!Number.isFinite(slope)) {
        return null;
    }

    let theta = Math.atan(slope);
    return [Math.cos(theta), Math.sin(theta)];
}

function getNumericValue(mathOrNumber) {
    return mathOrNumber instanceof me.class
        ? mathOrNumber.evaluate_to_constant()
        : Number(mathOrNumber);
}

export function getNumericEndpointPair(
    desiredUnconstrainedEndpoints,
    currentEndpoints,
    numDimensions = 2,
    pointInds = [0, 1],
) {
    return pointInds.map((pointInd) =>
        Array.from({ length: numDimensions }, (_, dim) => {
            let key = pointInd + "," + dim;
            if (key in desiredUnconstrainedEndpoints) {
                return getNumericValue(desiredUnconstrainedEndpoints[key]);
            }
            return currentEndpoints[pointInd][dim].evaluate_to_constant();
        }),
    );
}

function getSlopeAndSignedLength(endpoint1, endpoint2, fallbackSlope) {
    const dx = endpoint2[0] - endpoint1[0];
    const dy = endpoint2[1] - endpoint1[1];

    if (dx === 0 && dy === 0) {
        return {
            slope: fallbackSlope,
            signedLength: 0,
        };
    }

    if (dx === 0) {
        return {
            slope: dy > 0 ? Infinity : -Infinity,
            // For vertical segments, canonicalize interactions so slope encodes
            // up vs down and the defining length stays non-negative.
            signedLength: Math.abs(dy),
        };
    }

    return {
        slope: dy / dx,
        signedLength: Math.hypot(dx, dy) * Math.sign(dx),
    };
}

export function getDirectionComponent(dim, dirX, dirY) {
    let dimNumber = Number(dim);
    if (dimNumber === 0) {
        return dirX;
    }
    if (dimNumber === 1) {
        return dirY;
    }
    return 0;
}

// Resolve the configured slope: the slope attribute's value when present,
// otherwise the essential slope maintained for the parameterization.
export function getConfiguredSlope(globalDependencyValues) {
    return globalDependencyValues.slopeAttr !== null
        ? globalDependencyValues.slopeAttr.stateValues.value
        : globalDependencyValues.essentialSlope;
}

// Resolve the configured signed length: the length attribute's value when
// present, otherwise the essential signed length maintained for the
// parameterization.
export function getConfiguredSignedLength(globalDependencyValues) {
    return globalDependencyValues.lengthAttr !== null
        ? globalDependencyValues.lengthAttr.stateValues.value
        : globalDependencyValues.essentialSignedLength;
}

export function addSlopeAndLengthInstructions({
    instructions,
    globalDependencyValues,
    endpoint1,
    endpoint2,
}) {
    const fallbackSlope = getConfiguredSlope(globalDependencyValues);

    const { slope, signedLength } = getSlopeAndSignedLength(
        endpoint1,
        endpoint2,
        fallbackSlope,
    );

    if (globalDependencyValues.slopeAttr !== null) {
        instructions.push({
            setDependency: "slopeAttr",
            desiredValue: slope,
            variableIndex: 0,
        });
    } else {
        instructions.push({
            setDependency: "essentialSlope",
            desiredValue: slope,
        });
    }

    if (globalDependencyValues.lengthAttr !== null) {
        instructions.push({
            setDependency: "lengthAttr",
            desiredValue: signedLength,
            variableIndex: 0,
        });
    } else {
        instructions.push({
            setDependency: "essentialSignedLength",
            desiredValue: signedLength,
        });
    }
}

export function addMidpointInstructions({
    instructions,
    dependencyNamesByKey,
    midpointCoords,
}) {
    // The midpoint dependency is per dimension, not per endpoint: for a given
    // dim both endpoints' keys point at the same midpoint coordinate, so a
    // single lookup suffices.
    for (let dim = 0; dim < midpointCoords.length; dim++) {
        const midpointDependencyName =
            dependencyNamesByKey["0," + dim]?.midpointCoord;

        if (midpointDependencyName !== undefined) {
            instructions.push({
                setDependency: midpointDependencyName,
                desiredValue: me.fromAst(midpointCoords[dim]),
                variableIndex: 0,
            });
        }
    }
}

export function mergePointCoords(pointCoords, currentPoint, numDimensions) {
    return Array.from({ length: numDimensions }, (_, dim) =>
        pointCoords[dim] !== undefined ? pointCoords[dim] : currentPoint[dim],
    );
}
