import { useCell, useStore } from "../hooks";
import { fmt } from "./Point";

export function NumberView({ idx }: { idx: number }) {
  const store = useStore();
  const v = useCell(store.comps.cell(idx, "value"));
  return <span data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>{fmt(v)}</span>;
}
