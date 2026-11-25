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
import { resolveRendererAction } from "../../../../doenetml-worker/src/cells/actions";
import { CellsBridge } from "../../../../doenetml-worker/src/cells/bridge";
import {
    LIST_LIKE,
    Reads,
    label,
    SECTION_KINDS,
    sectionBoxed,
    TRANSPARENT,
    childrenLatex,
    displaySettings,
    hiddenByHide,
    mdLatex,
    pointLatex,
    vertexCells,
} from "../../../../doenetml-worker/src/cells/contracts";
import { composeTitlePrefix, sectionNameWord } from "../../utils/sectionWords";
import { latexToText } from "../../utils/math";
import { convertLatexWithBlanks } from "../../utils/embeddedMathInputs";
import { CellsDiagnostics } from "./cells-diagnostics";

/** The types whose children are their entries' rows (ADR 0041, decision
 * 4): each row is addressed as `list:k`. */
const ROW_LISTS = new Set(
    [...LIST_LIKE].filter(
        (t) =>
            ![
                "repeat",
                "repeatForSequence",
                "collect",
                "select",
                "asList",
            ].includes(t),
    ),
);
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
    /** The tag the author wrote for a component (`feedback` for the
     * conditional content it is), read from the source; null for one the
     * compile made. */
    elementName: (idx: number) => string | null;
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

/** The expression a math cell holds, read as the core's math tree (which
 * text cannot tell from a tuple, an open interval; ADR 0041, decision 8). */
function heldExpr(cells: Cells, cell: number) {
    return me.fromAst(JSON.parse(cells.core.expr_ast(cell)));
}

/** The expression a math cell holds; blank when the handle is NaN. */
const exprOf = (cells: Cells, cell: number) =>
    Number.isNaN(cells.value(cell)) ? me.fromAst(BLANK) : heldExpr(cells, cell);

/** A math's value: its expression when it is a math cell (plan 5), else
 * the number its lowered chain computes. An unbound mathInput's blank
 * expression is the blank symbol. */
const mathValue: Reader = (g, x) => {
    const e = x.cell("expr");
    if (e !== undefined) {
        if (!Number.isNaN(x.cells.value(e))) {
            return heldExpr(x.cells, e);
        }
        if (x.cells.core.cell_class(e) === "essential")
            return me.fromAst(BLANK);
    }
    // A value that is missing (ADR 0046) is the blank, as the current
    // core's math holding nothing to read is.
    const v = x.cell("value");
    if (v !== undefined && x.cells.table.isMissing(v)) return me.fromAst(BLANK);
    return M(g("value"));
};

/** The text of the choice a choice input shows at place `k` (from 1),
 * through its `choiceOrder` (ADR 0053); null for no such place. A copy's
 * choices are its referent's. */
function choiceTextAt(cells: Cells, ci: number, k: number): string | null {
    const order = Array.from(cells.propCells(ci, "choiceOrder")).map((c) =>
        cells.value(c),
    );
    const choicesOf = (c: number): number[] =>
        cells.table
            .children(c)
            .flatMap((ch) =>
                "component" in ch &&
                cells.table.componentType(ch.component) === "choice"
                    ? [ch.component]
                    : [],
            );
    let choices = choicesOf(ci);
    for (
        let r = cells.table.referent(ci);
        choices.length === 0 && r !== null;
        r = cells.table.referent(r)
    ) {
        choices = choicesOf(r);
    }
    if (!Number.isInteger(k) || k < 1 || k > order.length) return null;
    const choice = choices[order[k - 1] - 1];
    return choice === undefined
        ? null
        : cells.core.component_text(choice).trim();
}

/** The responses a choice input gives at place `k`: the chosen choice's
 * text, or none (ADR 0077). */
function choiceResponses(cells: Cells, ci: number, k: number): string[] {
    const text = choiceTextAt(cells, ci, k);
    return text === null ? [] : [text];
}

/** The live response one input holds: its expression, or a boolean. */
function responseOf(cells: Cells, input: number): unknown {
    if (cells.table.tag(input) === "booleanInput") {
        return cells.value(cells.propCells(input, "value")[0]) !== 0;
    }
    // A text answer's response is the text typed.
    if (cells.table.tag(input) === "textInput") {
        return cells.text(cells.propCells(input, "value")[0]);
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

/** Answers submitted, each with its responses as they were at the
 * submission (`justSubmitted`): kept here, since the core has no cell for
 * it. An answer is just submitted while its responses are unchanged, as
 * the current core's is while what its credit reads is. */
const justSubmitted = new Map<number, string>();

/** An answer's current responses: each input's, a choice input's the
 * chosen choice's text, or none. */
function currentResponsesOf(cells: Cells, answer: number): unknown[] {
    return Array.from(cells.core.answer_inputs(answer) as Uint32Array).flatMap(
        (i) =>
            cells.table.tag(i) === "choiceInput"
                ? choiceResponses(
                      cells,
                      i,
                      cells.value(cells.propCells(i, "selectedIndex")[0]),
                  )
                : [responseOf(cells, i)],
    );
}

/** An answer's current responses, as one key to compare. */
function responsesKey(cells: Cells, answer: number): string {
    return JSON.stringify(
        currentResponsesOf(cells, answer).map((r: any) => r?.tree ?? r),
    );
}

const answerReaders: Record<string, Reader> = {
    creditAchieved: (g) => {
        const c = g("credit");
        return Number.isNaN(c) ? 0 : c;
    },
    numSubmissions: (g) => g("numSubmissions"),
    justSubmitted: (_g, x) =>
        justSubmitted.get(x.idx) === responsesKey(x.cells, x.idx),
    inputChildren: (_g, x) =>
        Array.from(x.cells.core.answer_inputs(x.idx) as Uint32Array)
            .filter((i) => x.cells.table.parent(i) === x.idx)
            .map((i) => ({
                componentIdx: i,
                componentType: x.cells.table.tag(i),
            })),
    currentResponses: (_g, x) => currentResponsesOf(x.cells, x.idx),
    numResponses: (_g, x) => x.cells.core.answer_inputs(x.idx).length,
    submittedResponses: (g, x) => {
        if (g("numSubmissions") === 0) return [];
        const inputs = Array.from(
            x.cells.core.answer_inputs(x.idx) as Uint32Array,
        );
        return Array.from(
            x.cells.core.answer_submitted(x.idx) as Uint32Array,
        ).flatMap((cell, k) =>
            x.cells.table.tag(inputs[k]) === "choiceInput"
                ? choiceResponses(x.cells, inputs[k], x.cells.value(cell))
                : [
                      x.cells.table.tag(inputs[k]) === "booleanInput"
                          ? x.cells.value(cell) !== 0
                          : x.cells.table.tag(inputs[k]) === "textInput"
                            ? x.cells.text(cell)
                            : exprOf(x.cells, cell),
                  ],
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
    // Its `<label>` child's text, which the input it makes shows too
    // (ADR 0077).
    label: (_g, x) => label(x.cells.table, x.idx),
};

const awardReaders: Record<string, Reader> = {
    creditAchieved: (g) => {
        const c = g("awarded");
        return Number.isNaN(c) ? 0 : c;
    },
    awarded: (g) => g("awarded") > 0,
};
/** What the bridge reads of the core to write a renderer's props, here
 * unrecorded: the LaTeX is the bridge's (`cells/contracts.ts`), the
 * rounding and writing the core's (`sym::Display`). */
function reads(x: Ctx): Reads {
    return new Reads(x.cells.table, (c) => c, null);
}

/** Whether an `<md>` has `<mrow>`s (an `<me>` has none). */
function hasRows(x: Ctx): boolean {
    return x.cells.table
        .children(x.idx)
        .some(
            (c) =>
                "component" in c &&
                x.cells.table.componentType(c.component) === "mrow",
        );
}

/** A math's `latex`: its value rounded and written by its number-display
 * settings, as the bridge sends it. */
const mathLatex: Reader = (_g, x) => reads(x).mathLatex(x.idx);

/** The display settings of a number or a math (ADR 0058), as the six
 * numbers the core rounds by: from the nearest of it and its referents
 * that writes each (`contracts.ts`). */
const settingsOf = (x: Ctx) => displaySettings(x.cells.table, x.idx);

/** A number's or a math's own display settings as the current core's
 * state variables (`utils/numberDisplay.js`): digits and decimals, the
 * one not written off (0, -Infinity), the flags as booleans. */
const displaySettingReaders: Record<string, Reader> = {
    displayDigits: (_g, x) => settingsOf(x)[0],
    displayDecimals: (_g, x) => settingsOf(x)[1],
    displaySmallAsZero: (_g, x) => settingsOf(x)[2],
    padZeros: (_g, x) => settingsOf(x)[3] !== 0,
    avoidScientificNotation: (_g, x) => settingsOf(x)[4] !== 0,
};

/** A math's `valueForDisplay`: its expression, or the number its lowered
 * chain computes, rounded by its display settings (ADR 0071). */
const mathValueForDisplay: Reader = (g, x) => {
    const e = x.cell("expr");
    if (e !== undefined && !Number.isNaN(x.cells.value(e))) {
        return me.fromAst(
            JSON.parse(x.cells.core.display_ast(e, settingsOf(x))),
        );
    }
    const value = mathValue(g, x) as any;
    return typeof value?.tree === "number"
        ? M(x.cells.core.number_display_value(value.tree, settingsOf(x)))
        : value;
};

/** A math input's display settings: a number's, but 10 digits and no
 * small number shown as zero where nothing writes digits or decimals, as
 * the current core's `<mathInput>` defaults them. */
function inputSettingsOf(x: Ctx): Float64Array {
    const s = settingsOf(x);
    const t = x.cells.table;
    if (
        t.attrThrough(x.idx, "displayDigits") === null &&
        t.attrThrough(x.idx, "displayDecimals") === null
    ) {
        s[0] = 10;
        if (t.attrThrough(x.idx, "displaySmallAsZero") === null) s[2] = 0;
    }
    return s;
}

/** A math input's `valueForDisplay`: its expression, or the number it is
 * bound to, rounded by its display settings. */
const inputValueForDisplay: Reader = (g, x) => {
    const e = x.cell("expr");
    if (e !== undefined && !Number.isNaN(x.cells.value(e))) {
        return me.fromAst(
            JSON.parse(x.cells.core.display_ast(e, inputSettingsOf(x))),
        );
    }
    const value = mathValue(g, x) as any;
    return typeof value?.tree === "number"
        ? M(x.cells.core.number_display_value(value.tree, inputSettingsOf(x)))
        : value;
};

const mathReaders: Record<string, Reader> = {
    value: mathValue,
    immediateValue: mathValue,
    valueForDisplay: mathValueForDisplay,
    text: (_g, x) => x.cells.core.component_text(x.idx),
    latex: mathLatex,
    // How many entries its value holds (ADR 0041, inside the handle).
    numDimensions: (g) => g("numDimensions"),
    ...displaySettingReaders,
    hidden: (_g, x) => hiddenOf(x.cells, x.idx),
};

/** The text a container shows, through active cases only (ADR 0009). */
const textOf: Reader = (_g, x) => x.cells.core.component_text(x.idx);

/** A choice input's `choiceOrder` (ADR 0053): the position among its
 * choices of the one shown at each place. */
const choiceOrderOf = (x: Ctx): number[] =>
    Array.from(x.cells.propCells(x.idx, "choiceOrder")).map((c) =>
        x.cells.value(c),
    );
const containerReaders: Record<string, Reader> = { text: textOf };

/** A shape's vertices' coordinates: its list's (`x1`, `y1`, ...), or,
 * over a repeat's points, the points of its iterations (ADR 0075). */
function vertexValues(g: Get, x: Ctx): number[][] {
    const n = g("numVertices");
    if (n === 0 || x.cells.propCells(x.idx, "x1").length > 0) {
        return items("x", "y", n).map(([a, b]) => npt(g, a, b));
    }
    return vertexCells(x.cells.table, x.idx).map(([a, b]) => [
        x.cells.value(a),
        x.cells.value(b),
    ]);
}

/** A polygon's vertices; a triangle and a polyline read as one. A
 * coordinate with no value is the blank, as the current core shows it. */
const polygonReaders: Record<string, Reader> = {
    numVertices: (g) => g("numVertices"),
    vertices: (g, x) =>
        vertexValues(g, x).map((v) =>
            v.map((c) => (Number.isNaN(c) ? me.fromAst(BLANK) : M(c))),
        ),
    numericalVertices: (g, x) => vertexValues(g, x),
    center: (g) => pt(g, "cx", "cy"),
    // What a drag may move (ADR 0070), 0/1 cells.
    draggable: (g) => g("draggable") !== 0,
    verticesDraggable: (g) => g("verticesDraggable") !== 0,
};

/** A tuple of two numbers, as the current core's `coords` of a vector. */
const vec2 = (g: Get, x: string, y: string) =>
    me.fromAst(["vector", g(x), g(y)]);

const vectorReaders: Record<string, Reader> = {
    tail: (g) => pt(g, "tailX", "tailY"),
    head: (g) => pt(g, "headX", "headY"),
    displacement: (g) => pt(g, "x", "y"),
    numericalEndpoints: (g) => [
        npt(g, "tailX", "tailY"),
        npt(g, "headX", "headY"),
    ],
    x: (g) => M(g("x")),
    y: (g) => M(g("y")),
    magnitude: (g) => M(g("magnitude")),
    displacementCoords: (g) => vec2(g, "x", "y"),
    value: (g) => vec2(g, "x", "y"),
    numDimensions: () => 2,
    // As the bridge draws it (ADR 0024).
    label: (_g, x) => label(x.cells.table, x.idx),
    // What a drag may move (ADR 0070), 0/1 cells.
    draggable: (g) => g("draggable") !== 0,
    headDraggable: (g) => g("headDraggable") !== 0,
    tailDraggable: (g) => g("tailDraggable") !== 0,
};

const rayReaders: Record<string, Reader> = {
    endpoint: (g) => pt(g, "endpointX", "endpointY"),
    through: (g) => pt(g, "throughX", "throughY"),
    direction: (g) => pt(g, "directionX", "directionY"),
    numericalEndpoint: (g) => npt(g, "endpointX", "endpointY"),
    numericalThroughpoint: (g) => npt(g, "throughX", "throughY"),
    directionCoords: (g) => vec2(g, "directionX", "directionY"),
    numDimensions: () => 2,
};

/** A prop that is a number and, when it is one, an expression in
 * `exprProp` (ADR 0043): the expression, else the number. */
function exprOr(exprProp: string, prop: string): Reader {
    return (g, x) => {
        const e = x.cell(exprProp);
        if (e !== undefined && !Number.isNaN(x.cells.value(e))) {
            return me.fromText(x.cells.core.expr_text(e));
        }
        return M(g(prop));
    };
}

/** `exprOr`, a measure with no expression and no number the blank, as
 * the current core shows an angle it cannot define (between parallel
 * lines). */
function measure(exprProp: string, prop: string): Reader {
    return (g, x) => {
        const e = x.cell(exprProp);
        const symbolic = e !== undefined && !Number.isNaN(x.cells.value(e));
        return !symbolic && Number.isNaN(g(prop))
            ? me.fromAst(BLANK)
            : exprOr(exprProp, prop)(g, x);
    };
}

const angleReaders: Record<string, Reader> = {
    radians: measure("radiansExpr", "radians"),
    value: measure("radiansExpr", "radians"),
    angle: measure("radiansExpr", "radians"),
    degrees: measure("degreesExpr", "degrees"),
    // Its first point, its vertex and its third point; a coordinate the
    // core cannot compute is the blank, as the current core shows it.
    points: (g) =>
        ["1", "2", "3"].map((k) =>
            [`x${k}`, `y${k}`].map((p) =>
                Number.isNaN(g(p)) ? me.fromAst(BLANK) : M(g(p)),
            ),
        ),
    numericalPoints: (g) => [
        npt(g, "x1", "y1"),
        npt(g, "x2", "y2"),
        npt(g, "x3", "y3"),
    ],
};

/** A rectangle's and a regular polygon's sizes are numbers in the current
 * core; the vertices read as a polygon's. */
const rectangleReaders: Record<string, Reader> = {
    ...polygonReaders,
    width: (g) => g("width"),
    height: (g) => g("height"),
    area: (g) => g("area"),
    perimeter: (g) => g("perimeter"),
};
const regularPolygonReaders: Record<string, Reader> = {
    ...polygonReaders,
    circumradius: (g) => g("circumradius"),
    radius: (g) => g("circumradius"),
    inradius: (g) => g("inradius"),
    apothem: (g) => g("inradius"),
    sideLength: (g) => g("sideLength"),
    perimeter: (g) => g("perimeter"),
    area: (g) => g("area"),
    numSides: (g) => g("numVertices"),
};

/** Whether an operator over math is numeric (ADR 0043): its `expr` holds
 * no expression. */
const isNumericOperator: Reader = (_g, x) => {
    const e = x.cell("expr");
    return e === undefined || Number.isNaN(x.cells.value(e));
};
/** An operator's value is a math in the current core: the expression a
 * symbolic one holds, else the number the cells core computes, as an
 * expression. */
const mathOperatorReaders: Record<string, Reader> = {
    value: exprOr("expr", "value"),
    isNumericOperator,
    // Whether the value is a number: a numeric one's, or the expression's
    // tree.
    isNumber: (g, x) =>
        isNumericOperator(g, x)
            ? Number.isFinite(g("value"))
            : typeof (exprOr("expr", "value")(g, x) as any).tree === "number",
    text: textOf,
};
const booleanOperatorReaders: Record<string, Reader> = {
    value: (g) => g("value") !== 0,
    text: textOf,
};

/** The entries of a value list (ADR 0041), as the numbers they are: a
 * static sequence's list, or a structural one's numbers, one per
 * iteration (ADR 0041, step 4). */
const listNumbers: Reader = (_g, x) => {
    const cells = x.cells.propCells(x.idx, "numbers");
    if (cells.length > 0) {
        // A sequence of letters or math lists strings or expressions
        // (ADR 0074): each entry as its cell holds it.
        return Array.from(cells).map((c) => {
            const holds = x.cells.core.cell_holds(c);
            if (holds === "text") return x.cells.text(c);
            if (holds === "math") return heldMath(x.cells, c);
            return x.cells.value(c);
        });
    }
    return presentedChildren(x.cells, x.idx).flatMap((child) => {
        if (typeof child === "string") return [];
        const value = x.cells.table.cell(child.componentIdx, "value");
        return value === undefined ? [] : [x.cells.value(value)];
    });
};
/** A list of numbers (`sequence`, the samplers): `numbers`, and the state
 * variable the current core computes them in (`valuesVariable`). */
function numberListReaders(valuesVariable?: string): Record<string, Reader> {
    const readers: Record<string, Reader> = {
        numbers: listNumbers,
        numEntries: (g) => g("numComponents"),
        numValues: (g) => g("numComponents"),
        text: textOf,
    };
    if (valuesVariable) readers[valuesVariable] = listNumbers;
    return readers;
}
/** What a cell of a math list's entry holds, as the current core's math:
 * its expression (the blank one for none), or the number an entry
 * aliasing one holds (ADR 0041). */
function heldMath(cells: Cells, cell: number): unknown {
    return cells.core.cell_holds(cell) === "math"
        ? exprOf(cells, cell)
        : M(cells.value(cell));
}
/** The order a select's literal `sort` asks for, as its planner reads it. */
const sortAttr: Reader = (_g, x) => {
    const text = x.cells.table.attr(x.idx, "sort");
    if (text === null) return "unsorted";
    const t = text.trim().toLowerCase();
    if (t === "" || t === "true") return "increasing";
    return t === "false" ? "unsorted" : t;
};
/** A random-number sampler's distribution's moments, which the core
 * computes from its parameters. */
const momentReaders: Record<string, Reader> = {
    mean: (g) => g("mean"),
    variance: (g) => g("variance"),
    standardDeviation: (g) => g("standardDeviation"),
};
/** A part of a subset of the reals (`points`, `intervals`, ..): a math
 * cell holding a list of its entries, one entry alone, none empty. */
function subsetPart(prop: string): Reader {
    return (_g, x) => {
        const tree = JSON.parse(x.cells.core.expr_ast(x.cell(prop)!));
        const entries =
            Array.isArray(tree) && tree[0] === "list" ? tree.slice(1) : [tree];
        return entries.map((e: unknown) => me.fromAst(e));
    };
}

/** A value list (ADR 0041): its entries `entries`, each as `read` reads
 * its cell, and how many there are. */
function valueListReaders(
    entries: string,
    read: (x: Ctx, cell: number) => unknown,
): Record<string, Reader> {
    return {
        [entries]: (_g, x) =>
            Array.from(x.cells.propCells(x.idx, entries)).map((c) =>
                read(x, c),
            ),
        numComponents: (g) => g("numComponents"),
        numValues: (g) => g("numComponents"),
        text: textOf,
    };
}
/** A list operator's results are maths in the current core. */
const mathListOperatorReaders: Record<string, Reader> = {
    maths: (g, x) => (listNumbers(g, x) as number[]).map(M),
    operatorResults: (g, x) => (listNumbers(g, x) as number[]).map(M),
    numEntries: (g) => g("numComponents"),
    numValues: (g) => g("numComponents"),
    text: textOf,
};

/** A section's full number ("2.1") as the core composes it: its own, after
 * its nearest section ancestor's when it includes it and is no list item
 * (ADR 0054); null for a component that takes none. */
function sectionNumberOf(cells: Cells, c: number): string | null {
    return cells.core.section_number(c) ?? null;
}

/** The translator a test's document gets when it names no language: each
 * message's English, the fallback its call site carries. */
function english(_key: string, _args: unknown, fallback: string): string {
    return fallback;
}

/** The last `<title>` child, which the current core's `title` reads. */
function titleChild(cells: Cells, c: number): number | null {
    const titles = cells.table
        .children(c)
        .flatMap((child) =>
            "component" in child &&
            cells.table.componentType(child.component) === "title"
                ? [child.component]
                : [],
        );
    return titles.length ? titles[titles.length - 1] : null;
}

/** The types that are sectioning components in the current core, for
 * `level`: the divisions, an aside and a proof. */
const SECTIONING_TYPES = new Set(["section", "aside", "proof"]);

/** The tag a sectioning component was written as: a division's by its
 * `label` cell (the core's `SECTION_TAGS`), else its type's. */
function sectioningTag(cells: Cells, c: number): string {
    const type = cells.table.componentType(c);
    if (type !== "section") return type;
    const label = cells.value(cells.propCells(c, "label")[0]);
    return SECTION_KINDS[label]?.[0] ?? type;
}

/** The heading level the current core gives a division: one below the
 * sectioning component around it, apart from the tags with a level of
 * their own. */
function sectionLevel(cells: Cells, c: number): number {
    const tag = sectioningTag(cells, c);
    if (tag === "paragraphs") return 4;
    if (["objectives", "aside", "proof"].includes(tag)) return 3;
    for (let p = cells.table.parent(c); p !== null; p = cells.table.parent(p)) {
        if (SECTIONING_TYPES.has(cells.table.componentType(p))) {
            return sectionLevel(cells, p) + 1;
        }
    }
    return 1;
}

/** Nothing, for a component no `lang` other than English applies to; the
 * words are English only, so one in another language is a gap. */
function englishOnly(x: Ctx): undefined {
    for (
        let p: number | null = x.idx;
        p !== null;
        p = x.cells.table.parent(p)
    ) {
        const lang = x.cells.table.attr(p, "lang");
        if (lang !== null) {
            if (lang.trim().toLowerCase().startsWith("en")) return undefined;
            throw new CellsCoreGap(`section words in the language \`${lang}\``);
        }
    }
    return undefined;
}

/** The readers of a sectioning component's heading (`title`,
 * `titlePrefix`, `sectionName`), composed in English as the current
 * core's `composeTitlePrefix` composes them, from the number the core
 * holds, its `<title>` child's text, and the attributes the renderer
 * reads. A `numbered` component has a number; `autoNumber` is the
 * default of `includeAutoNumberIfNoTitle`. */
function headingReaders(autoNumber: boolean): Record<string, Reader> {
    const sectionName = (x: Ctx) =>
        x.cells.table.attr(x.idx, "renameTo") ??
        englishOnly(x) ??
        sectionNameWord(
            english,
            sectioningTag(x.cells, x.idx),
            sectioningTag(x.cells, x.idx),
        );
    const titlePrefix = (x: Ctx) => {
        const flag = (name: string, fallback: boolean) =>
            attrFlag(x.cells, x.idx, name) ?? fallback;
        const haveTitleChild = titleChild(x.cells, x.idx) !== null;
        const noAutoTitle = flag("noAutoTitle", false);
        return composeTitlePrefix({
            t: english,
            includeAutoName:
                flag("includeAutoName", false) ||
                (!haveTitleChild &&
                    flag("includeAutoNameIfNoTitle", true) &&
                    !noAutoTitle),
            includeAutoNumber:
                flag("includeAutoNumber", false) ||
                (!haveTitleChild &&
                    flag("includeAutoNumberIfNoTitle", autoNumber) &&
                    !noAutoTitle),
            haveTitleChild,
            sectionName: sectionName(x),
            sectionNumber: sectionNumberOf(x.cells, x.idx),
        });
    };
    return {
        sectionName: (_g, x) => sectionName(x),
        titlePrefix: (_g, x) => titlePrefix(x),
        title: (_g, x) => {
            const title = titleChild(x.cells, x.idx);
            return title === null
                ? titlePrefix(x)
                : x.cells.core.component_text(title);
        },
        level: (_g, x) => sectionLevel(x.cells, x.idx),
    };
}

const sectionReaders: Record<string, Reader> = {
    ...headingReaders(true),
    sectionNumber: (_g, x) => sectionNumberOf(x.cells, x.idx),
    enumeration: (_g, x) =>
        (sectionNumberOf(x.cells, x.idx) ?? "").split(".").map(Number),
    isListItem: (_g, x) => x.cells.core.is_list_item(x.idx),
    creditAchieved: (g) => g("creditAchieved"),
    percentCreditAchieved: (g) => g("percentCreditAchieved"),
    weight: (g) => g("weight"),
    aggregateScores: (g) => g("aggregateScores") !== 0,
    includeParentNumber: (g) => g("includeParentNumber") !== 0,
};

/** The number a figure, table or footnote takes from its document-wide
 * counter, as the core counts it (ADR 0044); null for none. */
function counterNumber(x: Ctx): number | null {
    return x.cells.core.counter_number(x.idx) ?? null;
}

/** A figure's or a table's enumeration and names ("Table 2", and "Table 2: "
 * before a title or caption), as `composeFigureName` and `composeTableName`
 * compose them in English from the core's counter. */
function counterNameReaders(
    kind: "figure" | "table",
    word: string,
    titleType: string,
): Record<string, Reader> {
    const name = (x: Ctx) => {
        const n = counterNumber(x);
        return n === null ? word : `${word} ${n}`;
    };
    return {
        [`${kind}Enumeration`]: (_g, x) => {
            const n = counterNumber(x);
            return n === null ? null : String(n);
        },
        [`${kind}Name`]: (_g, x) => name(x),
        [`${kind}NamePrefix`]: (_g, x) =>
            x.cells.table
                .children(x.idx)
                .some(
                    (c) =>
                        "component" in c &&
                        x.cells.table.componentType(c.component) === titleType,
                )
                ? `${name(x)}: `
                : name(x),
        number: (g) => g("number") !== 0,
        text: textOf,
    };
}

/** A function's domain (ADR 0049) as the current core's `domain`: one
 * interval, its endpoints and whether each is closed; a function of
 * several variables' one per variable, from the four numbers per variable
 * its `domainsExpr` holds (ADR 0081). */
const functionDomain: Reader = (g, x) => {
    const interval = (lo: number, hi: number, loc: number, hic: number) =>
        me.fromAst([
            "interval",
            ["tuple", lo, hi],
            ["tuple", loc === 1, hic === 1],
        ]);
    const n = x.cell("numInputs") !== undefined ? g("numInputs") : 1;
    const cell = x.cell("domainsExpr");
    if (n > 1 && cell !== undefined && !Number.isNaN(x.cells.value(cell))) {
        const tree = JSON.parse(x.cells.core.expr_ast(cell));
        const v: number[] =
            Array.isArray(tree) && tree[0] === "tuple"
                ? tree.slice(1).map(treeNumber)
                : [];
        return Array.from({ length: n }, (_, i) =>
            interval(v[4 * i], v[4 * i + 1], v[4 * i + 2], v[4 * i + 3]),
        );
    }
    return [
        interval(
            g("domainMin"),
            g("domainMax"),
            g("domainMinClosed"),
            g("domainMaxClosed"),
        ),
    ];
};

/** A function of one variable at `x`, as the cells core's own engine
 * evaluates it (`function_value`); a gap for one it does not evaluate. */
function numericalFunction(x: Ctx): (v: number) => number {
    return (v: number) => {
        const y = x.cells.core.function_value(x.idx, v);
        if (y === undefined) {
            throw new CellsCoreGap(
                `${x.cells.table.tag(x.idx)}.numericalfs: not a function of one variable`,
            );
        }
        return y;
    };
}

/** The trees of a function's outputs from the JSON tree its evaluation
 * gives (ADR 0081): the entries of a vector for a function of several
 * outputs, else the one; the blank for an output it does not give. */
function outputTrees(json: string, m: number): unknown[] {
    const tree = JSON.parse(json);
    if (m === 1) return [tree];
    const entries =
        Array.isArray(tree) && (tree[0] === "vector" || tree[0] === "tuple")
            ? tree.slice(1)
            : [];
    return Array.from({ length: m }, (_, i) => entries[i] ?? BLANK);
}

/** A function's outputs at expressions, as the cells core's engine
 * substitutes them when an `<evaluate>` of it is symbolic (ADR 0081,
 * `function_symbolic`); a gap for one it does not substitute into. */
function symbolicFunctions(g: Get, x: Ctx): ((...v: any[]) => any)[] {
    const m = g("numOutputs");
    return Array.from({ length: m }, (_, i) => (...vs: any[]) => {
        const texts = vs.map((v) =>
            me.fromAst(v?.tree !== undefined ? v.tree : v).toString(),
        );
        const out = x.cells.core.function_symbolic(x.idx, texts);
        if (out === undefined) {
            throw new CellsCoreGap(
                `${x.cells.table.tag(x.idx)}.symbolicfs: not a function with a formula`,
            );
        }
        return me.fromAst(outputTrees(out, m)[i] as any);
    });
}

/** A function's outputs at numbers, as the cells core evaluates them
 * (ADR 0081): one of one variable and one output through
 * `function_value`, which reads a piecewise or interpolated function's
 * pieces; else `function_numeric`. */
function numericalFunctions(g: Get, x: Ctx): ((...v: number[]) => number)[] {
    const n = g("numInputs");
    const m = g("numOutputs");
    if (!(n > 1) && !(m > 1)) return [numericalFunction(x)];
    return Array.from({ length: m }, (_, i) => (...vs: number[]) => {
        const out = x.cells.core.function_numeric(x.idx, Float64Array.from(vs));
        if (out === undefined) {
            throw new CellsCoreGap(
                `${x.cells.table.tag(x.idx)}.numericalfs: not a function with a formula`,
            );
        }
        return treeNumber(outputTrees(out, m)[i]);
    });
}

/** A function's variables (ADR 0081): the entries of the tuple its
 * `variablesExpr` holds for several, else its one. */
const functionVariables: Reader = (_g, x) => {
    const tree = JSON.parse(x.cells.core.expr_ast(x.cell("variablesExpr")!));
    return Array.isArray(tree) && (tree[0] === "tuple" || tree[0] === "vector")
        ? tree.slice(1).map((v: unknown) => me.fromAst(v as any))
        : [me.fromAst(tree)];
};

/** A number inside a held expression: a number as it is, else what the
 * expression evaluates to (`Infinity` among them). */
function treeNumber(t: unknown): number {
    if (typeof t === "number") return t;
    const v = me.fromAst(t as any).evaluate_to_constant();
    return typeof v === "number" ? v : NaN;
}

/** A function's local extrema (ADR 0061): its math cell holds a list of
 * points `(x, f(x))`, read as the current core's arrays of numbers. */
function extremaPoints(prop: string): Reader {
    return (_g, x) => {
        const tree = JSON.parse(x.cells.core.expr_ast(x.cell(prop)!));
        const points =
            Array.isArray(tree) && tree[0] === "list" ? tree.slice(1) : [];
        return points.map((p: unknown) =>
            Array.isArray(p) ? p.slice(1).map(treeNumber) : [],
        );
    };
}

/** A function's global extremum (ADR 0061): a point `(x, f(x))`, or the
 * empty list for none, read as the current core's `[x, y]` or `[]`. */
function extremumPoint(prop: string): Reader {
    return (_g, x) => {
        const tree = JSON.parse(x.cells.core.expr_ast(x.cell(prop)!));
        return Array.isArray(tree) && tree[0] === "tuple"
            ? tree.slice(1).map(treeNumber)
            : [];
    };
}

/** What a function and a piecewise function hold of their extrema. */
const extremaReaders: Record<string, Reader> = {
    minima: extremaPoints("minima"),
    maxima: extremaPoints("maxima"),
    extrema: extremaPoints("extrema"),
    numMinima: (g) => g("numMinima"),
    numMaxima: (g) => g("numMaxima"),
    numExtrema: (g) => g("numExtrema"),
    globalMinimum: extremumPoint("globalMinimum"),
    globalInfimum: extremumPoint("globalInfimum"),
    globalMaximum: extremumPoint("globalMaximum"),
    globalSupremum: extremumPoint("globalSupremum"),
    xscale: (g) => g("xscale"),
};

const functionReaders: Record<string, Reader> = {
    ...extremaReaders,
    yscale: (g) => g("yscale"),
    domain: functionDomain,
    numericalfs: (g, x) => numericalFunctions(g, x),
    numericalf: (g, x) => numericalFunctions(g, x)[0],
    formula: (_g, x) => exprOf(x.cells, x.cell("expr")!),
    variables: functionVariables,
    // How it evaluates (ADR 0081).
    symbolic: (g) => g("symbolic") === 1,
    numInputs: (g) => g("numInputs"),
    numOutputs: (g) => g("numOutputs"),
    symbolicfs: (g, x) => symbolicFunctions(g, x),
    symbolicf: (g, x) => symbolicFunctions(g, x)[0],
    // Its outputs as the current core's `fs`: symbolic when it is, else
    // its numbers as math.
    fs: (g, x) =>
        g("symbolic") === 1
            ? symbolicFunctions(g, x)
            : numericalFunctions(g, x).map(
                  (f) =>
                      (...vs: any[]) =>
                          me.fromAst(
                              f(
                                  ...vs.map((v) =>
                                      treeNumber(
                                          v?.tree !== undefined ? v.tree : v,
                                      ),
                                  ),
                              ),
                          ),
              ),
};

/** A curve's type, as the current core names it (ADR 0049). */
const CURVE_TYPES = ["function", "parameterization", "bezier"];

const curveReaders: Record<string, Reader> = {
    curveType: (g) => CURVE_TYPES[g("curveType")],
    parMin: (g) => g("parMin"),
    parMax: (g) => g("parMax"),
    numThroughPoints: (_g, x) =>
        x.cells.propCells(x.idx, "throughPoints").length / 2,
    numericalThroughPoints: (_g, x) => {
        const cells = Array.from(x.cells.propCells(x.idx, "throughPoints"));
        const out: number[][] = [];
        for (let i = 0; i + 1 < cells.length; i += 2) {
            out.push([x.cells.value(cells[i]), x.cells.value(cells[i + 1])]);
        }
        return out;
    },
    throughPoints: (_g, x) => {
        const cells = Array.from(x.cells.propCells(x.idx, "throughPoints"));
        const out: unknown[] = [];
        for (let i = 0; i + 1 < cells.length; i += 2) {
            out.push([
                M(x.cells.value(cells[i])),
                M(x.cells.value(cells[i + 1])),
            ]);
        }
        return out;
    },
};

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
        latex: (_g, x) => pointLatex(reads(x), x.idx),
        // The text of its `<label>` child, a component (ADR 0024), else
        // its `label` attribute, as the bridge draws it.
        label: (_g, x) => label(x.cells.table, x.idx),
        // Whether any of its constraints applied (ADR 0080), and whether
        // a drag may move it (ADR 0070): 0/1 cells.
        constraintUsed: (g) => g("constraintUsed") === 1,
        draggable: (g) => g("draggable") !== 0,
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
        // As the bridge draws it (ADR 0024).
        label: (_g, x) => label(x.cells.table, x.idx),
    },
    lineSegment: {
        // A coordinate the core cannot compute (an end a midpoint at the
        // first end leaves undefined) is the blank, as the current core
        // shows it.
        endpoints: (g) =>
            ["1", "2"].map((k) =>
                [`x${k}`, `y${k}`].map((p) =>
                    Number.isNaN(g(p)) ? me.fromAst(BLANK) : M(g(p)),
                ),
            ),
        numericalEndpoints: (g) => [npt(g, "x1", "y1"), npt(g, "x2", "y2")],
        // A number in the current core; the length and midpoint are maths.
        slope: (g) => g("slope"),
        length: (g) => M(g("length")),
        midpoint: (g) => pt(g, "mx", "my"),
        // What a drag may move (ADR 0070), 0/1 cells.
        draggable: (g) => g("draggable") !== 0,
        endpointsDraggable: (g) => g("endpointsDraggable") !== 0,
        numDimensions: () => 2,
    },
    polygon: polygonReaders,
    // A polygon that is not closed, with its length (ADR 0075).
    polyline: { ...polygonReaders, length: (g) => g("length") },
    triangle: polygonReaders,
    rectangle: rectangleReaders,
    regularPolygon: regularPolygonReaders,
    vector: vectorReaders,
    ray: rayReaders,
    angle: angleReaders,
    mathInput: { ...mathReaders, valueForDisplay: inputValueForDisplay },
    math: mathReaders,
    // The current core's number values are plain numbers.
    number: {
        value: (g) => g("value"),
        valueForDisplay: (g, x) =>
            x.cells.core.number_display_value(g("value"), settingsOf(x)),
        text: textOf,
        ...displaySettingReaders,
        hidden: (_g, x) => hiddenOf(x.cells, x.idx),
    },
    text: {
        value: (_g, x) => x.cells.text(x.cell("value")!).trim(),
        text: (_g, x) => x.cells.text(x.cell("value")!).trim(),
        hidden: (_g, x) => hiddenOf(x.cells, x.idx),
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
    document: {
        ...containerReaders,
        // The variant it was loaded as and what its variant components
        // picked (ADR 0085).
        generatedVariantInfo: (_g, x) => {
            const v = JSON.parse(x.cells.core.generated_variant_json());
            if (v === null)
                throw new CellsCoreGap(
                    "`document.generatedVariantInfo` of these variant components",
                );
            return v;
        },
    },
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
    ...Object.fromEntries(
        [
            "abs",
            "sign",
            "floor",
            "ceil",
            "round",
            "setSmallToZero",
            "wrapNumberPeriodic",
            "clampNumber",
            "sum",
            "product",
            "mean",
            "median",
            "variance",
            "standardDeviation",
            "count",
            "min",
            "max",
            "mod",
            "gcd",
            "lcm",
            "argMin",
            "argMax",
        ].map((t) => [t, mathOperatorReaders]),
    ),
    ...Object.fromEntries(
        [
            "and",
            "or",
            "xor",
            "iff",
            "implies",
            "not",
            "isInteger",
            "isNumber",
            "isBetween",
        ].map((t) => [t, booleanOperatorReaders]),
    ),
    // An integer is a number in the current core; an intComma and a
    // pluralize are texts, the grouped number and the word.
    integer: {
        value: (g) => g("value"),
        valueForDisplay: (g) => g("value"),
        text: textOf,
    },
    intComma: { value: textOf, text: textOf },
    pluralize: {
        value: (_g, x) => x.cells.text(x.cell("value")!),
        text: (_g, x) => x.cells.text(x.cell("value")!),
    },
    latex: { value: textOf, text: textOf },
    sequence: numberListReaders("sequenceValues"),
    sampleRandomNumbers: {
        ...numberListReaders("sampledValues"),
        ...momentReaders,
    },
    selectRandomNumbers: {
        ...numberListReaders("selectedValues"),
        ...momentReaders,
    },
    samplePrimeNumbers: numberListReaders("sampledValues"),
    selectPrimeNumbers: {
        ...numberListReaders("selectedValues"),
        sort: sortAttr,
    },
    selectFromSequence: {
        ...numberListReaders("selectedValues"),
        sort: sortAttr,
    },
    ...Object.fromEntries(
        [
            "cumulativeSum",
            "cumulativeProduct",
            "cumulativeMin",
            "cumulativeMax",
            "differences",
        ].map((t) => [t, mathListOperatorReaders]),
    ),
    // The text containers whose text the current core computes.
    ...Object.fromEntries(
        [
            "em",
            "alert",
            "term",
            "q",
            "sq",
            "c",
            "attr",
            "span",
            "tag",
            "tagc",
            "tage",
            "ndash",
            "mdash",
            "nbsp",
            "ellipsis",
            "lq",
            "rq",
            "lsq",
            "rsq",
            "li",
            "caption",
            "footnote",
            "asList",
        ].map((t) => [t, containerReaders]),
    ),
    solution: { open: (g) => g("open") !== 0 },
    // The divisions are sections in the cells core.
    ...Object.fromEntries(
        [
            "section",
            "subsection",
            "subsubsection",
            "problem",
            "exercise",
            "example",
            "question",
            "activity",
            "definition",
            "note",
            "theorem",
            "paragraphs",
            "objectives",
            "part",
            "task",
            "problems",
            "exercises",
        ].map((t) => [t, sectionReaders]),
    ),
    // The buttons (ADR 0040): a press is the core's action `trigger`; one
    // something else presses (ADR 0042) is hidden.
    callAction: {
        hidden: (g) => g("hide") !== 0,
        hide: (g) => g("hide") !== 0,
    },
    updateValue: {
        hidden: (g) => g("hide") !== 0,
        hide: (g) => g("hide") !== 0,
    },
    triggerSet: {
        hidden: (g) => g("hide") !== 0,
        hide: (g) => g("hide") !== 0,
    },
    // The document-wide counters (ADR 0044), and an aside, numbered among
    // the divisions.
    figure: counterNameReaders("figure", "Figure", "caption"),
    table: counterNameReaders("table", "Table", "title"),
    footnote: {
        text: textOf,
        footnoteTag: (_g, x) => String(counterNumber(x) ?? ""),
    },
    aside: {
        ...headingReaders(true),
        sectionNumber: sectionReaders.sectionNumber,
        enumeration: sectionReaders.enumeration,
        includeParentNumber: sectionReaders.includeParentNumber,
    },
    // A fraction input and the boxes it owns (ADR 0045): each prop is the
    // expression its math cell holds, the blank expression when it holds
    // none. The core has no uncommitted value, so `immediateValue` is
    // `value`.
    fractionInput: {
        value: (_g, x) => exprOf(x.cells, x.cell("expr")!),
        immediateValue: (_g, x) => exprOf(x.cells, x.cell("expr")!),
        numerator: (_g, x) => exprOf(x.cells, x.cell("numerator")!),
        denominator: (_g, x) => exprOf(x.cells, x.cell("denominator")!),
        text: textOf,
    },
    _fractionInputComponent: {
        value: (_g, x) => exprOf(x.cells, x.cell("expr")!),
        immediateValue: (_g, x) => exprOf(x.cells, x.cell("expr")!),
    },
    // The value lists (ADR 0041): their entries as the current core holds
    // them, and how many there are.
    numberList: numberListReaders(),
    textList: valueListReaders("texts", (x, c) => x.cells.text(c)),
    booleanList: valueListReaders("booleans", (x, c) => x.cells.value(c) === 1),
    mathList: valueListReaders("maths", (x, c) => heldMath(x.cells, c)),
    // A point list's own points (ADR 0041), each a row of type point.
    pointList: {
        points: (_g, x) => {
            const cells = Array.from(x.cells.propCells(x.idx, "points"));
            return Array.from({ length: cells.length / 2 }, (_, k) => [
                M(x.cells.value(cells[2 * k])),
                M(x.cells.value(cells[2 * k + 1])),
            ]);
        },
        numPoints: (g) => g("numPoints"),
        numValues: (g) => g("numPoints"),
        text: textOf,
    },
    // A math list's entry row (ADR 0041): what its one cell holds.
    mathValue: {
        value: (_g, x) => heldMath(x.cells, x.cell("value")!),
        text: textOf,
    },
    // A label (ADR 0075): its children's text joined, and its text.
    label: {
        value: (_g, x) => x.cells.text(x.cell("value")!),
        text: textOf,
    },
    // An evaluation, written or a function macro `$$f(x)` (ADR 0075): its
    // value as its cell holds it, and its text.
    evaluate: {
        // Its expression when symbolic, else its number (ADR 0081).
        value: mathValue,
        text: textOf,
        // A number, or an expression when symbolic (ADR 0081).
        latex: mathLatex,
    },
    // Function machinery (ADR 0049).
    function: functionReaders,
    derivative: functionReaders,
    piecewiseFunction: {
        ...extremaReaders,
        domain: functionDomain,
        numericalfs: (_g, x) => [numericalFunction(x)],
    },
    curve: curveReaders,
    equilibriumCurve: {
        ...curveReaders,
        stable: (g) => g("stable") !== 0,
    },
    // Values with entries inside a math (ADR 0041, decision 8).
    interval: mathReaders,
    // Math notation's LaTeX, and a point's, as the bridge writes them.
    // An `<m>`'s text is its LaTeX read as math, as the current core's
    // `MMeMen.js` makes it.
    m: {
        latex: (_g, x) => childrenLatex(reads(x), x.idx),
        text: (_g, x) =>
            convertLatexWithBlanks(childrenLatex(reads(x), x.idx), latexToText),
        renderMode: () => "inline",
    },
    // An `<md>` with rows is aligned; one without (an `<me>`) is one
    // displayed equation, whose text is an `<m>`'s.
    md: {
        latex: (_g, x) => mdLatex(reads(x), x.idx),
        renderMode: (_g, x) => (hasRows(x) ? "align" : "display"),
        text: (_g, x) => {
            if (hasRows(x)) {
                throw new CellsCoreGap("state variable `md.text` of rows");
            }
            return convertLatexWithBlanks(
                mdLatex(reads(x), x.idx),
                latexToText,
            );
        },
    },
    // A proof: a sectioning component that takes no number (ADR 0054).
    proof: {
        ...headingReaders(false),
        sectionNumber: () => null,
        enumeration: () => [],
    },
    // A sort's and a shuffle's order (ADR 0053): the 1-based operand at
    // each position, the list's companion sequence.
    ...Object.fromEntries(
        ["sort", "shuffle"].map((t) => [
            t,
            {
                componentOrder: (_g: Get, x: Ctx) =>
                    Array.from(x.cells.propCells(x.idx, "componentOrder")).map(
                        (c) => x.cells.value(c),
                    ),
                numComponents: (g: Get) => g("numComponents"),
                text: textOf,
            } as Record<string, Reader>,
        ]),
    ),
    // A choice input (ADR 0053): `selectedIndex` is a place as shown, and
    // `choiceOrder` the second sequence over its own ports, the cells
    // after its table's.
    choiceInput: {
        selectedIndex: (g) => g("selectedIndex"),
        selectedIndices: (g) => {
            const k = g("selectedIndex");
            return Number.isInteger(k) && k >= 1 ? [k] : [];
        },
        choiceOrder: (_g, x) => choiceOrderOf(x),
        // The chosen choice's text (ADR 0077): the one value, or none.
        selectedValues: (g, x) =>
            g("selectedChoice") >= 1
                ? [x.cells.text(x.cell("selectedValue")!)]
                : [],
        selectedValue: (g, x) =>
            g("selectedChoice") >= 1
                ? x.cells.text(x.cell("selectedValue")!)
                : undefined,
        // Literal flags, as the document gives them.
        inline: (_g, x) => attrFlag(x.cells, x.idx, "inline") ?? false,
        shuffleOrder: (_g, x) =>
            attrFlag(x.cells, x.idx, "shuffleOrder") ?? false,
        preserveLastChoice: (_g, x) =>
            attrFlag(x.cells, x.idx, "preserveLastChoice") ?? false,
        // The text of each choice, as the core makes it, in the order
        // shown.
        choiceTexts: (_g, x) => {
            // A copy's choices are its referent's.
            const choicesOf = (c: number): number[] =>
                x.cells.table
                    .children(c)
                    .flatMap((ch) =>
                        "component" in ch &&
                        x.cells.table.componentType(ch.component) === "choice"
                            ? [ch.component]
                            : [],
                    );
            let choices = choicesOf(x.idx);
            for (
                let r = x.cells.table.referent(x.idx);
                choices.length === 0 && r !== null;
                r = x.cells.table.referent(r)
            ) {
                choices = choicesOf(r);
            }
            return choiceOrderOf(x).map((k) =>
                x.cells.core.component_text(choices[k - 1]).trim(),
            );
        },
        // The text of the choice selected, by its place as shown.
        selectedValues: (g, x) => {
            const k = g("selectedIndex");
            if (!(Number.isInteger(k) && k >= 1)) return [];
            const texts = STATE.choiceInput.choiceTexts(g, x) as string[];
            return k <= texts.length ? [texts[k - 1]] : [];
        },
    },
    intervalList: valueListReaders("intervals", (x, c) => heldMath(x.cells, c)),
    subsetOfReals: {
        ...mathReaders,
        variable: (_g, x) => exprOf(x.cells, x.cell("variable")!),
        points: subsetPart("points"),
        pointsClosed: (g, x) =>
            (subsetPart("pointsClosed")(g, x) as any[]).map(
                (b) => b.tree === true,
            ),
        intervals: subsetPart("intervals"),
        isolatedPoints: subsetPart("isolatedPoints"),
    },
    // A matrix (ADR 0041, decision 8): a math holding a matrix, its size
    // its own cells, its entries read off the expression.
    matrix: {
        ...mathReaders,
        numRows: (g) => g("numRows"),
        numColumns: (g) => g("numColumns"),
        matrixSize: (g) => [g("numRows"), g("numColumns")],
        matrix: (g, x) => {
            const tree = (mathValue(g, x) as any).tree;
            if (!Array.isArray(tree) || tree[0] !== "matrix") return [];
            return tree[2]
                .slice(1)
                .map((row: any[]) =>
                    row.slice(1).map((e: unknown) => me.fromAst(e)),
                );
        },
    },
    // A matrix input (ADR 0045): the matrix its boxes make, its size its
    // own cells. The core has no uncommitted value, so `immediateValue` is
    // `value`.
    matrixInput: {
        value: (_g, x) => exprOf(x.cells, x.cell("expr")!),
        immediateValue: (_g, x) => exprOf(x.cells, x.cell("expr")!),
        numRows: (g) => g("numRows"),
        numColumns: (g) => g("numColumns"),
        matrixSize: (g) => [g("numRows"), g("numColumns")],
        text: textOf,
    },
    // A matrix input's box: what its math cell holds.
    _matrixComponentInput: {
        value: (_g, x) => exprOf(x.cells, x.cell("expr")!),
        immediateValue: (_g, x) => exprOf(x.cells, x.cell("expr")!),
    },
    // A page (ADR 0058): no item of a list itself, and its parent's
    // `asList`, which it passes through, read off the core's cells.
    page: {
        isListItem: () => false,
        asList: (_g, x) => passedAsList(x.cells, x.idx),
    },
    // A graph's bounds, numbers in both cores.
    graph: {
        xMin: (g) => g("xmin"),
        xMax: (g) => g("xmax"),
        yMin: (g) => g("ymin"),
        yMax: (g) => g("ymax"),
        // Their scales and the aspect ratio (ADR 0084), numbers in both
        // cores.
        xScale: (g) => g("xScale"),
        yScale: (g) => g("yScale"),
        aspectRatio: (g) => g("aspectRatio"),
    },
    // A parabola's coefficients, numbers in both cores, and its vertex.
    parabola: {
        a: (g) => g("a"),
        b: (g) => g("b"),
        c: (g) => g("c"),
        vertex: (g) => pt(g, "vertexX", "vertexY"),
    },
    // A choice (ADR 0077): its credit, its children's text, and whether
    // its input has it chosen, cells of the core.
    choice: {
        credit: (g) => g("credit"),
        text: (_g, x) => x.cells.text(x.cell("text")!),
        selected: (g) => g("selected") === 1,
    },
};

/** Whether `c` is hidden, as the current core's `hidden`: its own `hide`,
 * or a component above it hidden, an inactive case above it, or a cascade
 * that does not show it or holds back the step it is in (ADR 0062), read
 * off the core's `revealed`. */
function hiddenOf(cells: Cells, c: number): boolean {
    const on = (x: number, prop: string) => {
        const cell = cells.propCells(x, prop);
        if (cell.length === 0) return false;
        const v = cells.value(cell[0]);
        return v !== 0 && !Number.isNaN(v);
    };
    for (let x: number | null = c; x !== null; x = cells.table.parent(x)) {
        const type = cells.table.componentType(x);
        if (hiddenByHide(cells.table, x)) return true;
        if (type === "case" && !on(x, "active")) return true;
        if (cells.core.revealed(x) === 2) return true;
        const p = cells.table.parent(x);
        if (
            p !== null &&
            cells.core.revealed(p) === 1 &&
            !["title", "setup", "cascadeMessage"].includes(type)
        ) {
            return true;
        }
    }
    return false;
}

/** What a step of a cascade reads of it (ADR 0062): whether it is
 * hidden, and whether it keeps its heading and hides what it holds. */
const cascadeStepReaders: Record<string, Reader> = {
    hidden: (_g, x) => hiddenOf(x.cells, x.idx),
    hideChildren: (_g, x) => x.cells.core.revealed(x.idx) === 1,
};

for (const type of [
    "section",
    "subsection",
    "subsubsection",
    "problem",
    "exercise",
    "example",
    "question",
    "activity",
    "definition",
    "note",
    "theorem",
    "paragraphs",
    "objectives",
    "part",
    "task",
    "problems",
    "exercises",
]) {
    STATE[type] = {
        ...STATE[type],
        ...cascadeStepReaders,
        creditAchievedForProgress: (g) => g("creditAchievedForProgress"),
    };
}
for (const type of ["aside", "proof"]) {
    STATE[type] = { ...STATE[type], ...collapsibleReaders() };
}
for (const type of ["aside", "proof", "p", "div", "number"]) {
    STATE[type] = { ...STATE[type], ...cascadeStepReaders };
}
STATE.document = {
    ...STATE.document,
    creditAchieved: (g) => g("creditAchieved"),
};
// A cascade (ADR 0062): no section, so no title or number; its count of
// the leading steps complete, its settings, and the `asList` it passes
// through.
STATE.cascade = {
    ...cascadeStepReaders,
    numCompleted: (g) => g("numCompleted"),
    revealAll: (g) => g("revealAll") !== 0,
    hideFutureSections: (g) => g("hideFutureSections") !== 0,
    creditAchievedForProgress: (g) => g("creditAchievedForProgress"),
    isListItem: () => false,
    asList: (_g, x) => passedAsList(x.cells, x.idx),
    text: textOf,
};
STATE.cascadeMessage = {
    hidden: (_g, x) => hiddenOf(x.cells, x.idx),
    text: textOf,
};
// A `<feedback>` (a conditional content, ADR 0077) is hidden while none
// of its cases is active, as the current core's is while its condition
// does not hold; a conditional content otherwise as any component.
STATE.conditionalContent = {
    ...STATE.conditionalContent,
    hidden: (g, x) => {
        if (hiddenOf(x.cells, x.idx)) return true;
        if (x.cells.elementName(x.idx) !== "feedback") return false;
        const k = g("choice");
        return !(k >= 1);
    },
};

/** The nearest ancestor of `c` that stands as more than its children. */
function ownerOf(cells: Cells, c: number): number | null {
    let p = cells.table.parent(c);
    while (p !== null && TRANSPARENT.has(cells.table.componentType(p))) {
        p = cells.table.parent(p);
    }
    return p;
}

/** The component children of `c`, looked through what stands as its
 * children, as the current core's composites expand in place. */
function childComponents(cells: Cells, c: number): number[] {
    return cells.table.children(c).flatMap((child) => {
        if (!("component" in child)) return [];
        const k = child.component;
        return TRANSPARENT.has(cells.table.componentType(k))
            ? childComponents(cells, k)
            : [k];
    });
}

/** The children a held-back step leaves alone: its title and what
 * configures it. */
const LEFT_ALONE = ["title", "setup"];

/** A section's heading-bar color in light mode, as the current core's
 * `titleColor` resolves it (`sectionTitleColors.js`): the color of its
 * completion state (its `creditAchievedForProgress`, or its
 * `creditAchieved` under `completedColorRequiresCredit`), its own literal
 * attribute, else the nearest section or cascade above it that writes one,
 * else the default. */
function titleColorOf(g: Get, x: Ctx): string {
    return titleColorAndState(g, x)[0];
}

/** `titleColorOf`'s color, and the index of the completion state it is
 * the color of (completed, in progress, not started). */
function titleColorAndState(g: Get, x: Ctx): [string, number] {
    const nearest = (name: string): string | null => {
        for (
            let p: number | null = x.idx;
            p !== null;
            p = ownerOf(x.cells, p)
        ) {
            const type = x.cells.table.componentType(p);
            if (
                p !== x.idx &&
                !["section", "aside", "proof", "cascade"].includes(type)
            ) {
                return null;
            }
            const text = x.cells.table.attr(p, name);
            if (text !== null) return text.trim();
        }
        return null;
    };
    const requiresCredit = nearest("completedColorRequiresCredit");
    const credit =
        requiresCredit !== null && requiresCredit.toLowerCase() !== "false"
            ? g("creditAchieved")
            : g("creditAchievedForProgress");
    const [state, fallback, k] =
        credit === 1
            ? ["completedColor", "var(--lightGreen)", 0]
            : credit > 0
              ? ["inProgressColor", "var(--mainGray)", 1]
              : ["notStartedColor", "var(--mainGray)", 2];
    return [nearest(state) ?? fallback, k];
}

/** A section's heading-bar color in dark mode: the core's color of its
 * completion state (ADR 0084), its own attribute, else derived from its
 * own light color, else its parent section's, else the default; the state
 * as `titleColorOf` finds it. */
function titleColorDarkModeOf(g: Get, x: Ctx): string {
    const colors = JSON.parse(x.cells.core.heading_colors(x.idx) || "null");
    if (!colors) throw new CellsCoreGap("`titleColorDarkMode` of no section");
    return colors.dark[titleColorAndState(g, x)[1]];
}

/** Whether a division may collapse, and whether it is open (ADR 0084). */
function collapsibleReaders(): Record<string, Reader> {
    return {
        collapsible: (g) => g("collapsible") === 1,
        open: (g) => g("open") === 1,
    };
}

/** The step of cascade `c` chosen to show its own message for the gap
 * (ADR 0062): the held-back step one of whose messages is shown. */
function chosenStep(cells: Cells, c: number): number | null {
    for (const k of childComponents(cells, c)) {
        if (cells.core.revealed(k) !== 1) continue;
        const shows = childComponents(cells, k).some(
            (m) =>
                cells.table.componentType(m) === "cascadeMessage" &&
                cells.core.revealed(m) === 0,
        );
        if (shows) return k;
    }
    return null;
}

for (const type of [
    "section",
    "subsection",
    "subsubsection",
    "problem",
    "exercise",
    "example",
    "question",
    "activity",
    "definition",
    "note",
    "theorem",
    "paragraphs",
    "objectives",
    "part",
    "task",
    "problems",
    "exercises",
]) {
    STATE[type] = {
        ...STATE[type],
        ...collapsibleReaders(),
        titleColor: titleColorOf,
        titleColorDarkMode: titleColorDarkModeOf,
        boxed: (_g, x) =>
            sectionBoxed(x.cells.table, x.idx, sectioningTag(x.cells, x.idx)),
        // What a held-back step hides: all it holds but its title, its
        // configuration and a message it shows; a message it does not.
        childrenToHide: (_g, x) => {
            const held = x.cells.core.revealed(x.idx) === 1;
            return childComponents(x.cells, x.idx).filter((k) => {
                const type = x.cells.table.componentType(k);
                if (type === "cascadeMessage") {
                    return x.cells.core.revealed(k) !== 0;
                }
                return held && !LEFT_ALONE.includes(type);
            });
        },
    };
}
STATE.cascade = {
    ...STATE.cascade,
    // The steps and messages it does not show.
    childrenToHide: (_g, x) =>
        childComponents(x.cells, x.idx).filter(
            (k) => x.cells.core.revealed(k) === 2,
        ),
    sectionToShowCascadeMessage: (_g, x) => chosenStep(x.cells, x.idx),
};

/** A `<summaryStatistics>`' statistics, in the order both cores list
 * them: bit `k` of its `statisticsShown` is the `k`th. */
const SUMMARY_STATISTICS = [
    "mean",
    "stdev",
    "variance",
    "stderr",
    "count",
    "minimum",
    "quartile1",
    "median",
    "quartile3",
    "maximum",
    "range",
    "sum",
];
/** Its statistics shown, by `statisticsShown`. */
const statisticsShown = (g: Get) =>
    SUMMARY_STATISTICS.filter((_s, k) => (g("statisticsShown") >> k) & 1);
STATE.summaryStatistics = {
    // A statistic of no values has none: the current core's null.
    ...Object.fromEntries(
        SUMMARY_STATISTICS.map((s) => [
            s,
            (g: Get) => (Number.isNaN(g(s)) ? null : g(s)),
        ]),
    ),
    statisticsToDisplay: (g) => statisticsShown(g),
    // Each statistic shown as its table writes it: rounded by the display
    // settings, the count as the number it is.
    summaryStatistics: (g, x) =>
        Object.fromEntries(
            statisticsShown(g).map((s) => {
                const v = g(s);
                if (Number.isNaN(v)) return [s, null];
                if (s === "count") return [s, v];
                const display = displaySettings(x.cells.table, x.idx);
                return [s, x.cells.core.number_display_latex(v, display)];
            }),
        ),
};
// A multivariate sample (ADR 0067): one number per category, and the
// population's counts.
STATE.sampleMultivariateRandomNumber = {
    ...numberListReaders("sampledValues"),
    numCategories: (g) => g("numCategories"),
    numTotal: (g) => g("numTotal"),
    numDraws: (g) => g("numDraws"),
};
// The positions of a sort's operands, and the counting operators (ADR
// 0078): lists of numbers; a tally's categories its second sequence,
// each a text or a number as its cell holds it.
// An image and a video (ADR 0078): their layout, texts the core settled,
// and the width in pixels of their size.
const mediaReaders: Record<string, Reader> = {
    size: (_g, x) => x.cells.text(x.cell("size")!),
    width: (g) => ({ size: g("width"), isAbsolute: true }),
    horizontalAlign: (_g, x) => x.cells.text(x.cell("horizontalAlign")!),
    displayMode: (_g, x) => x.cells.text(x.cell("displayMode")!),
};
STATE.image = {
    ...mediaReaders,
    decorative: (g) => g("decorative") !== 0,
    rotate: (g) => g("rotate"),
    source: (_g, x) => x.cells.text(x.cell("source")!),
};
STATE.video = mediaReaders;
STATE.sortIndices = numberListReaders("sortedIndices");
STATE.binCounts = numberListReaders("countingResults");
STATE.tally = {
    ...numberListReaders("countingResults"),
    categories: (_g, x) =>
        Array.from(x.cells.propCells(x.idx, "categories")).map((c) =>
            x.cells.core.cell_holds(c) === "text"
                ? x.cells.text(c)
                : x.cells.value(c),
        ),
};
// The parameters a random-number sampler reports beside its moments, of
// the distribution that has them (ADR 0079).
const randomParamReaders: Record<string, Reader> = Object.fromEntries(
    [
        "logMean",
        "logStandardDeviation",
        "logVariance",
        "numTotal",
        "numSuccesses",
        "numDraws",
        "numTrials",
        "probability",
    ].map((p): [string, Reader] => [p, (g) => g(p)]),
);
STATE.sampleRandomNumbers = {
    ...STATE.sampleRandomNumbers,
    ...randomParamReaders,
};
STATE.selectRandomNumbers = {
    ...STATE.selectRandomNumbers,
    ...randomParamReaders,
};

/** State variables a type does not have, as the current core's does not:
 * a test asking whether one is there finds it is not. */
const ABSENT: Record<string, string[]> = {
    cascade: ["title", "sectionNumber"],
};

/** The types the list items' sequence passes through on its way to a
 * section inside them (ADR 0054, ADR 0058): a page, a cascade and the
 * structure. */
const PASSES_LIST_ITEMS = new Set([
    "cascade",
    "page",
    "group",
    "conditionalContent",
    "case",
    "select",
    "option",
    "repeat",
    "repeatForSequence",
]);

/** The `asList` a type that passes the list items through takes from its
 * parent: the cell of the nearest ancestor that is no such type, false
 * when that one has none. */
function passedAsList(cells: Cells, c: number): boolean {
    for (let p = cells.table.parent(c); p !== null; p = cells.table.parent(p)) {
        if (PASSES_LIST_ITEMS.has(cells.table.componentType(p))) continue;
        const asList = cells.propCells(p, "asList");
        return asList.length > 0 && cells.value(asList[0]) !== 0;
    }
    return false;
}

/** What `idx` holds among its children as the current core's
 * `activeChildren` lists them (ADR 0041, decision 4): its text children
 * and components, each one that stands as its children (a repeat, a
 * collect, a group, a list whose entries are rows) replaced by them, and
 * a choice's inactive cases left out. A list's entries are rows, each a
 * component of the entry's type, so a test's `childrenAsPresented` reads
 * them as children. */
function presentedChildren(
    cells: Cells,
    idx: number,
): (string | { componentIdx: number; componentType: string })[] {
    const out: (string | { componentIdx: number; componentType: string })[] =
        [];
    for (const child of cells.table.children(idx)) {
        if (!("component" in child)) {
            out.push(child.text);
            continue;
        }
        const k = child.component;
        const type = cells.table.componentType(k);
        if (type === "case") {
            const active = cells.table.cell(k, "active");
            if (active === undefined || cells.value(active) !== 1) continue;
        }
        if (TRANSPARENT.has(type)) {
            out.push(...presentedChildren(cells, k));
            continue;
        }
        out.push({
            componentIdx: k,
            componentType: type === "mathValue" ? "math" : type,
        });
    }
    return out;
}

/** State variables every type has, read through the core (ADR 0084): its
 * style number, the nearest of it and its referents that writes one, else
 * its parent's, else 1; and its style, what that number means in its
 * scope's table with its own override attributes over it. */
const ANY_STATE: Record<string, Reader> = {
    styleNumber: (_g, x) => x.cells.core.style_number(x.idx),
    selectedStyle: (_g, x) => JSON.parse(x.cells.core.selected_style(x.idx)),
};

/** The component fields the harness answers for every type: what a
 * component holds among its children (`presentedChildren`), and for one
 * that stands as its children, what it stands for among its parent's,
 * which the current core calls a composite's replacements. */
const ANY_FIELDS: Record<string, (cells: Cells, idx: number) => unknown> = {
    activeChildren: presentedChildren,
    replacements: (cells, idx) => {
        const type = cells.table.componentType(idx);
        if (!TRANSPARENT.has(type)) {
            throw new CellsCoreGap(`\`replacements\` of \`${type}\``);
        }
        return presentedChildren(cells, idx);
    },
    replacementsToWithhold: (cells, idx) => {
        const type = cells.table.componentType(idx);
        if (!TRANSPARENT.has(type)) {
            throw new CellsCoreGap(`\`replacementsToWithhold\` of \`${type}\``);
        }
        return 0;
    },
};

/** The current core's component objects, as far as a test reads them to
 * tell a list component from a component (`test/utils/list-entries.ts`):
 * the cells core has no list component, a list's entries being rows of
 * the component table (ADR 0041, decision 4), so none has a
 * `listEntryComponentType`. Its type is the table's; its state values and
 * the children it holds are what `entry` (a component of
 * `returnAllStateVariables`) answers; anything else is a gap. */
function componentObjects(
    cells: Cells,
    entry: (idx: number, componentType: string) => any,
) {
    return new Proxy(
        {},
        {
            get(_target, key) {
                if (typeof key !== "string" || !/^\d+$/.test(key))
                    return undefined;
                const idx = Number(key);
                if (idx >= cells.table.length) return undefined;
                const componentType = cells.table.componentType(idx);
                return new Proxy(
                    {},
                    {
                        get(_t, field) {
                            if (typeof field !== "string" || field === "then")
                                return undefined;
                            if (field === "componentIdx") return idx;
                            if (field === "componentType") return componentType;
                            // The type it is drawn as: its own, a math
                            // value's a math (`presentedChildren`).
                            if (field === "presentedComponentType")
                                return componentType === "mathValue"
                                    ? "math"
                                    : componentType;
                            if (field === "constructor") return {};
                            if (
                                [
                                    "stateValues",
                                    "activeChildren",
                                    "replacements",
                                ].includes(field)
                            )
                                return entry(idx, cells.table.tag(idx))[field];
                            throw new CellsCoreGap(
                                `JavaScript core internals \`core.core._components[].${field}\``,
                            );
                        },
                    },
                );
            },
            ownKeys() {
                throw new CellsCoreGap(
                    "JavaScript core internals `core.core._components` enumerated",
                );
            },
        },
    );
}

/** The component fields the harness answers for some types: a fraction
 * input's `activeChildren` are the boxes it owns (ADR 0045), which the
 * current core's actions on it address. */
const FIELDS: Record<
    string,
    Record<string, (cells: Cells, idx: number) => unknown>
> = {
    // A matrix input's boxes (ADR 0045), by row, as the current core's
    // `activeChildren` list them for its actions.
    matrixInput: {
        activeChildren: (cells, idx) =>
            cells.table.children(idx).flatMap((row) =>
                "component" in row
                    ? cells.table.children(row.component).flatMap((b) =>
                          "component" in b
                              ? [
                                    {
                                        componentIdx: b.component,
                                        componentType: "_matrixComponentInput",
                                    },
                                ]
                              : [],
                      )
                    : [],
            ),
    },
    fractionInput: {
        activeChildren: (cells, idx) =>
            cells.table.children(idx).flatMap((c) =>
                "component" in c &&
                cells.table.tag(c.component) === "_fractionInputComponent"
                    ? [
                          {
                              componentIdx: c.component,
                              componentType: "_fractionInputComponent",
                          },
                      ]
                    : [],
            ),
    },
    // The variant the document was loaded as (ADR 0085), as the current
    // core's shared parameters name it.
    document: {
        sharedParameters: (cells) => {
            const v = JSON.parse(cells.core.variant_json());
            if (v === null)
                throw new CellsCoreGap("a document loaded with no variant");
            return {
                variantIndex: v.index,
                variantName: v.name,
                variantSeed: v.seed,
                allPossibleVariants: v.allPossibleVariants,
                allVariantNames: v.allVariantNames,
                uniqueIndex: v.uniqueIndex ?? undefined,
            };
        },
    },
};

/** What names a component's structure, by type: its boxes and its size,
 * which only a rebuild changes, so a snapshot names them until one (a
 * test finds a matrix input's boxes from a snapshot it took before
 * typing into them, ADR 0045). */
const STRUCTURE: Record<string, string[]> = {
    matrixInput: ["activeChildren", "numRows", "numColumns"],
};

/** The current core's name of each button's press, carried out as the
 * cells core's action `trigger` (ADR 0040). */
const PRESSES: Record<string, string> = {
    callAction: "callAction",
    updateValue: "updateValue",
    triggerSet: "triggerActions",
};

/** Actions the bridge's renderer table resolves (`cells/actions.ts`) whose
 * arguments are the current core's, per component type. */
const BRIDGE_ACTIONS: Record<string, string[]> = {
    vector: ["moveVector"],
    ray: ["moveRay"],
    rectangle: ["movePolygon"],
    regularPolygon: ["movePolygon"],
    solution: ["revealSolution", "closeSolution"],
    curve: ["moveThroughPoint"],
    equilibriumCurve: ["moveThroughPoint", "switchCurve"],
    matrixInput: ["updateNumRows", "updateNumColumns"],
    // Drags the bridge gates by what they may move (ADR 0070), and a
    // segment's end that holds the other when a slope or midpoint places it.
    polygon: ["movePolygon"],
    polyline: ["movePolyline"],
    triangle: ["movePolygon"],
    lineSegment: ["moveLineSegment"],
    // A division a reader opens and closes (ADR 0084).
    ...Object.fromEntries(
        [
            "section",
            "subsection",
            "subsubsection",
            "problem",
            "exercise",
            "example",
            "question",
            "activity",
            "definition",
            "note",
            "theorem",
            "paragraphs",
            "objectives",
            "part",
            "task",
            "problems",
            "exercises",
            "aside",
            "proof",
        ].map((tag) => [tag, ["revealSection", "closeSection"]]),
    ),
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

    const normalized = normalizeDocumentDast(lezerToDast(doenetML), true);
    const dast = stripPositions(normalized);
    let core: any;
    try {
        const bytes = new TextEncoder().encode(JSON.stringify(dast));
        // Unpruned (ADR 0019): the tests read any state variable, not only
        // what a renderer reads. `CELLS_PRUNE=1` loads as a browser does,
        // for timing (`packages/benchmark/scripts/perf-diff.sh`).
        const prune = process.env.CELLS_PRUNE === "1";
        // The document loads as the variant asked for (ADR 0085), whose
        // seed is the document's.
        core = new mod.Core(
            bytes,
            0,
            prune,
            initialState,
            requestedVariantIndex,
        );
    } catch (e) {
        throw new CellsCoreGap(`load: ${String(e)}`);
    }
    const table = new CellsTable(core, wasm.memory);
    // A new document has no answer just submitted: what an earlier test's
    // core left here names components of another document.
    justSubmitted.clear();
    // What the core reports, and the gap behind a component it built as
    // an error (`cells-diagnostics.ts`).
    const diagnostics = new CellsDiagnostics(
        core,
        normalized,
        doenetML,
        (m) => new CellsCoreGap(m),
        (name) => {
            const c = core.resolve_path(name);
            return c !== NONE && table.componentType(c) === "_error"
                ? table.node(c)
                : null;
        },
    );
    /** The gap behind `_error` component `c`, for a read of anything of
     * it: the error the core built it as. */
    function errorGap(c: number): Error {
        return (
            diagnostics.errorGap(table.node(c)) ??
            new CellsCoreGap("an `_error` with no error diagnostic")
        );
    }
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
        elementName: (idx) => diagnostics._node(table.node(idx))?.name ?? null,
    };

    let actionCount = 0;
    /** The action that last rebuilt the document. */
    let rebuiltAt = 0;
    const rawValues = new Map<number, string>();

    function assertCurrent(takenAt: number, what: string, structural = false) {
        // What names a component's structure (STRUCTURE) is as the snapshot
        // had it until a rebuild changes the structure.
        if (structural && rebuiltAt <= takenAt) return;
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

    /** An `_error` among what `c` shows: one of its descendants, or what a
     * reference among them names (a reference to an `_error` is built as
     * an undefined value, not as an `_error`); null if there is none. */
    function errorShownBy(c: number, seen = new Set<number>()): number | null {
        if (seen.has(c)) return null;
        seen.add(c);
        // What a reference names is shown only when it is an `_error`
        // itself: a prop of a container shows none of its contents.
        const named = diagnostics
            .referenceNames(table.node(c))
            .map((name) => core.resolve_path(name))
            .find((k) => k !== NONE && table.componentType(k) === "_error");
        if (named !== undefined) return named;
        const r = table.referent(c);
        const next = [
            ...table
                .children(c)
                .flatMap((ch) => ("component" in ch ? [ch.component] : [])),
            ...(r === null ? [] : [r]),
        ];
        for (const k of next) {
            if (table.componentType(k) === "_error") return k;
            const e = errorShownBy(k, seen);
            if (e !== null) return e;
        }
        return null;
    }

    function stateValue(
        idx: number,
        componentType: string,
        name: string,
    ): unknown {
        if (componentType === "_error") throw errorGap(idx);
        // The text of what holds an element the core built as an error
        // leaves that element out: the gap is the error's.
        if (name === "text") {
            const e = errorShownBy(idx);
            if (e !== null) throw errorGap(e);
        }
        const reader = STATE[componentType]?.[name] ?? ANY_STATE[name];
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
                    // Not a state variable: what `await` looks for when
                    // a test returns the state values from an async
                    // function.
                    if (typeof name !== "string" || name === "then")
                        return undefined;
                    if (ABSENT[componentType]?.includes(name)) return undefined;
                    assertCurrent(
                        takenAt,
                        `\`${componentType}.${name}\``,
                        STRUCTURE[componentType]?.includes(name),
                    );
                    return stateValue(componentIdx, componentType, name);
                },
                has(_target, name) {
                    return (
                        typeof name === "string" &&
                        (STATE[componentType]?.[name] ?? ANY_STATE[name]) !==
                            undefined
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
            assertCurrent(
                takenAt,
                `\`${componentType}.${field}\``,
                STRUCTURE[componentType]?.includes(field),
            );
            if (componentType === "_error") throw errorGap(componentIdx);
            const answer = FIELDS[componentType]?.[field] ?? ANY_FIELDS[field];
            if (answer) return answer(cells, componentIdx);
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
        if (core.last_rebuilt()) rebuiltAt = actionCount;
        // A tick may move the cells (a rebuild makes every array anew).
        table.reload();
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
                    const componentIdx = Number(key);
                    const componentType =
                        componentIdx >= 0 && componentIdx < table.length
                            ? table.tag(componentIdx)
                            : undefined;
                    assertCurrent(
                        takenAt,
                        `component ${key}`,
                        componentType !== undefined &&
                            STRUCTURE[componentType] !== undefined,
                    );
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
            if (componentType === "_error") throw errorGap(componentIdx);
            actionCount++;
            if (process.env.CELLS_TRACE) {
                console.log(
                    `[cells] ${componentType}#${componentIdx}.${actionName} ${JSON.stringify(args)}`,
                );
            }
            // The shapes whose drags the bridge resolves with the same
            // arguments as the current core's actions: a ray's and a
            // vector's both ends, a rectangle's held opposite corner.
            if (BRIDGE_ACTIONS[componentType]?.includes(actionName)) {
                const effect = resolveRendererAction(
                    table,
                    componentIdx,
                    actionName,
                    args,
                );
                if (effect?.kind === "request") request(effect.pairs);
                else if (effect?.kind === "points") request(effect.pairs, true);
                return;
            }
            if (PRESSES[componentType] === actionName) {
                core.trigger(componentIdx);
                table.reload();
                return;
            }
            // A click or a focus, which a button may wait on (ADR 0042).
            if (
                componentType === "point" &&
                (actionName === "pointClicked" || actionName === "pointFocused")
            ) {
                core.act_by_name(componentIdx, actionName);
                table.reload();
                return;
            }
            switch (actionName) {
                case "movePoint":
                    // A point its `draggable` forbids to drag stays, as the
                    // bridge's resolver keeps it (ADR 0070).
                    if (
                        table.cell(componentIdx, "draggable") !== undefined &&
                        table.value(table.cell(componentIdx, "draggable")!) ===
                            0
                    ) {
                        return;
                    }
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
                case "movePolygonCenter":
                case "moveTriangleCenter": {
                    // As the current core's action: a center that is not
                    // two finite numbers is ignored.
                    const center = args.center;
                    if (
                        !Array.isArray(center) ||
                        center.length !== 2 ||
                        !center.every((x) => Number.isFinite(x))
                    ) {
                        return;
                    }
                    request(
                        pointRequests(
                            componentIdx,
                            componentType,
                            "cx",
                            "cy",
                            center,
                        ),
                        true,
                    );
                    return;
                }
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
                    // A mathInput holds an expression (plan 5), its own
                    // or, bound, the one it is bound to (an entry of a
                    // math list, a symbolic math): what was typed goes to
                    // its `expr` cell. On an unbound input a number keeps
                    // the numeric path (the value cell's inverse writes a
                    // constant expression); one bound to a number has a
                    // constant `expr` and stays numeric.
                    const expr = propCells(componentIdx, "expr")[0];
                    const value = propCells(componentIdx, "value")[0];
                    const holdsMath =
                        expr !== undefined &&
                        core.cell_holds(expr) === "math" &&
                        core.cell_class(expr) !== "constant";
                    // A matrix input's box always writes the expression
                    // typed, as the bridge's math input does (`e` is the
                    // symbol it reads as, not a number).
                    const numeric =
                        componentType !== "_matrixComponentInput" &&
                        (!Number.isNaN(latexToNumber(latex)) ||
                            latex.trim() === "");
                    if (
                        holdsMath &&
                        !(
                            numeric &&
                            core.cell_class(expr) === "essential" &&
                            core.cell_holds(value) !== "math"
                        )
                    ) {
                        let handle = NaN;
                        if (latex.trim() !== "") {
                            try {
                                handle = core.parse_math(
                                    me.fromLatex(latex).toString(),
                                );
                            } catch {
                                handle = NaN;
                            }
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
                case "updateSelectedIndices":
                    // A place as shown (ADR 0053); none chooses none.
                    request([
                        [
                            propCells(componentIdx, "selectedIndex")[0],
                            Number(args.selectedIndices?.[0] ?? 0),
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
                    justSubmitted.set(
                        componentIdx,
                        responsesKey(cells, componentIdx),
                    );
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
        if (idx !== NONE) return idx;
        // A name inside an element the core built as an error resolves to
        // nothing: the gap is that error.
        const errors: number[] = [];
        for (let c = 0; c < table.length; c++)
            if (table.componentType(c) === "_error") errors.push(table.node(c));
        const gap = diagnostics.unresolvedNameGap(name, errors);
        if (gap) throw gap;
        return -1;
    }

    /** What the renderers are sent, as the current core's
     * `rendererInstructionBuilder.rendererState` holds it, by component:
     * the cells bridge's flat DAST (ADR 0020), each child an instruction
     * naming its component, and its renderer's state the component's
     * state variables (`STATE`), else the props the bridge sends. A list's
     * row (ADR 0041) has the id `list:k`. */
    function rendererState() {
        const strict = CellsBridge.strict;
        CellsBridge.strict = false;
        const bridge = new CellsBridge(core, wasm.memory);
        const root = bridge.flatDast();
        CellsBridge.strict = strict;
        const takenAt = actionCount;
        const name = (c: number) => {
            const id = table.cols.name[c];
            return id === NONE ? null : table.string(id);
        };
        const anchor = (c: number): string | null => {
            const parent = table.parent(c);
            if (parent !== null && ROW_LISTS.has(table.componentType(parent))) {
                const k = table
                    .children(parent)
                    .findIndex((ch) => "component" in ch && ch.component === c);
                const list = name(parent);
                if (list !== null && k >= 0) return `${list}:${k + 1}`;
            }
            return name(c);
        };
        const typeOf = (c: number) => {
            const type = table.componentType(c);
            return type === "mathValue" ? "math" : type;
        };
        return new Proxy({} as Record<number, any>, {
            get(_target, key) {
                if (typeof key !== "string" || !/^\d+$/.test(key))
                    return undefined;
                assertCurrent(takenAt, `renderer state of ${key}`);
                const c = Number(key);
                // The renderer of a component the core built as an error
                // is the error's box: the gap is the error.
                if (c < table.length && table.componentType(c) === "_error")
                    throw errorGap(c);
                const id = bridge._idByComponent.get(c);
                const element =
                    id === undefined ? undefined : root.elements[id];
                if (!element || element.type !== "element") return undefined;
                const props = (element.data as any).props ?? {};
                const type = table.componentType(c);
                const stateValues = new Proxy(props, {
                    get(target, sv) {
                        if (typeof sv !== "string") return undefined;
                        if (STATE[type]?.[sv]) return stateValue(c, type, sv);
                        return target[sv];
                    },
                });
                return {
                    stateValues,
                    childrenInstructions: element.children.map((ch: any) => {
                        if (typeof ch === "string") return ch;
                        const k = bridge._componentById.get(ch.id)!;
                        const childElement = root.elements[ch.id] as any;
                        return {
                            componentIdx: k,
                            componentType: typeOf(k),
                            rendererType: childElement?.name,
                            id: anchor(k),
                        };
                    }),
                };
            },
        });
    }

    return {
        core: withJavascriptOnlyGaps(adapter, {
            _components: componentObjects(cells, (idx, type) =>
                componentEntry(idx, type, actionCount),
            ),
            // What the current core holds as `rendererInstructionBuilder`'s.
            get rendererState() {
                return rendererState();
            },
            // A component's state variable read as the current core's
            // `components[i].state.name.value`: the state value the
            // table answers (`stateValue`), from the cells the core
            // computes; any other field a gap.
            components: new Proxy(
                {},
                {
                    get(_target, key) {
                        if (typeof key !== "string" || !/^\d+$/.test(key))
                            return undefined;
                        const c = Number(key);
                        if (c >= table.length) return undefined;
                        const type = table.componentType(c);
                        const state = new Proxy(
                            {},
                            {
                                get(_s, sv) {
                                    if (typeof sv !== "string" || sv === "then")
                                        return undefined;
                                    return {
                                        get value() {
                                            return stateValue(c, type, sv);
                                        },
                                    };
                                },
                            },
                        );
                        return new Proxy(
                            {},
                            {
                                get(_t, field) {
                                    if (
                                        typeof field !== "string" ||
                                        field === "then"
                                    )
                                        return undefined;
                                    if (field === "componentIdx") return c;
                                    if (field === "componentType") return type;
                                    if (field === "state") return state;
                                    throw new CellsCoreGap(
                                        `JavaScript core internals \`core.core.components[].${field}\``,
                                    );
                                },
                            },
                        );
                    },
                },
            ),
            rendererInstructionBuilder: {
                get rendererState() {
                    return rendererState();
                },
            },
            // The cells core's diagnostics, with the positions of the
            // nodes they name (`cells-diagnostics.ts`).
            get diagnostics() {
                return diagnostics.records();
            },
        }),
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

function withJavascriptOnlyGaps<T extends object>(
    core: T,
    answered: Record<string, unknown> = {},
): T {
    const internals = new Proxy(
        {},
        {
            get(_target, key) {
                if (typeof key !== "string" || key === "then") return undefined;
                // What the cells core answers of the current core's
                // internals: the renderers' state, from the bridge.
                if (key in answered) return (answered as any)[key];
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
