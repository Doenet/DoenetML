import React, { createContext, useContext, useMemo } from "react";
import {
    createChromeTranslator,
    localeResourceKey,
    EN_CHROME_TRANSLATOR,
    type Translator,
} from "@doenet/i18n";

/**
 * The translator the viewer chrome renders with.
 *
 * Defaults to English rather than to a throwing or empty translator:
 * `@doenet/doenetml` exports its renderers individually, so one can be mounted
 * by a host that never set up a locale. Those hosts should keep seeing exactly
 * what they see today.
 */
const I18nContext = createContext<Translator>(EN_CHROME_TRANSLATOR);

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
    children,
}: {
    translate: Translator;
    children: React.ReactNode;
}) {
    return (
        <I18nContext.Provider value={translate}>
            {children}
        </I18nContext.Provider>
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
    return useContext(I18nContext);
}
