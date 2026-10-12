import { useMemo, useSyncExternalStore } from "react";
import { useCell, useStore } from "../hooks";
import { Children } from "./index";

/** A `<text>`: its value cell holds a string id. */
export function TextView({ idx }: { idx: number }) {
  const store = useStore();
  const v = useCell(store.comps.cell(idx, "value"));
  return <span data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>{Number.isNaN(v) ? "" : store.comps.string(v)}</span>;
}

/** A `<conditionalContent>` or `<select>`, unless its `hide` cell holds. */
export function ChoiceView({ idx, inGraph }: { idx: number; inGraph: boolean }) {
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
const SECTION_LABELS = ["Section", "Section", "Section", "Problem", "Exercise", "Example"];

/** The `number` cells that make up a section's full number ("2.1"): its
 * own, after its nearest section ancestor's when it includes it. */
function numberCells(store: ReturnType<typeof useStore>, idx: number): number[] {
  const own = store.comps.cell(idx, "number");
  if (store.get(store.comps.cell(idx, "includeParentNumber")) === 0) return [own];
  for (let p = store.comps.parent(idx); p !== null; p = store.comps.parent(p)) {
    if (store.comps.componentType(p) === "section") return [...numberCells(store, p), own];
  }
  return [own];
}

/** A section: its automatic title, then its children. The number follows
 * the cases that are active before it (`build/expand/scoring.rs`). */
export function SectionView({ idx, inGraph }: { idx: number; inGraph: boolean }) {
  const store = useStore();
  const cells = useMemo(() => numberCells(store, idx), [store, store.comps, idx]);
  const number = useSyncExternalStore(
    (fn) => {
      const offs = cells.map((c) => store.subscribe(c, fn));
      return () => offs.forEach((off) => off());
    },
    () => cells.map((c) => store.get(c)).join("."),
  );
  const label = SECTION_LABELS[store.get(store.comps.cell(idx, "label"))] ?? "Section";
  return (
    <section data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
      <h3>{label} {number}</h3>
      <Children idx={idx} inGraph={inGraph} />
    </section>
  );
}
