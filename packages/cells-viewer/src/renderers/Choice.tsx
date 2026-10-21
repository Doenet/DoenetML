import { useCell, useStore } from "../hooks";
import { Children } from "./index";

/** A `<text>`, or a textInput's value shown as text: the value cell holds
 * a string id. */
export function TextView({ idx }: { idx: number }) {
    const store = useStore();
    const v = useCell(store.comps.cell(idx, "value"));
    return (
        <span data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
            {Number.isNaN(v) ? "" : store.comps.string(v)}
        </span>
    );
}

/** A `<conditionalContent>` or `<select>`, unless its `hide` cell holds. */
export function ChoiceView({
    idx,
    inGraph,
}: {
    idx: number;
    inGraph: boolean;
}) {
    const store = useStore();
    const hide = useCell(store.comps.cell(idx, "hide"));
    if (hide !== 0 && !Number.isNaN(hide)) return null;
    return <Children idx={idx} inGraph={inGraph} />;
}

/** One built case of a reactive choice: mounted while its `active` cell
 * is 1. (Keeping inactive cases mounted and hidden measured no faster on a
 * flip: the cost is the content that changes, not the mounting.) */
export function CaseView({ idx, inGraph }: { idx: number; inGraph: boolean }) {
    const store = useStore();
    const active = useCell(store.comps.cell(idx, "active"));
    return active === 1 ? <Children idx={idx} inGraph={inGraph} /> : null;
}

/** Words of a section's `label` cell, in the core's `SECTION_TAGS` order. */
export const SECTION_LABELS = [
    "Section",
    "Section",
    "Section",
    "Problem",
    "Exercise",
    "Example",
];
