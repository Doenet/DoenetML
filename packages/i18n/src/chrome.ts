import esChrome from "../locales/es/chrome.ftl?raw";

import { DEFAULT_LOCALE, EN_CATALOGS } from "./catalogs";
import { negotiateLocales, normalizeLocaleTag } from "./negotiate";
import { PSEUDO_LOCALE, pseudoLocalize } from "./pseudo";
import { createTranslator, type Translator } from "./translator";

/**
 * Chrome catalogs shipped inside the bundle, by locale.
 *
 * Bundling every locale does not scale, and the plan is still that additional
 * locales arrive as code-split modules the host loads and passes in as
 * `localeResources`. Spanish is inlined anyway because it is the only
 * translation that exists today and because a dynamic import would have to
 * survive four bundling variants — the library build, the single-file
 * standalone bundle (`inlineDynamicImports`), the iframe, and the dedicated
 * worker host. At roughly a kilobyte gzipped, paying for it unconditionally
 * costs less than the machinery to avoid it. Revisit when the count reaches
 * a handful.
 */
const BUNDLED_CHROME_CATALOGS: Record<string, string> = {
    [DEFAULT_LOCALE]: EN_CATALOGS.chrome,
    es: esChrome,
};

/**
 * The pseudo-locale catalog, derived from English on first use.
 *
 * Deriving it rather than committing a generated `locales/en-XA/chrome.ftl`
 * means it can never drift from the English it is meant to shadow — a stale
 * pseudo catalog would report a string as extracted that no longer is, which
 * is precisely the bug the pseudo-locale exists to find.
 */
let pseudoChromeCatalog: string | undefined;

function getPseudoChromeCatalog(): string {
    return (pseudoChromeCatalog ??= pseudoLocalize(EN_CATALOGS.chrome));
}

/**
 * Chrome catalogs available for a given request, keyed by locale.
 *
 * Host-supplied resources win over the bundled ones for the same locale, so a
 * deployment can correct or extend a translation without waiting for a
 * release. The pseudo-locale is materialized only when it is asked for.
 */
function chromeResources(
    normalizedUiLocale: string,
    hostResources?: Record<string, string> | null,
): Record<string, string> {
    const resources: Record<string, string> = { ...BUNDLED_CHROME_CATALOGS };
    if (normalizedUiLocale === PSEUDO_LOCALE) {
        resources[PSEUDO_LOCALE] = getPseudoChromeCatalog();
    }
    // `Object.assign` ignores a null or undefined source, so an absent
    // `hostResources` needs no special case.
    return Object.assign(resources, hostResources);
}

/**
 * Build the translator for the viewer chrome.
 *
 * @param uiLocale The chrome's language, already resolved by
 *   {@link resolveUiLocale}.
 * @param hostResources Catalogs the embedding page supplied, as locale → FTL
 *   source. The same map the worker receives: namespace ids are unique across
 *   catalogs, so handing the chrome bundle a source that also contains
 *   `content` messages is harmless.
 */
export function createChromeTranslator(
    uiLocale: string,
    hostResources?: Record<string, string> | null,
): Translator {
    // Normalize once, up front: the pseudo-locale is recognized by tag, so a
    // hand-typed `en-xa` has to reach the same catalog `en-XA` does.
    const normalized = normalizeLocaleTag(uiLocale) || DEFAULT_LOCALE;
    const resources = chromeResources(normalized, hostResources);
    const locales = negotiateLocales([normalized], Object.keys(resources));
    return createTranslator(locales, resources);
}

/**
 * A translator that always answers in English, for chrome rendered outside any
 * provider.
 *
 * Renderers are exported individually and can be mounted by a host that never
 * set up a locale; falling back to today's English is the behavior that
 * changes nothing for them.
 *
 * Resolves against every bundled English catalog, not only `chrome` — keys are
 * unique across namespaces, so the extra ones cannot be reached by mistake.
 *
 * Built on first call rather than at module scope: `@doenet/i18n` is bundled
 * into the worker too, and parsing every English catalog into a `FluentBundle`
 * on import would cost every consumer for something only a provider-less
 * renderer ever reads. The exported identity is stable either way, which
 * matters because it is a React context default.
 */
let enChromeTranslator: Translator | undefined;

export const EN_CHROME_TRANSLATOR: Translator = (key, args, fallback) =>
    (enChromeTranslator ??= createTranslator([], {}))(key, args, fallback);
