import { useEffect } from "react";
import { JXGBoard, JXGEvent } from "../jsxgraph-distrib/types";
import { POINTER_DRAG_THRESHOLD } from "./graph";
import { PointerDragState } from "./pointerDragState";

/**
 * Subscribe to the board's `move` event and flip
 * `dragState.pointerMovedSinceDown` once the pointer crosses the drag
 * threshold. This is the standard pattern that lets click handlers
 * differentiate "click" (no movement since down) from "click after drag"
 * (movement crossed the threshold) without each handler reimplementing the
 * tracking logic.
 *
 * Re-subscribes whenever the board reference changes; safely cleans up the
 * subscription on unmount.
 */
export function useBoardPointerTracking(
    board: JXGBoard | null,
    dragState: PointerDragState,
    threshold: number = POINTER_DRAG_THRESHOLD,
): void {
    useEffect(() => {
        if (!board) {
            return;
        }
        function handler(e: JXGEvent) {
            const pointerAtDown = dragState.pointerAtDown.current;
            if (!dragState.pointerIsDown.current || !pointerAtDown) {
                return;
            }
            if (
                Math.abs(e.x - pointerAtDown[0]) > threshold ||
                Math.abs(e.y - pointerAtDown[1]) > threshold
            ) {
                dragState.pointerMovedSinceDown.current = true;
            }
        }
        board.on("move", handler);
        return () => {
            board.off("move", handler);
        };
    }, [board, dragState, threshold]);
}
