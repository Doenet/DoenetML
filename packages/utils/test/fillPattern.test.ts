import { describe, expect, it } from "vitest";
import {
    decodeFillPatternColorToken,
    encodeFillPatternColorToken,
} from "../src/style/fillPattern";

describe("fill-pattern color tokens", () => {
    it("round trips CSS color strings through safe pattern tokens", () => {
        const color = "RGB(255, 0, 0)";
        const token = encodeFillPatternColorToken(color);

        expect(token).toBe("726762283235352c20302c203029");
        expect(decodeFillPatternColorToken(token)).toBe("rgb(255, 0, 0)");
    });

    it("rejects malformed tokens", () => {
        expect(decodeFillPatternColorToken("xyz")).toBeNull();
        expect(decodeFillPatternColorToken("abc")).toBeNull();
    });
});
