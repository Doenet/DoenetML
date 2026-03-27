/**
 * Utilities for evaluating style-definition contrast in light mode and
 * producing accessibility diagnostics when WCAG AA thresholds are not met.
 *
 * This module:
 * - Parses CSS colors to RGBA where possible,
 * - Composites translucent colors over the light canvas,
 * - Computes contrast ratios for text and graphical style channels,
 * - Returns accessibility diagnostics annotated with source positions.
 */
import contrast from "get-contrast";
import rgb from "rgb";
import type { Position } from "@doenet/parser";
import type { AccessibilityRecord } from "../diagnostics/types";
import {
    getStyleValueNumber,
    getStyleValueString,
    latestPosition,
    type StyleDefinition,
    type StyleDefinitions,
} from "./styleDefinitionHelpers";

const CANVAS_LIGHT_MODE_COLOR = "#ffffff";

const OPAQUE_CANVAS: Rgba = {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
};

type Rgba = {
    r: number;
    g: number;
    b: number;
    a: number;
};

/**
 * Clamps a numeric value to the inclusive range [0, 1].
 *
 * @param value - Number to clamp, typically an alpha/opacity value.
 * @returns The clamped value in [0, 1], or 1 if the input is non-finite.
 */
function clamp01(value: number): number {
    if (!Number.isFinite(value)) {
        return 1;
    }

    if (value <= 0) {
        return 0;
    }

    if (value >= 1) {
        return 1;
    }

    return value;
}

/**
 * Converts a CSS color string into RGBA channel values.
 *
 * @param color - CSS color input (e.g. hex/rgb/rgba/named color).
 * @returns Parsed RGBA channels, or null if parsing fails.
 */
function parseToRgba(color: string): Rgba | null {
    let normalized: string;
    try {
        normalized = rgb(color).replace(/\s+/g, "");
    } catch {
        return null;
    }

    const match = normalized.match(/^rgba?\(([^)]+)\)$/i);
    if (!match) {
        return null;
    }

    const parts = match[1].split(",").map((x) => Number(x));
    if (parts.length !== 3 && parts.length !== 4) {
        return null;
    }

    if (!parts.every((x) => Number.isFinite(x))) {
        return null;
    }

    return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: clamp01(parts[3] ?? 1),
    };
}

/**
 * Alpha-composites a foreground color over a background color.
 *
 * @param foreground - Foreground RGBA color.
 * @param background - Background RGBA color.
 * @returns The composited RGBA color.
 */
function compositeForegroundOverBackground(
    foreground: Rgba,
    background: Rgba,
): Rgba {
    const alphaOut = foreground.a + background.a * (1 - foreground.a);

    if (alphaOut === 0) {
        return { r: 0, g: 0, b: 0, a: 0 };
    }

    return {
        r:
            (foreground.r * foreground.a +
                background.r * background.a * (1 - foreground.a)) /
            alphaOut,
        g:
            (foreground.g * foreground.a +
                background.g * background.a * (1 - foreground.a)) /
            alphaOut,
        b:
            (foreground.b * foreground.a +
                background.b * background.a * (1 - foreground.a)) /
            alphaOut,
        a: alphaOut,
    };
}

/**
 * Formats an RGBA color as an opaque CSS rgb(...) string.
 *
 * @param color - RGBA color whose RGB channels will be rounded.
 * @returns CSS rgb(...) string.
 */
function rgbaToRgbString(color: Rgba): string {
    return `rgb(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)})`;
}

/**
 * Blends a foreground color onto a background color over the light-mode canvas.
 *
 * Both `foregroundColor` and `backgroundColor` may begin as translucent.
 * The foreground alpha is additionally scaled by `opacityMultiplier` before
 * compositing.
 *
 * @param foregroundColor - Foreground CSS color.
 * @param backgroundColor - Background CSS color.
 * @param opacityMultiplier - Multiplier applied to foreground alpha (then clamped to [0,1]).
 * @returns Effective composited foreground as rgb(...), or null on parse failure.
 */
function blendColorOntoBackground(
    foregroundColor: string,
    backgroundColor: string,
    opacityMultiplier = 1,
): string | null {
    const foregroundRgba = parseToRgba(foregroundColor);
    const backgroundRgba = parseToRgba(backgroundColor);

    if (!foregroundRgba || !backgroundRgba) {
        return null;
    }

    foregroundRgba.a = clamp01(foregroundRgba.a * opacityMultiplier);

    const effectiveBackground = compositeForegroundOverBackground(
        backgroundRgba,
        OPAQUE_CANVAS,
    );
    const effectiveForeground = compositeForegroundOverBackground(
        foregroundRgba,
        effectiveBackground,
    );

    return rgbaToRgbString(effectiveForeground);
}

/**
 * Resolves a background color into its effective opaque color over the canvas.
 *
 * @param backgroundColor - Background CSS color that may include alpha.
 * @returns Opaque rgb(...) background string, or null on parse failure.
 */
function resolveBackgroundToOpaqueColor(
    backgroundColor: string,
): string | null {
    const backgroundRgba = parseToRgba(backgroundColor);
    if (!backgroundRgba) {
        return null;
    }

    const blendedBackground = compositeForegroundOverBackground(
        backgroundRgba,
        OPAQUE_CANVAS,
    );
    return rgbaToRgbString(blendedBackground);
}

/**
 * Computes contrast ratio for two CSS colors.
 *
 * @param color1 - First CSS color string.
 * @param color2 - Second CSS color string.
 * @returns WCAG contrast ratio, or null if the contrast library throws.
 */
function ratioOrNull(color1: string, color2: string): number | null {
    try {
        return contrast.ratio(color1, color2);
    } catch {
        return null;
    }
}

/**
 * Formats a contrast ratio for diagnostic text.
 *
 * @param value - Numeric ratio.
 * @returns Ratio string with two decimal places.
 */
function formatRatio(value: number): string {
    return value.toFixed(2);
}

/**
 * Creates a standardized style-contrast accessibility diagnostic.
 *
 * @param args - Diagnostic details (style number, context, measured ratio,
 * required threshold, and source position).
 * @returns An accessibility diagnostic suitable for sendDiagnostics.
 */
function createContrastAccessibilityDiagnostic({
    styleNumber,
    context,
    ratio,
    threshold,
    position,
}: {
    styleNumber: string;
    context: string;
    ratio: number;
    threshold: number;
    position?: Position;
}): AccessibilityRecord {
    return {
        type: "accessibility",
        level: 1,
        message: `Style definition ${styleNumber} has insufficient contrast for ${context} (${formatRatio(ratio)}:1; requires at least ${threshold}:1).`,
        position,
    };
}

/**
 * Conditionally appends a contrast accessibility diagnostic when ratio and
 * position are valid and the threshold is not met.
 *
 * @param args - Diagnostic target array and contrast-evaluation inputs.
 * @returns Nothing. Mutates the diagnostics array in place when needed.
 */
function appendContrastAccessibilityDiagnosticIfNeeded({
    diagnostics,
    styleNumber,
    context,
    ratio,
    threshold,
    position,
}: {
    diagnostics: AccessibilityRecord[];
    styleNumber: string;
    context: string;
    ratio: number | null;
    threshold: number;
    position?: Position;
}) {
    if (ratio === null || ratio >= threshold || !position) {
        return;
    }

    diagnostics.push(
        createContrastAccessibilityDiagnostic({
            styleNumber,
            context,
            ratio,
            threshold,
            position,
        }),
    );
}

/**
 * Computes a contrast ratio for a foreground/background pair, using compositing
 * when both colors can be parsed into RGBA channels.
 *
 * Here, "parsed" means `parseToRgba(color)` succeeds: the CSS color string is
 * converted to numeric `{ r, g, b, a }` channel values.
 *
 * Compositing path:
 * - Triggered when both `foreground` and `background` parse successfully via
 *   `parseToRgba`.
 * - Applies `opacityMultiplier` to the foreground alpha.
 * - Composites background over the light canvas, then foreground over that
 *   effective background, and computes ratio from those effective opaque colors.
 *
 * Non-compositing fallback:
 * - Used only when parsing fails and `opacityMultiplier === 1`.
 * - Computes ratio directly from the original color strings via `get-contrast`.
 *
 * No-ratio case:
 * - Returns `null` when parsing fails and `opacityMultiplier !== 1`, since we
 *   cannot reliably apply opacity without RGBA channels.
 *
 * @param args - Foreground color, background color, and foreground opacity multiplier.
 * @returns Contrast ratio, or null when it cannot be computed reliably.
 */
function ratioWithOptionalCompositing({
    foreground,
    background,
    opacityMultiplier,
}: {
    foreground: string;
    background: string;
    opacityMultiplier: number;
}): number | null {
    const blendedForeground = blendColorOntoBackground(
        foreground,
        background,
        opacityMultiplier,
    );
    const opaqueBackground = resolveBackgroundToOpaqueColor(background);

    if (blendedForeground && opaqueBackground) {
        return ratioOrNull(blendedForeground, opaqueBackground);
    }

    if (opacityMultiplier !== 1) {
        return null;
    }

    return ratioOrNull(foreground, background);
}

/**
 * Generates all applicable light-mode contrast accessibility diagnostics for
 * one style definition.
 *
 * @param styleNumber - Style number being validated.
 * @param styleDef - Resolved style definition values.
 * @returns Array of accessibility diagnostics for that style number.
 */
function contrastAccessibilityDiagnosticsForStyleDefinition(
    styleNumber: string,
    styleDef: StyleDefinition,
): AccessibilityRecord[] {
    const diagnostics: AccessibilityRecord[] = [];

    const textColor = getStyleValueString(styleDef, "textColor");
    const backgroundColor =
        getStyleValueString(styleDef, "backgroundColor") ??
        CANVAS_LIGHT_MODE_COLOR;

    if (textColor) {
        const diagnosticPosition = latestPosition(
            styleDef.textColor?.position,
            styleDef.backgroundColor?.position,
        );
        const ratio = ratioWithOptionalCompositing({
            foreground: textColor,
            background: backgroundColor,
            opacityMultiplier: 1,
        });

        appendContrastAccessibilityDiagnosticIfNeeded({
            diagnostics,
            styleNumber,
            context:
                backgroundColor === CANVAS_LIGHT_MODE_COLOR
                    ? "text color against the canvas"
                    : "text color against background color",
            ratio,
            threshold: 4.5,
            position: diagnosticPosition,
        });
    }

    const highContrastColor = getStyleValueString(
        styleDef,
        "highContrastColor",
    );
    if (highContrastColor) {
        const diagnosticPosition = styleDef.highContrastColor?.position;
        const ratio = ratioWithOptionalCompositing({
            foreground: CANVAS_LIGHT_MODE_COLOR,
            background: highContrastColor,
            opacityMultiplier: 1,
        });

        appendContrastAccessibilityDiagnosticIfNeeded({
            diagnostics,
            styleNumber,
            context: "high-contrast color against canvas text",
            ratio,
            threshold: 4.5,
            position: diagnosticPosition,
        });
    }

    const lineColor = getStyleValueString(styleDef, "lineColor");
    if (lineColor) {
        const diagnosticPosition = latestPosition(
            styleDef.lineColor?.position,
            styleDef.lineOpacity?.position,
        );
        const lineOpacity = getStyleValueNumber(styleDef, "lineOpacity") ?? 1;
        const ratio = ratioWithOptionalCompositing({
            foreground: lineColor,
            background: CANVAS_LIGHT_MODE_COLOR,
            opacityMultiplier: lineOpacity,
        });

        appendContrastAccessibilityDiagnosticIfNeeded({
            diagnostics,
            styleNumber,
            context: "line color against the canvas",
            ratio,
            threshold: 3,
            position: diagnosticPosition,
        });
    }

    const markerColor = getStyleValueString(styleDef, "markerColor");
    if (markerColor) {
        const diagnosticPosition = latestPosition(
            styleDef.markerColor?.position,
            styleDef.markerOpacity?.position,
        );
        const markerOpacity =
            getStyleValueNumber(styleDef, "markerOpacity") ?? 1;
        const ratio = ratioWithOptionalCompositing({
            foreground: markerColor,
            background: CANVAS_LIGHT_MODE_COLOR,
            opacityMultiplier: markerOpacity,
        });

        appendContrastAccessibilityDiagnosticIfNeeded({
            diagnostics,
            styleNumber,
            context: "marker color against the canvas",
            ratio,
            threshold: 3,
            position: diagnosticPosition,
        });
    }

    return diagnostics;
}

/**
 * Generates all light-mode contrast accessibility diagnostics across all style
 * definitions.
 *
 * @param styleDefinitions - Map of style numbers to resolved style definitions.
 * @returns Flattened list of accessibility diagnostics for all styles.
 */
export function contrastAccessibilityDiagnosticsForStyleDefinitions(
    styleDefinitions: StyleDefinitions,
): AccessibilityRecord[] {
    const diagnostics: AccessibilityRecord[] = [];

    for (const styleNumber in styleDefinitions) {
        diagnostics.push(
            ...contrastAccessibilityDiagnosticsForStyleDefinition(
                styleNumber,
                styleDefinitions[styleNumber],
            ),
        );
    }

    return diagnostics;
}
