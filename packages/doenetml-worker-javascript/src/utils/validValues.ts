/**
 * A normalized `validValues` entry: always carries a `value` and an optional
 * `description`. Producer code may declare each entry as either a bare value
 * or a `{value, description}` object — consumers should always go through
 * `normalizeValidValues` to get a uniform shape.
 */
export type ValidValueEntry<T> = { value: T; description?: string };

export function normalizeValidValues<T>(
    raw: Array<T | { value: T; description?: string }> | undefined,
): ValidValueEntry<T>[] {
    if (!raw) return [];
    return raw.map((entry) =>
        entry !== null &&
        typeof entry === "object" &&
        "value" in (entry as object)
            ? (entry as ValidValueEntry<T>)
            : { value: entry as T },
    );
}
