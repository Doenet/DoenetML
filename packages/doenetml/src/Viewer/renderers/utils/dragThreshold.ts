import { POINTER_DRAG_THRESHOLD } from "./graph";

type DragLikeEvent = {
    type: string;
    x: number;
    y: number;
};

/**
 * Whether a JSXgraph drag event represents a real drag (versus an unintended
 * micro-movement during a click).
 *
 * Returns `true` when either:
 *   - the event was not pointer-driven (keyboard/programmatic moves are always
 *     considered intentional), or
 *   - the pointer moved more than `threshold` pixels in either axis since
 *     pointerdown.
 *
 * Returns `false` if `pointerAtDown` has not been recorded yet.
 */
export function exceededDragThreshold(
    e: DragLikeEvent,
    pointerAtDown: [number, number] | null,
    threshold: number = POINTER_DRAG_THRESHOLD,
): boolean {
    const viaPointer = e.type === "pointermove";
    if (!viaPointer) {
        return true;
    }
    if (pointerAtDown === null) {
        return false;
    }
    return (
        Math.abs(e.x - pointerAtDown[0]) > threshold ||
        Math.abs(e.y - pointerAtDown[1]) > threshold
    );
}
