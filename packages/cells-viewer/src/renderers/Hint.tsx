import { useCell, useStore } from "../hooks";
import { Children } from "./index";

/** `<hint>`: a disclosure over the hint's `open` cell (0 or 1). */
export function HintView({ idx }: { idx: number }) {
    const store = useStore();
    const open = useCell(store.comps.cell(idx, "open"));
    const isOpen = open !== 0 && !Number.isNaN(open);
    return (
        <details
            className="hint"
            open={isOpen}
            data-comp={idx}
            data-name={store.comps.name(idx) ?? undefined}
            onToggle={(e) => {
                const now = (e.currentTarget as HTMLDetailsElement).open
                    ? 1
                    : 0;
                if ((now === 1) !== isOpen)
                    store.request([[store.comps.cell(idx, "open"), now]]);
            }}
        >
            <summary>Hint</summary>
            {isOpen ? <Children idx={idx} inGraph={false} /> : null}
        </details>
    );
}

/** `<choiceInput>`: radio buttons over the input's 1-based `selectedIndex`
 * cell (0 for none), one per `<choice>` child in document order. */
export function ChoiceInputView({ idx }: { idx: number }) {
    const store = useStore();
    const selected = useCell(store.comps.cell(idx, "selectedIndex"));
    const choices = store.comps
        .children(idx)
        .flatMap((ch) =>
            "c" in ch && store.comps.componentType(ch.c) === "choice"
                ? [ch.c]
                : [],
        );
    return (
        <span
            className="choiceInput"
            data-comp={idx}
            data-name={store.comps.name(idx) ?? undefined}
        >
            {choices.map((c, i) => (
                <label key={c} style={{ display: "block" }}>
                    <input
                        type="radio"
                        name={`choiceInput-${idx}`}
                        checked={selected === i + 1}
                        onChange={() =>
                            store.request([
                                [store.comps.cell(idx, "selectedIndex"), i + 1],
                            ])
                        }
                    />{" "}
                    <Children idx={c} inGraph={false} />
                </label>
            ))}
        </span>
    );
}
