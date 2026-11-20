import me from "math-expressions";
import type { gcd as GcdType, lcm as LcmType } from "mathjs";
const { gcd, lcm } = me.math as { gcd: typeof GcdType; lcm: typeof LcmType };

// Enumerates the unique combinations of repeeated selecting an index
// from the same set of options, with or without replacement
// The number of options to choose from is numberOfOptions
// so that each index is an integer between 0 and numberOfOptions-1
// The number of indices to choose for each combination is numberOfIndices.
// Begins with combinations that contain distinct indices, if possible
// Returns a maximum of maxNumber
// Choosing zero indices has one combination, the empty one (#2356)
export function enumerateSelectionCombinations({
    numberOfIndices,
    numberOfOptions,
    maxNumber = Infinity,
    withReplacement = false,
    skipZero = false, // for case when generating offsets but without replacement
}: {
    numberOfIndices: number;
    numberOfOptions: number;
    maxNumber: number;
    withReplacement: boolean;
    skipZero: boolean;
}): number[][] {
    if (numberOfIndices <= 0) {
        return maxNumber >= 1 ? [[]] : [];
    }
    if (numberOfIndices === 1) {
        let options = [...Array(numberOfOptions).keys()];
        // remove zero
        options = options.slice(1);
        if (!skipZero) {
            // but put 0 last (so in recursion where the numbers are offsets, repeated combination is last)
            options = [...options, 0];
        }
        options = options.slice(0, maxNumber);
        // convert to array of arrays
        let options2 = options.map((x) => [x]);
        return options2;
    }

    let allOffsetsCombinations = enumerateSelectionCombinations({
        numberOfIndices: numberOfIndices - 1,
        numberOfOptions: numberOfOptions,
        maxNumber,
        withReplacement,
        skipZero: !withReplacement,
    });

    let results = [];
    let numberSoFar = 0;
    for (let offsets of allOffsetsCombinations) {
        for (let ind0 = 1; ind0 <= numberOfOptions; ind0++) {
            let combination = [
                ind0 % numberOfOptions,
                ...offsets.map((x) => (ind0 + x) % numberOfOptions),
            ];
            if (skipZero && combination.includes(0)) {
                continue;
            }
            results.push(combination);
            numberSoFar++;
            if (numberSoFar >= maxNumber) {
                return results;
            }
        }
    }

    return results;
}

// Enumerate the unique combinations of picking a set of indices
// The number of possible options for each index is given
// by the array numberOfOptionsByIndex
// whose length gives the total number of options
// Returns an array of arrays, where each array gives an index for each option
// Returns at most maxNumber of combinations
export function enumerateCombinations({
    numberOfOptionsByIndex,
    maxNumber = Infinity,
}: {
    numberOfOptionsByIndex: number[];
    maxNumber: number;
}): number[][] {
    let numberOfIndices = numberOfOptionsByIndex.length;

    if (numberOfIndices === 0) {
        return [];
    }

    let gcds = [];
    for (let ind1 = 0; ind1 < numberOfIndices; ind1++) {
        let g = [];
        for (let ind2 = 0; ind2 < ind1; ind2++) {
            g.push(
                gcd(numberOfOptionsByIndex[ind1], numberOfOptionsByIndex[ind2]),
            );
        }
        gcds.push(g);
    }

    // flatten and take max
    let maxGCD = gcds
        .reduce((a, c) => [...c, ...a], [])
        .reduce((a, c) => Math.max(a, c), 1);

    // if maxGCD is one, then can just sequentially pick the same component for each index
    // (mod the size)
    // and we encounter every possibility
    if (maxGCD === 1) {
        let totalCombinations = numberOfOptionsByIndex.reduce((a, c) => a * c);
        totalCombinations = Math.min(totalCombinations, maxNumber);
        let results = [];
        for (let ind = 0; ind < totalCombinations; ind++) {
            let r = numberOfOptionsByIndex.map((x) => ind % x);
            results.push(r);
        }
        return results;
    }

    // if have two indices, then run sequentially for lcm,
    // then shift second index and run sequentially for another lcm
    // if continue gcd times, will have all combinations
    if (numberOfIndices === 2) {
        const gcdValue = maxGCD;
        let computedLcm = lcm(...numberOfOptionsByIndex);

        let results = [];
        let numberSoFar = 0;
        for (let offset = 0; offset < gcdValue; offset++) {
            for (let ind = 0; ind < computedLcm; ind++) {
                let r = [
                    ind % numberOfOptionsByIndex[0],
                    (ind + offset) % numberOfOptionsByIndex[1],
                ];
                results.push(r);
                numberSoFar++;
                if (numberSoFar >= maxNumber) {
                    return results;
                }
            }
        }
        return results;
    }

    // if have more than 2 indices and gcd isn't one
    // then combine two together (which can treat with above case)
    // and recurse with the result that has one fewer index
    // (will need to splice together final result)

    // will combine the first pair encountered that, along with gcd > 1,
    // has the smallest least common multiple
    let lcms = [];
    for (let ind1 = 0; ind1 < numberOfIndices; ind1++) {
        let m = [];
        for (let ind2 = 0; ind2 < ind1; ind2++) {
            if (gcds[ind1][ind2] > 1) {
                m.push(
                    lcm(
                        numberOfOptionsByIndex[ind1],
                        numberOfOptionsByIndex[ind2],
                    ),
                );
            } else {
                m.push(null); // be sure to skip those with gcd == 1
            }
        }
        lcms.push(m);
    }

    // flatten and take min, filering out the nulls
    let minLCM = lcms
        .reduce((a, c) => [...c, ...a], [])
        .filter((x) => x !== null)
        .reduce((a, c) => Math.min(a, c), Infinity);

    // find indices where minimum occurs
    let matchInds: number[] = [];

    for (let ind1 = 0; ind1 < numberOfIndices; ind1++) {
        for (let ind2 = 0; ind2 < ind1; ind2++) {
            if (lcms[ind1][ind2] === minLCM) {
                matchInds = [ind2, ind1]; // want lowest index first
                break;
            }
        }
        if (matchInds.length > 0) {
            break;
        }
    }

    // create new options of just the matched results
    let n0 = numberOfOptionsByIndex[matchInds[0]];
    let n1 = numberOfOptionsByIndex[matchInds[1]];

    let innerOptions = [n0, n1];

    // create new options where replace matched results with single one
    // that has number of options set equal to the total number of inner options (n1*n2)
    let outerOptions = [...numberOfOptionsByIndex];
    outerOptions[matchInds[0]] = n0 * n1; // replace first with total number of combinations
    outerOptions.splice(matchInds[1], 1); // delete second matched ind

    let outerResult = enumerateCombinations({
        numberOfOptionsByIndex: outerOptions,
        maxNumber: maxNumber,
    });
    let innerResult = enumerateCombinations({
        numberOfOptionsByIndex: innerOptions,
        maxNumber: maxNumber,
    });

    // to splice back together
    // - replace the combined entry (which is at the lower index)
    //   with the first inner result
    // - insert in the second inner result at the larger index
    for (let r of outerResult) {
        let ires = innerResult[r[matchInds[0]]];
        r.splice(matchInds[0], 1, ires[0]);
        r.splice(matchInds[1], 0, ires[1]);
    }

    return outerResult;
}

// from https://stackoverflow.com/a/20871714
export function enumeratePermutations({
    values,
    maxNumber,
}: {
    values: any[];
    maxNumber: number;
}): any[][] {
    let result: any[][] = [];

    const permute = (arr: any[], m: any[] = []) => {
        if (arr.length === 0) {
            result.push(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
                if (result.length >= maxNumber) {
                    return;
                }
            }
        }
    };

    permute(values);

    return result;
}

// The functions below give one entry of the enumerations above, the one at
// `index` (counting from 0), without building the entries before it. A
// variant is found by its index among the unique variants, and a document
// can have up to ten million of them (`determineVariantsForSection`), so
// building every entry up to it can run out of memory (#2598).
// Each gives exactly the entry the matching enumeration has at `index`,
// and `undefined` where the enumeration has none.

/**
 * The combination `enumerateCombinations({ numberOfOptionsByIndex })` has
 * at `index`, worked out directly.
 */
export function combinationAtIndex({
    numberOfOptionsByIndex,
    index,
}: {
    numberOfOptionsByIndex: number[];
    index: number;
}): number[] | undefined {
    const numberOfIndices = numberOfOptionsByIndex.length;

    if (numberOfIndices === 0 || !Number.isInteger(index) || index < 0) {
        return undefined;
    }

    const gcds: number[][] = [];
    for (let ind1 = 0; ind1 < numberOfIndices; ind1++) {
        const g: number[] = [];
        for (let ind2 = 0; ind2 < ind1; ind2++) {
            g.push(
                gcd(numberOfOptionsByIndex[ind1], numberOfOptionsByIndex[ind2]),
            );
        }
        gcds.push(g);
    }
    const maxGCD = gcds.flat().reduce((a, c) => Math.max(a, c), 1);

    if (maxGCD === 1) {
        const totalCombinations = numberOfOptionsByIndex.reduce(
            (a, c) => a * c,
        );
        if (index >= totalCombinations) {
            return undefined;
        }
        return numberOfOptionsByIndex.map((x) => index % x);
    }

    if (numberOfIndices === 2) {
        const computedLcm = lcm(
            numberOfOptionsByIndex[0],
            numberOfOptionsByIndex[1],
        );
        if (index >= maxGCD * computedLcm) {
            return undefined;
        }
        const offset = Math.floor(index / computedLcm);
        const ind = index % computedLcm;
        return [
            ind % numberOfOptionsByIndex[0],
            (ind + offset) % numberOfOptionsByIndex[1],
        ];
    }

    // Combine the same pair `enumerateCombinations` does: the first pair,
    // lowest index first, whose gcd is more than one and whose lcm is the
    // smallest.
    let minLCM = Infinity;
    let matchInds: number[] = [];
    for (let ind1 = 0; ind1 < numberOfIndices; ind1++) {
        for (let ind2 = 0; ind2 < ind1; ind2++) {
            if (gcds[ind1][ind2] > 1) {
                const m = lcm(
                    numberOfOptionsByIndex[ind1],
                    numberOfOptionsByIndex[ind2],
                );
                if (m < minLCM) {
                    minLCM = m;
                    matchInds = [ind2, ind1];
                }
            }
        }
    }

    const n0 = numberOfOptionsByIndex[matchInds[0]];
    const n1 = numberOfOptionsByIndex[matchInds[1]];

    const outerOptions = [...numberOfOptionsByIndex];
    outerOptions[matchInds[0]] = n0 * n1;
    outerOptions.splice(matchInds[1], 1);

    const result = combinationAtIndex({
        numberOfOptionsByIndex: outerOptions,
        index,
    });
    if (result === undefined) {
        return undefined;
    }
    const inner = combinationAtIndex({
        numberOfOptionsByIndex: [n0, n1],
        index: result[matchInds[0]],
    })!;
    result.splice(matchInds[0], 1, inner[0]);
    result.splice(matchInds[1], 0, inner[1]);

    return result;
}

/**
 * The combinations `enumerateSelectionCombinations` gives, one at a time,
 * in the same order, without a `maxNumber`.
 */
function* selectionCombinations({
    numberOfIndices,
    numberOfOptions,
    withReplacement,
    skipZero,
}: {
    numberOfIndices: number;
    numberOfOptions: number;
    withReplacement: boolean;
    skipZero: boolean;
}): Generator<number[]> {
    if (numberOfIndices <= 0) {
        yield [];
        return;
    }
    if (numberOfIndices === 1) {
        for (let x = 1; x < numberOfOptions; x++) {
            yield [x];
        }
        if (!skipZero) {
            yield [0];
        }
        return;
    }
    for (const offsets of selectionCombinations({
        numberOfIndices: numberOfIndices - 1,
        numberOfOptions,
        withReplacement,
        skipZero: !withReplacement,
    })) {
        for (let ind0 = 1; ind0 <= numberOfOptions; ind0++) {
            const combination = [
                ind0 % numberOfOptions,
                ...offsets.map((x) => (ind0 + x) % numberOfOptions),
            ];
            if (skipZero && combination.includes(0)) {
                continue;
            }
            yield combination;
        }
    }
}

/**
 * The combination `enumerateSelectionCombinations({ numberOfIndices,
 * numberOfOptions, withReplacement })` has at `index`, found without keeping
 * the combinations before it.
 *
 * Each combination of offsets gives `numberOfOptions` combinations in a row,
 * so only the combinations of offsets before the one wanted are stepped
 * through.
 */
export function selectionCombinationAtIndex({
    numberOfIndices,
    numberOfOptions,
    withReplacement,
    index,
}: {
    numberOfIndices: number;
    numberOfOptions: number;
    withReplacement: boolean;
    index: number;
}): number[] | undefined {
    if (!Number.isInteger(index) || index < 0) {
        return undefined;
    }
    if (numberOfIndices <= 1) {
        let i = 0;
        for (const combination of selectionCombinations({
            numberOfIndices,
            numberOfOptions,
            withReplacement,
            skipZero: false,
        })) {
            if (i === index) {
                return combination;
            }
            i++;
        }
        return undefined;
    }
    if (numberOfOptions <= 0) {
        return undefined;
    }

    // At the top level no combination is skipped, so the offsets are the
    // `index / numberOfOptions`-th combination of offsets.
    const offsetsIndex = Math.floor(index / numberOfOptions);
    const ind0 = (index % numberOfOptions) + 1;

    let i = 0;
    for (const offsets of selectionCombinations({
        numberOfIndices: numberOfIndices - 1,
        numberOfOptions,
        withReplacement,
        skipZero: !withReplacement,
    })) {
        if (i === offsetsIndex) {
            return [
                ind0 % numberOfOptions,
                ...offsets.map((x) => (ind0 + x) % numberOfOptions),
            ];
        }
        i++;
    }
    return undefined;
}

/**
 * The permutation `enumeratePermutations({ values })` has at `index`,
 * worked out directly: the permutations are in the order of the positions
 * picked from `values`, so `index` written in the factorial number system
 * gives the position to pick at each step.
 */
export function permutationAtIndex<T>({
    values,
    index,
}: {
    values: T[];
    index: number;
}): T[] | undefined {
    if (!Number.isInteger(index) || index < 0) {
        return undefined;
    }
    const n = values.length;

    // factorials[k] is k!
    const factorials = [1];
    for (let k = 1; k <= n; k++) {
        factorials.push(factorials[k - 1] * k);
    }
    if (index >= factorials[n]) {
        return undefined;
    }

    const remaining = [...values];
    const result: T[] = [];
    let rest = index;
    for (let k = n - 1; k >= 0; k--) {
        const pick = Math.floor(rest / factorials[k]);
        rest %= factorials[k];
        result.push(remaining.splice(pick, 1)[0]);
    }
    return result;
}
