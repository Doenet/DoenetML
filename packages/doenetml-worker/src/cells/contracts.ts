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
import me from "math-expressions";
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

    /** The expression a math cell holds, as math-expressions; the blank
     * expression when its handle is NaN. */
    expr(c: number, name: string): any {
        const cell = this.table.cell(c, name);
        if (cell === undefined || Number.isNaN(this.cell(cell))) {
            return me.fromAst(BLANK);
        }
        return me.fromText(this.table.core.expr_text(cell));
    }

    /** A math component's value: the number its lowered chain computes, or
     * the expression its math cell holds (ADR 0005). */
    math(c: number): any {
        const value = this.num(c, "value");
        if (!Number.isNaN(value) || this.table.cell(c, "expr") === undefined) {
            return me.fromAst(value);
        }
        return this.expr(c, "expr");
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

function latexOf(expr: any): string {
    try {
        return expr.toLatex();
    } catch {
        return String(expr);
    }
}

/** A label: the text of the `<label>` child, else the `label` attribute. */
function label(table: CellsTable, c: number) {
    for (const child of table.children(c)) {
        if (
            "component" in child &&
            table.componentType(child.component) === "label"
        ) {
            return table.core.component_text(child.component);
        }
    }
    return table.attr(c, "label") ?? "";
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

function titleChild(table: CellsTable, c: number): number | null {
    for (const child of table.children(c)) {
        if (
            "component" in child &&
            table.componentType(child.component) === "title"
        ) {
            return child.component;
        }
    }
    return null;
}

function listDepth(table: CellsTable, c: number, kind: "Ol" | "Ul") {
    let depth = 1;
    for (let p = table.parent(c); p !== null; p = table.parent(p)) {
        const type = table.componentType(p);
        if (type === "ol" || type === "ul") depth++;
    }
    return kind === "Ol" ? { Ol: depth } : { Ul: depth };
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
            text: formatNumber(
                r.num(c, "value"),
                r.table.attr(c, "displayDecimals"),
            ),
        }),
    },
    boolean: {
        props: (r, c) => ({ value: r.bool(c, "value") }),
    },
    math: {
        props: (r, c) => ({
            latex: latexOf(r.math(c)),
            renderMode: "inline",
        }),
    },
    // `<m>` and `<md>` hold their LaTeX as text children; `md` is drawn
    // from the prop alone.
    m: {
        props: (r, c) => ({
            latex: r.table.core.component_text(c),
            renderMode: "inline",
        }),
    },
    md: {
        props: (r, c) => ({
            latex: r.table.core.component_text(c),
            renderMode: "display",
        }),
    },
    point: {
        props: (r, c, inGraph) => {
            const x = r.num(c, "x");
            const y = r.num(c, "y");
            return inGraph
                ? { x: mathObject(x), y: mathObject(y) }
                : {
                      coordsLatex: `\\left( ${latexOf(me.fromAst(x))}, ${latexOf(me.fromAst(y))} \\right)`,
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
    // A stub in the prototype until step 3 gives it a contract.
    line: { props: () => ({}) },
    answer: { props: () => ({}) },
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
        excludeChild: () => true,
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

/** Component types with no view of their own. */
export const OMITTED = new Set([
    "award",
    "when",
    "response",
    "functionIterates",
    "selectFromSequence",
    "setup",
    "legend",
    "label",
    "shortDescription",
    "updateValue",
]);
