import { useCell, useStore } from "../hooks";
import { fmt } from "./Point";

/** `<slider>` in numeric mode. Reads from/to/step/value cells and writes
 * requests on the value cell; the core snaps and clamps (ADR 0003), so the
 * control shows whatever the cell holds after the tick. A NaN value (a bound
 * input that was emptied) is shown at `from`, as the current core does. */
export function Slider({ idx }: { idx: number }) {
  const store = useStore();
  const from = useCell(store.comps.cell(idx, "from"));
  const to = useCell(store.comps.cell(idx, "to"));
  const step = useCell(store.comps.cell(idx, "step"));
  const value = useCell(store.comps.cell(idx, "value"));
  const shown = Number.isNaN(value) ? from : value;
  return (
    <span className="slider" data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
      <input
        type="range"
        min={from}
        max={to}
        step={step > 0 ? step : "any"}
        value={shown}
        onChange={(e) => store.request([[store.comps.cell(idx, "value"), Number(e.target.value)]])}
      />
      <span className="sliderValue">{fmt(shown)}</span>
    </span>
  );
}
