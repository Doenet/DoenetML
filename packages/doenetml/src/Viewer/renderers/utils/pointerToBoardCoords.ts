import { JXGBoard } from "../jsxgraph-distrib/types";

type PointerLikeEvent = {
    x: number;
    y: number;
};

/**
 * Convert a pointer event's screen coordinates to user (board) coordinates,
 * using the object's screen-space position at pointerdown as the reference.
 *
 * This is preferred over `obj.X()` / `obj.Y()` directly because those getters
 * are affected by `setCoordinates` calls during `update()`. When the dragged
 * object is constrained by attractors or other dependencies, computing from
 * the actual pointer delta keeps the dragged location aligned with the cursor
 * even when the object snaps elsewhere.
 *
 * `objectAtDownScrCoords` should be the object's `coords.scrCoords` at
 * pointerdown — a 3-element JSXgraph homogeneous coordinate `[w, x, y]`.
 */
export function pointerEventToUserCoords(
    e: PointerLikeEvent,
    pointerAtDown: [number, number],
    objectAtDownScrCoords: [number, number, number],
    board: JXGBoard,
): [number, number] {
    const o = board.origin.scrCoords;
    const x =
        (objectAtDownScrCoords[1] + e.x - pointerAtDown[0] - o[1]) /
        board.unitX;
    const y =
        (o[2] - (objectAtDownScrCoords[2] + e.y - pointerAtDown[1])) /
        board.unitY;
    return [x, y];
}
