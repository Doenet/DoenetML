import React, { useCallback } from "react";
import { useDelayedSubmissionPending } from "./useDelayedSubmissionPending";
import type { ValidationState } from "./checkWork";

type UseSubmitActionWithDelayProps = {
    /** The action key to call: "submitAnswer" or "submitAllAnswers" */
    actionKey: "submitAnswer" | "submitAllAnswers";
    /** Actions object containing the action to call */
    actions: Record<string, any>;
    /** Function to invoke the action */
    callAction: (params: { action: any }) => void;
    /** Current validation state of the answer */
    validationState: ValidationState;
    /** Whether the answer was just submitted */
    justSubmitted?: boolean;
    /** Optional delay in milliseconds before showing pending UI (default: 500ms) */
    delayMs?: number;
};

/**
 * Creates a submit handler that shows delayed "pending" feedback for answer checks.
 *
 * Use this hook when a renderer needs to submit an answer (or submit all answers)
 * through `callAction` and wants pending UI behavior that:
 * - ignores duplicate submit attempts while one is in flight
 * - waits briefly before showing pending state (to avoid flicker on fast responses)
 * - clears pending state when validation completes
 *
 * Inputs:
 * - `actionKey`: which action to submit (`submitAnswer` or `submitAllAnswers`)
 * - `actions` and `callAction`: used to invoke the selected action
 * - `validationState` and `justSubmitted`: used to control pending lifecycle
 * - `delayMs` (optional): delay before pending UI is shown
 *
 * Returns:
 * - `isPending`: whether UI should show a pending/checking state
 * - `submitActionWithPending`: call this instead of calling `callAction` directly
 */
export function useSubmitActionWithDelay({
    actionKey,
    actions,
    callAction,
    validationState,
    justSubmitted,
    delayMs = 500,
}: UseSubmitActionWithDelayProps) {
    const submitCallback = useCallback(
        () => callAction({ action: actions[actionKey] }),
        [actions[actionKey], callAction],
    );

    const { isPending, submitActionWithPending } = useDelayedSubmissionPending({
        submitAction: submitCallback,
        validationState,
        justSubmitted,
        delayMs,
    });

    return { isPending, submitActionWithPending };
}
