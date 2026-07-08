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
 * On highlight (hovering the label, or hovering/dragging the object the
 * label belongs to), the border darkens and the z-index is raised so the
 * label rises above other overlapping labels/objects.
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
 * over/out/drag-start/drag-end listeners to raise/lower z-index, as is done
 * with `attachLabelHoverHighlight` below. As of jsxgraph 1.12.2 (the latest
 * published release at the time this was written), that fix has not yet
 * shipped.
 */
export function computeLabelMaskCssStyle({
    layer,
    backgroundColor,
}: {
    layer: number;
    backgroundColor?: string;
}): { cssStyle: string; highlightCssStyle: string } {
    // Labels are HTML elements overlaid on the JSXGraph board. The base
    // z-index lifts a label just above sibling labels/objects on the same
    // Doenet layer without escaping the board's own stacking context, while
    // the highlight z-index lifts a hovered/dragged label clearly above the
    // others. `+ layer` preserves the relative ordering of Doenet layers in
    // both states. Two non-highlighted labels on the same layer intentionally
    // share a z-index, so their DOM order breaks the tie. The base offset (9)
    // and highlight offset (100) are chosen to leave headroom between the two
    // bands for the small per-layer increments.
    const baseZIndex = 9 + layer;
    const highlightZIndex = 100 + layer;
    // `backgroundColor` commonly comes from a style-definition state variable
    // that defaults to an empty string (not `undefined`) when unset, so
    // treat any falsy value as "no explicit color".
    const background = backgroundColor || "var(--canvas)";

    const cssStyle = `background-color: ${background}; border: 1px solid rgba(128, 128, 128, 0.3); border-radius: 3px; z-index: ${baseZIndex};`;
    const highlightCssStyle = `background-color: ${background}; border: 1px solid rgba(128, 128, 128, 0.8); border-radius: 3px; z-index: ${highlightZIndex};`;

    return { cssStyle, highlightCssStyle };
}

/**
 * Wires up "over"/"out" handlers on `hoverTargetJXG` (e.g. a point, line, or
 * other graphical object) so that hovering the object itself — not just its
 * label — switches the associated label's CSS style to the highlighted
 * (opaque, higher z-index) mask style. This is an interim stand-in for
 * jsxgraph's `dragToTopOfLayer`, which does not yet support labels in any
 * published release (see the note in `computeLabelMaskCssStyle` above).
 *
 * `getLabelJXG` is called lazily on each hover event so callers can pass a
 * ref-based getter for a label that may not exist yet at wiring time.
 *
 * The `"over"`/`"out"` handlers are intentionally not tracked for later
 * removal (unlike the handlers in `removeJXGEventHandlers`): they are wired
 * only inside a renderer's create-JXG path, so they live and die with the
 * freshly created `hoverTargetJXG`. If a label is re-created, a new object
 * (and new handlers) replaces the old one rather than accumulating on it.
 */
export function attachLabelHoverHighlight({
    hoverTargetJXG,
    getLabelJXG,
    cssStyle,
    highlightCssStyle,
    board,
}: {
    hoverTargetJXG: { on: (event: string, fn: () => void) => void };
    getLabelJXG: () => LabelLikeJXG | null | undefined;
    cssStyle: string;
    highlightCssStyle: string;
    board: { updateRenderer: () => void } | null;
}) {
    function applyLabelCssStyle(labelJXG: LabelLikeJXG, style: string) {
        labelJXG.visProp.cssstyle = style;
        labelJXG.needsUpdate = true;
        labelJXG.update();
        board?.updateRenderer();
    }

    hoverTargetJXG.on("over", () => {
        const labelJXG = getLabelJXG();
        if (labelJXG) {
            // Prefer the label's live `highlightcssstyle`, which the renderer's
            // update path (`syncLabelMaskCssStyle`) keeps in sync with the
            // current layer/z-index, so a runtime layer change is reflected on
            // hover. Fall back to the value captured when the handler was wired.
            applyLabelCssStyle(
                labelJXG,
                labelJXG.visProp.highlightcssstyle ?? highlightCssStyle,
            );
        }
    });
    hoverTargetJXG.on("out", () => {
        const labelJXG = getLabelJXG();
        if (labelJXG) {
            applyLabelCssStyle(labelJXG, cssStyle);
        }
    });
}
