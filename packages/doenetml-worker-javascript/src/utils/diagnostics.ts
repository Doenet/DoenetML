import {
    formatEnglishDiagnostic,
    isDiagnosticCode,
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

/**
 * An error that names its diagnostic by code rather than only by prose.
 *
 * Not every diagnostic is built as a record and handed to `addDiagnostic`.
 * A large family of them is *thrown*: `expandAllUnflattenedAttributes` and
 * its neighbours raise, the caller catches, and `convertToErrorComponent`
 * turns whatever was caught into an `_error` component whose message the
 * builder re-raises as an error diagnostic. Thrown as a bare `Error`, all
 * that survives the round trip is an English sentence — the main thread has
 * nothing to render in `uiLocale` with. Thrown as this, the code and its
 * arguments ride through the conversion intact.
 *
 * `message` is filled in from the English catalog, exactly as
 * {@link codedDiagnostic} does it, so a `catch` that reads `e.message` — and
 * every test asserting on one — sees what it saw before.
 *
 * Being an `Error` subclass is what makes it a drop-in at a `throw` site: the
 * `instanceof Error` checks and the `"message" in e` narrowing along these
 * paths all still hold.
 *
 * As with {@link codedDiagnostic}, do not write an example construction in a
 * comment in a scanned source file: `lint:i18n` counts a `new` of this class
 * wherever it appears in source text — comments included — so an illustration
 * would land in the migration burn-down as if it were a real throw site.
 * `packages/i18n/README.md` is not scanned, which is where the example lives.
 */
export class DiagnosticError extends Error {
    readonly code: DiagnosticCode;
    readonly args?: DiagnosticArgs;

    constructor({
        code,
        args,
    }: {
        code: DiagnosticCode;
        args?: DiagnosticArgs;
    }) {
        super(formatEnglishDiagnostic(code, args));
        // A subclass inherits `Error.prototype.name`, so without this it
        // would present itself as a plain `Error` in a stack trace or a
        // `console.error` — and this codebase does narrow on `e.name`
        // elsewhere (`MathInput`'s `"ParseError"` check).
        this.name = "DiagnosticError";
        this.code = code;
        if (args !== undefined) {
            this.args = args;
        }
    }
}

/**
 * The code and arguments a caught value carries, if it carries any.
 *
 * Structural rather than an `instanceof DiagnosticError` test, because the
 * shape arrives from more than one place: a thrown {@link DiagnosticError},
 * the `{message, code?, args?}` result `convertToErrorComponent` returns, the
 * `state` of an already-built `_error` component being read back in
 * `ComponentBuilder`, and a diagnostic record off the state-variable queue.
 * All of them should keep the code, and only the first is ever the class —
 * the rest are plain objects, and an `instanceof` across a bundle boundary is
 * not something to depend on anyway.
 *
 * An unregistered code is treated as no code at all, so a `code` property on
 * some unrelated thrown object can't smuggle itself onto a diagnostic record
 * and out to a formatter that will not resolve it.
 */
export function diagnosticCodeFrom(value: unknown): {
    code?: DiagnosticCode;
    args?: DiagnosticArgs;
} {
    if (typeof value !== "object" || value === null || !("code" in value)) {
        return {};
    }

    const code = (value as { code: unknown }).code;
    if (typeof code !== "string" || !isDiagnosticCode(code)) {
        return {};
    }

    const args = (value as { args?: unknown }).args;
    const argsAreUsable =
        typeof args === "object" && args !== null && !Array.isArray(args);

    return {
        code,
        ...(argsAreUsable ? { args: args as DiagnosticArgs } : {}),
    };
}
