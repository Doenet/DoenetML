import { useEffect, useRef, useState } from "react";
import { JXGBoard } from "../jsxgraph-distrib/types";

/**
 * Re-render the calling renderer when the board's bounding box changes and
 * `needsRerender` says the change affects how it is drawn.
 *
 * A renderer that places itself relative to the graph's edges (an off-graph
 * indicator, a label moved away from an edge) reads the bounding box while it
 * renders. When the graph's limits change, its children are re-rendered in the
 * same update as the graph, but the graph applies the new bounding box from its
 * own effect, which runs after its children have rendered. So the child would
 * keep the drawing it computed from the old bounding box, and it listens for
 * the change itself. This also redraws it as soon as the user pans or zooms.
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
