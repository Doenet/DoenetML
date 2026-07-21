import { describe, expect, it } from "vitest";
import {
    DEFAULT_PALETTE_NAME,
    STYLE_PALETTES,
    STYLE_PALETTE_NAMES,
    colorValueToWord,
    expandStylePalette,
    getStyleValueString,
    returnDefaultStyleDefinitions,
    returnPaletteStyleDefinitions,
    type StylePalette,
} from "../src/style";

describe("palette registry", () => {
    it("contains the default palette", () => {
        expect(STYLE_PALETTE_NAMES).toContain(DEFAULT_PALETTE_NAME);
        expect(STYLE_PALETTES[DEFAULT_PALETTE_NAME]).toBeDefined();
    });

    it("every palette has a matching name key, a description, and styles numbered contiguously from 1", () => {
        for (const [key, palette] of Object.entries(STYLE_PALETTES)) {
            expect(palette.name).toBe(key);
            expect(palette.description.length).toBeGreaterThan(0);

            const styleNumbers = Object.keys(palette.styles)
                .map(Number)
                .sort((a, b) => a - b);
            expect(styleNumbers.length).toBeGreaterThan(0);
            expect(styleNumbers).toEqual(
                Array.from({ length: styleNumbers.length }, (_, i) => i + 1),
            );
        }
    });

    it("does not expose Object.prototype keys as palettes", () => {
        // Palette names are author-supplied strings; a default-prototype
        // registry would let e.g. "constructor" pass `in`/truthiness checks
        // and shadow the not-registered fallback.
        expect("constructor" in STYLE_PALETTES).toBe(false);
        expect(STYLE_PALETTES["constructor"]).toBeUndefined();
    });

    it("is deeply frozen, so shared registry data cannot be mutated at runtime", () => {
        // The LSP lazily caches the expansion of the default palette, so any
        // runtime mutation of registry data would silently desync the LSP
        // from the runtime; freezing makes such a mutation throw instead.
        expect(Object.isFrozen(STYLE_PALETTES)).toBe(true);
        for (const palette of Object.values(STYLE_PALETTES)) {
            expect(Object.isFrozen(palette)).toBe(true);
            expect(Object.isFrozen(palette.styles)).toBe(true);
            for (const styleDef of Object.values(palette.styles)) {
                expect(Object.isFrozen(styleDef)).toBe(true);
            }
        }
    });
});

describe("default palette expansion", () => {
    it("matches returnDefaultStyleDefinitions and preserves the historical preset values", () => {
        const expanded = returnPaletteStyleDefinitions(DEFAULT_PALETTE_NAME);
        // Delegation guard: returnDefaultStyleDefinitions must stay wired to
        // the "default" palette. (It expands that palette itself, so the
        // historical values are pinned by the spot-checks below, not by this
        // comparison.)
        expect(expanded).toEqual(returnDefaultStyleDefinitions());

        expect(Object.keys(expanded).sort()).toEqual([
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
        ]);

        // Spot-check historical values, including authored empty words and
        // authored dark-mode colors that derivation must not overwrite.
        expect(getStyleValueString(expanded[1], "lineColor")).toBe("#1f5dff");
        expect(getStyleValueString(expanded[1], "lineWidthWord")).toBe("thick");
        expect(getStyleValueString(expanded[2], "lineColor")).toBe("#D4042D");
        expect(getStyleValueString(expanded[2], "lineColorDarkMode")).toBe(
            "#F1466A",
        );
        expect(getStyleValueString(expanded[2], "textColorDarkMode")).toBe(
            "#FF7A7A",
        );
        expect(getStyleValueString(expanded[2], "lineWidthWord")).toBe("");
        expect(getStyleValueString(expanded[2], "markerStyleWord")).toBe(
            "square",
        );
        expect(getStyleValueString(expanded[6], "lineStyleWord")).toBe(
            "dotted",
        );

        // Color words are enriched from the color values.
        for (const styleNumber of Object.keys(expanded)) {
            const lineColor = getStyleValueString(
                expanded[styleNumber],
                "lineColor",
            )!;
            expect(
                getStyleValueString(expanded[styleNumber], "lineColorWord"),
            ).toBe(colorValueToWord(lineColor));
        }
    });

    it("returns a fresh, independent map on every call and never mutates palette data", () => {
        const first = returnPaletteStyleDefinitions(DEFAULT_PALETTE_NAME);
        const second = returnPaletteStyleDefinitions(DEFAULT_PALETTE_NAME);

        expect(first).not.toBe(second);
        expect(first[1]).not.toBe(second[1]);

        first[1].lineColor = { style: "hotpink" };
        expect(getStyleValueString(second[1], "lineColor")).toBe("#1f5dff");
        expect(
            getStyleValueString(
                returnPaletteStyleDefinitions(DEFAULT_PALETTE_NAME)[1],
                "lineColor",
            ),
        ).toBe("#1f5dff");
        expect(STYLE_PALETTES[DEFAULT_PALETTE_NAME].styles[1].lineColor).toBe(
            "#1f5dff",
        );
    });

    it("falls back to the default palette for an unknown name", () => {
        const defaultExpansion =
            returnPaletteStyleDefinitions(DEFAULT_PALETTE_NAME);
        expect(returnPaletteStyleDefinitions("noSuchPalette")).toEqual(
            defaultExpansion,
        );
        // Object.prototype keys must also hit the fallback, not resolve to
        // inherited junk that expands to an empty style map.
        expect(returnPaletteStyleDefinitions("constructor")).toEqual(
            defaultExpansion,
        );
    });
});

describe("compact palette expansion", () => {
    const compactPalette: StylePalette = {
        name: "testCompact",
        description: "Compact palette for expansion tests.",
        styles: {
            1: {
                lineColor: "#D4042D",
                markerColor: "#D4042D",
                fillColor: "#D4042D",
                lineWidth: 4,
                lineStyle: "dashed",
                markerStyle: "circle",
            },
            2: {
                lineColor: "#1f5dff",
                lineColorDarkMode: "#648FFF",
            },
        },
    };

    it("derives missing dark-mode colors and preserves authored ones", () => {
        const expanded = expandStylePalette(compactPalette);

        expect(
            getStyleValueString(expanded[1], "lineColorDarkMode"),
        ).toBeTruthy();
        expect(
            getStyleValueString(expanded[1], "markerColorDarkMode"),
        ).toBeTruthy();
        expect(
            getStyleValueString(expanded[1], "fillColorDarkMode"),
        ).toBeTruthy();
        expect(getStyleValueString(expanded[2], "lineColorDarkMode")).toBe(
            "#648FFF",
        );
    });

    it("derives color and style words so descriptions stay truthful", () => {
        const expanded = expandStylePalette(compactPalette);

        expect(getStyleValueString(expanded[1], "lineColorWord")).toBe(
            colorValueToWord("#D4042D"),
        );
        const darkColor = getStyleValueString(
            expanded[1],
            "lineColorDarkMode",
        )!;
        expect(getStyleValueString(expanded[1], "lineColorWordDarkMode")).toBe(
            colorValueToWord(darkColor),
        );
        expect(getStyleValueString(expanded[1], "lineWidthWord")).toBe("thick");
        expect(getStyleValueString(expanded[1], "lineStyleWord")).toBe(
            "dashed",
        );
        expect(getStyleValueString(expanded[1], "markerStyleWord")).toBe(
            "point",
        );
    });

    it("wraps expanded values without source positions so diagnostics stay silent on palette data", () => {
        const expanded = expandStylePalette(compactPalette);

        for (const styleDef of Object.values(expanded)) {
            for (const value of Object.values(styleDef)) {
                expect(value.position).toBeUndefined();
            }
        }
    });

    it("does not mutate the palette's raw style data during expansion", () => {
        expandStylePalette(compactPalette);
        expect(compactPalette.styles[1].lineColorDarkMode).toBeUndefined();
        expect(compactPalette.styles[1].lineColorWord).toBeUndefined();
    });
});
