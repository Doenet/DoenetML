import { escapeXml, formatPoint } from "../common";
import type { ConverterArgs } from "../types";

function prefigurePointsFromVertices(vertices: unknown): string[] {
    if (!Array.isArray(vertices)) {
        return [];
    }

    return vertices
        .map((pt: unknown) => formatPoint(pt))
        .filter((pt): pt is string => pt !== null);
}

function polygonElement({
    handle,
    points,
    closed,
    styleAttrs,
}: {
    handle: string;
    points: string[];
    closed: "yes" | "no";
    styleAttrs: string[];
}): string {
    return `<polygon at="${escapeXml(handle)}" points="${escapeXml(`(${points.join(",")})`)}" closed="${closed}" ${styleAttrs.join(" ")} />`;
}

/**
 * Converts a polyline to a PreFigure `<polygon closed="no">` element.
 */
export function convertPolylineToPrefigure({
    sv,
    handle,
    styleAttrs,
}: ConverterArgs): string | null {
    const points = prefigurePointsFromVertices(sv.numericalVertices);
    if (points.length < 2) {
        return null;
    }

    return polygonElement({ handle, points, closed: "no", styleAttrs });
}

/**
 * Converts a polygon to a PreFigure `<polygon closed="yes">` element.
 */
export function convertPolygonToPrefigure({
    sv,
    handle,
    styleAttrs,
}: ConverterArgs): string | null {
    const points = prefigurePointsFromVertices(sv.numericalVertices);
    if (points.length < 3) {
        return null;
    }

    return polygonElement({ handle, points, closed: "yes", styleAttrs });
}
