import { useMemo, useRef } from "react";

/**
 * Bundle of refs every JSXgraph-renderable graphical component needs to track
 * pointer interaction across the down → move → up sequence.
 *
 * - `pointerAtDown` records the screen coordinates at pointerdown so drag
 *   handlers can compute pointer deltas.
 * - `pointerIsDown` and `pointerMovedSinceDown` are used by `useBoardPointerTracking`
 *   to detect whether the pointer has moved a meaningful distance since the
 *   last pointerdown — used to differentiate clicks from drags.
 * - `dragged` is set by drag handlers once the pointer crosses the drag
 *   threshold; click handlers consult it to decide whether to treat an up
 *   event as a click or as the end of a drag.
 */
export interface PointerDragState {
    pointerAtDown: React.RefObject<[number, number] | null>;
    pointerIsDown: React.RefObject<boolean>;
    pointerMovedSinceDown: React.RefObject<boolean>;
    dragged: React.RefObject<boolean>;
}

export function usePointerDragState(): PointerDragState {
    const pointerAtDown = useRef<[number, number] | null>(null);
    const pointerIsDown = useRef(false);
    const pointerMovedSinceDown = useRef(false);
    const dragged = useRef(false);
    // Memoize the wrapper object so consumers that list `dragState` in
    // useEffect deps (e.g. useBoardPointerTracking) don't re-run on every
    // render. The refs themselves are stable; this just stabilizes the
    // wrapper identity around them.
    return useMemo(
        () => ({
            pointerAtDown,
            pointerIsDown,
            pointerMovedSinceDown,
            dragged,
        }),
        [],
    );
}
