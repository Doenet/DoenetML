import { useEffect, useRef, useState } from "react";
import { JXGBoard } from "../jsxgraph-distrib/types";

/**
 * Re-render the calling renderer when the board's bounding box changes and
 * `needsRerender` says the change affects how it is drawn.
 *
 * A renderer that places itself relative to the graph's edges (an off-graph
 * indicator, a label moved away from an edge) reads the bounding box while it
 * renders. The graph applies a new bounding box from its own effect, which
 * runs after its children have rendered, and panning or zooming changes the
 * bounding box without the children's state variables changing at all. Either
 * way the child would keep the drawing it computed from the old bounding box,
 * so it listens for the change itself.
 *
 * `needsRerender` is read from the latest render, so it may close over the
 * current state variables.
 */
export function useRerenderOnBoundingBoxChange(
    board: JXGBoard | null,
    needsRerender: () => boolean,
): void {
    const [, setBoundingBoxVersion] = useState(0);
    const needsRerenderRef = useRef(needsRerender);
    needsRerenderRef.current = needsRerender;

    useEffect(() => {
        if (!board) {
            return;
        }
        function handler() {
            if (needsRerenderRef.current()) {
                setBoundingBoxVersion((v) => v + 1);
            }
        }
        board.on("boundingbox", handler);
        return () => {
            board.off("boundingbox", handler);
        };
    }, [board]);
}
