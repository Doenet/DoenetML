import { describe, expect, it } from "vitest";
import {
    returnDefaultStyleDefinitions,
    getStyleValueString,
    getStyleValueNumber,
    compositedContrastRatio,
    CANVAS_DARK_MODE_COLOR,
    CANVAS_LIGHT_MODE_COLOR,
    GRAPHIC_CONTRAST_THRESHOLD,
    TEXT_CONTRAST_THRESHOLD,
} from "../src/style";

/**
 * Guards that every built-in preset is accessible in both LIGHT and DARK mode,
 * so the palette can never silently regress below WCAG AA.
 *
 * Light-mode failures (styles 1, 3, 6) were fixed alongside adding these
 * assertions (see Doenet/DoenetML#1364). Dark-mode values were fixed in the
 * earlier dark-mode accessibility PR.
 */
function describePresetPaletteAccessibility({
    mode,
    canvas,
    graphicColorKeys,
    textColorKeys,
}: {
    mode: "light" | "dark";
    canvas: string;
    graphicColorKeys: readonly [
        "lineColor" | "lineColorDarkMode",
        "markerColor" | "markerColorDarkMode",
    ];
    textColorKeys: readonly [
        "textColor" | "textColorDarkMode",
        "highContrastColor" | "highContrastColorDarkMode",
    ];
}) {
    describe(`preset palette ${mode}-mode accessibility`, () => {
        const presets = returnDefaultStyleDefinitions();

        for (const styleNumber of Object.keys(presets)) {
            const styleDef = presets[styleNumber];

            it(`style ${styleNumber} line/marker meet the graphic threshold in ${mode} mode`, () => {
                const lineOpacity =
                    getStyleValueNumber(styleDef, "lineOpacity") ?? 1;
                const markerOpacity =
                    getStyleValueNumber(styleDef, "markerOpacity") ?? 1;

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
                        `style ${styleNumber} ${colorKey}`,
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
                        `style ${styleNumber} ${colorKey}`,
                    ).toBeGreaterThanOrEqual(TEXT_CONTRAST_THRESHOLD);
                }
            });
        }
    });
}

describePresetPaletteAccessibility({
    mode: "light",
    canvas: CANVAS_LIGHT_MODE_COLOR,
    graphicColorKeys: ["lineColor", "markerColor"],
    textColorKeys: ["textColor", "highContrastColor"],
});

describePresetPaletteAccessibility({
    mode: "dark",
    canvas: CANVAS_DARK_MODE_COLOR,
    graphicColorKeys: ["lineColorDarkMode", "markerColorDarkMode"],
    textColorKeys: ["textColorDarkMode", "highContrastColorDarkMode"],
});
