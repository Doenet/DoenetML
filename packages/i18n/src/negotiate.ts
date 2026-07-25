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
 * beats the locale the hosting page asked for, which beats English.
 *
 * The author knows what language they wrote the content in; the host only
 * knows what language it would prefer to receive. Shared by the main thread
 * (which sets `lang` on the rendered wrapper) and the worker (whose
 * `document.locale` state variable drives translated content), so the two can
 * never drift apart.
 */
export function resolveDocumentLocale(
    authoredLang: string | null | undefined,
    hostLocale: string | null | undefined,
): string {
    const tag =
        (authoredLang ?? "").trim() ||
        (hostLocale ?? "").trim() ||
        DEFAULT_LOCALE;
    return normalizeLocaleTag(tag) || DEFAULT_LOCALE;
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
