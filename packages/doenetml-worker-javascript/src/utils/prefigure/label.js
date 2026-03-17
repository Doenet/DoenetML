import { escapeXml, pushWarning } from "./common";

/**
 * Label conversion strategy summary
 *
 * 1) Point labels use direct Doenet `labelPosition` -> PreFigure `alignment` mapping.
 * 2) Line-family labels (`line`, `lineSegment`, `ray`) compute two outputs:
 *    - `label-location`: where along the oriented segment to anchor the label
 *    - `alignment`: which side of the oriented segment to place text on
 * 3) Ray callers may request `ray` alignment mode, which is normalized to the
 *    same endpoint-style alignment policy used for finite endpoint anchoring.
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

/**
 * Normalizes a Doenet attribute string for case-insensitive, punctuation-
 * tolerant lookup in position maps and candidate sets.
 *
 * For example `"upperRight"`, `"upper-right"`, and `"UPPER_RIGHT"` all
 * normalize to `"upperright"`.
 */
function normalizeKey(value) {
    return String(value)
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, "");
}

// Default endpoint-side label-location anchors. NEAR_START is parsed by
// defaultInsetRatio() to derive the inset fraction; NEAR_END (0.95) is the
// symmetric result for bias=+1 and is defined here for documentation purposes
// only — it is never read directly in code.
const LINE_LABEL_LOCATION_NEAR_START = "0.05";
const LINE_LABEL_LOCATION_NEAR_END = "0.95";

/**
 * Line-family label tuning constants.
 *
 * These are intentionally centralized to make tuning explicit and auditable.
 * Adjust with corresponding geometry tests in
 * `src/test/prefigure/graph-prefigure-geometry.test.ts`.
 *
 * @property edgePaddingRatio Reserved inset to reduce visible clipping at bounds.
 * @property endpointOffsetPixels Endpoint-anchor inset in screen pixels.
 * @property sideBiasHardening Factor k applied to the tangent–intent dot product; k=sqrt(2) locks 90-degree sectors, k=1 gives fully smooth interpolation.
 */
export const lineLabelTuning = Object.freeze({
    edgePaddingRatio: 0.02,
    endpointOffsetPixels: 12,
    sideBiasHardening: Math.SQRT2,
});

const LINE_LABEL_EDGE_PADDING_RATIO = lineLabelTuning.edgePaddingRatio;
const LINE_LABEL_ENDPOINT_OFFSET_PIXELS = lineLabelTuning.endpointOffsetPixels;
const LINE_LABEL_SIDE_BIAS_HARDENING = lineLabelTuning.sideBiasHardening;

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
 * Maps a line-family `labelPosition` to its preferred unit direction vector.
 *
 * The returned vector is in graph coordinates. Returns null for `center` and
 * any unrecognized position.
 */
function getPreferredDirectionForLabelPosition(labelPosition) {
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
 * Projects the unit segment tangent onto `preferredDirection`, multiplies by
 * the hardening factor, and clamps to [-1, 1]. Positive bias means ep2 side;
 * negative means ep1 side; zero means center.
 */
function biasFromPreferredDirection(
    preferredDirection,
    ep1,
    ep2,
    { hardening = LINE_LABEL_SIDE_BIAS_HARDENING } = {},
) {
    const dx = ep2[0] - ep1[0];
    const dy = ep2[1] - ep1[1];
    const segmentLength = Math.hypot(dx, dy);
    if (!(segmentLength > 0)) {
        return 0;
    }
    const tx = dx / segmentLength;
    const ty = dy / segmentLength;
    const agreement = tx * preferredDirection[0] + ty * preferredDirection[1];
    return Math.max(-1, Math.min(1, hardening * agreement));
}

/**
 * Returns the default endpoint inset ratio used by `locationFromBiasAndInset`.
 *
 * Parses `LINE_LABEL_LOCATION_NEAR_START` as a [0, 0.5] fraction so the
 * two constants stay in sync: a bias of -1 yields `insetRatio` (e.g. 0.05)
 * and a bias of +1 yields `1 - insetRatio` (e.g. 0.95 = `LINE_LABEL_LOCATION_NEAR_END`).
 * Falls back to 0.05 if the constant is absent or malformed.
 */
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
 * Returns a continuous side preference in [-1, 1] for line-family
 * `labelPosition`.
 *
 * All non-center positions project the oriented segment tangent onto a
 * preferred unit direction vector. The dot product is multiplied by a
 * hardening factor and clamped so the result transitions smoothly as
 * the segment rotates.
 */
function chooseEndpointBiasForLabelPosition(labelPosition, ep1, ep2) {
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
 * `labelPosition` is the Doenet label position string (normalized internally).
 * `location` is the label-location in [0, 1]; values above 0.5 correspond to
 * the ep2 side, below 0.5 to the ep1 side. The `h` component of diagonal
 * candidates (`ne`/`nw`/`se`/`sw`) is derived from this to keep the label
 * extending back along the visible segment rather than off the edge.
 *
 * `preferNorth` determines whether the graph-direction intent lies on the
 * local north (`n`) or south (`s`) side of the segment.
 * Candidate order matters: earlier entries are preferred, later entries are
 * only considered when overflow forces a fallback.
 */
function getLineAlignmentCandidates(
    labelPosition,
    location,
    preferNorth = true,
) {
    const pos = normalizeKey(labelPosition ?? "");
    if (!pos || !KNOWN_LINE_POSITIONS.has(pos)) {
        return null;
    }

    if (pos === "center") {
        return ["n", "s"];
    }

    const h = location >= 0.5 ? "w" : "e";
    const oppositeH = h === "w" ? "e" : "w";
    const primary = preferNorth ? "n" : "s";
    const secondary = preferNorth ? "s" : "n";

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
 * Evaluates one candidate alignment against graph bounds.
 *
 * Returns the predicted overflow amount after applying graph-edge padding.
 * A zero overflow score means the candidate stays within the safe inset box.
 */
function evaluateLineAlignmentOverflow({
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
        return { overflowScore: 0 };
    }

    const anchor = lineLabelAnchorPoint({ ep1, ep2, location });
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

    const overflowScore =
        overflowLeft + overflowRight + overflowBottom + overflowTop;

    return { overflowScore };
}

/**
 * Selects the best alignment for the requested line-family label position.
 *
 * Queries `getLineAlignmentCandidates` for an ordered preference list, then
 * evaluates each candidate via `evaluateLineAlignmentOverflow`. The first
 * non-overflow candidate wins immediately. If all candidates overflow, the
 * candidate with minimum overflow wins.
 *
 * `location` is the label-location in [0, 1] used for scoring; it may differ
 * from the emitted value when callers remap clipped-segment anchors (see
 * `lineLabelAlignmentLocationOverride` in `lineLabelAttributes`).
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
}) {
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
        if (result.overflowScore === 0) {
            return candidate;
        }
        if (result.overflowScore < minimumOverflow) {
            bestAlignment = candidate;
            minimumOverflow = result.overflowScore;
        }
    }

    return bestAlignment;
}

/**
 * Resolves the effective alignment policy requested by the caller.
 *
 * Ray mode is normalized to endpoint-mode so clipped one-ended segments use a
 * single alignment policy regardless of which side remains visible.
 */
function resolveAlignmentMode(stateValues) {
    const baseMode = stateValues?.lineLabelAlignmentMode ?? "line";
    if (baseMode !== "ray") {
        return baseMode;
    }

    return "endpoint";
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
 * By default, endpoint-side positions use edge-near insets (0.05 near ep1,
 * 0.95 near ep2, per `LINE_LABEL_LOCATION_NEAR_START` / `LINE_LABEL_LOCATION_NEAR_END`)
 * rather than hard 0/1 so non-center labels anchor near the selected endpoint.
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
 * - `lineLabelAlignmentMode`: requested alignment policy (`ray` is normalized
 *   to endpoint-style alignment during resolution).
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
        const resolvedMode = resolveAlignmentMode(stateValues);
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
