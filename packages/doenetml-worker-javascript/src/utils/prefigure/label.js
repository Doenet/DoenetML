import { escapeXml, pushWarning } from "./common";

/**
 * Label conversion strategy summary
 *
 * 1) Point labels use direct Doenet `labelPosition` -> PreFigure `alignment` mapping.
 * 2) Line-family labels (`line`, `lineSegment`, `ray`) compute two outputs:
 *    - `label-location`: where along the oriented segment to anchor the label
 *    - `alignment`: which side of the oriented segment to place text on
 * 3) `ray` can behave in mixed mode:
 *    - finite-endpoint side uses endpoint candidate policy
 *    - infinite side uses line candidate policy
 * 4) Callers can override emitted/scoring locations for clipped/remapped geometry.
 */

const prefigurePointAlignmentByLabelPosition = {
    upperright: "ne",
    upperleft: "nw",
    lowerright: "se",
    lowerleft: "sw",
    top: "n",
    bottom: "s",
    left: "w",
    right: "e",
};

function normalizeKey(value) {
    return String(value)
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, "");
}

const LINE_LABEL_LOCATION_NEAR_START = "0.05";
const LINE_LABEL_LOCATION_NEAR_END = "0.95";

/**
 * Line-family label tuning constants.
 *
 * These are intentionally centralized to make tuning explicit and auditable.
 * Adjust with corresponding geometry tests in
 * `src/test/prefigure/graph-prefigure-geometry.test.ts`.
 *
 * @property edgeMarginRatio Portion of graph width/height considered "near edge".
 * @property flipThreshold If default candidate score is <= threshold, keep default.
 * @property edgePaddingRatio Reserved inset to reduce visible clipping at bounds.
 * @property overflowPenalty Base cost added when candidate predicts any overflow.
 * @property endpointOffsetPixels Endpoint-anchor inset in screen pixels.
 */
export const lineLabelTuning = Object.freeze({
    edgeMarginRatio: 0.08,
    flipThreshold: 0.35,
    edgePaddingRatio: 0.02,
    overflowPenalty: 1,
    endpointOffsetPixels: 12,
});

const LINE_ALIGNMENT_EDGE_MARGIN_RATIO = lineLabelTuning.edgeMarginRatio;
const LINE_ALIGNMENT_FLIP_THRESHOLD = lineLabelTuning.flipThreshold;
const LINE_LABEL_EDGE_PADDING_RATIO = lineLabelTuning.edgePaddingRatio;
const LINE_ALIGNMENT_OVERFLOW_PENALTY = lineLabelTuning.overflowPenalty;
const LINE_LABEL_ENDPOINT_OFFSET_PIXELS = lineLabelTuning.endpointOffsetPixels;

// All labelPosition values recognized by the line-family converter.
const KNOWN_LINE_POSITIONS = new Set([
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
 * Numeric tie-break threshold for endpoint bias scoring.
 *
 * If two endpoint scores differ by less than this value, we treat the bias as
 * effectively zero to avoid jitter from floating-point noise.
 */
const LOCATION_SCORE_EPSILON = 1e-12;

/**
 * Center snap tolerance for ray-side resolution.
 *
 * When `label-location` is within this tolerance of 0.5, ray alignment mode
 * treats the anchor as centered (neither endpoint side), so ray logic falls
 * back to line-mode alignment.
 */
const RAY_LOCATION_CENTER_EPSILON = 1e-9;

/**
 * Horizontal center deadzone used by line-mode alignment candidate selection.
 *
 * If `label-location` is within this distance from center, we prefer pure
 * cardinal candidates (`n`/`s`) over diagonal variants to reduce unnecessary
 * side flipping near midpoint.
 */
const LINE_ALIGNMENT_CENTER_DEADZONE = 0.08;

/**
 * Formats label-location numbers with stable precision for snapshot-friendly XML.
 */
function formatLocation(value) {
    const rounded = Number(value.toFixed(6));
    return `${rounded}`;
}

/**
 * Clamps a numeric score or ratio into the inclusive unit interval.
 */
function clamp01(value) {
    return Math.min(1, Math.max(0, value));
}

/**
 * Scores how strongly one endpoint satisfies a directional intent.
 *
 * `value` is the scored endpoint's coordinate on one axis, `otherValue` is the
 * opposite endpoint's coordinate on that same axis, `magnitude` is the absolute
 * endpoint separation on that axis, and `direction` selects whether larger
 * (`"positive"`) or smaller (`"negative"`) coordinates should score higher.
 *
 * Returns a value in [0, 1] where 1 means the point is strongly in the
 * requested positive/negative direction relative to the other endpoint.
 */
function directionalScore(value, otherValue, magnitude, direction) {
    if (!(magnitude > 0)) {
        return 0.5;
    }
    const normalized = (value - otherValue) / magnitude;
    const rightOrUp = clamp01(0.5 + normalized / 2);
    return direction === "positive" ? rightOrUp : 1 - rightOrUp;
}

function defaultInsetRatio() {
    const nearStart = Number(LINE_LABEL_LOCATION_NEAR_START);
    if (Number.isFinite(nearStart) && nearStart >= 0 && nearStart <= 0.5) {
        return nearStart;
    }
    return 0.05;
}

/**
 * Converts a side preference in [-1, 1] into a [0, 1] label-location.
 *
 * -1 anchors near ep1, +1 anchors near ep2, and 0 anchors at center.
 */
function locationFromBiasAndInset({ bias, insetRatio }) {
    const clampedBias = Math.max(-1, Math.min(1, bias));
    const clampedInset = clamp01(Math.min(0.5, insetRatio));
    const span = Math.max(0, 0.5 - clampedInset);
    return clamp01(0.5 + clampedBias * span);
}

/**
 * Maps a numeric label-location back to the oriented endpoint side it favors.
 */
function endpointIndexFromLocation(location) {
    if (!Number.isFinite(location)) {
        return null;
    }
    if (Math.abs(location - 0.5) <= RAY_LOCATION_CENTER_EPSILON) {
        return null;
    }
    return location >= 0.5 ? 1 : 0;
}

/**
 * Returns a continuous side preference in [-1, 1] for line-family
 * `labelPosition`.
 *
 * Corner positions blend horizontal and vertical evidence so steep and shallow
 * segments transition smoothly through center as orientation rotates.
 */
function chooseEndpointBiasForLabelPosition(labelPosition, ep1, ep2) {
    const pos = normalizeKey(labelPosition ?? "");
    if (!KNOWN_LINE_POSITIONS.has(pos) || pos === "center") {
        return null;
    }

    const dx = ep2[0] - ep1[0];
    const dy = ep2[1] - ep1[1];
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const segmentLength = Math.hypot(dx, dy);
    if (!(segmentLength > 0)) {
        return 0;
    }
    const sum = absDx + absDy;
    const xDominance = sum > 0 ? absDx / sum : 0.5;
    const yDominance = sum > 0 ? absDy / sum : 0.5;

    // Score each endpoint against the semantic intent of labelPosition.
    // We blend horizontal/vertical evidence for corner positions so steep lines
    // and shallow lines produce intuitive endpoint choices.
    function endpointScore(index) {
        const point = index === 0 ? ep1 : ep2;
        const other = index === 0 ? ep2 : ep1;

        const rightScoreAxis = directionalScore(
            point[0],
            other[0],
            absDx,
            "positive",
        );
        const leftScoreAxis = directionalScore(
            point[0],
            other[0],
            absDx,
            "negative",
        );
        const upperScoreAxis = directionalScore(
            point[1],
            other[1],
            absDy,
            "positive",
        );
        const lowerScoreAxis = directionalScore(
            point[1],
            other[1],
            absDy,
            "negative",
        );

        const rightScoreSmooth = directionalScore(
            point[0],
            other[0],
            segmentLength,
            "positive",
        );
        const leftScoreSmooth = directionalScore(
            point[0],
            other[0],
            segmentLength,
            "negative",
        );
        const upperScoreSmooth = directionalScore(
            point[1],
            other[1],
            segmentLength,
            "positive",
        );
        const lowerScoreSmooth = directionalScore(
            point[1],
            other[1],
            segmentLength,
            "negative",
        );

        switch (pos) {
            case "right":
                return rightScoreSmooth;
            case "left":
                return leftScoreSmooth;
            case "top":
                return upperScoreSmooth;
            case "bottom":
                return lowerScoreSmooth;
            case "upperright":
                return (
                    xDominance * rightScoreAxis + yDominance * upperScoreAxis
                );
            case "upperleft":
                return xDominance * leftScoreAxis + yDominance * upperScoreAxis;
            case "lowerright":
                return (
                    xDominance * rightScoreAxis + yDominance * lowerScoreAxis
                );
            case "lowerleft":
                return xDominance * leftScoreAxis + yDominance * lowerScoreAxis;
            default:
                return 0.5;
        }
    }

    const score0 = endpointScore(0);
    const score1 = endpointScore(1);

    // Bias > 0 means ep2 side, bias < 0 means ep1 side.
    const bias = score1 - score0;
    if (Math.abs(bias) <= LOCATION_SCORE_EPSILON) {
        return 0;
    }

    return Math.max(-1, Math.min(1, bias));
}

/**
 * Interpolates the anchor point used for line-label alignment scoring.
 */
function lineLabelAnchorPoint({ ep1, ep2, location }) {
    return [
        ep1[0] + (ep2[0] - ep1[0]) * location,
        ep1[1] + (ep2[1] - ep1[1]) * location,
    ];
}

/**
 * Validates and normalizes graph bounds for edge-aware alignment scoring.
 */
function getGraphBounds(graphBounds) {
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
 * Validates and normalizes graph dimensions for screen-space conversions.
 */
function getGraphDimensions(graphDimensions) {
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
function getLineTangent(ep1, ep2) {
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
 * only to rank fallback alignments near graph boundaries.
 */
function estimateLabelMetrics(labelText, labelHasLatex) {
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
 * Candidate order matters: earlier entries are preferred, later entries are
 * only considered when edge/overflow scoring indicates a fallback is safer.
 */
function getLineAlignmentCandidates(labelPosition, location, mode = "line") {
    const pos = normalizeKey(labelPosition ?? "");
    if (!pos || !KNOWN_LINE_POSITIONS.has(pos)) {
        return null;
    }

    if (pos === "center") {
        return ["n", "s"];
    }

    const distanceFromCenter = location - 0.5;
    const h = distanceFromCenter >= 0 ? "w" : "e";
    const centeredHorizontally =
        Math.abs(distanceFromCenter) <= LINE_ALIGNMENT_CENTER_DEADZONE;

    // Endpoint mode is intentionally richer than line mode. We include fallback
    // candidates (for example plain `n`/`s`) to recover when diagonal choices
    // would clip near boundaries.
    if (mode === "endpoint") {
        if (pos === "right") {
            return ["n", `n${h}`, `s${h}`];
        }
        if (pos === "left") {
            return ["n", `n${h}`, `s${h}`];
        }

        const isUpperCorner = pos === "upperright" || pos === "upperleft";
        const isLowerCorner = pos === "lowerright" || pos === "lowerleft";
        if (isUpperCorner) {
            return ["n", `n${h}`, `s${h}`];
        }
        if (isLowerCorner) {
            return ["s", `s${h}`, `n${h}`];
        }
    }

    if (pos === "right" || pos === "left" || pos === "top") {
        return ["n", `n${h}`, `s${h}`, "s"];
    }
    if (pos === "bottom") {
        return ["s", `s${h}`, `n${h}`, "n"];
    }

    if (centeredHorizontally) {
        if (pos === "top" || pos === "right" || pos === "left") {
            return ["n", "s"];
        }
        if (pos === "bottom") {
            return ["s", "n"];
        }
    }

    const prefersSouth =
        pos === "bottom" || pos === "lowerleft" || pos === "lowerright";

    return prefersSouth ? [`s${h}`, `n${h}`] : [`n${h}`, `s${h}`];
}

/**
 * Converts a candidate alignment into tangent/normal extents for overflow tests.
 */
function getAlignmentExtents(tangent, alignment, metrics) {
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
 * Scores one candidate alignment against graph bounds.
 *
 * Lower scores are better. Any predicted overflow gets a strong penalty so the
 * caller will immediately prefer in-bounds fallback candidates.
 */
function scoreLineAlignmentForBounds({
    alignment,
    ep1,
    ep2,
    location,
    graphBounds,
    labelMetrics,
}) {
    const bounds = getGraphBounds(graphBounds);
    const tangent = getLineTangent(ep1, ep2);
    if (!bounds || !tangent) {
        return 0;
    }

    const anchor = lineLabelAnchorPoint({ ep1, ep2, location });
    const { xMin, yMin, xMax, yMax } = bounds;
    const width = xMax - xMin;
    const height = yMax - yMin;
    const marginX = width * LINE_ALIGNMENT_EDGE_MARGIN_RATIO;
    const marginY = height * LINE_ALIGNMENT_EDGE_MARGIN_RATIO;
    const edgePaddingX = width * LINE_LABEL_EDGE_PADDING_RATIO;
    const edgePaddingY = height * LINE_LABEL_EDGE_PADDING_RATIO;

    const nearLeft = clamp01((xMin + marginX - anchor[0]) / marginX);
    const nearRight = clamp01((anchor[0] - (xMax - marginX)) / marginX);
    const nearBottom = clamp01((yMin + marginY - anchor[1]) / marginY);
    const nearTop = clamp01((anchor[1] - (yMax - marginY)) / marginY);

    const extents = getAlignmentExtents(tangent, alignment, labelMetrics);

    const projectedLeft = anchor[0] + extents.minX;
    const projectedRight = anchor[0] + extents.maxX;
    const projectedBottom = anchor[1] + extents.minY;
    const projectedTop = anchor[1] + extents.maxY;

    const overflowLeft = Math.max(0, xMin + edgePaddingX - projectedLeft);
    const overflowRight = Math.max(0, projectedRight - (xMax - edgePaddingX));
    const overflowBottom = Math.max(0, yMin + edgePaddingY - projectedBottom);
    const overflowTop = Math.max(0, projectedTop - (yMax - edgePaddingY));

    const overflowScore =
        overflowLeft + overflowRight + overflowBottom + overflowTop;

    let score = 0;
    if (overflowScore > 0) {
        // Any predicted overflow should trigger fallback evaluation immediately.
        score += LINE_ALIGNMENT_OVERFLOW_PENALTY + overflowScore;
    }
    score += nearLeft * Math.max(0, -extents.minX);
    score += nearRight * Math.max(0, extents.maxX);
    score += nearBottom * Math.max(0, -extents.minY);
    score += nearTop * Math.max(0, extents.maxY);

    return score;
}

/**
 * Selects the best alignment for the requested line-family label position.
 */
function getLineLabelAlignment({
    labelPosition,
    location,
    ep1,
    ep2,
    graphBounds,
    labelText,
    labelHasLatex,
    mode = "line",
}) {
    const candidates = getLineAlignmentCandidates(
        labelPosition,
        location,
        mode,
    );
    if (!candidates?.length) {
        return null;
    }

    const labelMetrics = estimateLabelMetrics(labelText, labelHasLatex);

    // Candidate order matters: first entry is the design-preferred alignment,
    // remaining entries are fallbacks for edge/overflow conditions.
    const defaultAlignment = candidates[0];
    const defaultScore = scoreLineAlignmentForBounds({
        alignment: defaultAlignment,
        ep1,
        ep2,
        location,
        graphBounds,
        labelMetrics,
    });

    if (
        defaultScore <= LINE_ALIGNMENT_FLIP_THRESHOLD ||
        candidates.length === 1
    ) {
        return defaultAlignment;
    }

    let bestAlignment = defaultAlignment;
    let bestScore = defaultScore;

    for (const candidate of candidates.slice(1)) {
        const score = scoreLineAlignmentForBounds({
            alignment: candidate,
            ep1,
            ep2,
            location,
            graphBounds,
            labelMetrics,
        });
        if (score < bestScore) {
            bestAlignment = candidate;
            bestScore = score;
        }
    }

    return bestAlignment;
}

/**
 * Resolves the effective alignment policy for the current anchor location.
 *
 * `ray` mode is split dynamically: the finite-endpoint side behaves like a
 * segment endpoint while the opposite side behaves like an infinite line.
 */
function resolveAlignmentMode({ stateValues, location }) {
    // Non-ray callers use their explicit mode directly.
    const baseMode = stateValues?.lineLabelAlignmentMode ?? "line";
    if (baseMode !== "ray") {
        return baseMode;
    }

    // Ray-mode split: endpoint side behaves like finite segments; opposite side
    // behaves like infinite lines.
    const finiteIndex = stateValues?.lineLabelRayFiniteEndpointIndex;
    if (finiteIndex !== 0 && finiteIndex !== 1) {
        return "line";
    }

    const selectedIndex = endpointIndexFromLocation(location);
    if (selectedIndex === null) {
        return "line";
    }

    return selectedIndex === finiteIndex ? "endpoint" : "line";
}

/**
 * Reorders two raw [x, y] points so the first is the leftward point.
 * For vertical lines, the lower point comes first.
 */
export function orientEndpointsForLineLabel(p1Raw, p2Raw) {
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
export function labelMarkup({ label, labelHasLatex }) {
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
                .replaceAll("\\(", "<m>")
                .replaceAll("\\)", "</m>");
        }

        return `<m>${escapeXml(text)}</m>`;
    }

    return escapeXml(text);
}

/**
 * Returns `<point>` label attributes/content for PreFigure output.
 */
export function pointLabelAttributes({
    stateValues,
    warnings,
    warningPrefix,
    warningPosition,
}) {
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
        const alignment =
            prefigurePointAlignmentByLabelPosition[normalizeKey(rawPosition)];

        if (alignment) {
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
 * Converts a fixed screen-space endpoint offset into line-location parameter t.
 *
 * This keeps endpoint-side label anchors visually stable when segments are
 * lengthened while still scaling with graph size and zoom.
 */
function locationForEndpointBiasWithAbsoluteOffset({
    endpointBias,
    ep1,
    ep2,
    graphBounds,
    graphDimensions,
}) {
    const bounds = getGraphBounds(graphBounds);
    const dims = getGraphDimensions(graphDimensions);
    if (!bounds || !dims) {
        const location = locationFromBiasAndInset({
            bias: endpointBias,
            insetRatio: defaultInsetRatio(),
        });
        return formatLocation(location);
    }

    const dx = ep2[0] - ep1[0];
    const dy = ep2[1] - ep1[1];
    const segmentLength = Math.hypot(dx, dy);
    if (!(segmentLength > 0)) {
        const location = locationFromBiasAndInset({
            bias: endpointBias,
            insetRatio: defaultInsetRatio(),
        });
        return formatLocation(location);
    }

    const tx = dx / segmentLength;
    const ty = dy / segmentLength;
    const graphWidth = bounds.xMax - bounds.xMin;
    const graphHeight = bounds.yMax - bounds.yMin;

    // Convert endpoint offset from pixels to graph-units along line direction.
    const unitsPerPixelAlongLine = Math.hypot(
        tx * (graphWidth / dims.width),
        ty * (graphHeight / dims.height),
    );
    if (!(unitsPerPixelAlongLine > 0)) {
        const location = locationFromBiasAndInset({
            bias: endpointBias,
            insetRatio: defaultInsetRatio(),
        });
        return formatLocation(location);
    }

    const absoluteOffset =
        LINE_LABEL_ENDPOINT_OFFSET_PIXELS * unitsPerPixelAlongLine;
    const insetRatio = Math.min(0.45, clamp01(absoluteOffset / segmentLength));
    const location = locationFromBiasAndInset({
        bias: endpointBias,
        insetRatio,
    });
    return formatLocation(location);
}

/**
 * Maps Doenet `labelPosition` to a PreFigure `label-location` value.
 *
 * By default, endpoint-side positions use edge-near insets
 * (`LINE_LABEL_LOCATION_NEAR_START` and `LINE_LABEL_LOCATION_NEAR_END`) rather
 * than hard 0/1 so non-center labels anchor near the selected endpoint.
 *
 * When `options.absoluteEndpointOffset` is true and graph bounds/dimensions are
 * available, endpoint-side labels use a fixed screen-space offset from the
 * endpoint so line extension does not move the anchor relative to that endpoint.
 */
export function lineLabelLocationFromPosition(
    labelPosition,
    ep1,
    ep2,
    options = {},
) {
    const endpointBias = chooseEndpointBiasForLabelPosition(
        labelPosition,
        ep1,
        ep2,
    );

    if (endpointBias === null) {
        return null;
    }

    if (options.absoluteEndpointOffset) {
        return locationForEndpointBiasWithAbsoluteOffset({
            endpointBias,
            ep1,
            ep2,
            graphBounds: options.graphBounds,
            graphDimensions: options.graphDimensions,
        });
    }

    const location = locationFromBiasAndInset({
        bias: endpointBias,
        insetRatio: defaultInsetRatio(),
    });
    return formatLocation(location);
}

/**
 * Returns the numeric label-location value for downstream interpolation logic.
 *
 * Vector conversion and clipped-segment remapping both call this helper.
 */
export function lineLabelLocationValue(labelPosition, ep1, ep2, options = {}) {
    const locText = lineLabelLocationFromPosition(
        labelPosition,
        ep1,
        ep2,
        options,
    );
    if (locText === null) {
        return 0.5;
    }

    const parsed = Number(locText);
    return Number.isFinite(parsed) ? parsed : 0.5;
}

/**
 * Returns label attrs/content for a PreFigure `<line>` element.
 *
 * Emits `label-location` to position the label along the visible line and
 * emits `alignment` when Doenet provides a non-center line-family
 * `labelPosition`.
 *
 * The `alignment` is expressed in the line's LOCAL ROTATED FRAME so the
 * label always flows into the graph from whichever end is nearest:
 * - Positions on the ep2 side get a "W" component so the
 *   label extends backward along the line, staying inside the graph.
 * - Positions on the ep1 side get an "E" component so the
 *   label extends forward along the line, staying inside the graph.
 *
 * ep1 and ep2 must be the ORIENTED endpoint arrays produced by
 * `orientEndpointsForLineLabel`.
 *
 * Caller-controlled options in `stateValues`:
 * - `lineLabelLocationOverride`: emitted `label-location` in full-geometry space.
 * - `lineLabelAlignmentLocationOverride`: scoring location for alignment selection.
 * - `lineLabelAbsoluteEndpointOffset`: enable fixed pixel offset from endpoint.
 * - `lineLabelAlignmentMode`: one of `line`, `endpoint`, `ray`.
 * - `lineLabelRayFiniteEndpointIndex`: required when mode is `ray`.
 */
export function lineLabelAttributes({
    stateValues,
    ep1,
    ep2,
    warnings,
    warningPrefix,
    warningPosition,
}) {
    const label = labelMarkup({
        label: stateValues?.label,
        labelHasLatex: stateValues?.labelHasLatex,
    });

    if (!label) {
        return null;
    }

    const attrs = [];
    const rawPosition = stateValues?.labelPosition;
    const normalizedPosition = normalizeKey(rawPosition ?? "");

    // Used when callers (for example clipped segments) must emit a label-location
    // in full-geometry parameter space rather than along `ep1 -> ep2`.
    const overrideLocRaw = stateValues?.lineLabelLocationOverride;
    const overrideLoc = Number(overrideLocRaw);
    const hasOverrideLoc = Number.isFinite(overrideLoc);
    const baseLoc = hasOverrideLoc
        ? formatLocation(clamp01(overrideLoc))
        : lineLabelLocationFromPosition(rawPosition, ep1, ep2, {
              absoluteEndpointOffset:
                  stateValues?.lineLabelAbsoluteEndpointOffset === true,
              graphBounds: stateValues?.graphBounds,
              graphDimensions: stateValues?.graphDimensions,
          });

    let location = 0.5;
    if (baseLoc !== null) {
        location = Number(baseLoc);
        if (Number.isFinite(location)) {
            attrs.push(
                `label-location="${escapeXml(formatLocation(location))}"`,
            );
        }
    }

    // Alignment can be scored at a different location than emitted label-location
    // when remapping visible-segment anchors back to the full segment.
    const alignmentLocationRaw =
        stateValues?.lineLabelAlignmentLocationOverride;
    const alignmentLocation = Number.isFinite(Number(alignmentLocationRaw))
        ? Number(alignmentLocationRaw)
        : location;

    if (rawPosition) {
        const resolvedMode = resolveAlignmentMode({
            stateValues,
            location: alignmentLocation,
        });
        const alignment = getLineLabelAlignment({
            labelPosition: rawPosition,
            location: alignmentLocation,
            ep1,
            ep2,
            graphBounds: stateValues?.graphBounds,
            labelText: stateValues?.label,
            labelHasLatex: stateValues?.labelHasLatex,
            mode: resolvedMode,
        });
        if (alignment) {
            attrs.push(`alignment="${escapeXml(alignment)}"`);
        } else if (!KNOWN_LINE_POSITIONS.has(normalizedPosition)) {
            pushWarning({
                warnings,
                message: `${warningPrefix}: unsupported labelPosition '${rawPosition}' for line-family label; default PreFigure alignment used.`,
                position: warningPosition,
            });
        }
    }

    return { attrs, label };
}
