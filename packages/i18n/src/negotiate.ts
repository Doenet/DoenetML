import { negotiateLanguages } from "@fluent/langneg";

import { DEFAULT_LOCALE } from "./catalogs";

export type NegotiateLocalesOptions = {
    /**
     * Locale that terminates every chain. Defaults to `"en"`, the only locale
     * guaranteed to be bundled.
     */
    defaultLocale?: string;
};

/**
 * Build a fallback chain from what the host asked for and what actually
 * exists.
 *
 * `negotiateLocales(["es-MX"], ["es", "en"])` → `["es", "en"]`;
 * `negotiateLocales(["es-MX"], ["es-MX", "es", "en"])` → the full three-step
 * chain. The default locale is always appended, so the chain never ends
 * somewhere a lookup could fall off.
 *
 * @param requested BCP-47 tags in the host's order of preference.
 * @param available Locales with catalogs on hand.
 */
export function negotiateLocales(
    requested: string[],
    available: string[],
    options: NegotiateLocalesOptions = {},
): string[] {
    const { defaultLocale = DEFAULT_LOCALE } = options;

    // `negotiateLanguages` only ever returns locales from `available`, so the
    // default has to be offered for it to be able to terminate the chain.
    const availableWithDefault = available.includes(defaultLocale)
        ? available
        : [...available, defaultLocale];

    return negotiateLanguages(requested, availableWithDefault, {
        strategy: "filtering",
        defaultLocale,
    });
}

/**
 * Apply the document-locale precedence rule: an authored `<document lang>`
 * beats the locale the hosting page asked for, which beats English. A blank
 * tag counts as unset, so a hand-typed `lang=" "` falls through to the host's.
 *
 * The author knows what language they wrote the content in; the host only
 * knows what language it would prefer to receive — hence the precedence.
 *
 * Shared by the main thread and the worker, so the language the core
 * translates into, the `document.locale` an author reads, and the `lang`
 * attribute the viewer renders can never drift apart.
 *
 * Nothing needs to tell "English" apart from "nobody said so": English is what
 * the core computes its prose in and what the chrome renders in when nobody
 * declares a language, so it is the language such a document is in.
 *
 * @param authoredLang The `lang` on `<document>`, if the author wrote one.
 * @param hostLocale The `documentLocale` the hosting page asked for, if any.
 */
export function resolveDocumentLocale(
    authoredLang: string | null | undefined,
    hostLocale: string | null | undefined,
): string {
    const declared = (authoredLang ?? "").trim() || (hostLocale ?? "").trim();
    return normalizeLocaleTag(declared) || DEFAULT_LOCALE;
}

/**
 * Apply the UI-locale precedence rule: an explicitly configured `uiLocale`
 * beats the language of the content.
 *
 * The chrome follows the content by default, so a fully Spanish activity is
 * fully Spanish without the host configuring anything. A host overrides it
 * only when the reader's language genuinely differs from the content's — a
 * Spanish-speaking student working a French physics problem. A blank tag
 * counts as unset, and the result is normalized, so the chrome's locale
 * negotiates exactly the way the content's does.
 *
 * @param uiLocale What the host configured, if anything.
 * @param documentLocale The content locale to follow, already resolved by
 *   {@link resolveDocumentLocale}.
 */
export function resolveUiLocale(
    uiLocale: string | null | undefined,
    documentLocale: string,
): string {
    return normalizeLocaleTag(uiLocale ?? "") || documentLocale;
}

/**
 * Normalize a BCP-47 tag to the casing Fluent and `Intl` expect
 * (`es-mx` → `es-MX`), leaving anything unparseable alone.
 *
 * Authors type `lang` by hand, so `<document lang="ES-mx">` has to negotiate
 * the same as `es-MX`.
 */
export function normalizeLocaleTag(tag: string): string {
    const trimmed = tag.trim();
    if (trimmed === "") {
        return trimmed;
    }
    try {
        return new Intl.Locale(trimmed).toString();
    } catch {
        return trimmed;
    }
}
