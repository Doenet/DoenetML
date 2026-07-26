import type { Diagnostic } from "vscode-languageserver-protocol";

/**
 * Drop diagnostics that already appear in the list at the same
 * `severity` and `range`, identified by their stable `code` where they
 * have one and by their `message` where they don't.
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
 * ## Why the message alone is not enough
 *
 * The two copies stopped being the same string.  A worker diagnostic
 * that has migrated to the catalogs (#1518) is re-rendered in the
 * reader's `uiLocale` by `DocViewer` before it is forwarded, while the
 * parser-side copy `extractDastErrors` produces is whatever the parser
 * wrote.  Keying on the message alone, a Spanish echo and an English
 * original are two diagnostics, and the hover shows the same problem
 * twice in two languages.  Their codes are equal, so the code key
 * catches what the message key cannot.
 *
 * Each record therefore claims *both* keys, and matching either one is
 * a duplicate.  That is what carries the migration: a coded record and
 * a not-yet-coded one still collapse while they agree on the English,
 * so a diagnostic can gain a code on one side before the other without
 * duplicating in between.
 *
 * Keys are compared only within a `severity`+`range` pair, so a code
 * key asserts no more than "the same situation, reported at the same
 * span, twice".
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
        const keys = diagnosticKeys(d);
        let existing: number | undefined;
        for (const key of keys) {
            existing = indexByKey.get(key);
            if (existing !== undefined) {
                break;
            }
        }
        if (existing !== undefined) {
            out[existing] = mergeMissingFields(out[existing], d);
            // The keeper takes over the duplicate's keys as well, so a
            // third copy matching either one folds into the same entry
            // rather than starting a second.  Existing claims are left
            // alone: the first record to claim a key owns it.
            for (const key of keys) {
                if (!indexByKey.has(key)) {
                    indexByKey.set(key, existing);
                }
            }
            continue;
        }
        for (const key of keys) {
            indexByKey.set(key, out.length);
        }
        out.push(d);
    }
    return out;
}

/**
 * A stable diagnostic code as `@doenet/i18n` issues them
 * (`doenet-w0001`, `doenet-e0001`, …).
 *
 * Matched by shape rather than against the registry because the
 * language server must not depend on `@doenet/i18n` — that is the
 * import boundary #1553 put a test around, and pulling the catalogs in
 * to answer a string-shape question would undo it.  A code that is
 * well-formed but unregistered is impossible in practice (`lint:i18n`
 * rejects one at the call site) and harmless here anyway: an unknown
 * code just identifies itself.
 *
 * The shape check is also what keeps `code` values that are *not*
 * diagnostic identities out of the key.  `toAdditionalDiagnosticsForLsp`
 * labels accessibility records `accessibility-level-1` / `-2`, which
 * names a category and not a situation — two different accessibility
 * problems reported at one span share it, and keying on it would merge
 * them into one.
 */
const DOENET_DIAGNOSTIC_CODE = /^doenet-[a-z]\d+$/;

/**
 * The keys this diagnostic dedupes on, most specific first.
 *
 * Always its message; additionally its code when it carries one.
 */
function diagnosticKeys(d: Diagnostic): string[] {
    // `severity` is optional in the LSP type; collapse undefined to a
    // stable sentinel so two records that both omit it dedupe together.
    const sev = d.severity ?? "?";
    const s = d.range.start;
    const e = d.range.end;
    const location = `${sev}|${s.line}:${s.character}-${e.line}:${e.character}`;
    const keys = [`${location}|m:${d.message}`];
    if (typeof d.code === "string" && DOENET_DIAGNOSTIC_CODE.test(d.code)) {
        keys.unshift(`${location}|c:${d.code}`);
    }
    return keys;
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
