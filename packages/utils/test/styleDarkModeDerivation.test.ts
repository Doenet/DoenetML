import { describe, expect, it } from "vitest";
import { colord } from "colord";
import {
    addMissingChildStyleColorFields,
    normalizeStyleDefinitionValues,
    getStyleValueString,
    GRAPHIC_CONTRAST_THRESHOLD,
    TEXT_CONTRAST_THRESHOLD,
    CANVAS_DARK_MODE_COLOR,
    CANVAS_LIGHT_MODE_COLOR,
    compositedContrastRatio,
} from "../src/style";

describe("addMissingChildStyleColorFields dark-mode derivation", () => {
    it("derives an accessible dark-mode line color when only lineColor is authored", () => {
        const styleDef = normalizeStyleDefinitionValues({
            lineColor: "black",
            lineOpacity: 0.7,
        });
        addMissingChildStyleColorFields(styleDef);

        const dark = getStyleValueString(styleDef, "lineColorDarkMode");
        expect(dark).toBeDefined();
        // The derived dark line color must clear the graphic threshold at the
        // authored opacity against the dark canvas.
        const ratio = compositedContrastRatio({
            foreground: dark!,
            canvas: CANVAS_DARK_MODE_COLOR,
            opacityMultiplier: 0.7,
        });
        expect(ratio).not.toBeNull();
        expect(ratio!).toBeGreaterThanOrEqual(GRAPHIC_CONTRAST_THRESHOLD);

        // A dark-mode word should be derived from the *derived* dark color.
        const darkWord = getStyleValueString(styleDef, "lineColorWordDarkMode");
        expect(darkWord).toBeTruthy();
    });

    it("derives an accessible dark-mode text color (text threshold)", () => {
        const styleDef = normalizeStyleDefinitionValues({ textColor: "black" });
        addMissingChildStyleColorFields(styleDef);

        const dark = getStyleValueString(styleDef, "textColorDarkMode");
        const ratio = compositedContrastRatio({
            foreground: dark!,
            canvas: CANVAS_DARK_MODE_COLOR,
        });
        expect(ratio!).toBeGreaterThanOrEqual(TEXT_CONTRAST_THRESHOLD);
    });

    it("does not overwrite an authored dark-mode color", () => {
        const styleDef = normalizeStyleDefinitionValues({
            lineColor: "black",
            lineColorDarkMode: "#abcdef",
        });
        addMissingChildStyleColorFields(styleDef);

        expect(getStyleValueString(styleDef, "lineColorDarkMode")).toBe(
            "#abcdef",
        );
    });

    it("derives the dark-mode word from an authored dark-mode color", () => {
        const styleDef = normalizeStyleDefinitionValues({
            lineColor: "black",
            lineColorDarkMode: "white",
        });
        addMissingChildStyleColorFields(styleDef);

        expect(getStyleValueString(styleDef, "lineColorWordDarkMode")).toBe(
            "white",
        );
    });

    it("leaves a bright accent color unchanged in dark mode", () => {
        const styleDef = normalizeStyleDefinitionValues({
            lineColor: "#648FFF",
            lineOpacity: 0.7,
        });
        addMissingChildStyleColorFields(styleDef);

        expect(getStyleValueString(styleDef, "lineColorDarkMode")).toBe(
            "#648FFF",
        );
    });

    it("derives the dark text and background independently of order/locality", () => {
        // The dark-mode text and background are each derived only from their own
        // light-mode value, so specifying them together vs. in separate blocks
        // (e.g. background in a parent, text in a child) yields the same result,
        // and changing only one never changes the other.
        const textColor = "navy";
        const backgroundColor = "#ffeeee";

        const combined = normalizeStyleDefinitionValues({
            textColor,
            backgroundColor,
        });
        addMissingChildStyleColorFields(combined);

        // Simulate the split case: each color authored in its own block.
        const textOnly = normalizeStyleDefinitionValues({ textColor });
        addMissingChildStyleColorFields(textOnly);
        const backgroundOnly = normalizeStyleDefinitionValues({
            backgroundColor,
        });
        addMissingChildStyleColorFields(backgroundOnly);

        expect(getStyleValueString(textOnly, "textColorDarkMode")).toBe(
            getStyleValueString(combined, "textColorDarkMode"),
        );
        expect(
            getStyleValueString(backgroundOnly, "backgroundColorDarkMode"),
        ).toBe(getStyleValueString(combined, "backgroundColorDarkMode"));
    });

    it("inverts an authored text/background combination for dark mode", () => {
        // white text on black background should become black text on white
        // background in dark mode (the lightness is inverted, not merely darkened).
        const styleDef = normalizeStyleDefinitionValues({
            backgroundColor: "black",
            textColor: "white",
        });
        addMissingChildStyleColorFields(styleDef);

        expect(
            colord(
                getStyleValueString(styleDef, "backgroundColorDarkMode")!,
            ).isLight(),
        ).toBe(true);
        expect(
            colord(
                getStyleValueString(styleDef, "textColorDarkMode")!,
            ).isDark(),
        ).toBe(true);
    });

    it("preserves an intentionally low-contrast pair instead of fixing it", () => {
        // A light pair that is below WCAG AA on purpose should derive to a dark
        // pair that is similarly low-contrast (at least as high as the light
        // pair), not forced up to AA.
        const pair = { textColor: "#888888", backgroundColor: "#999999" };
        const lightRatio = compositedContrastRatio({
            foreground: pair.textColor,
            canvas: CANVAS_LIGHT_MODE_COLOR,
            background: pair.backgroundColor,
        })!;
        expect(lightRatio).toBeLessThan(TEXT_CONTRAST_THRESHOLD);

        const styleDef = normalizeStyleDefinitionValues(pair);
        addMissingChildStyleColorFields(styleDef);
        const darkRatio = compositedContrastRatio({
            foreground: getStyleValueString(styleDef, "textColorDarkMode")!,
            canvas: CANVAS_DARK_MODE_COLOR,
            background: getStyleValueString(
                styleDef,
                "backgroundColorDarkMode",
            )!,
        })!;

        // At least as high as light, but not "fixed" up to AA.
        expect(darkRatio).toBeGreaterThanOrEqual(lightRatio);
        expect(darkRatio).toBeLessThan(TEXT_CONTRAST_THRESHOLD);
    });
});
