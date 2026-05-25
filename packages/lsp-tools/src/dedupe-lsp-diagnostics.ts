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
 * Keeps the first occurrence; later duplicates are dropped.  Identity
 * fields not compared (e.g. `code`, `source`, `tags`) follow the
 * keeper, which is what the existing UX assumes.
 */
export function dedupeLspDiagnostics(
    diagnostics: readonly Diagnostic[],
): Diagnostic[] {
    const seen = new Set<string>();
    const out: Diagnostic[] = [];
    for (const d of diagnostics) {
        const key = diagnosticKey(d);
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
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
