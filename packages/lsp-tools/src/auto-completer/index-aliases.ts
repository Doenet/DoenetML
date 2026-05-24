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
 * itself; each `[…]` it carries consumes one dimension (`points[1]`
 * consumes 1; `controlVectors[0][2]` consumes 2 — important for 3D arrays
 * like `Curve.controlVectors` whose `indexAliases` is `[[], [], ["x","y","z"]]`).
 * Each subsequent segment then consumes dimensions via either:
 *   - one or more bracket indices (consume `numIndices` dims, name unused), or
 *   - a name that appears in `indexAliases[currentDim]` (consumes 1 dim).
 *
 * Returns the number of dims consumed and the alias names captured (in dim
 * order), or `null` on any mismatch — an unindexed segment whose name
 * isn't in the alias table for the current dim, or indices that push past
 * the array's `numDimensions`. The caller decides whether `dim === numDims`
 * is required (help: a full chase) or whether a partial walk is OK
 * (autocomplete: needs the dim cursor so it can offer the next dim's aliases).
 */
export function walkIndexAliases(
    arrayProp: SchemaProperty,
    segments: Array<{ name: string; numIndices: number }>,
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

    // First segment is the array-prop name itself; only its bracket
    // indices consume dims (the name IS the array prop).
    let dim = segments[0].numIndices;
    if (dim > numDims) return null;
    const aliasPath: string[] = [];

    for (let i = 1; i < segments.length; i++) {
        const seg = segments[i];
        if (seg.numIndices > 0) {
            // One or more numeric indices — each consumes a dim regardless
            // of name. The author's literal bracket values survive in the
            // panel via the resolver's `displayTail` (built from
            // `rawPathParts`), so we don't need to record anything here.
            dim += seg.numIndices;
            if (dim > numDims) return null;
            continue;
        }
        if (dim >= numDims) return null;
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
    segments: Array<{ name: string; numIndices: number }>,
): { aliasPath: string[] } | null {
    const walked = walkIndexAliases(arrayProp, segments);
    if (!walked) return null;
    if (walked.dim !== walked.numDims) return null;
    return { aliasPath: walked.aliasPath };
}

/**
 * Pull the leaf (fully-consumed) entry type from `indexedArrayDescription`.
 * Each entry in `indexedArrayDescription` describes one dimension's slice;
 * the last entry is the scalar that remains after every dim is consumed.
 * For `<vector>.head` (1D) that's `"math"`; for `<line>.points` (2D) it's
 * also `"math"` (the coord scalar inside `points[1].x`), NOT `"point"`
 * (the 1D slice at `points[1]`). The panel uses this to label
 * `$line.points[1].x` as `Type: <math>`, which is what the author actually
 * gets at runtime.
 *
 * May return undefined when the array slot was emitted without a
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
