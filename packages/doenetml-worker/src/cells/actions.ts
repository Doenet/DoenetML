/**
 * Renderer actions, resolved for the cells core (ADR 0020): each one the
 * prototype's component renderers send becomes requests, a point group, or a
 * core action (`submit`, `trigger`, or one by name). The core never sees a
 * renderer action.
 */
import { CellsTable } from "./table";

export type Effect =
    | { kind: "none" }
    | { kind: "request"; pairs: [cell: number, value: number][] }
    /** Points moved together (ADR 0006): `[xCell, x, yCell, y]` flattened
     * into pairs, as `Core.request_points` takes them. */
    | { kind: "points"; pairs: [cell: number, value: number][] }
    | { kind: "submit"; answer: number }
    | { kind: "trigger"; component: number }
    /** A core action by name (ADR 0040), such as a click a button waits
     * on (ADR 0042). */
    | { kind: "act"; component: number; action: string };

type Resolver = (
    table: CellsTable,
    component: number,
    args: Record<string, any>,
) => Effect;

/** The cell of a prop the action writes; a renderer action naming a prop its
 * component does not have is a bridge bug. */
function cellOf(table: CellsTable, c: number, prop: string): number {
    const cell = table.cell(c, prop);
    if (cell === undefined) {
        throw Error(
            `the cells bridge: <${table.componentType(c)}> has no prop ${prop}`,
        );
    }
    return cell;
}

type Point = [x: number, y: number];

/** The cells of the points an action moves, `[xCell, yCell]` each, with the
 * coordinates it moves them to: one point alone is a request, several are a
 * point group (ADR 0006). */
function movePoints(moves: [Point, Point][]): Effect {
    const pairs = moves.flatMap(
        ([[cx, cy], [x, y]]) =>
            [
                [cx, x],
                [cy, y],
            ] as [number, number][],
    );
    return { kind: moves.length > 1 ? "points" : "request", pairs };
}

/** The vertices `pointCoords` names (`{index: [x, y]}`), as moves of
 * `vertexCells[index]`. */
function vertexMoves(
    vertexCells: Point[],
    pointCoords: Record<string, Point>,
): [Point, Point][] {
    return Object.entries(pointCoords).flatMap(([i, at]) =>
        vertexCells[Number(i)] ? [[vertexCells[Number(i)], at]] : [],
    ) as [Point, Point][];
}

/** The cells of `c`'s list points, `[xCell, yCell]` each. */
function listPoints(table: CellsTable, c: number): Point[] {
    const cells = table.listCells(c);
    const points: Point[] = [];
    for (let i = 0; i + 1 < cells.length; i += 2) {
        points.push([cells[i], cells[i + 1]]);
    }
    return points;
}

/** Both of a two-point shape's points, `[xProp, yProp, coords]` each, as one
 * point group: one the action does not move is asked for where it is. */
function moveBoth(
    table: CellsTable,
    c: number,
    ...ends: [x: string, y: string, at: Point | undefined][]
): Effect {
    const moves = ends.map(([xp, yp, at]): [Point, Point] => {
        const cells: Point = [cellOf(table, c, xp), cellOf(table, c, yp)];
        return [cells, at ?? [table.value(cells[0]), table.value(cells[1])]];
    });
    return movePoints(moves);
}

/** A point's drag. */
const movePoint: Resolver = (t, c, { x, y }) => ({
    kind: "points",
    pairs: [
        [cellOf(t, c, "x"), x],
        [cellOf(t, c, "y"), y],
    ],
});

/** A curve's through point dragged, as the current core's
 * moveThroughPoint (`throughPointInd` its 0-based index, `throughPoint`
 * where to). */
const moveThroughPoint: Resolver = (
    t,
    c,
    { throughPointInd, throughPoint },
) => {
    const at = listPoints(t, c)[Number(throughPointInd)];
    return at && throughPoint
        ? movePoints([[at, [throughPoint[0], throughPoint[1]]]])
        : { kind: "none" };
};

/** A whole-line drag, as the current core's moveLine: a line given by a
 * direction moves by its first point only. */
const moveLine: Resolver = (t, c, { point1coords, point2coords }) => {
    const p1: Point = [cellOf(t, c, "x1"), cellOf(t, c, "y1")];
    const p2: Point = [cellOf(t, c, "x2"), cellOf(t, c, "y2")];
    const direction = t.value(cellOf(t, c, "basedOnDirection")) === 1;
    return movePoints(
        direction
            ? [[p1, point1coords]]
            : [
                  [p1, point1coords],
                  [p2, point2coords],
              ],
    );
};

/** A click that flips the 0/1 prop `prop` when the element's literal
 * `switchable` holds, as the current core's switchPoint and switchLine. */
function switchFlag(prop: string): Resolver {
    return (t, c) => {
        const switchable = t.attrThrough(c, "switchable");
        if (switchable === null || switchable.trim().toLowerCase() === "false")
            return { kind: "none" };
        const cell = cellOf(t, c, prop);
        return {
            kind: "request",
            pairs: [[cell, t.value(cell) === 1 ? 0 : 1]],
        };
    };
}

/** Whether `c`'s 0/1 prop `prop` lets a drag move it (ADR 0070): the core
 * computes the flag and holds nothing by it; a type without the prop is
 * draggable. */
function allows(t: CellsTable, c: number, prop: string): boolean {
    const cell = t.cell(c, prop);
    return cell === undefined || t.value(cell) !== 0;
}

/** A shape's drag, gated as the current core's move actions gate it: one
 * part dragged (a vertex) needs `parts` (`verticesDraggable`), more than
 * one (the whole shape) `draggable`; a drag the flag forbids changes
 * nothing. `count` is how many parts the drag moves. */
function gated(
    parts: string,
    count: (args: Record<string, any>) => number,
    resolver: Resolver,
): Resolver {
    return (t, c, args) =>
        allows(t, c, count(args) === 1 ? parts : "draggable")
            ? resolver(t, c, args)
            : { kind: "none" };
}

/** A polygon's drag: as many parts as `pointCoords` names. */
function polygonDrag(resolver: Resolver): Resolver {
    return gated(
        "verticesDraggable",
        ({ pointCoords }) => Object.keys(pointCoords ?? {}).length,
        resolver,
    );
}

/** What follows other components and does not move, as in the current
 * core (a best-fit line): a drag changes nothing. */
const fixed: Resolver = () => ({ kind: "none" });

/** Keyed by component type, then action name. */
export const RENDERER_ACTIONS: Record<string, Record<string, Resolver>> = {
    // A click or a focus changes nothing of a point: the core's action of
    // that name, which a button may wait on (ADR 0042). The prototype's
    // point renderer does not send them yet.
    point: {
        move: movePoint,
        pointClicked: (_t, c) => ({
            kind: "act",
            component: c,
            action: "pointClicked",
        }),
        pointFocused: (_t, c) => ({
            kind: "act",
            component: c,
            action: "pointFocused",
        }),
    },
    graph: {
        changeBoundingBox: (t, c, { xMin, xMax, yMin, yMax }) => ({
            kind: "request",
            pairs: [
                [cellOf(t, c, "xmin"), xMin],
                [cellOf(t, c, "xmax"), xMax],
                [cellOf(t, c, "ymin"), yMin],
                [cellOf(t, c, "ymax"), yMax],
            ],
        }),
    },
    textInput: {
        updateImmediateValue: (t, c, { text }) => ({
            kind: "request",
            pairs: [[cellOf(t, c, "value"), t.core.intern(String(text))]],
        }),
        // The cells core keeps no separate immediate value: every keystroke
        // was already the value.
        updateValue: () => ({ kind: "none" }),
    },
    booleanInput: {
        updateBoolean: (t, c, { boolean }) => ({
            kind: "request",
            pairs: [[cellOf(t, c, "value"), boolean ? 1 : 0]],
        }),
    },
    choiceInput: {
        updateSelectedIndices: (t, c, { selectedIndices }) => ({
            kind: "request",
            pairs: [[cellOf(t, c, "selectedIndex"), selectedIndices[0] ?? 0]],
        }),
    },
    line: { moveLine },
    // A whole-segment drag sends both endpoints; an endpoint's drag, one.
    lineSegment: {
        moveLineSegment: (t, c, { point1coords, point2coords }) => {
            const moves: [Point, Point][] = [];
            if (point1coords) {
                moves.push([
                    [cellOf(t, c, "x1"), cellOf(t, c, "y1")],
                    point1coords,
                ]);
            }
            if (point2coords) {
                moves.push([
                    [cellOf(t, c, "x2"), cellOf(t, c, "y2")],
                    point2coords,
                ]);
            }
            return movePoints(moves);
        },
    },
    // The center; the inverse carries the through points along.
    circle: {
        moveCircle: (t, c, { center }) =>
            movePoints([[[cellOf(t, c, "cx"), cellOf(t, c, "cy")], center]]),
    },
    polygon: {
        movePolygon: polygonDrag((t, c, { pointCoords }) =>
            movePoints(vertexMoves(listPoints(t, c), pointCoords)),
        ),
    },
    // A ray's and a vector's drag asks for both points, the one not dragged
    // where it is, as the current core's moveRay and moveVector keep it.
    ray: {
        moveRay: (t, c, { endpointcoords, throughcoords }) =>
            moveBoth(
                t,
                c,
                ["endpointX", "endpointY", endpointcoords],
                ["throughX", "throughY", throughcoords],
            ),
    },
    vector: {
        moveVector: (t, c, { tailcoords, headcoords }) =>
            moveBoth(
                t,
                c,
                ["tailX", "tailY", tailcoords],
                ["headX", "headY", headcoords],
            ),
    },
    // A rectangle's corner drag holds the opposite corner, as the current
    // core's movePolygon does; a whole drag moves every vertex.
    rectangle: {
        movePolygon: polygonDrag((t, c, { pointCoords }) => {
            const vertices = listPoints(t, c);
            const moves = vertexMoves(vertices, pointCoords);
            const dragged = Object.keys(pointCoords).map(Number);
            if (dragged.length === 1 && vertices.length === 4) {
                const [cx, cy] = vertices[(dragged[0] + 2) % 4];
                moves.push([
                    [cx, cy],
                    [t.value(cx), t.value(cy)],
                ]);
            }
            return movePoints(moves);
        }),
    },
    // A vertex drag turns and scales it about its center (the core's
    // inverse); a whole drag moves it.
    regularPolygon: {
        movePolygon: polygonDrag((t, c, { pointCoords }) =>
            movePoints(vertexMoves(listPoints(t, c), pointCoords)),
        ),
    },
    // A vertex drag moves that vertex; a whole drag moves all three, as a
    // polygon's.
    triangle: {
        movePolygon: polygonDrag((t, c, { pointCoords }) =>
            movePoints(vertexMoves(listPoints(t, c), pointCoords)),
        ),
    },
    // The core snaps and clamps (ADR 0003).
    slider: {
        changeValue: (t, c, { value }) => ({
            kind: "request",
            pairs: [[cellOf(t, c, "value"), Number(value)]],
        }),
    },
    numberInput: {
        updateValue: (t, c, { value }) => ({
            kind: "request",
            pairs: [[cellOf(t, c, "value"), value ?? NaN]],
        }),
    },
    // Typed text is parsed in the core and the expression requested, on
    // the input's own expression or, bound, on the one it is bound to (an
    // entry of a math list, a symbolic math, a subset). A mathInput bound
    // to a number stays numeric: its expression is a constant, and the
    // number is requested on its value.
    mathInput: {
        updateValue: (t, c, { text }) => {
            const blank = String(text).trim() === "";
            const expr = cellOf(t, c, "expr");
            if (
                t.core.cell_holds(expr) !== "math" ||
                t.core.cell_class(expr) === "constant"
            ) {
                const n = blank ? NaN : Number(text);
                if (!blank && Number.isNaN(n)) return { kind: "none" };
                return { kind: "request", pairs: [[cellOf(t, c, "value"), n]] };
            }
            let handle = NaN;
            if (!blank) {
                try {
                    handle = t.core.parse_math(String(text));
                } catch {
                    // Text that does not parse changes nothing; the renderer
                    // keeps what was typed.
                    return { kind: "none" };
                }
            }
            return { kind: "request", pairs: [[expr, handle]] };
        },
    },
    hint: {
        toggle: (t, c, { open }) => ({
            kind: "request",
            pairs: [[cellOf(t, c, "open"), open ? 1 : 0]],
        }),
    },
    answer: {
        submitAnswer: (_t, c) => ({ kind: "submit", answer: c }),
    },
    solution: {
        revealSolution: (t, c) => ({
            kind: "request",
            pairs: [[cellOf(t, c, "open"), 1]],
        }),
        closeSolution: (t, c) => ({
            kind: "request",
            pairs: [[cellOf(t, c, "open"), 0]],
        }),
    },
    triggerSet: {
        triggerActions: (_t, c) => ({ kind: "trigger", component: c }),
    },
    // Derived geometry: what the renderers of the shapes they are drawn as
    // send. An equilibrium point or line and an endpoint move as a point
    // or a line does, and switch their flag on the current core's switch
    // actions, which the prototype's renderers do not send yet.
    bestFitLine: { moveLine: fixed },
    equilibriumPoint: { move: movePoint, switchPoint: switchFlag("stable") },
    endpoint: { move: movePoint, switchPoint: switchFlag("open") },
    equilibriumLine: { moveLine, switchLine: switchFlag("stable") },
    // A button calling another component's action: the core's `trigger`.
    callAction: {
        callAction: (_t, c) => ({ kind: "trigger", component: c }),
    },
    // A button setting another component's value, alone: the same press.
    updateValue: {
        updateValue: (_t, c) => ({ kind: "trigger", component: c }),
    },
    // A curve's through point dragged (ADR 0049), as the current core's
    // moveThroughPoint; an equilibrium curve switches its flag too.
    curve: { moveThroughPoint },
    equilibriumCurve: { moveThroughPoint, switchCurve: switchFlag("stable") },
    // A fraction input's box (ADR 0045): typed into as a math input.
    _fractionInputComponent: {
        updateValue: (t, c, args) =>
            RENDERER_ACTIONS.mathInput.updateValue(t, c, args),
    },
    // A matrix input's size controls (ADR 0045), as the current core's
    // actions: a request on its size, which rebuilds the grid; and its
    // boxes, typed into as math inputs.
    matrixInput: {
        updateNumRows: (t, c, { numRows }) => ({
            kind: "request",
            pairs: [[cellOf(t, c, "numRows"), Number(numRows)]],
        }),
        updateNumColumns: (t, c, { numColumns }) => ({
            kind: "request",
            pairs: [[cellOf(t, c, "numColumns"), Number(numColumns)]],
        }),
    },
    _matrixComponentInput: {
        updateValue: (t, c, args) =>
            RENDERER_ACTIONS.mathInput.updateValue(t, c, args),
    },
};

/** A value's drag in a graph, as the current core's `moveText`, `moveMath`
 * and `moveNumber`: its anchor, a point (`anchorX`, `anchorY`), for every
 * type that has one. */
const ANCHOR_MOVES = new Set(["moveText", "moveMath", "moveNumber"]);

function moveAnchor(
    t: CellsTable,
    c: number,
    { x, y }: Record<string, any>,
): Effect {
    return {
        kind: "points",
        pairs: [
            [cellOf(t, c, "anchorX"), x],
            [cellOf(t, c, "anchorY"), y],
        ],
    };
}

/** What a renderer action does to the cells core, or null when the table
 * has no entry for it. */
export function resolveRendererAction(
    table: CellsTable,
    component: number,
    actionName: string,
    args: Record<string, any>,
): Effect | null {
    const resolver =
        RENDERER_ACTIONS[table.componentType(component)]?.[actionName] ??
        (ANCHOR_MOVES.has(actionName) &&
        table.cell(component, "anchorX") !== undefined
            ? moveAnchor
            : undefined);
    return resolver ? resolver(table, component, args) : null;
}
