import { useCell, useStore } from "../hooks";

export function fmt(v: number): string {
    if (Number.isNaN(v)) return "NaN";
    return Number.isInteger(v) ? String(v) : v.toPrecision(4);
}

export function NumberView({ idx }: { idx: number }) {
    const store = useStore();
    const v = useCell(store.comps.cell(idx, "value"));
    return (
        <span data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
            {fmt(v)}
        </span>
    );
}

/** A point outside a graph: its coordinates as text. */
export function PointText({ idx }: { idx: number }) {
    const store = useStore();
    const x = useCell(store.comps.cell(idx, "x"));
    const y = useCell(store.comps.cell(idx, "y"));
    const hide = useCell(store.comps.cell(idx, "hide"));
    if (hide !== 0 && !Number.isNaN(hide)) return null;
    return (
        <span data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
            ({fmt(x)}, {fmt(y)})
        </span>
    );
}
