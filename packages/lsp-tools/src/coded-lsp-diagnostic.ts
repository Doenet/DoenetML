import type { DiagnosticArgs, DiagnosticCode } from "@doenet/i18n";
import type {
    Diagnostic,
    DiagnosticSeverity,
    Range,
} from "vscode-languageserver/browser";

/**
 * Build an LSP diagnostic that names what went wrong, as well as saying it.
 *
 * The language server's counterpart to `codedDastError` in `@doenet/parser`,
 * and it makes the same trade for the same reason: the caller passes the
 * English `message` instead of having it rendered from the catalog.
 *
 * ## Why the English is written at the call site and not read from the catalog
 *
 * `@doenet/lsp-tools` is bundled into the language server, and
 * `@doenet/codemirror` embeds that built IIFE verbatim to start it as a blob
 * worker — so every byte is on the editor's critical path before the first
 * cursor-help request can be answered. Rendering from the catalog reaches
 * `EN_CATALOG_SOURCE`, every English namespace joined, plus the Fluent runtime
 * to read it, all for a bundle that renders no messages and has no locale to
 * render them in. `packages/lsp/scripts/check-server-bundle.mjs` fails
 * outright if either arrives rather than budgeting for it.
 *
 * So the English lives in two places, and the risk that they drift is real. It
 * is held down by `test/coded-schema-violations.test.ts`, which runs the
 * checker over a corpus of broken DoenetML and asserts that every coded
 * violation it produces renders, through the catalog, to exactly the string
 * the checker wrote. That test is where `@doenet/i18n` is a genuine (dev)
 * dependency; nothing in `src/` imports anything but its types.
 *
 * ## Where the code and arguments go
 *
 * `code` is the LSP's own field for the stable name of a diagnostic, and the
 * one a client reads to show or to link it (#1548). The arguments have no such
 * field, so they ride in `data` — the LSP's slot for payload a client hands
 * back later — under the same `{ args }` shape `validate.ts` uses for the
 * parser's errors and `toAdditionalDiagnosticsForLsp` uses for the worker's.
 * `dedupeLspDiagnostics` reads both: code plus arguments is what determines
 * the rendered message, so it is how two renderings of one diagnostic
 * recognize each other once they stop being the same string.
 *
 * `args` is omitted rather than set to `undefined` when there is nothing to
 * fill in, so a coded diagnostic serializes across the LSP connection as the
 * same JSON an uncoded one does apart from what it is actually carrying.
 */
export function codedLspDiagnostic({
    code,
    message,
    args,
    range,
    severity,
}: {
    code: DiagnosticCode;
    /** The English rendering of `code` with `args` applied. */
    message: string;
    args?: DiagnosticArgs;
    range: Range;
    severity: DiagnosticSeverity;
}): Diagnostic {
    return {
        range,
        message,
        severity,
        code,
        ...(args === undefined ? {} : { data: { args } }),
    };
}
