import type { ValidValueEntry } from "@doenet/static-assets/schema";

export type { ValidValueEntry };

/**
 * Normalize a raw `validValues` declaration — which may mix bare strings and
 * `{value, description}` objects — into a uniform array of objects. All
 * downstream consumers (validation, schema generation, autocomplete, help)
 * read through this so they can always treat entries as objects.
 */
export function normalizeValidValues(
    raw: Array<string | ValidValueEntry> | undefined,
): ValidValueEntry[] {
    if (!raw) return [];
    return raw.map((entry) =>
        typeof entry === "string" ? { value: entry } : entry,
    );
}
