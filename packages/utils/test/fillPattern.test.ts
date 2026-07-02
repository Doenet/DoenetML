import { describe, expect, it } from "vitest";
import {
    decodeFillPatternColorToken,
    encodeFillPatternColorToken,
} from "../src/style/fillPattern";

describe("fill-pattern color tokens", () => {
    it("round trips CSS color strings through safe pattern tokens", () => {
        const color = "RGB(255, 0, 0)";
        const token = encodeFillPatternColorToken(color);

        // Original case is preserved — token decodes back to the trimmed input.
        expect(token).toBe("524742283235352c20302c203029");
        expect(decodeFillPatternColorToken(token)).toBe("RGB(255, 0, 0)");
    });

    it("preserves case for CSS custom properties", () => {
        const color = "var(--MyBrandColor)";
        const token = encodeFillPatternColorToken(color);
        expect(decodeFillPatternColorToken(token)).toBe("var(--MyBrandColor)");
    });

    it("rejects malformed tokens", () => {
        expect(decodeFillPatternColorToken("xyz")).toBeNull();
        expect(decodeFillPatternColorToken("abc")).toBeNull();
    });
});
