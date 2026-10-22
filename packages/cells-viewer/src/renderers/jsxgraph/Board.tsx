// A graph drawn by JSXGraph with Doenet's look (ADR 0010). React mounts the
// board and its children; after that, each child's JSXGraph element reads
// its cells directly and never re-renders through React. A tick marks the
// elements whose cells changed, and the board redraws once at the end of
// the tick (`CellStore.subscribeTickEnd`).
import {
    createContext,
    useContext,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import JXG from "jsxgraph";
import type { CellStore } from "../../core";
import { useStore } from "../../hooks";
import { measure } from "../../trace";
import { Children } from "../index";
import {
    addNavigationButtons,
    createAxes,
    GRAPH_SIZE,
    initBoardOptions,
    styleFor,
} from "./doenet";

export interface BoardElement {
    /** The cells this element reads, in the order `sync` receives them. */
    cells: number[];
    /** The values of the last sync. A rebuild re-binds every element to new
     * cell indices; an element whose values did not change is not redrawn. */
    last?: number[];
    /** Bring the JSXGraph objects up to date with these cell values. */
    sync(values: number[]): void;
    remove(): void;
    /** The JSXGraph objects `sync` updates, to redraw just those. */
    objects(): any[];
    /** Client coordinates of the element's drag target, for tests. */
    locate?(): [number, number] | null;
}

/** Every mounted board, so tests can find an element's screen position. */
export const boards = new Set<BoardHandle>();

/** performance.now() of the latest board redraw. Elements are created a
 * commit after the board, so first-render timing waits for this too. */
export let lastBoardFlushAt = 0;

/** How many boards are mounted. */
export function boardCount() {
    return boards.size;
}

export class BoardHandle {
    readonly elements = new Set<BoardElement>();
    /** Component index to element, for `locate`. Re-registered on rebuild. */
    readonly byComp = new Map<number, BoardElement>();
    _pending = new Set<BoardElement>();
    _scheduled = false;

    constructor(
        readonly board: any,
        readonly store: CellStore,
    ) {}

    /** Attributes every element is created with: JSXGraph's own board
     * updates (one per pointer move) skip our elements, which are redrawn
     * only when their cells change. */
    readonly attrs: Record<string, any> = { needsRegularUpdate: false };

    /** Queue an element to re-read its cells. A tick flushes at its end;
     * anything marked outside a tick (a mount, a rebuild) is flushed in a
     * microtask, still before the frame. */
    mark(e: BoardElement) {
        this._pending.add(e);
        if (!this._scheduled) {
            this._scheduled = true;
            queueMicrotask(() => this.flush());
        }
    }

    flush() {
        this._scheduled = false;
        if (this._pending.size === 0) return;
        const cells = this.store.cells();
        const b = this.board;
        // Only the changed elements' objects are redrawn.
        b.renderer.suspendRedraw(b);
        for (const e of this._pending) {
            const values = e.cells.map((c) => cells[c]);
            if (e.last && values.every((v, i) => Object.is(v, e.last![i])))
                continue;
            e.last = values;
            e.sync(values);
            for (const o of e.objects()) o.updateRenderer();
        }
        this._pending.clear();
        b.renderer.unsuspendRedraw();
        lastBoardFlushAt = performance.now();
    }

    /** Re-read one element even if its cells did not change: after a drag
     * request the core may have refused, so the objects JSXGraph moved need
     * putting back. Queued, so the many objects a pointer event reaches at
     * once (overlapping points all get `up`) share one redraw. */
    resync(e: BoardElement) {
        e.last = undefined;
        this.mark(e);
    }

    /** Visibility without `setAttribute`, which runs a full board update. */
    setVisible(el: any, visible: boolean) {
        if (
            el.visPropCalc.visible !== visible ||
            el.visProp.visible !== visible
        ) {
            el.visProp.visible = visible;
            el.visPropCalc.visible = visible;
            el.setDisplayRendNode(visible);
        }
    }

    /** A point's marker shape changed (an off-graph indicator came or went). */
    setFace(el: any, face: string) {
        if (el.visProp.face === face) return;
        el.visProp.face = face;
        this.board.renderer.changePointStyle(el);
    }

    /** Remove objects from the board. `removeObject` runs a full board
     * update per call; that is skipped (the objects' own DOM nodes go with
     * them). */
    removeObjects(objs: any[]) {
        const b = this.board;
        // Unmounting a whole graph frees the board before its elements'
        // own cleanups run (React deletes parent first), and `freeBoard`
        // drops the renderer; there is nothing left to remove from.
        if (!b.renderer) return;
        const suspended = b.isSuspendedUpdate;
        b.isSuspendedUpdate = true;
        for (const o of objs) b.removeObject(o);
        b.isSuspendedUpdate = suspended;
    }

    /** Client coordinates of a screen-coordinate pair on this board. */
    toClient(scr: number[]): [number, number] {
        const c = this.board.containerObj as HTMLElement;
        const r = c.getBoundingClientRect();
        return [r.left + c.clientLeft + scr[1], r.top + c.clientTop + scr[2]];
    }
}

export const BoardContext = createContext<BoardHandle | null>(null);
export function useBoard() {
    return useContext(BoardContext)!;
}

let nextBoardId = 0;

export function JsxGraph({ idx }: { idx: number }) {
    const store = useStore();
    const container = useRef<HTMLDivElement>(null);
    const [id] = useState(() => `cells-board-${nextBoardId++}`);
    const [handle, setHandle] = useState<BoardHandle | null>(null);
    const settingBBox = useRef(false);
    function bboxCells() {
        return ["xmin", "ymax", "xmax", "ymin"].map((p) =>
            store.comps.cell(idx, p),
        );
    }

    useLayoutEffect(() => {
        const cells = store.cells();
        const bbox = bboxCells().map((c) => cells[c]);
        JXG.Options.layer.numlayers = 100;
        (JXG.Options as any).navbar.highlightFillColor = "var(--canvasText)";
        (JXG.Options as any).navbar.strokeColor = "var(--canvasText)";
        const initStart = performance.now();
        const board = (JXG.JSXGraph as any).initBoard(
            id,
            initBoardOptions(bbox, false, "svg"),
        );
        measure("render/board init", initStart);
        // JSXGraph clips its SVG root with `overflow: hidden`; with that, Chrome
        // re-layerizes every object on the board whenever a node is removed
        // (about 20 ms per frame at 8,000 objects). `clip-path` clips the same
        // pixels without it.
        const svgRoot = board.renderer.svgRoot as SVGSVGElement | undefined;
        if (svgRoot) {
            svgRoot.style.overflow = "visible";
            svgRoot.style.clipPath = "inset(0)";
        }
        createAxes(board);
        addNavigationButtons(board, container.current!);
        const h = new BoardHandle(board, store);
        boards.add(h);
        setHandle(h);
        return () => {
            boards.delete(h);
            (JXG.JSXGraph as any).freeBoard(board);
            container.current?.querySelector(".JXG_navigation")?.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // The bounding box is four cells: pan and zoom request them, and a
    // change from the core (or a refused request) moves the board.
    useLayoutEffect(() => {
        if (!handle) return;
        const board = handle.board;
        const cells = bboxCells();
        const apply = () => {
            const v = store.cells();
            const want = cells.map((c) => v[c]);
            const have = board.getBoundingBox();
            if (
                want.every(
                    (w, i) =>
                        Math.abs(w - have[i]) <=
                        1e-12 * Math.abs(want[2] - want[0]),
                )
            )
                return;
            settingBBox.current = true;
            board.setBoundingBox(want);
            settingBBox.current = false;
            // Points far outside the new box become indicators, and back.
            const cv = store.cells();
            for (const e of handle.elements)
                e.sync((e.last = e.cells.map((c) => cv[c])));
            board.fullUpdate();
        };
        const onBBox = () => {
            if (settingBBox.current) return;
            // Same order as the cells: xmin, ymax, xmax, ymin. A box that only
            // differs by rounding (JSXGraph recomputes it from its origin and
            // units) is not a pan: requesting it would write 49.999... into
            // inputs the bounds are bound to.
            const bbox: number[] = board.getBoundingBox();
            const v = store.cells();
            const tol =
                1e-9 *
                Math.max(
                    Math.abs(v[cells[2]] - v[cells[0]]),
                    Math.abs(v[cells[1]] - v[cells[3]]),
                );
            if (cells.every((c, i) => Math.abs(bbox[i] - v[c]) <= tol)) return;
            store.request(cells.map((c, i) => [c, bbox[i]]));
            apply();
        };
        board.on("boundingbox", onBBox);
        const unsubs = cells.map((c) => store.subscribe(c, apply));
        apply();
        return () => {
            board.off("boundingbox", onBBox);
            unsubs.forEach((u) => u());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handle, store, store.comps, idx]);

    useLayoutEffect(() => {
        if (!handle) return;
        return store.subscribeTickEnd(() => handle.flush());
    }, [handle, store]);

    return (
        <div
            style={{
                position: "relative",
                width: `${GRAPH_SIZE}px`,
                maxWidth: "100%",
            }}
        >
            <div
                id={id}
                ref={container}
                className="jxgbox"
                dir="ltr"
                data-comp={idx}
                data-name={store.comps.name(idx) ?? undefined}
                style={{
                    width: `${GRAPH_SIZE}px`,
                    aspectRatio: "1",
                    maxWidth: "100%",
                    border: "2px solid var(--canvasText)",
                    marginTop: "12px",
                    marginBottom: "12px",
                    backgroundColor: "var(--canvas)",
                    color: "var(--canvasText)",
                }}
            />
            {handle && (
                <BoardContext.Provider value={handle}>
                    {/* Graph children draw into the board; anything else they render is not shown. */}
                    <div style={{ display: "none" }}>
                        <Children idx={idx} inGraph={true} />
                    </div>
                </BoardContext.Provider>
            )}
            <GraphLegend idx={idx} />
        </div>
    );
}

/** Graph children a legend's labels describe, in order (Doenet's legend
 * skips points). */
const CURVE_TYPES = new Set([
    "polyline",
    "line",
    "lineSegment",
    "circle",
    "polygon",
    "function",
]);

/** `<legend>`: its k-th label beside a swatch of the graph's k-th curve,
 * in the board's upper right. */
function GraphLegend({ idx }: { idx: number }) {
    const store = useStore();
    const kids = store.comps
        .children(idx)
        .filter((ch): ch is { c: number } => "c" in ch)
        .map((ch) => ch.c);
    const legend = kids.find((c) => store.comps.componentType(c) === "legend");
    if (legend === undefined) return null;
    const curves = kids.filter((c) =>
        CURVE_TYPES.has(store.comps.componentType(c)),
    );
    const labels = store.comps
        .children(legend)
        .filter((ch): ch is { c: number } => "c" in ch)
        .map((ch) => ch.c);
    return (
        <div
            className="legend"
            data-comp={legend}
            style={{
                position: "absolute",
                top: "20px",
                right: "8px",
                background: "var(--canvas)",
                border: "1px solid var(--canvasText)",
                padding: "4px 8px",
                fontSize: "13px",
                zIndex: 10,
            }}
        >
            {labels.map((l, i) => {
                const style = styleFor(
                    curves[i] !== undefined
                        ? store.comps.attr(curves[i], "styleNumber")
                        : null,
                );
                return (
                    <div
                        key={l}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        <svg width="24" height="10" aria-hidden>
                            <line
                                x1="0"
                                y1="5"
                                x2="24"
                                y2="5"
                                stroke={style.lineColor}
                                strokeOpacity={style.lineOpacity}
                                strokeWidth={style.lineWidth}
                            />
                        </svg>
                        <Children idx={l} inGraph={false} />
                    </div>
                );
            })}
        </div>
    );
}

/** Mount a board element for the component's lifetime and keep it bound to
 * the component's current cells: after a rebuild or an edit of the source
 * the indices change, the element stays. `variant` names what `make` built
 * the element from besides the cells (its style, from the element's
 * attributes): when an edit changes it, the element is made again. */
export function useBoardElement(
    idx: number,
    props: readonly string[],
    make: (h: BoardHandle) => BoardElement,
    variant = "",
) {
    const store = useStore();
    useBoardElementCells(
        idx,
        () => props.map((p) => store.comps.cell(idx, p)),
        make,
        variant,
    );
}

/** `useBoardElement` over any cells, not only the component's own props
 * (a polyline reads its vertices' cells). */
export function useBoardElementCells(
    idx: number,
    cellsOf: () => number[],
    make: (h: BoardHandle) => BoardElement,
    variant = "",
) {
    const store = useStore();
    const h = useBoard();
    const el = useRef<BoardElement | null>(null);
    useLayoutEffect(() => {
        const e = make(h);
        el.current = e;
        h.elements.add(e);
        return () => {
            h.elements.delete(e);
            e.remove();
            el.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [h, variant]);
    const cells = cellsOf();
    const key = cells.join(",");
    // A rebuild drops every per-cell subscription, so the table is a
    // dependency too: indices that came out the same still re-subscribe.
    // So is the variant: an element made again is bound afresh.
    useLayoutEffect(() => {
        const e = el.current!;
        e.cells = cells;
        h.byComp.set(idx, e);
        h.mark(e);
        const mark = () => h.mark(e);
        const unsubs = cells.map((c) => store.subscribe(c, mark));
        return () => {
            unsubs.forEach((u) => u());
            if (h.byComp.get(idx) === e) h.byComp.delete(idx);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [h, store, store.comps, idx, key, variant]);
}

/** Where to press to drag the named component (or the component with
 * that index), for tests. */
export function locate(
    store: CellStore,
    name: string | number,
): [number, number] | null {
    const c = typeof name === "number" ? name : store.comps.byName(name);
    if (c === null) return null;
    for (const h of boards) {
        const e = h.byComp.get(c);
        if (e?.locate) {
            (h.board.containerObj as HTMLElement).scrollIntoView({
                block: "center",
            });
            return e.locate();
        }
    }
    return null;
}
