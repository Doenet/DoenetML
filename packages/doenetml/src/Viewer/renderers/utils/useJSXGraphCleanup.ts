import { useEffect, type MutableRefObject } from "react";

/**
 * Run the standard JSXgraph teardown on unmount: cancel any pending initial
 * label-placement timers, then call the renderer's `destroy` if the primary
 * object ref is still populated.
 *
 * The empty-deps `useEffect` captures `destroy` from the first render. That
 * matches the pre-existing per-renderer pattern: `destroy` reads
 * `objectRef.current` (always live) and other live refs, so a stale closure
 * around the function itself is harmless.
 */
export function useJSXGraphCleanup({
    objectRef,
    destroy,
    cancelLabelPlacementRef,
}: {
    objectRef: MutableRefObject<unknown>;
    destroy: () => void;
    cancelLabelPlacementRef?: MutableRefObject<(() => void) | null>;
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
