const SPECIAL_PROP_NAMES = new Set([
    "key",
    "ref",
    "__self",
    "__source",
    "children",
]);

/**
 * Adjust an attribute object to make sure no attribute names collide with special React attributes.
 * Any such collisions are prefixed with `pretext:` (which will be stripped away during printing).
 * For example `ref` becomes `pretext:ref`.
 */
export function normalizeAttrs<T extends Record<string, unknown>>(attrs: T): T {
    if (typeof attrs !== "object" || attrs === null) {
        return attrs;
    }
    return Object.fromEntries(
        Object.entries(attrs).map(([key, value]) => {
            if (SPECIAL_PROP_NAMES.has(key)) {
                return [`pretext:${key}`, value];
            }
            return [key, value];
        }),
    ) as T;
}

/**
 * Removes `pretext:` prefixes from attribute names.
 */
export function denormalizeAttrs<T extends Record<string, unknown>>(
    attrs: T,
): T {
    return Object.fromEntries(
        Object.entries(attrs).map(([key, value]) => {
            if (key.startsWith("pretext:")) {
                return [key.slice(8), value];
            }
            return [key, value];
        }),
    ) as T;
}
