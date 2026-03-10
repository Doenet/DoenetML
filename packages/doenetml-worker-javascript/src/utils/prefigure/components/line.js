import { escapeXml, formatPoint } from "../common";

function lineElement({ handle, p1, p2, infinite, styleAttrs }) {
    return `<line id="${escapeXml(handle)}" endpoints="${escapeXml(`(${p1},${p2})`)}" infinite="${infinite}" ${styleAttrs.join(" ")} />`;
}

/**
 * Converts an infinite line (two defining points) to a PreFigure `<line>` element.
 */
export function convertLineToPrefigure({ sv, handle, styleAttrs }) {
    const p1 = formatPoint(sv.numericalPoints?.[0]);
    const p2 = formatPoint(sv.numericalPoints?.[1]);
    if (p1 === null || p2 === null) {
        return null;
    }
    return lineElement({ handle, p1, p2, infinite: "yes", styleAttrs });
}

/**
 * Converts a finite line segment to a PreFigure `<line infinite="no">` element.
 */
export function convertLineSegmentToPrefigure({ sv, handle, styleAttrs }) {
    const p1 = formatPoint(sv.numericalEndpoints?.[0]);
    const p2 = formatPoint(sv.numericalEndpoints?.[1]);
    if (p1 === null || p2 === null) {
        return null;
    }
    return lineElement({ handle, p1, p2, infinite: "no", styleAttrs });
}

/**
 * Converts a ray (endpoint + throughpoint) to a PreFigure line representation.
 */
export function convertRayToPrefigure({ sv, handle, styleAttrs }) {
    const p1 = formatPoint(sv.numericalEndpoint);
    const p2 = formatPoint(sv.numericalThroughpoint);
    if (p1 === null || p2 === null) {
        return null;
    }
    return lineElement({ handle, p1, p2, infinite: "yes", styleAttrs });
}
