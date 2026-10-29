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

    /** The number prop `name` of `c`; NaN when its type has none. */
    num(c: number, name: string): number {
        const cell = this.table.cell(c, name);
        return cell === undefined ? NaN : this.cell(cell);
    }

    bool(c: number, name: string): boolean {
        return this.num(c, name) === 1;
    }

    /** The text prop `name` of `c` (a string id in its cell). */
    text(c: number, name: string): string {
        const id = this.num(c, name);
        return Number.isNaN(id) ? "" : this.table.string(id);
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

    /** LaTeX of a math component's value: the number its lowered chain
     * computes, or the expression its math cell holds (ADR 0005). */
    mathLatex(c: number): string {
        const value = this.num(c, "value");
        if (!Number.isNaN(value) || this.table.cell(c, "expr") === undefined) {
            return numberLatex(value);
        }
        return this.exprLatex(c, "expr");
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
    name?: (table: CellsTable, c: number) => string;
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

function flag(table: CellsTable, c: number, name: string): boolean {
    const text = table.attr(c, name);
    return text !== null && text.trim().toLowerCase() !== "false";
}

/** A section's title by its `label` cell: the titles of the core's
 * `SECTION_TAGS`, in order. */
const SECTION_LABELS = [
    "Section",
    "Section",
    "Section",
    "Problem",
    "Exercise",
    "Example",
];

/** A section's full number ("2.1"): its own, after its nearest section
 * ancestor's when it includes it. */
function sectionNumber(r: Reads, c: number): string {
    const own = r.num(c, "number");
    if (r.num(c, "includeParentNumber") !== 0) {
        for (let p = r.table.parent(c); p !== null; p = r.table.parent(p)) {
            if (r.table.componentType(p) === "section") {
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
]);

/** A component's value as LaTeX, where math notation refers to it. */
function valueLatex(r: Reads, c: number): string {
    const type = r.table.componentType(c);
    if (type === "math" || type === "mathInput") return r.mathLatex(c);
    if (NUMBER_TYPES.has(type)) return mathNumber(r.num(c, "value"));
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

/** A number shown as math notation (the renderer draws it with `M`). */
const MATH_VALUE: Contract = {
    props: (r, c) => ({ latex: r.mathLatex(c), renderMode: "inline" }),
};

export const CONTRACTS: Record<string, Contract> = {
    document: {},
    p: {},
    title: {},
    text: {
        props: (r, c) => ({ value: r.text(c, "value") }),
    },
    number: {
        props: (r, c) => ({
            text: formatNumber(
                r.num(c, "value"),
                r.table.attrThrough(c, "displayDecimals"),
            ),
        }),
    },
    boolean: {
        props: (r, c) => ({ value: r.bool(c, "value") }),
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
    sequenceValue: {
        name: () => "number",
        props: (r, c) => ({
            text: formatNumber(
                r.num(c, "value"),
                r.table.attrThrough(c, "displayDecimals"),
            ),
        }),
    },
    tuple: {
        props: (r, c) => {
            const n = r.num(c, "n");
            const entries = Array.from(
                {
                    length: Number.isInteger(n)
                        ? Math.max(0, Math.min(n, 8))
                        : 0,
                },
                (_, i) => mathNumber(r.num(c, `x${i + 1}`)),
            );
            return {
                latex: `\\left( ${entries.join(", ")} \\right)`,
                renderMode: "inline",
            };
        },
    },
    point: {
        props: (r, c, inGraph) => {
            const x = r.num(c, "x");
            const y = r.num(c, "y");
            return inGraph
                ? { x: mathObject(x), y: mathObject(y) }
                : {
                      coordsLatex: `\\left( ${numberLatex(x)}, ${numberLatex(y)} \\right)`,
                  };
        },
    },
    graph: {
        graph: true,
        props: (r, c) => ({
            xMin: r.num(c, "xmin"),
            xMax: r.num(c, "xmax"),
            yMin: r.num(c, "ymin"),
            yMax: r.num(c, "ymax"),
        }),
    },
    line: {
        props: (r, c) => ({
            numericalPoints: [
                [r.num(c, "x1"), r.num(c, "y1")],
                [r.num(c, "x2"), r.num(c, "y2")],
            ],
        }),
    },
    lineSegment: {
        props: (r, c) => ({
            numericalEndpoints: [
                [r.num(c, "x1"), r.num(c, "y1")],
                [r.num(c, "x2"), r.num(c, "y2")],
            ],
        }),
    },
    circle: {
        props: (r, c) => ({
            numericalCenter: [r.num(c, "cx"), r.num(c, "cy")],
            numericalRadius: r.num(c, "radius"),
        }),
    },
    polygon: {
        props: (r, c) => ({
            numericalVertices: pairs(r, r.table.listCells(c)),
        }),
    },
    // Its vertices are the points it gathered, which it draws itself.
    polyline: {
        props: (r, c) => ({
            numericalVertices: pointsUnder(r.table, c).map((p) => [
                r.num(p, "x"),
                r.num(p, "y"),
            ]),
        }),
        noChildren: true,
    },
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
            const kind = SECTION_LABELS[r.num(c, "label")] ?? "Section";
            return {
                title: title === null ? null : r.idOf(title),
                titlePrefix: "",
                codeNumber: number,
                divisionDepth: sectionDepth(r.table, c),
                divisionType: r.table.tag(c),
                xrefLabel: {
                    label: kind,
                    global_ident: number,
                    local_ident: number,
                    preferred_form: "Global",
                },
                collapsible: false,
                boxed: flag(r.table, c, "boxed"),
                open: true,
            };
        },
        excludeChild: (table, _c, child) =>
            table.componentType(child) === "title",
    },
    // An aside: a collapsed division.
    aside: {
        props: (r, c) => {
            const title = titleChild(r.table, c);
            return {
                title: title === null ? null : r.idOf(title),
                titlePrefix: "",
                codeNumber: "",
                divisionDepth: sectionDepth(r.table, c),
                divisionType: "aside",
                xrefLabel: {
                    label: title === null ? "Aside" : "",
                    global_ident: "",
                    local_ident: "",
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
            widths: sizes(r.table, c, "widths").map((w) =>
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
};

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
]);

/** Component types that show what they produce as a list, items
 * separated by commas, unless `asList="false"` (COMP-2 of the
 * principles); a `group` is a list only with `asList`. */
export const LIST_LIKE = new Set([
    "repeat",
    "repeatForSequence",
    "collect",
    "select",
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
    "updateValue",
    "mrow",
]);
