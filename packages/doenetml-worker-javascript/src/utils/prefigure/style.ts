import { Position } from "../dast/types";
import { asFiniteNumber, escapeXml, formatNumber, pushWarning } from "./common";
import type { SelectedStyle } from "./types";
import type { DiagnosticRecord } from "@doenet/utils";

/**
 * Maps DoenetML fillStyle values (stored lowercase) to prefigure fill-pattern values.
 * DoenetML's "dots"/"diamonds" (plural) map to prefigure's "dot"/"diamond" (singular).
 */
const prefigureFillPatternByFillStyle: Record<string, string> = {
    horizontal: "horizontal",
    vertical: "vertical",
    diagonal: "diagonal",
    backdiagonal: "backdiagonal",
    dots: "dot",
    diamonds: "diamond",
};

const prefigureDashByLineStyle: Record<string, string | null> = {
    solid: null,
    dashed: "9 9",
    dotted: "4 4",
};

const prefigurePointStyleByMarkerStyle: Record<string, string> = {
    circle: "circle",
    square: "box",
    box: "box",
    diamond: "diamond",
    cross: "cross",
    plus: "plus",
    "double-circle": "double-circle",
};

/**
 * Returns a `selectedStyle` whose color fields hold the dark-mode values when
 * `darkMode` is true, so the rest of the PreFigure conversion (which reads the
 * plain `*Color`/`*ColorWord` fields) emits theme-appropriate colors without
 * every converter needing to know about dark mode.
 *
 * The dark values are derived by the worker to satisfy WCAG AA against the dark
 * canvas, matching what the JSXGraph renderer picks via `resolveLineColor` etc.
 * In light mode (or when no style is present) the input is returned unchanged.
 */
export function resolveSelectedStyleForTheme(
    selectedStyle: SelectedStyle | undefined,
    darkMode: boolean,
): SelectedStyle | undefined {
    if (!selectedStyle || !darkMode) {
        return selectedStyle;
    }

    const pickDark = (darkKey: string, lightValue: string | undefined) => {
        const darkValue = selectedStyle[darkKey];
        return typeof darkValue === "string" ? darkValue : lightValue;
    };

    return {
        ...selectedStyle,
        lineColor: pickDark("lineColorDarkMode", selectedStyle.lineColor),
        lineColorWord: pickDark(
            "lineColorWordDarkMode",
            selectedStyle.lineColorWord,
        ),
        fillColor: pickDark("fillColorDarkMode", selectedStyle.fillColor),
        fillColorWord: pickDark(
            "fillColorWordDarkMode",
            selectedStyle.fillColorWord,
        ),
        markerColor: pickDark("markerColorDarkMode", selectedStyle.markerColor),
        markerColorWord: pickDark(
            "markerColorWordDarkMode",
            selectedStyle.markerColorWord,
        ),
        textColor: pickDark(
            "textColorDarkMode",
            selectedStyle.textColor as string | undefined,
        ),
    };
}

/**
 * Maps common line/fill style fields from Doenet selectedStyle to PreFigure attributes.
 */
export function styleAttributes({
    selectedStyle,
    diagnostics,
    warningPrefix,
    warningPosition,
    includeFill = true,
}: {
    selectedStyle: SelectedStyle | undefined;
    diagnostics: DiagnosticRecord[];
    warningPrefix: string;
    warningPosition?: Position;
    includeFill?: boolean;
}): string[] {
    const attrs = [];

    const stroke = selectedStyle?.lineColor ?? selectedStyle?.lineColorWord;
    if (stroke) {
        attrs.push(`stroke="${escapeXml(stroke)}"`);
    }

    const thickness = formatNumber(selectedStyle?.lineWidth);
    if (thickness !== null) {
        attrs.push(`thickness="${escapeXml(thickness)}"`);
    }

    if (includeFill) {
        const fillStyle = selectedStyle?.fillStyle;
        const prefigurePattern =
            fillStyle && fillStyle !== "solid"
                ? prefigureFillPatternByFillStyle[fillStyle]
                : undefined;

        const fill = selectedStyle?.fillColor ?? selectedStyle?.fillColorWord;

        if (prefigurePattern !== undefined) {
            // Patterned fill: emit fill-pattern, fill color, and fillPatternOpacity
            attrs.push(`fill-pattern="${escapeXml(prefigurePattern)}"`);
            if (fill) {
                attrs.push(`fill="${escapeXml(fill)}"`);
            }
            const fillPatternOpacity = formatNumber(
                selectedStyle?.fillPatternOpacity,
            );
            if (fillPatternOpacity !== null) {
                attrs.push(`fill-opacity="${escapeXml(fillPatternOpacity)}"`);
            }
        } else {
            // Solid fill (or unsupported pattern falling back to solid)
            if (fill) {
                attrs.push(`fill="${escapeXml(fill)}"`);
            }
            const fillOpacity = formatNumber(selectedStyle?.fillOpacity);
            if (fillOpacity !== null) {
                attrs.push(`fill-opacity="${escapeXml(fillOpacity)}"`);
            }
            if (fillStyle && fillStyle !== "solid") {
                pushWarning({
                    diagnostics,
                    code: "doenet-w0091",
                    args: { subject: warningPrefix, fillStyle },
                    position: warningPosition,
                });
            }
        }
    }

    const lineOpacity = formatNumber(selectedStyle?.lineOpacity);
    if (lineOpacity !== null) {
        attrs.push(`stroke-opacity="${escapeXml(lineOpacity)}"`);
    }

    const lineStyle = selectedStyle?.lineStyle;
    if (lineStyle) {
        const dash = prefigureDashByLineStyle[lineStyle];
        if (dash) {
            attrs.push(`dash="${escapeXml(dash)}"`);
        } else if (!(lineStyle in prefigureDashByLineStyle)) {
            pushWarning({
                diagnostics,
                code: "doenet-w0092",
                args: { subject: warningPrefix, lineStyle },
                position: warningPosition,
            });
        }
    }

    return attrs;
}

/**
 * An arrow's line width, rounded to a whole pixel, at least 1, or null if
 * there is none.
 *
 * PreFigure 0.7.6 reads an arrow's line width as an integer and divides by it
 * when building the arrowhead, so a `thickness` of `2.5` or `0` makes it
 * abandon the arrow and everything drawn after it in the diagram.
 */
export function wholePixelThickness(lineWidth: unknown): number | null {
    const width = asFiniteNumber(lineWidth);
    return width === null ? null : Math.max(1, Math.round(width));
}

/**
 * `styleAttrs` with its `thickness` rounded as {@link wholePixelThickness}
 * rounds it, for an element PreFigure draws with an arrowhead.
 */
export function wholePixelThicknessAttributes(
    styleAttrs: string[],
    lineWidth: unknown,
): string[] {
    const thickness = wholePixelThickness(lineWidth);
    if (thickness === null) {
        return styleAttrs;
    }
    return styleAttrs.map((attr) =>
        attr.startsWith("thickness=") ? `thickness="${thickness}"` : attr,
    );
}

/**
 * Maps point marker fields from Doenet selectedStyle to PreFigure point attributes.
 *
 * When `includeFill` is false, fill-specific attrs are omitted while stroke
 * attrs are still emitted (used for open endpoint/equilibriumPoint rendering).
 */
export function pointStyleAttributes({
    selectedStyle,
    diagnostics,
    warningPrefix,
    warningPosition,
    includeFill = true,
}: {
    selectedStyle: SelectedStyle | undefined;
    diagnostics: DiagnosticRecord[];
    warningPrefix: string;
    warningPosition?: Position;
    includeFill?: boolean;
}): string[] {
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
                diagnostics,
                code: "doenet-w0093",
                args: {
                    subject: warningPrefix,
                    markerStyle: markerStyleString,
                },
                position: warningPosition,
            });
        } else {
            pushWarning({
                diagnostics,
                code: "doenet-w0094",
                args: {
                    subject: warningPrefix,
                    markerStyle: markerStyleString,
                },
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
        if (includeFill) {
            attrs.push(`fill="${escapeXml(color)}"`);
        }
        attrs.push(`stroke="${escapeXml(color)}"`);
    }

    const opacity = formatNumber(selectedStyle?.markerOpacity);
    if (opacity !== null) {
        if (includeFill) {
            attrs.push(`fill-opacity="${escapeXml(opacity)}"`);
        }
        attrs.push(`stroke-opacity="${escapeXml(opacity)}"`);
    }

    const thickness = formatNumber(selectedStyle?.lineWidth);
    if (thickness !== null) {
        attrs.push(`thickness="${escapeXml(thickness)}"`);
    }

    return attrs;
}
