import { describe, expect, it } from "vitest";
import {
    DEFAULT_PALETTE_NAME,
    STYLE_PALETTES,
    STYLE_PALETTE_NAMES,
    colorValueToWord,
    cycleStyleNumberForPalette,
    expandStylePalette,
    getStyleValueNumber,
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

    it("every palette is keyed by the lower-cased form of its name, has a description, and styles numbered contiguously from 1", () => {
        for (const [key, palette] of Object.entries(STYLE_PALETTES)) {
            // `name` is the canonical camelCase spelling; the registry keys by
            // its lower-cased form (see `registerByKey` in ./palettes/index.ts).
            expect(palette.name.toLowerCase()).toBe(key);
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
        expect(Object.isFrozen(STYLE_PALETTE_NAMES)).toBe(true);
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

describe("style 1's neutral text color overrides palette data", () => {
    // `paletteColorDistinctness.test.ts` checks that every *registered*
    // palette ends up with neutral style-1 text, but no built-in palette
    // authors those keys, so that check cannot tell "force" apart from
    // "fill in when missing". A palette that paints style 1's text is
    // exactly the case the rule exists to defuse — content with no
    // `styleNumber` lands on style 1, so the authored color would recolor
    // every unstyled `<text>` and `<m>` in the document.
    const paintedTextPalette: StylePalette = {
        name: "testPaintedText",
        description: "Palette that paints style 1's text, for expansion tests.",
        styles: {
            1: {
                lineColor: "#D4042D",
                textColor: "#D4042D",
                textColorWord: "crimson",
                textColorDarkMode: "#F1466A",
                textColorWordDarkMode: "crimson",
                highContrastColor: "#D4042D",
            },
            2: {
                lineColor: "#1f5dff",
                textColor: "#1f5dff",
                textColorWord: "azure",
            },
        },
    };

    it("replaces authored style-1 text colors and re-derives their words", () => {
        const expanded = expandStylePalette(paintedTextPalette);

        expect(getStyleValueString(expanded[1], "textColor")).toBe("black");
        expect(getStyleValueString(expanded[1], "textColorDarkMode")).toBe(
            "white",
        );
        // The authored words described the discarded colors, so they must be
        // discarded too rather than left describing a color nothing uses.
        expect(getStyleValueString(expanded[1], "textColorWord")).toBe(
            colorValueToWord("black"),
        );
        expect(getStyleValueString(expanded[1], "textColorWordDarkMode")).toBe(
            colorValueToWord("white"),
        );
        // Style 1 keeps its own color on every other key.
        expect(getStyleValueString(expanded[1], "lineColor")).toBe("#D4042D");
        expect(getStyleValueString(expanded[1], "highContrastColor")).toBe(
            "#D4042D",
        );
    });

    it("leaves styles other than 1 painting their own text", () => {
        const expanded = expandStylePalette(paintedTextPalette);

        expect(getStyleValueString(expanded[2], "textColor")).toBe("#1f5dff");
        expect(getStyleValueString(expanded[2], "textColorWord")).toBe("azure");
    });
});

describe("palette graphics are opaque unless the palette says otherwise", () => {
    // A palette's colors are verified against the graphic threshold at the
    // opacity they render with. Inheriting the 0.7 default would blend a
    // color verified at full strength 70% into the canvas and drop it below
    // 3:1, so expansion states full opacity.
    const opacityPalette: StylePalette = {
        name: "testOpacity",
        description: "Palette exercising the opacity rule.",
        styles: {
            1: { lineColor: "#D4042D", markerColor: "#D4042D" },
            2: {
                lineColor: "#1f5dff",
                markerColor: "#1f5dff",
                lineOpacity: 0.7,
                markerOpacity: 0.5,
            },
        },
    };

    it("fills unstated line and marker opacities with 1", () => {
        const expanded = expandStylePalette(opacityPalette);
        expect(getStyleValueNumber(expanded[1], "lineOpacity")).toBe(1);
        expect(getStyleValueNumber(expanded[1], "markerOpacity")).toBe(1);
    });

    it("never overwrites an opacity the palette states", () => {
        const expanded = expandStylePalette(opacityPalette);
        expect(getStyleValueNumber(expanded[2], "lineOpacity")).toBe(0.7);
        expect(getStyleValueNumber(expanded[2], "markerOpacity")).toBe(0.5);
    });

    it("leaves the default palette's own 0.7 opacities alone", () => {
        const expanded = returnPaletteStyleDefinitions(DEFAULT_PALETTE_NAME);
        expect(getStyleValueNumber(expanded[1], "lineOpacity")).toBe(0.7);
        expect(getStyleValueNumber(expanded[5], "lineOpacity")).toBe(1);
    });
});

describe("dark-mode high contrast follows dark-mode text", () => {
    // `highContrastColor` is a style's own color at text strength, which is
    // what `textColor` is too — so when a palette gives them one light-mode
    // value, they must not split apart in dark mode. Deriving the dark
    // high-contrast color from the light one instead would ignore the
    // brighter dark anchor the palette pinned for its text: a style that is
    // white in dark mode reported the derivation's mid-gray floor, and a
    // style that is bright yellow reported a dark olive.
    const pairedPalette: StylePalette = {
        name: "testPaired",
        description: "Palette exercising the dark high-contrast pairing.",
        styles: {
            1: { lineColor: "#000000" },
            2: {
                lineColor: "#000000",
                textColor: "#000000",
                highContrastColor: "#000000",
                textColorDarkMode: "#ffffff",
            },
            3: {
                lineColor: "#000000",
                textColor: "#000000",
                highContrastColor: "#000000",
                textColorDarkMode: "#ffffff",
                highContrastColorDarkMode: "#cccccc",
            },
            4: {
                lineColor: "#000000",
                textColor: "#000000",
                // A style whose high-contrast color is deliberately its own,
                // distinct from its text color, keeps deriving on its own.
                highContrastColor: "#5a5513",
                textColorDarkMode: "#ffffff",
            },
        },
    };

    it("gives an unstated dark high-contrast color the dark text color", () => {
        const expanded = expandStylePalette(pairedPalette);
        expect(
            getStyleValueString(expanded[2], "highContrastColorDarkMode"),
        ).toBe("#ffffff");
    });

    it("never overwrites a dark high-contrast color the palette states", () => {
        const expanded = expandStylePalette(pairedPalette);
        expect(
            getStyleValueString(expanded[3], "highContrastColorDarkMode"),
        ).toBe("#cccccc");
    });

    it("leaves a style whose high-contrast color differs in light mode to derive", () => {
        const expanded = expandStylePalette(pairedPalette);
        const derived = getStyleValueString(
            expanded[4],
            "highContrastColorDarkMode",
        );
        expect(derived).toBeTruthy();
        expect(derived).not.toBe("#ffffff");
    });

    it("does not apply to style 1, whose text color is not the style's own", () => {
        // `applyNeutralTextColor` has already replaced style 1's text color
        // with the canvas text color, so pairing off it would paint style 1's
        // high contrast white regardless of the style's actual color.
        const expanded = expandStylePalette(pairedPalette);
        expect(
            getStyleValueString(expanded[1], "highContrastColorDarkMode"),
        ).not.toBe("white");
    });
});

describe("cycleStyleNumberForPalette", () => {
    // okabeito has 8 styles.
    it("returns in-range numbers unchanged, including the palette-size boundary", () => {
        expect(cycleStyleNumberForPalette(1, "okabeito")).toBe(1);
        expect(cycleStyleNumberForPalette(8, "okabeito")).toBe(8);
    });

    it("cycles numbers beyond the palette size onto the palette", () => {
        expect(cycleStyleNumberForPalette(9, "okabeito")).toBe(1);
        expect(cycleStyleNumberForPalette(10, "okabeito")).toBe(2);
        // Exact multiples of the size map to the last style, not 0.
        expect(cycleStyleNumberForPalette(16, "okabeito")).toBe(8);
        expect(cycleStyleNumberForPalette(17, "okabeito")).toBe(1);
    });

    it("uses each palette's own size", () => {
        // default has 6 styles.
        expect(cycleStyleNumberForPalette(10, DEFAULT_PALETTE_NAME)).toBe(4);
    });

    it("returns unexpected inputs unchanged", () => {
        expect(cycleStyleNumberForPalette(10, "noSuchPalette")).toBe(10);
        expect(cycleStyleNumberForPalette(0, "okabeito")).toBe(0);
        expect(cycleStyleNumberForPalette(-3, "okabeito")).toBe(-3);
        expect(cycleStyleNumberForPalette(9.5, "okabeito")).toBe(9.5);
    });
});
