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
 * Everything the minor-tick count is derived from: the axis objects the ticks
 * belong to, the pixels the board is drawn in, and the region it shows. While
 * all of these hold still, so does the answer `setMinorTicks` gives.
 */
export type TickSpacingSignature = readonly [
    xaxis: AxisJXG | null | undefined,
    yaxis: AxisJXG | null | undefined,
    canvasWidth: number,
    canvasHeight: number,
    xMin: number,
    yMax: number,
    xMax: number,
    yMin: number,
];

/**
 * Record the state above for `board` and its axes.
 *
 * The axes themselves count because `setMinorTicks` writes to the axis it is
 * handed, so a recorded signature only vouches for the axes it was applied to.
 * Toggling `displayXAxis`/`displayYAxis` destroys and rebuilds them without
 * moving the board — `createXAxis`/`createYAxis` set the ticks on what they
 * build, and keying on identity is what keeps this hook from silently relying
 * on that.
 */
export function tickSpacingSignature({
    board,
    xaxis,
    yaxis,
}: {
    board: JXGBoard;
    xaxis: AxisJXG | null | undefined;
    yaxis: AxisJXG | null | undefined;
}): TickSpacingSignature {
    return [
        xaxis,
        yaxis,
        board.canvasWidth,
        board.canvasHeight,
        // JSXGraph orders the bounding box [xMin, yMax, xMax, yMin].
        ...board.getBoundingBox(),
    ];
}

/**
 * Whether two `tickSpacingSignature` results describe the same state, with a
 * null `previous` meaning nothing has been applied yet.
 */
export function tickSpacingUnchanged(
    previous: TickSpacingSignature | null,
    next: TickSpacingSignature,
): boolean {
    return (
        previous !== null &&
        previous.every((value, index) => Object.is(value, next[index]))
    );
}

/**
 * Keep the minor-tick count on both axes matched to the board's current scale.
 *
 * Runs after the bounding box has been synchronized, so it sees the region the
 * board actually ended up showing, and does nothing while the inputs to the
 * tick spacing hold still. A point drag re-renders the graph every frame
 * without moving any of them, and reworking the ticks on each of those frames
 * buys nothing but a redraw of every tick on the board.
 *
 * That test is made inside the effect rather than through a dependency array,
 * because both the axes and the bounding box are written by the effects that
 * run before this one: read during render, they would still describe the
 * previous frame.
 */
export default function useAxisTickSpacingSync({
    enabled,
    board,
    xaxisRef,
    yaxisRef,
}: UseAxisTickSpacingSyncParams) {
    const appliedSignatureRef = useRef<TickSpacingSignature | null>(null);

    useEffect(() => {
        if (!enabled || !board) {
            return;
        }

        const signature = tickSpacingSignature({
            board,
            xaxis: xaxisRef.current,
            yaxis: yaxisRef.current,
        });
        if (tickSpacingUnchanged(appliedSignatureRef.current, signature)) {
            return;
        }
        appliedSignatureRef.current = signature;

        if (xaxisRef.current) {
            setMinorTicks(xaxisRef.current);
        }
        if (yaxisRef.current) {
            setMinorTicks(yaxisRef.current);
        }
    });
}
