import {
    formatEnglishDiagnostic,
    isDiagnosticCode,
    type DiagnosticArgs,
    type DiagnosticCode,
} from "@doenet/i18n";

/**
 * Re-exported from `@doenet/utils`, where it now lives beside the
 * `DiagnosticRecord` it builds.
 *
 * The worker is no longer the only place that raises a coded diagnostic — the
 * style-contrast checks in `@doenet/utils` do too — and a record assembled two
 * different ways in two packages is a record whose shape can drift. Kept
 * exported from here so the ~150 call sites that import it from this module
 * are unaffected by where it lives.
 */
export { codedDiagnostic } from "@doenet/utils";

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
