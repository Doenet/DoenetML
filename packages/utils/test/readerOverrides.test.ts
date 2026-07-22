import { describe, expect, it } from "vitest";
import {
    applyReaderStyleOverrides,
    colorValueToWord,
    getStyleValueString,
    getStyleValueNumber,
    resolveReaderPaletteName,
    returnDefaultStyleDefinitions,
    returnPaletteStyleDefinitions,
    type ReaderStyleOverrides,
} from "../src/style";

describe("applyReaderStyleOverrides", () => {
    it("applies per-key overrides on top of existing definitions", () => {
        const defs = returnDefaultStyleDefinitions();
        applyReaderStyleOverrides(defs, {
            styles: { 2: { markerColor: "purple", lineWidth: 6 } },
        });

        expect(getStyleValueString(defs[2], "markerColor")).toBe("purple");
        expect(getStyleValueNumber(defs[2], "lineWidth")).toBe(6);
        // Untouched keys keep their authored values.
        expect(getStyleValueString(defs[2], "lineColor")).toBe("#D4042D");
        expect(getStyleValueString(defs[1], "lineColor")).toBe("#1f5dff");
    });

    it("re-derives words and dark-mode colors from overridden values", () => {
        const defs = returnDefaultStyleDefinitions();
        applyReaderStyleOverrides(defs, {
            styles: { 2: { markerColor: "#c22047", lineWidth: 1 } },
        });

        expect(getStyleValueString(defs[2], "markerColorWord")).toBe(
            colorValueToWord("#c22047"),
        );
        const dark = getStyleValueString(defs[2], "markerColorDarkMode")!;
        expect(dark).toBeTruthy();
        expect(dark).not.toBe("#F1466A");
        expect(getStyleValueString(defs[2], "markerColorWordDarkMode")).toBe(
            colorValueToWord(dark),
        );
        expect(getStyleValueString(defs[2], "lineWidthWord")).toBe("thin");
    });

    it("keeps an explicitly supplied dark-mode color", () => {
        const defs = returnDefaultStyleDefinitions();
        applyReaderStyleOverrides(defs, {
            styles: {
                1: { lineColor: "#c22047", lineColorDarkMode: "#e04267" },
            },
        });

        expect(getStyleValueString(defs[1], "lineColorDarkMode")).toBe(
            "#e04267",
        );
    });

    it("drops word keys, unknown keys, and non-primitive values", () => {
        const defs = returnDefaultStyleDefinitions();
        applyReaderStyleOverrides(defs, {
            styles: {
                1: {
                    markerColor: "purple",
                    markerColorWord: "spoofed",
                    bogus: "nope",
                    lineWidth: { evil: true },
                } as any,
            },
        });

        expect(getStyleValueString(defs[1], "markerColor")).toBe("purple");
        expect(getStyleValueString(defs[1], "markerColorWord")).toBe(
            colorValueToWord("purple"),
        );
        expect(getStyleValueNumber(defs[1], "lineWidth")).toBe(4);
    });

    it("stores override values without source positions", () => {
        const defs = returnDefaultStyleDefinitions();
        applyReaderStyleOverrides(defs, {
            styles: { 1: { markerColor: "purple" } },
        });

        expect(defs[1].markerColor?.position).toBeUndefined();
    });

    it("ignores style numbers not present in the map and tolerates empty input", () => {
        const defs = returnDefaultStyleDefinitions();
        const before = JSON.stringify(defs);

        applyReaderStyleOverrides(defs, { styles: { 42: { lineWidth: 9 } } });
        applyReaderStyleOverrides(defs, {});
        applyReaderStyleOverrides(defs, null);
        applyReaderStyleOverrides(defs, undefined);

        expect(JSON.stringify(defs)).toBe(before);
        expect(defs[42]).toBeUndefined();
    });

    it("coerces JSON values to each key's declared type like authored attributes", () => {
        const defs = returnDefaultStyleDefinitions();
        applyReaderStyleOverrides(defs, {
            styles: {
                1: {
                    lineWidth: "1",
                    markerFilled: "false",
                    markerStyle: "triangleDown",
                } as any,
            },
        });

        // Numeric string → number, and the derived word describes the
        // coerced value (1 → "thin"), not the pre-override width.
        expect(getStyleValueNumber(defs[1], "lineWidth")).toBe(1);
        expect(getStyleValueString(defs[1], "lineWidthWord")).toBe("thin");
        // Boolean string → boolean.
        expect(defs[1].markerFilled?.style).toBe(false);
        // Enum values lowercase to the renderer-correct spelling, with the
        // word normalized the same way authored values are.
        expect(getStyleValueString(defs[1], "markerStyle")).toBe(
            "triangledown",
        );
        expect(getStyleValueString(defs[1], "markerStyleWord")).toBe(
            "triangle",
        );
    });

    it("drops values that cannot be normalized to the key's type", () => {
        const defs = returnDefaultStyleDefinitions();
        const lineOpacityBefore = getStyleValueNumber(defs[1], "lineOpacity");
        applyReaderStyleOverrides(defs, {
            styles: {
                1: {
                    markerSize: NaN,
                    lineOpacity: "not-a-number",
                    markerColor: 42,
                    markerFilled: "yes",
                } as any,
            },
        });

        expect(getStyleValueNumber(defs[1], "markerSize")).toBe(5);
        expect(getStyleValueNumber(defs[1], "lineOpacity")).toBe(
            lineOpacityBefore,
        );
        expect(getStyleValueString(defs[1], "markerColor")).toBe("#1f5dff");
        expect(defs[1].markerFilled?.style).toBe(true);
    });

    it("ignores prototype key names in host JSON", () => {
        const defs = returnDefaultStyleDefinitions();
        const before = JSON.stringify(defs);

        // A "__proto__" style number must not resolve through the prototype
        // chain to Object.prototype (which the final merge would then
        // pollute process-wide), and prototype-named style keys must not
        // pass the known-key filter via inheritance.
        applyReaderStyleOverrides(defs, {
            styles: JSON.parse(
                '{"__proto__": {"lineColor": "red"}, "1": {"constructor": "red", "hasOwnProperty": "red"}}',
            ),
        });

        expect(JSON.stringify(defs)).toBe(before);
        expect(
            ({} as Record<string, unknown>).lineColor,
            "Object.prototype polluted",
        ).toBeUndefined();
        expect(Object.keys(defs[1])).not.toContain("constructor");
    });

    it("lowercases string values like authored styleDefinitions do", () => {
        const defs = returnDefaultStyleDefinitions();
        applyReaderStyleOverrides(defs, {
            styles: { 1: { markerColor: "PURPLE" } },
        });

        expect(getStyleValueString(defs[1], "markerColor")).toBe("purple");
    });
});

describe("reader palette selection", () => {
    it("replaces the merged map wholesale with the named palette", () => {
        const defs = returnDefaultStyleDefinitions();
        // Simulate an authored customization that must NOT survive.
        applyReaderStyleOverrides(defs, { styles: { 1: { lineWidth: 9 } } });

        applyReaderStyleOverrides(defs, { palette: "grayscale" });

        expect(Object.keys(defs)).toEqual(["1", "2", "3", "4"]);
        expect(getStyleValueString(defs[1], "lineColor")).toBe("#000000");
        expect(getStyleValueNumber(defs[1], "lineWidth")).toBe(4);
        expect(getStyleValueString(defs[4], "lineColorDarkMode")).toBe(
            "#626262",
        );
    });

    it("applies styles overrides on top of the reader palette", () => {
        const defs = returnDefaultStyleDefinitions();
        applyReaderStyleOverrides(defs, {
            palette: "grayscale",
            styles: { 2: { lineWidth: 7 } },
        });

        expect(getStyleValueString(defs[2], "lineColor")).toBe("#323232");
        expect(getStyleValueNumber(defs[2], "lineWidth")).toBe(7);
    });

    it("matches reader palette names case-insensitively with whitespace", () => {
        const defs = returnDefaultStyleDefinitions();
        applyReaderStyleOverrides(defs, { palette: "  GrayScale " });
        expect(Object.keys(defs)).toEqual(["1", "2", "3", "4"]);
    });

    it("ignores unregistered reader palette names", () => {
        const defs = returnDefaultStyleDefinitions();
        const before = JSON.stringify(defs);
        applyReaderStyleOverrides(defs, { palette: "not-a-palette" });
        expect(JSON.stringify(defs)).toBe(before);
    });

    it("resolveReaderPaletteName validates and normalizes", () => {
        expect(resolveReaderPaletteName({ palette: "okabeito" })).toBe(
            "okabeito",
        );
        expect(resolveReaderPaletteName({ palette: " TolMuted " })).toBe(
            "tolmuted",
        );
        expect(resolveReaderPaletteName({ palette: "nope" })).toBeNull();
        expect(resolveReaderPaletteName({ palette: 3 as any })).toBeNull();
        expect(resolveReaderPaletteName({})).toBeNull();
        expect(resolveReaderPaletteName(null)).toBeNull();
        // prototype keys are not palettes
        expect(resolveReaderPaletteName({ palette: "constructor" })).toBeNull();
    });

    it("reader palette expansion matches the registry expansion", () => {
        const defs = returnDefaultStyleDefinitions();
        applyReaderStyleOverrides(defs, { palette: "okabeito" });
        expect(defs).toEqual(returnPaletteStyleDefinitions("okabeito"));
    });
});
