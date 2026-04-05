type CompletionStatus = string | null;

/**
 * Latch contract for Doenet reference autocomplete reopen behavior.
 *
 * Motivation:
 * - CodeMirror completion can close when a ref token temporarily stops matching
 *   any option (for example: `$P.coorx`).
 * - For Doenet refs, users expect autocomplete to reopen as soon as they delete
 *   back to a previously matching prefix (for example: back to `$P.coor`).
 *
 * Contract:
 * - A latch is armed only when completion transitions from open -> closed after
 *   a single-character tail insert on the same ref token.
 * - While armed, related tail edits (single-character tail insert/delete in the
 *   same token, with `$`/`.` prefix context) can refresh the latch.
 * - Reopen is requested only on a qualifying tail delete that returns token text
 *   to the previously matched prefix captured in the latch.
 *
 * Non-goals and invalidation:
 * - No reopen after cursor movement, non-tail edits, unrelated edits, explicit
 *   dismissal, or token/prefix-context changes.
 * - This mechanism only models in-token ref editing; it does not provide a
 *   general completion reopen policy.
 *
 * Behavioral coverage:
 * - See Cypress component tests in
 *   `packages/codemirror/test/cypress/component/autocomplete.cy.tsx`, especially
 *   the reopen and no-reopen scenarios around `$P.coor...` transitions.
 */

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
 * In-token reopen state after completion closes on an unmatched tail
 * extension (e.g. "$P.coorx").
 *
 * If the user backspaces to the last matched prefix ("$P.coor"), autocomplete
 * may reopen. Consecutive related tail edits can keep this latch alive.
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
 * latch remains eligible for the next related tail edit.
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
 * tail insert/delete operations. Reopen is requested on a tail delete that
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
