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
export type Translator = (
    key: string,
    args?: TranslationArgs,
    fallback?: string,
) => string;

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

function createBundle(
    locale: string,
    source: string,
    useIsolating: boolean,
    onError: CreateTranslatorOptions["onError"],
): FluentBundle {
    const bundle = new FluentBundle(locale, { useIsolating });
    const errors = bundle.addResource(new FluentResource(source));
    for (const error of errors) {
        onError?.(error, "", locale);
    }
    return bundle;
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

    const bundles: FluentBundle[] = [];
    for (const locale of locales) {
        const source = resources[locale];
        if (source !== undefined) {
            bundles.push(createBundle(locale, source, useIsolating, onError));
        }
    }
    if (includeBuiltinEnglish) {
        bundles.push(
            createBundle(
                DEFAULT_LOCALE,
                EN_CATALOG_SOURCE,
                useIsolating,
                onError,
            ),
        );
    }

    return function translate(key, args, fallback) {
        for (const bundle of bundles) {
            const pattern = lookupPattern(bundle, key);
            if (pattern === null) {
                continue;
            }
            const errors: Error[] = [];
            const formatted = bundle.formatPattern(pattern, args, errors);
            for (const error of errors) {
                onError?.(error, key, bundle.locales[0]);
            }
            return formatted;
        }
        // Nothing in the chain, not even English: the caller's own English
        // string is the last resort, and the key itself if there isn't one —
        // a visible miss beats an empty label.
        return fallback ?? key;
    };
}

/**
 * Adapt a {@link Translator} to the two-argument shape
 * `resolveColorWord`'s `translate` option already expects.
 *
 * Declared structurally rather than importing `ColorWordTranslator` from
 * `@doenet/utils`, which depends on this package.
 */
export function asFallbackTranslator(
    translate: Translator,
): (key: string, englishWord: string) => string {
    return (key, englishWord) => translate(key, undefined, englishWord);
}
