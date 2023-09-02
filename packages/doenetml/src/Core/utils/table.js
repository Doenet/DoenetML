import { lettersToNumber } from "@doenet/utils";

// Convert letter string or number index starting with 1)
// to number index starting with 0
// (Author can index tables with the letter/1-based number system
// while the internals of the code use a 0-based number system)
export function normalizeIndex(numberOrLetter) {
    if (numberOrLetter === null) {
        return undefined;
    }

    if (numberOrLetter === "") {
        return undefined;
    }

    if (Number.isFinite(Number(numberOrLetter))) {
        return Number(numberOrLetter) - 1;
    }

    if (typeof numberOrLetter !== "string") {
        return undefined;
    }

    return lettersToNumber(numberOrLetter) - 1;
}
