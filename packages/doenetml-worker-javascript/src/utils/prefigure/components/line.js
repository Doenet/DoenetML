import { clipRayToBounds, escapeXml, formatPoint } from "../common";
import {
    lineLabelAttributes as getLabelForLine,
    orientEndpointsForLineLabel,
} from "../label";

/**
 * Serializes one PreFigure `<line>` XML element.
 *
 * `labelAttrs` are forwarded from label helpers (for example `label-location`).
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
 * Wraps getLabelForLine and normalises the return shape.
 * ep1/ep2 are the oriented raw [x, y] endpoint arrays.
 */
function getLineLabelInfo({
    sv,
    ep1,
    ep2,
    warnings,
    warningPrefix,
    warningPosition,
}) {
    const result = getLabelForLine({
        stateValues: sv,
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
    const { labelAttrs, label } = getLineLabelInfo({
        sv,
        ep1,
        ep2,
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
    const { labelAttrs, label } = getLineLabelInfo({
        sv,
        ep1,
        ep2,
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
 */
export function convertRayToPrefigure({
    sv,
    handle,
    styleAttrs,
    warnings,
    warningPrefix,
    warningPosition,
}) {
    if (!Array.isArray(sv.numericalEndpoint) || !Array.isArray(sv.numericalThroughpoint)) {
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
    const c1 = formatPoint(ep1);
    const c2 = formatPoint(ep2);
    if (c1 === null || c2 === null) {
        return null;
    }

    const { labelAttrs, label } = getLineLabelInfo({
        sv,
        ep1,
        ep2,
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
