import {
    formatEnglishDiagnostic,
    type DiagnosticArgs,
    type DiagnosticCode,
} from "@doenet/i18n";
import type {
    DiagnosticLevel,
    DiagnosticRecord,
    Position,
} from "@doenet/utils";

/**
 * Build a diagnostic from its stable code and the values that fill it in.
 *
 * The alternative to a record whose message is a literal English string. Both
 * shapes are valid records and both keep working — that is what lets the ~200
 * messages still holding a literal migrate a few at a time rather than all at
 * once (#1518). The coded form additionally carries the code and the arguments
 * to the main thread, where the message can be rendered in the reader's
 * language. `packages/i18n/README.md` shows the before and after.
 *
 * Do not write an example call in a comment here: `lint:i18n` counts a `code`
 * property naming a diagnostic code, and a `type` property naming a severity,
 * wherever they appear — comments included — so an illustration would land in
 * the migration burn-down as if it were a real call site.
 *
 * `message` is filled in from the English catalog rather than by the caller,
 * so the English and the catalog cannot drift, and everything that reads
 * `message` inside the worker — the dedupe in `DiagnosticsManager`, the tests
 * that assert exact strings — sees what it saw before. (`DocViewer` re-renders
 * it in `uiLocale` on the way out, which is the whole point; that is the one
 * consumer for which it is deliberately not the same string.)
 *
 * Note that the reader's language is `uiLocale`, not the `documentLocale` the
 * core computes content in: a diagnostic is addressed to whoever is looking at
 * the screen, not to the document. The worker has no business knowing it, and
 * doesn't — it emits English plus the pieces, and the main thread decides.
 */
export function codedDiagnostic({
    type,
    code,
    args,
    position,
    sourceDoc,
    level,
}: {
    type: DiagnosticRecord["type"];
    code: DiagnosticCode;
    args?: DiagnosticArgs;
    position?: Position;
    sourceDoc?: number;
    /** Required when `type` is `"accessibility"`, meaningless otherwise. */
    level?: DiagnosticLevel;
}): DiagnosticRecord {
    // Optional fields are omitted rather than set to `undefined`, so a coded
    // record has the same shape a legacy one does and anything comparing or
    // serializing whole records sees no keys that aren't carrying anything.
    //
    // The cast is for the accessibility branch: `level` is required there and
    // meaningless elsewhere, which the caller knows and the union cannot infer
    // from a `type` that is still the whole union at this point.
    return {
        type,
        message: formatEnglishDiagnostic(code, args),
        code,
        ...(args === undefined ? {} : { args }),
        ...(position === undefined ? {} : { position }),
        ...(sourceDoc === undefined ? {} : { sourceDoc }),
        ...(level === undefined ? {} : { level }),
    } as DiagnosticRecord;
}
