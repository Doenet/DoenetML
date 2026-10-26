import { describe, expect, it } from "vitest";
import { enumerateSelectionCombinations } from "../src/components/enumeration";

describe("enumerateSelectionCombinations", () => {
    it("has one empty combination for zero indices (#2356)", () => {
        for (const withReplacement of [false, true]) {
            expect(
                enumerateSelectionCombinations({
                    numberOfIndices: 0,
                    numberOfOptions: 3,
                    maxNumber: Infinity,
                    withReplacement,
                    skipZero: false,
                }),
            ).eqls([[]]);
        }
    });

    it("returns nothing for zero indices when maxNumber is 0", () => {
        expect(
            enumerateSelectionCombinations({
                numberOfIndices: 0,
                numberOfOptions: 3,
                maxNumber: 0,
                withReplacement: false,
                skipZero: false,
            }),
        ).eqls([]);
    });

    it("still enumerates one and two indices", () => {
        expect(
            enumerateSelectionCombinations({
                numberOfIndices: 1,
                numberOfOptions: 3,
                maxNumber: Infinity,
                withReplacement: false,
                skipZero: false,
            }),
        ).eqls([[1], [2], [0]]);
        expect(
            enumerateSelectionCombinations({
                numberOfIndices: 2,
                numberOfOptions: 3,
                maxNumber: Infinity,
                withReplacement: false,
                skipZero: false,
            }),
        ).eqls([
            [1, 2],
            [2, 0],
            [0, 1],
            [1, 0],
            [2, 1],
            [0, 2],
        ]);
    });
});
