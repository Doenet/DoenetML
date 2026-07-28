import React, { createContext, useContext, useMemo } from "react";
import {
    createChromeTranslator,
    localeResourceKey,
    resolveDocumentLocale,
    resolveUiLocale,
    DEFAULT_LOCALE,
    EN_CHROME_TRANSLATOR,
    type Translator,
} from "@doenet/i18n";

/**
 * The language the chrome renders in, and the translator that does it.
 *
 * The tag travels beside the translator because a consumer that has to format
 * something *outside* Fluent — `Intl.ListFormat`, in the diagnostic formatters
 * the error box and the editor's hover tooltips build — needs to know which
 * language to format it in, and a `Translator` alone cannot say.
 *
 * Defaults to English rather than to a throwing or empty translator:
 * `@doenet/doenetml` exports its renderers individually, so one can be mounted
 * by a host that never set up a locale. Those hosts should keep seeing exactly
 * what they see today.
 */
const I18nContext = createContext<{ translate: Translator; locale: string }>({
    translate: EN_CHROME_TRANSLATOR,
    locale: DEFAULT_LOCALE,
});

/**
 * Build the chrome translator for a resolved UI locale.
 *
 * @param uiLocale The chrome's language, already through `resolveUiLocale`.
 * @param localeResources Host-supplied catalogs as locale → FTL source.
 */
export function useChromeTranslator(
    uiLocale: string,
    localeResources?: Record<string, string> | null,
): Translator {
    // Keyed by *which locales* arrived, not by their contents — the same
    // comparison `DocViewer` uses to decide the core needs rebuilding.
    const resourceKey = localeResourceKey(localeResources);

    return useMemo(
        () => createChromeTranslator(uiLocale, localeResources),
        [uiLocale, resourceKey],
    );
}

/**
 * Build the chrome translator a host's props alone imply.
 *
 * For chrome that sits *outside* the document — the virtual keyboard, the
 * variant selector — where there is no authored `<document lang>` to consult:
 * hence the `undefined` authored language. Inside the document, `DocViewer`
 * resolves the same pair of rules again against the language it parsed out of
 * the source, and mounts a nested provider with the result.
 *
 * Returns the resolved tag alongside the translator, because that is what
 * {@link I18nProvider} publishes and the caller has no other way to recover it
 * — the resolution happens in here.
 *
 * @param uiLocale The `uiLocale` prop, if the host set one.
 * @param documentLocale The `documentLocale` prop, if the host set one.
 * @param localeResources Host-supplied catalogs as locale → FTL source.
 */
export function useHostChromeTranslator(
    uiLocale: string | null | undefined,
    documentLocale: string | null | undefined,
    localeResources?: Record<string, string> | null,
): { translate: Translator; locale: string } {
    const locale = resolveUiLocale(
        uiLocale,
        resolveDocumentLocale(undefined, documentLocale),
    );
    const translate = useChromeTranslator(locale, localeResources);
    return { translate, locale };
}

/**
 * Publish a translator to every `useT()` below it.
 *
 * Mounted twice per viewer, on purpose: `doenetml.tsx` mounts one from the
 * props alone, covering chrome outside the document, and `DocViewer` nests a
 * second inside it, because only there is an authored `<document lang>` known.
 * The inner one wins for renderers, which is the right split — the keyboard is
 * host chrome, the renderers are inside the document.
 */
export function I18nProvider({
    translate,
    locale,
    children,
}: {
    translate: Translator;
    /** The resolved `uiLocale` `translate` was built for. */
    locale: string;
    children: React.ReactNode;
}) {
    // Memoized so a re-render of the provider's parent doesn't hand every
    // consumer a new object and re-render the whole document with it.
    const value = useMemo(() => ({ translate, locale }), [translate, locale]);
    return (
        <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    );
}

/**
 * The chrome translator in effect.
 *
 * Call it with a string-literal key and an English fallback:
 * `t("answer-correct", undefined, "Correct")`. Both parts are load-bearing —
 * `lint:i18n` matches exactly that shape to check the key exists, and the
 * fallback is what renders if a catalog is somehow missing it.
 */
export function useT(): Translator {
    return useContext(I18nContext).translate;
}

/**
 * The language the chrome is rendering in.
 *
 * For a consumer that has to format something Fluent isn't formatting — today,
 * the diagnostic formatters in `_error.tsx` and `EditorViewer`, which join
 * list arguments with `Intl.ListFormat`.
 */
export function useUiLocale(): string {
    return useContext(I18nContext).locale;
}
