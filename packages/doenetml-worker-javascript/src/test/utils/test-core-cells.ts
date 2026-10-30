/**
 * A stand-in for `createTestCore` that runs the document on the cells
 * core (`packages/cells-core`, a candidate replacement for this core), so
 * the existing worker tests measure how far it is from parity.
 * `npm run parity:cells` runs the whole suite this way and writes the
 * gap list to `CELLS_CORE_PARITY.md`.
 *
 * Enabled by `DOENET_TEST_CORE=cells`. The wasm package is read from
 * `CELLS_WASM_DIR` (default: `packages/cells-core/pkg`, written by
 * `npm run build:rust -w @doenet/cells-core`).
 *
 * The cells core has no state variables: components own numeric cells by
 * prop name. `stateValues.<name>` is answered from a per-kind table that maps
 * the JavaScript core's state variable names onto those cells and wraps the
 * numbers the way the tests expect (`math-expressions` objects where the
 * JavaScript core holds maths). Actions are translated to cell requests the
 * same way the cells viewer's renderers send them. Anything the table does not
 * cover throws `CellsCoreGap` naming the component type and state variable,
 * so a list of failures reads as a list of gaps.
 */
import me from "math-expressions";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { PublicDoenetMLCore as PublicDoenetMLCoreJavascript } from "../../CoreWorker";
// The bridge's view of the core's component table and cells (ADR 0001,
// ADR 0020): what the core holds in columns is read from them here too,
// so the core answers by name only what it resolves itself. A relative
// path, as `test-core.ts` reads `doenetml/src/flags`: the worker's
// package exports only its `dist/`.
import { CellsTable, NONE } from "../../../../doenetml-worker/src/cells/table";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export class CellsCoreGap extends Error {
    constructor(message: string) {
        super(`[cells core gap] ${message}`);
        this.name = "CellsCoreGap";
    }
}

export class StaleSnapshotRead extends Error {
    constructor(message: string) {
        super(`[stale snapshot read] ${message}`);
        this.name = "StaleSnapshotRead";
    }
}

const UNSUPPORTED_OPTIONS = [
    "theme",
    "documentLocale",
    "localeResources",
    "styleOverrides",
] as const;

type Get = (prop: string) => number;
/** What a reader may ask beyond numeric props: text and expressions. */
type Ctx = {
    idx: number;
    cells: Cells;
    /** The cell of a prop, or undefined. */
    cell: (prop: string) => number | undefined;
};
/** The core behind the harness: the wasm `Core`, and the table over its
 * memory, with what the readers ask of them. */
type Cells = {
    core: any;
    table: CellsTable;
    /** A cell's value. */
    value: (cell: number) => number;
    /** The string a text cell holds; empty for none. */
    text: (cell: number) => string;
    /** The cells of a prop by name, as the core resolves it (combined and
     * list props, alternate names); empty for no such prop. */
    propCells: (idx: number, prop: string) => Uint32Array;
};
type Reader = (get: Get, x: Ctx) => unknown;

const M = (v: number) => me.fromAst(v);
const pt = (get: Get, x: string, y: string) => [M(get(x)), M(get(y))];
const npt = (get: Get, x: string, y: string) => [get(x), get(y)];

/** Items of an array prop: `[[x1, y1], [x2, y2], ...]` as prop names. */
function items(
    prefixX: string,
    prefixY: string,
    n: number,
): [string, string][] {
    return Array.from({ length: n }, (_, i) => [
        `${prefixX}${i + 1}`,
        `${prefixY}${i + 1}`,
    ]);
}

const valueReaders: Record<string, Reader> = {
    value: (g) => M(g("value")),
    immediateValue: (g) => M(g("value")),
    valueForDisplay: (g) => M(g("value")),
};

/** The blank expression the current core shows for an empty input. */
const BLANK = "\uff3f";

/** The expression a math cell holds; blank when the handle is NaN. */
const exprOf = (cells: Cells, cell: number) =>
    Number.isNaN(cells.value(cell))
        ? me.fromAst(BLANK)
        : me.fromText(cells.core.expr_text(cell));

/** A math's value: its expression when it is a math cell (plan 5), else
 * the number its lowered chain computes. An unbound mathInput's blank
 * expression is the blank symbol. */
const mathValue: Reader = (g, x) => {
    const e = x.cell("expr");
    if (e !== undefined) {
        if (!Number.isNaN(x.cells.value(e))) {
            return me.fromText(x.cells.core.expr_text(e));
        }
        if (x.cells.core.cell_class(e) === "essential")
            return me.fromAst(BLANK);
    }
    return M(g("value"));
};

/** The live response one input holds: its expression, or a boolean. */
function responseOf(cells: Cells, input: number): unknown {
    if (cells.table.tag(input) === "booleanInput") {
        return cells.value(cells.propCells(input, "value")[0]) !== 0;
    }
    return exprOf(cells, cells.propCells(input, "expr")[0]);
}

/** An attribute read as a flag: present and not `false`. */
function attrFlag(
    cells: Cells,
    idx: number,
    name: string,
): boolean | undefined {
    const text = cells.table.attr(idx, name);
    if (text === null) return undefined;
    return text.trim().toLowerCase() !== "false";
}

/** Answers submitted since the last change to one of their inputs
 * (`justSubmitted`): kept here, since the core has no cell for it. */
const justSubmitted = new Set<number>();

const answerReaders: Record<string, Reader> = {
    creditAchieved: (g) => {
        const c = g("credit");
        return Number.isNaN(c) ? 0 : c;
    },
    numSubmissions: (g) => g("numSubmissions"),
    justSubmitted: (_g, x) => justSubmitted.has(x.idx),
    inputChildren: (_g, x) =>
        Array.from(x.cells.core.answer_inputs(x.idx) as Uint32Array)
            .filter((i) => x.cells.table.parent(i) === x.idx)
            .map((i) => ({
                componentIdx: i,
                componentType: x.cells.table.tag(i),
            })),
    currentResponses: (_g, x) =>
        Array.from(x.cells.core.answer_inputs(x.idx) as Uint32Array).map((i) =>
            responseOf(x.cells, i),
        ),
    numResponses: (_g, x) => x.cells.core.answer_inputs(x.idx).length,
    submittedResponses: (g, x) => {
        if (g("numSubmissions") === 0) return [];
        const inputs = Array.from(
            x.cells.core.answer_inputs(x.idx) as Uint32Array,
        );
        return Array.from(
            x.cells.core.answer_submitted(x.idx) as Uint32Array,
        ).map((cell, k) =>
            x.cells.table.tag(inputs[k]) === "booleanInput"
                ? x.cells.value(cell) !== 0
                : exprOf(x.cells, cell),
        );
    },
    // The `showCorrectness` flag is not modelled: the attribute on the
    // answer or its nearest ancestor giving one, else true unless the
    // answer is hand graded.
    showCorrectness: (_g, x) => {
        for (
            let c: number | null = x.idx;
            c !== null;
            c = x.cells.table.parent(c)
        ) {
            const v = attrFlag(x.cells, c, "showCorrectness");
            if (v !== undefined) return v;
        }
        return !(attrFlag(x.cells, x.idx, "handGraded") ?? false);
    },
    handGraded: (_g, x) => attrFlag(x.cells, x.idx, "handGraded") ?? false,
};

const awardReaders: Record<string, Reader> = {
    creditAchieved: (g) => {
        const c = g("awarded");
        return Number.isNaN(c) ? 0 : c;
    },
    awarded: (g) => g("awarded") > 0,
};
const mathReaders: Record<string, Reader> = {
    value: mathValue,
    immediateValue: mathValue,
    valueForDisplay: mathValue,
    text: (_g, x) => x.cells.core.component_text(x.idx),
};

/** The text a container shows, through active cases only (ADR 0009). */
const textOf: Reader = (_g, x) => x.cells.core.component_text(x.idx);
const containerReaders: Record<string, Reader> = { text: textOf };

/**
 * JavaScript-core state variable name -> reader over the cells core's props,
 * per component type.
 */
const STATE: Record<string, Record<string, Reader>> = {
    point: {
        xs: (g) => pt(g, "x", "y"),
        numericalXs: (g) => npt(g, "x", "y"),
        coords: (g) => me.fromAst(["vector", g("x"), g("y")]),
        x: (g) => M(g("x")),
        y: (g) => M(g("y")),
        numDimensions: () => 2,
        hidden: (g) => g("hide") !== 0,
        hide: (g) => g("hide") !== 0,
    },
    circle: {
        center: (g) => pt(g, "cx", "cy"),
        numericalCenter: (g) => npt(g, "cx", "cy"),
        radius: (g) => M(g("radius")),
        numericalRadius: (g) => g("radius"),
        diameter: (g) => M(g("diameter")),
        area: (g) => M(g("area")),
        circumference: (g) => M(g("circumference")),
        numThroughPoints: (g) => g("numThroughPoints"),
        throughPoints: (g) =>
            items("throughPointX", "_", g("numThroughPoints")).map(([x]) => [
                M(g(`${x}_1`)),
                M(g(`${x}_2`)),
            ]),
        numericalThroughPoints: (g) =>
            items("throughPointX", "_", g("numThroughPoints")).map(([x]) => [
                g(`${x}_1`),
                g(`${x}_2`),
            ]),
    },
    line: {
        points: (g) => [pt(g, "x1", "y1"), pt(g, "x2", "y2")],
        numericalPoints: (g) => [npt(g, "x1", "y1"), npt(g, "x2", "y2")],
        slope: (g) => M(g("slope")),
        xintercept: (g) => M(g("xintercept")),
        yintercept: (g) => M(g("yintercept")),
        coeff0: (g) => M(g("coeff0")),
        coeffvar1: (g) => M(g("coeffvar1")),
        coeffvar2: (g) => M(g("coeffvar2")),
        numericalCoeff0: (g) => g("coeff0"),
        numericalCoeffvar1: (g) => g("coeffvar1"),
        numericalCoeffvar2: (g) => g("coeffvar2"),
        // The cells core keeps coefficients, not an equation; the tests
        // compare equations semantically, so this form is as good as any.
        equation: (g) =>
            me.fromAst([
                "=",
                [
                    "+",
                    ["*", g("coeffvar1"), "x"],
                    ["*", g("coeffvar2"), "y"],
                    g("coeff0"),
                ],
                0,
            ]),
        variables: () => [me.fromAst("x"), me.fromAst("y")],
        numDimensions: () => 2,
    },
    lineSegment: {
        endpoints: (g) => [pt(g, "x1", "y1"), pt(g, "x2", "y2")],
        numericalEndpoints: (g) => [npt(g, "x1", "y1"), npt(g, "x2", "y2")],
    },
    polygon: {
        numVertices: (g) => g("numVertices"),
        vertices: (g) =>
            items("x", "y", g("numVertices")).map(([x, y]) => pt(g, x, y)),
        numericalVertices: (g) =>
            items("x", "y", g("numVertices")).map(([x, y]) => npt(g, x, y)),
    },
    mathInput: mathReaders,
    math: mathReaders,
    // The current core's number values are plain numbers.
    number: {
        value: (g) => g("value"),
        valueForDisplay: (g) => g("value"),
        text: textOf,
    },
    text: {
        value: (_g, x) => x.cells.text(x.cell("value")!).trim(),
        text: (_g, x) => x.cells.text(x.cell("value")!).trim(),
    },
    // `immediateValue` is the same cell as `value` in the cells core: a
    // typed-but-uncommitted text is kept here (`rawValues`) until
    // `updateValue`, so the two never differ.
    textInput: {
        value: (_g, x) => x.cells.text(x.cell("value")!),
        immediateValue: (_g, x) => x.cells.text(x.cell("value")!),
        text: (_g, x) => x.cells.text(x.cell("value")!),
    },
    p: containerReaders,
    group: containerReaders,
    document: containerReaders,
    conditionalContent: containerReaders,
    select: containerReaders,
    numberInput: valueReaders,
    slider: valueReaders,
    booleanInput: { value: (g) => g("value") !== 0 },
    boolean: {
        value: (g) => g("value") !== 0,
        text: (g) => (g("value") !== 0 ? "true" : "false"),
    },
    answer: answerReaders,
    award: awardReaders,
};

function stripPositions(o: any): any {
    if (Array.isArray(o)) return o.map(stripPositions);
    if (o && typeof o === "object") {
        const r: any = {};
        for (const [k, v] of Object.entries(o)) {
            if (k === "position" || k === "sources") continue;
            r[k] = stripPositions(v);
        }
        return r;
    }
    return o;
}

/** A latex string typed into a mathInput, as the number the cells core stores. */
function latexToNumber(latex: string): number {
    const text = latex.trim();
    if (text === "") return NaN;
    if (text === "\\infty") return Infinity;
    if (text === "-\\infty") return -Infinity;
    try {
        const v = me.fromLatex(text).evaluate_to_constant();
        return typeof v === "number" ? v : NaN;
    } catch {
        return NaN;
    }
}

export async function createTestCoreCells({
    doenetML,
    requestedVariantIndex = 1,
    externalDoenetMLs = {},
    initializeCounters = {},
    initialState,
    ...rest
}: {
    doenetML: string;
    requestedVariantIndex?: number;
    externalDoenetMLs?: Record<string, string>;
    initializeCounters?: Record<string, number>;
    /** `saveState()`'s JSON from an earlier session of this document. */
    initialState?: string;
    [key: string]: unknown;
}) {
    for (const option of UNSUPPORTED_OPTIONS) {
        if (rest[option] !== undefined) {
            throw new CellsCoreGap(`createTestCore option \`${option}\``);
        }
    }
    // The variant index is the document seed (ADR 0009).
    if (Object.keys(initializeCounters).length > 0)
        throw new CellsCoreGap("`initializeCounters`");
    if (Object.keys(externalDoenetMLs).length > 0)
        throw new CellsCoreGap("`externalDoenetMLs`");

    const wasmDir =
        process.env.CELLS_WASM_DIR ??
        path.resolve(import.meta.dirname, "../../../../cells-core/pkg");
    const mod = await import(
        pathToFileURL(path.join(wasmDir, "cells_wasm.js")).href
    );
    const wasm = await mod.default(
        fs.readFileSync(path.join(wasmDir, "cells_wasm_bg.wasm")),
    );

    const dast = stripPositions(
        normalizeDocumentDast(lezerToDast(doenetML), true),
    );
    let core: any;
    try {
        const bytes = new TextEncoder().encode(JSON.stringify(dast));
        // Unpruned (ADR 0019): the tests read any state variable, not only
        // what a renderer reads. `CELLS_PRUNE=1` loads as a browser does,
        // for timing (`packages/benchmark/scripts/perf-diff.sh`).
        const prune = process.env.CELLS_PRUNE === "1";
        core = new mod.Core(bytes, requestedVariantIndex, prune, initialState);
    } catch (e) {
        throw new CellsCoreGap(`load: ${String(e)}`);
    }
    const table = new CellsTable(core, wasm.memory);
    const cells: Cells = {
        core,
        table,
        value: (cell) => table.value(cell),
        text: (cell) => {
            const id = table.value(cell);
            return Number.isNaN(id) || id < 0 || id >= core.n_strings()
                ? ""
                : table.string(id);
        },
        propCells: (idx, prop) => core.prop_cells(idx, prop) as Uint32Array,
    };

    let actionCount = 0;
    const rawValues = new Map<number, string>();

    function assertCurrent(takenAt: number, what: string) {
        if (takenAt !== actionCount) {
            throw new StaleSnapshotRead(
                `${what}, from a snapshot taken before the last ${actionCount - takenAt} action(s)`,
            );
        }
    }

    const propCells = cells.propCells;

    function getter(idx: number, componentType: string): Get {
        return (prop: string) => {
            const c = propCells(idx, prop);
            if (c.length === 0)
                throw new CellsCoreGap(`prop \`${componentType}.${prop}\``);
            return cells.value(c[0]);
        };
    }

    function stateValue(
        idx: number,
        componentType: string,
        name: string,
    ): unknown {
        const reader = STATE[componentType]?.[name];
        if (!reader)
            throw new CellsCoreGap(
                `state variable \`${componentType}.${name}\``,
            );
        const v = reader(getter(idx, componentType), {
            idx,
            cells,
            cell: (prop: string) => {
                const c = propCells(idx, prop);
                return c.length === 0 ? undefined : c[0];
            },
        });
        if (process.env.CELLS_TRACE) {
            console.log(
                `[cells]   read ${componentType}#${idx}.${name} = ${JSON.stringify(v, (_k, x) => (x && x.tree !== undefined ? x.tree : x))}`,
            );
        }
        return v;
    }

    function componentEntry(
        componentIdx: number,
        componentType: string,
        takenAt: number,
    ) {
        const stateValues = new Proxy(
            {},
            {
                get(_target, name) {
                    if (typeof name !== "string") return undefined;
                    assertCurrent(takenAt, `\`${componentType}.${name}\``);
                    return stateValue(componentIdx, componentType, name);
                },
                has(_target, name) {
                    return (
                        typeof name === "string" &&
                        STATE[componentType]?.[name] !== undefined
                    );
                },
                ownKeys() {
                    throw new CellsCoreGap(
                        `enumerating every state variable of \`${componentType}\``,
                    );
                },
            },
        );
        const unsupported = (field: string) => () => {
            throw new CellsCoreGap(`\`${field}\` of \`${componentType}\``);
        };
        return Object.defineProperties(
            { componentIdx, componentType, stateValues },
            Object.fromEntries(
                [
                    "activeChildren",
                    "replacements",
                    "replacementsToWithhold",
                    "replacementOf",
                    "sharedParameters",
                ].map((f) => [f, { get: unsupported(f) }]),
            ),
        );
    }

    /** Points moved together are one point group (ADR 0006): the core keeps
     * them a translation apart when one of them is constrained. The pairs
     * come in x, y order per point. */
    function request(reqs: [number, number][], points = false) {
        const idx = new Uint32Array(reqs.map((r) => r[0]));
        const vals = new Float64Array(reqs.map((r) => r[1]));
        if (points && reqs.length % 2 === 0) core.request_points(idx, vals);
        else core.request(idx, vals);
        // A tick may move the cells (a rebuild makes every array anew).
        table.reload();
        // Any change ends an answer's `justSubmitted`, as an input's
        // value change does in the current core.
        justSubmitted.clear();
        if (process.env.CELLS_TRACE) {
            const after = reqs.map(([c]) => `${c}=${cells.value(c)}`).join(" ");
            console.log(
                `[cells]   requests ${JSON.stringify(reqs)} -> ${after}${core.last_rebuilt() ? "; rebuilt" : ""}`,
            );
        }
    }

    /** Requests on the coordinate props of one point-valued prop pair. */
    function pointRequests(
        idx: number,
        componentType: string,
        x: string,
        y: string,
        coords: (number | undefined)[],
    ): [number, number][] {
        const g = (prop: string) => {
            const c = propCells(idx, prop);
            if (c.length === 0)
                throw new CellsCoreGap(`prop \`${componentType}.${prop}\``);
            return c[0];
        };
        const out: [number, number][] = [];
        if (coords[0] !== undefined) out.push([g(x), Number(coords[0])]);
        if (coords[1] !== undefined) out.push([g(y), Number(coords[1])]);
        if (coords.length > 2 && coords[2] !== undefined)
            throw new CellsCoreGap(`3D ${componentType}`);
        return out;
    }

    const adapter = {
        async returnAllStateVariables(
            _consoleLog?: boolean,
            _dontRemoveFunctionsMath?: boolean,
        ) {
            const takenAt = actionCount;
            return new Proxy({} as Record<number, any>, {
                get(_target, key) {
                    if (typeof key !== "string" || !/^-?\d+$/.test(key))
                        return undefined;
                    assertCurrent(takenAt, `component ${key}`);
                    const componentIdx = Number(key);
                    const componentType =
                        componentIdx >= 0 && componentIdx < table.length
                            ? table.tag(componentIdx)
                            : undefined;
                    return componentType === undefined
                        ? undefined
                        : componentEntry(componentIdx, componentType, takenAt);
                },
                ownKeys() {
                    throw new CellsCoreGap("enumerating every component");
                },
            });
        },

        async requestAction({
            componentIdx,
            actionName,
            args = {},
        }: {
            componentIdx: number | undefined;
            actionName: string;
            args?: Record<string, any>;
        }) {
            if (componentIdx === undefined || componentIdx < 0) {
                throw new CellsCoreGap(
                    `action \`${actionName}\` on an unresolved component`,
                );
            }
            const componentType =
                componentIdx < table.length
                    ? table.tag(componentIdx)
                    : "(none)";
            actionCount++;
            if (process.env.CELLS_TRACE) {
                console.log(
                    `[cells] ${componentType}#${componentIdx}.${actionName} ${JSON.stringify(args)}`,
                );
            }
            switch (actionName) {
                case "movePoint":
                    request(
                        pointRequests(componentIdx, componentType, "x", "y", [
                            args.x,
                            args.y,
                            args.z,
                        ]),
                    );
                    return;
                case "moveCircle":
                    request(
                        pointRequests(
                            componentIdx,
                            componentType,
                            "cx",
                            "cy",
                            args.center ?? [],
                        ),
                        true,
                    );
                    return;
                case "changeRadius":
                    // No renderer requests a radius, so the core refuses a
                    // request on it (ADR 0018); a document changes it
                    // through an input bound to it.
                    throw new CellsCoreGap(
                        `action \`${componentType}.changeRadius\`: the radius is no input's prop`,
                    );
                case "moveLine": {
                    // As the JavaScript core's action: a line based on a slope
                    // or direction translates with its first point only.
                    const based = cells.value(
                        propCells(componentIdx, "basedOnDirection")[0],
                    );
                    let reqs = pointRequests(
                        componentIdx,
                        componentType,
                        "x1",
                        "y1",
                        args.point1coords ?? [],
                    );
                    if (!based)
                        reqs = reqs.concat(
                            pointRequests(
                                componentIdx,
                                componentType,
                                "x2",
                                "y2",
                                args.point2coords ?? [],
                            ),
                        );
                    request(reqs, true);
                    return;
                }
                case "moveLineSegment":
                    request(
                        [
                            ...pointRequests(
                                componentIdx,
                                componentType,
                                "x1",
                                "y1",
                                args.point1coords ?? [],
                            ),
                            ...pointRequests(
                                componentIdx,
                                componentType,
                                "x2",
                                "y2",
                                args.point2coords ?? [],
                            ),
                        ],
                        true,
                    );
                    return;
                case "movePolygon":
                case "movePolyline": {
                    const reqs: [number, number][] = [];
                    for (const [i, coords] of Object.entries(
                        args.pointCoords ?? {},
                    )) {
                        const k = Number(i) + 1;
                        reqs.push(
                            ...pointRequests(
                                componentIdx,
                                componentType,
                                `x${k}`,
                                `y${k}`,
                                coords as number[],
                            ),
                        );
                    }
                    request(reqs, true);
                    return;
                }
                case "updateRawValue":
                    rawValues.set(
                        componentIdx,
                        String(args.rawRendererValue ?? ""),
                    );
                    return;
                case "updateImmediateValue":
                    if (componentType === "textInput") {
                        rawValues.set(componentIdx, String(args.text ?? ""));
                        return;
                    }
                    rawValues.set(
                        componentIdx,
                        String(
                            args.mathExpression?.toLatex?.() ??
                                args.rawRendererValue ??
                                "",
                        ),
                    );
                    return;
                case "updateValue": {
                    if (componentType === "textInput") {
                        // The text is interned in the core's string table
                        // and its id requested on the value cell.
                        const text = rawValues.get(componentIdx) ?? "";
                        const cell = propCells(componentIdx, "value")[0];
                        request([[cell, core.intern(text)]]);
                        return;
                    }
                    const latex = rawValues.get(componentIdx) ?? "";
                    // An unbound mathInput holds an expression (plan 5):
                    // what was typed goes to its essential `expr` cell.
                    // A number keeps the numeric path (the value cell's
                    // inverse writes a constant expression).
                    const expr = propCells(componentIdx, "expr")[0];
                    if (
                        expr !== undefined &&
                        core.cell_class(expr) === "essential" &&
                        Number.isNaN(latexToNumber(latex)) &&
                        latex.trim() !== ""
                    ) {
                        let handle = NaN;
                        try {
                            handle = core.parse_math(
                                me.fromLatex(latex).toString(),
                            );
                        } catch {
                            handle = NaN;
                        }
                        request([[expr, handle]]);
                        return;
                    }
                    request([
                        [
                            propCells(componentIdx, "value")[0],
                            latexToNumber(latex),
                        ],
                    ]);
                    return;
                }
                case "updateBoolean":
                    request([
                        [
                            propCells(componentIdx, "value")[0],
                            args.boolean ? 1 : 0,
                        ],
                    ]);
                    return;
                case "submitAnswer":
                    if (componentType !== "answer")
                        throw new CellsCoreGap(
                            `action \`${componentType}.submitAnswer\``,
                        );
                    core.submit(componentIdx);
                    table.reload();
                    justSubmitted.add(componentIdx);
                    return;
                default:
                    throw new CellsCoreGap(
                        `action \`${componentType}.${actionName}\``,
                    );
            }
        },
    };

    async function resolvePathToNodeIdx(name: string, _origin = 0) {
        const idx = core.resolve_path(name);
        return idx === NONE ? -1 : idx;
    }

    return {
        core: withJavascriptOnlyGaps(adapter),
        cells: core,
        resolvePathToNodeIdx,
        /** Bytes of wasm linear memory; the benchmark's memory column. */
        wasmMemoryBytes: () => wasm.memory.buffer.byteLength as number,
        /** The session's state as JSON, for `initialState` of a later load. */
        saveState: () => core.save_state() as string,
        scoreState: unreported("scoreState"),
        pendingReports: unreported("pendingReports"),
        lastStateReport: unreported("lastStateReport"),
    };
}

function unreported(name: string) {
    return new Proxy(
        {},
        {
            get(_target, key) {
                if (typeof key !== "string" || key === "then") return undefined;
                throw new CellsCoreGap(`core API \`${name}.${key}\``);
            },
        },
    );
}

function withJavascriptOnlyGaps<T extends object>(core: T): T {
    const internals = new Proxy(
        {},
        {
            get(_target, key) {
                if (typeof key !== "string" || key === "then") return undefined;
                throw new CellsCoreGap(
                    `JavaScript core internals \`core.core.${key}\``,
                );
            },
        },
    );
    return new Proxy(core, {
        get(target, key, receiver) {
            if (key in target) return Reflect.get(target, key, receiver);
            if (key === "core") return internals;
            if (
                typeof key === "string" &&
                key in PublicDoenetMLCoreJavascript.prototype
            ) {
                throw new CellsCoreGap(`core API \`core.${key}\``);
            }
            return undefined;
        },
    });
}
