import {
    asFiniteNumber,
    clipLineLikeToBounds,
    escapeXml,
    formatPoint,
} from "../common";
import {
    lineLabelLocationValue,
    getLabelForLine,
    orientEndpointsForLineLabel,
} from "../label";
import type { GraphBounds, Point, StyledConverterArgs } from "../types";

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
}: {
    handle: string;
    p1: string;
    p2: string;
    infinite: "yes" | "no";
    styleAttrs: string[];
    labelAttrs: string[];
    label: string | null;
}): string {
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
 * True if a point lies within inclusive graph bounds.
 *
 * Used by clipped-segment logic to decide whether endpoint clipping has
 * changed which geometry should be used for label placement.
 */
function pointInsideBounds(
    point: Point,
    bounds: GraphBounds | undefined,
): boolean {
    if (
        !Array.isArray(point) ||
        point.length < 2 ||
        !Array.isArray(bounds) ||
        bounds.length < 4
    ) {
        return false;
    }

    const x = asFiniteNumber(point[0]);
    const y = asFiniteNumber(point[1]);
    const xMin = asFiniteNumber(bounds[0]);
    const yMin = asFiniteNumber(bounds[1]);
    const xMax = asFiniteNumber(bounds[2]);
    const yMax = asFiniteNumber(bounds[3]);

    if (
        x === null ||
        y === null ||
        xMin === null ||
        yMin === null ||
        xMax === null ||
        yMax === null
    ) {
        return false;
    }

    return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
}

/**
 * Returns the parameter t for projecting `point` onto segment `start -> end`.
 *
 * t=0 corresponds to `start`, t=1 corresponds to `end`.
 */
function paramAlongSegment({
    start,
    end,
    point,
}: {
    start: Point;
    end: Point;
    point: Point;
}): number | null {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const denom = dx * dx + dy * dy;
    if (!(denom > 0)) {
        return null;
    }
    return ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / denom;
}

/**
 * Converts an infinite line (two defining points) to a PreFigure `<line>` element.
 */
export function convertLineToPrefigure({
    sv,
    handle,
    styleAttrs,
    diagnostics,
    warningPrefix,
    warningPosition,
}: StyledConverterArgs): string | null {
    const points = Array.isArray(sv.numericalPoints)
        ? sv.numericalPoints
        : null;
    const rawP1 = points?.[0];
    const rawP2 = points?.[1];
    if (!Array.isArray(rawP1) || !Array.isArray(rawP2)) {
        return null;
    }
    if (rawP1.length < 2 || rawP2.length < 2) {
        return null;
    }
    const p1Point: Point = [Number(rawP1[0]), Number(rawP1[1])];
    const p2Point: Point = [Number(rawP2[0]), Number(rawP2[1])];
    if ([...p1Point, ...p2Point].some((x) => !Number.isFinite(x))) {
        return null;
    }
    const [ep1, ep2] = orientEndpointsForLineLabel(p1Point, p2Point);
    const p1 = formatPoint(ep1);
    const p2 = formatPoint(ep2);
    if (p1 === null || p2 === null) {
        return null;
    }

    const clippedForLabel = clipLineLikeToBounds({
        point1: p1Point,
        point2: p2Point,
        bounds: sv.graphBounds,
        tMin: -Infinity,
        tMax: Infinity,
    });
    const [labelEp1, labelEp2] = clippedForLabel
        ? orientEndpointsForLineLabel(clippedForLabel[0], clippedForLabel[1])
        : [ep1, ep2];

    const { labelAttrs, label } = getLabelForLine({
        stateValues: sv,
        ep1: labelEp1,
        ep2: labelEp2,
        diagnostics,
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
 * - Fully on-screen: label location is computed on full segment geometry.
 * - Any endpoint off-screen while segment is visible: alignment overflow
 *   evaluation is run on clipped visible geometry and remapped to
 *   full-segment parameterization.
 *
 * Endpoint-side label locations in this converter use fixed screen-space offset
 * semantics (`lineLabelAbsoluteEndpointOffset`) so extending a segment keeps the
 * label anchor at a stable visual distance from its chosen endpoint.
 *
 * When clipped geometry is used, we set two locations:
 * - `lineLabelLocationOverride`: value written to the output
 *   `label-location` attribute (in full-segment parameter space).
 * - `lineLabelAlignmentLocationOverride`: value used when choosing
 *   `alignment` by overflow amount (in visible clipped-segment space).
 */
export function convertLineSegmentToPrefigure({
    sv,
    handle,
    styleAttrs,
    diagnostics,
    warningPrefix,
    warningPosition,
}: StyledConverterArgs): string | null {
    const endpoints = Array.isArray(sv.numericalEndpoints)
        ? sv.numericalEndpoints
        : null;
    const rawP1 = endpoints?.[0];
    const rawP2 = endpoints?.[1];
    if (!Array.isArray(rawP1) || !Array.isArray(rawP2)) {
        return null;
    }
    if (rawP1.length < 2 || rawP2.length < 2) {
        return null;
    }
    const segmentP1: Point = [Number(rawP1[0]), Number(rawP1[1])];
    const segmentP2: Point = [Number(rawP2[0]), Number(rawP2[1])];
    if ([...segmentP1, ...segmentP2].some((x) => !Number.isFinite(x))) {
        return null;
    }
    const [ep1, ep2] = orientEndpointsForLineLabel(segmentP1, segmentP2);
    const p1 = formatPoint(ep1);
    const p2 = formatPoint(ep2);
    if (p1 === null || p2 === null) {
        return null;
    }

    let labelEp1 = ep1;
    let labelEp2 = ep2;

    const endpoint1Inside = pointInsideBounds(ep1, sv?.graphBounds);
    const endpoint2Inside = pointInsideBounds(ep2, sv?.graphBounds);
    const hasOffscreenEndpoint = !endpoint1Inside || !endpoint2Inside;

    const stateValuesForLabel = {
        ...sv,
        // Use fixed pixel offset semantics so endpoint-side labels stay at a
        // stable on-screen distance from their chosen endpoint as the segment
        // is extended/clipped, instead of drifting under normalized [0, 1]
        // location scaling, which is a fraction of the full segment length.
        lineLabelAbsoluteEndpointOffset: true,
    };

    // If either endpoint is off-screen but the segment is still visible, anchor
    // label placement to the visible clipped segment.
    if (hasOffscreenEndpoint) {
        const clippedVisibleSegment = clipLineLikeToBounds({
            point1: ep1,
            point2: ep2,
            bounds: sv?.graphBounds,
            tMin: 0,
            tMax: 1,
        });

        if (clippedVisibleSegment) {
            [labelEp1, labelEp2] = orientEndpointsForLineLabel(
                clippedVisibleSegment[0],
                clippedVisibleSegment[1],
            );

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

            if (t0 !== null && t1 !== null) {
                const visibleLoc =
                    lineLabelLocationValue(
                        sv?.labelPosition,
                        labelEp1,
                        labelEp2,
                        {
                            absoluteEndpointOffset: true,
                            graphBounds: sv?.graphBounds,
                            graphDimensions: sv?.graphDimensions,
                        },
                    ) ?? 0.5;
                // Adjust the label location and alignment to account for portion of segment visible
                stateValuesForLabel.lineLabelAlignmentLocationOverride =
                    visibleLoc;
                stateValuesForLabel.lineLabelLocationOverride =
                    t0 + visibleLoc * (t1 - t0);
            }
        }
    }

    const { labelAttrs, label } = getLabelForLine({
        stateValues: stateValuesForLabel,
        ep1: labelEp1,
        ep2: labelEp2,
        diagnostics,
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
    diagnostics,
    warningPrefix,
    warningPosition,
}: StyledConverterArgs): string | null {
    if (
        !Array.isArray(sv.numericalEndpoint) ||
        !Array.isArray(sv.numericalThroughpoint)
    ) {
        return null;
    }

    const clipped = clipLineLikeToBounds({
        point1: sv.numericalEndpoint,
        point2: sv.numericalThroughpoint,
        bounds: sv.graphBounds,
        tMin: 0,
        tMax: Infinity,
    });
    if (!clipped) {
        return null;
    }

    const [ep1, ep2] = orientEndpointsForLineLabel(clipped[0], clipped[1]);
    const c1 = formatPoint(ep1);
    const c2 = formatPoint(ep2);
    if (c1 === null || c2 === null) {
        return null;
    }

    const { labelAttrs, label } = getLabelForLine({
        stateValues: {
            ...sv,
            lineLabelAbsoluteEndpointOffset: true,
        },
        ep1,
        ep2,
        diagnostics,
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
