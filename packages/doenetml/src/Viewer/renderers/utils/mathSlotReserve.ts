/**
 * How much room an expression reserves for a control drawn inside it.
 *
 * A control whose size is settled — a text field with a `width`, a select as
 * wide as its widest choice — can simply be measured, and the expression is
 * typeset around a box of exactly that size. A math field cannot: it grows in
 * both directions on nearly every keystroke, while the caret is inside it.
 *
 * So while a control says it is being edited, the reservation follows it
 * exactly as it grows and is never allowed to shrink. Growing re-typesets the
 * expression each time, which is drawn in step with the control when that is
 * cheap enough and a beat behind when it is not (see `DynamicMath`); either
 * way the control itself stays put. Deleting costs nothing, and the room it
 * frees is not taken back — and the rows of an aligned display not pulled back
 * in — under the reader's hands. When editing ends the reservation returns to
 * the exact box, so an expression at rest has no slack in it.
 */

/** A control's box, in integer CSS pixels, split at its baseline. */
export interface SlotBox {
    width: number;
    /** Height above the baseline. */
    height: number;
    /** Depth below the baseline. */
    depth: number;
}

/**
 * One dimension of the reservation. Each is decided on its own, so a field
 * that has only grown wider does not also push the rows above and below it
 * apart.
 */
function reserveDimension(measured: number, reserved: number | null) {
    if (reserved !== null && measured <= reserved) {
        return reserved;
    }
    return measured;
}

/**
 * The box to reserve for a control that measures `measured` and currently has
 * `reserved` (nothing, before its first measurement).
 *
 * Not editing: the measured box, so the expression closes back up around a
 * control the reader has finished with.
 *
 * Editing: whatever is already reserved, for as long as the control fits in
 * it, and otherwise exactly what it measures.
 */
export function reserveForSlot({
    measured,
    reserved,
    editing,
}: {
    measured: SlotBox;
    reserved: SlotBox | null;
    editing: boolean;
}): SlotBox {
    if (!editing) {
        return measured;
    }
    return {
        width: reserveDimension(measured.width, reserved?.width ?? null),
        height: reserveDimension(measured.height, reserved?.height ?? null),
        depth: reserveDimension(measured.depth, reserved?.depth ?? null),
    };
}

export function sameBox(a: SlotBox | null, b: SlotBox | null) {
    if (!a || !b) {
        return a === b;
    }
    return a.width === b.width && a.height === b.height && a.depth === b.depth;
}
