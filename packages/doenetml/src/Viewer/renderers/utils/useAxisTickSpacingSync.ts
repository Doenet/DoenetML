import { useEffect, useRef, type RefObject } from "react";
import { setMinorTicks, type AxisJXG } from "./jsxgraph";
import type { JXGBoard } from "../jsxgraph-distrib/types";

interface UseAxisTickSpacingSyncParams {
    enabled: boolean;
    board: JXGBoard | null;
    xaxisRef: RefObject<AxisJXG | null | undefined>;
    yaxisRef: RefObject<AxisJXG | null | undefined>;
}

/**
 * Everything the tick spacing depends on: the region the board shows, and the
 * pixels it is shown in. While these hold still, so does `setMinorTicks`.
 */
function tickGeometrySignature(board: JXGBoard): string {
    return [
        board.canvasWidth,
        board.canvasHeight,
        ...board.getBoundingBox(),
    ].join(",");
}

/**
 * Keep the minor-tick count on both axes matched to the board's current scale.
 *
 * Runs after the bounding box has been synchronized, so it sees the region the
 * board actually ended up showing, and does nothing while that region and the
 * canvas hold still. A point drag re-renders the graph every frame without
 * moving either, and reworking the ticks on each of those frames buys nothing
 * but a redraw of every tick on the board.
 */
export default function useAxisTickSpacingSync({
    enabled,
    board,
    xaxisRef,
    yaxisRef,
}: UseAxisTickSpacingSyncParams) {
    const previousTickGeometryRef = useRef<string | null>(null);

    useEffect(() => {
        if (!enabled || !board) {
            return;
        }

        const tickGeometry = tickGeometrySignature(board);
        if (tickGeometry === previousTickGeometryRef.current) {
            return;
        }
        previousTickGeometryRef.current = tickGeometry;

        if (xaxisRef.current) {
            setMinorTicks(xaxisRef.current);
        }
        if (yaxisRef.current) {
            setMinorTicks(yaxisRef.current);
        }
    });
}
