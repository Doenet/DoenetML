import { describe, expect, it } from "vitest";
import {
    DEFAULT_PALETTE_NAME,
    STYLE_PALETTE_NAMES,
    getStylePalette,
    getStylePalettes,
} from "../src/style";

describe("getStylePalettes", () => {
    it("describes every registered palette, in registration order", () => {
        const palettes = getStylePalettes();
        // `name` is the canonical camelCase spelling; the registry keys
        // (`STYLE_PALETTE_NAMES`) are its lower-cased form, so compare
        // case-insensitively to check both correspondence and order.
        expect(palettes.map((p) => p.name.toLowerCase())).toEqual([
            ...STYLE_PALETTE_NAMES,
        ]);
        expect(palettes[0].name.toLowerCase()).toBe(DEFAULT_PALETTE_NAME);
    });

    it("gives every palette a description and at least four styles", () => {
        for (const palette of getStylePalettes()) {
            expect(palette.description, palette.name).toBeTruthy();
            const styleNumbers = Object.keys(palette.styles);
            expect(styleNumbers.length, palette.name).toBeGreaterThanOrEqual(4);
            // contiguous from 1
            expect(styleNumbers, palette.name).toEqual(
                styleNumbers.map((_, i) => String(i + 1)),
            );
        }
    });

    it("resolves swatch-ready values for both themes", () => {
        const grayscale = getStylePalette("grayscale")!;
        expect(grayscale.styles["1"].lineColor).toBe("#000000");
        expect(grayscale.styles["1"].lineColorDarkMode).toBe("#ffffff");
        // Non-color distinctions are present too.
        expect(grayscale.styles["1"].markerStyle).toBe("circle");
        expect(grayscale.styles["1"].lineWidth).toBe(4);
        // Curated words for accessible swatch labels.
        expect(grayscale.styles["1"].lineColorWord).toBe("black");
        expect(grayscale.styles["1"].lineColorWordDarkMode).toBe("white");
    });

    it("populates every documented key for every style of every palette", () => {
        const keys = Object.keys(
            getStylePalette(DEFAULT_PALETTE_NAME)!.styles["1"],
        );
        expect(keys.length).toBeGreaterThan(30);
        for (const palette of getStylePalettes()) {
            for (const [styleNumber, styleDef] of Object.entries(
                palette.styles,
            )) {
                expect(
                    Object.keys(styleDef),
                    `${palette.name} style ${styleNumber}`,
                ).toEqual(keys);
                for (const colorKey of [
                    "lineColor",
                    "markerColor",
                    "fillColor",
                    "textColor",
                    "lineColorDarkMode",
                    "markerColorDarkMode",
                    "fillColorDarkMode",
                    "textColorDarkMode",
                ] as const) {
                    expect(
                        styleDef[colorKey],
                        `${palette.name} style ${styleNumber} ${colorKey}`,
                    ).toBeTruthy();
                }
            }
        }
    });

    it("matches palette names case-insensitively and rejects unknown ones", () => {
        // Lookup is case-insensitive, but the returned `name` is always the
        // canonical camelCase spelling.
        expect(getStylePalette("  OkabeIto ")?.name).toBe("okabeIto");
        expect(getStylePalette("not-a-palette")).toBeNull();
        expect(getStylePalette("constructor")).toBeNull();
        expect(getStylePalette(undefined as any)).toBeNull();
    });

    it("returns plain JSON that callers may mutate freely", () => {
        const first = getStylePalettes();
        expect(JSON.parse(JSON.stringify(first))).toEqual(first);

        first[0].styles["1"].lineColor = "#ffffff";
        first[0].name = "clobbered";
        const second = getStylePalettes();
        expect(second[0].name).toBe(DEFAULT_PALETTE_NAME);
        expect(second[0].styles["1"].lineColor).not.toBe("#ffffff");
    });
});
