import { describe, expect, it } from "vitest";
import {
    applyReaderStyleOverrides,
    colorValueToWord,
    getStyleValueString,
    getStyleValueNumber,
    returnDefaultStyleDefinitions,
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

    it("lowercases string values like authored styleDefinitions do", () => {
        const defs = returnDefaultStyleDefinitions();
        applyReaderStyleOverrides(defs, {
            styles: { 1: { markerColor: "PURPLE" } },
        });

        expect(getStyleValueString(defs[1], "markerColor")).toBe("purple");
    });
});
