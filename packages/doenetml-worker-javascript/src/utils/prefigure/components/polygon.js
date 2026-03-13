import { escapeXml, formatPoint } from "../common";

function serializedVertices(vertices) {
    return (vertices ?? [])
        .map((pt) => formatPoint(pt))
        .filter((pt) => pt !== null);
}

function polygonElement({ handle, points, closed, styleAttrs }) {
    return `<polygon id="${escapeXml(handle)}" points="${escapeXml(`(${points.join(",")})`)}" closed="${closed}" ${styleAttrs.join(" ")} />`;
}

/**
 * Converts a polyline to a PreFigure `<polygon closed="no">` element.
 */
export function convertPolylineToPrefigure({ sv, handle, styleAttrs }) {
    const points = serializedVertices(sv.numericalVertices);
    if (points.length < 2) {
        return null;
    }

    return polygonElement({ handle, points, closed: "no", styleAttrs });
}

/**
 * Converts a polygon to a PreFigure `<polygon closed="yes">` element.
 */
export function convertPolygonToPrefigure({ sv, handle, styleAttrs }) {
    const points = serializedVertices(sv.numericalVertices);
    if (points.length < 3) {
        return null;
    }

    return polygonElement({ handle, points, closed: "yes", styleAttrs });
}
