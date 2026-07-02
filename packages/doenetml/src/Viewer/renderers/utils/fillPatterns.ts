import {
    encodeFillPatternColorToken,
    getFillPatternDef,
    isDeprecatedFillStyleAlias,
    normalizeFillStyle,
    resolveDeprecatedFillStyleAlias,
} from "@doenet/utils";

/**
 * SVG fill-pattern support for JSXGraph renderers.
 *
 * When a shape's `fillStyle` is not `"solid"`, we inject a `<pattern>` element
 * into the board's SVG `<defs>` and use the resulting `url(#id)` string as the
 * `fillColor` attribute on the JSXGraph element.
 */

const warnedUnsupportedFillStyles = new Set<string>();
const warnedDeprecatedFillStyles = new Set<string>();

function warnUnsupportedFillStyle(fillStyle: string) {
    if (warnedUnsupportedFillStyles.has(fillStyle)) {
        return;
    }

    warnedUnsupportedFillStyles.add(fillStyle);
    console.warn(
        `DoenetML: unsupported fillStyle "${fillStyle}" rendered as a solid fill.`,
    );
}

function warnDeprecatedFillStyle(fillStyle: string, resolvedFillStyle: string) {
    if (warnedDeprecatedFillStyles.has(fillStyle)) {
        return;
    }

    warnedDeprecatedFillStyles.add(fillStyle);
    console.warn(
        `DoenetML: deprecated fillStyle "${fillStyle}" rendered using "${resolvedFillStyle}".`,
    );
}

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
    const normalizedFillStyle = normalizeFillStyle(fillStyle);
    const resolvedFillStyle = resolveDeprecatedFillStyleAlias(fillStyle);
    const def = getFillPatternDef(fillStyle);

    if (!def) {
        if (normalizedFillStyle !== "solid") {
            warnUnsupportedFillStyle(fillStyle);
        }
        return fillColor;
    }

    if (isDeprecatedFillStyleAlias(fillStyle)) {
        warnDeprecatedFillStyle(fillStyle, resolvedFillStyle);
    }

    if (!defsEl) {
        return fillColor;
    }

    const id = buildPatternId(boardId, resolvedFillStyle, fillColor);

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
