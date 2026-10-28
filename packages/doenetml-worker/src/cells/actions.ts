/**
 * Renderer actions, resolved for the cells core (ADR 0020): each one the
 * prototype's component renderers send becomes requests, a point group, or a
 * core action (`submit`, `trigger`). The core never sees a renderer action.
 */
import { CellsTable } from "./table";

export type Effect =
    | { kind: "none" }
    | { kind: "request"; pairs: [cell: number, value: number][] }
    /** Points moved together (ADR 0006): `[xCell, x, yCell, y]` flattened
     * into pairs, as `Core.request_points` takes them. */
    | { kind: "points"; pairs: [cell: number, value: number][] }
    | { kind: "submit"; answer: number }
    | { kind: "trigger"; component: number };

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

/** Keyed by component type, then action name. */
export const RENDERER_ACTIONS: Record<string, Record<string, Resolver>> = {
    point: {
        move: (t, c, { x, y }) => ({
            kind: "points",
            pairs: [
                [cellOf(t, c, "x"), x],
                [cellOf(t, c, "y"), y],
            ],
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
    // A whole-line drag, as the current core's moveLine: a line given by a
    // direction moves by its first point only.
    line: {
        moveLine: (t, c, { point1coords, point2coords }) => {
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
        },
    },
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
        movePolygon: (t, c, { pointCoords }) => {
            const cells = t.listCells(c);
            const vertices: Point[] = [];
            for (let i = 0; i + 1 < cells.length; i += 2) {
                vertices.push([cells[i], cells[i + 1]]);
            }
            return movePoints(vertexMoves(vertices, pointCoords));
        },
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
    // Typed text is parsed in the core and the expression requested. A
    // mathInput bound to a number stays numeric: its expression is a
    // constant, and the number is requested on its value.
    mathInput: {
        updateValue: (t, c, { text }) => {
            const blank = String(text).trim() === "";
            const expr = cellOf(t, c, "expr");
            if (t.core.cell_class(expr) !== "essential") {
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
    triggerSet: {
        triggerActions: (_t, c) => ({ kind: "trigger", component: c }),
    },
};

/** What a renderer action does to the cells core, or null when the table
 * has no entry for it. */
export function resolveRendererAction(
    table: CellsTable,
    component: number,
    actionName: string,
    args: Record<string, any>,
): Effect | null {
    const resolver =
        RENDERER_ACTIONS[table.componentType(component)]?.[actionName];
    return resolver ? resolver(table, component, args) : null;
}
