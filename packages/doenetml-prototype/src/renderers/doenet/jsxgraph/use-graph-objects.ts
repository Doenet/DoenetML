import React from "react";
import * as JSG from "jsxgraph";

/** What a graph element made on its board. */
export type GraphObjects = {
    /** Every object made, each before the objects it is built on: removed
     * with the element, in this order. */
    objects: JSG.GeometryElement[];
};

/**
 * Keep a graph element's JSXGraph objects for the life of the component.
 * `create` makes them once the board exists and the props can be drawn;
 * `update` brings them in step with the props on every render, after which
 * the board is redrawn; they are removed when the element is, and made anew
 * when `remake` changes (a polygon's number of vertices).
 *
 * `ready` says whether the props can be drawn: an element that arrives
 * without the props its renderer needs (a core that sends another shape for
 * them) draws nothing, as an element with no renderer does.
 *
 * `create` is handed `resync`, which draws the latest props again: after a
 * drag the core may have refused or snapped the move while JSXGraph already
 * moved the object, so on `up` it is put back where the props say.
 */
export function useGraphObjects<T extends GraphObjects, P>(
    board: JSG.Board | null,
    props: P,
    {
        ready,
        create,
        update,
        remake,
    }: {
        ready: (props: P) => boolean;
        create: (board: JSG.Board, props: P, resync: () => void) => T;
        update: (made: T, props: P) => void;
        remake?: unknown;
    },
): void {
    const made = React.useRef<T | null>(null);
    const latest = React.useRef(props);
    latest.current = props;
    const isReady = ready(props);

    React.useEffect(() => {
        if (!board || !isReady) {
            return;
        }
        const draw = () => {
            if (made.current && ready(latest.current)) {
                update(made.current, latest.current);
                board.updateRenderer();
            }
        };
        const objects = create(board, latest.current, draw);
        made.current = objects;
        draw();
        return () => {
            made.current = null;
            for (const o of objects.objects) {
                board.removeObject(o);
            }
        };
    }, [board, isReady, remake]);

    if (board && made.current && isReady) {
        update(made.current, props);
        board.updateRenderer();
    }
}

/** Whether `value` is a list of points, of `n` of them when given. */
export function isPoints(
    value: unknown,
    n?: number,
): value is [number, number][] {
    return (
        Array.isArray(value) &&
        (n === undefined || value.length === n) &&
        value.every((p) => Array.isArray(p) && p.length === 2)
    );
}

/** Whether every coordinate is a finite number. */
export function finite(...values: number[]) {
    return values.every(Number.isFinite);
}

/** Where a point is. */
export function xy(p: JSG.Point): [number, number] {
    return [p.X(), p.Y()];
}

/** Put a point at `(x, y)`; drawn by the next redraw. */
export function setCoords(p: JSG.Point, x: number, y: number) {
    p.coords.setCoordinates(JSG.COORDS_BY_USER, [1, x, y]);
    refresh(p);
}

/** Bring an object's derived state up to date (it is drawn by the next
 * redraw). */
export function refresh(o: JSG.GeometryElement) {
    o.needsUpdate = true;
    o.update();
}

/** Show or hide an object. */
export function setVisible(o: JSG.GeometryElement, visible: boolean) {
    if (o.getAttribute("visible") !== visible) {
        o.setAttribute({ visible });
    }
}
