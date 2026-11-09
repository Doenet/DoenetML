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
