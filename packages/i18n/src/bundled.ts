import { DEFAULT_LOCALE, EN_CATALOGS } from "./catalogs";
import {
    combineCatalogs,
    type CatalogNamespace,
    type Catalogs,
} from "./namespaces";

/**
 * Catalogs shipped inside the bundle, by locale.
 *
 * Empty: every translation is code-split and loaded on demand by
 * {@link loadLocaleResources}. A complete translation — all four namespaces,
 * which is what an inlined locale costs whichever of them a context reads — is
 * about 16 KB gzipped, and that weight lands on every consumer whether or not
 * anyone reads that language, so a locale here has to earn its place against
 * all of them.
 *
 * What inlining buys is the first paint: an inlined locale renders immediately
 * and builds the core once. A locale that loads on demand does neither, since
 * the content locale is fixed for a core's lifetime and is not known until the
 * source has been parsed — so an authored `<document lang>` whose catalog
 * arrives later rebuilds the core with that language on hand.
 *
 * English is not here: it is the fallback every chain terminates in, and
 * {@link createTranslator} appends it unconditionally.
 */
const BUNDLED_TRANSLATIONS: Record<string, Catalogs> = {};

/**
 * Locales this build can resolve with no network and no module graph.
 *
 * What {@link loadLocaleResources} checks before going to fetch anything: a
 * locale in here is already in the entry chunk, so asking for it costs no
 * request. English is its only member because it is bundled by definition — it
 * is the end of every fallback chain — even though it has no entry in
 * {@link BUNDLED_TRANSLATIONS}, which holds only the translations.
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
