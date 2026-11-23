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
import { LIST_LIKE } from "../../../../doenetml-worker/src/cells/contracts";

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

/** A polygon's vertices; a triangle reads as one. */
const polygonReaders: Record<string, Reader> = {
    numVertices: (g) => g("numVertices"),
    vertices: (g) =>
        items("x", "y", g("numVertices")).map(([x, y]) => pt(g, x, y)),
    numericalVertices: (g) =>
        items("x", "y", g("numVertices")).map(([x, y]) => npt(g, x, y)),
    center: (g) => pt(g, "cx", "cy"),
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

const angleReaders: Record<string, Reader> = {
    radians: exprOr("radiansExpr", "radians"),
    value: exprOr("radiansExpr", "radians"),
    angle: exprOr("radiansExpr", "radians"),
    degrees: exprOr("degreesExpr", "degrees"),
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

/** The entries of a value list (ADR 0041), as the numbers they are. */
const listNumbers: Reader = (_g, x) =>
    Array.from(x.cells.propCells(x.idx, "numbers")).map((c) =>
        x.cells.value(c),
    );
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

/** A section's full number as its parts ([2, 1] for "2.1"): its own,
 * after its nearest section ancestor's when it includes it, as the bridge
 * composes it (`cells/contracts.ts`). */
function sectionEnumeration(cells: Cells, c: number): number[] {
    const own = cells.value(cells.propCells(c, "number")[0]);
    if (cells.value(cells.propCells(c, "includeParentNumber")[0]) !== 0) {
        for (
            let p = cells.table.parent(c);
            p !== null;
            p = cells.table.parent(p)
        ) {
            if (["section", "aside"].includes(cells.table.componentType(p))) {
                return [...sectionEnumeration(cells, p), own];
            }
        }
    }
    return [own];
}
const sectionReaders: Record<string, Reader> = {
    sectionNumber: (_g, x) => sectionEnumeration(x.cells, x.idx).join("."),
    enumeration: (_g, x) => sectionEnumeration(x.cells, x.idx),
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
 * interval, its endpoints and whether each is closed. */
const functionDomain: Reader = (g) => [
    me.fromAst([
        "interval",
        ["tuple", g("domainMin"), g("domainMax")],
        ["tuple", g("domainMinClosed") === 1, g("domainMaxClosed") === 1],
    ]),
];

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

const functionReaders: Record<string, Reader> = {
    domain: functionDomain,
    numericalfs: (_g, x) => [numericalFunction(x)],
    numericalf: (_g, x) => numericalFunction(x),
    formula: (_g, x) => exprOf(x.cells, x.cell("expr")!),
    variables: (_g, x) => [exprOf(x.cells, x.cell("variable")!)],
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
    polygon: polygonReaders,
    triangle: polygonReaders,
    rectangle: rectangleReaders,
    regularPolygon: regularPolygonReaders,
    vector: vectorReaders,
    ray: rayReaders,
    angle: angleReaders,
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
    sampleRandomNumbers: numberListReaders("sampledValues"),
    selectRandomNumbers: numberListReaders("selectedValues"),
    samplePrimeNumbers: numberListReaders("sampledValues"),
    selectPrimeNumbers: numberListReaders("selectedValues"),
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
    // Function machinery (ADR 0049).
    function: functionReaders,
    derivative: functionReaders,
    piecewiseFunction: {
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
};

/** The component fields the harness answers for some types: a fraction
 * input's `activeChildren` are the boxes it owns (ADR 0045), which the
 * current core's actions on it address. */
const FIELDS: Record<
    string,
    Record<string, (cells: Cells, idx: number) => unknown>
> = {
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
                    // Not a state variable: what `await` looks for when
                    // a test returns the state values from an async
                    // function.
                    if (typeof name !== "string" || name === "then")
                        return undefined;
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
            const answer = FIELDS[componentType]?.[field];
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
                    const numeric =
                        !Number.isNaN(latexToNumber(latex)) ||
                        latex.trim() === "";
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
            rendererInstructionBuilder: {
                get rendererState() {
                    return rendererState();
                },
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
