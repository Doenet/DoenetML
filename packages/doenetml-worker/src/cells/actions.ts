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
