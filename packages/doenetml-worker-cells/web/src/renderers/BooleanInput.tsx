import { useCell, useStore } from "../hooks";

/** `<booleanInput>`: a checkbox over a 0/1 cell. */
export function BooleanInput({ idx }: { idx: number }) {
  const store = useStore();
  const v = useCell(store.comps.cell(idx, "value"));
  return (
    <input
      type="checkbox"
      className="booleanInput"
      checked={v !== 0 && !Number.isNaN(v)}
      data-comp={idx}
      data-name={store.comps.name(idx) ?? undefined}
      onChange={(e) => store.request([[store.comps.cell(idx, "value"), e.target.checked ? 1 : 0]])}
    />
  );
}
