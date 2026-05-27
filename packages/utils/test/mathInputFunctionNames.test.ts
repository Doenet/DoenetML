import { describe, expect, it } from "vitest";
import {
    DEFAULT_MATH_INPUT_FUNCTION_NAMES,
    buildEffectiveMathInputFunctionNames,
    isValidMathQuillFunctionName,
} from "../src/components/mathInputFunctionNames";

describe("isValidMathQuillFunctionName", () => {
    it("accepts tokens of length >= 2 composed of letters / pipes / dashes", () => {
        expect(isValidMathQuillFunctionName("sin")).toBe(true);
        expect(isValidMathQuillFunctionName("erf")).toBe(true);
        expect(isValidMathQuillFunctionName("nPr")).toBe(true);
        expect(isValidMathQuillFunctionName("arc-tan")).toBe(true);
        // Pipe separates display name from mathspeak alternative.
        expect(isValidMathQuillFunctionName("min|minimum")).toBe(true);
    });

    it("rejects tokens shorter than 2 chars on the pre-pipe segment", () => {
        expect(isValidMathQuillFunctionName("a")).toBe(false);
        expect(isValidMathQuillFunctionName("")).toBe(false);
        expect(isValidMathQuillFunctionName("a|word")).toBe(false);
        expect(isValidMathQuillFunctionName("|word")).toBe(false);
    });

    it("rejects tokens with non-letter characters", () => {
        expect(isValidMathQuillFunctionName("f1")).toBe(false);
        expect(isValidMathQuillFunctionName("ab_c")).toBe(false);
        expect(isValidMathQuillFunctionName("ab c")).toBe(false);
        expect(isValidMathQuillFunctionName("φ")).toBe(false);
    });

    it("rejects tokens with more than one pipe", () => {
        expect(isValidMathQuillFunctionName("ab|cd|ef")).toBe(false);
    });
});

describe("buildEffectiveMathInputFunctionNames", () => {
    it("returns the deduped defaults when no deltas are supplied", () => {
        const { names, dropped } = buildEffectiveMathInputFunctionNames({});
        expect(names).toEqual([...DEFAULT_MATH_INPUT_FUNCTION_NAMES]);
        expect(dropped).toEqual([]);
    });

    it("appends `additional` and removes `removed`", () => {
        const { names } = buildEffectiveMathInputFunctionNames({
            additional: ["erf"],
            removed: ["min", "max"],
        });
        expect(names).toContain("erf");
        expect(names).not.toContain("min");
        expect(names).not.toContain("max");
        expect(names).toContain("sin");
    });

    it("uses `reset` verbatim (deduped) when supplied, ignoring deltas", () => {
        const { names } = buildEffectiveMathInputFunctionNames({
            additional: ["erf"],
            removed: ["sin"],
            reset: ["sin", "cos", "sin"],
        });
        expect(names).toEqual(["sin", "cos"]);
    });

    it("returns an empty list for an empty reset", () => {
        const { names, dropped } = buildEffectiveMathInputFunctionNames({
            reset: [],
        });
        expect(names).toEqual([]);
        expect(dropped).toEqual([]);
    });

    it("filters tokens from `additional` that MathQuill would reject", () => {
        const { names, dropped } = buildEffectiveMathInputFunctionNames({
            additional: ["erf", "e", "f1"],
        });
        expect(names).toContain("erf");
        expect(names).not.toContain("e");
        expect(names).not.toContain("f1");
        expect(dropped).toEqual(["e", "f1"]);
    });

    it("filters tokens from `reset` that MathQuill would reject", () => {
        const { names, dropped } = buildEffectiveMathInputFunctionNames({
            reset: ["sin", "x", "ab|cd|ef"],
        });
        expect(names).toEqual(["sin"]);
        expect(dropped).toEqual(["x", "ab|cd|ef"]);
    });

    it("does not validate `removed` — invalid tokens there are a harmless no-op", () => {
        // An invalid removal token simply doesn't match any default,
        // so it has no effect; it should not appear in `dropped`.
        const { dropped } = buildEffectiveMathInputFunctionNames({
            removed: ["x"],
        });
        expect(dropped).toEqual([]);
    });
});
