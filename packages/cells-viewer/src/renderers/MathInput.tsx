import { useEffect, useState } from "react";
import { useCell, useStore } from "../hooks";

/** `<mathInput>`: shows the expression its `expr` cell holds (or its
 * numeric value when it has no expression). Committing parses the typed
 * text in the core (`CellStore.parseMath`) and requests the expression on
 * `expr`; text that does not parse stays, marked invalid. A mathInput bound
 * to a cell (`bindValueTo` or a reference child) stays numeric in the core:
 * its `expr` is a constant, and it requests a number on `value`. */
export function MathInput({ idx }: { idx: number }) {
    const store = useStore();
    const exprCell = store.comps.cell(idx, "expr");
    const valueCell = store.comps.cell(idx, "value");
    const symbolic = store.cellClass(exprCell) === "essential";
    const handle = useCell(exprCell);
    const v = useCell(valueCell);
    const current = !Number.isNaN(handle)
        ? store.exprText(exprCell)
        : Number.isNaN(v)
          ? ""
          : String(v);
    const [text, setText] = useState(current);
    const [invalid, setInvalid] = useState(false);
    useEffect(() => {
        setText(current);
        setInvalid(false);
    }, [current]);
    function commit() {
        if (text === current) return;
        if (!symbolic) {
            const n = text.trim() === "" ? NaN : Number(text);
            setInvalid(text.trim() !== "" && Number.isNaN(n));
            if (!Number.isNaN(n) || text.trim() === "")
                store.request([[valueCell, n]]);
            return;
        }
        let h = NaN;
        if (text.trim() !== "") {
            try {
                h = store.parseMath(text);
            } catch {
                setInvalid(true);
                return;
            }
        }
        setInvalid(false);
        store.request([[exprCell, h]]);
    }
    return (
        <input
            className="mathInput"
            type="text"
            value={text}
            aria-invalid={invalid || undefined}
            data-comp={idx}
            data-name={store.comps.name(idx) ?? undefined}
            onChange={(e) => setText(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
        />
    );
}
