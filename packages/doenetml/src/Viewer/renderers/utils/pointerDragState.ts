import { useRef } from "react";

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
    pointerAtDown: React.MutableRefObject<[number, number] | null>;
    pointerIsDown: React.MutableRefObject<boolean>;
    pointerMovedSinceDown: React.MutableRefObject<boolean>;
    dragged: React.MutableRefObject<boolean>;
}

export function usePointerDragState(): PointerDragState {
    return {
        pointerAtDown: useRef<[number, number] | null>(null),
        pointerIsDown: useRef(false),
        pointerMovedSinceDown: useRef(false),
        dragged: useRef(false),
    };
}
