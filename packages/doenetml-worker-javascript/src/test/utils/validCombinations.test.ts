import { describe, expect, it } from "vitest";
import {
    drawValidCombination,
    someValidCombination,
} from "../../utils/validCombinations";

/** A generator of the numbers in `draws`, in turn. */
function rngOf(draws: number[]) {
    let i = 0;
    return () => draws[i++ % draws.length];
}

function gcd(a: number, b: number): number {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

const coprimePair = (values: number[]) => gcd(values[0], values[1]) === 1;

describe("Valid combinations, found exactly (SEL-4) @group4", () => {
    it("finds that a combination exists without looking at every value", () => {
        let looked = 0;
        const found = someValidCombination({
            numValues: 1_000_000,
            numToSelect: 2,
            withReplacement: false,
            valueAt: (index) => {
                looked++;
                return index + 1;
            },
            isValid: coprimePair,
        });
        expect(found).eq(true);
        expect(looked).lt(10);
    });

    it("finds that none exists: 6, 10 and 15, two at a time, without a common factor", () => {
        const values = [6, 10, 15];
        const space = {
            numValues: 3,
            numToSelect: 2,
            withReplacement: false,
            valueAt: (index: number) => values[index],
            isValid: coprimePair,
        };
        expect(someValidCombination(space)).eq(false);
        expect(drawValidCombination({ ...space, rng: Math.random })).eq(null);
    });

    it("leaves out excluded values, and repeats only with replacement", () => {
        // 0, 1, 2, with 1 excluded
        const values = [5, null, 7];
        const space = {
            numValues: 3,
            numToSelect: 2,
            valueAt: (index: number) => values[index],
            isValid: () => true,
        };
        const all = (withReplacement: boolean) =>
            [0, 0.25, 0.5, 0.75, 0.999].map(
                (r) =>
                    drawValidCombination({
                        ...space,
                        withReplacement,
                        rng: rngOf([r]),
                    })!.values,
            );
        expect(new Set(all(false).map((v) => JSON.stringify(v)))).eqls(
            new Set(["[5,7]", "[7,5]"]),
        );
        expect(new Set(all(true).map((v) => JSON.stringify(v)))).eqls(
            new Set(["[5,5]", "[5,7]", "[7,5]", "[7,7]"]),
        );
    });

    it("draws each valid combination with the same chance", () => {
        // the coprime ordered pairs of distinct values among 1 to 6
        const space = {
            numValues: 6,
            numToSelect: 2,
            withReplacement: false,
            valueAt: (index: number) => index + 1,
            isValid: coprimePair,
        };
        const valid: string[] = [];
        for (let a = 1; a <= 6; a++) {
            for (let b = 1; b <= 6; b++) {
                if (a !== b && gcd(a, b) === 1) {
                    valid.push(JSON.stringify([a, b]));
                }
            }
        }
        // the k-th of n equal parts of [0, 1) draws the k-th combination
        const drawn = valid.map((_, k) =>
            JSON.stringify(
                drawValidCombination({
                    ...space,
                    rng: rngOf([(k + 0.5) / valid.length]),
                })!.values,
            ),
        );
        expect(new Set(drawn)).eqls(new Set(valid));
        expect(drawn.length).eq(valid.length);
    });

    it("gives the indices of the values drawn", () => {
        const values = [null, 4, null, 9];
        const drawn = drawValidCombination({
            numValues: 4,
            numToSelect: 2,
            withReplacement: false,
            valueAt: (index) => values[index],
            isValid: coprimePair,
            rng: rngOf([0]),
        })!;
        expect(drawn.values).eqls([4, 9]);
        expect(drawn.indices).eqls([1, 3]);
    });
});
