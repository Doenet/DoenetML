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
