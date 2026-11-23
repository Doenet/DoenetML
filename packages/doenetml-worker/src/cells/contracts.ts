/**
 * What the renderer sees of each cells component type (ADR 0020): the element
 * it stands as, the props its prototype component renderer declares, and its
 * children. A component type with no entry here is sent by its tag with no
 * props, for the renderer to warn about.
 *
 * Every cell a contract reads goes through a `Reads`, which records it (an
 * element is recomputed when one changes) and, in development and tests,
 * checks it is an output (ADR 0019).
 */
import { CellsTable } from "./table";

/** The blank expression the other cores show for an empty math. */
const BLANK = "＿";

/** Cell reads of one element, recorded as it is computed. */
export class Reads {
    table: CellsTable;
    deps = new Set<number>();
    /** Components a prop names as an element (a division's `title`),
     * which the renderer needs whether or not they are children. */
    refs = new Set<number>();
    _idOf: (component: number) => number;
    /** Throws on a cell that is not an output; null when unchecked. */
    check: ((cell: number) => void) | null;

    constructor(
        table: CellsTable,
        idOf: (component: number) => number,
        check: ((cell: number) => void) | null,
    ) {
        this.table = table;
        this._idOf = idOf;
        this.check = check;
    }

    /** The element id of a component a prop names. */
    idOf(component: number): number {
        this.refs.add(component);
        return this._idOf(component);
    }

    /** The value of a cell, recorded. */
    cell(cell: number): number {
        this.check?.(cell);
        this.deps.add(cell);
        return this.table.value(cell);
    }

    /** The `n` consecutive cells from the prop `name` of `c` on (a curve's
     * samples), recorded. */
    run(c: number, name: string, n: number): number[] {
        const first = this.table.cell(c, name);
        if (first === undefined) return [];
        return Array.from({ length: n }, (_, i) => this.cell(first + i));
    }

    /** The number prop `name` of `c`; NaN when its type has none. */
    num(c: number, name: string): number {
        const cell = this.table.cell(c, name);
        return cell === undefined ? NaN : this.cell(cell);
    }

    /** Whether `cell` holds the missing value (ADR 0046), recorded. */
    missingCell(cell: number): boolean {
        this.cell(cell);
        return this.table.isMissing(cell);
    }

    /** Whether the prop `name` of `c` is missing. */
    missing(c: number, name: string): boolean {
        const cell = this.table.cell(c, name);
        return cell !== undefined && this.missingCell(cell);
    }

    bool(c: number, name: string): boolean {
        return this.num(c, name) === 1;
    }

    /** A boolean prop as a boolean element's value: the blank when it is
     * missing, which the renderer prints as it prints the value. */
    boolValue(c: number, name: string): boolean | string {
        return this.missing(c, name) ? BLANK : this.bool(c, name);
    }

    /** The text prop `name` of `c` (a string id in its cell); the blank
     * when it is missing. */
    text(c: number, name: string): string {
        if (this.missing(c, name)) return BLANK;
        const id = this.num(c, name);
        return Number.isNaN(id) ? "" : this.table.string(id);
    }

    /** The number in `cell` as text, `decimals` as `formatNumber` takes
     * it; the blank when it is missing. */
    cellText(cell: number, decimals: string | null): string {
        return this.missingCell(cell)
            ? BLANK
            : formatNumber(this.cell(cell), decimals);
    }

    /** The number prop `name` of `c` as text, as `cellText`. */
    numText(c: number, name: string, decimals: string | null): string {
        const cell = this.table.cell(c, name);
        return cell === undefined
            ? formatNumber(NaN, decimals)
            : this.cellText(cell, decimals);
    }

    /** LaTeX of the expression a math cell holds, from the core's own
     * engine; the blank expression when its handle is NaN. */
    exprLatex(c: number, name: string): string {
        const cell = this.table.cell(c, name);
        if (cell === undefined || Number.isNaN(this.cell(cell))) {
            return BLANK;
        }
        return this.table.core.expr_latex(cell);
    }

    /** The number `c` takes from its document-wide counter (a figure's,
     * a table's, a footnote's; ADR 0044), null when it takes none. The
     * core counts it through the active cases; the cells it read are
     * recorded, so a case that switches recomputes it. */
    counter(c: number): number | null {
        for (const cell of this.table.core.counter_reads(c) as Uint32Array) {
            this.cell(cell);
        }
        return this.table.core.counter_number(c) ?? null;
    }

    /** LaTeX of a math component's value: the number its lowered chain
     * computes, or the expression its math cell holds (ADR 0005). */
    mathLatex(c: number): string {
        if (
            this.missing(c, "value") &&
            this.table.cell(c, "expr") === undefined
        ) {
            return BLANK;
        }
        const value = this.num(c, "value");
        if (!Number.isNaN(value) || this.table.cell(c, "expr") === undefined) {
            return numberLatex(value);
        }
        return this.exprLatex(c, "expr");
    }

    /** LaTeX of a value that is a number or, when the core made it one, an
     * expression in `exprProp` (an operator over math, an angle's measure;
     * ADR 0043): the expression when its cell holds one, else the number
     * `prop`. */
    exprOrNumberLatex(c: number, exprProp: string, prop: string): string {
        const cell = this.table.cell(c, exprProp);
        if (cell !== undefined && !Number.isNaN(this.cell(cell))) {
            return this.table.core.expr_latex(cell);
        }
        return numberLatex(this.num(c, prop));
    }
}

export type Role =
    /** An element of its own. */
    | "element"
    /** Stands as its children, spliced into its parent's. */
    | "transparent"
    /** Not sent: no view of its own. */
    | "omit";

export type Contract = {
    /** The element's name; the component's tag by default. */
    name?: (table: CellsTable, c: number, inGraph: boolean) => string;
    props?: (r: Reads, c: number, inGraph: boolean) => Record<string, unknown>;
    /** Leave this child component out of the element's children (a title
     * drawn from a prop instead). */
    excludeChild?: (table: CellsTable, c: number, child: number) => boolean;
    /** Only an element's children are in its graph (a graph's own). */
    graph?: boolean;
    /** No children at all, text included: everything the element shows
     * is in its props. */
    noChildren?: boolean;
};

/** How a number shows as text: `displayDecimals` when the author gave it,
 * else ten significant digits, as the other cores' default. */
export function formatNumber(v: number, decimals: string | null): string {
    if (Number.isNaN(v)) return "NaN";
    if (decimals !== null) {
        const d = Number(decimals);
        if (Number.isInteger(d) && d >= 0) return v.toFixed(d);
    }
    if (Number.isInteger(v)) return String(v);
    return String(Number(v.toPrecision(10)));
}

/** A number as a `Math` prop: the serialized AST the renderers parse with
 * `numberFromSerializedAst` (the JS bridge sends the same). */
function mathObject(v: number) {
    return { math_object: String(v) };
}

/** A number as LaTeX. */
export function numberLatex(v: number): string {
    if (Number.isNaN(v)) return "\\mathrm{NaN}";
    if (v === Infinity) return "\\infty";
    if (v === -Infinity) return "-\\infty";
    return String(v);
}

/** The `<label>` children of `c`: the core makes each a group. */
function labelChildren(table: CellsTable, c: number): number[] {
    return childrenOfType(table, c, "group");
}

/** A label: the text of the last `<label>` child (of several, the last
 * one written is used, so one added inside an extend replaces the
 * referent's), else the `label` attribute, else the referent's label when
 * `c` is a reference (ADR 0024). */
function label(table: CellsTable, c: number): string {
    const children = labelChildren(table, c);
    if (children.length) {
        return table.core.component_text(children[children.length - 1]);
    }
    const attr = table.attr(c, "label");
    if (attr !== null) return attr;
    const referent = table.referent(c);
    return referent === null ? "" : label(table, referent);
}

/** The fields every input renderer declares from its literal attributes:
 * document text, not state. */
function inputPresentation(table: CellsTable, c: number) {
    const position = table.attr(c, "labelPosition")?.toLowerCase();
    return {
        label: label(table, c),
        labelHasLatex: false,
        labelPosition: position === "start" ? "start" : "end",
        shortDescription: table.attr(c, "shortDescription") ?? "",
    };
}

/** The contract of a value list whose entries read as text by `show`:
 * drawn as a `<text>` of them, comma-separated. */
function valueList(show: (r: Reads, cell: number) => string): Contract {
    return {
        name: () => "text",
        props: (r, c) => ({
            value: r.table
                .listCells(c)
                .map((cell) => show(r, cell))
                .join(", "),
        }),
        noChildren: true,
    };
}

/** What a cell of a math list's entry holds, as text: its expression (the
 * blank one for none), or the number an entry aliasing one holds. */
function heldText(r: Reads, cell: number): string {
    const v = r.cell(cell);
    if (r.table.core.cell_holds(cell) !== "math") return formatNumber(v, null);
    return Number.isNaN(v) ? BLANK : r.table.core.expr_text(cell);
}

/** `heldText` as LaTeX. */
function heldLatex(r: Reads, cell: number): string {
    const v = r.cell(cell);
    if (r.table.core.cell_holds(cell) !== "math") return numberLatex(v);
    return Number.isNaN(v) ? BLANK : r.table.core.expr_latex(cell);
}

/** A list of numbers, drawn as the text of its entries. */
const NUMBER_LIST = valueList((r, cell) => r.cellText(cell, null));

/** A `<sort>`'s or a `<shuffle>`'s entries (ADR 0053): each as its cell
 * holds it, a text, an expression or a number, separated by commas, or
 * by nothing with `asList="false"`. */
const ORDERED_LIST: Contract = {
    name: () => "text",
    props: (r, c) => ({
        value: r.table
            .listCells(c)
            .map((cell) => {
                if (r.missingCell(cell)) return BLANK;
                if (r.table.core.cell_holds(cell) === "text") {
                    const id = r.cell(cell);
                    return Number.isNaN(id) ? "" : r.table.string(id);
                }
                return heldText(r, cell);
            })
            .join(r.num(c, "asList") === 0 ? "" : ", "),
    }),
    noChildren: true,
};

function flag(table: CellsTable, c: number, name: string): boolean {
    const text = table.attr(c, name);
    return text !== null && text.trim().toLowerCase() !== "false";
}

/** A section's tag and the word its title shows, by its `label` cell: the
 * core's `SECTION_TAGS`, in order. */
const SECTION_KINDS: [tag: string, word: string][] = [
    ["section", "Section"],
    ["subsection", "Section"],
    ["subsubsection", "Section"],
    ["problem", "Problem"],
    ["exercise", "Exercise"],
    ["example", "Example"],
    ["question", "Question"],
    ["activity", "Activity"],
    ["definition", "Definition"],
    ["note", "Note"],
    ["theorem", "Theorem"],
    ["paragraphs", "Paragraphs"],
    ["objectives", "Objectives"],
    ["part", "Part"],
    ["task", "Task"],
    ["problems", "Problems"],
    ["exercises", "Exercises"],
];

/** Divisions drawn boxed unless `boxed="false"`, as in the current core. */
const BOXED_BY_DEFAULT = new Set(["objectives"]);

/** The types numbered among their sibling divisions: the core's types
 * that declare `numbered`. */
const NUMBERED_TYPES = new Set(["section", "aside"]);

/** A section's full number ("2.1"): its own, after its nearest section
 * ancestor's when it includes it. */
function sectionNumber(r: Reads, c: number): string {
    const own = r.num(c, "number");
    if (r.num(c, "includeParentNumber") !== 0) {
        for (let p = r.table.parent(c); p !== null; p = r.table.parent(p)) {
            if (NUMBERED_TYPES.has(r.table.componentType(p))) {
                return `${sectionNumber(r, p)}.${own}`;
            }
        }
    }
    return String(own);
}

function sectionDepth(table: CellsTable, c: number): number {
    let depth = 1;
    for (let p = table.parent(c); p !== null; p = table.parent(p)) {
        if (table.componentType(p) === "section") depth++;
    }
    return depth;
}

/** What a figure or a table calls itself: "Figure 2", or the word alone
 * when it takes no number. */
function counterName(word: string, number: number | null): string {
    return number === null ? word : `${word} ${number}`;
}

/** The last `<title>` child: of several, the last one written is used,
 * so one added inside an extend replaces the referent's. */
function titleChild(table: CellsTable, c: number): number | null {
    const titles = childrenOfType(table, c, "title");
    return titles.length ? titles[titles.length - 1] : null;
}

function listDepth(table: CellsTable, c: number, kind: "Ol" | "Ul") {
    let depth = 1;
    for (let p = table.parent(c); p !== null; p = table.parent(p)) {
        const type = table.componentType(p);
        if (type === "ol" || type === "ul") depth++;
    }
    return kind === "Ol" ? { Ol: depth } : { Ul: depth };
}

/** A number in math notation: six significant digits, no trailing zeros. */
function mathNumber(v: number): string {
    return Number.isFinite(v) ? String(Number(v.toPrecision(6))) : String(v);
}

const NUMBER_TYPES = new Set([
    "number",
    "clampNumber",
    "evaluate",
    "sequenceValue",
    "numberInput",
    "slider",
    // The numeric operators.
    "abs",
    "sign",
    "floor",
    "ceil",
    "round",
    "setSmallToZero",
    "wrapNumberPeriodic",
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
    "integer",
    "argMin",
    "argMax",
    "indexOf",
    "searchSorted",
]);

/** A component's value as LaTeX, where math notation refers to it. */
function valueLatex(r: Reads, c: number): string {
    const type = r.table.componentType(c);
    if (type === "math" || type === "mathInput" || type === "interval") {
        return r.mathLatex(c);
    }
    if (NUMBER_TYPES.has(type)) {
        // An operator over math holds an expression (ADR 0043).
        const expr = r.table.cell(c, "expr");
        if (expr !== undefined && !Number.isNaN(r.cell(expr))) {
            return r.table.core.expr_latex(expr);
        }
        return r.missing(c, "value") ? BLANK : mathNumber(r.num(c, "value"));
    }
    if (type === "intComma") {
        return groupDigits(r.numText(c, "value", null));
    }
    if (type === "pluralize") return `\\text{${r.text(c, "value")}}`;
    if (type === "text" || type === "textInput") {
        return `\\text{${r.text(c, "value")}}`;
    }
    return childrenLatex(r, c);
}

/** The LaTeX of math notation's children (`<m>`, `<mrow>`): text as written,
 * and a component it refers to as its value. */
function childrenLatex(r: Reads, c: number): string {
    return r.table
        .children(c)
        .map((child) =>
            "text" in child ? child.text : valueLatex(r, child.component),
        )
        .join("");
}

/** The child components of `c` with this type, in order. */
function childrenOfType(table: CellsTable, c: number, type: string): number[] {
    return table
        .children(c)
        .flatMap((child) =>
            "component" in child &&
            table.componentType(child.component) === type
                ? [child.component]
                : [],
        );
}

/** The points under `c`, through components that stand as their children
 * (a polyline's vertices are copies of the points it gathered). */
function pointsUnder(table: CellsTable, c: number): number[] {
    return table.children(c).flatMap((child) => {
        if (!("component" in child)) return [];
        const type = table.componentType(child.component);
        if (type === "point") return [child.component];
        return TRANSPARENT.has(type) ? pointsUnder(table, child.component) : [];
    });
}

/** Pairs of a list of cells (`x1, y1, x2, y2, ...`) as points. */
function pairs(r: Reads, cells: number[]): [number, number][] {
    const out: [number, number][] = [];
    for (let i = 0; i + 1 < cells.length; i += 2) {
        out.push([r.cell(cells[i]), r.cell(cells[i + 1])]);
    }
    return out;
}

/** Sizes given as `widths="40% 30%"`. */
function sizes(table: CellsTable, c: number, name: string): string[] {
    return (table.attr(c, name) ?? "").trim().split(/\s+/).filter(Boolean);
}

/** A side-by-side's widths: its own, else those of the `<sbsGroup>` it
 * sits in, through components that stand as their children. */
function sideBySideWidths(table: CellsTable, c: number): string[] {
    const own = sizes(table, c, "widths");
    if (own.length) return own;
    for (let p = table.parent(c); p !== null; p = table.parent(p)) {
        const type = table.componentType(p);
        if (type === "sbsGroup") return sizes(table, p, "widths");
        if (!TRANSPARENT.has(type)) break;
    }
    return [];
}

/** A formatted number with its integer digits in groups of three,
 * separated by commas, as an `<intComma>` shows it (the core's
 * `TextKind::Grouped`): `25236501.35` is `25,236,501.35`. */
export function groupDigits(number: string): string {
    const match = /^(-?)(\d+)(.*)$/s.exec(number);
    if (!match) return number;
    const [, sign, int, tail] = match;
    return sign + int.replace(/\B(?=(\d{3})+$)/g, ",") + tail;
}

/** The text of a `<latex>`: its text as written and the LaTeX of the
 * values inside it, each trimmed and the empty left out, joined by spaces,
 * as the other cores join its pieces. A text inside shows its text. */
function latexText(r: Reads, c: number): string {
    return r.table
        .children(c)
        .map((child) => {
            if ("text" in child) return child.text.trim();
            const k = child.component;
            const type = r.table.componentType(k);
            if (type === "text" || type === "textInput") {
                return r.text(k, "value").trim();
            }
            return valueLatex(r, k).trim();
        })
        .filter(Boolean)
        .join(" ");
}

/** A number shown as math notation (the renderer draws it with `M`). */
const MATH_VALUE: Contract = {
    props: (r, c) => ({ latex: r.mathLatex(c), renderMode: "inline" }),
};

/** An operator: its value as math notation, the expression an operator over
 * math holds (ADR 0043), else its number. Its children are its operands,
 * never drawn. */
const OPERATOR_VALUE: Contract = {
    props: (r, c) => ({
        latex: r.exprOrNumberLatex(c, "expr", "value"),
        renderMode: "inline",
    }),
    noChildren: true,
};

/** A boolean operator: its value. Its children are its operands, never
 * drawn. */
const BOOLEAN_OPERATOR: Contract = {
    props: (r, c) => ({ value: r.boolValue(c, "value") }),
    noChildren: true,
};

/** A function's or a derivative's curve: in a graph, a polyline through
 * its samples, which the core takes over the graph's x-range. Its `curve`
 * prop says whether it has one: a function of several variables, or one
 * returning a tuple, has `curve` 0, no samples and no curve. Whether the
 * samples are derived or constants (folded, in a graph whose `fixAxes`
 * holds its bounds; ADR 0028) is no concern of the bridge's. In text it
 * has no view yet. */
const CURVE: Contract = {
    name: (table, c, inGraph) => (inGraph ? "polyline" : table.tag(c)),
    props: (r, c, inGraph) => {
        if (!inGraph) return {};
        if (!r.bool(c, "curve")) return { numericalVertices: [] };
        const n = r.table.core.n_samples();
        const xmin = r.num(c, "xmin");
        const step = (r.num(c, "xmax") - xmin) / (n - 1);
        return {
            numericalVertices: r
                .run(c, "samples", n)
                .map((y, i) => [xmin + step * i, y]),
        };
    },
    noChildren: true,
};

/** A `<curve>` (ADR 0049): a polyline through its samples. A function's
 * graph (`parametric` 0) is sampled as a function's curve; a parametric
 * curve or a spline has its points' x-coordinates from `samplesX` and
 * y-coordinates from `samples`. A spline's through points are sent too,
 * for a renderer that drags them. */
const PLANE_CURVE: Contract = {
    name: (table, c, inGraph) => (inGraph ? "polyline" : table.tag(c)),
    props: (r, c, inGraph) => {
        if (!inGraph) return {};
        if (!r.bool(c, "parametric")) return CURVE.props!(r, c, inGraph);
        const n = r.table.core.n_samples();
        const ys = r.run(c, "samples", n);
        const vertices = r
            .run(c, "samplesX", n)
            .map((x, i) => [x, ys[i]] as [number, number]);
        return {
            numericalVertices: vertices,
            numericalThroughPoints: pairs(r, r.table.listCells(c)),
        };
    },
    noChildren: true,
};

/** A contract whose element is drawn only in a graph: outside one it
 * sends no props and reads no cells, since the core counts the component
 * rendered only in a graph (ADR 0019). */
function inGraphOnly(contract: Contract): Contract {
    const props = contract.props;
    return {
        ...contract,
        props:
            props && ((r, c, inGraph) => (inGraph ? props(r, c, inGraph) : {})),
    };
}

/** A point's props: in a graph its coordinates, which the renderer
 * parses, else their LaTeX. */
function pointProps(r: Reads, c: number, inGraph: boolean) {
    const x = r.num(c, "x");
    const y = r.num(c, "y");
    // A missing coordinate is NaN in a graph, which the renderer does not
    // draw, and the blank in text (VAL-5, ADR 0046).
    const latex = (name: string, v: number) =>
        r.missing(c, name) ? BLANK : numberLatex(v);
    return inGraph
        ? { x: mathObject(x), y: mathObject(y) }
        : {
              coordsLatex: `\\left( ${latex("x", x)}, ${latex("y", y)} \\right)`,
          };
}

/** A line's props: two points it passes through. */
function lineProps(r: Reads, c: number) {
    return {
        numericalPoints: [
            [r.num(c, "x1"), r.num(c, "y1")],
            [r.num(c, "x2"), r.num(c, "y2")],
        ],
    };
}

/** A line's equation, as the current core writes it from the line's two
 * points: `0 = a x + b y + c`, with `a = y1 - y2`, `b = x2 - x1` and
 * `c = x1 y2 - y1 x2`, a term of coefficient 0 left out and one of 1 or -1
 * written without it. The variables are `variables`' two names, else `x`
 * and `y`. */
export function lineEquationLatex(
    [x1, y1]: [number, number],
    [x2, y2]: [number, number],
    variables: string | null,
): string {
    const names = (variables ?? "").split(/[^A-Za-z0-9]+/).filter(Boolean);
    const [vx, vy] = names.length === 2 ? names : ["x", "y"];
    if (![x1, y1, x2, y2].every(Number.isFinite) || (x1 === x2 && y1 === y2)) {
        return BLANK;
    }
    const terms: [number, string][] = [
        [y1 - y2, vx],
        [x2 - x1, vy],
        [x1 * y2 - y1 * x2, ""],
    ];
    let rhs = "";
    for (const [k, v] of terms) {
        if (k === 0) continue;
        const sign = k < 0 ? "-" : rhs ? "+" : "";
        const size = Math.abs(k);
        const coefficient = v && size === 1 ? "" : mathNumber(size);
        const term = v
            ? coefficient
                ? `${coefficient} ${v}`
                : v
            : coefficient;
        rhs += rhs ? ` ${sign} ${term}` : `${sign}${term}`;
    }
    return `0 = ${rhs || "0"}`;
}

/** A line, a best-fit line or an equilibrium line: in a graph its two
 * points, with `extra`; in text its equation, from the two points. */
function lineContract(
    extra: (r: Reads, c: number) => Record<string, unknown> = () => ({}),
): Contract {
    return {
        name: () => "line",
        props: (r, c, inGraph) => {
            if (inGraph) return { ...lineProps(r, c), ...extra(r, c) };
            const [p1, p2] = lineProps(r, c).numericalPoints as [
                [number, number],
                [number, number],
            ];
            return {
                latex: lineEquationLatex(
                    p1,
                    p2,
                    r.table.attrThrough(c, "variables"),
                ),
                renderMode: "inline",
            };
        },
    };
}

/** Where a value is drawn in a graph: its anchor, as a point, where it
 * sits against it (`positionFromAnchor`, the current core's values), and
 * whether a drag moves it. Only a type with an anchor has these, and only
 * in a graph reads them (the core gives no anchor elsewhere). */
export function anchorProps(r: Reads, c: number): Record<string, unknown> {
    if (r.table.cell(c, "anchorX") === undefined) return {};
    const position = r.table.attrThrough(c, "positionFromAnchor");
    return {
        numericalAnchor: [r.num(c, "anchorX"), r.num(c, "anchorY")],
        positionFromAnchor: position?.trim().toLowerCase() || "center",
        draggable: flagOr(r.table, c, "draggable", true),
    };
}

/** A point drawn with a 0/1 flag (an equilibrium point's `stable`, an
 * endpoint's `open`) as `open`, the current core's renderer prop, drawn
 * hollow, and whether a click switches it. */
function flaggedPoint(open: (r: Reads, c: number) => boolean): Contract {
    return {
        name: () => "point",
        props: (r, c, inGraph) =>
            inGraph
                ? {
                      ...pointProps(r, c, inGraph),
                      open: open(r, c),
                      switchable: flagOr(r.table, c, "switchable", false),
                  }
                : pointProps(r, c, inGraph),
    };
}

export const CONTRACTS: Record<string, Contract> = {
    document: {},
    p: {},
    title: {},
    text: {
        props: (r, c) => ({ value: r.text(c, "value") }),
    },
    number: {
        props: (r, c) => ({
            text: r.numText(
                c,
                "value",
                r.table.attrThrough(c, "displayDecimals"),
            ),
        }),
    },
    boolean: {
        props: (r, c) => ({ value: r.boolValue(c, "value") }),
    },
    math: {
        props: (r, c) => ({
            latex: r.mathLatex(c),
            renderMode: "inline",
        }),
    },
    // `<m>` and `<md>` are drawn from the `latex` prop alone: text as
    // written, and a component referred to as its value.
    m: {
        props: (r, c) => ({ latex: childrenLatex(r, c), renderMode: "inline" }),
        noChildren: true,
    },
    md: {
        props: (r, c) => {
            const rows = childrenOfType(r.table, c, "mrow");
            return {
                latex: rows.length
                    ? rows.map((row) => childrenLatex(r, row)).join("\\\\")
                    : childrenLatex(r, c),
                renderMode: rows.length > 1 ? "align" : "display",
            };
        },
        noChildren: true,
    },
    clampNumber: MATH_VALUE,
    evaluate: MATH_VALUE,
    function: CURVE,
    derivative: CURVE,
    sequenceValue: {
        name: () => "number",
        props: (r, c) => ({
            text: r.numText(
                c,
                "value",
                r.table.attrThrough(c, "displayDecimals"),
            ),
        }),
    },
    // A value list (ADR 0041) is drawn, until its entries are rows of
    // their own, as the text of its entries separated by commas, each as
    // its kind reads.
    numberList: NUMBER_LIST,
    textList: valueList((r, cell) => {
        if (r.missingCell(cell)) return BLANK;
        const id = r.cell(cell);
        return Number.isNaN(id) ? "" : r.table.string(id);
    }),
    booleanList: valueList((r, cell) =>
        r.missingCell(cell) ? BLANK : r.cell(cell) === 1 ? "true" : "false",
    ),
    tuple: {
        props: (r, c) => {
            const n = r.num(c, "n");
            const entries = Array.from(
                {
                    length: Number.isInteger(n)
                        ? Math.max(0, Math.min(n, 8))
                        : 0,
                },
                (_, i) =>
                    r.missing(c, `x${i + 1}`)
                        ? BLANK
                        : mathNumber(r.num(c, `x${i + 1}`)),
            );
            return {
                latex: `\\left( ${entries.join(", ")} \\right)`,
                renderMode: "inline",
            };
        },
    },
    point: { props: pointProps },
    graph: {
        graph: true,
        props: (r, c) => ({
            xMin: r.num(c, "xmin"),
            xMax: r.num(c, "xmax"),
            yMin: r.num(c, "ymin"),
            yMax: r.num(c, "ymax"),
        }),
    },
    line: lineContract(),
    lineSegment: inGraphOnly({
        props: (r, c) => ({
            numericalEndpoints: [
                [r.num(c, "x1"), r.num(c, "y1")],
                [r.num(c, "x2"), r.num(c, "y2")],
            ],
        }),
    }),
    circle: inGraphOnly({
        props: (r, c) => ({
            numericalCenter: [r.num(c, "cx"), r.num(c, "cy")],
            numericalRadius: r.num(c, "radius"),
        }),
    }),
    polygon: inGraphOnly({
        props: (r, c) => ({
            numericalVertices: pairs(r, r.table.listCells(c)),
        }),
    }),
    // Its vertices are the points it gathered, which it draws itself.
    polyline: inGraphOnly({
        props: (r, c) => ({
            numericalVertices: pointsUnder(r.table, c).map((p) => [
                r.num(p, "x"),
                r.num(p, "y"),
            ]),
        }),
        noChildren: true,
    }),
    // Its labels, in order, beside the graph's curves in order. Their
    // colors are the renderer's: Doenet's styles are not ported.
    legend: {
        props: (r, c) => ({
            legendElements: labelChildren(r.table, c).map((l) => ({
                swatchType: "line",
                label: {
                    value: r.table.core.component_text(l),
                    hasLatex: false,
                },
            })),
        }),
        noChildren: true,
    },
    answer: {
        props: (r, c) => ({
            creditAchieved: r.num(c, "credit"),
            numSubmissions: r.num(c, "numSubmissions"),
        }),
    },
    slider: {
        props: (r, c) => ({
            from: r.num(c, "from"),
            to: r.num(c, "to"),
            step: r.num(c, "step"),
            value: r.num(c, "value"),
            ...inputPresentation(r.table, c),
        }),
    },
    numberInput: {
        props: (r, c) => ({
            value: r.num(c, "value"),
            ...inputPresentation(r.table, c),
        }),
    },
    // What the student typed comes back as the expression the core parsed
    // it to, as text (or the number, for a mathInput bound to one).
    mathInput: {
        props: (r, c) => {
            const expr = r.table.cell(c, "expr");
            const handle = expr === undefined ? NaN : r.cell(expr);
            const value = r.num(c, "value");
            return {
                text: !Number.isNaN(handle)
                    ? r.table.core.expr_text(expr!)
                    : Number.isNaN(value)
                      ? ""
                      : String(value),
                ...inputPresentation(r.table, c),
            };
        },
    },
    textInput: {
        props: (r, c) => ({
            immediateValue: r.text(c, "value"),
            ...inputPresentation(r.table, c),
            expanded: flag(r.table, c, "expanded"),
            validationState: "unvalidated",
        }),
    },
    booleanInput: {
        props: (r, c) => ({
            immediateValue: r.bool(c, "value"),
            asToggleButton: flag(r.table, c, "asToggleButton"),
            ...inputPresentation(r.table, c),
        }),
    },
    choiceInput: {
        props: (r, c) => {
            const n = r.table
                .children(c)
                .filter(
                    (child) =>
                        "component" in child &&
                        r.table.componentType(child.component) === "choice",
                ).length;
            const selected = r.num(c, "selectedIndex");
            return {
                ...inputPresentation(r.table, c),
                selectedIndices:
                    Number.isInteger(selected) && selected >= 1
                        ? [selected]
                        : [],
                selectMultiple: false,
                choiceOrder: Array.from({ length: n }, (_, i) => i + 1),
                choicesDisabled: new Array(n).fill(false),
                choicesHidden: new Array(n).fill(false),
            };
        },
        // Only its choices: the renderer finds them by position.
        excludeChild: (table, _c, child) =>
            table.componentType(child) !== "choice",
    },
    choice: { props: () => ({}) },
    // A button; its `<updateValue>`s are what it does, not what it shows.
    triggerSet: {
        props: (r, c) => ({
            clickAction: "triggerActions",
            label: label(r.table, c),
            labelHasLatex: false,
            disabled: false,
        }),
        noChildren: true,
    },
    section: {
        name: () => "division",
        props: (r, c) => {
            const title = titleChild(r.table, c);
            const number = sectionNumber(r, c);
            const [tag, word] = SECTION_KINDS[r.num(c, "label")] ?? [
                "section",
                "Section",
            ];
            const boxed = r.table.attr(c, "boxed");
            return {
                title: title === null ? null : r.idOf(title),
                titlePrefix: "",
                codeNumber: number,
                divisionDepth: sectionDepth(r.table, c),
                divisionType: tag,
                xrefLabel: {
                    label: word,
                    global_ident: number,
                    local_ident: number,
                    preferred_form: "Global",
                },
                collapsible: false,
                boxed:
                    boxed === null
                        ? BOXED_BY_DEFAULT.has(tag)
                        : flag(r.table, c, "boxed"),
                open: true,
            };
        },
        excludeChild: (table, _c, child) =>
            table.componentType(child) === "title",
    },
    // An aside: a collapsed division, numbered among the divisions around
    // it as a section is.
    aside: {
        props: (r, c) => {
            const title = titleChild(r.table, c);
            const number = sectionNumber(r, c);
            return {
                title: title === null ? null : r.idOf(title),
                titlePrefix: "",
                codeNumber: number,
                divisionDepth: sectionDepth(r.table, c),
                divisionType: "aside",
                xrefLabel: {
                    label: "Aside",
                    global_ident: number,
                    local_ident: number,
                    preferred_form: "Global",
                },
                collapsible: true,
                boxed: true,
                open: flag(r.table, c, "startOpen"),
            };
        },
        excludeChild: (table, _c, child) =>
            table.componentType(child) === "title",
    },
    hint: {
        props: (r, c) => ({ open: r.num(c, "open") === 1 }),
    },
    ref: {
        props: (r, c) => {
            const to = r.table.attr(c, "to");
            return { url: to && /^https?:/.test(to) ? to : null };
        },
    },
    // Widths in percent of the row; a width given otherwise shares what is
    // left.
    sideBySide: {
        props: (r, c) => ({
            widths: sideBySideWidths(r.table, c).map((w) =>
                w.endsWith("%") ? Number(w.slice(0, -1)) : NaN,
            ),
        }),
    },
    stack: {},
    tabular: {},
    // A spreadsheet shows as a table.
    spreadsheet: { name: () => "tabular" },
    row: {
        props: () => ({ startBorder: "none", valign: "top" }),
    },
    cell: {
        props: () => ({
            bottomBorder: "none",
            endBorder: "none",
            colspan: 1,
            halign: "start",
            header: false,
        }),
    },
    ul: {
        props: (r, c) => ({ listDepth: listDepth(r.table, c, "Ul") }),
    },
    ol: {
        props: (r, c) => ({ listDepth: listDepth(r.table, c, "Ol") }),
    },
    li: {
        props: (r, c) => {
            const parent = r.table.parent(c);
            if (parent === null || r.table.componentType(parent) !== "ol") {
                return { label: "•" };
            }
            const items = r.table
                .children(parent)
                .filter(
                    (child) =>
                        "component" in child &&
                        r.table.componentType(child.component) === "li",
                );
            const position = items.findIndex(
                (child) => "component" in child && child.component === c,
            );
            return { label: `${position + 1}.` };
        },
    },
    // Text markup, characters and plain blocks: no props, each drawn by its
    // own tag, except where the other cores draw it as another's.
    em: {},
    alert: {},
    term: { name: () => "alert" },
    q: {},
    sq: {},
    c: {},
    attr: {},
    span: {},
    tag: {},
    tagc: {},
    // The prototype has no self-closing tag of its own: it draws a `<tage>`
    // as the current core sends it, a `<tag>` with `selfClosed`.
    tage: { name: () => "tag", props: () => ({ selfClosed: true }) },
    ndash: { noChildren: true },
    mdash: { noChildren: true },
    nbsp: { noChildren: true },
    ellipsis: { noChildren: true },
    lq: { noChildren: true },
    rq: { noChildren: true },
    lsq: { noChildren: true },
    rsq: { noChildren: true },
    br: { noChildren: true },
    hr: { noChildren: true },
    div: {},
    pre: {},
    blockQuote: {},
    // Document-structure blocks beside the numbered divisions.
    // A proof: an unnumbered division, collapsed until opened.
    proof: {
        props: (r, c) => {
            const title = titleChild(r.table, c);
            return {
                title: title === null ? null : r.idOf(title),
                titlePrefix: "",
                codeNumber: "",
                divisionDepth: sectionDepth(r.table, c),
                divisionType: "proof",
                xrefLabel: {
                    label: title === null ? "Proof" : "",
                    global_ident: "",
                    local_ident: "",
                    preferred_form: "Global",
                },
                collapsible: true,
                boxed: flag(r.table, c, "boxed"),
                open: flag(r.table, c, "startOpen"),
            };
        },
        excludeChild: (table, _c, child) =>
            table.componentType(child) === "title",
    },
    // Revealed by the reader (`revealSolution`), and closed again.
    solution: {
        props: (r, c) => ({
            open: r.bool(c, "open"),
            canBeClosed: true,
            sectionName: "Solution",
            hide: false,
        }),
    },
    introduction: {},
    conclusion: {},
    statement: {},
    // A figure's caption is drawn from `captionChild`, not as a child. Its
    // number runs through the document apart from the sections, shared with
    // the tables (ADR 0044): "Figure 2", or "Figure" with `number="false"`.
    figure: {
        props: (r, c) => {
            const caption = childrenOfType(r.table, c, "caption")[0];
            const name = counterName("Figure", r.counter(c));
            return {
                caption: "",
                captionChild: caption === undefined ? null : r.idOf(caption),
                figureName: name,
                figureNamePrefix: caption === undefined ? name : `${name}: `,
                suppressFigureNameInCaption: flag(
                    r.table,
                    c,
                    "suppressFigureNameInCaption",
                ),
            };
        },
        excludeChild: (table, _c, child) =>
            table.componentType(child) === "caption",
    },
    caption: {},
    // Its text is the marker's tooltip, and the marker its number among
    // the document's footnotes (ADR 0044).
    footnote: {
        props: (r, c) => ({
            footnoteTag: String(r.counter(c) ?? ""),
            text: r.table.core.component_text(c),
        }),
        noChildren: true,
    },
    // The operators (`components/operators` in the core): a number drawn
    // as math notation, a boolean as `true` or `false`.
    abs: OPERATOR_VALUE,
    sign: OPERATOR_VALUE,
    floor: OPERATOR_VALUE,
    ceil: OPERATOR_VALUE,
    round: OPERATOR_VALUE,
    setSmallToZero: OPERATOR_VALUE,
    wrapNumberPeriodic: OPERATOR_VALUE,
    sum: OPERATOR_VALUE,
    product: OPERATOR_VALUE,
    mean: OPERATOR_VALUE,
    median: OPERATOR_VALUE,
    variance: OPERATOR_VALUE,
    standardDeviation: OPERATOR_VALUE,
    count: OPERATOR_VALUE,
    min: OPERATOR_VALUE,
    max: OPERATOR_VALUE,
    mod: OPERATOR_VALUE,
    gcd: OPERATOR_VALUE,
    lcm: OPERATOR_VALUE,
    and: BOOLEAN_OPERATOR,
    or: BOOLEAN_OPERATOR,
    xor: BOOLEAN_OPERATOR,
    iff: BOOLEAN_OPERATOR,
    implies: BOOLEAN_OPERATOR,
    not: BOOLEAN_OPERATOR,
    isInteger: BOOLEAN_OPERATOR,
    isNumber: BOOLEAN_OPERATOR,
    isBetween: BOOLEAN_OPERATOR,
    // Geometry: rays, vectors, rectangles, regular polygons and angles. A
    // ray and the polygons are drawn only in a graph, and send nothing
    // elsewhere.
    ray: {
        props: (r, c, inGraph) =>
            inGraph
                ? {
                      numericalEndpoint: [
                          r.num(c, "endpointX"),
                          r.num(c, "endpointY"),
                      ],
                      numericalThroughpoint: [
                          r.num(c, "throughX"),
                          r.num(c, "throughY"),
                      ],
                  }
                : {},
    },
    // In a graph an arrow, outside one its displacement, as math.
    vector: {
        props: (r, c, inGraph) => {
            if (!inGraph) {
                const [x, y] = [r.num(c, "x"), r.num(c, "y")];
                return {
                    latex: `\\left( ${mathNumber(x)}, ${mathNumber(y)} \\right)`,
                    renderMode: "inline",
                };
            }
            const draggable = flagOr(r.table, c, "draggable", true);
            return {
                numericalEndpoints: [
                    [r.num(c, "tailX"), r.num(c, "tailY")],
                    [r.num(c, "headX"), r.num(c, "headY")],
                ],
                headDraggable: flagOr(r.table, c, "headDraggable", draggable),
                tailDraggable: flagOr(r.table, c, "tailDraggable", draggable),
            };
        },
    },
    rectangle: {
        props: (r, c, inGraph) =>
            inGraph
                ? { numericalVertices: pairs(r, r.table.listCells(c)) }
                : {},
    },
    regularPolygon: {
        props: (r, c, inGraph) =>
            inGraph
                ? { numericalVertices: pairs(r, r.table.listCells(c)) }
                : {},
    },
    // In a graph an arc at its vertex, from the ray through its first
    // point, turning counterclockwise by its measure. In text its measure,
    // in radians or, with `inDegrees`, in degrees: the expression when the
    // measure is one (ADR 0043), else the number.
    angle: {
        props: (r, c, inGraph) => {
            if (inGraph) {
                const radius = Number(r.table.attrThrough(c, "radius"));
                return {
                    numericalFirstPoint: [r.num(c, "x1"), r.num(c, "y1")],
                    numericalVertex: [r.num(c, "x2"), r.num(c, "y2")],
                    radians: r.num(c, "radians"),
                    radius: Number.isFinite(radius) && radius > 0 ? radius : 1,
                };
            }
            const decimals = r.table.attrThrough(c, "displayDecimals");
            const inDegrees = flag(r.table, c, "inDegrees");
            const exprProp = inDegrees ? "degreesExpr" : "radiansExpr";
            const expr = r.table.cell(c, exprProp);
            const measure =
                expr !== undefined && !Number.isNaN(r.cell(expr))
                    ? r.exprLatex(c, exprProp)
                    : r.numText(c, inDegrees ? "degrees" : "radians", decimals);
            return { latex: inDegrees ? `${measure}^\\circ` : measure };
        },
        noChildren: true,
    },
    // The formatted values (`components/values/formatted.rs`,
    // `pluralize.rs` in the core), each drawn as its text.
    integer: {
        props: (r, c) => ({
            text: r.numText(
                c,
                "value",
                r.table.attrThrough(c, "displayDecimals"),
            ),
        }),
    },
    intComma: {
        props: (r, c) => ({
            text: groupDigits(r.numText(c, "value", null)),
        }),
    },
    pluralize: {
        props: (r, c) => ({ text: r.text(c, "value") }),
    },
    // The layout containers (`components/containers/layout.rs`).
    // A `<latex>` is drawn as its text, which its children make.
    latex: {
        props: (r, c) => ({ text: latexText(r, c) }),
        noChildren: true,
    },
    // A table: its title after its name, then its content. Its number runs
    // through the document apart from the sections, shared with the figures
    // (ADR 0044): "Table 2", or "Table" with `number="false"`.
    table: {
        props: (r, c) => {
            const title = titleChild(r.table, c);
            const number = r.counter(c);
            const name = counterName("Table", number);
            return {
                title: title === null ? null : r.idOf(title),
                titlePrefix: flag(r.table, c, "suppressTableNameInTitle")
                    ? ""
                    : title === null
                      ? name
                      : `${name}: `,
                codeNumber: number === null ? "" : String(number),
                divisionDepth: sectionDepth(r.table, c),
                divisionType: "table",
                xrefLabel: {
                    label: "Table",
                    global_ident: number === null ? "" : String(number),
                    local_ident: number === null ? "" : String(number),
                    preferred_form: "Global",
                },
            };
        },
        excludeChild: (table, _c, child) =>
            table.componentType(child) === "title",
    },
    // Its side-by-sides one above the other; each takes the group's
    // `widths` when it gives none.
    sbsGroup: { name: () => "stack" },
    // The PreTeXt wrappers, drawn as their children.
    pretext: {},
    article: {},
    book: {},
    // Lists of numbers a component computes or draws (the list and index
    // operators, `<sort>`, `<shuffle>`, `<sequence>` and the samplers):
    // drawn as a number list is, the text of their entries.
    cumulativeSum: NUMBER_LIST,
    cumulativeProduct: NUMBER_LIST,
    cumulativeMin: NUMBER_LIST,
    cumulativeMax: NUMBER_LIST,
    differences: NUMBER_LIST,
    sort: ORDERED_LIST,
    shuffle: ORDERED_LIST,
    sequence: NUMBER_LIST,
    selectRandomNumbers: NUMBER_LIST,
    sampleRandomNumbers: NUMBER_LIST,
    selectPrimeNumbers: NUMBER_LIST,
    samplePrimeNumbers: NUMBER_LIST,
    argMin: OPERATOR_VALUE,
    argMax: OPERATOR_VALUE,
    indexOf: OPERATOR_VALUE,
    searchSorted: OPERATOR_VALUE,
    // The function operators, each a function's curve; and a triangle,
    // drawn as a polygon of its three vertices only in a graph.
    clampFunction: CURVE,
    wrapFunctionPeriodic: CURVE,
    triangle: {
        props: (r, c, inGraph) =>
            inGraph
                ? { numericalVertices: pairs(r, r.table.listCells(c)) }
                : {},
    },
    // Derived geometry, each drawn by the renderer of the shape it is: a
    // best-fit line as a line; an intersection as a point, left out while
    // it is hidden (no crossing); a parabola as a function's curve. An
    // equilibrium point or line and an endpoint also send their flag as
    // the current core's renderers read it (`open`, `dashed`).
    bestFitLine: lineContract(),
    intersection: { name: () => "point", props: pointProps },
    parabola: CURVE,
    equilibriumPoint: flaggedPoint((r, c) => !r.bool(c, "stable")),
    endpoint: flaggedPoint((r, c) => r.bool(c, "open")),
    equilibriumLine: lineContract((r, c) => ({
        dashed: !r.bool(c, "stable"),
        switchable: flagOr(r.table, c, "switchable", false),
    })),
    // Function machinery (ADR 0049): a piecewise function as a function's
    // curve, its pieces never drawn on their own; a curve as a polyline
    // through its samples, and an equilibrium curve dashed when it is
    // not stable.
    piecewiseFunction: CURVE,
    curve: PLANE_CURVE,
    equilibriumCurve: {
        ...PLANE_CURVE,
        props: (r, c, inGraph) =>
            inGraph
                ? {
                      ...PLANE_CURVE.props!(r, c, inGraph),
                      dashed: !r.bool(c, "stable"),
                      switchable: flagOr(r.table, c, "switchable", false),
                  }
                : {},
    },
    // A fraction input (ADR 0045): its label, and as its children the two
    // math inputs it owns, its numerator's and its denominator's, which
    // the renderer draws one over the other.
    fractionInput: {
        props: (r, c) => inputPresentation(r.table, c),
        excludeChild: (table, _c, child) =>
            table.componentType(child) !== "_fractionInputComponent",
    },
    // A fraction input's box (ADR 0045): a math input, drawn as one.
    _fractionInputComponent: {
        name: () => "mathInput",
        props: (r, c, inGraph) => CONTRACTS.mathInput.props!(r, c, inGraph),
    },
    // A button calling another component's action (ADR 0040), carried out
    // by the core as the action `trigger`; its `<label>` is its text.
    callAction: {
        props: (r, c) => ({
            clickAction: "callAction",
            label: label(r.table, c),
            labelHasLatex: false,
            disabled: false,
        }),
        noChildren: true,
    },
    // A button setting another component's value, the same way; inside a
    // `<triggerSet>` it is what the set does, not what it shows.
    updateValue: {
        props: (r, c) => ({
            clickAction: "updateValue",
            label: label(r.table, c),
            labelHasLatex: false,
            disabled: false,
        }),
        noChildren: true,
    },
    // A math list (ADR 0041) is drawn as the other value lists are, as the
    // text of its entries; an entry read by itself (`$ml[2]`) is a math.
    mathList: valueList((r, cell) => heldText(r, cell)),
    mathValue: {
        name: () => "math",
        props: (r, c) => {
            const cell = r.table.cell(c, "value");
            return {
                latex: cell === undefined ? BLANK : heldLatex(r, cell),
                renderMode: "inline",
            };
        },
    },
    // Values with entries inside a math (ADR 0041, decision 8): an
    // interval is a math, drawn as one.
    interval: {
        name: () => "math",
        props: (r, c) => ({ latex: r.mathLatex(c), renderMode: "inline" }),
    },
};

/** A literal on/off attribute, `fallback` when it is absent. */
function flagOr(
    table: CellsTable,
    c: number,
    name: string,
    fallback: boolean,
): boolean {
    const text = table.attrThrough(c, name);
    return text === null ? fallback : text.trim().toLowerCase() !== "false";
}

/** Component types that stand as their children. */
export const TRANSPARENT = new Set([
    "repeat",
    "repeatForSequence",
    "collect",
    "group",
    "pointList",
    "stickyGroup",
    "conditionalContent",
    "select",
    "case",
    "_postponeRenderContainer",
    "asList",
]);

/** Component types that show what they produce as a list, items
 * separated by commas, unless `asList="false"` (COMP-2 of the
 * principles); a `group` is a list only with `asList`. */
export const LIST_LIKE = new Set([
    "repeat",
    "repeatForSequence",
    "collect",
    "select",
    "asList",
]);

/** List-like types whose items are the children of one scope (an
 * iteration, a pick) rather than single children. */
export const PER_SCOPE = new Set(["repeat", "repeatForSequence", "select"]);

/** Component types that cannot sit in a list: one of them among a list's
 * items turns the commas off (COMP-2). */
export const BLOCKS = new Set([
    "p",
    "section",
    "graph",
    "ul",
    "ol",
    "tabular",
    "spreadsheet",
    "sideBySide",
    "stack",
    "aside",
    "hint",
    "md",
    "div",
    "pre",
    "blockQuote",
    "hr",
    "proof",
    "solution",
    "introduction",
    "conclusion",
    "statement",
    "figure",
    "table",
    "sbsGroup",
    "pretext",
    "article",
    "book",
]);

/** Component types with no view of their own. */
export const OMITTED = new Set([
    "award",
    "when",
    "response",
    "functionIterates",
    "selectFromSequence",
    "setup",
    "label",
    "shortDescription",
    "mrow",
    // `<xLabel>` and `<yLabel>`: the prototype's graph draws no axis
    // labels.
    "xLabel",
]);
