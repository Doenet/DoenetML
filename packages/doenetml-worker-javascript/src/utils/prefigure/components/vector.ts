import {
    escapeXml,
    extractFinitePointPair,
    formatNumber,
    formatPoint,
} from "../common";
import {
    getLabelForLine,
    lineLabelLocationValue,
    orientEndpointsForLineLabel,
} from "../label";
import type { ConverterArgs, Point } from "../types";

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
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterArgs): string | null {
    const endpoints = extractFinitePointPair(sv.numericalEndpoints);
    if (!endpoints) {
        return null;
    }
    const [tail, head] = endpoints;
    const tailText = formatPoint(tail);
    if (tailText === null) {
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
        diagnostics,
        warningPrefix,
        warningPosition,
    });
    const label = labelInfo?.label;

    const attrs = [
        `at="${escapeXml(handle)}"`,
        `tail="${escapeXml(tailText)}"`,
        `v="${escapeXml(`(${dx},${dy})`)}"`,
        ...styleAttrs,
    ];

    const vectorXml = `<vector ${attrs.join(" ")} />`;

    if (!label) {
        return vectorXml;
    }

    // Keep location policy aligned with line-family Doenet labelPosition mapping.
    const location = lineLabelLocationValue(sv?.labelPosition, ep1, ep2) ?? 0.5;

    const anchor: Point = [
        Number((ep1[0] + (ep2[0] - ep1[0]) * location).toFixed(12)),
        Number((ep1[1] + (ep2[1] - ep1[1]) * location).toFixed(12)),
    ];
    const anchorText = formatPoint(anchor);
    if (anchorText === null) {
        return vectorXml;
    }

    // TODO: Map vector labelPosition to PreFigure label alignment once we have
    // parity requirements for vector-native label placement.
    const labelXml = `<label p="${escapeXml(anchorText)}" alignment="north">${label}</label>`;

    return `${vectorXml}${labelXml}`;
}
