/**
 * Builders for the JSXgraph attribute objects that renderers hand to
 * `board.create(...)`.
 *
 * One rule governs every such object, whether it comes from a builder here or
 * is hand-rolled in a renderer: an attribute must appear under a single
 * spelling. JSXgraph lowercases the object with `JXG.keysToLowerCase`, which
 * walks the keys in *reverse* insertion order, so two spellings of one
 * attribute (say `withlabel` from a builder and a later `withLabel: false`)
 * collapse onto the same lowercase key with the **first-written** one winning
 * — the later "override" is silently dropped. Two corollaries:
 *
 * - A renderer overriding a key produced here must repeat it with *exactly*
 *   the spelling used here.
 * - A renderer merging in an all-lowercase object — the spelling that direct
 *   `visProp` writes and `setAttribute` calls use — must re-spell it to match
 *   the keys it is merging into.
 */
import { GraphicalSVs } from "./graphicalSVs";
import {
    resolveLineColor,
    resolveFillColor,
    resolveHandleColor,
    DarkMode,
} from "./styleColors";
import { styleToDash } from "./styleToDash";

/**
 * Common base attributes shared across all JSXgraph-renderable elements:
 * name (label), visibility, draggability/fix, layer, and highlight behavior.
 *
 * Renderers compose this with kind-specific attributes (stroke for lines,
 * fill+stroke for closed shapes, marker properties for points) before passing
 * the merged object to `board.create(...)`.
 */
export function buildBaseAttributes({
    SVs,
    layerOffset,
    fixed,
    fixLocation,
}: {
    SVs: Pick<GraphicalSVs, "labelForGraph" | "hidden" | "layer">;
    layerOffset: number;
    fixed: boolean;
    fixLocation: boolean;
}): Record<string, any> {
    return {
        name: SVs.labelForGraph,
        visible: !SVs.hidden,
        withlabel: SVs.labelForGraph !== "",
        fixed,
        layer: 10 * SVs.layer + layerOffset,
        highlight: !fixLocation,
    };
}

type LineLikeSVs = Pick<
    GraphicalSVs,
    "labelForGraph" | "hidden" | "layer" | "selectedStyle"
>;

/**
 * Standard JSXgraph attribute object for stroke-only "line-family" elements
 * (line, lineSegment, ray, vector, polyline). Caller adds the `label`
 * sub-object via `buildLineFamilyLabelAttributes`.
 */
export function buildLineLikeAttributes({
    SVs,
    layerOffset,
    fixed,
    fixLocation,
    darkMode,
    dashed,
}: {
    SVs: LineLikeSVs;
    layerOffset: number;
    fixed: boolean;
    fixLocation: boolean;
    darkMode: DarkMode;
    /** Per-component override of the dashed line style (e.g. `SVs.dashed`). */
    dashed?: boolean;
}): Record<string, any> {
    const lineColor = resolveLineColor(SVs.selectedStyle, darkMode);
    return {
        ...buildBaseAttributes({ SVs, layerOffset, fixed, fixLocation }),
        strokeColor: lineColor,
        strokeOpacity: SVs.selectedStyle.lineOpacity,
        highlightStrokeColor: lineColor,
        highlightStrokeOpacity: SVs.selectedStyle.lineOpacity * 0.5,
        strokeWidth: SVs.selectedStyle.lineWidth,
        highlightStrokeWidth: SVs.selectedStyle.lineWidth,
        dash: styleToDash(SVs.selectedStyle.lineStyle, dashed),
    };
}

/**
 * Standard JSXgraph attribute object for closed shapes (polygon, circle,
 * region) that have both stroke and fill.
 */
export function buildFilledShapeAttributes({
    SVs,
    layerOffset,
    fixed,
    fixLocation,
    darkMode,
    dashed,
}: {
    SVs: LineLikeSVs;
    layerOffset: number;
    fixed: boolean;
    fixLocation: boolean;
    darkMode: DarkMode;
    dashed?: boolean;
}): Record<string, any> {
    const fillColor = resolveFillColor(SVs.selectedStyle, darkMode);
    return {
        ...buildLineLikeAttributes({
            SVs,
            layerOffset,
            fixed,
            fixLocation,
            darkMode,
            dashed,
        }),
        fillColor,
        fillOpacity: SVs.selectedStyle.fillOpacity,
        highlightFillColor: fillColor,
        highlightFillOpacity: SVs.selectedStyle.fillOpacity * 0.5,
    };
}

/**
 * Attributes for the invisible points a line-family renderer creates as drag
 * handles: a vector's or line segment's endpoints, a polyline's vertices.
 *
 * The handles are derived from the attributes of the element they drag, so that
 * they follow its visibility, and are then made transparent (they show up only
 * as a highlight under the pointer), individually draggable even when the
 * element itself is not, and label-free.
 *
 * Suppressing the label is essential rather than cosmetic: the element's
 * attributes carry `name: SVs.labelForGraph`, so any handle left with
 * `withlabel` on draws its own copy of the label — an untypeset one, since only
 * the element's own label object sets `useMathJax`.
 *
 * Callers that show only some of the handles layer their own `visible` on top.
 */
export function buildDragHandleAttributes({
    elementAttributes,
    layer,
    darkMode,
    showInfoBox,
}: {
    /** Attributes of the element whose points these handles drag. */
    elementAttributes: Record<string, any>;
    /**
     * Resolved JSXgraph layer for the handles, normally
     * `10 * SVs.layer + VERTEX_LAYER_OFFSET`.
     */
    layer: number;
    darkMode: DarkMode;
    /** Show the coordinate info box while dragging (`SVs.showCoordsWhenDragging`). */
    showInfoBox: boolean;
}): Record<string, any> {
    return {
        ...elementAttributes,
        withlabel: false,
        fixed: false,
        highlight: true,
        fillColor: "none",
        strokeColor: "none",
        highlightStrokeColor: "none",
        highlightFillColor: resolveHandleColor(darkMode),
        layer,
        showInfoBox,
    };
}
