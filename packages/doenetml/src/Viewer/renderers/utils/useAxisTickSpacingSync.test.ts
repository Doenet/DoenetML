import { describe, expect, it } from "vitest";
import {
    tickSpacingSignature,
    tickSpacingUnchanged,
} from "./useAxisTickSpacingSync";
import type { AxisJXG } from "./jsxgraph";
import type { JXGBoard } from "../jsxgraph-distrib/types";

// These tests cover the decision the hook makes — when the minor-tick count
// has to be recomputed — not the React plumbing around it. `setMinorTicks`
// itself is covered in `jsxgraph.test.ts`.

function fakeBoard({
    canvasWidth = 600,
    canvasHeight = 300,
    boundingBox = [-10, 6, 10, -6] as [number, number, number, number],
} = {}): JXGBoard {
    return {
        canvasWidth,
        canvasHeight,
        getBoundingBox: () => boundingBox,
    } as unknown as JXGBoard;
}

function fakeAxis(): AxisJXG {
    return {} as unknown as AxisJXG;
}

describe("tick spacing signature", () => {
    it("reports no change while the board and axes hold still", () => {
        // What a point drag looks like: renders keep arriving, nothing moves.
        const board = fakeBoard();
        const axes = { xaxis: fakeAxis(), yaxis: fakeAxis() };

        const applied = tickSpacingSignature({ board, ...axes });

        expect(
            tickSpacingUnchanged(
                applied,
                tickSpacingSignature({ board, ...axes }),
            ),
        ).toBe(true);
    });

    it("treats nothing applied yet as a change", () => {
        expect(
            tickSpacingUnchanged(
                null,
                tickSpacingSignature({
                    board: fakeBoard(),
                    xaxis: fakeAxis(),
                    yaxis: fakeAxis(),
                }),
            ),
        ).toBe(false);
    });

    it("reports a change when the canvas is resized", () => {
        const axes = { xaxis: fakeAxis(), yaxis: fakeAxis() };
        const applied = tickSpacingSignature({ board: fakeBoard(), ...axes });

        expect(
            tickSpacingUnchanged(
                applied,
                tickSpacingSignature({
                    board: fakeBoard({ canvasHeight: 400 }),
                    ...axes,
                }),
            ),
        ).toBe(false);
    });

    it("reports a change when the bounding box moves", () => {
        const axes = { xaxis: fakeAxis(), yaxis: fakeAxis() };
        const applied = tickSpacingSignature({ board: fakeBoard(), ...axes });

        expect(
            tickSpacingUnchanged(
                applied,
                tickSpacingSignature({
                    board: fakeBoard({ boundingBox: [-10, 3, 10, -3] }),
                    ...axes,
                }),
            ),
        ).toBe(false);
    });

    it("reports a change when an axis is rebuilt at the same geometry", () => {
        // Toggling `displayXAxis` destroys and recreates the axes without
        // touching the board. `setMinorTicks` writes to the axis it is handed,
        // so what was applied to the old one says nothing about the new one.
        const board = fakeBoard();
        const xaxis = fakeAxis();
        const applied = tickSpacingSignature({
            board,
            xaxis,
            yaxis: fakeAxis(),
        });

        expect(
            tickSpacingUnchanged(
                applied,
                tickSpacingSignature({ board, xaxis, yaxis: fakeAxis() }),
            ),
        ).toBe(false);
    });

    it("reports a change when an axis appears or disappears", () => {
        const board = fakeBoard();
        const xaxis = fakeAxis();
        const applied = tickSpacingSignature({ board, xaxis, yaxis: null });

        expect(
            tickSpacingUnchanged(
                applied,
                tickSpacingSignature({ board, xaxis, yaxis: fakeAxis() }),
            ),
        ).toBe(false);
    });
});
