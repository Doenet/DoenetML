/**
 * A choice never fails by chance (SEL-4, D39): when a valid choice exists,
 * one is found.
 *
 * A select whose combinations are constrained (`excludeCombinations`, or
 * `coprime` on a `<selectFromSequence>`) draws a combination at random and
 * draws again when the one it drew isn't valid. That is fast when most
 * combinations are valid, but it can run out of draws, so when it does the
 * select draws exactly instead: it counts the valid combinations and takes
 * one of them, uniformly ({@link drawValidCombination}). A draw that the
 * rejected draws stop short of is still uniform among the valid
 * combinations, as each of the two ways of drawing is.
 *
 * Whether any valid combination exists is decided before any draw
 * ({@link someValidCombination}), from the values alone, so that a select
 * with none fails the same way in every variant, and a select given a
 * requested variant's choices finds the failure without drawing
 * (`selectionWithRequested`).
 *
 * A combination is an ordered list of `numToSelect` indices into the values,
 * as the draws make it: distinct indices without replacement, any with.
 * Values that are excluded (`valueAt` gives `null`) are never in one.
 */

/** What both functions here take. */
type CombinationSpace = {
    /** How many indices there are: `0` to `numValues - 1`. */
    numValues: number;
    numToSelect: number;
    withReplacement: boolean;
    /** The value at an index, or `null` when it is excluded. */
    valueAt: (index: number) => unknown;
    /** Whether the values of a combination, in order, are a valid one. */
    isValid: (values: any[]) => boolean;
};

/**
 * Call `visit` with each combination of `space` whose values are valid, in a
 * fixed order (the first index slowest), until `visit` returns `true`.
 * Returns whether it did. Values are looked up as they are reached, each
 * once, so a search that stops early doesn't look at every value.
 */
function forEachValidCombination(
    {
        numValues,
        numToSelect,
        withReplacement,
        valueAt,
        isValid,
    }: CombinationSpace,
    visit: (indices: number[], values: any[]) => boolean,
): boolean {
    const valueCache = new Map<number, unknown>();
    function cachedValueAt(index: number) {
        if (!valueCache.has(index)) {
            valueCache.set(index, valueAt(index));
        }
        return valueCache.get(index);
    }
    const indices: number[] = [];
    const values: unknown[] = [];
    const used = new Set<number>();

    function extend(): boolean {
        if (indices.length === numToSelect) {
            return isValid(values) && visit([...indices], [...values]);
        }
        for (let index = 0; index < numValues; index++) {
            if (!withReplacement && used.has(index)) {
                continue;
            }
            const value = cachedValueAt(index);
            if (value === null) {
                continue;
            }
            indices.push(index);
            values.push(value);
            used.add(index);
            const done = extend();
            indices.pop();
            values.pop();
            used.delete(index);
            if (done) {
                return true;
            }
        }
        return false;
    }
    return extend();
}

/**
 * Whether `space` has a valid combination. It stops at the first one, so
 * when valid combinations are common it looks at only a few.
 */
export function someValidCombination(space: CombinationSpace): boolean {
    return forEachValidCombination(space, () => true);
}

/**
 * A valid combination of `space`, drawn uniformly from all of them with one
 * number from `rng`: the indices and their values. `null` when there is none.
 *
 * It looks at every combination twice, once to count the valid ones and once
 * to find the one drawn, so it costs time in proportion to the number of
 * combinations, though no more memory than one combination takes. A select
 * comes here only when its random draws have found no valid combination,
 * which is when valid ones are rare.
 */
export function drawValidCombination(
    space: CombinationSpace & { rng: () => number },
): { indices: number[]; values: any[] } | null {
    let count = 0;
    forEachValidCombination(space, () => {
        count++;
        return false;
    });
    if (count === 0) {
        return null;
    }
    const target = Math.floor(space.rng() * count);
    let seen = 0;
    let drawn: { indices: number[]; values: any[] } | null = null;
    forEachValidCombination(space, (indices, values) => {
        if (seen === target) {
            drawn = { indices, values };
            return true;
        }
        seen++;
        return false;
    });
    return drawn;
}

/**
 * The coprime combinations of positive integers, found without looking at
 * every combination (SEL-4): a `<selectFromSequence coprime>` whose valid
 * combinations are rare (1 and the even numbers, three at a time) has far
 * too many combinations to go through, but they can be counted.
 *
 * The number of ways to complete a combination whose values so far have
 * greatest common divisor `g`, so that the whole has none but 1, is, by
 * Möbius inversion over the divisors `d` of `g`,
 * `Σ μ(d) · f(N(d), m)`, where `N(d)` is how many of the values `d`
 * divides (less those used, without replacement, which `d` divides too),
 * `m` how many values are still to choose, and `f(n, m)` the number of ways
 * to choose `m` of `n` in order: `n^m` with replacement, `n (n-1) … (n-m+1)`
 * without. So each value is drawn in turn with a chance in proportion to
 * the number of coprime combinations it begins, which draws a combination
 * uniformly from all of them. The counts are exact (`BigInt`).
 *
 * `values` are positive integers, distinct, in the order their indices
 * name.
 */
export function coprimeCombinations({
    values,
    numToSelect,
    withReplacement,
}: {
    values: number[];
    numToSelect: number;
    withReplacement: boolean;
}) {
    const numValues = values.length;
    const countDivisibleBy = new Map<number, number>();
    function numDivisibleBy(d: number) {
        let count = countDivisibleBy.get(d);
        if (count === undefined) {
            count = 0;
            for (const value of values) {
                if (value % d === 0) {
                    count++;
                }
            }
            countDivisibleBy.set(d, count);
        }
        return count;
    }
    const mobiusOf = new Map<number, number>();
    /**
     * The divisors `d` of `n` with `μ(d)` not 0 (those with no square
     * factor), each with `μ(d)`.
     */
    function squareFreeDivisors(n: number): [number, number][] {
        const primes: number[] = [];
        let rest = n;
        for (let p = 2; p * p <= rest; p++) {
            if (rest % p === 0) {
                primes.push(p);
                while (rest % p === 0) {
                    rest /= p;
                }
            }
        }
        if (rest > 1) {
            primes.push(rest);
        }
        let divisors: [number, number][] = [[1, 1]];
        for (const p of primes) {
            divisors = divisors.concat(
                divisors.map(([d, mu]) => [d * p, -mu] as [number, number]),
            );
        }
        for (const [d, mu] of divisors) {
            mobiusOf.set(d, mu);
        }
        return divisors;
    }
    /** The ways to choose `m` of `n` in order. */
    function ordered(n: number, m: number): bigint {
        if (n < 0) {
            return 0n;
        }
        let ways = 1n;
        for (let i = 0; i < m; i++) {
            const factor = withReplacement ? n : n - i;
            if (factor <= 0) {
                return 0n;
            }
            ways *= BigInt(factor);
        }
        return ways;
    }
    /**
     * The ways to complete a combination of `numChosen` values whose
     * greatest common divisor is `g` (0 for none chosen) so the whole is
     * coprime.
     */
    function completions(g: number, numChosen: number): bigint {
        const remaining = numToSelect - numChosen;
        if (g === 0) {
            // nothing chosen yet: all combinations, by the same sum over
            // every square-free divisor of some value
            let total = 0n;
            const seen = new Set<number>();
            for (const value of values) {
                for (const [d, mu] of squareFreeDivisors(value)) {
                    if (!seen.has(d)) {
                        seen.add(d);
                        total +=
                            BigInt(mu) * ordered(numDivisibleBy(d), remaining);
                    }
                }
            }
            return total;
        }
        let total = 0n;
        for (const [d, mu] of squareFreeDivisors(g)) {
            const available =
                numDivisibleBy(d) - (withReplacement ? 0 : numChosen);
            total += BigInt(mu) * ordered(available, remaining);
        }
        return total;
    }
    function gcd(a: number, b: number) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    return {
        /** Whether any coprime combination exists. */
        exists() {
            return numToSelect < 1 || completions(0, 0) > 0n;
        },
        /**
         * A coprime combination drawn uniformly, its indices and values, or
         * `null` when there is none. One number from `rng` for each value.
         */
        draw(rng: () => number) {
            const indices: number[] = [];
            const used = new Set<number>();
            let g = 0;
            for (let chosen = 0; chosen < numToSelect; chosen++) {
                const weights: bigint[] = [];
                let total = 0n;
                for (let index = 0; index < numValues; index++) {
                    const weight =
                        !withReplacement && used.has(index)
                            ? 0n
                            : completions(gcd(g, values[index]), chosen + 1);
                    weights.push(weight);
                    total += weight;
                }
                if (total <= 0n) {
                    return null;
                }
                let target = randomBelow(total, rng);
                let picked = 0;
                for (; picked < numValues; picked++) {
                    if (target < weights[picked]) {
                        break;
                    }
                    target -= weights[picked];
                }
                indices.push(picked);
                used.add(picked);
                g = gcd(g, values[picked]);
            }
            return { indices, values: indices.map((index) => values[index]) };
        },
    };
}

/**
 * A whole number from 0 to `bound - 1`, from one number from `rng`, exact
 * to the 53 bits a number from `rng` has.
 */
function randomBelow(bound: bigint, rng: () => number): bigint {
    const scaled = BigInt(Math.floor(rng() * 2 ** 53));
    const result = (scaled * bound) >> 53n;
    return result < bound ? result : bound - 1n;
}
