/**
 * A control's box, in integer CSS pixels, split at its baseline: what an
 * expression reserves for a control drawn inside it, and exactly what the
 * control measures. A math field grows and shrinks as the reader types, and
 * the expression is re-typeset around each new size (see `DynamicMath`'s
 * `immediate` for how that keeps up with the keystrokes).
 */
export interface SlotBox {
    width: number;
    /** Height above the baseline. */
    height: number;
    /** Depth below the baseline. */
    depth: number;
}

export function sameBox(a: SlotBox | null, b: SlotBox | null) {
    if (!a || !b) {
        return a === b;
    }
    return a.width === b.width && a.height === b.height && a.depth === b.depth;
}
