import { FluentBundle, FluentResource } from "@fluent/bundle";

import { DEFAULT_LOCALE, EN_CATALOG_SOURCE } from "./catalogs";

/**
 * Arguments substituted into a message's placeables (`{ $count }`).
 *
 * Fluent formats numbers and dates with `Intl`, so passing a real `number`
 * rather than a pre-formatted string is what makes locale-aware formatting
 * possible later (see the number-formatting policy in the package README).
 */
export type TranslationArgs = Record<string, string | number | Date>;

/**
 * Look up `key`, substituting `args`.
 *
 * The generalization of `ColorWordTranslator` in
 * `@doenet/utils/style/colorWords`: a stable key plus an English fallback,
 * where a missing key degrades rather than throwing. Resolution order is the
 * negotiated locale chain, then the bundled English catalogs, then `fallback`,
 * then the key itself.
 */
export type Translator = {
    (key: string, args?: TranslationArgs, fallback?: string): string;
    /**
     * Which locale in the chain will actually render `key`, or `undefined` if
     * none will and the caller's fallback is what renders.
     *
     * For the caller that has to format an argument *outside* Fluent —
     * `Intl.ListFormat`, in `createDiagnosticFormatter` — so that a message
     * falling back to English doesn't get its list joined in a language the
     * rest of the sentence isn't in. Optional so that a plain function still
     * satisfies `Translator`; {@link createTranslator} always provides it.
     */
    localeOf?: (key: string) => string | undefined;
};

export type CreateTranslatorOptions = {
    /**
     * Wrap placeables in Unicode bidi isolation marks (U+2068/U+2069).
     *
     * Fluent defaults this on, which is right for free-form UI text but makes
     * output non-byte-identical to the untranslated English it replaces, and
     * corrupts strings that are later compared, hashed, or parsed (Doenet
     * compares response text). Default off; turn it on for a surface that
     * genuinely mixes RTL and LTR runs.
     */
    useIsolating?: boolean;
    /**
     * Called for each Fluent formatting error. Errors are otherwise swallowed:
     * a broken translation must degrade to readable text, never throw into a
     * renderer.
     */
    onError?: (error: unknown, key: string, locale: string) => void;
    /**
     * Append the bundled English catalogs as the last link of the fallback
     * chain. Defaults to `true`; tests that need to observe a genuine miss
     * pass `false`.
     */
    includeBuiltinEnglish?: boolean;
};

/**
 * Resolve `id` or `id.attribute` against a bundle.
 *
 * Fluent identifiers cannot contain `.`, so a dotted key is a message plus one
 * attribute. Keys with more than one dot cannot name anything and always miss.
 */
function lookupPattern(bundle: FluentBundle, key: string) {
    const separator = key.indexOf(".");
    const id = separator === -1 ? key : key.slice(0, separator);
    const attribute = separator === -1 ? null : key.slice(separator + 1);

    const message = bundle.getMessage(id);
    if (!message) {
        return null;
    }
    if (attribute === null) {
        return message.value;
    }
    return message.attributes[attribute] ?? null;
}

/**
 * The tag a bundle should hand to `Intl`, which is not always the tag its
 * catalog is filed under.
 *
 * A locale tag does two jobs here: it keys the catalog, and it names the
 * language `Intl` counts and formats in. They come apart for a tag `Intl`
 * refuses — `en_US`, the POSIX spelling, is the usual way a host gets one
 * wrong, and `normalizeLocaleTag` passes it through untouched because
 * rewriting it would stop the host's own catalog from being found.
 *
 * Fluent builds its `Intl.PluralRules` from `bundle.locales`, and unlike its
 * number formatting it does not degrade when that constructor throws: the
 * `RangeError` is recorded as a formatting error and the whole message
 * resolves to `{???}`. So a bundle formats under English whenever its tag is
 * one `Intl` cannot parse. That loses the locale's counting and number
 * conventions — which were never available for such a tag anyway — and keeps
 * the host's own words, which are the part that was really asked for.
 */
function intlFormattingLocale(locale: string): string {
    try {
        // Throws `RangeError` for a structurally invalid tag — the same tags,
        // and the same error, every `Intl` constructor rejects.
        Intl.getCanonicalLocales(locale);
        return locale;
    } catch {
        return DEFAULT_LOCALE;
    }
}

/** A locale's catalog, with the tag it was filed under. */
type ChainLink = {
    /**
     * The tag as the caller wrote it, which is what {@link Translator.localeOf}
     * reports and what an error is attributed to — not necessarily the tag the
     * bundle formats under. See {@link intlFormattingLocale}.
     */
    locale: string;
    bundle: FluentBundle;
};

function createChainLink(
    locale: string,
    source: string,
    useIsolating: boolean,
    onError: CreateTranslatorOptions["onError"],
): ChainLink {
    const bundle = new FluentBundle(intlFormattingLocale(locale), {
        useIsolating,
    });
    const errors = bundle.addResource(new FluentResource(source));
    for (const error of errors) {
        onError?.(error, "", locale);
    }
    return { locale, bundle };
}

/**
 * Build a translator over a negotiated locale chain.
 *
 * @param locales Locale chain, most specific first — the output of
 *   {@link negotiateLocales}. Locales with no entry in `resources` are skipped,
 *   so a chain may be passed verbatim even when only some catalogs loaded.
 * @param resources FTL source per locale. Use `combineCatalogs` to merge the
 *   namespaces a context needs. English need not be included: it is bundled.
 */
export function createTranslator(
    locales: string[],
    resources: Record<string, string>,
    options: CreateTranslatorOptions = {},
): Translator {
    const {
        useIsolating = false,
        onError,
        includeBuiltinEnglish = true,
    } = options;

    const bundles: ChainLink[] = [];
    for (const locale of locales) {
        const source = resources[locale];
        if (source !== undefined) {
            bundles.push(
                createChainLink(locale, source, useIsolating, onError),
            );
        }
    }
    if (includeBuiltinEnglish) {
        bundles.push(
            createChainLink(
                DEFAULT_LOCALE,
                EN_CATALOG_SOURCE,
                useIsolating,
                onError,
            ),
        );
    }

    const translate: Translator = (key, args, fallback) => {
        for (const { locale, bundle } of bundles) {
            const pattern = lookupPattern(bundle, key);
            if (pattern === null) {
                continue;
            }
            const errors: Error[] = [];
            const formatted = bundle.formatPattern(pattern, args, errors);
            for (const error of errors) {
                onError?.(error, key, locale);
            }
            return formatted;
        }
        // Nothing in the chain, not even English: the caller's own English
        // string is the last resort, and the key itself if there isn't one —
        // a visible miss beats an empty label.
        return fallback ?? key;
    };

    translate.localeOf = (key: string) =>
        bundles.find(({ bundle }) => lookupPattern(bundle, key) !== null)
            ?.locale;

    return translate;
}

/**
 * Adapt a {@link Translator} to the two-argument shape
 * `resolveColorWord`'s `translate` option already expects.
 *
 * The signature is restated structurally rather than imported as
 * `ColorWordTranslator` from `@doenet/utils`. This package deliberately
 * depends on no other workspace package, so that every layer — the viewer,
 * the worker, `@doenet/utils` itself — can consume it; importing a type back
 * from a consumer would give that up to save one line.
 */
export function asFallbackTranslator(
    translate: Translator,
): (key: string, englishWord: string) => string {
    return (key, englishWord) => translate(key, undefined, englishWord);
}
