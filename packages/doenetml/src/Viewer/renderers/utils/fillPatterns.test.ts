import { afterEach, describe, expect, it, vi } from "vitest";
import { getOrInjectPattern } from "./fillPatterns";

describe("fillPatterns", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("warns once when a stale unsupported fillStyle falls back to solid", () => {
        const warnSpy = vi
            .spyOn(console, "warn")
            .mockImplementation(() => undefined);

        expect(getOrInjectPattern(null, "board1", "crosshatch", "#abc")).toBe(
            "#abc",
        );
        expect(getOrInjectPattern(null, "board2", "crosshatch", "#def")).toBe(
            "#def",
        );

        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy.mock.calls[0][0]).toContain("crosshatch");
    });

    it("does not warn for solid fills", () => {
        const warnSpy = vi
            .spyOn(console, "warn")
            .mockImplementation(() => undefined);

        expect(getOrInjectPattern(null, "board1", "solid", "#abc")).toBe(
            "#abc",
        );

        expect(warnSpy).not.toHaveBeenCalled();
    });
});
