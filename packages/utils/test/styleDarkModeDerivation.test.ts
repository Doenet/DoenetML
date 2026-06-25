import { describe, expect, it } from "vitest";
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import namesPlugin from "colord/plugins/names";
import {
    addMissingChildStyleColorFields,
    normalizeStyleDefinitionValues,
    getStyleValueString,
    GRAPHIC_CONTRAST_THRESHOLD,
    TEXT_CONTRAST_THRESHOLD,
    CANVAS_DARK_MODE_COLOR,
    compositedContrastRatio,
} from "../src/style";

extend([a11yPlugin, namesPlugin]);

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
});
