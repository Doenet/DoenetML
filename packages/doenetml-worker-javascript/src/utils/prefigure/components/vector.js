import { escapeXml, formatNumber, formatPoint } from "../common";
import {
    lineLabelAttributes as getLabelForLine,
    lineLabelLocationValue,
    orientEndpointsForLineLabel,
} from "../label";

/**
 * Converts a vector (tail/head endpoints) to a PreFigure `<vector>` element.
 *
 * Label handling note:
 * - We currently emit vector labels as separate `<label>` siblings with an
 *   absolute anchor point.
 * - Anchor location reuses Doenet line-family location semantics
 *   (`lineLabelLocationValue`) for consistency with existing conversion tests.
 * - This intentionally differs from PreFigure's native vector label semantics,
 *   which are head-anchored and offset-driven.
 */
export function convertVectorToPrefigure({
    sv,
    handle,
    styleAttrs,
    warnings,
    warningPrefix,
    warningPosition,
}) {
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

    const [ep1, ep2] = orientEndpointsForLineLabel(tail, head);
    const labelInfo = getLabelForLine({
        stateValues: sv,
        ep1,
        ep2,
        warnings,
        warningPrefix,
        warningPosition,
    });
    const label = labelInfo?.label;

    const attrs = [
        `id="${escapeXml(handle)}"`,
        `tail="${escapeXml(tailText)}"`,
        `v="${escapeXml(`(${dx},${dy})`)}"`,
        ...styleAttrs,
    ];

    const vectorXml = `<vector ${attrs.join(" ")} />`;

    if (!label) {
        return vectorXml;
    }

    // Keep location policy aligned with line-family Doenet labelPosition mapping.
    const location = lineLabelLocationValue(sv?.labelPosition, ep1, ep2);

    const anchor = [
        Number((ep1[0] + (ep2[0] - ep1[0]) * location).toFixed(12)),
        Number((ep1[1] + (ep2[1] - ep1[1]) * location).toFixed(12)),
    ];
    const anchorText = formatPoint(anchor);
    if (anchorText === null) {
        return vectorXml;
    }

    const labelXml = `<label p="${escapeXml(anchorText)}" alignment="north">${label}</label>`;

    return `${vectorXml}${labelXml}`;
}
