// Text and layout containers (title, lists, math notation, asides, tables,
// side-by-side), the trigger button, tuples and numbers with decimals.
// Presentation (widths, decimals) comes from the element's literal
// attributes (`ComponentTable.attr`), not from cells.
import { useMemo, type ReactNode } from "react";
import { useCell, useStore, useStoreSnapshot } from "../hooks";
import type { CellStore } from "../core";
import { Children, ChildItems, Component } from "./index";
import { TextView } from "./Choice";
import { fmt } from "./Number";

/** A number with `displayDecimals`, else as the other number views. */
export function formatNumber(v: number, decimals: string | null): string {
    if (decimals !== null && Number.isFinite(v)) {
        const d = Number(decimals);
        if (Number.isInteger(d) && d >= 0 && d <= 20) return v.toFixed(d);
    }
    return fmt(v);
}

/** Render a few LaTeX habits as text: subscripts, superscripts, `\amp`. */
function latex(text: string): ReactNode[] {
    const out: ReactNode[] = [];
    const s = text
        .replace(/\\amp\b/g, "")
        .replace(/\\,/g, " ")
        .replace(/\\cdot\b/g, "·");
    let i = 0,
        plain = "";
    function flush() {
        if (plain) out.push(plain);
        plain = "";
    }
    function group(at: number): [string, number] {
        if (s[at] === "{") {
            let depth = 1,
                j = at + 1;
            while (j < s.length && depth > 0) {
                if (s[j] === "{") depth++;
                else if (s[j] === "}") depth--;
                j++;
            }
            return [s.slice(at + 1, j - 1), j];
        }
        return [s[at] ?? "", at + 1];
    }
    while (i < s.length) {
        const c = s[i];
        if (c === "_" || c === "^") {
            flush();
            const [g, next] = group(i + 1);
            out.push(
                c === "_" ? (
                    <sub key={out.length}>{g}</sub>
                ) : (
                    <sup key={out.length}>{g}</sup>
                ),
            );
            i = next;
        } else {
            plain += c;
            i++;
        }
    }
    flush();
    return out;
}

/** The children of a math-notation element (`<m>`, `<mrow>`): text as
 * LaTeX, and a referenced value as text, not as the component it copies
 * (an input box). */
function MathChildren({ idx }: { idx: number }) {
    const store = useStore();
    const items = useMemo(
        () => store.comps.children(idx),
        [store, store.comps, idx],
    );
    return (
        <>
            {items.map((ch, i) =>
                "t" in ch ? (
                    <span key={i}>{latex(ch.t)}</span>
                ) : (
                    <MathValue key={store.comps.key(ch.c, i)} idx={ch.c} />
                ),
            )}
        </>
    );
}

/** A component inside math notation: its value as text. */
function MathValue({ idx }: { idx: number }) {
    const store = useStore();
    const type = store.comps.componentType(idx);
    if (
        type === "mathInput" ||
        type === "number" ||
        type === "clampNumber" ||
        type === "math" ||
        type === "evaluate"
    ) {
        return <ValueText idx={idx} />;
    }
    if (type === "text" || type === "textInput") return <TextView idx={idx} />;
    return <Children idx={idx} inGraph={false} />;
}

function ValueText({ idx }: { idx: number }) {
    const store = useStore();
    const v = useCell(store.comps.cell(idx, "value"));
    if (Number.isNaN(v) && store.comps.componentType(idx) !== "number") {
        const expr = store.comps.cell(idx, "expr");
        return <span data-comp={idx}>{store.exprText(expr) ?? ""}</span>;
    }
    const decimals = store.comps.attr(idx, "displayDecimals");
    return (
        <span data-comp={idx}>
            {decimals !== null ? formatNumber(v, decimals) : mathNumber(v)}
        </span>
    );
}

/** A number in math notation: six significant digits, no trailing zeros. */
function mathNumber(v: number): string {
    return Number.isFinite(v) ? String(Number(v.toPrecision(6))) : fmt(v);
}

export function InlineMath({ idx }: { idx: number }) {
    return (
        <span className="m">
            <MathChildren idx={idx} />
        </span>
    );
}

export function DisplayMath({ idx }: { idx: number }) {
    const store = useStore();
    const rows = store.comps
        .children(idx)
        .filter((ch): ch is { c: number } => "c" in ch);
    return (
        <div className="md">
            {rows.map((r, i) => (
                <div key={store.comps.key(r.c, i)} className="mrow">
                    <MathChildren idx={r.c} />
                </div>
            ))}
        </div>
    );
}

export function NumberText({ idx }: { idx: number }) {
    const store = useStore();
    const v = useCell(store.comps.cell(idx, "value"));
    return (
        <span data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
            {formatNumber(v, store.comps.attr(idx, "displayDecimals"))}
        </span>
    );
}

/** A tuple: `(a, b, c)`, its `n` entries. */
export function TupleView({ idx }: { idx: number }) {
    const store = useStore();
    const cells = useMemo(
        () =>
            ["n", "x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8"].map((p) =>
                store.comps.cell(idx, p),
            ),
        [store, store.comps, idx],
    );
    const text = useStoreSnapshot(
        (fn) => {
            const offs = cells.map((c) => store.subscribe(c, fn));
            return () => offs.forEach((o) => o());
        },
        () => {
            const n = store.get(cells[0]);
            return `(${cells
                .slice(1, 1 + (Number.isFinite(n) ? n : 0))
                .map((c) => fmt(store.get(c)))
                .join(", ")})`;
        },
    );
    return (
        <span data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
            {text}
        </span>
    );
}

/** Child components of a given type, in order. */
function childrenOfType(store: CellStore, idx: number, type: string): number[] {
    return store.comps
        .children(idx)
        .filter(
            (ch): ch is { c: number } =>
                "c" in ch && store.comps.componentType(ch.c) === type,
        )
        .map((ch) => ch.c);
}

/** `<aside>`: collapsed, its `<title>` the summary. */
export function Aside({ idx }: { idx: number }) {
    const store = useStore();
    const title = childrenOfType(store, idx, "title")[0];
    return (
        <details className="aside" data-comp={idx}>
            <summary>
                {title !== undefined ? (
                    <Children idx={title} inGraph={false} />
                ) : (
                    "Aside"
                )}
            </summary>
            <ChildItems
                items={store.comps
                    .children(idx)
                    .filter((ch) => !("c" in ch) || ch.c !== title)}
                inGraph={false}
            />
        </details>
    );
}

/** `<title>`: the document's heading (inside an aside it is the summary). */
export function Title({ idx }: { idx: number }) {
    return (
        <h2 className="title">
            <Children idx={idx} inGraph={false} />
        </h2>
    );
}

export function List({ idx }: { idx: number }) {
    return (
        <ul>
            <Children idx={idx} inGraph={false} />
        </ul>
    );
}

export function ListItem({ idx }: { idx: number }) {
    return (
        <li>
            <Children idx={idx} inGraph={false} />
        </li>
    );
}

export function Ref({ idx }: { idx: number }) {
    const store = useStore();
    const to = store.comps.attr(idx, "to");
    return (
        <a href={to && /^https?:/.test(to) ? to : undefined} className="ref">
            <Children idx={idx} inGraph={false} />
        </a>
    );
}

/** `<sideBySide widths="40% 30% 20%" margins="0%">`. */
export function SideBySide({ idx }: { idx: number }) {
    const store = useStore();
    const widths = (store.comps.attr(idx, "widths") ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    const kids = store.comps
        .children(idx)
        .filter((ch): ch is { c: number } => "c" in ch);
    return (
        <div
            className="sideBySide"
            style={{
                display: "flex",
                gap: "1em",
                alignItems: "flex-start",
                flexWrap: "wrap",
            }}
        >
            {kids.map((k, i) => (
                <div
                    key={store.comps.key(k.c, i)}
                    style={{
                        flex: widths[i] ? `0 0 ${widths[i]}` : "1 1 0",
                        minWidth: 0,
                    }}
                >
                    <Component idx={k.c} inGraph={false} />
                </div>
            ))}
        </div>
    );
}

/** `<stack>`: block children one above the other; text runs inline. */
export function Stack({ idx }: { idx: number }) {
    return (
        <div className="stack">
            <Children idx={idx} inGraph={false} />
        </div>
    );
}

/** `<tabular>` and `<spreadsheet>`: a table of rows. A spreadsheet's
 * `height` makes it scroll, with its first `fixedRowsTop` rows held. */
export function Table({
    idx,
    spreadsheet,
}: {
    idx: number;
    spreadsheet: boolean;
}) {
    const store = useStore();
    const height = spreadsheet ? store.comps.attr(idx, "height") : null;
    return (
        <div
            className={spreadsheet ? "spreadsheet" : "tabular"}
            style={
                height ? { maxHeight: height, overflowY: "auto" } : undefined
            }
            data-comp={idx}
        >
            <table>
                <tbody>
                    <Children idx={idx} inGraph={false} />
                </tbody>
            </table>
        </div>
    );
}

export function Row({ idx }: { idx: number }) {
    return (
        <tr>
            <Children idx={idx} inGraph={false} />
        </tr>
    );
}

export function Cell({ idx }: { idx: number }) {
    return (
        <td>
            <Children idx={idx} inGraph={false} />
        </td>
    );
}

/** The `<updateValue>`s under a component, in document order. */
function updates(store: CellStore, idx: number, out: number[] = []): number[] {
    if (store.comps.componentType(idx) === "updateValue") out.push(idx);
    for (const ch of store.comps.children(idx))
        if ("c" in ch) updates(store, ch.c, out);
    return out;
}

/** `<triggerSet>`: a button whose `<label>` is its text. Pressing it is one
 * request per `<updateValue>` (its target's cell gets its new value's
 * current value), all in one tick: the same as `Document::trigger`. */
export function TriggerSet({ idx }: { idx: number }) {
    const store = useStore();
    // `<label>` is a group in the core.
    const label = childrenOfType(store, idx, "group")[0];
    function press() {
        const pairs = updates(store, idx).map(
            (u) =>
                [
                    store.comps.cell(u, "target"),
                    store.get(store.comps.cell(u, "newValue")),
                ] as [number, number],
        );
        store.request(pairs);
    }
    return (
        <button
            className="triggerSet"
            data-comp={idx}
            data-name={store.comps.name(idx) ?? undefined}
            onClick={press}
        >
            {label !== undefined ? (
                <Children idx={label} inGraph={false} />
            ) : (
                "Update"
            )}
        </button>
    );
}
