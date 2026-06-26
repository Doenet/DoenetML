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
describe("preset palette light-mode accessibility", () => {
    const presets = returnDefaultStyleDefinitions();

    for (const styleNumber of Object.keys(presets)) {
        const styleDef = presets[styleNumber];

        it(`style ${styleNumber} line/marker meet the graphic threshold in light mode`, () => {
            const lineOpacity =
                getStyleValueNumber(styleDef, "lineOpacity") ?? 1;
            const markerOpacity =
                getStyleValueNumber(styleDef, "markerOpacity") ?? 1;

            for (const [colorKey, opacity] of [
                ["lineColor", lineOpacity],
                ["markerColor", markerOpacity],
            ] as const) {
                const light = getStyleValueString(styleDef, colorKey)!;
                const lightRatio = compositedContrastRatio({
                    foreground: light,
                    canvas: CANVAS_LIGHT_MODE_COLOR,
                    opacityMultiplier: opacity,
                })!;
                expect(
                    lightRatio,
                    `style ${styleNumber} ${colorKey}`,
                ).toBeGreaterThanOrEqual(GRAPHIC_CONTRAST_THRESHOLD);
            }
        });

        it(`style ${styleNumber} text/highContrast meet the text threshold in light mode`, () => {
            for (const colorKey of [
                "textColor",
                "highContrastColor",
            ] as const) {
                const light = getStyleValueString(styleDef, colorKey)!;
                const lightRatio = compositedContrastRatio({
                    foreground: light,
                    canvas: CANVAS_LIGHT_MODE_COLOR,
                })!;
                expect(
                    lightRatio,
                    `style ${styleNumber} ${colorKey}`,
                ).toBeGreaterThanOrEqual(TEXT_CONTRAST_THRESHOLD);
            }
        });
    }
});

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
