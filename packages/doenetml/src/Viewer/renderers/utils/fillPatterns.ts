/**
 * SVG fill-pattern support for JSXGraph renderers.
 *
 * When a shape's `fillStyle` is not `"solid"`, we inject a `<pattern>` element
 * into the board's SVG `<defs>` and use the resulting `url(#id)` string as the
 * `fillColor` attribute on the JSXGraph element.
 */

type PatternDef = { width: number; height: number; path: string };

/**
 * Maps each non-solid fillStyle value to its SVG pattern definition.
 *
 * Straight patterns (horizontal, vertical, crosshatch) use 8×8 px tiles —
 * perpendicular spacing 8 px.  Diagonal patterns use 12×12 px tiles so their
 * perpendicular spacing (12/√2 ≈ 8.5 px) closely matches the straight
 * patterns and the patterns appear visually similar in density.
 *
 * Keys must be all-lowercase (matching the `toLowerCase: true` normalization
 * applied by the style system).
 */
const FILL_PATTERN_DEFS: Record<string, PatternDef> = {
    horizontal: { width: 8, height: 8, path: "M0,4 L8,4" },
    vertical: { width: 8, height: 8, path: "M4,0 L4,8" },
    diagonal: { width: 12, height: 12, path: "M0,12 L12,0" },
    backdiagonal: { width: 12, height: 12, path: "M0,0 L12,12" },
    crosshatch: { width: 8, height: 8, path: "M0,4 L8,4 M4,0 L4,8" },
    diagonalcrosshatch: {
        width: 12,
        height: 12,
        path: "M0,12 L12,0 M0,0 L12,12",
    },
};

/**
 * Returns a stable pattern element ID for a given board + fill style + color.
 * The color hex is included so different fill colors get different patterns.
 */
function buildPatternId(
    boardId: string,
    fillStyle: string,
    colorHex: string,
): string {
    // Strip '#' and lowercase so IDs stay valid XML identifiers.
    const safeColor = colorHex.replace(/^#/, "").toLowerCase();
    return `doenet-hatch-${boardId}-${fillStyle}-${safeColor}`;
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
    const pattern = document.createElementNS(svgNS, "pattern");
    pattern.setAttribute("id", id);
    pattern.setAttribute("width", String(def.width));
    pattern.setAttribute("height", String(def.height));
    pattern.setAttribute("patternUnits", "userSpaceOnUse");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", def.path);
    path.setAttribute("stroke", fillColor);
    path.setAttribute("stroke-width", "1.5");
    path.setAttribute("fill", "none");

    pattern.appendChild(path);
    defsEl.appendChild(pattern);

    return `url(#${id})`;
}
