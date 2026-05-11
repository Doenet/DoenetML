/**
 * A normalized `validValues` entry: always carries a `value` and an optional
 * `description`. Producer code may declare each entry as either a bare string
 * or a `{value, description}` object — consumers should always go through
 * `normalizeValidValues` to get a uniform shape.
 */
export type ValidValueEntry = { value: string; description?: string };

export function normalizeValidValues(
    raw: Array<string | ValidValueEntry> | undefined,
): ValidValueEntry[] {
    if (!raw) return [];
    return raw.map((entry) =>
        typeof entry === "string" ? { value: entry } : entry,
    );
}
