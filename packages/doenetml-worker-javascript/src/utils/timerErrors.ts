/**
 * Returns a `.catch` handler that logs errors from fire-and-forget Promises
 * launched inside `setTimeout` callbacks. Per AGENTS.md, intentionally
 * unawaited Promises must attach an explicit rejection handler.
 *
 * Usage: `asyncCall().catch(reportTimerError("descriptive label"));`
 */
export function reportTimerError(label: string) {
    return (error: unknown) => {
        console.error(`Error in ${label}:`, error);
    };
}
