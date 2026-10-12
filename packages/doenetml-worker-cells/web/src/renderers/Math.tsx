import { useCell, useStore } from "../hooks";
import { fmt } from "./Point";

/** `<math>`: shows the numeric value when it has one, else the text of the
 * expression its math cell holds (main-thread backend only; workers show
 * the handle). */
export function MathView({ idx }: { idx: number }) {
  const store = useStore();
  const value = useCell(store.comps.cell(idx, "value"));
  const exprCell = store.comps.cell(idx, "expr");
  // Subscribing to the handle re-renders when the expression changes.
  const handle = useCell(exprCell);
  const text = Number.isNaN(value) ? (store.exprText(exprCell) ?? `expr#${handle}`) : fmt(value);
  return <span className="math" data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>{text}</span>;
}
