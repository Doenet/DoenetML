import React from "react";

type UseDelayedSubmissionPendingOptions = {
    delayMs?: number;
    submitAction: () => void;
    validationState: string;
    justSubmitted?: boolean;
};

export function useDelayedSubmissionPending({
    delayMs = 500,
    submitAction,
    validationState,
    justSubmitted,
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
    }, [delayMs, submitAction]);

    return {
        isPending,
        submitActionWithPending,
    };
}
