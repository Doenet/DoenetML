import type { Diagnostic } from "vscode-languageserver-protocol";

/**
 * Drop diagnostics that already appear in the list with the same
 * `severity`, `message`, and `range` (start + end line/character).
 *
 * The LSP server (`@doenet/lsp` `validateTextDocument`) merges three
 * independent sources — `extractDastErrors(sourceObj.dast)`,
 * `getSchemaViolations()`, and worker-pushed `additionalDiagnostics`
 * — and the worker's `_error`-component pipeline re-surfaces parser
 * DAST errors as runtime diagnostics, so the same record arrives via
 * two paths whenever a parser DAST error fires.  Without this dedupe
 * the editor's hover renders the message twice even though only one
 * squiggle is drawn (the Diagnostics tab already dedupes on its own).
 *
 * Keeps the first occurrence; later duplicates are folded in.  Optional
 * metadata fields not part of the dedupe key (`code`, `codeDescription`,
 * `source`, `tags`, `relatedInformation`, `data`) are copied from the
 * later duplicate into the keeper when the keeper has them undefined,
 * so a quick-fix payload added by only one of the merge paths isn't
 * silently dropped.  When the keeper already has every mergeable field
 * defined, the original object is returned unchanged (identity is
 * preserved, which the existing UX assumes).
 */
export function dedupeLspDiagnostics(
    diagnostics: readonly Diagnostic[],
): Diagnostic[] {
    const indexByKey = new Map<string, number>();
    const out: Diagnostic[] = [];
    for (const d of diagnostics) {
        const key = diagnosticKey(d);
        const existing = indexByKey.get(key);
        if (existing !== undefined) {
            out[existing] = mergeMissingFields(out[existing], d);
            continue;
        }
        indexByKey.set(key, out.length);
        out.push(d);
    }
    return out;
}

function diagnosticKey(d: Diagnostic): string {
    // `severity` is optional in the LSP type; collapse undefined to a
    // stable sentinel so two records that both omit it dedupe together.
    const sev = d.severity ?? "?";
    const s = d.range.start;
    const e = d.range.end;
    return `${sev}|${s.line}:${s.character}-${e.line}:${e.character}|${d.message}`;
}

/**
 * Optional `Diagnostic` fields that aren't part of the dedupe key.  If
 * the keeper is missing one and a later duplicate carries it, fill it
 * in so distinct-source duplicates don't silently lose metadata (e.g.
 * a quick-fix `data` payload on only the worker echo).
 */
const MERGEABLE_FIELDS = [
    "code",
    "codeDescription",
    "source",
    "tags",
    "relatedInformation",
    "data",
] as const satisfies readonly (keyof Diagnostic)[];

function mergeMissingFields(keeper: Diagnostic, dup: Diagnostic): Diagnostic {
    let merged: Diagnostic | null = null;
    for (const field of MERGEABLE_FIELDS) {
        if (keeper[field] === undefined && dup[field] !== undefined) {
            if (merged === null) merged = { ...keeper };
            (merged as Record<string, unknown>)[field] = dup[field];
        }
    }
    return merged ?? keeper;
}
