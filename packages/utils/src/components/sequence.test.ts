import { describe, expect, it } from "vitest";
import { lettersToNumber, numberToLetters } from "./sequence";

describe("letters of a sequence", () => {
    it("numbers and letters convert both ways", () => {
        expect(numberToLetters(1, true)).eq("a");
        expect(numberToLetters(26, false)).eq("Z");
        expect(numberToLetters(27, true)).eq("aa");
        expect(lettersToNumber("aa")).eq(27);
    });

    it("a number that is not finite has no letters, and does not hang (#2173)", () => {
        expect(lettersToNumber("1")).eq(undefined);
        expect(numberToLetters(NaN, true)).eq("");
        expect(numberToLetters(Infinity, true)).eq("");
    });
});
