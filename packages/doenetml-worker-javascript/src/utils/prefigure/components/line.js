import {
    asFiniteNumber,
    clipInfiniteLineToBounds,
    clipRayToBounds,
    clipSegmentToBounds,
    escapeXml,
    formatPoint,
} from "../common";
import {
    lineLabelLocationValue,
    lineLabelAttributes as getLabelForLine,
    orientEndpointsForLineLabel,
} from "../label";

/**
 * Serializes one PreFigure `<line>` XML element.
 *
 * `labelAttrs` are forwarded from label helpers (for example `label-location`
 * and `alignment`).
 * If `label` exists, it is emitted as inline element content; otherwise the
 * line is self-closing.
 */
function lineElement({
    handle,
    p1,
    p2,
    infinite,
    styleAttrs,
    labelAttrs,
    label,
}) {
    const attrs = [
        `id="${escapeXml(handle)}"`,
        `endpoints="${escapeXml(`(${p1},${p2})`)}"`,
        `infinite="${infinite}"`,
        ...styleAttrs,
        ...labelAttrs,
    ];

    if (label) {
        return `<line ${attrs.join(" ")}>${label}</line>`;
    }

    return `<line ${attrs.join(" ")} />`;
}

/**
 * Wraps the shared line-label helper and normalizes the return shape expected
 * by this module.
 *
 * ep1/ep2 are the oriented raw [x, y] endpoint arrays. `alignmentMode`
 * selects whether label alignment should follow line, endpoint, or ray rules.
 */
function getLineLabelInfo({
    sv,
    ep1,
    ep2,
    alignmentMode = "line",
    warnings,
    warningPrefix,
    warningPosition,
}) {
    const result = getLabelForLine({
        stateValues: {
            ...sv,
            lineLabelAlignmentMode: alignmentMode,
        },
        ep1,
        ep2,
        warnings,
        warningPrefix,
        warningPosition,
    });
    return {
        labelAttrs: result?.attrs ?? [],
        label: result?.label,
    };
}

/**
 * Finds which clipped ray endpoint corresponds to the ray's finite endpoint.
 *
 * The return value is an oriented endpoint index (0 or 1) used by ray label
 * logic to keep endpoint-side labels in endpoint mode.
 */
function rayFiniteEndpointIndex({ ep1, ep2, finiteEndpoint }) {
    const fx = asFiniteNumber(finiteEndpoint?.[0]);
    const fy = asFiniteNumber(finiteEndpoint?.[1]);
    if (fx === null || fy === null) {
        return null;
    }

    const d1 = (ep1[0] - fx) ** 2 + (ep1[1] - fy) ** 2;
    const d2 = (ep2[0] - fx) ** 2 + (ep2[1] - fy) ** 2;
    return d1 <= d2 ? 0 : 1;
}

/**
 * True if a point lies within inclusive graph bounds.
 *
 * Used by clipped-segment logic to decide whether we should use mixed
 * endpoint/line alignment behavior.
 */
function pointInsideBounds(point, bounds) {
    if (!Array.isArray(point) || point.length < 2 || !Array.isArray(bounds) || bounds.length < 4) {
        return false;
    }

    const x = asFiniteNumber(point[0]);
    const y = asFiniteNumber(point[1]);
    const xMin = asFiniteNumber(bounds[0]);
    const yMin = asFiniteNumber(bounds[1]);
    const xMax = asFiniteNumber(bounds[2]);
    const yMax = asFiniteNumber(bounds[3]);

    if ([x, y, xMin, yMin, xMax, yMax].some((v) => v === null)) {
        return false;
    }

    return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
}

/**
 * Returns the parameter t for projecting `point` onto segment `start -> end`.
 *
 * t=0 corresponds to `start`, t=1 corresponds to `end`.
 */
function paramAlongSegment({ start, end, point }) {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const denom = dx * dx + dy * dy;
    if (!(denom > 0)) {
        return null;
    }
    return ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / denom;
}

/**
 * Determines which raw segment endpoint remains visible when exactly one is
 * in-bounds. Returns 0/1 for raw oriented segment endpoint index, or null when
 * both endpoints are either visible or off-screen.
 */
function segmentVisibleEndpointIndex({ endpoint1Inside, endpoint2Inside }) {
    if (endpoint1Inside === endpoint2Inside) {
        return null;
    }

    return endpoint1Inside ? 0 : 1;
}

/**
 * Converts an infinite line (two defining points) to a PreFigure `<line>` element.
 */
export function convertLineToPrefigure({
    sv,
    handle,
    styleAttrs,
    warnings,
    warningPrefix,
    warningPosition,
}) {
    const rawP1 = sv.numericalPoints?.[0];
    const rawP2 = sv.numericalPoints?.[1];
    if (!rawP1 || !rawP2) {
        return null;
    }
    const [ep1, ep2] = orientEndpointsForLineLabel(rawP1, rawP2);
    const p1 = formatPoint(ep1);
    const p2 = formatPoint(ep2);
    if (p1 === null || p2 === null) {
        return null;
    }

    const clippedForLabel = clipInfiniteLineToBounds({
        point1: rawP1,
        point2: rawP2,
        bounds: sv.graphBounds,
    });
    const [labelEp1, labelEp2] = clippedForLabel
        ? orientEndpointsForLineLabel(clippedForLabel[0], clippedForLabel[1])
        : [ep1, ep2];

    const { labelAttrs, label } = getLineLabelInfo({
        sv,
        ep1: labelEp1,
        ep2: labelEp2,
        alignmentMode: "line",
        warnings,
        warningPrefix,
        warningPosition,
    });

    return lineElement({
        handle,
        p1,
        p2,
        infinite: "yes",
        styleAttrs,
        labelAttrs,
        label,
    });
}

/**
 * Converts a finite line segment to a PreFigure `<line infinite="no">` element.
 *
 * Off-screen behavior:
 * - Fully on-screen: endpoint alignment mode.
 * - One endpoint off-screen and segment visible: ray-style mixed mode where the
 *   visible endpoint side uses endpoint behavior and the opposite side uses
 *   line behavior.
 * - Both endpoints off-screen but segment visible: line mode over clipped
 *   visible geometry.
 *
 * Endpoint-side label locations in this converter use fixed screen-space offset
 * semantics (`lineLabelAbsoluteEndpointOffset`) so extending a segment keeps the
 * label anchor at a stable visual distance from its chosen endpoint.
 *
 * When clipped geometry is used for alignment scoring, we remap the chosen
 * location back to the full segment parameterization via:
 * - `lineLabelLocationOverride` (emitted value)
 * - `lineLabelAlignmentLocationOverride` (scoring value)
 */
export function convertLineSegmentToPrefigure({
    sv,
    handle,
    styleAttrs,
    warnings,
    warningPrefix,
    warningPosition,
}) {
    const rawP1 = sv.numericalEndpoints?.[0];
    const rawP2 = sv.numericalEndpoints?.[1];
    if (!rawP1 || !rawP2) {
        return null;
    }
    const [ep1, ep2] = orientEndpointsForLineLabel(rawP1, rawP2);
    const p1 = formatPoint(ep1);
    const p2 = formatPoint(ep2);
    if (p1 === null || p2 === null) {
        return null;
    }

    let labelEp1 = ep1;
    let labelEp2 = ep2;
    let alignmentMode = "endpoint";
    let lineLabelLocationOverride;
    let lineLabelAlignmentLocationOverride;
    let lineLabelRayFiniteEndpointIndex;

    const clippedVisibleSegment = clipSegmentToBounds({
        point1: ep1,
        point2: ep2,
        bounds: sv?.graphBounds,
    });

    const endpoint1Inside = pointInsideBounds(ep1, sv?.graphBounds);
    const endpoint2Inside = pointInsideBounds(ep2, sv?.graphBounds);
    const hasOffscreenEndpoint = !endpoint1Inside || !endpoint2Inside;

    // If either endpoint is off-screen but the segment is still visible, anchor
    // label placement to the visible clipped segment.
    //
    // When exactly one endpoint remains in-bounds, use ray-style mixed behavior:
    // labels on the visible endpoint side stay in endpoint mode, while labels on
    // the off-screen side keep line-mode behavior.
    if (hasOffscreenEndpoint && clippedVisibleSegment) {
        [labelEp1, labelEp2] = orientEndpointsForLineLabel(
            clippedVisibleSegment[0],
            clippedVisibleSegment[1],
        );
        alignmentMode = "line";

        const visibleEndpointIndex = segmentVisibleEndpointIndex({
            endpoint1Inside,
            endpoint2Inside,
        });
        if (visibleEndpointIndex !== null) {
            alignmentMode = "ray";
            lineLabelRayFiniteEndpointIndex = visibleEndpointIndex;
        }

        const t0 = paramAlongSegment({
            start: ep1,
            end: ep2,
            point: labelEp1,
        });
        const t1 = paramAlongSegment({
            start: ep1,
            end: ep2,
            point: labelEp2,
        });

        if (Number.isFinite(t0) && Number.isFinite(t1)) {
            const visibleLoc = lineLabelLocationValue(
                sv?.labelPosition,
                labelEp1,
                labelEp2,
                {
                    absoluteEndpointOffset: true,
                    graphBounds: sv?.graphBounds,
                    graphDimensions: sv?.graphDimensions,
                },
            );
            lineLabelAlignmentLocationOverride = visibleLoc;
            lineLabelLocationOverride = t0 + visibleLoc * (t1 - t0);
        }
    }

    const { labelAttrs, label } = getLineLabelInfo({
        sv: {
            ...sv,
            lineLabelAbsoluteEndpointOffset: true,
            ...(lineLabelRayFiniteEndpointIndex === 0 ||
            lineLabelRayFiniteEndpointIndex === 1
                ? { lineLabelRayFiniteEndpointIndex }
                : {}),
            ...(Number.isFinite(lineLabelLocationOverride)
                ? { lineLabelLocationOverride }
                : {}),
            ...(Number.isFinite(lineLabelAlignmentLocationOverride)
                ? { lineLabelAlignmentLocationOverride }
                : {}),
        },
        ep1: labelEp1,
        ep2: labelEp2,
        alignmentMode,
        warnings,
        warningPrefix,
        warningPosition,
    });

    return lineElement({
        handle,
        p1,
        p2,
        infinite: "no",
        styleAttrs,
        labelAttrs,
        label,
    });
}

/**
 * Converts a ray (endpoint + throughpoint) to a PreFigure line representation.
 *
 * Ray labels also opt into absolute endpoint-offset location semantics so the
 * finite-endpoint-side anchor remains visually stable under ray extension.
 */
export function convertRayToPrefigure({
    sv,
    handle,
    styleAttrs,
    warnings,
    warningPrefix,
    warningPosition,
}) {
    if (
        !Array.isArray(sv.numericalEndpoint) ||
        !Array.isArray(sv.numericalThroughpoint)
    ) {
        return null;
    }

    const clipped = clipRayToBounds({
        endpoint: sv.numericalEndpoint,
        throughpoint: sv.numericalThroughpoint,
        bounds: sv.graphBounds,
    });
    if (!clipped) {
        return null;
    }

    const [ep1, ep2] = orientEndpointsForLineLabel(clipped[0], clipped[1]);
    const finiteIndex = rayFiniteEndpointIndex({
        ep1,
        ep2,
        finiteEndpoint: sv.numericalEndpoint,
    });
    const c1 = formatPoint(ep1);
    const c2 = formatPoint(ep2);
    if (c1 === null || c2 === null) {
        return null;
    }

    const { labelAttrs, label } = getLineLabelInfo({
        sv: {
            ...sv,
            lineLabelAbsoluteEndpointOffset: true,
            lineLabelRayFiniteEndpointIndex: finiteIndex,
        },
        ep1,
        ep2,
        alignmentMode: "ray",
        warnings,
        warningPrefix,
        warningPosition,
    });

    return lineElement({
        handle,
        p1: c1,
        p2: c2,
        infinite: "no",
        styleAttrs,
        labelAttrs,
        label,
    });
}
