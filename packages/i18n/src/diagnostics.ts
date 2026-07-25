/**
 * Stable diagnostic codes, and the formatter that turns one into a message.
 *
 * A diagnostic is produced in the worker, which knows what went wrong but not
 * what language the person looking at the screen reads — diagnostics answer to
 * `uiLocale`, and a nested `<document lang>` does not change who is reading.
 * So the worker emits a *code* plus the arguments that fill its blanks, and
 * carries the English rendering along as `message`; the main thread formats
 * the code in `uiLocale` and falls back to that English whenever it can't.
 *
 * That fallback is what makes the migration incremental. A record with no
 * `code` is a legacy diagnostic whose English string is all there is, and it
 * renders exactly as it does today; a record whose code has no translation in
 * the negotiated locale renders its English too. Both degrade to the status
 * quo rather than to a blank.
 *
 * ## Codes are append-only
 *
 * A code is a permanent name. It appears in the editor's problem list, it is
 * what someone searches for, and it is the anchor a documentation page will
 * hang off. `diagnostic-codes.lock.json` records every code ever issued and
 * `lint:i18n` fails if an entry changes or disappears, so a code can be
 * retired but never reused or renumbered.
 *
 * The letter records what the diagnostic was born as — `w` warning, `e` error,
 * `i` info, `a` accessibility. It is part of the name, not a live severity: a
 * diagnostic whose severity genuinely changes keeps its code, because the code
 * identifies the *situation*, and the emitting call site is what chooses the
 * `type` on the record.
 */
import { DEFAULT_LOCALE } from "./catalogs";
import type { MessageKey } from "./generated/messageKeys";
import { createTranslator, type Translator } from "./translator";

/**
 * Every diagnostic code, mapped to the message that renders it.
 *
 * `satisfies` against {@link MessageKey} is load-bearing: `messageKeys.ts` is
 * generated from the English catalogs, so a code pointing at a message that
 * doesn't exist is a type error rather than a runtime miss.
 *
 * Append new codes at the end of their range. Never renumber, never reuse.
 */
export const DIAGNOSTIC_CODES = {
    "doenet-i0001": "line-segment-attributes-ignored-with-endpoints",
    "doenet-i0002": "line-segment-midpoint-offset-without-midpoint",
    "doenet-i0003":
        "line-segment-attributes-ignored-with-endpoint-and-midpoint",

    "doenet-w0001": "line-points-undetermined-dimensions",
    "doenet-w0002": "line-points-too-few-dimensions",
    "doenet-w0003": "line-points-depend-on-variables",
    "doenet-w0004": "line-equation-invalid-format",
    "doenet-w0005": "ray-overprescribed-through",
    "doenet-w0006": "ray-dimension-mismatch",
    "doenet-w0007": "vector-overprescribed-head",
    "doenet-w0008": "vector-dimension-mismatch",
} as const satisfies Record<string, MessageKey>;

export type DiagnosticCode = keyof typeof DIAGNOSTIC_CODES;

/** The shape every code has to match: `doenet-` + severity letter + 4 digits. */
export const DIAGNOSTIC_CODE_PATTERN = /^doenet-[weia]\d{4}$/;

export function isDiagnosticCode(code: string): code is DiagnosticCode {
    return Object.prototype.hasOwnProperty.call(DIAGNOSTIC_CODES, code);
}

/**
 * A list argument, joined by `Intl.ListFormat` at format time rather than by
 * the code that produced it.
 *
 * The `type` picks which join: `conjunction` is the "a, b, and c" of a
 * sentence, `unit` the bare "a, b, c" of an enumeration. English differs
 * between them and other languages differ again, which is exactly why the
 * join cannot happen where the diagnostic is raised — it happens once the
 * reader's language is known.
 */
export type DiagnosticListArg = {
    list: readonly string[];
    type?: "conjunction" | "disjunction" | "unit";
};

export type DiagnosticArgValue =
    string | number | boolean | readonly string[] | DiagnosticListArg;

/**
 * Arguments filling a diagnostic message's blanks.
 *
 * Structured-cloneable on purpose: these cross the worker boundary as data, so
 * the main thread can re-render the message in a language the worker never
 * saw.
 */
export type DiagnosticArgs = Record<string, DiagnosticArgValue>;

/** The parts of a diagnostic record this module needs. */
export type FormattableDiagnostic = {
    message: string;
    code?: string;
    args?: DiagnosticArgs;
};

/**
 * Normalize the two list spellings — a bare array, or `{list, type}` — into
 * one. Reached only once the scalar cases are ruled out, so it is total.
 */
function toListArg(
    value: readonly string[] | DiagnosticListArg,
): DiagnosticListArg {
    return Array.isArray(value)
        ? { list: value }
        : (value as DiagnosticListArg);
}

/**
 * Lower {@link DiagnosticArgs} to what Fluent accepts.
 *
 * Fluent has no list type, so every list becomes a joined string. Each one
 * also contributes `<name>Count`, because a message that names a list almost
 * always has to agree a verb with how many things are in it, and a count the
 * catalog derives itself can never disagree with the list beside it.
 */
function lowerArgs(
    args: DiagnosticArgs | undefined,
    locale: string,
): Record<string, string | number> | undefined {
    if (args === undefined) {
        return undefined;
    }
    const lowered: Record<string, string | number> = {};
    for (const [name, value] of Object.entries(args)) {
        if (typeof value === "string" || typeof value === "number") {
            lowered[name] = value;
            continue;
        }
        if (typeof value === "boolean") {
            lowered[name] = String(value);
            continue;
        }
        const listArg = toListArg(value);
        lowered[name] = new Intl.ListFormat(locale, {
            style: "long",
            type: listArg.type ?? "conjunction",
        }).format(listArg.list);
        lowered[`${name}Count`] = listArg.list.length;
    }
    return lowered;
}

/** Renders a diagnostic's message in one language. */
export type DiagnosticFormatter = (diagnostic: FormattableDiagnostic) => string;

/**
 * Build the formatter for a resolved UI locale.
 *
 * @param translate A translator over that locale's catalogs — the same one the
 *   surrounding chrome renders with.
 * @param locale The resolved `uiLocale`, needed for `Intl.ListFormat`, which
 *   the translator does not expose.
 *
 * The English already on the record is passed as the fallback, so a code with
 * no message in the negotiated chain renders what the worker wrote rather than
 * a bare key.
 */
export function createDiagnosticFormatter(
    translate: Translator,
    locale: string,
): DiagnosticFormatter {
    return (diagnostic) => {
        const { code } = diagnostic;
        if (code === undefined || !isDiagnosticCode(code)) {
            return diagnostic.message;
        }
        return translate(
            DIAGNOSTIC_CODES[code],
            lowerArgs(diagnostic.args, locale),
            diagnostic.message,
        );
    };
}

/**
 * The English translator diagnostics are written with, built on first use.
 *
 * Deferred rather than built at module scope for the same reason
 * `EN_CHROME_TRANSLATOR` in `./chrome` is: this module is bundled into the
 * worker, and a document that raises no diagnostics should not pay to parse
 * the catalogs.
 */
let enTranslator: Translator | undefined;

/**
 * Render a code's message in English.
 *
 * What the worker puts on the record as `message`. Deriving it from the
 * catalog rather than leaving the English at the call site is the point: the
 * two cannot drift, and every existing consumer — the dedupe in
 * `DiagnosticsManager`, a host reading `setDiagnosticsCallback`, the ~900
 * worker tests that assert exact strings — keeps seeing the string it saw
 * before.
 */
export function formatEnglishDiagnostic(
    code: DiagnosticCode,
    args?: DiagnosticArgs,
): string {
    enTranslator ??= createTranslator([], {});
    return enTranslator(
        DIAGNOSTIC_CODES[code],
        lowerArgs(args, DEFAULT_LOCALE),
        code,
    );
}
