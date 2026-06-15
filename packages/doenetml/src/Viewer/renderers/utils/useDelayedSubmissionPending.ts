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
};

/**
 * Hook for delayed submission pending UI feedback.
 *
 * Shows a "Checking..." message only if submission takes longer than the specified delay.
 * Prevents duplicate submissions while in-flight. Automatically clears the pending state
 * when validation completes (via validationState change from "unvalidated") or when a new
 * answer is submitted (via justSubmitted flag).
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

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const submitActionWithPending = React.useCallback(() => {
        const alreadyValidated = validationState !== "unvalidated";

        if (alreadyValidated && !allowSubmitWhenValidated) {
            return;
        }

        if (alreadyValidated) {
            submitAction();
            return;
        }

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
