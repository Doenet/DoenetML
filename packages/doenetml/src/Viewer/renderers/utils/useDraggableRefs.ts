import { useRef, type MutableRefObject } from "react";
import type { DraggableGraphicalSVs } from "./graphicalSVs";

/**
 * Bookkeeping refs that every draggable JSXgraph renderer needs.
 *
 * `fixed` and `fixLocation` mirror the SVs but are kept in refs so that
 * event handlers (registered once at JXG-create time) read the current
 * value rather than a stale closure capture.
 *
 * `lastPositionFromCore` is the renderer's source-of-truth coordinates
 * received from the worker; drag handlers reset the JXG element back to
 * this value after dispatching a transient move action.
 *
 * Renderers with additional draggable-related state (e.g. `switchable`,
 * `endpointsFixed`, off-graph indicators) keep those refs local — this
 * hook only owns the universal triple.
 */
export function useDraggableRefs<TPos>(
    SVs: DraggableGraphicalSVs,
    position: TPos,
): {
    lastPositionFromCore: MutableRefObject<TPos | null>;
    fixed: MutableRefObject<boolean>;
    fixLocation: MutableRefObject<boolean>;
} {
    const lastPositionFromCore = useRef<TPos | null>(null);
    const fixed = useRef(false);
    const fixLocation = useRef(false);

    lastPositionFromCore.current = position;
    fixed.current = SVs.fixed;
    fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;

    return { lastPositionFromCore, fixed, fixLocation };
}
