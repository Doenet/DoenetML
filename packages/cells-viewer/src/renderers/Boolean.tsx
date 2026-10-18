import { useCell, useStore } from "../hooks";

/** `<boolean>`: its 0/1 value as `true` or `false`. */
export function BooleanView({ idx }: { idx: number }) {
    const store = useStore();
    const v = useCell(store.comps.cell(idx, "value"));
    return (
        <span data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
            {v === 1 ? "true" : "false"}
        </span>
    );
}
