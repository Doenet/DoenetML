import { encodeFillPatternColorToken } from "@doenet/utils";

/**
 * SVG fill-pattern support for JSXGraph renderers.
 *
 * When a shape's `fillStyle` is not `"solid"`, we inject a `<pattern>` element
 * into the board's SVG `<defs>` and use the resulting `url(#id)` string as the
 * `fillColor` attribute on the JSXGraph element.
 */

type PatternDef = {
    width: number;
    height: number;
    path: string;
    /** When true, path is filled with fillColor and stroke is "none". */
    useFill?: boolean;
    /** Stroke width override (default: 1.5). */
    strokeWidth?: number;
    /** stroke-linecap value (e.g. "round" for dots). */
    strokeLinecap?: string;
};

/**
 * Maps each non-solid fillStyle value to its SVG pattern definition.
 *
 * Straight patterns (horizontal, vertical) use 8×8 px tiles.  Diagonal
 * patterns use 12×12 px tiles with each diagonal split into two half-segments
 * that meet at tile-edge midpoints — this avoids the corner-clipping artifact
 * that appears when a single segment endpoint sits at a tile corner.
 *
 * Dots and diamonds use hexagonal grids via a rectangular tile of width W and
 * height H ≈ W√3.  Dots place two complete dots fully inside the tile (rather
 * than corner-assembly) so every dot renders at the same size: dot 1 at
 * (W/4, H/4) and dot 2 at (3W/4, 3H/4), which are offset by (W/2, H/2) —
 * the correct stagger for a hex grid.  Diamonds use the same center +
 * corner-assembly layout with a non-square rhombus (horizontal half-extent 3,
 * vertical half-extent 5 ≈ 3√3) so the visual gap is approximately equal in
 * all six hex directions (~2 px).
 *
 * Keys must be all-lowercase (matching the `toLowerCase: true` normalization
 * applied by the style system).
 */
const FILL_PATTERN_DEFS: Record<string, PatternDef> = {
    horizontal: { width: 8, height: 8, path: "M0,4 L8,4" },
    vertical: { width: 8, height: 8, path: "M4,0 L4,8" },
    // Split into two half-segments so endpoints land at tile-edge midpoints,
    // not corners, which prevents the corner anti-aliasing gap on tiling.
    // Round linecap + overflow="visible" on the pattern element let each
    // endpoint's cap bleed slightly across the tile boundary so adjacent
    // tiles' strokes meet without a sub-pixel seam.
    diagonal: {
        width: 12,
        height: 12,
        path: "M0,6 L6,0 M6,12 L12,6",
        strokeLinecap: "round",
    },
    backdiagonal: {
        width: 12,
        height: 12,
        path: "M0,6 L6,12 M6,0 L12,6",
        strokeLinecap: "round",
    },
    // Hex grid: tile 18×31 (≈ 18 × 18√3).  Two fully interior dots so every
    // dot is rendered the same size (no partial-circle corner assembly).
    dots: {
        width: 18,
        height: 31,
        path: "M4.5,7.75 L4.5,7.75 M13.5,23.25 L13.5,23.25",
        strokeWidth: 4,
        strokeLinecap: "round",
    },
    // Hex grid: tile 12×21 (≈ 12 × 12√3).  Center rhombus + four corner
    // quarter-triangles that assemble into a second rhombus when four tiles
    // meet.  Horizontal half-extent 3, vertical half-extent 5 (≈ 3√3).
    // Tile width = 4a = 12 so the gap between diamonds (6 px) approximately
    // equals the diamond width (6 px).
    diamonds: {
        width: 12,
        height: 21,
        path: "M6,5.5 L9,10.5 L6,15.5 L3,10.5 Z  M0,0 L3,0 L0,5 Z  M12,0 L9,0 L12,5 Z  M0,21 L3,21 L0,16 Z  M12,21 L9,21 L12,16 Z",
        useFill: true,
    },
};

/**
 * Returns a stable pattern element ID for a given board + fill style + color.
 * The encoded color token is included so different fill colors get different
 * patterns, even when the authored color is a CSS name or functional notation.
 */
function buildPatternId(
    boardId: string,
    fillStyle: string,
    fillColor: string,
): string {
    return `doenet-hatch-${boardId}-${fillStyle}-${encodeFillPatternColorToken(fillColor)}`;
}

/**
 * Ensures an SVG `<pattern>` element for the given style + color exists in
 * `defsEl`, then returns the `url(#…)` CSS reference string.
 *
 * If `fillStyle` is `"solid"` or unrecognised, returns `fillColor` unchanged
 * so callers can always use the return value as the JSXGraph `fillColor`.
 */
export function getOrInjectPattern(
    defsEl: SVGDefsElement | null,
    boardId: string,
    fillStyle: string,
    fillColor: string,
): string {
    const def = FILL_PATTERN_DEFS[fillStyle];
    if (!def || !defsEl) {
        // Solid fill or no defs available — return the plain color.
        return fillColor;
    }

    const id = buildPatternId(boardId, fillStyle, fillColor);

    // Avoid injecting the same pattern twice (e.g. after state updates).
    if (defsEl.ownerDocument?.getElementById(id)) {
        return `url(#${id})`;
    }

    const svgNS = "http://www.w3.org/2000/svg";
    const ownerDocument = defsEl.ownerDocument ?? document;
    const pattern = ownerDocument.createElementNS(svgNS, "pattern");
    pattern.setAttribute("id", id);
    pattern.setAttribute("width", String(def.width));
    pattern.setAttribute("height", String(def.height));
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    // Allow strokes to bleed across the tile boundary so adjacent tiles'
    // endpoints meet without a sub-pixel anti-aliasing seam.
    pattern.setAttribute("overflow", "visible");

    const path = ownerDocument.createElementNS(svgNS, "path");
    path.setAttribute("d", def.path);
    if (def.useFill) {
        path.setAttribute("fill", fillColor);
        path.setAttribute("stroke", "none");
    } else {
        path.setAttribute("stroke", fillColor);
        path.setAttribute("stroke-width", String(def.strokeWidth ?? 1.5));
        path.setAttribute("fill", "none");
        if (def.strokeLinecap) {
            path.setAttribute("stroke-linecap", def.strokeLinecap);
        }
    }

    pattern.appendChild(path);
    defsEl.appendChild(pattern);

    return `url(#${id})`;
}

/**
 * Resolves fill props for patterned SVG fills. When a non-solid pattern is
 * active, `fillPatternOpacity` is used (defaulting to 1) so the authored
 * `fillOpacity` (which is low by default for solid fills) does not apply.
 */
export function getPatternFillAttributes({
    defsEl,
    boardId,
    fillStyle,
    fillColor,
    fillOpacity,
    fillPatternOpacity = 1,
    highlightFillOpacity = fillOpacity * 0.5,
}: {
    defsEl: SVGDefsElement | null;
    boardId: string;
    fillStyle: string;
    fillColor: string;
    fillOpacity: number;
    fillPatternOpacity?: number;
    highlightFillOpacity?: number;
}): {
    fillColor: string;
    fillOpacity: number;
    highlightFillColor: string;
    highlightFillOpacity: number;
} {
    const resolvedFillColor = getOrInjectPattern(
        defsEl,
        boardId,
        fillStyle,
        fillColor,
    );
    const usesPatternFill = resolvedFillColor !== fillColor;

    return {
        fillColor: resolvedFillColor,
        fillOpacity: usesPatternFill ? fillPatternOpacity : fillOpacity,
        highlightFillColor: resolvedFillColor,
        highlightFillOpacity: usesPatternFill
            ? fillPatternOpacity * 0.5
            : highlightFillOpacity,
    };
}
