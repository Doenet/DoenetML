import { GraphicalSVs } from "./graphicalSVs";
import { resolveLineColor, resolveFillColor, DarkMode } from "./styleColors";
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
    SVs: GraphicalSVs;
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
    SVs: GraphicalSVs;
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
