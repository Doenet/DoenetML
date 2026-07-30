import esChrome from "../locales/es/chrome.ftl?raw";
import esContent from "../locales/es/content.ftl?raw";
import esDiagnostics from "../locales/es/diagnostics.ftl?raw";
import esEditor from "../locales/es/editor.ftl?raw";

import { DEFAULT_LOCALE, EN_CATALOGS } from "./catalogs";
import {
    combineCatalogs,
    type CatalogNamespace,
    type Catalogs,
} from "./namespaces";

/**
 * Catalogs shipped inside the bundle, by locale.
 *
 * Inlining is for the locales worth carrying whether or not anyone asks for
 * them; every other locale is code-split and loaded on demand by
 * {@link loadLocaleResources}. The whole of `locales/` is about 17 KB gzipped
 * per translation across the chrome namespaces, so the list has to stay short.
 *
 * Spanish is here because it is the one reviewed translation and because being
 * inlined is what lets `documentLocale="es"` render on the first paint and
 * build the core once. Loading it instead would cost an authored
 * `<document lang="es">` a core rebuild, since the content locale is fixed for
 * a core's lifetime and is not known until the source has been parsed.
 *
 * English is not here: it is the fallback every chain terminates in, and
 * {@link createTranslator} appends it unconditionally.
 */
const BUNDLED_TRANSLATIONS: Record<string, Catalogs> = {
    es: {
        chrome: esChrome,
        content: esContent,
        diagnostics: esDiagnostics,
        editor: esEditor,
    },
};

/**
 * Locales this build can resolve with no network and no module graph.
 *
 * What {@link loadLocaleResources} checks before going to fetch anything, and
 * the reason `documentLocale="es"` still costs no request: a locale in here is
 * already in the entry chunk. English leads it because it is bundled by
 * definition — it is the end of every fallback chain — even though it has no
 * entry in {@link BUNDLED_TRANSLATIONS}, which holds only the translations.
 */
export const BUNDLED_LOCALES: readonly string[] = [
    DEFAULT_LOCALE,
    ...Object.keys(BUNDLED_TRANSLATIONS),
];

/**
 * The bundled catalogs a context can render, as locale → combined FTL source.
 *
 * Namespaces are combined per locale rather than shipped separately, because
 * that is the shape {@link createTranslator} consumes. Asking for only the
 * namespaces the context can use is what keeps the worker from carrying
 * chrome strings it never draws.
 *
 * @param namespaces The namespaces this context loads — `WORKER_NAMESPACES` or
 *   `CHROME_NAMESPACES`.
 * @param includeEnglish Include English under its own tag. The chrome
 *   negotiates against this map and needs `en` present as a candidate; the
 *   worker does not, since English is already the built-in fallback.
 */
export function bundledResources(
    namespaces: readonly CatalogNamespace[],
    { includeEnglish = false }: { includeEnglish?: boolean } = {},
): Record<string, string> {
    const resources: Record<string, string> = {};
    if (includeEnglish) {
        resources[DEFAULT_LOCALE] = pick(EN_CATALOGS, namespaces);
    }
    for (const [locale, catalogs] of Object.entries(BUNDLED_TRANSLATIONS)) {
        resources[locale] = pick(catalogs, namespaces);
    }
    return resources;
}

function pick(
    catalogs: Catalogs,
    namespaces: readonly CatalogNamespace[],
): string {
    const picked: Catalogs = {};
    for (const namespace of namespaces) {
        picked[namespace] = catalogs[namespace];
    }
    return combineCatalogs(picked);
}
