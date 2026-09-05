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
 * A code is a permanent name — what a bug report cites, what a host filters
 * on, and the anchor a documentation page will hang off (#1548). It travels on
 * the record and, for a positioned diagnostic, in the LSP `code` field; no
 * surface renders it as text yet.
 *
 * `diagnostic-codes.lock.json` records every code ever issued and `lint:i18n`
 * fails as soon as this registry stops agreeing with an entry, so a code can
 * be retired but never reused or renumbered. (Editing the lock itself is what
 * review is for — see the package README.)
 *
 * The letter records what the diagnostic was born as — `w` warning, `e` error,
 * `i` info, `a` accessibility. It is part of the name, not a live severity: a
 * diagnostic whose severity genuinely changes keeps its code, because the code
 * identifies the *situation*, and the emitting call site is what chooses the
 * `type` on the record.
 */
import { DEFAULT_LOCALE } from "./catalogs";
import type { MessageKey } from "./generated/messageKeys";
import { listFormatFor } from "./intl";
import { createTranslator, type Translator } from "./translator";

/**
 * Every diagnostic code, mapped to the message that renders it.
 *
 * `satisfies` against {@link MessageKey} is load-bearing: `messageKeys.ts` is
 * generated from the English catalogs, so a code pointing at a message that
 * doesn't exist is a type error rather than a runtime miss.
 *
 * Append new codes at the end of their range. Never renumber, never reuse.
 * Each letter's range is kept contiguous and in numeric order here, so that
 * "the end of the range" is a single place to look for rather than something
 * to search the file for.
 */
export const DIAGNOSTIC_CODES = {
    "doenet-i0001": "line-segment-attributes-ignored-with-endpoints",
    "doenet-i0002": "line-segment-midpoint-offset-without-midpoint",
    "doenet-i0003":
        "line-segment-attributes-ignored-with-endpoint-and-midpoint",
    "doenet-i0004": "choice-input-indices-count-mismatch",
    "doenet-i0005": "pretzel-indices-count-mismatch",
    "doenet-i0006": "shuffle-indices-count-mismatch",
    "doenet-i0007": "indices-ignored-out-of-range",
    "doenet-i0008": "pretzel-indices-repeated",
    "doenet-i0009": "pretzel-circuit-first-index",
    "doenet-i0010": "variant-index-must-be-number",
    "doenet-i0011": "variant-index-must-be-integer",
    "doenet-i0012": "sequence-invalid-length",
    "doenet-i0013": "sequence-invalid-step",
    "doenet-i0014": "sequence-invalid-endpoint-number",
    "doenet-i0015": "sequence-invalid-endpoint-letters",
    "doenet-i0016": "sequence-invalid-endpoint",
    "doenet-i0017": "angle-too-many-lines",
    "doenet-i0018": "copy-prop-not-found",
    "doenet-i0019": "prefigure-annotations-not-rendered",
    "doenet-i0020": "multiple-annotations-children",
    "doenet-i0021": "attribute-invalid-values",
    "doenet-i0022": "variant-num-to-select-not-non-negative-integer",
    "doenet-i0023": "variant-num-to-select-not-constant-number",
    "doenet-i0024": "variant-with-replacement-not-constant-boolean",
    "doenet-i0025": "variant-select-weight-disables-unique",
    "doenet-i0026": "variant-coprime-undetermined",
    "doenet-i0027": "variant-attribute-not-constant",
    "doenet-i0028": "variant-attribute-not-number",
    "doenet-i0029": "variant-attribute-wrong-type-for-sequence",
    "doenet-i0030": "variant-length-not-integer",
    "doenet-i0031": "variant-sort-not-implemented",
    "doenet-i0032": "variant-exclude-combinations-not-implemented",
    "doenet-i0033": "variant-math-exclude-not-implemented",
    "doenet-i0034": "variant-non-constant-exclude-not-implemented",
    "doenet-i0048": "attribute-value-invalid-using-default",

    "doenet-w0001": "line-points-undetermined-dimensions",
    "doenet-w0002": "line-points-too-few-dimensions",
    "doenet-w0003": "line-points-depend-on-variables",
    "doenet-w0004": "line-equation-invalid-format",
    "doenet-w0005": "ray-overprescribed-through",
    "doenet-w0006": "ray-dimension-mismatch",
    "doenet-w0007": "vector-overprescribed-head",
    "doenet-w0008": "vector-dimension-mismatch",
    "doenet-w0009": "attract-to-without-nearest-point",
    "doenet-w0010": "constrain-to-without-nearest-point",
    "doenet-w0011": "constrain-to-interior-without-nearest-point",
    "doenet-w0012": "choice-input-label-position-ignored",
    "doenet-w0013": "string-children-need-type",
    "doenet-w0014": "invalid-type-defaulting-to-math",
    "doenet-w0015": "string-not-valid-component-to-arrange",
    "doenet-w0016": "invalid-type-defaulting-to-number",
    "doenet-w0017": "invalid-variable-value",
    "doenet-w0018": "side-by-side-absolute-widths",
    "doenet-w0019": "side-by-side-absolute-margins",
    "doenet-w0020": "side-by-side-no-block-child",
    "doenet-w0021": "label-for-ignored-on-graphical",
    "doenet-w0022": "label-for-must-resolve-to-one",
    "doenet-w0023": "label-for-unresolved",
    "doenet-w0024": "label-for-answer-with-authored-inputs",
    "doenet-w0025": "label-for-answer-without-input",
    "doenet-w0026": "label-for-must-reference-input-or-answer",
    "doenet-w0027": "circle-through-points-non-numerical",
    "doenet-w0028": "circle-too-many-through-points",
    "doenet-w0029": "circle-overprescribed-radius-center-points",
    "doenet-w0030": "circle-center-with-multiple-points",
    "doenet-w0031": "circle-radius-too-small",
    "doenet-w0032": "circle-radius-with-many-points",
    "doenet-w0033": "circle-invalid-center-or-through-points",
    "doenet-w0034": "circle-radius-center-with-multiple-points",
    "doenet-w0035": "circle-change-radius-non-numerical",
    "doenet-w0036": "circle-radius-with-points-non-numerical",
    "doenet-w0037": "circle-change-center-non-numerical",
    "doenet-w0038": "function-domain-insufficient-dimensions",
    "doenet-w0039": "function-domain-invalid-format",
    "doenet-w0040": "function-ignoring-non-numerical",
    "doenet-w0041": "function-ignoring-empty",
    "doenet-w0042": "function-points-too-close",
    "doenet-w0043": "target-not-found",
    "doenet-w0044": "target-state-variable-not-found",
    "doenet-w0045": "ode-system-variables-match-independent",
    "doenet-w0046": "ode-system-duplicate-variable-names",
    "doenet-w0047": "ode-system-rhs-function-error",
    "doenet-w0048": "angle-invalid-through-point",
    "doenet-w0049": "parabola-vertex-too-many-points",
    "doenet-w0050": "parabola-too-many-points",
    "doenet-w0051": "select-from-sequence-coprime-not-numbers",
    "doenet-w0052": "select-from-sequence-coprime-with-exclude-combinations",
    "doenet-w0053": "ionic-compound-not-two-ions",
    "doenet-w0054": "ionic-compound-needs-cation-and-anion",
    "doenet-w0055": "intersection-too-many-items",
    "doenet-w0056": "function-iterates-input-output-mismatch",
    "doenet-w0057": "solve-equations-cannot-evaluate",
    "doenet-w0058": "math-operators-operand-number-required",
    "doenet-w0059": "eigen-decomposition-failed",
    "doenet-w0060": "prefigure-x-label-position-unsupported",
    "doenet-w0061": "prefigure-y-label-position-unsupported",
    "doenet-w0062": "prefigure-invalid-axis-bounds",
    "doenet-w0063": "prefigure-invalid-width",
    "doenet-w0064": "prefigure-invalid-aspect-ratio",
    "doenet-w0065": "copy-unrecognized-component-type",
    "doenet-w0066": "data-frame-inconsistent-row-lengths",
    "doenet-w0067": "data-frame-duplicate-column-names",
    "doenet-w0068": "data-frame-missing-column-name",
    "doenet-w0069": "answer-award-depends-on-own-response",
    "doenet-w0070": "answer-max-num-attempts-in-section-wide-check-work",
    "doenet-w0071": "answer-attributes-need-symbolic-equality",
    "doenet-w0072": "collect-no-source",
    "doenet-w0073": "collect-invalid-component-type",
    "doenet-w0074": "module-attribute-child-needs-name",
    "doenet-w0075": "module-attribute-name-already-defined",
    "doenet-w0076": "pretzel-problem-needs-statement-and-answer",
    "doenet-w0077": "attribute-must-be-references",
    "doenet-w0078": "answer-invalid-type",
    "doenet-w0079": "conditional-content-condition-ignored",
    "doenet-w0080": "slider-markers-type-mismatch",
    "doenet-w0081": "nested-section-wide-check-work-max-num-attempts",
    "doenet-w0082": "math-input-invalid-function-names",
    "doenet-w0083": "section-multiple-style-palettes",
    "doenet-w0084": "prefigure-descendant-unsupported",
    "doenet-w0085": "prefigure-descendant-invalid-geometry",
    "doenet-w0086": "prefigure-curve-label-omitted",
    "doenet-w0087": "prefigure-curve-unsupported-definition-type",
    "doenet-w0088": "prefigure-region-flip-functions-unsupported",
    "doenet-w0089": "prefigure-region-non-formula-child",
    "doenet-w0090": "prefigure-label-position-unsupported",
    "doenet-w0091": "prefigure-fill-style-unsupported",
    "doenet-w0092": "prefigure-line-style-unknown",
    "doenet-w0093": "prefigure-marker-style-mapped-to-diamond",
    "doenet-w0094": "prefigure-marker-style-unsupported",
    "doenet-w0095": "annotation-ref-unresolvable",
    "doenet-w0096": "annotation-ref-multiple-targets",
    "doenet-w0097": "annotation-ref-outside-graph",
    "doenet-w0098": "annotation-ref-unsupported-target",
    "doenet-w0099": "annotation-text-missing",
    "doenet-w0100": "reference-index-unavailable",
    "doenet-w0102": "component-action-unavailable",
    "doenet-w0104": "reference-no-referent",
    "doenet-w0105": "reference-multiple-referents",
    "doenet-w0106": "children-invalid-attribute-format",
    "doenet-w0107": "children-invalid",
    "doenet-w0108": "deprecated-attribute-renamed",
    "doenet-w0109": "deprecated-attribute-renamed-conflict",
    "doenet-w0110": "deprecated-attribute-ignored",
    "doenet-w0111": "pluralize-english-only",
    "doenet-w0112": "schema-element-unrecognized",
    "doenet-w0113": "schema-element-not-allowed-at-root",
    "doenet-w0114": "schema-element-not-allowed-inside",
    "doenet-w0115": "schema-attribute-unrecognized",
    "doenet-w0116": "schema-attribute-value-not-allowed",
    "doenet-w0117": "matches-pattern-parameter-not-in-pattern",
    "doenet-w0118": "prefigure-grid-spacing-too-fine",
    "doenet-w0119": "graph-grid-invalid",
    "doenet-w0120": "deprecated-attribute-to-child",
    "doenet-w0121": "deprecated-attribute-value-renamed",
    "doenet-w0122": "field-function-wrong-num-outputs",
    "doenet-w0123": "field-function-attribute-ignored-with-child",
    "doenet-w0124": "field-variables-ignored",
    "doenet-w0125": "math-embedded-input-shape-unsuitable",
    "doenet-w0126": "sample-gaussian-parameters-invalid",
    "doenet-w0127": "sample-hypergeometric-parameters-invalid",
    "doenet-w0128": "sample-hypergeometric-draws-too-many",
    "doenet-w0129": "sample-binomial-parameters-invalid",
    "doenet-w0130": "sample-binomial-trials-too-many",
    "doenet-w0131": "sample-poisson-mean-invalid",
    "doenet-w0132": "sample-poisson-mean-too-large",
    "doenet-w0133": "sample-distribution-slow",

    "doenet-e0001": "pretzel-circuit-first-problem-distractor",
    "doenet-e0002": "component-type-invalid",
    "doenet-e0003": "attribute-repeated",
    "doenet-e0004": "attribute-invalid-for-component",
    "doenet-e0005": "composite-circular-dependency",
    "doenet-e0006": "doenetml-version-not-found",
    "doenet-e0007": "parse-invalid-doenetml",
    "doenet-e0008": "parse-tag-missing-close-tag",
    "doenet-e0009": "parse-tag-error",
    "doenet-e0010": "parse-attribute-missing-value",
    "doenet-e0011": "parse-attribute-invalid",
    "doenet-e0012": "parse-attribute-value-invalid",
    "doenet-e0013": "parse-attribute-value-quote-mismatch",
    "doenet-e0014": "parse-open-tag-name-missing",
    "doenet-e0015": "parse-tag-not-closed",
    "doenet-e0016": "parse-self-closing-tag-name-missing",
    "doenet-e0017": "parse-self-closing-tag-not-closed",
    "doenet-e0018": "parse-tag-invalid-attributes",
    "doenet-e0019": "parse-close-tag-name-missing",
    "doenet-e0020": "parse-attribute-value-unquoted",
    "doenet-e0021": "parse-close-tag-without-open-tag",
    "doenet-e0022": "parse-close-tag-mismatched",
    "doenet-e0023": "parser-node-unconvertible",
    "doenet-e0024": "component-name-invalid-start",
    "doenet-e0025": "name-attribute-invalid",
    "doenet-e0026": "answer-video-watched-missing-video",
    "doenet-e0027": "answer-video-watched-video-not-reference",
    "doenet-e0028": "answer-name-not-single-text",
    "doenet-e0029": "external-doenetml-recursion-limit",
    "doenet-e0030": "external-doenetml-unavailable",
    "doenet-e0031": "external-doenetml-type-mismatch",
    "doenet-e0032": "select-variant-name-option-count-mismatch",
    "doenet-e0033": "select-variant-name-without-options",
    "doenet-e0034": "select-variant-name-not-possible",
    "doenet-e0035": "select-too-few-options",
    "doenet-e0036": "select-from-sequence-too-few-values",
    "doenet-e0037": "select-from-sequence-indices-count-mismatch",
    "doenet-e0038": "select-from-sequence-indices-not-integers",
    "doenet-e0039": "select-from-sequence-index-excluded",
    "doenet-e0040": "select-from-sequence-indices-excluded-combination",
    "doenet-e0041": "select-from-sequence-coprime-not-positive-integers",
    "doenet-e0042": "select-from-sequence-coprime-common-factor",
    "doenet-e0043": "select-from-sequence-coprime-single-number",
    "doenet-e0044": "select-from-sequence-excluded-too-many-combinations",
    "doenet-e0045": "select-from-sequence-coprime-none-found",
    "doenet-e0046": "select-from-sequence-too-few-unique-values",
    "doenet-e0047": "select-prime-numbers-too-few-values",
    "doenet-e0048": "select-prime-numbers-values-count-mismatch",
    "doenet-e0049": "select-prime-numbers-values-not-prime",
    "doenet-e0050": "select-prime-numbers-values-excluded-combination",
    "doenet-e0051": "select-prime-numbers-excluded-too-many-combinations",
    "doenet-e0052": "select-random-combination-fluke",
    "doenet-e0053": "select-random-value-fluke",

    "doenet-a0001": "accessibility-short-description-or-decorative",
    "doenet-a0002": "accessibility-video-short-description",
    "doenet-a0003": "accessibility-input-short-description-or-label",
    "doenet-a0004": "accessibility-answer-input-short-description-or-label",
    "doenet-a0005": "accessibility-short-description-contains-math",
    "doenet-a0006": "accessibility-section-title-insufficient-contrast",
    "doenet-a0007": "style-definition-insufficient-contrast",
    "doenet-a0008": "style-definition-dark-mode-text-background-contrast",
    "doenet-a0009": "style-definition-dark-mode-text-canvas-contrast",
} as const satisfies Record<string, MessageKey>;

export type DiagnosticCode = keyof typeof DIAGNOSTIC_CODES;

/**
 * Codes that are still reserved but no longer raised anywhere.
 *
 * A code outlives the call site that raised it: retiring one means the
 * situation stopped arising, not that the name became free. It stays in
 * {@link DIAGNOSTIC_CODES} so the lock keeps agreeing with the registry, and
 * it is listed here so `lint:i18n` knows the missing call site is deliberate.
 *
 * That check is the point of the list. Every other registered code must be
 * raised somewhere, so a consolidation that strands one — the renumbering
 * hazard, where a code survives in the registry after the last site that used
 * it moved to another number — fails the lint instead of shipping a name
 * nothing can ever produce. Retiring becomes an explicit line in a diff rather
 * than a silent consequence of deleting the last call site.
 *
 * `doenet-w0123` warned that a `<slopeField>`/`<vectorField>` child had
 * superseded the `function` attribute. That attribute was removed in favour of
 * a `<function>` child, so the two can no longer disagree and the situation
 * stopped arising.
 */
export const RETIRED_DIAGNOSTIC_CODES: ReadonlySet<DiagnosticCode> =
    new Set<DiagnosticCode>(["doenet-w0123"]);

/**
 * The shape every code has to match: `doenet-` + severity letter + 4 digits.
 *
 * The rule `lint:i18n` holds a newly registered code to. Not re-exported from
 * the package index: a consumer should look a code up in
 * {@link DIAGNOSTIC_CODES}, never parse it.
 */
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

/**
 * The parts of a diagnostic record this module needs.
 *
 * `null` is accepted beside `undefined` for both optional halves, because some
 * of what gets formatted arrives as component state rather than as a record a
 * caller assembled — a state variable defaults to `null`, not to absent — and
 * either way it means "nothing to render from, use the English".
 */
export type FormattableDiagnostic = {
    message: string;
    code?: string | null;
    args?: DiagnosticArgs | null;
};

/**
 * The list a value stands for — a bare array, or `{list, type}` — or
 * `undefined` if it is not a list at all.
 *
 * The shape is tested for rather than asserted, because the call sites that
 * build these arguments are untyped JavaScript components:
 * {@link DiagnosticArgValue} says what they are meant to pass, not what they
 * can.
 */
function asListArg(value: unknown): DiagnosticListArg | undefined {
    if (Array.isArray(value)) {
        return { list: value };
    }
    if (typeof value === "object" && value !== null && "list" in value) {
        const candidate = value as DiagnosticListArg;
        return Array.isArray(candidate.list) ? candidate : undefined;
    }
    return undefined;
}

/**
 * Lower {@link DiagnosticArgs} to what Fluent accepts.
 *
 * Fluent has no list type, so every list becomes a joined string. Each one
 * also contributes `<name>Count`, because a message that names a list almost
 * always has to agree a verb with how many things are in it, and a count the
 * catalog derives itself can never disagree with the list beside it.
 *
 * Total over any value, not only the ones {@link DiagnosticArgValue} allows,
 * and over an absent bag of them. This runs inside the worker, at the point a
 * state variable raises the diagnostic, so a component that passes `null` for
 * `args` itself, or `undefined` for one argument, or an array of numbers, must
 * get a wrong-looking message rather than a `TypeError` out of its own
 * definition — the same reasoning that makes an unregistered code render as
 * itself. Anything unrecognized is stringified, which is visible in the
 * message and so gets noticed; a boolean lands there too, as `"true"` or
 * `"false"`, which is the form a Fluent selector would compare against anyway.
 */
function lowerArgs(
    args: DiagnosticArgs | null | undefined,
    locale: string,
): Record<string, string | number> | undefined {
    // `null` as well as `undefined`: an untyped call site can pass one as
    // easily as leave the property off, and `Object.entries(null)` throws.
    if (args == null) {
        return undefined;
    }
    const lowered: Record<string, string | number> = {};
    for (const [name, value] of Object.entries(args)) {
        if (typeof value === "string" || typeof value === "number") {
            lowered[name] = value;
            continue;
        }
        const listArg = asListArg(value);
        if (listArg === undefined) {
            lowered[name] = String(value);
            continue;
        }
        // `Intl.ListFormat` rejects a non-string element outright, so the
        // elements are coerced rather than trusted.
        lowered[name] = listFormatFor(locale, listArg.type).format(
            listArg.list.map((item) => String(item)),
        );
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
 * @param locale The resolved `uiLocale`. Used for `Intl.ListFormat` when the
 *   translator can't say which locale a message resolved in.
 *
 * The English already on the record is passed as the fallback, so a code with
 * no message in the negotiated chain renders what the worker wrote rather than
 * a bare key.
 *
 * Lists are joined in the language of the message that actually resolves, not
 * of the reader: a partial translation is legitimate, and its untranslated
 * half falls back to English, which should not come out with its list joined
 * in the reader's language ("slope et length are ignored").
 */
export function createDiagnosticFormatter(
    translate: Translator,
    locale: string,
): DiagnosticFormatter {
    return (diagnostic) => {
        const { code } = diagnostic;
        if (code == null || !isDiagnosticCode(code)) {
            return diagnostic.message;
        }
        const key = DIAGNOSTIC_CODES[code];
        return translate(
            key,
            lowerArgs(diagnostic.args, translate.localeOf?.(key) ?? locale),
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
 * two cannot drift, and everything reading `message` inside the worker — the
 * dedupe in `DiagnosticsManager`, the ~900 tests that assert exact strings —
 * keeps seeing the string it saw before.
 *
 * An unregistered code renders as itself rather than throwing. The call sites
 * are untyped JavaScript components, so `lint:i18n` is what catches a typo'd
 * code; until it does, a bad code must not take a state-variable definition
 * down with it. Hence {@link isDiagnosticCode} rather than an `undefined`
 * check: a code that happens to name something on `Object.prototype`
 * (`"toString"`) would otherwise resolve to a function and blow up in the
 * translator. `String` for the same reason: a call site that left `code` out
 * altogether still has to produce a `message`, and "undefined" on screen is
 * findable where a record with no message at all is a crash somewhere else.
 */
export function formatEnglishDiagnostic(
    code: DiagnosticCode,
    args?: DiagnosticArgs,
): string {
    if (!isDiagnosticCode(code)) {
        return String(code);
    }
    const key = DIAGNOSTIC_CODES[code];
    enTranslator ??= createTranslator([], {});
    return enTranslator(key, lowerArgs(args, DEFAULT_LOCALE), code);
}
