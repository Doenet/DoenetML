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
 * The `width` is the half that is easy to leave off, and it is not optional. A
 * pinned *block* still fills its container, and its left-to-right contents then
 * align to the container's left edge — so in a right-to-left document the
 * widget would sit at the far side of the page from the prose and the label it
 * belongs to. Shrink-to-fit lets the surrounding direction place the box while
 * its insides keep running the other way.
 *
 * For an inline island, or one whose element already shrink-wraps, use a bare
 * `dir="ltr"` instead — see `EditableMathField.jsx` and `matrixInput.tsx`.
 */
export const LTR_ISLAND_PROPS = {
    dir: "ltr",
    style: { width: "fit-content" },
} as const;
