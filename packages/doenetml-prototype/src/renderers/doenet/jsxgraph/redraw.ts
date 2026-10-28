import type * as JSG from "jsxgraph";

/** What the scheduler uses of a board and its objects: JSXGraph's own
 * typings leave out the renderer's `suspendRedraw` and an object's
 * `updateRenderer`. */
export type RedrawBoard = {
    suspendUpdate(): unknown;
    unsuspendUpdate(): unknown;
    renderer: {
        suspendRedraw(board: RedrawBoard): unknown;
        unsuspendRedraw(): unknown;
    };
};
export type Drawable = { updateRenderer(): unknown };

/**
 * One redraw per board per update batch (ADR 0010 in `packages/cells-core`).
 *
 * An update from core re-renders the graph's elements in one React pass; each
 * element brings its JSXGraph objects up to date and marks them here, and the
 * board redraws once, in a microtask after the pass, rather than once per
 * element. Two kinds of batch:
 *
 * - **Changed objects** (a point moved): only those objects are redrawn.
 * - **Structure** (objects created or removed): the board's updates are
 *   suspended until the flush, which then runs one full update. Without this,
 *   JSXGraph updates the whole board for every object created or removed.
 */
export class BoardRedraw {
    board: RedrawBoard;
    _changed = new Set<Drawable>();
    _structural = false;
    _scheduled = false;

    constructor(board: RedrawBoard) {
        this.board = board;
    }

    /** These objects changed; redraw them at the end of the batch. */
    changed(...objects: (JSG.GeometryElement | Drawable | null | undefined)[]) {
        for (const o of objects) {
            if (o) this._changed.add(o as unknown as Drawable);
        }
        this._schedule();
    }

    /** Objects are about to be created or removed: suspend the board's
     * updates until the end of the batch. */
    structure() {
        if (!this._structural) {
            this._structural = true;
            this.board.suspendUpdate();
        }
        this._schedule();
    }

    _schedule() {
        if (this._scheduled) return;
        this._scheduled = true;
        queueMicrotask(() => this.flush());
    }

    flush() {
        this._scheduled = false;
        const board = this.board;
        if (this._structural) {
            this._structural = false;
            this._changed.clear();
            // A full update of every object, once.
            board.unsuspendUpdate();
            return;
        }
        if (this._changed.size === 0) return;
        board.renderer.suspendRedraw(board);
        for (const o of this._changed) o.updateRenderer();
        this._changed.clear();
        board.renderer.unsuspendRedraw();
    }
}

const redraws = new WeakMap<JSG.Board, BoardRedraw>();

/** The redraw scheduler of a board, one per board. */
export function boardRedraw(board: JSG.Board): BoardRedraw {
    let redraw = redraws.get(board);
    if (!redraw) {
        redraw = new BoardRedraw(board as unknown as RedrawBoard);
        redraws.set(board, redraw);
    }
    return redraw;
}
