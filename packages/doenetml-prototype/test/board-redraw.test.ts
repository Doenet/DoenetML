import { describe, expect, it, vi } from "vitest";
import {
    BoardRedraw,
    type Drawable,
    type RedrawBoard,
} from "../src/renderers/doenet/jsxgraph/redraw";

/** A board that records what was asked of it. */
function fakeBoard() {
    const calls: string[] = [];
    const board: RedrawBoard = {
        suspendUpdate: () => calls.push("suspendUpdate"),
        unsuspendUpdate: () => calls.push("unsuspendUpdate"),
        renderer: {
            suspendRedraw: () => calls.push("suspendRedraw"),
            unsuspendRedraw: () => calls.push("unsuspendRedraw"),
        },
    };
    return { board, calls };
}

function drawable(): Drawable & { updateRenderer: ReturnType<typeof vi.fn> } {
    return { updateRenderer: vi.fn() };
}

/** Let the scheduled flush run. */
const settle = () => new Promise<void>((resolve) => queueMicrotask(resolve));

describe("BoardRedraw", () => {
    it("redraws each changed object once per batch, in one redraw", async () => {
        const { board, calls } = fakeBoard();
        const redraw = new BoardRedraw(board);
        const a = drawable();
        const b = drawable();
        redraw.changed(a, null);
        redraw.changed(b, a);
        expect(calls).toEqual([]);
        await settle();
        expect(a.updateRenderer).toHaveBeenCalledTimes(1);
        expect(b.updateRenderer).toHaveBeenCalledTimes(1);
        expect(calls).toEqual(["suspendRedraw", "unsuspendRedraw"]);

        // A later batch flushes again.
        redraw.changed(a);
        await settle();
        expect(a.updateRenderer).toHaveBeenCalledTimes(2);
    });

    it("suspends the board's updates while objects are created, then updates it once", async () => {
        const { board, calls } = fakeBoard();
        const redraw = new BoardRedraw(board);
        const a = drawable();
        redraw.structure();
        redraw.structure();
        redraw.changed(a);
        await settle();
        // The full update redraws every object, so none is redrawn alone.
        expect(calls).toEqual(["suspendUpdate", "unsuspendUpdate"]);
        expect(a.updateRenderer).not.toHaveBeenCalled();
    });

    it("does nothing for a batch with nothing in it", async () => {
        const { board, calls } = fakeBoard();
        new BoardRedraw(board).flush();
        await settle();
        expect(calls).toEqual([]);
    });
});
