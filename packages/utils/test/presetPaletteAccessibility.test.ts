import { describe, expect, it } from "vitest";
import {
    returnDefaultStyleDefinitions,
    getStyleValueString,
    getStyleValueNumber,
    compositedContrastRatio,
    CANVAS_DARK_MODE_COLOR,
    GRAPHIC_CONTRAST_THRESHOLD,
    TEXT_CONTRAST_THRESHOLD,
} from "../src/style";

/**
 * Guards that every built-in preset is accessible in DARK mode, so the
 * recomputed dark-mode palette can never silently regress below WCAG AA.
 *
 * (Light-mode preset values are pre-existing and intentionally left as-is here:
 * several presets — including the default blue line color — sit below 3:1 in
 * light mode, but fixing them changes Doenet's default palette and is tracked
 * separately in Doenet/DoenetML#1364. This guard covers the dark-mode values,
 * which were (re)computed by the dark-mode work.)
 */
describe("preset palette dark-mode accessibility", () => {
    const presets = returnDefaultStyleDefinitions();

    for (const styleNumber of Object.keys(presets)) {
        const styleDef = presets[styleNumber];

        it(`style ${styleNumber} line/marker meet the graphic threshold in dark mode`, () => {
            const lineOpacity =
                getStyleValueNumber(styleDef, "lineOpacity") ?? 1;
            const markerOpacity =
                getStyleValueNumber(styleDef, "markerOpacity") ?? 1;

            for (const [colorKey, opacity] of [
                ["lineColorDarkMode", lineOpacity],
                ["markerColorDarkMode", markerOpacity],
            ] as const) {
                const dark = getStyleValueString(styleDef, colorKey)!;
                const darkRatio = compositedContrastRatio({
                    foreground: dark,
                    canvas: CANVAS_DARK_MODE_COLOR,
                    opacityMultiplier: opacity,
                })!;
                expect(
                    darkRatio,
                    `style ${styleNumber} ${colorKey}`,
                ).toBeGreaterThanOrEqual(GRAPHIC_CONTRAST_THRESHOLD);
            }
        });

        it(`style ${styleNumber} text/highContrast meet the text threshold in dark mode`, () => {
            for (const colorKey of [
                "textColorDarkMode",
                "highContrastColorDarkMode",
            ] as const) {
                const dark = getStyleValueString(styleDef, colorKey)!;
                const darkRatio = compositedContrastRatio({
                    foreground: dark,
                    canvas: CANVAS_DARK_MODE_COLOR,
                })!;
                expect(
                    darkRatio,
                    `style ${styleNumber} ${colorKey}`,
                ).toBeGreaterThanOrEqual(TEXT_CONTRAST_THRESHOLD);
            }
        });
    }
});
