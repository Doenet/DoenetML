/**
 * Utilities for evaluating style-definition contrast in light and dark mode and
 * producing accessibility diagnostics when WCAG AA thresholds are not met.
 *
 * Color parsing, alpha compositing, and contrast computation are delegated to
 * `colorAccessibility.ts` (built on `colord`) so this module and the dark-mode
 * color derivation in `style.ts` share one definition of "accessible".
 *
 * Two passes run for every style definition:
 *  - **Light mode**: foreground color channels composited over the white canvas.
 *  - **Dark mode**: the corresponding `*ColorDarkMode` channels composited over
 *    the dark canvas. Derived dark-mode colors are accessible by construction,
 *    so in practice these diagnostics fire only for author-supplied dark-mode
 *    colors that fail WCAG AA.
 */
import type { Position } from "@doenet/parser";
import type { AccessibilityRecord } from "../diagnostics/types";
import {
    getStyleValueNumber,
    getStyleValueString,
    latestPosition,
    type StyleDefinition,
    type StyleDefinitions,
    type StyleDefinitionKey,
} from "./styleDefinitionHelpers";
import {
    CANVAS_DARK_MODE_COLOR,
    CANVAS_LIGHT_MODE_COLOR,
    GRAPHIC_CONTRAST_THRESHOLD,
    TEXT_CONTRAST_THRESHOLD,
    compositedContrastRatio,
} from "./colorAccessibility";

type Mode = "light" | "dark";

const CANVAS_FOR_MODE: Record<Mode, string> = {
    light: CANVAS_LIGHT_MODE_COLOR,
    dark: CANVAS_DARK_MODE_COLOR,
};

/** Suffix added to diagnostic context strings in dark mode. */
const MODE_SUFFIX: Record<Mode, string> = {
    light: "",
    dark: " (dark mode)",
};

/**
 * Formats a contrast ratio for diagnostic text.
 */
function formatRatio(value: number): string {
    return value.toFixed(2);
}

/**
 * Creates a standardized style-contrast accessibility diagnostic.
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
 * Conditionally appends a contrast accessibility diagnostic when the ratio is
 * insufficient.
 *
 * `gatePosition` is the source position of the *color value itself* and decides
 * whether to emit at all: only author-supplied colors (which carry a position)
 * are flagged, never colors we derived or seeded from a preset (which carry no
 * position). `position` is where the diagnostic is anchored, which may be a
 * later contributor such as an opacity or background attribute.
 */
function appendContrastAccessibilityDiagnosticIfNeeded({
    diagnostics,
    styleNumber,
    context,
    ratio,
    threshold,
    gatePosition,
    position,
}: {
    diagnostics: AccessibilityRecord[];
    styleNumber: string;
    context: string;
    ratio: number | null;
    threshold: number;
    gatePosition?: Position;
    position?: Position;
}) {
    if (ratio === null || ratio >= threshold || !gatePosition || !position) {
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
 * Resolves the color key for a color item in a given mode (light vs dark).
 */
function colorKey(item: string, mode: Mode): StyleDefinitionKey {
    return (
        mode === "dark" ? `${item}ColorDarkMode` : `${item}Color`
    ) as StyleDefinitionKey;
}

/**
 * Evaluates all contrast checks for one style definition in one mode.
 */
function contrastDiagnosticsForMode(
    styleNumber: string,
    styleDef: StyleDefinition,
    mode: Mode,
): AccessibilityRecord[] {
    const diagnostics: AccessibilityRecord[] = [];
    const canvas = CANVAS_FOR_MODE[mode];
    const suffix = MODE_SUFFIX[mode];

    // --- Text color against background (or canvas). ---
    const textColor = getStyleValueString(styleDef, colorKey("text", mode));
    const backgroundColor = getStyleValueString(
        styleDef,
        colorKey("background", mode),
    );
    if (textColor) {
        const textPosition = styleDef[colorKey("text", mode)]?.position;
        const diagnosticPosition = latestPosition(
            textPosition,
            styleDef[colorKey("background", mode)]?.position,
        );
        const ratio = compositedContrastRatio({
            foreground: textColor,
            canvas,
            background: backgroundColor,
        });
        appendContrastAccessibilityDiagnosticIfNeeded({
            diagnostics,
            styleNumber,
            context:
                (backgroundColor
                    ? "text color against background color"
                    : "text color against the canvas") + suffix,
            ratio,
            threshold: TEXT_CONTRAST_THRESHOLD,
            gatePosition: textPosition,
            position: diagnosticPosition,
        });
    }

    // --- High-contrast color standing out from the canvas. ---
    const highContrastColor = getStyleValueString(
        styleDef,
        colorKey("highContrast", mode),
    );
    if (highContrastColor) {
        const highContrastPosition =
            styleDef[colorKey("highContrast", mode)]?.position;
        const ratio = compositedContrastRatio({
            foreground: highContrastColor,
            canvas,
        });
        appendContrastAccessibilityDiagnosticIfNeeded({
            diagnostics,
            styleNumber,
            context: "high-contrast color against canvas text" + suffix,
            ratio,
            threshold: TEXT_CONTRAST_THRESHOLD,
            gatePosition: highContrastPosition,
            position: highContrastPosition,
        });
    }

    // --- Line color against the canvas (composited with line opacity). ---
    const lineColor = getStyleValueString(styleDef, colorKey("line", mode));
    if (lineColor) {
        const linePosition = styleDef[colorKey("line", mode)]?.position;
        const diagnosticPosition = latestPosition(
            linePosition,
            styleDef.lineOpacity?.position,
        );
        const lineOpacity = getStyleValueNumber(styleDef, "lineOpacity") ?? 1;
        const ratio = compositedContrastRatio({
            foreground: lineColor,
            canvas,
            opacityMultiplier: lineOpacity,
        });
        appendContrastAccessibilityDiagnosticIfNeeded({
            diagnostics,
            styleNumber,
            context: "line color against the canvas" + suffix,
            ratio,
            threshold: GRAPHIC_CONTRAST_THRESHOLD,
            gatePosition: linePosition,
            position: diagnosticPosition,
        });
    }

    // --- Marker color against the canvas (composited with marker opacity). ---
    const markerColor = getStyleValueString(styleDef, colorKey("marker", mode));
    if (markerColor) {
        const markerPosition = styleDef[colorKey("marker", mode)]?.position;
        const diagnosticPosition = latestPosition(
            markerPosition,
            styleDef.markerOpacity?.position,
        );
        const markerOpacity =
            getStyleValueNumber(styleDef, "markerOpacity") ?? 1;
        const ratio = compositedContrastRatio({
            foreground: markerColor,
            canvas,
            opacityMultiplier: markerOpacity,
        });
        appendContrastAccessibilityDiagnosticIfNeeded({
            diagnostics,
            styleNumber,
            context: "marker color against the canvas" + suffix,
            ratio,
            threshold: GRAPHIC_CONTRAST_THRESHOLD,
            gatePosition: markerPosition,
            position: diagnosticPosition,
        });
    }

    return diagnostics;
}

/**
 * Generates all light- and dark-mode contrast accessibility diagnostics for one
 * style definition.
 */
function contrastAccessibilityDiagnosticsForStyleDefinition(
    styleNumber: string,
    styleDef: StyleDefinition,
): AccessibilityRecord[] {
    return [
        ...contrastDiagnosticsForMode(styleNumber, styleDef, "light"),
        ...contrastDiagnosticsForMode(styleNumber, styleDef, "dark"),
    ];
}

/**
 * Generates all contrast accessibility diagnostics across all style
 * definitions, for both light and dark mode.
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
