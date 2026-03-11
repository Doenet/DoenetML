import { clipRayToBounds, escapeXml, formatPoint } from "../common";
import { lineLabelAttributes as getLabelForLine } from "../label";

/**
 * Reorders two raw [x, y] points so the first is the leftward (smaller-x) point.
 * For vertical lines (equal x), puts the lower (smaller-y) point first.
 *
 * This canonicalization ensures that PreFigure's label rotation angle is always
 * within (-90°, 90°] in SVG space, so line labels are:
 *  - always parallel to the line (PreFigure default behaviour), and
 *  - always on the top side of the line, never upside-down.
 *
 * The midpoint label position (label_location=0.5, the PreFigure default) is
 * unaffected because swapping endpoints does not change the geometric midpoint.
 */
function orientEndpointsForLabel(p1Raw, p2Raw) {
    if (p1Raw[0] > p2Raw[0] || (p1Raw[0] === p2Raw[0] && p1Raw[1] > p2Raw[1])) {
        return [p2Raw, p1Raw];
    }
    return [p1Raw, p2Raw];
}

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
    const [ep1, ep2] = orientEndpointsForLabel(rawP1, rawP2);
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
    const [ep1, ep2] = orientEndpointsForLabel(rawP1, rawP2);
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
    const p1 = formatPoint(sv.numericalEndpoint);
    const p2 = formatPoint(sv.numericalThroughpoint);
    if (p1 === null || p2 === null) {
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

    const [ep1, ep2] = orientEndpointsForLabel(clipped[0], clipped[1]);
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
