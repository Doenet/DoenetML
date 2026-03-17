/**
 * Escapes user-provided text for safe insertion into XML attributes/text nodes.
 */
export function escapeXml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

/**
 * Coerces finite numeric values to Number and normalizes non-finite values to null.
 */
export function asFiniteNumber(value) {
    return Number.isFinite(value) ? Number(value) : null;
}

/**
 * Formats a numeric value for XML serialization.
 */
export function formatNumber(value) {
    const num = asFiniteNumber(value);
    return num === null ? null : `${num}`;
}

/**
 * Converts a 2D point-like value to a PreFigure coordinate string `(x,y)`.
 * Returns null when coordinates are missing or non-finite.
 */
export function formatPoint(point) {
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

function sanitizeHandle(value) {
    return String(value)
        .toLowerCase()
        .replaceAll(/[^a-z0-9_-]+/g, "-")
        .replaceAll(/-+/g, "-")
        .replaceAll(/^-|-$/g, "");
}

/**
 * Creates a deterministic, XML-safe id for emitted PreFigure elements.
 *
 * Handles are based on component type/name when available and are made unique
 * against `usedHandles` to keep output stable across runs.
 */
export function createStableHandle(descendant, index, usedHandles) {
    const stem = sanitizeHandle(
        `${descendant.componentType}-${descendant.componentName ?? index}`,
    );
    let handle = stem || `graphical-${index}`;
    let suffix = 1;
    while (usedHandles.has(handle)) {
        suffix += 1;
        handle = `${stem}-${suffix}`;
    }
    usedHandles.add(handle);
    return handle;
}

/**
 * Builds a readable warning prefix for a descendant component.
 */
export function warningMessageForDescendant(descendant) {
    if (descendant?.componentName) {
        return `<${descendant.componentType}> (${descendant.componentName})`;
    }
    return `<${descendant?.componentType ?? "unknown"}>`;
}

/**
 * Pushes a warning record and attaches position when available.
 */
export function pushWarning({ warnings, message, position }) {
    const warning = {
        type: "warning",
        level: 1,
        message,
    };
    if (position) {
        warning.position = position;
    }
    warnings.push(warning);
}

/**
 * Stable comparator used to keep generated XML ordering deterministic.
 */
export function sortDescendantsByOrder(a, b) {
    if (Number.isFinite(a.componentIdx) && Number.isFinite(b.componentIdx)) {
        return a.componentIdx - b.componentIdx;
    }
    return String(a.componentName ?? "").localeCompare(
        String(b.componentName ?? ""),
    );
}

/**
 * Normalizes point/bounds inputs for line-like clipping helpers.
 */
function normalizeLineClipInputs({ point1, point2, bounds }) {
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

    if ([x0, y0, x1, y1, bxMin, byMin, bxMax, byMax].some((x) => x === null)) {
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
 */
function clipLineLikeToBounds({ point1, point2, bounds, tMin, tMax }) {
    const inputs = normalizeLineClipInputs({ point1, point2, bounds });
    if (!inputs) {
        return null;
    }

    const { x0, y0, dx, dy, bxMin, byMin, bxMax, byMax } = inputs;

    let clippedTMin = tMin;
    let clippedTMax = tMax;

    const updateRange = (p0, delta, minBound, maxBound) => {
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

/**
 * Clips a ray `p + t*v`, `t >= 0` to an axis-aligned bbox.
 * Returns `[startPoint, endPoint]` in user coordinates, or null if no intersection.
 */
export function clipRayToBounds({ endpoint, throughpoint, bounds }) {
    return clipLineLikeToBounds({
        point1: endpoint,
        point2: throughpoint,
        bounds,
        tMin: 0,
        tMax: Infinity,
    });
}

/**
 * Clips an infinite line through two points to an axis-aligned bbox.
 * Returns `[startPoint, endPoint]` in user coordinates, or null if no intersection.
 */
export function clipInfiniteLineToBounds({ point1, point2, bounds }) {
    return clipLineLikeToBounds({
        point1,
        point2,
        bounds,
        tMin: -Infinity,
        tMax: Infinity,
    });
}

/**
 * Clips a finite segment between two points to an axis-aligned bbox.
 * Returns `[startPoint, endPoint]` in user coordinates, or null if no intersection.
 */
export function clipSegmentToBounds({ point1, point2, bounds }) {
    return clipLineLikeToBounds({
        point1,
        point2,
        bounds,
        tMin: 0,
        tMax: 1,
    });
}
