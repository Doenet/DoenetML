/**
 * A parsed `assignNames` value. A string is a name assigned to a replacement; a nested
 * array means "descend into that replacement and assign these names to *its* replacements".
 */
export type NamePieces = (string | NamePieces)[];

export type BreakResult =
    { success: true; pieces: NamePieces } | { success: false };

/**
 * Port of v0.6's `breakStringInPiecesBySpacesOrParens`
 * (`utils/serializedStateProcessing.js`). Splits an `assignNames` value on whitespace,
 * with parentheses creating nested groups.
 *
 * ```
 * "a b"           -> ["a", "b"]
 * "(a b) (c d)"   -> [["a", "b"], ["c", "d"]]
 * "((x)) ((y))"   -> [[["x"]], [["y"]]]
 * "(a"            -> { success: false }
 * ```
 *
 * The quirks are deliberate and match v0.6 exactly, since the documents being converted
 * were authored against them: unbalanced parentheses fail outright rather than falling
 * back to whitespace splitting, and empty groups are dropped.
 */
export function breakStringInPiecesBySpacesOrParens(
    string: string,
): BreakResult {
    if (typeof string !== "string") {
        return { success: false };
    }

    let numParens = 0;
    const pieces: NamePieces = [];

    string = string.trim();
    let beginInd = 0;

    for (let ind = 0; ind < string.length; ind++) {
        const char = string[ind];
        if (char === "(") {
            if (numParens === 0) {
                // beginning a new parenthesized piece, so whatever came before it is
                // a piece of its own
                const newPiece = string.substring(beginInd, ind).trim();
                if (newPiece.length > 0) {
                    pieces.push(newPiece);
                }
                beginInd = ind;
            }

            numParens++;
        } else if (char === ")") {
            if (numParens === 0) {
                // parens didn't match
                return { success: false };
            }
            if (numParens === 1) {
                // found the end of a parenthesized piece
                const newPiece = string.substring(beginInd + 1, ind).trim();
                if (newPiece.length > 0) {
                    // try to break it down further
                    const result =
                        breakStringInPiecesBySpacesOrParens(newPiece);
                    if (result.success === true) {
                        pieces.push(result.pieces);
                    } else {
                        pieces.push(newPiece);
                    }
                }
                beginInd = ind + 1;
            }
            numParens--;
        } else if (numParens === 0 && char.match(/\s/)) {
            const newPiece = string.substring(beginInd, ind).trim();
            if (newPiece.length > 0) {
                pieces.push(newPiece);
            }
            beginInd = ind;
        }
    }

    if (numParens !== 0) {
        // parens didn't match
        return { success: false };
    }

    const newPiece = string.substring(beginInd, string.length).trim();
    if (newPiece.length > 0) {
        pieces.push(newPiece);
    }

    return { success: true, pieces };
}

/**
 * The first plain name in `pieces`, in document order, descending into nested groups.
 * Returns `undefined` if there are no names at all.
 */
export function firstLeafName(pieces: NamePieces): string | undefined {
    for (const piece of pieces) {
        if (typeof piece === "string") {
            return piece;
        }
        const nested = firstLeafName(piece);
        if (nested !== undefined) {
            return nested;
        }
    }
    return undefined;
}
