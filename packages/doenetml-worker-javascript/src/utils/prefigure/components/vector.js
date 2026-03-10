import { escapeXml, formatNumber, formatPoint } from "../common";

/**
 * Converts a vector (tail/head endpoints) to a PreFigure `<vector>` element.
 */
export function convertVectorToPrefigure({ sv, handle, styleAttrs }) {
    const tail = sv.numericalEndpoints?.[0];
    const head = sv.numericalEndpoints?.[1];
    const tailText = formatPoint(tail);
    if (tailText === null || !Array.isArray(tail) || !Array.isArray(head)) {
        return null;
    }

    const dx = formatNumber(head[0] - tail[0]);
    const dy = formatNumber(head[1] - tail[1]);
    if (dx === null || dy === null) {
        return null;
    }

    return `<vector id="${escapeXml(handle)}" tail="${escapeXml(tailText)}" v="${escapeXml(`(${dx},${dy})`)}" ${styleAttrs.join(" ")} />`;
}
