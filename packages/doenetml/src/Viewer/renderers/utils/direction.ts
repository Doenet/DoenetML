/**
 * Props that pin a block-level widget to left-to-right inside a document that
 * may be running the other way.
 *
 * Mathematical notation does not mirror: a number line runs from −10 on the
 * left to 10 on the right, an electron configuration fills its boxes left to
 * right, and a slider's track counts up to the right, in Arabic and Hebrew as
 * much as in English. Widgets built out of fixed pixel offsets, hard-coded
 * arrowheads or a native `<input type="range">` would all come out mirrored —
 * or, worse, half-mirrored — if they inherited `rtl`.
 *
 * The width is the half that is easy to leave off, and it is not optional. A
 * pinned *block* that is as wide as its container aligns its left-to-right
 * contents to the container's left edge — so in a right-to-left document the
 * widget would sit at the far side of the page from the prose and the label it
 * belongs to. Giving the box a width of its own lets the surrounding direction
 * place it while its insides keep running the other way.
 *
 * @param width CSS width for the pinned box. Omit it to shrink-wrap the
 * contents, which is what a widget drawn at its own intrinsic size wants. Pass
 * the authored width when the widget has one: a percentage *inside* a
 * shrink-wrapped box resolves against that box's own content width rather than
 * the column, so `<slider width="50%" />` has to size the pinned box itself
 * and stretch the widget to fill it.
 *
 * Either way the box is capped at the column, so an island can never widen the
 * page — a widget that does not fit overflows its own box instead.
 *
 * For an inline island, or one whose element already shrink-wraps, use a bare
 * `dir="ltr"` instead — see `EditableMathField.jsx` and `matrixInput.tsx`.
 */
export function ltrIslandProps(width: string = "fit-content") {
    return {
        dir: "ltr",
        style: { width, maxWidth: "100%" },
    } as const;
}
