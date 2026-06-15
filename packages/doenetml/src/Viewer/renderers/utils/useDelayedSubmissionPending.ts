import React from "react";
import type { ValidationState } from "./checkWork";

type UseDelayedSubmissionPendingOptions = {
    /** Delay in milliseconds before showing pending UI (default: 500ms) */
    delayMs?: number;
    /** Function to call to submit the answer or section-wide answers */
    submitAction: () => void;
    /** Current validation state of the answer or section-wide button */
    validationState: ValidationState;
    /** Whether the answer or section-wide answers were just submitted */
    justSubmitted?: boolean;
    /**
     * Whether to allow submissions when the component is already validated.
     * Used by section-wide check work, where pressing the already-validated
     * button again still counts as an attempt.
     */
    allowSubmitWhenValidated?: boolean;
    /**
     * A monotonically-increasing submission counter (the section-wide
     * `numSubmissions`). Used to clear the in-flight guard for already-validated
     * re-submissions, where `validationState`/`justSubmitted` need not change.
     */
    submissionCount?: number;
};

/**
 * Hook for delayed submission pending UI feedback.
 *
 * Shows a "Checking..." message only if submission takes longer than the specified delay.
 * Prevents duplicate submissions (e.g. a double-click) while one is in-flight.
 * The in-flight guard is cleared when validation completes (via validationState
 * change from "unvalidated"), when a new answer is submitted (via justSubmitted),
 * or when `submissionCount` changes.
 *
 * When `allowSubmitWhenValidated` is true, already-validated submissions are
 * forwarded too, so repeated section-wide button presses can count as attempts
 * even if the validation state itself does not change; the in-flight guard then
 * relies on `submissionCount` to reset.
 *
 * The delay default (500ms) balances user experience:
 * - Avoids flashing spinners for quick validations
 * - Shows feedback for slow network/computation requests
 *
 * @returns Object with isPending state and submitActionWithPending function
 */
export function useDelayedSubmissionPending({
    delayMs = 500,
    submitAction,
    validationState,
    justSubmitted,
    allowSubmitWhenValidated = false,
    submissionCount,
}: UseDelayedSubmissionPendingOptions) {
    const [isPending, setIsPending] = React.useState(false);
    const isSubmissionInFlight = React.useRef(false);
    const timeoutRef = React.useRef<number | null>(null);

    const clearPending = React.useCallback(() => {
        isSubmissionInFlight.current = false;
        setIsPending(false);
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    React.useEffect(() => {
        if (!isSubmissionInFlight.current) {
            return;
        }

        if (justSubmitted || validationState !== "unvalidated") {
            clearPending();
        }
    }, [clearPending, justSubmitted, validationState]);

    // Clear the in-flight guard once a submission has registered. For
    // already-validated re-submissions this is the only reliable signal, since
    // `validationState` and `justSubmitted` need not change between presses.
    React.useEffect(() => {
        if (isSubmissionInFlight.current) {
            clearPending();
        }
    }, [clearPending, submissionCount]);

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const submitActionWithPending = React.useCallback(() => {
        const alreadyValidated = validationState !== "unvalidated";

        // Normally a validated component does not re-submit; section-wide check
        // work is the exception (each press counts as an attempt).
        if (alreadyValidated && !allowSubmitWhenValidated) {
            return;
        }

        // Ignore duplicate presses (e.g. a double-click) while a submission is
        // already in flight, so a single user gesture cannot burn multiple
        // attempts.
        if (isSubmissionInFlight.current) {
            return;
        }

        isSubmissionInFlight.current = true;
        setIsPending(false);

        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        timeoutRef.current = window.setTimeout(() => {
            if (isSubmissionInFlight.current) {
                setIsPending(true);
            }
            timeoutRef.current = null;
        }, delayMs);

        submitAction();
    }, [allowSubmitWhenValidated, delayMs, submitAction, validationState]);

    return {
        isPending,
        submitActionWithPending,
    };
}
