/**
 * Minimal structural shape needed from a JSXGraph label to update its CSS
 * mask style. Defined loosely (rather than importing the full `JXGText`
 * type) since callers may get a label off of a `JXGLine`/`JXGPoint`/etc.
 * whose `.label` property is typed more loosely than a standalone text
 * element.
 */
export interface LabelLikeJXG {
    visProp: Record<string, any>;
    needsUpdate: boolean;
    update: () => void;
}

/**
 * Computes the CSS style strings used to give a JSXGraph label an opaque
 * "mask" background so that it stays legible when it overlaps an axis, grid
 * line, or another graphical object.
 *
 * See Doenet/DoenetML issues #1077 and #362.
 *
 * By default, the mask background is `var(--canvas)`, which already matches
 * the graph's background and is dark-mode aware. If an explicit
 * `backgroundColor` is supplied (e.g., from a style definition's
 * `selectedStyle.backgroundColor`), that color is used instead so an
 * explicit author choice is respected.
 *
 * The base style intentionally has NO border: with a `var(--canvas)`
 * background that already matches the graph, a label looks identical whether
 * or not masking is enabled (until it overlaps something, where the opaque
 * background keeps it legible). The label gains a visible border (and a
 * raised z-index so it rises above other overlapping labels/objects) only
 * while the pointer is over the *draggable* object it labels — a hover cue
 * that the object can be grabbed. For an object-attached label that styling
 * is applied by `attachLabelHoverHighlight` below, which toggles the label
 * between `cssStyle` and `highlightCssStyle` on the object's over/out events.
 * A standalone `<label>`, which the user drags directly, instead gets
 * `highlightCssStyle` from JSXGraph's own native hover highlight.
 *
 * NOTE: jsxgraph's own `highlightStrokeOpacity` for text elements defaults
 * to a non-1 value, which combines with any alpha in the background color
 * and can make a label look transparent while highlighted
 * (https://github.com/jsxgraph/jsxgraph/issues/777). Callers must
 * additionally set `highlightStrokeOpacity: 1` on the label to avoid this.
 *
 * Also note: once jsxgraph publishes a release that includes
 * `dragToTopOfLayer` support for labels (commit `2a498682884c`,
 * https://github.com/jsxgraph/jsxgraph/issues/778), we should switch to
 * `dragToTopOfLayer: true` on labels instead of manually wiring
 * over/out listeners to raise/lower z-index, as is done with
 * `attachLabelHoverHighlight` below. As of jsxgraph 1.12.2 (the latest
 * published release at the time this was written), that fix has not yet
 * shipped.
 *
 * When `masked` is `false` (the author set `maskLabel="false"` on the
 * component), the mask is disabled and this restores the pre-mask behavior:
 * a transparent background (or the explicit style-definition
 * `backgroundColor`, if one is set), no border, no z-index bump, and a
 * highlight style identical to the base style so hovering leaves the label
 * unchanged.
 */
export function computeLabelMaskCssStyle({
    layer,
    backgroundColor,
    masked = true,
}: {
    layer: number;
    backgroundColor?: string;
    masked?: boolean;
}): { cssStyle: string; highlightCssStyle: string } {
    if (!masked) {
        const background = backgroundColor || "transparent";
        const cssStyle = `background-color: ${background};`;
        return { cssStyle, highlightCssStyle: cssStyle };
    }

    // Labels are HTML elements overlaid on the JSXGraph board. The base
    // z-index lifts a label just above sibling labels/objects on the same
    // Doenet layer without escaping the board's own stacking context, while
    // the highlight z-index lifts a hovered label clearly above the others.
    // `+ layer` preserves the relative ordering of Doenet layers in both
    // states. Two non-highlighted labels on the same layer intentionally
    // share a z-index, so their DOM order breaks the tie. The base offset (9)
    // and highlight offset (100) are chosen to leave headroom between the two
    // bands for the small per-layer increments.
    const baseZIndex = 9 + layer;
    const highlightZIndex = 100 + layer;
    // `backgroundColor` commonly comes from a style-definition state variable
    // that defaults to an empty string (not `undefined`) when unset, so
    // treat any falsy value as "no explicit color".
    const background = backgroundColor || "var(--canvas)";

    // JSXGraph's `updateTextStyle` applies a label's css string *additively*:
    // it sets each declared property on the DOM node but never removes a
    // property the previous style declared. So the base style must explicitly
    // reset `border`/`border-radius` — omitting them would leave the hover
    // border stuck on the element after the pointer leaves.
    const cssStyle = `background-color: ${background}; border: none; border-radius: 0; z-index: ${baseZIndex};`;
    const highlightCssStyle = `background-color: ${background}; border: 1px solid rgba(128, 128, 128, 0.8); border-radius: 3px; z-index: ${highlightZIndex};`;

    return { cssStyle, highlightCssStyle };
}

/**
 * Wires up `over`/`out` handlers so that a label gains its bordered "mask"
 * highlight while the pointer is over the associated *draggable* object and
 * loses it when the pointer leaves. This is an interim stand-in for jsxgraph's
 * `dragToTopOfLayer`, which does not yet support labels in any published
 * release (see the note in `computeLabelMaskCssStyle` above).
 *
 * The highlight is gated on `hoverTargetJXG.isDraggable`: renderers whose
 * objects can be dragged set it from the component's `fixed`/`fixLocation`
 * state, while object types that are never draggable (curves, regions, angles)
 * keep JSXGraph's own `false` default. Either way the border acts as a "you can
 * grab this" cue and never appears on a fixed or otherwise non-draggable object.
 *
 * Only the *object's* own `over`/`out` drive the border — hovering the label
 * itself does nothing. An object-attached label can only be moved by dragging
 * the object (not the label), so lighting the border on label hover would
 * wrongly imply the label is draggable. (A standalone `<label>`, which the
 * user does drag directly, gets its own hover border via JSXGraph's native
 * highlight instead of this helper.) The base css explicitly resets the border
 * (see `computeLabelMaskCssStyle`), so an `out` reliably clears it.
 *
 * `getLabelJXG` is called lazily on each event so callers can pass a
 * ref-based getter for a label that may not exist yet at wiring time.
 *
 * The handlers are intentionally not tracked for later removal (unlike the
 * handlers in `removeJXGEventHandlers`): they are wired only inside a
 * renderer's create-JXG path, so they live and die with the freshly created
 * `hoverTargetJXG`. If a label is re-created, a new object (and new handlers)
 * replaces the old one rather than accumulating on it.
 */
export function attachLabelHoverHighlight({
    hoverTargetJXG,
    getLabelJXG,
    cssStyle,
    highlightCssStyle,
    board,
}: {
    hoverTargetJXG: {
        on: (event: string, fn: () => void) => void;
        isDraggable?: boolean;
    };
    getLabelJXG: () => LabelLikeJXG | null | undefined;
    cssStyle: string;
    highlightCssStyle: string;
    board: { updateRenderer: () => void } | null;
}) {
    function applyHover(hovered: boolean) {
        const labelJXG = getLabelJXG();
        if (!labelJXG) {
            return;
        }
        // Only draggable objects get the hover border. `isDraggable` is `false`
        // when the component is fixed / has a fixed location; treat any other
        // value (true, or an unset default) as draggable.
        const draggable = hoverTargetJXG.isDraggable !== false;
        const show = hovered && draggable;
        // Record the desired state so a mid-hover re-render
        // (`syncLabelMaskCssStyle`) preserves it instead of clobbering the
        // border back to the base style.
        labelJXG.visProp.labelMaskHovered = show;
        // Prefer the label's live `highlightcssstyle`, which the update path
        // keeps in sync with the current layer/z-index, so a runtime layer
        // change is reflected on hover. Fall back to the captured value.
        const style = show
            ? (labelJXG.visProp.highlightcssstyle ?? highlightCssStyle)
            : cssStyle;
        if (labelJXG.visProp.cssstyle === style) {
            return;
        }
        labelJXG.visProp.cssstyle = style;
        labelJXG.needsUpdate = true;
        labelJXG.update();
        board?.updateRenderer();
    }

    hoverTargetJXG.on("over", () => applyHover(true));
    hoverTargetJXG.on("out", () => applyHover(false));
}
