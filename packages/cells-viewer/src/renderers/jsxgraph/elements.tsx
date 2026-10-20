// Point, line, line segment, circle and polygon as JSXGraph elements, built
// and dragged the way Doenet's component renderers are (point.tsx, line.tsx,
// lineSegment.tsx, circle.tsx, polygon.tsx), but reading cells directly:
// each component renders nothing through React after it mounts.
//
// Drags follow Doenet's pattern: what the user drags is either an invisible
// twin (a point's shadow point) or an object whose defining points are put
// back where the core says after every move. The pointer position becomes a
// request; the drawn position is always the core's answer.
import JXG from "jsxgraph";
import { useStableStore, useStore } from "../../hooks";
import type { PrimUse } from "../../generated/shapes";
import {
    useBoardElement,
    useBoardElementCells,
    useBoardPrim,
    type BoardElement,
    type BoardHandle,
} from "./Board";
import {
    characterizeOffGraphPoint,
    dragHandleAttributes,
    lineLikeAttributes,
    LINE_LAYER_OFFSET,
    normalizePointStyle,
    POINT_LAYER_OFFSET,
    pointAttributes,
    pointerEventToUserCoords,
    POINTER_DRAG_THRESHOLD,
    shadowPointAttributes,
    styleFor,
    unfilledShapeAttributes,
    VERTEX_LAYER_OFFSET,
    type Style,
} from "./doenet";

const USER = (JXG as any).COORDS_BY_USER;
type Pt = [number, number];
type DragEvent = { type: string; x: number; y: number };

/** Down, drag and up on one JSXGraph object (attachLineFamilyDragHandlers):
 * `snapshot` records screen coordinates at pointerdown, and `onDrag` gets
 * a function from a snapshot index to the pointer's user coordinates. */
function attachDrag(
    h: BoardHandle,
    jxg: any,
    snapshot: () => number[][],
    onDrag: (at: (i: number, fallback: () => Pt) => Pt) => void,
    {
        belowThreshold = false,
        onDown,
        onUp,
    }: {
        belowThreshold?: boolean;
        onDown?: () => void;
        onUp?: () => void;
    } = {},
) {
    let pointerAtDown: Pt | null = null;
    let snap: number[][] | null = null;
    jxg.on("down", (e: DragEvent) => {
        pointerAtDown = [e.x, e.y];
        snap = snapshot();
        onDown?.();
    });
    jxg.on("drag", (e: DragEvent) => {
        const above =
            e.type !== "pointermove" ||
            (pointerAtDown !== null &&
                (Math.abs(e.x - pointerAtDown[0]) > POINTER_DRAG_THRESHOLD ||
                    Math.abs(e.y - pointerAtDown[1]) > POINTER_DRAG_THRESHOLD));
        if (!above && !belowThreshold) return;
        onDrag((i, fallback) =>
            e.type === "pointermove" && pointerAtDown && snap
                ? pointerEventToUserCoords(e, pointerAtDown, snap[i], h.board)
                : fallback(),
        );
    });
    jxg.on("up", () => {
        pointerAtDown = null;
        snap = null;
        onUp?.();
    });
}

const finite = (...v: number[]) => v.every(Number.isFinite);

// ---------------------------------------------------------------- point

/** JSXGraph layer of an element with Doenet's `layer` attribute: ten
 * layers per DoenetML layer, above the type's offset (point.tsx). */
const layerOf = (layer: string | null, offset: number) =>
    10 * (Number(layer) || 0) + offset;

function pointElement(
    h: BoardHandle,
    style: Style,
    layer: number,
): BoardElement {
    const board = h.board;
    const attrs = { ...pointAttributes([0, 0], style), layer, ...h.attrs };
    const shadow = board.create("point", [0, 0], shadowPointAttributes(attrs));
    const pt = board.create("point", [0, 0], attrs);
    let dragging = false;
    let visible = true;
    const e: BoardElement = {
        cells: [],
        sync([x, y, hide]) {
            visible = finite(x, y) && (hide === 0 || Number.isNaN(hide));
            let at: Pt = finite(x, y) ? [x, y] : [0, 0];
            let sides: [number, number] = [0, 0];
            if (finite(x, y)) {
                const off = characterizeOffGraphPoint(
                    at,
                    board.getBoundingBox(),
                );
                if (off.needIndicator)
                    [at, sides] = [off.indicatorCoords, off.indicatorSides];
            }
            pt.coords.setCoordinates(USER, at);
            if (!dragging) shadow.coords.setCoordinates(USER, at);
            h.setVisible(pt, visible);
            h.setVisible(shadow, visible);
            const face = normalizePointStyle(style.markerStyle, sides);
            h.setFace(pt, face);
            h.setFace(shadow, face);
            pt.needsUpdate = true;
            pt.update();
            shadow.needsUpdate = true;
            shadow.update();
        },
        // The shadow is invisible except while it is dragged, so only then is
        // its DOM node worth updating (hit testing uses its coordinates).
        objects: () => (dragging ? [shadow, pt] : [pt]),
        remove() {
            h.removeObjects([pt, shadow]);
        },
        locate: () => (visible ? h.toClient(pt.coords.scrCoords) : null),
    };
    attachDrag(
        h,
        shadow,
        () => [[...shadow.coords.scrCoords]],
        (at) => {
            // Keep the request (and the shadow) 1% inside the board, as Doenet does.
            let [xMin, yMax, xMax, yMin] = board.getBoundingBox();
            if (xMax < xMin) [xMin, xMax] = [xMax, xMin];
            if (yMax < yMin) [yMin, yMax] = [yMax, yMin];
            const dx = (xMax - xMin) * 0.01,
                dy = (yMax - yMin) * 0.01;
            const clamp = (v: number, lo: number, hi: number) =>
                Math.min(hi, Math.max(lo, v || 0));
            const [px, py] = at(0, () => [shadow.X(), shadow.Y()]);
            const x = clamp(px, xMin + dx, xMax - dx),
                y = clamp(py, yMin + dy, yMax - dy);
            shadow.coords.setCoordinates(USER, [
                clamp(shadow.X(), xMin + dx, xMax - dx),
                clamp(shadow.Y(), yMin + dy, yMax - dy),
            ]);
            h.store.request([
                [e.cells[0], x],
                [e.cells[1], y],
            ]);
        },
        {
            belowThreshold: true,
            // While pressed, the shadow shows as a highlighted ghost at the pointer
            // (point.tsx onDownExtra); JSXGraph's own update per move redraws it.
            onDown: () => {
                dragging = true;
                shadow.visProp.highlightfillopacity = pt.visProp.fillopacity;
                shadow.visProp.highlightstrokeopacity =
                    pt.visProp.strokeopacity;
                shadow.needsRegularUpdate = true;
                shadow.needsUpdate = true;
                shadow.updateRenderer();
            },
            onUp: () => {
                dragging = false;
                shadow.visProp.highlightfillopacity = 0;
                shadow.visProp.highlightstrokeopacity = 0;
                shadow.needsRegularUpdate = false;
                h.resync(e);
            },
        },
    );
    return e;
}

/** The `point` primitive (ADR 0016): its shape binds x, y and hide. */
export function JxPoint({ id, use }: { id: string; use: PrimUse }) {
    const store = useStableStore();
    const idx = store.comps.byId(id)!;
    const style = styleFor(store.comps.attr(idx, "styleNumber"));
    const layer = layerOf(store.comps.attr(idx, "layer"), POINT_LAYER_OFFSET);
    useBoardPrim(id, use, (h) => pointElement(h, style, layer));
    return null;
}

// ---------------------------------------------------------------- line and segment

const LINE_PROPS = ["x1", "y1", "x2", "y2", "basedOnDirection"] as const;
const SEGMENT_PROPS = ["x1", "y1", "x2", "y2"] as const;

/** Points dragged together (one point group, ADR 0006): [xCell, yCell, x, y]. */
type PointRequest = [number, number, number, number];

function lineElement(h: BoardHandle, segment: boolean): BoardElement {
    const board = h.board;
    const lineAttrs = { ...lineLikeAttributes(LINE_LAYER_OFFSET), ...h.attrs };
    let p1: any, p2: any, line: any;
    if (segment) {
        // Endpoint handles: invisible until hovered, each draggable on its own.
        const handle = {
            ...dragHandleAttributes(VERTEX_LAYER_OFFSET),
            ...h.attrs,
        };
        p1 = board.create("point", [0, 0], handle);
        p2 = board.create("point", [1, 0], handle);
        line = board.create("segment", [p1, p2], lineAttrs);
    } else {
        line = board.create(
            "line",
            [
                [0, 0],
                [1, 0],
            ],
            lineAttrs,
        );
        p1 = line.point1;
        p2 = line.point2;
    }
    let shown = true;
    const e: BoardElement = {
        cells: [],
        sync([x1, y1, x2, y2]) {
            const ok = finite(x1, y1, x2, y2);
            p1.coords.setCoordinates(USER, ok ? [x1, y1] : [0, 0]);
            p2.coords.setCoordinates(USER, ok ? [x2, y2] : [1, 0]);
            if (ok !== shown) {
                shown = ok;
                h.setVisible(line, ok);
                if (segment) {
                    h.setVisible(p1, ok);
                    h.setVisible(p2, ok);
                }
            }
            for (const o of segment ? [p1, p2, line] : [line]) {
                o.needsUpdate = true;
                o.update();
            }
        },
        objects: () => (segment ? [p1, p2, line] : [line]),
        remove() {
            h.removeObjects(segment ? [line, p1, p2] : [line]);
        },
        // The middle of the segment between the defining points.
        locate: () =>
            shown
                ? h.toClient([
                      1,
                      (p1.coords.scrCoords[1] + p2.coords.scrCoords[1]) / 2,
                      (p1.coords.scrCoords[2] + p2.coords.scrCoords[2]) / 2,
                  ])
                : null,
    };
    // A whole-line drag, as the current core's moveLine: a direction-based
    // line translates by its first point only; otherwise both points are
    // requested together as one point group (ADR 0006).
    attachDrag(
        h,
        line,
        () => [[...p1.coords.scrCoords], [...p2.coords.scrCoords]],
        (at) => {
            const [a, b] = [
                at(0, () => [p1.X(), p1.Y()]),
                at(1, () => [p2.X(), p2.Y()]),
            ];
            const [cx1, cy1, cx2, cy2, cDir] = e.cells;
            const pts: PointRequest[] = [[cx1, cy1, a[0], a[1]]];
            if (segment || !h.store.get(cDir)) pts.push([cx2, cy2, b[0], b[1]]);
            h.store.requestPoints(pts);
            h.resync(e);
        },
    );
    if (segment) {
        for (const [i, p] of [p1, p2].entries()) {
            attachDrag(
                h,
                p,
                () => [[...p.coords.scrCoords]],
                (at) => {
                    const [x, y] = at(0, () => [p.X(), p.Y()]);
                    h.store.request([
                        [e.cells[2 * i], x],
                        [e.cells[2 * i + 1], y],
                    ]);
                    h.resync(e);
                },
            );
        }
    }
    return e;
}

export function JxLine({ idx, segment }: { idx: number; segment: boolean }) {
    useBoardElement(idx, segment ? SEGMENT_PROPS : LINE_PROPS, (h) =>
        lineElement(h, segment),
    );
    return null;
}

// ---------------------------------------------------------------- circle

function circleElement(h: BoardHandle): BoardElement {
    const board = h.board;
    const circle = board.create("circle", [[0, 0], 1], {
        ...unfilledShapeAttributes(LINE_LAYER_OFFSET),
        ...h.attrs,
    });
    const center = circle.center;
    // `setRadius` runs a full board update; read the radius from a variable instead.
    let radius = 1;
    circle.updateRadius = () => radius;
    let shown = true;
    const e: BoardElement = {
        cells: [],
        sync([cx, cy, r]) {
            const ok = finite(cx, cy, r);
            center.coords.setCoordinates(USER, ok ? [cx, cy] : [0, 0]);
            radius = ok ? r : 1;
            if (ok !== shown) {
                shown = ok;
                h.setVisible(circle, ok);
            }
            center.needsUpdate = true;
            center.update();
            circle.needsUpdate = true;
            circle.update();
        },
        objects: () => [circle],
        remove() {
            h.removeObjects([circle]);
        },
        // A point on the circle's rim, to the right of the center.
        locate: () =>
            shown
                ? h.toClient([
                      1,
                      center.coords.scrCoords[1] +
                          circle.Radius() * board.unitX,
                      center.coords.scrCoords[2],
                  ])
                : null,
    };
    // As the current core's moveCircle: request the center; the inverse
    // carries the through points along.
    attachDrag(
        h,
        circle,
        () => [[...center.coords.scrCoords]],
        (at) => {
            const [x, y] = at(0, () => [center.X(), center.Y()]);
            h.store.request([
                [e.cells[0], x],
                [e.cells[1], y],
            ]);
            h.resync(e);
        },
    );
    return e;
}

/** The `circle` primitive (ADR 0016): its shape binds the center and the
 * radius. */
export function JxCircle({ id, use }: { id: string; use: PrimUse }) {
    useBoardPrim(id, use, circleElement);
    return null;
}

// ---------------------------------------------------------------- polygon

/** A polygon's props: `numVertices`, then its vertices as `x1, y1, ...`,
 * as many as it has (ADR 0016). */
function polygonElement(h: BoardHandle): BoardElement {
    const board = h.board;
    let vertices: any[] = [];
    let polygon: any = null;
    let count = -1;
    const vertexAttrs = {
        ...dragHandleAttributes(VERTEX_LAYER_OFFSET),
        ...h.attrs,
    };
    const borderAttrs = {
        ...lineLikeAttributes(LINE_LAYER_OFFSET),
        fixed: true,
        highlight: false,
        ...h.attrs,
    };
    const polygonAttrs = {
        ...unfilledShapeAttributes(LINE_LAYER_OFFSET),
        vertices: vertexAttrs,
        borders: borderAttrs,
        withLines: true,
        ...h.attrs,
    };

    const destroy = () => {
        h.removeObjects(polygon ? [polygon, ...vertices] : vertices);
        polygon = null;
        vertices = [];
    };
    // Doenet rebuilds the polygon when its vertex count changes; so does this.
    const build = (n: number, xy: number[]) => {
        destroy();
        count = n;
        if (n < 2) return;
        board.suspendUpdate();
        vertices = Array.from({ length: n }, (_, i) =>
            board.create("point", [xy[2 * i], xy[2 * i + 1]], vertexAttrs),
        );
        polygon = board.create("polygon", vertices, polygonAttrs);
        board.isSuspendedUpdate = false; // no full update: the flush draws it
        // As the current core's movePolygon from a drag of the whole shape:
        // every vertex is requested with the same shift, as one point group.
        attachDrag(
            h,
            polygon,
            () => vertices.map((v) => [...v.coords.scrCoords]),
            (at) => {
                const pts: PointRequest[] = vertices.map((v, i) => {
                    const [x, y] = at(i, () => [v.X(), v.Y()]);
                    return [e.cells[1 + 2 * i], e.cells[2 + 2 * i], x, y];
                });
                h.store.requestPoints(pts);
                h.resync(e);
            },
        );
        for (const [i, v] of vertices.entries()) {
            attachDrag(
                h,
                v,
                () => [[...v.coords.scrCoords]],
                (at) => {
                    const [x, y] = at(0, () => [v.X(), v.Y()]);
                    h.store.request([
                        [e.cells[1 + 2 * i], x],
                        [e.cells[2 + 2 * i], y],
                    ]);
                    h.resync(e);
                },
            );
        }
    };

    const e: BoardElement = {
        cells: [],
        sync([n, ...xy]) {
            const k = Number.isFinite(n) ? Math.min(xy.length / 2, n) : 0;
            const ok = finite(...xy.slice(0, 2 * k));
            const want = ok ? k : 0;
            if (want !== count) build(want, xy);
            if (!polygon) return;
            for (const [i, v] of vertices.entries()) {
                v.coords.setCoordinates(USER, [xy[2 * i], xy[2 * i + 1]]);
                v.needsUpdate = true;
                v.update();
            }
            polygon.needsUpdate = true;
            polygon.update();
            for (const b of polygon.borders) {
                b.needsUpdate = true;
                b.update();
            }
        },
        objects: () =>
            polygon ? [...vertices, polygon, ...polygon.borders] : [],
        remove: destroy,
        // The middle of the first edge: an unfilled polygon (Doenet's default)
        // is hit on its border only.
        locate: () => {
            if (!polygon) return null;
            const [a, b] = [
                vertices[0].coords.scrCoords,
                vertices[1].coords.scrCoords,
            ];
            return h.toClient([1, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]);
        },
    };
    return e;
}

export function JxPolygon({ idx }: { idx: number }) {
    const store = useStore();
    useBoardElementCells(idx, () => store.comps.props(idx), polygonElement);
    return null;
}

// ---------------------------------------------------------------- polyline

/** A polyline through its vertices: one JSXGraph curve whose data arrays
 * are refilled from the cells. Not draggable (the core does not support
 * dragging a polyline), so there are no handles. */
function polylineElement(
    h: BoardHandle,
    style: Style,
    layer: number,
): BoardElement {
    const board = h.board;
    let xs: number[] = [],
        ys: number[] = [];
    const curve = board.create("curve", [[], []], {
        ...lineLikeAttributes(layer, style),
        fixed: true,
        highlight: false,
        ...h.attrs,
    });
    curve.updateDataArray = function (this: any) {
        this.dataX = xs;
        this.dataY = ys;
    };
    const e: BoardElement = {
        cells: [],
        sync(values) {
            // Cells are `x0, y0, x1, y1, ...`; a non-finite vertex breaks the line.
            const n = values.length / 2;
            xs = new Array(n);
            ys = new Array(n);
            for (let i = 0; i < n; i++) {
                const [x, y] = [values[2 * i], values[2 * i + 1]];
                const ok = finite(x, y);
                xs[i] = ok ? x : NaN;
                ys[i] = ok ? y : NaN;
            }
            curve.needsUpdate = true;
            curve.update();
        },
        objects: () => [curve],
        remove() {
            h.removeObjects([curve]);
        },
    };
    return e;
}

export function JxPolyline({ idx }: { idx: number }) {
    const store = useStore();
    const style = styleFor(store.comps.attr(idx, "styleNumber"));
    const layer = layerOf(store.comps.attr(idx, "layer"), LINE_LAYER_OFFSET);
    // The vertices are the polyline's children: copies of the points it gathered.
    useBoardElementCells(
        idx,
        () =>
            store.comps
                .children(idx)
                .flatMap((ch) =>
                    "c" in ch
                        ? [
                              store.comps.cell(ch.c, "x"),
                              store.comps.cell(ch.c, "y"),
                          ]
                        : [],
                ),
        (h) => polylineElement(h, style, layer),
    );
    return null;
}
