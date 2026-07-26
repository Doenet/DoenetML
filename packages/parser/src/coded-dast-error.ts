import type { DiagnosticArgs, DiagnosticCode } from "@doenet/i18n";
import type { DastError, Position } from "./types";

/**
 * Build a DAST error node that names what went wrong, as well as saying it.
 *
 * The parser's counterpart to `codedDiagnostic` in `@doenet/utils`, with one
 * deliberate difference: the caller passes the English `message` instead of
 * having it rendered from the catalog.
 *
 * ## Why the English is written here and not read from the catalog
 *
 * `@doenet/utils` can render its own English because nothing minds it
 * carrying `@doenet/i18n`. `@doenet/parser` cannot: `@doenet/lsp` imports it,
 * and the built language server is embedded verbatim in `@doenet/codemirror`
 * and started as a blob worker, so every byte is on the editor's critical path
 * before the first cursor-help request can be answered. Rendering from the
 * catalog reaches `EN_CATALOG_SOURCE` — every English namespace joined, about
 * 50 KB of text, 16 KB gzipped — plus the Fluent runtime to read it, all for a
 * bundle that renders no messages, which is why
 * `scripts/check-server-bundle.mjs` in that package fails outright if one
 * arrives rather than budgeting for it.
 *
 * So the English lives in two places, and the risk that they drift is real. It
 * is held down by `test/coded-dast-errors.test.ts`, which parses a corpus of
 * broken DoenetML and asserts that every coded error it produces renders,
 * through the catalog, to exactly the string the parser wrote. That test is
 * where `@doenet/i18n` is a genuine (dev) dependency; nothing in `src/` imports
 * anything but its types.
 *
 * ## What the code buys, given the message is already there
 *
 * Three things the message alone cannot do. The worker's `_error` pipeline
 * re-surfaces every parser error as a runtime diagnostic, which `DocViewer`
 * re-renders in the reader's `uiLocale` — so a coded parser error is the first
 * thing a beginner sees, in their own language. The language server sends its
 * own copy of the same error, and `dedupeLspDiagnostics` needs the code to
 * recognize the two as one once they stop being the same string. And a code is
 * a permanent name: what a bug report cites and what documentation will hang
 * off (#1548).
 *
 * Optional fields are omitted rather than set to `undefined`, so a coded error
 * serializes to the same JSON an uncoded one does apart from what it is
 * actually carrying — these cross into Rust and back.
 */
export function codedDastError({
    code,
    message,
    args,
    position,
    error_type,
    source_doc,
}: {
    code: DiagnosticCode;
    /** The English rendering of `code` with `args` applied. */
    message: string;
    args?: DiagnosticArgs;
    position?: Position;
    /** Defaults to `"error"` downstream, exactly as an uncoded node does. */
    error_type?: DastError["error_type"];
    source_doc?: number;
}): DastError {
    return {
        type: "error",
        message,
        code,
        ...(args === undefined ? {} : { args }),
        ...(position === undefined ? {} : { position }),
        ...(error_type === undefined ? {} : { error_type }),
        ...(source_doc === undefined ? {} : { source_doc }),
    };
}
