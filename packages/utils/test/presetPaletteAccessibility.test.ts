import { describe, expect, it } from "vitest";
import {
    STYLE_PALETTE_NAMES,
    returnPaletteStyleDefinitions,
    getStyleValueString,
    getStyleValueNumber,
    compositedContrastRatio,
    DEFAULT_STYLE_VALUES,
    CANVAS_DARK_MODE_COLOR,
    CANVAS_LIGHT_MODE_COLOR,
    GRAPHIC_CONTRAST_THRESHOLD,
    TEXT_CONTRAST_THRESHOLD,
} from "../src/style";

const MODE_CONFIG = {
    light: {
        canvas: CANVAS_LIGHT_MODE_COLOR,
        graphicColorKeys: ["lineColor", "markerColor"] as const,
        textColorKeys: ["textColor", "highContrastColor"] as const,
    },
    dark: {
        canvas: CANVAS_DARK_MODE_COLOR,
        graphicColorKeys: ["lineColorDarkMode", "markerColorDarkMode"] as const,
        textColorKeys: [
            "textColorDarkMode",
            "highContrastColorDarkMode",
        ] as const,
    },
} as const;

/**
 * Guards that every style of every registered palette is accessible in both
 * LIGHT and DARK mode, so no palette can silently regress below WCAG AA.
 * Expanded (derived) dark-mode colors are checked the same as authored ones,
 * so palette authors are pushed to supply explicit dark values whenever the
 * derivation isn't good enough.
 *
 * Light-mode failures in the default palette (styles 1, 3, 6) were fixed
 * alongside adding these assertions (see Doenet/DoenetML#1364). Dark-mode
 * values were fixed in the earlier dark-mode accessibility PR.
 */
function describePaletteAccessibility(
    paletteName: string,
    mode: "light" | "dark",
) {
    const { canvas, graphicColorKeys, textColorKeys } = MODE_CONFIG[mode];

    describe(`palette "${paletteName}" ${mode}-mode accessibility`, () => {
        const styles = returnPaletteStyleDefinitions(paletteName);

        for (const styleNumber of Object.keys(styles)) {
            const styleDef = styles[styleNumber];

            it(`style ${styleNumber} line/marker meet the graphic threshold in ${mode} mode`, () => {
                // Fall back the way the renderer does: `selectedStyle` runs
                // through `resolveStyleDefinition`, so a style that states no
                // opacity is drawn at `DEFAULT_STYLE_VALUES`' 0.7, not at 1.
                // Assuming 1 here would check a stronger color than readers
                // actually see (palette expansion states full opacity for
                // exactly this reason — see `applyFullGraphicOpacity`).
                const lineOpacity =
                    getStyleValueNumber(styleDef, "lineOpacity") ??
                    DEFAULT_STYLE_VALUES.lineOpacity;
                const markerOpacity =
                    getStyleValueNumber(styleDef, "markerOpacity") ??
                    DEFAULT_STYLE_VALUES.markerOpacity;

                for (const [colorKey, opacity] of [
                    [graphicColorKeys[0], lineOpacity],
                    [graphicColorKeys[1], markerOpacity],
                ] as const) {
                    const color = getStyleValueString(styleDef, colorKey)!;
                    const contrastRatio = compositedContrastRatio({
                        foreground: color,
                        canvas,
                        opacityMultiplier: opacity,
                    })!;
                    expect(
                        contrastRatio,
                        `palette ${paletteName} style ${styleNumber} ${colorKey}`,
                    ).toBeGreaterThanOrEqual(GRAPHIC_CONTRAST_THRESHOLD);
                }
            });

            it(`style ${styleNumber} text/highContrast meet the text threshold in ${mode} mode`, () => {
                for (const colorKey of textColorKeys) {
                    const color = getStyleValueString(styleDef, colorKey)!;
                    const contrastRatio = compositedContrastRatio({
                        foreground: color,
                        canvas,
                    })!;
                    expect(
                        contrastRatio,
                        `palette ${paletteName} style ${styleNumber} ${colorKey}`,
                    ).toBeGreaterThanOrEqual(TEXT_CONTRAST_THRESHOLD);
                }
            });
        }
    });
}

for (const paletteName of STYLE_PALETTE_NAMES) {
    describePaletteAccessibility(paletteName, "light");
    describePaletteAccessibility(paletteName, "dark");
}
