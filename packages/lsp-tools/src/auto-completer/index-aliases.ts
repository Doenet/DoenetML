/**
 * Helpers for walking `indexAliases` chains on array state variables —
 * shared between the help layer (`computeContextHelp`) and the autocomplete
 * layer (`get-completion-items`) so a coordinate-style chain like
 * `$vector.head.x` produces both a completion row AND matching help.
 *
 * The chase is intentionally limited to the alias table: it never consults
 * the array entry's `type` to expose properties of the inner component
 * (e.g. `<point>` for `$line.points[1]`). That keeps the editor in lockstep
 * with the runtime, which also resolves only what the alias table covers
 * — so `$vector.head.hidden` continues to produce nothing in either layer.
 * Issue #1180.
 */

import type { SchemaProperty } from "./index";

/**
 * Walk a `$container.arrayProp[…].alias…` chain against an array
 * property's `indexAliases` table. The first segment is the array prop
 * itself; if it carries a bracket index (`arrayProp[1]`), that consumes
 * one dimension. Each subsequent segment then consumes one more dimension
 * via either:
 *   - a bracket index (always valid, no name check), or
 *   - a name that appears in `indexAliases[currentDim]`.
 *
 * Returns the number of dims consumed and the alias names captured (in dim
 * order), or `null` on any mismatch (e.g. an unindexed segment whose name
 * isn't in the alias table for the current dim, or more segments than the
 * array has dims). The caller decides whether `dim === numDims` is required
 * (help: a full chase) or whether a partial walk is OK (autocomplete:
 * needs the dim cursor so it can offer the next dim's aliases).
 */
export function walkIndexAliases(
    arrayProp: SchemaProperty,
    segments: Array<{ name: string; hasIndex: boolean }>,
): { dim: number; numDims: number; aliasPath: string[] } | null {
    // `isArray` is optional on the local schema type but always defined for
    // generator-emitted props — treat anything missing as not-an-array.
    if (!arrayProp.isArray) return null;
    const numDims = arrayProp.numDimensions ?? 1;
    const aliases = arrayProp.indexAliases;
    // Without an alias table, names can never resolve — only pure-index
    // chains would succeed, which the property-help path already covers.
    if (!aliases || aliases.length === 0) return null;
    if (segments.length === 0) return null;

    let dim = 0;
    const aliasPath: string[] = [];

    // First segment is the array-prop name itself; consume a dim only if
    // it carried a bracket index (e.g. `points[1]`).
    if (segments[0].hasIndex) {
        dim++;
    }

    for (let i = 1; i < segments.length; i++) {
        if (dim >= numDims) return null;
        const seg = segments[i];
        if (seg.hasIndex) {
            // Numeric index — consumes a dim regardless of name. Don't
            // record an aliasPath entry; the panel's `arrayHasIndex` plus
            // the rendered `[N]` already carry the information.
            dim++;
            continue;
        }
        const aliasesForDim = aliases[dim] ?? [];
        if (!aliasesForDim.includes(seg.name)) return null;
        aliasPath.push(seg.name);
        dim++;
    }

    return { dim, numDims, aliasPath };
}

/**
 * Help-side variant: require every dim consumed exactly once with no
 * leftover segments. Returns the alias names captured along the chain.
 */
export function chaseIndexAliases(
    arrayProp: SchemaProperty,
    segments: Array<{ name: string; hasIndex: boolean }>,
): { aliasPath: string[] } | null {
    const walked = walkIndexAliases(arrayProp, segments);
    if (!walked) return null;
    if (walked.dim !== walked.numDims) return null;
    return { aliasPath: walked.aliasPath };
}

/**
 * Pull the innermost (deepest) entry type from `indexedArrayDescription`.
 * For a 1-dim array (`head`), this is the single entry's `type`; for a
 * 2-dim array (`points`), it's the inner-slice type ("point" for a
 * `points[1]` slice, which is what authors see when chasing through). May
 * return undefined when the array slot was emitted without a
 * `createComponentOfType` — the schema generator's
 * `createArrayElementDescription` legitimately omits `type` in that case.
 *
 * Display-only — never used to chase into the inner component's properties.
 */
export function deepestArrayEntryType(
    arrayProp: SchemaProperty,
): string | undefined {
    const desc = arrayProp.indexedArrayDescription;
    if (!desc || desc.length === 0) return undefined;
    return desc[desc.length - 1]?.type;
}
