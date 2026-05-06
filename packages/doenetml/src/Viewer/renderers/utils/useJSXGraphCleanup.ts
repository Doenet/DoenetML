import { useEffect, type RefObject } from "react";

/**
 * Run the standard JSXgraph teardown on unmount: cancel any pending initial
 * label-placement timers, then call the renderer's `destroy` if the primary
 * object ref is still populated.
 *
 * Contract: `objectRef.current` must be `null` (not `undefined`) when empty —
 * the hook treats anything else as a populated object and calls `destroy()`.
 *
 * The empty-deps `useEffect` captures `destroy` from the first render. That
 * matches the pre-existing per-renderer pattern: `destroy` reads
 * `objectRef.current` (always live) and other live refs, so a stale closure
 * around the function itself is harmless.
 */
export function useJSXGraphCleanup<T>({
    objectRef,
    destroy,
    cancelLabelPlacementRef,
}: {
    objectRef: RefObject<T | null>;
    destroy: () => void;
    cancelLabelPlacementRef?: RefObject<(() => void) | null>;
}): void {
    useEffect(() => {
        return () => {
            cancelLabelPlacementRef?.current?.();
            if (objectRef.current !== null) {
                destroy();
            }
        };
    }, []);
}
