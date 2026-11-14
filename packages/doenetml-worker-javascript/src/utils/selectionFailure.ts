/**
 * Whether a random selection can be made with the parameters it has: the
 * one test a selection makes before it draws (`<selectFromSequence>`,
 * `<selectPrimeNumbers>`, `<select>`), and the load-time check
 * (`utils/dast/choiceFeasibilityAtLoad.ts`) makes for each value its
 * parameters can take (D39, SEL-4, SEL-5). Both call these functions, so the
 * check finds a selection that can't be made exactly when the selection
 * itself would.
 *
 * Each returns the error the selection reports (its code and arguments), or
 * `null`. One failure isn't the selection's not existing: `threshold` marks
 * the rule that a selection excluding over 70% of its combinations fails
 * (`doenet-e0044`, `doenet-e0051`) though one remains, which the check
 * leaves to the selection (#2509 PR 16).
 */
import me from "math-expressions";
import {
    returnSequenceValueForIndex as returnSequenceValueForIndexJs,
    returnSequenceValues,
} from "./sequence";

/** `returnSequenceValueForIndex`, with the fields it reads optional. */
const returnSequenceValueForIndex = returnSequenceValueForIndexJs as (
    args: Record<string, any>,
) => any;
import {
    checkForExcludedCombination,
    estimateNumberOfDuplicateCombinations,
    estimateNumberOfNumberCombinationsExcluded,
    mergeContainingNumberCombinations,
} from "./excludeCombinations";
import { someValidCombination } from "./validCombinations";

const { gcd } = me.math as any;

/** Why a selection can't be made. */
export type SelectionFailure = {
    code: string;
    args?: Record<string, any>;
    /** The 70% rule, though a combination remains. */
    threshold?: boolean;
};

/**
 * The combinations `lists` excludes, as a selection of `numToSelect` reads
 * them: each cut to `numToSelect` values, those shorter dropped, and, of
 * numbers, one that contains another merged into it.
 */
export function excludedCombinationsOf(
    lists: any[][],
    numToSelect: number,
    type: string,
) {
    let excludedCombinations = lists
        .map((x) => x.slice(0, numToSelect))
        .filter((x) => x.length === numToSelect);
    if (type === "number") {
        while (true) {
            const result =
                mergeContainingNumberCombinations(excludedCombinations);
            if (result.merged) {
                excludedCombinations = result.combinations;
            } else {
                break;
            }
        }
    }
    return excludedCombinations;
}

/** What a `<selectFromSequence>` selects from, as its state has it. */
export type SequenceSelection = {
    type: string;
    from: any;
    step: any;
    length: number;
    exclude: any[];
    lowercase?: boolean;
    numToSelect: number;
    withReplacement: boolean;
    coprime: boolean;
    excludedCombinations: any[][];
};

/**
 * Whether a `<selectFromSequence>` can select (see above), and, when it
 * can, how it draws: whether it draws coprime values (`coprime` is ignored
 * with excluded combinations, for one value, and for a sequence not of
 * numbers), and how many combinations are excluded.
 */
export function sequenceSelectionFailure(selection: SequenceSelection): {
    failure: SelectionFailure | null;
    coprime: boolean;
    numCombinationsExcluded: number;
} {
    const none = { failure: null, coprime: false, numCombinationsExcluded: 0 };
    if (!(selection.numToSelect >= 1)) {
        return none;
    }
    const numUniqueRequired = selection.withReplacement
        ? 1
        : selection.numToSelect;

    if (numUniqueRequired > selection.length) {
        return {
            ...none,
            failure: {
                code: "doenet-e0036",
                args: {
                    numToSelect: numUniqueRequired,
                    length: selection.length,
                },
            },
        };
    }

    let numCombinationsExcluded = selection.excludedCombinations.length;
    let coprime = selection.coprime;

    if (selection.type === "number") {
        numCombinationsExcluded = estimateNumberOfNumberCombinationsExcluded({
            excludedCombinations: selection.excludedCombinations,
            numValues: selection.length - selection.exclude.length,
            withReplacement: selection.withReplacement,
            numToSelect: selection.numToSelect,
        });

        if (coprime) {
            const lastNumber =
                selection.from + (selection.length - 1) * selection.step;
            let failure: SelectionFailure | null = null;
            if (numCombinationsExcluded > 0) {
                coprime = false;
            } else if (
                !Number.isInteger(selection.from) ||
                !Number.isInteger(selection.step) ||
                selection.from <= 0 ||
                lastNumber <= 0
            ) {
                failure = { code: "doenet-e0041" };
            } else if (gcd(selection.from, selection.step) !== 1) {
                failure = { code: "doenet-e0042" };
            } else if (selection.numToSelect === 1) {
                coprime = false;
            } else if (selection.length - selection.exclude.length <= 1) {
                // only one number to choose from, which can't be coprime with
                // itself unless it is 1
                if (
                    (selection.from > 1 || selection.exclude.includes(1)) &&
                    (selection.length <= 1 ||
                        returnSequenceValues(selection as any).length <= 1)
                ) {
                    failure = { code: "doenet-e0043" };
                }
            }

            // every value sharing a factor, which only an `exclude` can make,
            // as `from` and `step` have none
            if (
                !failure &&
                coprime &&
                selection.exclude.length > 0 &&
                !valuesHaveNoCommonFactor(selection)
            ) {
                failure = { code: "doenet-e0045" };
            }
            if (failure) {
                return { ...none, failure };
            }
        }
    } else {
        coprime = false;
    }

    if (numCombinationsExcluded === 0 && !coprime) {
        // drawing from the values: enough of them, without replacement
        if (
            !(
                selection.exclude.length + numUniqueRequired <
                0.5 * selection.length
            )
        ) {
            const numPossibleValues = returnSequenceValues(
                selection as any,
            ).length;
            if (numUniqueRequired > numPossibleValues) {
                return {
                    ...none,
                    failure: {
                        code: "doenet-e0046",
                        args: {
                            numToSelect: numUniqueRequired,
                            numPossibleValues,
                        },
                    },
                };
            }
        }
        return { failure: null, coprime, numCombinationsExcluded };
    }

    // with combinations excluded, or coprime
    const failure = combinationsFailure({
        numCombinationsExcluded,
        numValues: () => {
            let n = 0;
            for (let index = 0; index < selection.length; index++) {
                if (
                    returnSequenceValueForIndex({
                        index,
                        from: selection.from,
                        step: selection.step,
                        length: selection.length,
                        exclude: selection.exclude,
                        type: selection.type,
                    }) !== null
                ) {
                    n++;
                }
            }
            return n;
        },
        lowerBoundNumValues: selection.length - selection.exclude.length,
        numToSelect: selection.numToSelect,
        withReplacement: selection.withReplacement,
        excludedCombinations: selection.excludedCombinations,
        type: selection.type,
        thresholdCode: "doenet-e0044",
        space: sequenceSpace(selection, coprime),
        noneCode: coprime ? "doenet-e0045" : "doenet-e0044",
    });
    return { failure, coprime, numCombinationsExcluded };
}

/**
 * The combinations a `<selectFromSequence>` with excluded combinations, or
 * `coprime`, draws from: those of the sequence's values, excluded values
 * left out, that aren't an excluded combination and, with `coprime`, have
 * no common factor.
 */
export function sequenceSpace(selection: SequenceSelection, coprime: boolean) {
    return {
        numValues: selection.length,
        numToSelect: selection.numToSelect,
        withReplacement: selection.withReplacement,
        valueAt: (index: number) =>
            returnSequenceValueForIndex({
                index,
                from: selection.from,
                step: selection.step,
                exclude: selection.exclude,
                type: selection.type,
                lowercase: selection.lowercase,
            }),
        isValid: (values: any[]) =>
            (selection.excludedCombinations.length === 0 ||
                !checkForExcludedCombination({
                    type: selection.type,
                    excludedCombinations: selection.excludedCombinations,
                    values,
                })) &&
            // the values are integers, as `coprime` requires
            (!coprime || integerGcd(values) === 1),
    };
}

/** What a `<selectPrimeNumbers>` selects from, as its state has it. */
export type PrimeSelection = {
    possibleValues: number[];
    numToSelect: number;
    withReplacement: boolean;
    excludedCombinations: any[][];
};

/** Whether a `<selectPrimeNumbers>` can select (see above). */
export function primeSelectionFailure(
    selection: PrimeSelection,
): SelectionFailure | null {
    if (!(selection.numToSelect >= 1)) {
        return null;
    }
    const numUniqueRequired = selection.withReplacement
        ? 1
        : selection.numToSelect;
    const possibleValues = selection.possibleValues;
    const numValues = possibleValues.length;
    if (numUniqueRequired > numValues) {
        return {
            code: "doenet-e0047",
            args: { numToSelect: numUniqueRequired, numValues },
        };
    }
    const numCombinationsExcluded = estimateNumberOfNumberCombinationsExcluded({
        excludedCombinations: selection.excludedCombinations,
        numValues,
        withReplacement: selection.withReplacement,
        numToSelect: selection.numToSelect,
    });
    if (numCombinationsExcluded === 0) {
        return null;
    }
    return combinationsFailure({
        numCombinationsExcluded,
        numValues: () => numValues,
        lowerBoundNumValues: numValues,
        numToSelect: selection.numToSelect,
        withReplacement: selection.withReplacement,
        excludedCombinations: selection.excludedCombinations,
        type: "number",
        thresholdCode: "doenet-e0051",
        space: primeSpace(selection),
        noneCode: "doenet-e0051",
    });
}

/**
 * The combinations a `<selectPrimeNumbers>` with excluded combinations draws
 * from: those of the primes that aren't an excluded combination.
 */
export function primeSpace(selection: PrimeSelection) {
    return {
        numValues: selection.possibleValues.length,
        numToSelect: selection.numToSelect,
        withReplacement: selection.withReplacement,
        valueAt: (index: number) => selection.possibleValues[index],
        isValid: (values: any[]) =>
            !checkForExcludedCombination({
                type: "number",
                excludedCombinations: selection.excludedCombinations,
                values,
            }),
    };
}

/**
 * Whether a selection whose combinations are constrained can select: the
 * 70% rule (`threshold`), and then whether a valid combination exists,
 * decided before any draw.
 */
function combinationsFailure({
    numCombinationsExcluded,
    numValues,
    lowerBoundNumValues,
    numToSelect,
    withReplacement,
    excludedCombinations,
    type,
    thresholdCode,
    space,
    noneCode,
}: {
    numCombinationsExcluded: number;
    numValues: () => number;
    lowerBoundNumValues: number;
    numToSelect: number;
    withReplacement: boolean;
    excludedCombinations: any[][];
    type: string;
    thresholdCode: string;
    space: Parameters<typeof someValidCombination>[0];
    noneCode: string;
}): SelectionFailure | null {
    const orderedCount = (n: number) => {
        if (withReplacement) {
            return Math.pow(n, numToSelect);
        }
        let count = n;
        for (let i = 1; i < numToSelect; i++) {
            count *= n - i;
        }
        return count;
    };
    let excluded = numCombinationsExcluded;
    if (excluded > 0.7 * orderedCount(lowerBoundNumValues)) {
        // may have excluded over 70% of combinations: count them
        const numPossibilities = orderedCount(numValues());
        if (excluded > 0.7 * numPossibilities) {
            // a combination naming NaN can name the same one twice
            if (
                type === "number" &&
                excludedCombinations.some((x) => x.some(Number.isNaN))
            ) {
                excluded -= estimateNumberOfDuplicateCombinations(
                    excludedCombinations,
                    lowerBoundNumValues,
                    withReplacement,
                );
            }
            if (excluded > 0.7 * numPossibilities) {
                return {
                    code: thresholdCode,
                    threshold: someValidCombination(space),
                };
            }
        }
    }
    if (!someValidCombination(space)) {
        return { code: noneCode };
    }
    return null;
}

/**
 * The greatest common divisor of the integers `values`, by Euclid's
 * algorithm.
 */
export function integerGcd(values: number[]) {
    let divisor = 0;
    for (const value of values) {
        let a = Math.abs(divisor);
        let b = Math.abs(value);
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        divisor = a;
    }
    return divisor;
}

/**
 * Whether the values of the number sequence `selection`, those not
 * excluded, have no common factor. Stops at the first values that show it.
 */
function valuesHaveNoCommonFactor(selection: SequenceSelection) {
    let divisor = 0;
    for (let index = 0; index < selection.length; index++) {
        const value = returnSequenceValueForIndex({
            index,
            from: selection.from,
            step: selection.step,
            exclude: selection.exclude,
            type: selection.type,
        });
        if (value === null) {
            continue;
        }
        divisor = gcd(divisor, value);
        if (divisor === 1) {
            return true;
        }
    }
    return false;
}

/**
 * Whether a `<select>` can select `numToSelect` of `numOptions` options:
 * `doenet-e0035` when more are to be selected without replacement than it
 * has. With none, or none to select, it selects nothing.
 */
export function optionSelectionFailure({
    numOptions,
    numToSelect,
    withReplacement,
}: {
    numOptions: number;
    numToSelect: number;
    withReplacement: boolean;
}): SelectionFailure | null {
    if (!(numToSelect >= 1) || numOptions === 0) {
        return null;
    }
    const numUniqueRequired = withReplacement ? 1 : numToSelect;
    if (numUniqueRequired > numOptions) {
        return {
            code: "doenet-e0035",
            args: { numToSelect: numUniqueRequired, numOptions },
        };
    }
    return null;
}

/**
 * Whether the options a `<select>` has for each variant name
 * (`selectForVariants`), `numOptionsByVariant`, are `numToSelect` for every
 * name, as a variant picks all of them: `doenet-e0032` for the first that
 * isn't.
 */
export function variantCountFailure(
    numOptionsByVariant: Record<string, number>,
    numToSelect: number,
): SelectionFailure | null {
    for (const [variantName, numOptions] of Object.entries(
        numOptionsByVariant,
    )) {
        if (numOptions !== numToSelect) {
            return {
                code: "doenet-e0032",
                args: { variantName, numOptions, numToSelect },
            };
        }
    }
    return null;
}
