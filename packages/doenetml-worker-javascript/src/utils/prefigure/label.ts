import { escapeXml, pushWarning } from "./common";
import type {
    Bounds,
    Dimensions,
    GraphBounds,
    GraphDimensions,
    Point,
    PrefigureStateValues,
    Warning,
} from "./types";

/**
 * Label conversion strategy summary
 *
 * 1) Point labels use direct Doenet `labelPosition` -> PreFigure `alignment` mapping.
 * 2) Line-family labels (`line`, `lineSegment`, `ray`) compute two outputs:
 *    - `label-location`: where along the oriented segment to anchor the label
 *    - `alignment`: which side of the oriented segment to place text on
 * 3) Callers can override the location written to `label-location` and the
 *    location used when choosing `alignment` for clipped/remapped geometry.
 */

const prefigurePointAlignmentByLabelPosition: Record<string, string> = {
    upperright: "ne",
    upperleft: "nw",
    lowerright: "se",
    lowerleft: "sw",
    top: "n",
    bottom: "s",
    left: "w",
    right: "e",
};

/**
 * Normalizes a Doenet attribute string for case-insensitive, punctuation-
 * tolerant lookup in position maps and candidate sets.
 *
 * For example `"upperRight"`, `"upper-right"`, and `"UPPER_RIGHT"` all
 * normalize to `"upperright"`.
 */
function normalizeKey(value: unknown): string {
    return String(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
}

/**
 * Line-family label tuning constants.
 *
 * These are intentionally centralized to make tuning explicit and auditable.
 * Adjust with corresponding geometry tests in
 * `src/test/prefigure/graph-prefigure-geometry.test.ts`.
 *
 * @property endpointInsetRatio Fractional inset from each endpoint for
 * endpoint-side label anchors.
 * @property edgePaddingRatio Reserved inset to reduce visible clipping at bounds.
 * @property endpointInsetPixels Endpoint-anchor inset in screen pixels.
 */
export const lineLabelTuning = Object.freeze({
    endpointInsetRatio: 0.05,
    edgePaddingRatio: 0.02,
    endpointInsetPixels: 12,
});

// Fractional inset from each endpoint for endpoint-side label anchors.
// ep1-side labels anchor at LINE_LABEL_ENDPOINT_INSET_RATIO; ep2-side at
// 1 - LINE_LABEL_ENDPOINT_INSET_RATIO.
const LINE_LABEL_ENDPOINT_INSET_RATIO = lineLabelTuning.endpointInsetRatio;
const LINE_LABEL_EDGE_PADDING_RATIO = lineLabelTuning.edgePaddingRatio;
const LINE_LABEL_ENDPOINT_INSET_PIXELS = lineLabelTuning.endpointInsetPixels;

// All labelPosition values recognized by the line-family converter.
const KNOWN_LINE_POSITIONS = new Set<string>([
    "left",
    "upperleft",
    "lowerleft",
    "right",
    "upperright",
    "lowerright",
    "center",
    "top",
    "bottom",
]);

/**
 * Formats label-location numbers with stable precision for snapshot-friendly XML.
 */
function formatLocation(value: number): string {
    const rounded = Number(value.toFixed(6));
    return `${rounded}`;
}

/**
 * Clamps a numeric value or ratio into the inclusive unit interval.
 */
function clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
}

/**
 * Maps a line-family `labelPosition` to its preferred unit direction vector.
 *
 * The returned vector is in graph coordinates. Returns null for `center` and
 * any unrecognized position.
 *
 * Example: `getPreferredDirectionForLabelPosition("right")` returns `[1, 0]`.
 */
function getPreferredDirectionForLabelPosition(
    labelPosition: unknown,
): Point | null {
    switch (normalizeKey(labelPosition ?? "")) {
        case "right":
            return [1, 0];
        case "left":
            return [-1, 0];
        case "top":
            return [0, 1];
        case "bottom":
            return [0, -1];
        case "upperright":
            return [1 / Math.SQRT2, 1 / Math.SQRT2];
        case "upperleft":
            return [-1 / Math.SQRT2, 1 / Math.SQRT2];
        case "lowerright":
            return [1 / Math.SQRT2, -1 / Math.SQRT2];
        case "lowerleft":
            return [-1 / Math.SQRT2, -1 / Math.SQRT2];
        default:
            return null;
    }
}

/**
 * Computes endpoint bias from a preferred direction and segment endpoints.
 *
 * Projects the unit segment tangent onto `preferredDirection`, scales by
 * `Math.SQRT2`, and clamps to [-1, 1]. This creates flat saturated regions at
 * ±1 for the outer 90-degree sectors and a smooth transition between -1 and 1
 * across the middle sectors. Positive bias means ep2 side; negative means ep1
 * side; zero means center.
 *
 * Examples:
 * - Aligned with preferred direction:
 *   `biasFromPreferredDirection([1, 0], [0, 0], [4, 0]) // 1`
 * - Opposite preferred direction:
 *   `biasFromPreferredDirection([1, 0], [4, 0], [0, 0]) // -1`
 * - Perpendicular to preferred direction:
 *   `biasFromPreferredDirection([1, 0], [0, 0], [0, 4]) // 0`
 */
function biasFromPreferredDirection(
    preferredDirection: Point,
    ep1: Point,
    ep2: Point,
): number {
    const dx = ep2[0] - ep1[0];
    const dy = ep2[1] - ep1[1];
    const segmentLength = Math.hypot(dx, dy);
    if (!(segmentLength > 0)) {
        return 0;
    }
    const tx = dx / segmentLength;
    const ty = dy / segmentLength;
    const agreement = tx * preferredDirection[0] + ty * preferredDirection[1];
    // Use k = sqrt(2) so the outer 90-degree sectors saturate at ±1.
    return Math.max(-1, Math.min(1, Math.SQRT2 * agreement));
}

/**
 * Returns a continuous side preference in [-1, 1] for line-family
 * `labelPosition`.
 *
 * For `center` and unrecognized positions, returns null to indicate no bias.
 * For zero-length segments, we return 0.
 *
 * Each non-center position has a preferred direction (e.g. `right` -> `[1, 0]`).
 * We project the unit segment tangent onto the preferred direction;
 * this projection will continuously vary from -1 to 1 as the segment rotates.
 *
 * We next multiply the projection by sqrt(2) and clamp to [-1,1]
 * so that the outer 90-degree sectors saturate at ±1.
 *
 * The result is the bias that will be later mapped to label position along the segment.
 *
 * Examples:
 * - Same direction request, endpoints reversed:
 *   `chooseEndpointBiasForLabelPosition("right", [0, 0], [4, 0]) // 1`
 *   `chooseEndpointBiasForLabelPosition("right", [4, 0], [0, 0]) // -1`
 * - Same segment, different requested side:
 *   `chooseEndpointBiasForLabelPosition("top", [0, 0], [4, 0]) // 0`
 * - Same request, segment angle changed:
 *   `chooseEndpointBiasForLabelPosition("right", [0, 0], [0, 4]) // 0`
 */
function chooseEndpointBiasForLabelPosition(
    labelPosition: unknown,
    ep1: Point,
    ep2: Point,
): number | null {
    const pos = normalizeKey(labelPosition ?? "");
    if (!KNOWN_LINE_POSITIONS.has(pos) || pos === "center") {
        return null;
    }
    const preferredDirection = getPreferredDirectionForLabelPosition(pos);
    if (!preferredDirection) {
        return null;
    }
    return biasFromPreferredDirection(preferredDirection, ep1, ep2);
}

/**
 * Interpolates the anchor point used for line-label overflow evaluation.
 */
function lineLabelAnchorPoint({
    ep1,
    ep2,
    location,
}: {
    ep1: Point;
    ep2: Point;
    location: number;
}): Point {
    return [
        ep1[0] + (ep2[0] - ep1[0]) * location,
        ep1[1] + (ep2[1] - ep1[1]) * location,
    ];
}

/**
 * Validates `graphBounds` and returns `{xMin, yMin, xMax, yMax}`.
 *
 * Returns null unless `graphBounds` is a 4-element numeric array with
 * strictly increasing x/y extents.
 */
function getGraphBounds(graphBounds: unknown): Bounds | null {
    const bounds = Array.isArray(graphBounds) ? graphBounds : null;
    if (!bounds || bounds.length !== 4) {
        return null;
    }

    const [xMin, yMin, xMax, yMax] = bounds;
    if (
        !Number.isFinite(xMin) ||
        !Number.isFinite(yMin) ||
        !Number.isFinite(xMax) ||
        !Number.isFinite(yMax) ||
        !(xMax > xMin) ||
        !(yMax > yMin)
    ) {
        return null;
    }

    return { xMin, yMin, xMax, yMax };
}

/**
 * Validates `graphDimensions` and returns `{width, height}`.
 *
 * Returns null unless `graphDimensions` is a 2-element numeric array with
 * strictly positive width/height.
 */
function getGraphDimensions(graphDimensions: unknown): Dimensions | null {
    const dims = Array.isArray(graphDimensions) ? graphDimensions : null;
    if (!dims || dims.length !== 2) {
        return null;
    }

    const [width, height] = dims;
    if (
        !Number.isFinite(width) ||
        !Number.isFinite(height) ||
        !(width > 0) ||
        !(height > 0)
    ) {
        return null;
    }

    return { width, height };
}

/**
 * Returns the unit tangent of the oriented line-family geometry.
 */
function getLineTangent(ep1: Point, ep2: Point): Point | null {
    const dx = ep2[0] - ep1[0];
    const dy = ep2[1] - ep1[1];
    const length = Math.hypot(dx, dy);
    if (!(length > 0)) {
        return null;
    }
    return [dx / length, dy / length];
}

/**
 * Estimates label width/height for overflow comparison.
 *
 * This is intentionally heuristic rather than typographically exact; it exists
 * only to approximate how much each candidate alignment would overflow near
 * graph boundaries.
 */
function estimateLabelMetrics(
    labelText: unknown,
    labelHasLatex: unknown,
): { width: number; height: number } {
    const raw = typeof labelText === "string" ? labelText.trim() : "";
    const visibleLength = raw.length;

    // Heuristic estimate in abstract units used only for edge-risk comparison.
    // We intentionally overestimate math-heavy labels so we flip away from edges
    // before the rendered text would be clipped.
    let effectiveLength = visibleLength;
    if (labelHasLatex) {
        const latexRuns = (raw.match(/\\\(|\\\)|<m>|<\/m>/g) ?? []).length;
        effectiveLength += latexRuns * 3;
    }

    return {
        width: Math.min(6, Math.max(0.9, effectiveLength * 0.27)),
        height: 1,
    };
}

/**
 * Returns ordered alignment candidates for a line-family label.
 *
 * `labelPosition` is the Doenet label position string (normalized internally).
 * `location` is the label-location in [0, 1]; values above 0.5 correspond to
 * the ep2 side, below 0.5 to the ep1 side. The `h` component of diagonal
 * candidates (`ne`/`nw`/`se`/`sw`) is derived from this to keep the label
 * extending back along the visible segment rather than off the edge.
 *
 * `preferNorth` determines whether the graph-direction intent lies on the
 * local north (`n`) or south (`s`) side of the segment.
 * For `center`, we still prefer centered `n`/`s` placements first, but also
 * include diagonal fallbacks so labels can stay visible when the centered
 * cardinals would clip at the graph boundary.
 * Candidate order matters: earlier entries are preferred, later entries are
 * only considered when overflow forces a fallback.
 */
function getLineAlignmentCandidates(
    labelPosition: unknown,
    location: number,
    preferNorth = true,
): string[] | null {
    const pos = normalizeKey(labelPosition ?? "");
    if (!pos || !KNOWN_LINE_POSITIONS.has(pos)) {
        return null;
    }

    const h = location >= 0.5 ? "w" : "e";
    const oppositeH = h === "w" ? "e" : "w";
    const primary = preferNorth ? "n" : "s";
    const secondary = preferNorth ? "s" : "n";

    if (pos === "center") {
        return ["n", "s", `n${h}`, `s${h}`, `n${oppositeH}`, `s${oppositeH}`];
    }

    return [
        primary,
        `${primary}${h}`,
        secondary,
        `${secondary}${h}`,
        `${primary}${oppositeH}`,
        `${secondary}${oppositeH}`,
    ];
}

/**
 * Returns the axis-aligned bounding box of a label placement relative to its
 * anchor point, expressed in graph coordinates.
 *
 * `tangent` is the unit vector along ep1 -> ep2; its left-normal defines the
 * "north" direction in the line's local frame.
 * `alignment` is a PreFigure cardinal token (`n`, `nw`, `se`, etc.) that
 * determines which quadrant of the label box the anchor falls in.
 * `metrics` carries estimated `width` and `height` in graph coordinate units.
 *
 * The returned `{minX, maxX, minY, maxY}` are graph-axis-aligned bounds of the
 * rotated label box, suitable for overflow tests against `graphBounds`.
 */
function getAlignmentExtents(
    tangent: Point,
    alignment: string,
    metrics: { width: number; height: number },
): { minX: number; maxX: number; minY: number; maxY: number } {
    const normal = [-tangent[1], tangent[0]];
    const width = metrics?.width ?? 1.2;
    const height = metrics?.height ?? 1;

    let minT = -width / 2;
    let maxT = width / 2;
    let minN = -height / 2;
    let maxN = height / 2;

    switch (alignment) {
        case "n":
            minN = 0;
            maxN = height;
            break;
        case "s":
            minN = -height;
            maxN = 0;
            break;
        case "e":
            minT = 0;
            maxT = width;
            break;
        case "w":
            minT = -width;
            maxT = 0;
            break;
        case "ne":
            minT = 0;
            maxT = width;
            minN = 0;
            maxN = height;
            break;
        case "nw":
            minT = -width;
            maxT = 0;
            minN = 0;
            maxN = height;
            break;
        case "se":
            minT = 0;
            maxT = width;
            minN = -height;
            maxN = 0;
            break;
        case "sw":
            minT = -width;
            maxT = 0;
            minN = -height;
            maxN = 0;
            break;
        default:
            break;
    }

    const points = [
        [
            tangent[0] * minT + normal[0] * minN,
            tangent[1] * minT + normal[1] * minN,
        ],
        [
            tangent[0] * minT + normal[0] * maxN,
            tangent[1] * minT + normal[1] * maxN,
        ],
        [
            tangent[0] * maxT + normal[0] * minN,
            tangent[1] * maxT + normal[1] * minN,
        ],
        [
            tangent[0] * maxT + normal[0] * maxN,
            tangent[1] * maxT + normal[1] * maxN,
        ],
    ];

    return {
        minX: Math.min(...points.map((point) => point[0])),
        maxX: Math.max(...points.map((point) => point[0])),
        minY: Math.min(...points.map((point) => point[1])),
        maxY: Math.max(...points.map((point) => point[1])),
    };
}

/**
 * Core overflow scorer for a single alignment candidate at a known anchor.
 *
 * Given the label anchor in graph coordinates, the local tangent frame, the
 * candidate alignment token, the graph bounds, and the estimated label size,
 * returns the total overflow amount after applying graph-edge padding.
 * A zero overflow amount means the candidate stays within the safe inset box.
 *
 * This is the shared implementation used by both line-family and point label
 * overflow evaluation.
 */
function computeAlignmentOverflowAt({
    anchor,
    tangent,
    alignment,
    graphBounds,
    labelMetrics,
}: {
    anchor: Point;
    tangent: Point;
    alignment: string;
    graphBounds: GraphBounds | undefined;
    labelMetrics: { width: number; height: number };
}): { overflowAmount: number } {
    const bounds = getGraphBounds(graphBounds);
    if (!bounds) {
        return { overflowAmount: 0 };
    }

    const { xMin, yMin, xMax, yMax } = bounds;
    const width = xMax - xMin;
    const height = yMax - yMin;
    const edgePaddingX = width * LINE_LABEL_EDGE_PADDING_RATIO;
    const edgePaddingY = height * LINE_LABEL_EDGE_PADDING_RATIO;

    const extents = getAlignmentExtents(tangent, alignment, labelMetrics);

    const projectedLeft = anchor[0] + extents.minX;
    const projectedRight = anchor[0] + extents.maxX;
    const projectedBottom = anchor[1] + extents.minY;
    const projectedTop = anchor[1] + extents.maxY;

    const overflowLeft = Math.max(0, xMin + edgePaddingX - projectedLeft);
    const overflowRight = Math.max(0, projectedRight - (xMax - edgePaddingX));
    const overflowBottom = Math.max(0, yMin + edgePaddingY - projectedBottom);
    const overflowTop = Math.max(0, projectedTop - (yMax - edgePaddingY));

    const overflowAmount =
        overflowLeft + overflowRight + overflowBottom + overflowTop;

    return { overflowAmount };
}

/**
 * Evaluates one candidate alignment against graph bounds for a line-family label.
 *
 * Returns the predicted overflow amount after applying graph-edge padding.
 * A zero overflow amount means the candidate stays within the safe inset box.
 */
function evaluateLineAlignmentOverflow({
    alignment,
    ep1,
    ep2,
    location,
    graphBounds,
    labelMetrics,
}: {
    alignment: string;
    ep1: Point;
    ep2: Point;
    location: number;
    graphBounds: GraphBounds | undefined;
    labelMetrics: { width: number; height: number };
}): { overflowAmount: number } {
    const tangent = getLineTangent(ep1, ep2);
    if (!tangent) {
        return { overflowAmount: 0 };
    }

    const anchor = lineLabelAnchorPoint({ ep1, ep2, location });

    return computeAlignmentOverflowAt({
        anchor,
        tangent,
        alignment,
        graphBounds,
        labelMetrics,
    });
}

/**
 * Selects the best alignment for the requested line-family label position.
 *
 * Queries `getLineAlignmentCandidates` for an ordered preference list, then
 * evaluates each candidate via `evaluateLineAlignmentOverflow`. The first
 * non-overflow candidate wins immediately. If all candidates overflow, the
 * candidate with minimum overflow wins.
 *
 * `location` is the label-location in [0, 1] used for overflow evaluation; it
 * may differ from the value written to the output `label-location` attribute
 * when callers remap clipped-segment anchors (see
 * `lineLabelAlignmentLocationOverride` in `getLabelForLine`).
 * Returns `null` when `labelPosition` is unrecognized or absent.
 */
function getLineLabelAlignment({
    labelPosition,
    location,
    ep1,
    ep2,
    graphBounds,
    labelText,
    labelHasLatex,
}: {
    labelPosition: unknown;
    location: number;
    ep1: Point;
    ep2: Point;
    graphBounds: GraphBounds | undefined;
    labelText: unknown;
    labelHasLatex: unknown;
}): string | null {
    const tangent = getLineTangent(ep1, ep2);
    const preferredDirection =
        getPreferredDirectionForLabelPosition(labelPosition);
    const preferNorth =
        preferredDirection && tangent
            ? -tangent[1] * preferredDirection[0] +
                  tangent[0] * preferredDirection[1] >=
              0
            : true;

    const candidates = getLineAlignmentCandidates(
        labelPosition,
        location,
        preferNorth,
    );
    if (!candidates?.length) {
        return null;
    }

    const labelMetrics = estimateLabelMetrics(labelText, labelHasLatex);

    let bestAlignment = candidates[0];
    let minimumOverflow = Number.POSITIVE_INFINITY;

    for (const candidate of candidates) {
        const result = evaluateLineAlignmentOverflow({
            alignment: candidate,
            ep1,
            ep2,
            location,
            graphBounds,
            labelMetrics,
        });
        if (result.overflowAmount === 0) {
            return candidate;
        }
        if (result.overflowAmount < minimumOverflow) {
            bestAlignment = candidate;
            minimumOverflow = result.overflowAmount;
        }
    }

    return bestAlignment;
}

/**
 * Reorders two raw [x, y] points so the first is the leftward point.
 * For vertical lines, the lower point comes first.
 */
export function orientEndpointsForLineLabel(
    p1Raw: Point,
    p2Raw: Point,
): [Point, Point] {
    if (p1Raw[0] > p2Raw[0] || (p1Raw[0] === p2Raw[0] && p1Raw[1] > p2Raw[1])) {
        return [p2Raw, p1Raw];
    }
    return [p1Raw, p2Raw];
}

/**
 * Converts a Doenet label value into PreFigure-compatible XML label content.
 *
 * If `labelHasLatex` is true and balanced `\(...\)` delimiters are present,
 * those delimiters are rewritten to `<m>...</m>` while preserving surrounding
 * plain text. Otherwise the full label is wrapped in a single `<m>` block.
 */
export function labelMarkup({
    label,
    labelHasLatex,
}: {
    label: unknown;
    labelHasLatex: unknown;
}): string | null {
    if (typeof label !== "string") {
        return null;
    }

    const text = label.trim();
    if (!text) {
        return null;
    }

    if (labelHasLatex) {
        const openDelimiters = (text.match(/\\\(/g) ?? []).length;
        const closeDelimiters = (text.match(/\\\)/g) ?? []).length;

        if (openDelimiters > 0 && openDelimiters === closeDelimiters) {
            return escapeXml(text)
                .replace(/\\\(/g, "<m>")
                .replace(/\\\)/g, "</m>");
        }

        return `<m>${escapeXml(text)}</m>`;
    }

    return escapeXml(text);
}

/**
 * Ordered alignment fallback candidates for each PreFigure alignment token.
 *
 * Each key is the primary (preferred) alignment. The value is all 8 tokens
 * sorted by ascending angular distance from the primary, with ties broken by
 * preferring adjacent cardinals before adjacent diagonals at the same distance.
 */
const POINT_ALIGNMENT_CANDIDATES: Record<string, string[]> = {
    n:  ["n",  "nw", "ne", "w",  "e",  "sw", "se", "s" ],
    ne: ["ne", "n",  "e",  "nw", "se", "w",  "s",  "sw"],
    e:  ["e",  "ne", "se", "n",  "s",  "nw", "sw", "w" ],
    se: ["se", "e",  "s",  "ne", "sw", "n",  "w",  "nw"],
    s:  ["s",  "se", "sw", "e",  "w",  "ne", "nw", "n" ],
    sw: ["sw", "s",  "w",  "se", "nw", "e",  "n",  "ne"],
    w:  ["w",  "nw", "sw", "n",  "s",  "ne", "se", "e" ],
    nw: ["nw", "n",  "w",  "ne", "sw", "e",  "s",  "se"],
};

/**
 * Returns the ordered alignment candidate list for a point label position.
 *
 * Returns null when `labelPosition` is unrecognized or absent.
 */
function getPointAlignmentCandidates(labelPosition: unknown): string[] | null {
    const key = normalizeKey(labelPosition ?? "");
    const primary = prefigurePointAlignmentByLabelPosition[key];
    if (!primary) return null;
    return POINT_ALIGNMENT_CANDIDATES[primary] ?? null;
}

/**
 * Selects the best alignment for a point label, avoiding viewport overflow.
 *
 * Uses the same selection model as `getLineLabelAlignment`: iterates an
 * ordered candidate list, returns the first non-overflow candidate, or the
 * minimum-overflow candidate when all overflow.
 *
 * The tangent is always `[1, 0]` because point labels are axis-aligned and
 * need no rotation.
 *
 * Returns null when `labelPosition` is unrecognized or absent.
 */
function getPointLabelAlignment({
    labelPosition,
    point,
    graphBounds,
    labelText,
    labelHasLatex,
}: {
    labelPosition: unknown;
    point: Point;
    graphBounds: GraphBounds | undefined;
    labelText: unknown;
    labelHasLatex: unknown;
}): string | null {
    const candidates = getPointAlignmentCandidates(labelPosition);
    if (!candidates?.length) return null;

    // Point labels are axis-aligned; tangent is the standard x-axis frame.
    const tangent: Point = [1, 0];
    const labelMetrics = estimateLabelMetrics(labelText, labelHasLatex);

    let bestAlignment = candidates[0];
    let minimumOverflow = Number.POSITIVE_INFINITY;

    for (const candidate of candidates) {
        const { overflowAmount } = computeAlignmentOverflowAt({
            anchor: point,
            tangent,
            alignment: candidate,
            graphBounds,
            labelMetrics,
        });
        if (overflowAmount === 0) {
            return candidate;
        }
        if (overflowAmount < minimumOverflow) {
            bestAlignment = candidate;
            minimumOverflow = overflowAmount;
        }
    }

    return bestAlignment;
}

/**
 * Returns `<point>` label attributes/content for PreFigure output.
 */
export function pointLabelAttributes({
    stateValues,
    warnings,
    warningPrefix,
    warningPosition,
}: {
    stateValues: PrefigureStateValues;
    warnings: Warning[];
    warningPrefix: string;
    warningPosition?: unknown;
}): { attrs: string[]; label: string } | null {
    const label = labelMarkup({
        label: stateValues?.label,
        labelHasLatex: stateValues?.labelHasLatex,
    });

    if (!label) {
        return null;
    }

    const attrs = [];
    const rawPosition = stateValues?.labelPosition;
    if (rawPosition) {
        const rawXs = stateValues?.numericalXs;
        const pointCoord: Point | null =
            Array.isArray(rawXs) &&
            rawXs.length >= 2 &&
            Number.isFinite(rawXs[0]) &&
            Number.isFinite(rawXs[1])
                ? [Number(rawXs[0]), Number(rawXs[1])]
                : null;

        const directAlignment =
            prefigurePointAlignmentByLabelPosition[normalizeKey(rawPosition)];

        if (directAlignment) {
            const alignment =
                pointCoord !== null && stateValues?.graphBounds
                    ? (getPointLabelAlignment({
                          labelPosition: rawPosition,
                          point: pointCoord,
                          graphBounds: stateValues.graphBounds,
                          labelText: stateValues?.label,
                          labelHasLatex: stateValues?.labelHasLatex,
                      }) ?? directAlignment)
                    : directAlignment;
            attrs.push(`alignment="${escapeXml(alignment)}"`);
        } else {
            pushWarning({
                warnings,
                message: `${warningPrefix}: unsupported labelPosition '${rawPosition}' for point label; default PreFigure alignment used.`,
                position: warningPosition,
            });
        }
    }

    return { attrs, label };
}

/**
 * Maps `bias` in [-1, 1] to a `label-location` using a fractional endpoint
 * inset ratio.
 *
 * The returned location lies in `[insetRatio, 1 - insetRatio]`.
 * `bias = -1` maps near ep1, `bias = +1` maps near ep2, and `bias = 0`
 * maps to the midpoint between them.
 */
function locationFromBiasWithInsetRatio({
    bias,
    insetRatio,
}: {
    bias: number;
    insetRatio: number;
}): number {
    const clampedBias = Math.max(-1, Math.min(1, bias));
    const clampedInset = clamp01(Math.min(0.5, insetRatio));
    const span = Math.max(0, 0.5 - clampedInset);
    return clamp01(0.5 + clampedBias * span);
}

/**
 * Maps `bias` in [-1, 1] to a `label-location` using a fixed screen-space
 * endpoint inset when that conversion is well-defined.
 *
 * As with `locationFromBiasWithInsetRatio`, `bias = -1` maps near ep1,
 * `bias = +1` maps near ep2, and `bias = 0` maps near the midpoint. When the
 * graph bounds, graph dimensions, and segment geometry are all usable, this
 * helper converts
 * `LINE_LABEL_ENDPOINT_INSET_PIXELS` into an equivalent inset ratio for the
 * current segment and graph scale, then maps the bias through
 * `locationFromBiasWithInsetRatio`.
 *
 * If that absolute-offset conversion is not well-defined, we fall back to the
 * default relative endpoint inset from `LINE_LABEL_ENDPOINT_INSET_RATIO`.
 * This covers cases such as coincident endpoints or missing/degenerate graph
 * bounds and dimensions.
 */
function locationFromBiasWithAbsoluteEndpointOffset({
    bias,
    ep1,
    ep2,
    graphBounds,
    graphDimensions,
}: {
    bias: number;
    ep1: Point;
    ep2: Point;
    graphBounds: GraphBounds | undefined;
    graphDimensions: GraphDimensions | undefined;
}): number {
    const bounds = getGraphBounds(graphBounds);
    const dims = getGraphDimensions(graphDimensions);
    const dx = ep2[0] - ep1[0];
    const dy = ep2[1] - ep1[1];
    const segmentLength = Math.hypot(dx, dy);
    const graphWidth = bounds ? bounds.xMax - bounds.xMin : 0;
    const graphHeight = bounds ? bounds.yMax - bounds.yMin : 0;

    const shouldUseRelativeInsetFallback =
        !bounds ||
        !dims ||
        !(segmentLength > 0) ||
        !(graphWidth > 0) ||
        !(graphHeight > 0);

    if (shouldUseRelativeInsetFallback) {
        return locationFromBiasWithInsetRatio({
            bias,
            insetRatio: LINE_LABEL_ENDPOINT_INSET_RATIO,
        });
    }

    const tx = dx / segmentLength;
    const ty = dy / segmentLength;

    // Convert endpoint offset from pixels to graph-units along line direction.
    const unitsPerPixelAlongLine = Math.hypot(
        tx * (graphWidth / dims.width),
        ty * (graphHeight / dims.height),
    );

    const absoluteOffset =
        LINE_LABEL_ENDPOINT_INSET_PIXELS * unitsPerPixelAlongLine;
    const insetRatio = Math.min(0.45, clamp01(absoluteOffset / segmentLength));
    const location = locationFromBiasWithInsetRatio({
        bias,
        insetRatio,
    });
    return location;
}

/**
 * Maps Doenet `labelPosition` to a numeric `label-location` value.
 *
 * By default, recognized non-center line-family positions map to a continuous
 * location between ep1 and ep2 with edge-near insets (0.05 near ep1,
 * 0.95 near ep2, set by `LINE_LABEL_ENDPOINT_INSET_RATIO`)
 * rather than hard 0/1.
 *
 * When `options.absoluteEndpointOffset` is true and graph bounds/dimensions are
 * available, endpoint-side labels use a fixed screen-space inset from the
 * endpoint, set by `LINE_LABEL_ENDPOINT_INSET_PIXELS`, so line extension does
 * not move the anchor relative to that endpoint.
 *
 * Returns null for `center` and unrecognized positions.
 *
 * Supported `options`:
 * - `absoluteEndpointOffset` (`boolean`): enables endpoint offsets measured in
 *   screen pixels instead of a fixed fractional inset.
 * - `graphBounds` (`[xMin, yMin, xMax, yMax]`): graph bounds used to convert
 *   pixel offsets into graph units.
 * - `graphDimensions` (`[widthPx, heightPx]`): rendered graph size in pixels,
 *   used with `graphBounds` for pixel-to-graph conversion.
 *
 * Examples:
 * - Default inset behavior:
 *   `lineLabelLocationValue("right", [0, 0], [4, 0]) // 0.95`
 * - Absolute endpoint offset behavior:
 *   `lineLabelLocationValue("right", [0, 0], [4, 0], { absoluteEndpointOffset: true, graphBounds: [0, 0, 10, 10], graphDimensions: [500, 500] }) // 0.94`
 */
export function lineLabelLocationValue(
    labelPosition: unknown,
    ep1: Point,
    ep2: Point,
    options: {
        absoluteEndpointOffset?: boolean;
        graphBounds?: GraphBounds;
        graphDimensions?: GraphDimensions;
    } = {},
): number | null {
    const endpointBias = chooseEndpointBiasForLabelPosition(
        labelPosition,
        ep1,
        ep2,
    );

    if (endpointBias === null) {
        return null;
    }

    if (options.absoluteEndpointOffset) {
        return locationFromBiasWithAbsoluteEndpointOffset({
            bias: endpointBias,
            ep1,
            ep2,
            graphBounds: options.graphBounds,
            graphDimensions: options.graphDimensions,
        });
    }

    return locationFromBiasWithInsetRatio({
        bias: endpointBias,
        insetRatio: LINE_LABEL_ENDPOINT_INSET_RATIO,
    });
}

/**
 * Returns label attrs/content for a PreFigure `<line>` element.
 *
 * Emits `label-location` to position the label along the visible line and
 * emits `alignment` when Doenet provides a recognized line-family
 * `labelPosition` (including `center`).
 *
 * For non-center positions, the `alignment` is expressed in the line's LOCAL
 * ROTATED FRAME so the label flows into the graph from whichever end is
 * nearest:
 * - Positions on the ep2 side get a "W" component so the
 *   label extends backward along the line, staying inside the graph.
 * - Positions on the ep1 side get an "E" component so the
 *   label extends forward along the line, staying inside the graph.
 *
 * ep1 and ep2 must be the ORIENTED endpoint arrays produced by
 * `orientEndpointsForLineLabel`.
 *
 * Caller-controlled options in `stateValues`:
 * - `lineLabelLocationOverride`: value to write into the output
 *   `label-location` attribute, in full-geometry parameter space.
 * - `lineLabelAlignmentLocationOverride`: value to use when choosing
 *   `alignment` by overflow amount.
 * - `lineLabelAbsoluteEndpointOffset`: enable fixed pixel offset from endpoint.
 */
export function getLabelForLine({
    stateValues,
    ep1,
    ep2,
    warnings,
    warningPrefix,
    warningPosition,
}: {
    stateValues: PrefigureStateValues;
    ep1: Point;
    ep2: Point;
    warnings: Warning[];
    warningPrefix: string;
    warningPosition?: unknown;
}): { labelAttrs: string[]; label: string | null } {
    const label = labelMarkup({
        label: stateValues?.label,
        labelHasLatex: stateValues?.labelHasLatex,
    });

    if (!label) {
        return {
            labelAttrs: [],
            label: null,
        };
    }

    const labelAttrs = [];
    const rawPosition = stateValues?.labelPosition;
    const normalizedPosition = normalizeKey(rawPosition ?? "");

    // Used when callers (for example clipped segments) must emit a label-location
    // in full-geometry parameter space rather than along `ep1 -> ep2`.
    const overrideLocRaw = stateValues?.lineLabelLocationOverride;
    const overrideLoc = Number(overrideLocRaw);
    const hasOverrideLoc = Number.isFinite(overrideLoc);
    const baseLoc = hasOverrideLoc
        ? clamp01(overrideLoc)
        : lineLabelLocationValue(rawPosition, ep1, ep2, {
              absoluteEndpointOffset:
                  stateValues?.lineLabelAbsoluteEndpointOffset === true,
              graphBounds: stateValues?.graphBounds,
              graphDimensions: stateValues?.graphDimensions,
          });

    let location = 0.5;
    if (baseLoc !== null && Number.isFinite(baseLoc)) {
        location = baseLoc;
        labelAttrs.push(
            `label-location="${escapeXml(formatLocation(location))}"`,
        );
    }

    // Optionally choose `alignment` using a different location than the one
    // written to output `label-location` (used when visible clipped geometry
    // is remapped back to full-segment parameter space).
    const alignmentLocationRaw =
        stateValues?.lineLabelAlignmentLocationOverride;
    const alignmentLocation = Number.isFinite(Number(alignmentLocationRaw))
        ? Number(alignmentLocationRaw)
        : location;

    if (rawPosition) {
        const alignment = getLineLabelAlignment({
            labelPosition: rawPosition,
            location: alignmentLocation,
            ep1,
            ep2,
            graphBounds: stateValues?.graphBounds,
            labelText: stateValues?.label,
            labelHasLatex: stateValues?.labelHasLatex,
        });
        if (alignment) {
            labelAttrs.push(`alignment="${escapeXml(alignment)}"`);
        } else if (!KNOWN_LINE_POSITIONS.has(normalizedPosition)) {
            pushWarning({
                warnings,
                message: `${warningPrefix}: unsupported labelPosition '${rawPosition}' for line-family label; default PreFigure alignment used.`,
                position: warningPosition,
            });
        }
    }

    return { labelAttrs, label };
}
