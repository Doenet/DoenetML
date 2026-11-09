import { describe, expect, it } from "vitest";
import {
    coprimeCombinations,
    drawValidCombination,
    randomBelow,
    someValidCombination,
} from "../../utils/validCombinations";
import seedrandom from "seedrandom";

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

    it("counts coprime combinations, and draws each with the same chance", () => {
        // 2 to 10 and 15, three at a time, with and without replacement:
        // every valid combination is drawn by some part of [0, 1), and
        // nothing else is
        const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 15];
        const gcdAll = (v: number[]) => v.reduce((a, b) => gcd(a, b), 0);
        for (const withReplacement of [false, true]) {
            const valid = new Set<string>();
            for (const a of values) {
                for (const b of values) {
                    for (const c of values) {
                        if (
                            (withReplacement ||
                                (a !== b && b !== c && a !== c)) &&
                            gcdAll([a, b, c]) === 1
                        ) {
                            valid.add(JSON.stringify([a, b, c]));
                        }
                    }
                }
            }
            const combinations = coprimeCombinations({
                values,
                numToSelect: 3,
                withReplacement,
            });
            expect(combinations.exists()).eq(true);
            // draws spread evenly over [0, 1) reach every combination
            const drawn = new Map<string, number>();
            const n = valid.size * 40;
            for (let i = 0; i < n; i++) {
                // three numbers for each draw: one stratified, two fixed,
                // so that each first value is reached in proportion
                const result = combinations.draw(
                    rngOf([
                        (i + 0.5) / n,
                        (((i * 7919) % n) + 0.5) / n,
                        (((i * 104729) % n) + 0.5) / n,
                    ]),
                )!;
                const key = JSON.stringify(result.values);
                expect(valid.has(key), key).eq(true);
                expect(result.indices.map((index) => values[index])).eqls(
                    result.values,
                );
                drawn.set(key, (drawn.get(key) ?? 0) + 1);
            }
            expect(drawn.size).eq(valid.size);
        }
    });

    it("draws each coprime combination with the chance its count gives", () => {
        // the first value's chance is in proportion to the coprime
        // combinations it begins
        const values = [1, 2, 4, 6];
        const combinations = coprimeCombinations({
            values,
            numToSelect: 2,
            withReplacement: false,
        });
        // coprime ordered pairs: (1, x) and (x, 1) for x in 2, 4, 6: 6 in all,
        // 3 of them begin with 1
        let beginsWith1 = 0;
        const n = 600;
        for (let i = 0; i < n; i++) {
            const r = (i + 0.5) / n;
            const result = combinations.draw(rngOf([r, 0.5]))!;
            if (result.values[0] === 1) {
                beginsWith1++;
            }
        }
        expect(beginsWith1).eq(n / 2);
    });

    it("finds none when the values have no coprime combination", () => {
        const combinations = coprimeCombinations({
            values: [6, 10, 15],
            numToSelect: 2,
            withReplacement: false,
        });
        expect(combinations.exists()).eq(false);
        expect(combinations.draw(Math.random)).eq(null);
    });

    it("draws quickly when coprime combinations are rare among very many", () => {
        // 1 and the even numbers to 2000, three at a time: about 10^9
        // combinations, of which only those holding 1 are coprime
        const values = [1, ...[...Array(1000).keys()].map((i) => 2 * i + 2)];
        const start = Date.now();
        const result = coprimeCombinations({
            values,
            numToSelect: 3,
            withReplacement: false,
        }).draw(rngOf([0.3, 0.6, 0.9]));
        expect(Date.now() - start).lt(5000);
        expect(result!.values).toContain(1);
        expect(new Set(result!.values).size).eq(3);
    });

    it("draws quickly from a great many values, all but one even", () => {
        // 1 and the even numbers to 400 000, three at a time
        const values = [1, ...[...Array(200_000).keys()].map((i) => 2 * i + 2)];
        const start = Date.now();
        const result = coprimeCombinations({
            values,
            numToSelect: 3,
            withReplacement: false,
        }).draw(seedrandom.alea("1"));
        expect(Date.now() - start).lt(5000);
        expect(result!.values).toContain(1);
    });

    it("draws below a bound larger than one number from the generator holds", () => {
        // a number from the variant's generator has 32 bits, so a bound of
        // 2^40 needs more than one of them to reach every result
        const rng = seedrandom.alea("1");
        const bound = 2n ** 40n;
        let reachesLowBits = false;
        for (let i = 0; i < 20; i++) {
            const result = randomBelow(bound, rng);
            expect(result >= 0n && result < bound).eq(true);
            if (result % 256n !== 0n) {
                reachesLowBits = true;
            }
        }
        expect(reachesLowBits).eq(true);
    });

    it("draws again rather than favour the results below the left-over part", () => {
        // 2^32 is not a multiple of 3, so the top of the range is left over:
        // a number there is drawn again
        const partSize = Math.floor(2 ** 32 / 3);
        const leftOver = (3 * partSize) / 2 ** 32;
        expect(randomBelow(3n, rngOf([leftOver, 0]))).eq(0n);
        expect(randomBelow(3n, rngOf([0.999]))).eq(2n);
        expect(randomBelow(3n, rngOf([0.001]))).eq(0n);
    });
});
