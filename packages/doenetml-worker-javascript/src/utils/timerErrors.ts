/**
 * Centralized labels for `reportTimerError`. Using `as const` makes typos
 * a compile error and keeps the namespace in one place.
 */
export const TimerLabels = {
    autoSubmit: "auto-submit answers",
    scheduledSaveState: "scheduled saveState",
    throttledSaveChanges: "throttled saveChangesToDatabase",
    submissionSaveState: "submission saveState",
    visibilityPeriodicSend: "visibility periodic send",
    visibilityResumeSend: "visibility resume send",
    visibilityAutoSuspend: "visibility auto-suspend",
    firstVisibleSend: "first-visible visibility send",
    generateDastSaveState: "saveState (generateDast epilogue)",
    navigateToComponent: "navigate to component",
} as const;

export type TimerLabel = (typeof TimerLabels)[keyof typeof TimerLabels];

/**
 * Returns a `.catch` handler that logs errors from fire-and-forget Promises
 * launched inside `setTimeout` callbacks. Per AGENTS.md, intentionally
 * unawaited Promises must attach an explicit rejection handler.
 *
 * Pass a value from `TimerLabels` so the namespace stays centralized:
 * `asyncCall().catch(reportTimerError(TimerLabels.scheduledSaveState));`
 */
export function reportTimerError(label: TimerLabel) {
    return (error: unknown) => {
        console.error(`Error in ${label}:`, error);
    };
}
