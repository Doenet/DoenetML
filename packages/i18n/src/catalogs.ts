import chrome from "../locales/en/chrome.ftl?raw";
import content from "../locales/en/content.ftl?raw";
import diagnostics from "../locales/en/diagnostics.ftl?raw";
import editor from "../locales/en/editor.ftl?raw";

import {
    combineCatalogs,
    type CatalogNamespace,
    type Catalogs,
} from "./namespaces";

/** The default locale. Always bundled, never lazy-loaded. */
export const DEFAULT_LOCALE = "en";

/**
 * The English catalogs, inlined at build time.
 *
 * English is bundled so the fallback chain terminates in something that is
 * always present, in every bundling variant, with no network access. It is the
 * only language that is: every translation is loaded on demand by
 * `loadLocaleResources` — code-split in a build that can split, fetched in one
 * that cannot — always on the main thread, and reaches the worker as
 * `LocaleData.resources`.
 */
export const EN_CATALOGS: Required<Catalogs> = {
    chrome,
    content,
    diagnostics,
    editor,
};

/** All English catalogs as a single FTL source. */
export const EN_CATALOG_SOURCE = combineCatalogs(EN_CATALOGS);

/**
 * A stable identity for a set of host-supplied catalogs, for memo and effect
 * dependency lists.
 *
 * Catalogs are compared by *which locales* arrived, not by their contents:
 * hosts load them as whole modules, so the change that matters is a locale
 * appearing or going away, and hashing every catalog on every render would
 * cost far more than it buys. A host that edits a catalog in place and expects
 * the change to take effect has to hand over a map with different keys.
 */
export function localeResourceKey(
    resources?: Record<string, string> | null,
): string {
    return Object.keys(resources ?? {})
        .sort()
        .join(",");
}

/**
 * Locales this build can resolve with no network and no module graph.
 *
 * What {@link loadLocaleResources} checks before going to fetch anything, and
 * what `lint:i18n` holds the lazy-catalog glob's exclusions to, so the two
 * cannot drift. English alone: it is bundled by definition, being the end of
 * every fallback chain, and no translation is worth its weight to consumers who
 * never read it — roughly 16 KB gzipped each, landing on all of them.
 *
 * Inlining one again means adding it here, excluding it from that glob, and
 * giving `chrome.ts`'s `BUNDLED_CHROME_CATALOGS` and the worker a way to reach
 * it. That is a deliberate change with a case to make.
 */
export const BUNDLED_LOCALES: readonly string[] = [DEFAULT_LOCALE];

/**
 * The English catalogs for the namespaces one context renders, combined into
 * the single FTL source {@link createTranslator} consumes.
 *
 * The namespaces are a parameter so a context's `en` entry holds what that
 * context draws and no more: `chrome.ts` negotiates against a map keyed by
 * locale and derives the pseudo-locale from that entry, which would otherwise
 * accent messages the chrome never draws. Not a size saving —
 * {@link EN_CATALOG_SOURCE}, all four namespaces, is appended behind every
 * chain by `createTranslator`, so English rides into every bundle whole.
 *
 * @param namespaces The namespaces this context loads — `WORKER_NAMESPACES` or
 *   `CHROME_NAMESPACES`.
 */
export function englishResources(
    namespaces: readonly CatalogNamespace[],
): string {
    const picked: Catalogs = {};
    for (const namespace of namespaces) {
        picked[namespace] = EN_CATALOGS[namespace];
    }
    return combineCatalogs(picked);
}
