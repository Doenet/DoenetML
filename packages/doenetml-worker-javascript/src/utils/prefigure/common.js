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
 * Clips a ray `p + t*v`, `t >= 0` to an axis-aligned bbox.
 * Returns `[startPoint, endPoint]` in user coordinates, or null if no intersection.
 */
export function clipRayToBounds({ endpoint, throughpoint, bounds }) {
    if (
        !Array.isArray(endpoint) ||
        !Array.isArray(throughpoint) ||
        endpoint.length < 2 ||
        throughpoint.length < 2 ||
        !Array.isArray(bounds) ||
        bounds.length < 4
    ) {
        return null;
    }

    const x0 = asFiniteNumber(endpoint[0]);
    const y0 = asFiniteNumber(endpoint[1]);
    const x1 = asFiniteNumber(throughpoint[0]);
    const y1 = asFiniteNumber(throughpoint[1]);
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

    let tMin = -Infinity;
    let tMax = Infinity;

    if (dx !== 0) {
        let tx0 = (bxMin - x0) / dx;
        let tx1 = (bxMax - x0) / dx;
        if (tx0 > tx1) {
            [tx0, tx1] = [tx1, tx0];
        }
        tMin = Math.max(tMin, tx0);
        tMax = Math.min(tMax, tx1);
    } else if (x0 < bxMin || x0 > bxMax) {
        return null;
    }

    if (dy !== 0) {
        let ty0 = (byMin - y0) / dy;
        let ty1 = (byMax - y0) / dy;
        if (ty0 > ty1) {
            [ty0, ty1] = [ty1, ty0];
        }
        tMin = Math.max(tMin, ty0);
        tMax = Math.min(tMax, ty1);
    } else if (y0 < byMin || y0 > byMax) {
        return null;
    }

    if (tMin > tMax) {
        return null;
    }

    const rayStart = Math.max(0, tMin);
    if (rayStart > tMax) {
        return null;
    }

    return [
        [x0 + rayStart * dx, y0 + rayStart * dy],
        [x0 + tMax * dx, y0 + tMax * dy],
    ];
}
