import { describe, expect, it } from "vitest";
import {
    combinationAtIndex,
    enumerateCombinations,
    enumeratePermutations,
    enumerateSelectionCombinations,
    permutationAtIndex,
    selectionCombinationAtIndex,
} from "../src/components/enumeration";

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

// The entry at an index is what the whole enumeration has there (#2598).
describe("entries at an index", () => {
    it("combinationAtIndex matches enumerateCombinations", () => {
        const shapes = [
            [1],
            [5],
            [2, 3],
            [4, 6],
            [6, 4],
            [3, 3],
            [1, 9, 12],
            [2, 4, 6],
            [6, 4, 2, 3],
            [3, 2, 4, 9],
            [2, 2, 2, 2],
            [1, 1, 4, 1],
        ];
        for (const numberOfOptionsByIndex of shapes) {
            const all = enumerateCombinations({
                numberOfOptionsByIndex,
                maxNumber: Infinity,
            });
            expect(all.length).eq(
                numberOfOptionsByIndex.reduce((a, c) => a * c),
            );
            for (const [index, combination] of all.entries()) {
                expect(
                    combinationAtIndex({ numberOfOptionsByIndex, index }),
                    `${numberOfOptionsByIndex} at ${index}`,
                ).eqls(combination);
                // what a caller asking for one entry got before
                expect(
                    enumerateCombinations({
                        numberOfOptionsByIndex,
                        maxNumber: index + 1,
                    })[index],
                ).eqls(combination);
            }
            expect(
                combinationAtIndex({
                    numberOfOptionsByIndex,
                    index: all.length,
                }),
            ).toBeUndefined();
        }
        expect(
            combinationAtIndex({ numberOfOptionsByIndex: [], index: 0 }),
        ).toBeUndefined();
    });

    it("selectionCombinationAtIndex matches enumerateSelectionCombinations", () => {
        for (const withReplacement of [false, true]) {
            for (
                let numberOfOptions = 1;
                numberOfOptions <= 6;
                numberOfOptions++
            ) {
                for (
                    let numberOfIndices = 0;
                    numberOfIndices <= 4;
                    numberOfIndices++
                ) {
                    const all = enumerateSelectionCombinations({
                        numberOfIndices,
                        numberOfOptions,
                        maxNumber: Infinity,
                        withReplacement,
                        skipZero: false,
                    });
                    for (const [index, combination] of all.entries()) {
                        expect(
                            selectionCombinationAtIndex({
                                numberOfIndices,
                                numberOfOptions,
                                withReplacement,
                                index,
                            }),
                            `${numberOfIndices} of ${numberOfOptions}, ${withReplacement}, at ${index}`,
                        ).eqls(combination);
                        expect(
                            enumerateSelectionCombinations({
                                numberOfIndices,
                                numberOfOptions,
                                maxNumber: index + 1,
                                withReplacement,
                                skipZero: false,
                            })[index],
                        ).eqls(combination);
                    }
                    expect(
                        selectionCombinationAtIndex({
                            numberOfIndices,
                            numberOfOptions,
                            withReplacement,
                            index: all.length,
                        }),
                    ).toBeUndefined();
                }
            }
        }
    });

    it("permutationAtIndex matches enumeratePermutations", () => {
        for (let n = 0; n <= 6; n++) {
            const values = [...Array(n).keys()].map((x) => x + 1);
            const all = enumeratePermutations({ values, maxNumber: Infinity });
            for (const [index, permutation] of all.entries()) {
                expect(permutationAtIndex({ values, index })).eqls(permutation);
            }
            expect(
                permutationAtIndex({ values, index: all.length }),
            ).toBeUndefined();
        }
    });

    it("finds an entry far into a large enumeration quickly", () => {
        // A document with a `<select>` of 9 and a `<selectFromSequence
        // to="100" numToSelect="3">` has 8,731,800 unique variants. Building
        // the entries up to one near the end ran out of memory.
        const index = 7042938;
        expect(
            combinationAtIndex({
                numberOfOptionsByIndex: [1, 9, 970200],
                index,
            }),
        ).eqls(
            // 9 divides 970200, so the pair is run through 9 times, shifted
            // by one each time: offset floor(index / 970200) = 7.
            [0, (index % 970200) % 9, ((index % 970200) + 7) % 970200],
        );
        const combination = selectionCombinationAtIndex({
            numberOfIndices: 3,
            numberOfOptions: 100,
            withReplacement: false,
            index: 970199,
        })!;
        expect(new Set(combination).size).eq(3);
        expect(
            permutationAtIndex({
                values: [...Array(12).keys()],
                index: 479001599,
            }),
        ).eqls([...Array(12).keys()].reverse());
    });
});
