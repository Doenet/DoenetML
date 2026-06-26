import { describe, expect, it } from "vitest";
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";

import {
    CANVAS_DARK_MODE_COLOR,
    GRAPHIC_CONTRAST_THRESHOLD,
    TEXT_CONTRAST_THRESHOLD,
    compositedContrastRatio,
    deriveAccessibleDarkModeBackground,
    deriveAccessibleDarkModeColor,
    suggestAccessibleDarkModeColorAgainst,
} from "../src/style/colorAccessibility";

extend([a11yPlugin]);

function contrastVsDarkCanvas(color: string, opacityMultiplier = 1): number {
    const ratio = compositedContrastRatio({
        foreground: color,
        canvas: CANVAS_DARK_MODE_COLOR,
        opacityMultiplier,
    });
    if (ratio === null) {
        throw new Error(`could not compute contrast for ${color}`);
    }
    return ratio;
}

describe("compositedContrastRatio", () => {
    it("returns a high ratio for white on the dark canvas", () => {
        const ratio = compositedContrastRatio({
            foreground: "#ffffff",
            canvas: CANVAS_DARK_MODE_COLOR,
        });
        expect(ratio).not.toBeNull();
        expect(ratio!).toBeGreaterThan(15);
    });

    it("returns ~1 for the canvas color against itself", () => {
        const ratio = compositedContrastRatio({
            foreground: CANVAS_DARK_MODE_COLOR,
            canvas: CANVAS_DARK_MODE_COLOR,
        });
        expect(ratio).toBeCloseTo(1, 1);
    });

    it("lowers effective contrast as opacity drops", () => {
        const opaque = contrastVsDarkCanvas("#ffffff", 1);
        const translucent = contrastVsDarkCanvas("#ffffff", 0.3);
        expect(translucent).toBeLessThan(opaque);
    });

    it("returns null for unparseable colors", () => {
        expect(
            compositedContrastRatio({
                foreground: "definitely-not-a-color",
                canvas: CANVAS_DARK_MODE_COLOR,
            }),
        ).toBeNull();
    });
});

describe("deriveAccessibleDarkModeColor", () => {
    it("lightens a near-black line color until it meets the graphic threshold", () => {
        const derived = deriveAccessibleDarkModeColor({
            lightColor: "black",
            threshold: GRAPHIC_CONTRAST_THRESHOLD,
            opacityMultiplier: 0.7,
        });
        expect(contrastVsDarkCanvas(derived, 0.7)).toBeGreaterThanOrEqual(
            GRAPHIC_CONTRAST_THRESHOLD,
        );
    });

    it("lightens a near-black text color until it meets the text threshold", () => {
        const derived = deriveAccessibleDarkModeColor({
            lightColor: "black",
            threshold: TEXT_CONTRAST_THRESHOLD,
        });
        expect(contrastVsDarkCanvas(derived)).toBeGreaterThanOrEqual(
            TEXT_CONTRAST_THRESHOLD,
        );
    });

    it("preserves a color that already meets the threshold on the dark canvas", () => {
        // #648FFF has ~6:1 contrast against #121212, so it should be untouched.
        const derived = deriveAccessibleDarkModeColor({
            lightColor: "#648FFF",
            threshold: GRAPHIC_CONTRAST_THRESHOLD,
        });
        expect(derived).toBe("#648FFF");
    });

    it("preserves hue while lightening", () => {
        const derived = deriveAccessibleDarkModeColor({
            lightColor: "#7a0000", // dark red
            threshold: TEXT_CONTRAST_THRESHOLD,
        });
        const hue = colord(derived).toHsl().h;
        // Red hue stays near 0 (allow small rounding wrap).
        expect(Math.min(hue, 360 - hue)).toBeLessThan(8);
        expect(contrastVsDarkCanvas(derived)).toBeGreaterThanOrEqual(
            TEXT_CONTRAST_THRESHOLD,
        );
    });

    it("preserves authored alpha while lightening", () => {
        const derived = deriveAccessibleDarkModeColor({
            lightColor: "rgba(0, 0, 0, 0.5)",
            threshold: TEXT_CONTRAST_THRESHOLD,
        });
        expect(colord(derived).toRgb().a).toBeCloseTo(0.5);
        expect(contrastVsDarkCanvas(derived)).toBeGreaterThanOrEqual(
            TEXT_CONTRAST_THRESHOLD,
        );
    });

    it("preserves authored alpha when no lightness can meet the threshold", () => {
        const derived = deriveAccessibleDarkModeColor({
            lightColor: "rgba(0, 0, 0, 0.2)",
            threshold: TEXT_CONTRAST_THRESHOLD,
        });
        expect(colord(derived).toRgb().a).toBeCloseTo(0.2);
        expect(contrastVsDarkCanvas(derived)).toBeLessThan(
            TEXT_CONTRAST_THRESHOLD,
        );
    });

    it("returns the input unchanged when it cannot be parsed", () => {
        expect(
            deriveAccessibleDarkModeColor({
                lightColor: "not-a-color",
                threshold: GRAPHIC_CONTRAST_THRESHOLD,
            }),
        ).toBe("not-a-color");
    });
});

describe("deriveAccessibleDarkModeBackground", () => {
    it("inverts a white background to a dark surface", () => {
        const derived = deriveAccessibleDarkModeBackground("white");
        expect(colord(derived).isDark()).toBe(true);
        // White (lightness 100%) inverts to black (lightness 0%).
        expect(colord(derived).toHsl().l).toBeLessThan(5);
    });

    it("inverts a dark background to a light surface", () => {
        // A near-black background should become near-white in dark mode, so the
        // light-mode figure/ground relationship is preserved (inverted), not the
        // background forced dark.
        const derived = deriveAccessibleDarkModeBackground("#101015");
        expect(colord(derived).isLight()).toBe(true);
        expect(colord(derived).toHsl().l).toBeGreaterThan(90);
    });

    it("preserves hue and saturation while inverting lightness", () => {
        const derived = deriveAccessibleDarkModeBackground("#cc3333");
        const original = colord("#cc3333").toHsl();
        const result = colord(derived).toHsl();
        expect(Math.abs(result.h - original.h)).toBeLessThan(2);
        expect(result.l).toBeCloseTo(100 - original.l, 0);
    });
});

describe("suggestAccessibleDarkModeColorAgainst", () => {
    it("preserves alpha in suggested text colors", () => {
        const suggested = suggestAccessibleDarkModeColorAgainst({
            startColor: "rgba(128, 128, 255, 0.8)",
            partnerColor: "#404040",
            channelRole: "text",
            threshold: TEXT_CONTRAST_THRESHOLD,
        });
        expect(suggested).not.toBeNull();
        expect(colord(suggested!).toRgb().a).toBeCloseTo(0.8);
    });
});
