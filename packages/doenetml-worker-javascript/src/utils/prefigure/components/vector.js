import { escapeXml, formatNumber, formatPoint } from "../common";
import { lineLabelAttributes as getLabelForLine } from "../label";
import { lineLabelLocationFromPosition } from "../label";

function orientEndpointsForLabel(p1Raw, p2Raw) {
    if (p1Raw[0] > p2Raw[0] || (p1Raw[0] === p2Raw[0] && p1Raw[1] > p2Raw[1])) {
        return [p2Raw, p1Raw];
    }
    return [p1Raw, p2Raw];
}

/**
 * Converts a vector (tail/head endpoints) to a PreFigure `<vector>` element.
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

    const [ep1, ep2] = orientEndpointsForLabel(tail, head);
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

    let location = 0.5;
    if (sv?.labelPosition) {
        const locText = lineLabelLocationFromPosition(
            sv.labelPosition,
            ep1,
            ep2,
        );
        if (locText !== null) {
            const parsed = Number(locText);
            if (Number.isFinite(parsed)) {
                location = parsed;
            }
        }
    }

    const anchor = [
        ep1[0] + (ep2[0] - ep1[0]) * location,
        ep1[1] + (ep2[1] - ep1[1]) * location,
    ];
    const anchorText = formatPoint(anchor);
    if (anchorText === null) {
        return vectorXml;
    }

    const labelXml = `<label p="${escapeXml(anchorText)}" alignment="north">${label}</label>`;

    return `${vectorXml}${labelXml}`;
}
