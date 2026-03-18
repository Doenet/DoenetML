import { escapeXml, formatNumber, formatPoint } from "../common";
import type { StyledConverterArgs } from "../types";

/**
 * Converts a circle (center + radius) to a PreFigure `<circle>` element.
 */
export function convertCircleToPrefigure({
    sv,
    handle,
    styleAttrs,
}: StyledConverterArgs): string | null {
    const center = formatPoint(sv.numericalCenter);
    const radius = formatNumber(sv.numericalRadius);
    if (center === null || radius === null) {
        return null;
    }

    return `<circle id="${escapeXml(handle)}" center="${escapeXml(center)}" radius="${escapeXml(radius)}" ${styleAttrs.join(" ")} />`;
}
