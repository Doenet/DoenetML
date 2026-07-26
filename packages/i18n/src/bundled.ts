import esChrome from "../locales/es/chrome.ftl?raw";
import esContent from "../locales/es/content.ftl?raw";
import esDiagnostics from "../locales/es/diagnostics.ftl?raw";

import { DEFAULT_LOCALE, EN_CATALOGS } from "./catalogs";
import {
    combineCatalogs,
    type CatalogNamespace,
    type Catalogs,
} from "./namespaces";

/**
 * Catalogs shipped inside the bundle, by locale.
 *
 * Bundling every locale does not scale, and the plan is still that additional
 * locales arrive as modules the host loads and passes in as `localeResources`.
 * Spanish is inlined anyway because it is the only translation that exists
 * today and because a dynamic import would have to survive four bundling
 * variants — the library build, the single-file standalone bundle
 * (`inlineDynamicImports`), the iframe, and the dedicated worker host. At
 * roughly a kilobyte gzipped per context, paying for it unconditionally costs
 * less than the machinery to avoid it. Revisit when the count reaches a
 * handful.
 *
 * English is not here: it is the fallback every chain terminates in, and
 * {@link createTranslator} appends it unconditionally.
 */
const BUNDLED_TRANSLATIONS: Record<string, Catalogs> = {
    es: {
        chrome: esChrome,
        content: esContent,
        diagnostics: esDiagnostics,
    },
};

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
