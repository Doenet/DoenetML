import { describe, expect, it } from "vitest";
import {
    DEFAULT_STYLE_VALUES,
    resolveStyleDefinition,
    type ResolvedStyleDefinition,
} from "../src/style/styleDefinitionHelpers";

const expectedKeys: (keyof ResolvedStyleDefinition)[] = [
    "lineColor",
    "lineColorWord",
    "lineColorDarkMode",
    "lineColorWordDarkMode",
    "lineOpacity",
    "lineWidth",
    "lineWidthWord",
    "lineStyle",
    "lineStyleWord",
    "markerColor",
    "markerColorWord",
    "markerColorDarkMode",
    "markerColorWordDarkMode",
    "markerOpacity",
    "markerStyle",
    "markerStyleWord",
    "markerSize",
    "fillColor",
    "fillColorWord",
    "fillColorDarkMode",
    "fillColorWordDarkMode",
    "fillOpacity",
    "textColor",
    "textColorWord",
    "textColorDarkMode",
    "textColorWordDarkMode",
    "highContrastColor",
    "highContrastColorWord",
    "highContrastColorDarkMode",
    "highContrastColorWordDarkMode",
    "backgroundColor",
    "backgroundColorWord",
    "backgroundColorDarkMode",
    "backgroundColorWordDarkMode",
];

describe("resolveStyleDefinition", () => {
    it("returns every supported key when given empty input", () => {
        const resolved = resolveStyleDefinition({});

        for (const key of expectedKeys) {
            expect(resolved, `missing key ${key}`).toHaveProperty(key);
        }
    });

    it("fills color keys present in DEFAULT_STYLE_VALUES with their default", () => {
        const resolved = resolveStyleDefinition({});

        expect(resolved.textColor).eq("black");
        expect(resolved.textColorDarkMode).eq("white");
        expect(resolved.highContrastColor).eq("#2963FF");
        expect(resolved.highContrastColorDarkMode).eq("#2963FF");
        expect(resolved.lineColor).eq("#648FFF");
        expect(resolved.fillOpacity).eq(0.3);
    });

    it("fills color and word keys absent from DEFAULT_STYLE_VALUES with empty string", () => {
        const resolved = resolveStyleDefinition({});

        expect(resolved.backgroundColor).eq("");
        expect(resolved.backgroundColorDarkMode).eq("");
        expect(resolved.backgroundColorWord).eq("");
        expect(resolved.backgroundColorWordDarkMode).eq("");
        expect(resolved.highContrastColorWord).eq("");
        expect(resolved.highContrastColorWordDarkMode).eq("");
        expect(resolved.lineColorWord).eq("");
        expect(resolved.textColorWord).eq("");
    });

    it("preserves authored values, overriding fallbacks", () => {
        const resolved = resolveStyleDefinition({
            textColor: "red",
            backgroundColor: "blue",
            backgroundColorWord: "blue",
            lineWidth: 2,
        });

        expect(resolved.textColor).eq("red");
        expect(resolved.backgroundColor).eq("blue");
        expect(resolved.backgroundColorWord).eq("blue");
        expect(resolved.lineWidth).eq(2);
        // Untouched keys still get fallbacks.
        expect(resolved.textColorDarkMode).eq("white");
        expect(resolved.lineColor).eq("#648FFF");
    });

    it("treats explicit undefined as absent and falls through to the fallback", () => {
        const resolved = resolveStyleDefinition({
            textColor: undefined,
            backgroundColor: undefined,
        });

        expect(resolved.textColor).eq("black");
        expect(resolved.backgroundColor).eq("");
    });

    it("round-trips every supported key the worker can populate", () => {
        // Locks in the contract that no key gets silently dropped — the bug
        // that caused `selectedStyle.backgroundColorWord` to disappear before
        // it reached `returnTextStyleDescriptionDefinitions`.
        const fullInput: Record<string, string | number> = {};
        for (const key of expectedKeys) {
            fullInput[key] =
                key.endsWith("Opacity") ||
                key.endsWith("Width") ||
                key.endsWith("Size")
                    ? 1
                    : `value-${key}`;
        }

        const resolved = resolveStyleDefinition(
            fullInput as Parameters<typeof resolveStyleDefinition>[0],
        );

        for (const key of expectedKeys) {
            expect(resolved[key], `key ${key} was not preserved`).eq(
                fullInput[key],
            );
        }
    });

    it("does not mutate the input object", () => {
        const input = { textColor: "red" } as const;
        const snapshot = { ...input };
        resolveStyleDefinition(input);
        expect(input).toEqual(snapshot);
    });
});

describe("DEFAULT_STYLE_VALUES", () => {
    it("intentionally omits backgroundColor (load-bearing for description-word derivation)", () => {
        expect(DEFAULT_STYLE_VALUES).not.toHaveProperty("backgroundColor");
        expect(DEFAULT_STYLE_VALUES).not.toHaveProperty(
            "backgroundColorDarkMode",
        );
    });
});
