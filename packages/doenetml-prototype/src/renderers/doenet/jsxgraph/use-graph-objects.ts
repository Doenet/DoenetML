import React from "react";
import type * as JSG from "jsxgraph";
import { boardRedraw } from "./redraw";

/** What a graph element made on its board. */
export type GraphObjects = {
    /** Every object made, removed with the element. */
    objects: JSG.GeometryElement[];
};

/**
 * Keep a graph element's JSXGraph objects for the life of the component:
 * `create` makes them once the board exists, `update` brings them up to date
 * with the element's props on every render, and the board redraws once per
 * update batch (`./redraw.ts`).
 *
 * `create` is handed `resync`, which re-applies the latest props: after a
 * drag the core may have refused or snapped the move, and JSXGraph has
 * already moved the objects, so they are put back where the props say.
 */
export function useGraphObjects<T extends GraphObjects, P>(
    board: JSG.Board | null,
    props: P,
    create: (board: JSG.Board, props: P, resync: () => void) => T,
    update: (made: T, props: P) => void,
): T | null {
    const made = React.useRef<T | null>(null);
    const latest = React.useRef(props);
    latest.current = props;

    React.useEffect(() => {
        if (!board) {
            return;
        }
        const redraw = boardRedraw(board);
        redraw.structure();
        const resync = () => {
            if (made.current) {
                update(made.current, latest.current);
                redraw.changed(...made.current.objects);
            }
        };
        const objects = create(board, latest.current, resync);
        made.current = objects;
        update(objects, latest.current);
        return () => {
            made.current = null;
            redraw.structure();
            for (const o of [...objects.objects].reverse()) {
                board.removeObject(o);
            }
        };
    }, [board]);

    if (board && made.current) {
        update(made.current, props);
        boardRedraw(board).changed(...made.current.objects);
    }
    return made.current;
}

/** Bring an object's coordinates-derived state up to date (it is drawn by
 * the next redraw). */
export function refresh(o: JSG.GeometryElement) {
    o.needsUpdate = true;
    o.update();
}

/** Whether every coordinate is a finite number. */
export function finite(...values: number[]) {
    return values.every(Number.isFinite);
}

/** Show or hide an object without `setAttribute`, which updates the whole
 * board. */
export function setVisible(o: JSG.GeometryElement, visible: boolean) {
    const el = o as any;
    if (el.visPropCalc.visible !== visible || el.visProp.visible !== visible) {
        el.visProp.visible = visible;
        el.visPropCalc.visible = visible;
        el.setDisplayRendNode(visible);
    }
}
