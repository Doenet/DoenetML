import me from "math-expressions";

// Attract the points to the line determined numericalNearestPointAsLineFunction.
// Succeed only if each point moved less than the distance determined by threshold2.
//
// If verifyNotOneSide, then also exclude cases where it appears both points
// are on the same side of the origin object determined by numericalNearestPointFunction.
//
// Called a a sub function of findAttractedSegmentPoints, below
function findAttractedSegmentPointsSub({
    point1,
    point2,
    scales,
    threshold2,
    numericalNearestPointFunction,
    numericalNearestPointAsLineFunction,
    verifyNotOneSided = true,
}) {
    let eps = 1e-6;
    let eps2 = eps ** 2;

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
        // We want to exclude the cases where both points are on the same side
        // of the original object determined by numericalNearestPointFunction

        // check if one point is attracted without extending as line
        // to the same point as when attracting with extending
        let nearestPoint1NotExtend = numericalNearestPointFunction(
            point1,
            scales,
        );
        let nearestPoint1Unchanged =
            nearestPoint1NotExtend &&
            nearestPoint1NotExtend.every(
                (v, i) => Math.abs(v - nearestPoint1[i]) < eps,
            );

        let nearestPoint2NotExtend = numericalNearestPointFunction(
            point2,
            scales,
        );
        let nearestPoint2Unchanged =
            nearestPoint2NotExtend &&
            nearestPoint2NotExtend.every(
                (v, i) => Math.abs(v - nearestPoint2[i]) < eps,
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

// Attract the line segment determined by the points
// to the object determined by numericalNearestPointFunction and numericalNearestPointAsLineFunction.
//
// The attracted line segment must be the same length as the original,
// potentially rotated if allowRotation is true.

// The total squared distance moved by both points must be less than threshold2.
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

    let eps = 1e-6;
    let eps2 = eps ** 2;

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
        if (Math.abs(dTheta) > eps) {
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

    if (Math.abs(originalDistance2 - newDistance2) < eps2) {
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
export function attractSegment({
    segment,
    allowRotation,
    scales,
    threshold2,
    numericalNearestPointFunctions,
    numericalNearestPointAsLineFunctions,
}) {
    let numericalPoint1 = segment[0];
    let numericalPoint2 = segment[1];

    if (numericalPoint1.length != numericalPoint2.length) {
        return {};
    }

    let closestSegment;
    let minDeviation2 = Infinity;

    let amplifiedThreshold2 = allowRotation ? threshold2 * 1000 : threshold2;

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
            threshold2: amplifiedThreshold2,
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

    if (minDeviation2 < threshold2) {
        return {
            constrained: true,
            segment: closestSegment,
        };
    } else if (minDeviation2 < amplifiedThreshold2) {
        // Segment is not actually attracted, but it was somewhat close to being attracted.
        // Report this fact so it could be used to just rotate the edge
        // if no other constraints were found
        return {
            constrained: false,
            distance2: minDeviation2,
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
