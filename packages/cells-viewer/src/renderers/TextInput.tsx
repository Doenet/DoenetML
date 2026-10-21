import { useEffect, useState } from "react";
import { useCell, useStore } from "../hooks";

/** `<textInput>`: its value cell holds a string id; committing the typed
 * text interns it and requests the id (`CellStore.requestText`). */
export function TextInput({ idx }: { idx: number }) {
    const store = useStore();
    const cell = store.comps.cell(idx, "value");
    const id = useCell(cell);
    const current = Number.isNaN(id) ? "" : store.comps.string(id);
    const [text, setText] = useState(current);
    useEffect(() => setText(current), [current]);
    function commit() {
        if (text !== current) store.requestText(cell, text);
    }
    return (
        <input
            className="textInput"
            type="text"
            value={text}
            data-comp={idx}
            data-name={store.comps.name(idx) ?? undefined}
            onChange={(e) => setText(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
        />
    );
}
