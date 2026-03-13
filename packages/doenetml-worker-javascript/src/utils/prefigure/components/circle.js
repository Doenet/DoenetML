import { escapeXml, formatNumber, formatPoint } from "../common";

/**
 * Converts a circle (center + radius) to a PreFigure `<circle>` element.
 */
export function convertCircleToPrefigure({ sv, handle, styleAttrs }) {
    const center = formatPoint(sv.numericalCenter);
    const radius = formatNumber(sv.numericalRadius);
    if (center === null || radius === null) {
        return null;
    }

    return `<circle id="${escapeXml(handle)}" center="${escapeXml(center)}" radius="${escapeXml(radius)}" ${styleAttrs.join(" ")} />`;
}
