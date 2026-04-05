type CompletionStatus = string | null;

/**
 * The trailing word segment currently being edited inside a ref path.
 *
 * For `$P.coords`, the token tracked near the cursor is `coords`, while `$P.`
 * remains outside the token and is modeled separately via `tokenPrefixChar`.
 */
export type WordToken = {
    from: number;
    text: string;
};

/**
 * One in-token reopen opportunity after completion closes on an unmatched
 * tail extension (e.g. "$P.coorx").
 *
 * If the user immediately backspaces to the last matched prefix ("$P.coor"),
 * autocomplete may reopen.
 */
export type ReopenLatch = {
    tokenFrom: number;
    previousTokenText: string;
    docVersion: number;
};

export type ReopenLatchTransitionInput = {
    reopenLatch: ReopenLatch | null;
    docVersion: number;
    previousToken: WordToken | null;
    currentToken: WordToken | null;
    tokenPrefixChar: string;
    isDeleteEvent: boolean;
    deletedCount: number;
    insertedCount: number;
};

/**
 * Whether the current edit should reopen autocomplete now, and whether the
 * latch remains eligible for exactly one more related tail edit.
 */
export type ReopenLatchTransitionResult = {
    shouldReopenFromLatch: boolean;
    keepReopenLatchForNextChange: boolean;
};

/**
 * Data needed to detect the specific transition where an active completion list
 * disappears after a single-character tail insert into the same token.
 */
export type CreateLatchFromCloseTransitionInput = {
    prevCompletionStatus: CompletionStatus;
    nextCompletionStatus: CompletionStatus;
    insertedCount: number;
    deletedCount: number;
    currentToken: WordToken | null;
    previousToken: WordToken | null;
    tokenPrefixChar: string;
    docVersion: number;
};

function isRefTokenPrefixChar(char: string) {
    return char === "$" || char === ".";
}

/**
 * Evaluate whether the current doc change should preserve or consume a reopen latch.
 *
 * The latch is only valid for edits that stay in the same token and are simple
 * tail insert/delete operations. Reopen is requested only on a tail delete that
 * returns to the previously matched token text.
 */
export function evaluateReopenLatchTransition({
    reopenLatch,
    docVersion,
    previousToken,
    currentToken,
    tokenPrefixChar,
    isDeleteEvent,
    deletedCount,
    insertedCount,
}: ReopenLatchTransitionInput): ReopenLatchTransitionResult {
    if (
        !reopenLatch ||
        reopenLatch.docVersion !== docVersion ||
        !previousToken ||
        !currentToken ||
        previousToken.from !== reopenLatch.tokenFrom ||
        currentToken.from !== reopenLatch.tokenFrom ||
        !isRefTokenPrefixChar(tokenPrefixChar)
    ) {
        return {
            shouldReopenFromLatch: false,
            keepReopenLatchForNextChange: false,
        };
    }

    const isTailInsert =
        insertedCount === 1 &&
        deletedCount === 0 &&
        currentToken.text.startsWith(previousToken.text) &&
        currentToken.text.length === previousToken.text.length + 1;

    const isTailDelete =
        isDeleteEvent &&
        deletedCount === 1 &&
        insertedCount === 0 &&
        previousToken.text.startsWith(currentToken.text) &&
        previousToken.text.length === currentToken.text.length + 1;

    return {
        shouldReopenFromLatch:
            isTailDelete &&
            previousToken.from === currentToken.from &&
            currentToken.text === reopenLatch.previousTokenText &&
            previousToken.text !== currentToken.text,
        keepReopenLatchForNextChange: isTailInsert || isTailDelete,
    };
}

/**
 * Arm a reopen latch when completion closes because a one-character tail insert
 * turns a previously matching token into a non-matching token.
 */
export function createReopenLatchFromCloseTransition({
    prevCompletionStatus,
    nextCompletionStatus,
    insertedCount,
    deletedCount,
    currentToken,
    previousToken,
    tokenPrefixChar,
    docVersion,
}: CreateLatchFromCloseTransitionInput): ReopenLatch | null {
    if (
        !prevCompletionStatus ||
        nextCompletionStatus ||
        insertedCount !== 1 ||
        deletedCount !== 0 ||
        !currentToken ||
        !previousToken ||
        !isRefTokenPrefixChar(tokenPrefixChar)
    ) {
        return null;
    }

    if (
        previousToken.from === currentToken.from &&
        currentToken.text.startsWith(previousToken.text) &&
        currentToken.text.length === previousToken.text.length + 1
    ) {
        return {
            tokenFrom: currentToken.from,
            previousTokenText: previousToken.text,
            docVersion: docVersion + 1,
        };
    }

    return null;
}
