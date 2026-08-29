/**
 * How much room an expression reserves for a control drawn inside it.
 *
 * A control whose size is settled — a text field with a `width`, a select as
 * wide as its widest choice — can simply be measured, and the expression is
 * typeset around a box of exactly that size. A math field cannot: it grows in
 * both directions on nearly every keystroke, while the caret is inside it, and
 * re-typesetting the expression around each new size would reflow the equation
 * under the reader's hands.
 *
 * So while a control says it is being edited, the reservation is rounded up to
 * a coarse step and never allowed to shrink. A run of ordinary keystrokes then
 * lands inside the room already reserved and reports nothing new, and only
 * outgrowing that room costs a re-typeset — which comes back with a fresh step
 * of headroom. When editing ends the reservation returns to the exact box, so
 * an expression at rest has no slack in it.
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
 * The step sizes, chosen so that a few characters or one change of shape fit
 * inside the room already reserved. Wider steps mean fewer reflows but a more
 * conspicuous gap at the moment a field is focused; these are about four
 * characters across and half a line tall at the default size.
 */
export const SLOT_WIDTH_STEP = 48;
export const SLOT_VERTICAL_STEP = 12;

function roundUpTo(value: number, step: number) {
    return Math.ceil(value / step) * step;
}

/**
 * One dimension of the reservation, in the direction the control is growing.
 *
 * Each is decided on its own, so a field that has only grown wider does not
 * also push the rows above and below it apart.
 */
function reserveDimension(
    measured: number,
    reserved: number | null,
    step: number,
) {
    if (reserved !== null && measured <= reserved) {
        return reserved;
    }
    // A control sitting exactly on a step is given the next one up, so that the
    // very next keystroke does not immediately outgrow it again.
    return roundUpTo(measured + 1, step);
}

/**
 * The box to reserve for a control that measures `measured` and currently has
 * `reserved` (nothing, before its first measurement).
 *
 * Not editing: the measured box, so the expression closes back up around a
 * control the reader has finished with.
 *
 * Editing: whatever is already reserved, for as long as the control fits in
 * it — so beginning to type costs nothing, and neither does deleting. Only
 * outgrowing the room asks for more, and then it asks for a whole step of it,
 * which the next several keystrokes then fit inside.
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
        width: reserveDimension(
            measured.width,
            reserved?.width ?? null,
            SLOT_WIDTH_STEP,
        ),
        height: reserveDimension(
            measured.height,
            reserved?.height ?? null,
            SLOT_VERTICAL_STEP,
        ),
        depth: reserveDimension(
            measured.depth,
            reserved?.depth ?? null,
            SLOT_VERTICAL_STEP,
        ),
    };
}

export function sameBox(a: SlotBox | null, b: SlotBox | null) {
    if (!a || !b) {
        return a === b;
    }
    return a.width === b.width && a.height === b.height && a.depth === b.depth;
}
