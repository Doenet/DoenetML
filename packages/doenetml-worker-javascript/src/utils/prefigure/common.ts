import type {
    Descendant,
    GraphBounds,
    Point,
    PushDiagnosticArgs,
    UsedHandles,
} from "./types";
import type { DiagnosticRecord } from "@doenet/utils";

/**
 * Escapes user-provided text for safe insertion into XML attributes/text nodes.
 */
export function escapeXml(value: unknown): string {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

/**
 * Coerces finite numeric values to Number and normalizes non-finite values to null.
 */
export function asFiniteNumber(value: unknown): number | null {
    return Number.isFinite(value) ? Number(value) : null;
}

/**
 * Formats a numeric value for PreFigure XML output.
 */
export function formatNumber(value: unknown): string | null {
    const num = asFiniteNumber(value);
    return num === null ? null : `${num}`;
}

/**
 * Converts a 2D point-like value to a PreFigure coordinate string `(x,y)`.
 * Returns null when coordinates are missing or non-finite.
 */
export function formatPoint(point: unknown): string | null {
    if (!Array.isArray(point) || point.length < 2) {
        return null;
    }

    const x = formatNumber(point[0]);
    const y = formatNumber(point[1]);

    if (x === null || y === null) {
        return null;
    }

    return `(${x},${y})`;
}

/**
 * Converts a 2D point-like value to a finite numeric point tuple.
 */
export function extractFinitePoint(point: unknown): Point | null {
    if (!Array.isArray(point) || point.length < 2) {
        return null;
    }

    const x = asFiniteNumber(point[0]);
    const y = asFiniteNumber(point[1]);

    if (x === null || y === null) {
        return null;
    }

    return [x, y];
}

/**
 * Converts a pair of point-like values into finite numeric point tuples.
 */
export function extractFinitePointPair(points: unknown): [Point, Point] | null {
    if (!Array.isArray(points) || points.length < 2) {
        return null;
    }

    const point1 = extractFinitePoint(points[0]);
    const point2 = extractFinitePoint(points[1]);

    if (point1 === null || point2 === null) {
        return null;
    }

    return [point1, point2];
}

function sanitizeHandle(value: unknown): string {
    return String(value)
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

/**
 * Creates a deterministic, XML-safe id for emitted PreFigure elements.
 *
 * Handles are based on component type when available and are made unique
 * against `usedHandles` to keep output stable across runs.
 */
export function createStableHandle(
    descendant: Descendant,
    index: number,
    usedHandles: UsedHandles,
): string {
    const stem = sanitizeHandle(`${descendant.componentType}_${index}`);
    let handle = stem || `graphical_${index}`;
    let suffix = 1;
    while (usedHandles.has(handle)) {
        suffix += 1;
        handle = `${stem}_${suffix}`;
    }
    usedHandles.add(handle);
    return handle;
}

/**
 * Builds a readable warning prefix for a descendant component.
 */
export function warningMessageForDescendant(
    descendant: Descendant | null | undefined,
): string {
    if (descendant?.componentName) {
        return `<${descendant.componentType}> (${descendant.componentName})`;
    }
    return `<${descendant?.componentType ?? "unknown"}>`;
}

/**
 * Pushes a warning record and attaches position when available.
 */
export function pushWarning({
    diagnostics,
    message,
    position,
}: PushDiagnosticArgs): void {
    const warning: DiagnosticRecord = {
        type: "warning",
        message,
    };
    if (position) {
        warning.position = position;
    }
    diagnostics.push(warning);
}

/**
 * Stable comparator used to keep generated XML ordering deterministic.
 */
export function sortDescendantsByOrder(a: Descendant, b: Descendant): number {
    if (Number.isFinite(a.componentIdx) && Number.isFinite(b.componentIdx)) {
        return (a.componentIdx as number) - (b.componentIdx as number);
    }
    return String(a.componentName ?? "").localeCompare(
        String(b.componentName ?? ""),
    );
}

/**
 * Validates and extracts scalar inputs for line-like clipping helpers.
 *
 * Checks that `point1`, `point2`, and `bounds` are arrays of sufficient length,
 * coerces all coordinates to finite numbers, and computes the direction vector
 * `(dx, dy)`. Returns null if any input is missing, non-finite, or degenerate
 * (zero-length direction). Otherwise returns `{ x0, y0, dx, dy, bxMin,
 * byMin, bxMax, byMax }` where `(x0, y0)` is `point1`, `(dx, dy)` is the
 * direction from `point1` to `point2`, and the `b*` values are the bbox bounds.
 */
interface NormalizeLineClipInputsArgs {
    point1: unknown;
    point2: unknown;
    bounds: unknown;
}

interface NormalizedLineClipInputs {
    x0: number;
    y0: number;
    dx: number;
    dy: number;
    bxMin: number;
    byMin: number;
    bxMax: number;
    byMax: number;
}

function normalizeLineClipInputs({
    point1,
    point2,
    bounds,
}: NormalizeLineClipInputsArgs): NormalizedLineClipInputs | null {
    if (
        !Array.isArray(point1) ||
        !Array.isArray(point2) ||
        point1.length < 2 ||
        point2.length < 2 ||
        !Array.isArray(bounds) ||
        bounds.length < 4
    ) {
        return null;
    }

    const x0 = asFiniteNumber(point1[0]);
    const y0 = asFiniteNumber(point1[1]);
    const x1 = asFiniteNumber(point2[0]);
    const y1 = asFiniteNumber(point2[1]);
    const bxMin = asFiniteNumber(bounds[0]);
    const byMin = asFiniteNumber(bounds[1]);
    const bxMax = asFiniteNumber(bounds[2]);
    const byMax = asFiniteNumber(bounds[3]);

    if (
        x0 === null ||
        y0 === null ||
        x1 === null ||
        y1 === null ||
        bxMin === null ||
        byMin === null ||
        bxMax === null ||
        byMax === null
    ) {
        return null;
    }

    const dx = x1 - x0;
    const dy = y1 - y0;
    if (dx === 0 && dy === 0) {
        return null;
    }

    return { x0, y0, dx, dy, bxMin, byMin, bxMax, byMax };
}

/**
 * Clips parameterized line geometry `p + t*v` against an axis-aligned bbox.
 *
 * `tMin`/`tMax` select geometry type:
 * - line: `(-Infinity, Infinity)`
 * - ray: `(0, Infinity)`
 * - segment: `(0, 1)`
 *
 * Returns `[startPoint, endPoint]` in user coordinates, or null if the
 * geometry does not intersect the bbox within the given parameter range.
 */
interface ClipLineLikeToBoundsArgs {
    point1: unknown;
    point2: unknown;
    bounds: GraphBounds | unknown;
    tMin: number;
    tMax: number;
}

export function clipLineLikeToBounds({
    point1,
    point2,
    bounds,
    tMin,
    tMax,
}: ClipLineLikeToBoundsArgs): [Point, Point] | null {
    const inputs = normalizeLineClipInputs({ point1, point2, bounds });
    if (!inputs) {
        return null;
    }

    // (x0, y0): start of the parametric line (point1)
    // (dx, dy): direction vector from point1 to point2
    // the `b*`: the bbox bound
    const { x0, y0, dx, dy, bxMin, byMin, bxMax, byMax } = inputs;

    // clippedTMin/clippedTMax: parameter range narrowed to the visible bbox
    let clippedTMin = tMin;
    let clippedTMax = tMax;

    const updateRange = (
        p0: number,
        delta: number,
        minBound: number,
        maxBound: number,
    ): boolean => {
        if (delta !== 0) {
            let ta = (minBound - p0) / delta;
            let tb = (maxBound - p0) / delta;
            if (ta > tb) {
                [ta, tb] = [tb, ta];
            }
            clippedTMin = Math.max(clippedTMin, ta);
            clippedTMax = Math.min(clippedTMax, tb);
            return clippedTMin <= clippedTMax;
        }

        return p0 >= minBound && p0 <= maxBound;
    };

    if (!updateRange(x0, dx, bxMin, bxMax)) {
        return null;
    }
    if (!updateRange(y0, dy, byMin, byMax)) {
        return null;
    }

    return [
        [x0 + clippedTMin * dx, y0 + clippedTMin * dy],
        [x0 + clippedTMax * dx, y0 + clippedTMax * dy],
    ];
}
