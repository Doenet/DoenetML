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
 *    the dark canvas. Derived dark-mode foreground colors are adjusted toward
 *    the threshold where possible; these diagnostics fire when any
 *    author-supplied contributor to the rendered contrast (color, background, or
 *    opacity) makes the result fail WCAG AA.
 */
import type { Position } from "@doenet/parser";
import type { AccessibilityRecord } from "../diagnostics/types";
import {
    getStyleValueNumber,
    getStyleValueString,
    latestPosition,
    DEFAULT_STYLE_VALUES,
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
    deriveAccessibleDarkModeColor,
    invertLightness,
    suggestAccessibleDarkModeColorAgainst,
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
 * `position` is the latest authored contributor to the rendered contrast, such
 * as a foreground color, background color, or opacity attribute. Preset and
 * derived values carry no position, so default styles remain silent.
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
            context: "high-contrast color against the canvas" + suffix,
            ratio,
            threshold: TEXT_CONTRAST_THRESHOLD,
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
        // Match the renderer: an unspecified opacity paints at the style
        // default (0.7), not fully opaque, so check contrast at that opacity or
        // a real low-opacity failure would be missed.
        const lineOpacity =
            getStyleValueNumber(styleDef, "lineOpacity") ??
            DEFAULT_STYLE_VALUES.lineOpacity;
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
        // Match the renderer: an unspecified opacity paints at the style
        // default (0.7), not fully opaque (see line-opacity note above).
        const markerOpacity =
            getStyleValueNumber(styleDef, "markerOpacity") ??
            DEFAULT_STYLE_VALUES.markerOpacity;
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
            position: diagnosticPosition,
        });
    }

    return diagnostics;
}

/**
 * Flags a *derived* dark-mode text/background combination that ends up
 * inaccessible.
 *
 * The dark-mode text and background colors are inverted independently, so the
 * derivation is order-independent — but that means an accessible light-mode
 * pair can occasionally invert to a sub-AA dark-mode pair (most often for
 * strongly-colored pairs). When that happens, we surface a diagnostic anchored
 * to the authored light-mode colors so the author can pin explicit
 * `textColorDarkMode` / `backgroundColorDarkMode` values.
 *
 * Only *derived* dark colors (no source position) are checked here; an
 * author-supplied `*ColorDarkMode` is handled by the per-channel dark-mode pass.
 */
function derivedDarkModeCombinationDiagnostics(
    styleNumber: string,
    styleDef: StyleDefinition,
): AccessibilityRecord[] {
    const textLight = getStyleValueString(styleDef, "textColor");
    const backgroundLight = getStyleValueString(styleDef, "backgroundColor");
    const textDark = getStyleValueString(styleDef, "textColorDarkMode");
    const backgroundDark = getStyleValueString(
        styleDef,
        "backgroundColorDarkMode",
    );

    if (!textLight || !backgroundLight || !textDark || !backgroundDark) {
        return [];
    }

    // Author-supplied dark colors are covered by the per-channel dark-mode pass.
    if (
        styleDef.textColorDarkMode?.position ||
        styleDef.backgroundColorDarkMode?.position
    ) {
        return [];
    }

    const lightRatio = compositedContrastRatio({
        foreground: textLight,
        canvas: CANVAS_LIGHT_MODE_COLOR,
        background: backgroundLight,
    });
    const darkRatio = compositedContrastRatio({
        foreground: textDark,
        canvas: CANVAS_DARK_MODE_COLOR,
        background: backgroundDark,
    });

    // Only a problem when an accessible light pair derives to an inaccessible
    // dark pair; an intentionally low-contrast light pair (already flagged in
    // light mode) is allowed to stay low-contrast in dark mode.
    if (
        lightRatio === null ||
        darkRatio === null ||
        lightRatio < TEXT_CONTRAST_THRESHOLD ||
        darkRatio >= TEXT_CONTRAST_THRESHOLD
    ) {
        return [];
    }

    const textPosition = styleDef.textColor?.position;
    const backgroundPosition = styleDef.backgroundColor?.position;
    const position = latestPosition(textPosition, backgroundPosition);
    if (!position) {
        return [];
    }

    // The diagnostic squiggle sits under whichever color the anchor position
    // belongs to (the later-authored one; ties resolve to backgroundColor,
    // matching `latestPosition`'s argument order). Recommend a fix for *that*
    // attribute's dark-mode override first, falling back to the other channel
    // when adjusting the squiggled one alone can't reach the threshold.
    const squiggledChannel: "text" | "background" =
        backgroundPosition && position === backgroundPosition
            ? "background"
            : "text";
    const channelsToTry: ("text" | "background")[] =
        squiggledChannel === "background"
            ? ["background", "text"]
            : ["text", "background"];

    let suggestion:
        | { lightAttribute: string; darkAttribute: string; darkColor: string }
        | undefined;
    for (const channel of channelsToTry) {
        const color = suggestAccessibleDarkModeColorAgainst({
            startColor: channel === "text" ? textDark : backgroundDark,
            partnerColor: channel === "text" ? backgroundDark : textDark,
            channelRole: channel,
            threshold: TEXT_CONTRAST_THRESHOLD,
        });
        if (color) {
            suggestion = {
                lightAttribute:
                    channel === "text" ? "textColor" : "backgroundColor",
                darkAttribute:
                    channel === "text"
                        ? "textColorDarkMode"
                        : "backgroundColorDarkMode",
                darkColor: color,
            };
            break;
        }
    }

    const baseMessage = `Although style definition ${styleNumber} has specified colors that provide sufficient contrast for light mode, the dark-mode colors derived from these values have insufficient contrast for the text color against the background color (${formatRatio(darkRatio)}:1; requires at least ${TEXT_CONTRAST_THRESHOLD}:1).`;
    let fixMessage: string;
    if (suggestion) {
        // The dark color is derived from the light color by inverting its
        // lightness, and that inversion is its own inverse — so a light value
        // that derives to the accessible dark color is just the inverted dark
        // color. Offering both lets the author keep their dark color and fix the
        // light contrast, or keep their light color and override the dark one.
        const lightColor = invertLightness(suggestion.darkColor);
        fixMessage = ` To ensure sufficient contrast in dark mode, either increase the light-mode contrast (e.g., set ${suggestion.lightAttribute}="${lightColor}") or override the dark-mode color (e.g., set ${suggestion.darkAttribute}="${suggestion.darkColor}").`;
    } else {
        fixMessage = ` To ensure sufficient contrast in dark mode, increase the light-mode contrast or override the derived colors with textColorDarkMode and/or backgroundColorDarkMode.`;
    }

    return [
        {
            type: "accessibility",
            level: 1,
            message: baseMessage + fixMessage,
            position,
        },
    ];
}

/**
 * Flags a derived dark-mode text color that is readable on the light canvas but
 * becomes unreadable on the dark canvas when no authored background participates.
 *
 * Text/background pairs are checked by
 * {@link derivedDarkModeCombinationDiagnostics}; this covers the text-only case
 * where the canvas itself is the contrast partner. Author-supplied
 * `textColorDarkMode` values are handled by the per-channel dark-mode pass.
 */
function derivedDarkModeTextCanvasDiagnostics(
    styleNumber: string,
    styleDef: StyleDefinition,
): AccessibilityRecord[] {
    const textLight = getStyleValueString(styleDef, "textColor");
    const textDark = getStyleValueString(styleDef, "textColorDarkMode");

    if (
        !textLight ||
        !textDark ||
        getStyleValueString(styleDef, "backgroundColor") ||
        getStyleValueString(styleDef, "backgroundColorDarkMode") ||
        styleDef.textColorDarkMode?.position
    ) {
        return [];
    }

    const position = styleDef.textColor?.position;
    if (!position) {
        return [];
    }

    const lightRatio = compositedContrastRatio({
        foreground: textLight,
        canvas: CANVAS_LIGHT_MODE_COLOR,
    });
    const darkRatio = compositedContrastRatio({
        foreground: textDark,
        canvas: CANVAS_DARK_MODE_COLOR,
    });

    if (
        lightRatio === null ||
        darkRatio === null ||
        lightRatio < TEXT_CONTRAST_THRESHOLD ||
        darkRatio >= TEXT_CONTRAST_THRESHOLD
    ) {
        return [];
    }

    const suggestedDark = deriveAccessibleDarkModeColor({
        lightColor: textDark,
        threshold: TEXT_CONTRAST_THRESHOLD,
    });
    const suggestedDarkRatio = compositedContrastRatio({
        foreground: suggestedDark,
        canvas: CANVAS_DARK_MODE_COLOR,
    });
    const fixMessage =
        suggestedDarkRatio !== null &&
        suggestedDarkRatio >= TEXT_CONTRAST_THRESHOLD
            ? ` To ensure sufficient contrast in dark mode, either increase the light-mode contrast (e.g., set textColor="${invertLightness(suggestedDark)}") or override the dark-mode color (e.g., set textColorDarkMode="${suggestedDark}").`
            : ` To ensure sufficient contrast in dark mode, increase the light-mode contrast or override the derived color with textColorDarkMode.`;

    return [
        {
            type: "accessibility",
            level: 1,
            message: `Although style definition ${styleNumber} has a specified text color that provides sufficient contrast for light mode, the dark-mode text color derived from this value has insufficient contrast against the canvas (${formatRatio(darkRatio)}:1; requires at least ${TEXT_CONTRAST_THRESHOLD}:1).${fixMessage}`,
            position,
        },
    ];
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
        ...derivedDarkModeCombinationDiagnostics(styleNumber, styleDef),
        ...derivedDarkModeTextCanvasDiagnostics(styleNumber, styleDef),
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
