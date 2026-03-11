import { escapeXml, formatNumber, pushWarning } from "./common";

const prefigureDashByLineStyle = {
    solid: null,
    dashed: "9 9",
    dotted: "4 4",
};

const prefigurePointStyleByMarkerStyle = {
    circle: "circle",
    square: "box",
    box: "box",
    diamond: "diamond",
    cross: "cross",
    plus: "plus",
    "double-circle": "double-circle",
};

/**
 * Maps common line/fill style fields from Doenet selectedStyle to PreFigure attributes.
 */
export function styleAttributes({
    selectedStyle,
    warnings,
    warningPrefix,
    warningPosition,
}) {
    const attrs = [];

    const stroke = selectedStyle?.lineColor ?? selectedStyle?.lineColorWord;
    if (stroke) {
        attrs.push(`stroke="${escapeXml(stroke)}"`);
    }

    const thickness = formatNumber(selectedStyle?.lineWidth);
    if (thickness !== null) {
        attrs.push(`thickness="${escapeXml(thickness)}"`);
    }

    const fill = selectedStyle?.fillColor ?? selectedStyle?.fillColorWord;
    if (fill) {
        attrs.push(`fill="${escapeXml(fill)}"`);
    }

    const lineOpacity = formatNumber(selectedStyle?.lineOpacity);
    if (lineOpacity !== null) {
        attrs.push(`stroke-opacity="${escapeXml(lineOpacity)}"`);
    }

    const fillOpacity = formatNumber(selectedStyle?.fillOpacity);
    if (fillOpacity !== null) {
        attrs.push(`fill-opacity="${escapeXml(fillOpacity)}"`);
    }

    const lineStyle = selectedStyle?.lineStyle;
    if (lineStyle) {
        const dash = prefigureDashByLineStyle[lineStyle];
        if (dash) {
            attrs.push(`dash="${escapeXml(dash)}"`);
        } else if (!(lineStyle in prefigureDashByLineStyle)) {
            pushWarning({
                warnings,
                message: `${warningPrefix}: unknown line style '${lineStyle}' omitted from PreFigure output.`,
                position: warningPosition,
            });
        }
    }

    return attrs;
}

/**
 * Maps point marker fields from Doenet selectedStyle to PreFigure point attributes.
 */
export function pointStyleAttributes({
    selectedStyle,
    warnings,
    warningPrefix,
    warningPosition,
}) {
    const attrs = [];

    const markerStyle = selectedStyle?.markerStyle;
    if (markerStyle) {
        const markerStyleString = String(markerStyle);
        const mappedStyle = prefigurePointStyleByMarkerStyle[markerStyleString];

        if (mappedStyle) {
            attrs.push(`style="${escapeXml(mappedStyle)}"`);
        } else if (markerStyleString.slice(0, 8) === "triangle") {
            attrs.push('style="diamond"');
            pushWarning({
                warnings,
                message: `${warningPrefix}: marker style '${markerStyleString}' mapped to PreFigure style 'diamond'.`,
                position: warningPosition,
            });
        } else {
            pushWarning({
                warnings,
                message: `${warningPrefix}: marker style '${markerStyleString}' is unsupported by PreFigure; default style used.`,
                position: warningPosition,
            });
        }
    }

    const size = formatNumber(selectedStyle?.markerSize);
    if (size !== null) {
        attrs.push(`size="${escapeXml(size)}"`);
    }

    const color =
        selectedStyle?.markerColor ?? selectedStyle?.markerColorWord ?? null;
    if (color) {
        attrs.push(`fill="${escapeXml(color)}"`);
        attrs.push(`stroke="${escapeXml(color)}"`);
    }

    const opacity = formatNumber(selectedStyle?.markerOpacity);
    if (opacity !== null) {
        attrs.push(`fill-opacity="${escapeXml(opacity)}"`);
        attrs.push(`stroke-opacity="${escapeXml(opacity)}"`);
    }

    const thickness = formatNumber(selectedStyle?.lineWidth);
    if (thickness !== null) {
        attrs.push(`thickness="${escapeXml(thickness)}"`);
    }

    return attrs;
}
