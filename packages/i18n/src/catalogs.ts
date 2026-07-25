import chrome from "../locales/en/chrome.ftl?raw";
import content from "../locales/en/content.ftl?raw";
import diagnostics from "../locales/en/diagnostics.ftl?raw";
import editor from "../locales/en/editor.ftl?raw";

import { combineCatalogs, type Catalogs } from "./namespaces";

/** The default locale. Always bundled, never lazy-loaded. */
export const DEFAULT_LOCALE = "en";

/**
 * The English catalogs, inlined at build time.
 *
 * Every other locale is a code-split module the host loads on the main thread
 * and hands to {@link createTranslator}; English is bundled so the fallback
 * chain terminates in something that is always present, in every bundling
 * variant, with no network access.
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
