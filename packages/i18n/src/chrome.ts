import { DEFAULT_LOCALE, englishResources } from "./catalogs";
import { CHROME_NAMESPACES } from "./namespaces";
import { negotiateLocales, normalizeLocaleTag } from "./negotiate";
import {
    PSEUDO_LOCALE,
    PSEUDO_RTL_BRACKETS,
    PSEUDO_RTL_LOCALE,
    pseudoLocalize,
} from "./pseudo";
import { createTranslator, type Translator } from "./translator";

/**
 * Chrome catalogs shipped inside the bundle, by locale.
 *
 * English under its own tag, unlike the worker's translator: the chrome
 * negotiates the requested locale against these keys, so `en` has to be a
 * candidate and not only the built-in end of the fallback chain.
 */
const BUNDLED_CHROME_CATALOGS: Record<string, string> = {
    [DEFAULT_LOCALE]: englishResources(CHROME_NAMESPACES),
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
    return (pseudoChromeCatalog ??= pseudoLocalize(
        BUNDLED_CHROME_CATALOGS[DEFAULT_LOCALE],
    ));
}

/**
 * The right-to-left pseudo-locale catalog, derived the same way.
 *
 * The same accented text as `en-XA` — only the brackets differ, and only by an
 * invisible mark. `en-XB` is a *direction* fixture, not a second vocabulary:
 * everything it renders should read exactly as `en-XA` does, so that a
 * difference between the two runs is a difference in layout and nothing else.
 */
let pseudoRtlChromeCatalog: string | undefined;

function getPseudoRtlChromeCatalog(): string {
    return (pseudoRtlChromeCatalog ??= pseudoLocalize(
        BUNDLED_CHROME_CATALOGS[DEFAULT_LOCALE],
        { brackets: PSEUDO_RTL_BRACKETS },
    ));
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
    if (normalizedUiLocale === PSEUDO_RTL_LOCALE) {
        resources[PSEUDO_RTL_LOCALE] = getPseudoRtlChromeCatalog();
    }
    // `Object.assign` ignores a null or undefined source, so an absent
    // `hostResources` needs no special case.
    return Object.assign(resources, hostResources);
}

/**
 * Whether the chrome in `locale` wraps its placeables in bidi isolation marks.
 *
 * On everywhere except English, keyed on the primary language subtag — so
 * `en-GB` is English, and so are both pseudo-locales, which is what keeps
 * `en-XA` and `en-XB` renderable as plain text.
 *
 * The rule is not principled, and pretending otherwise would mislead whoever
 * changes it next. Isolation protects a sentence when a *placeable's*
 * direction differs from the paragraph's, which has nothing to do with whether
 * the paragraph is English: an English UI formatting an Arabic answer name gets
 * no isolation here and visually strands the words around it. English is
 * excluded because the assertion corpus compares English chrome as plain text,
 * and every phase so far has held English byte-identical to what it replaced.
 * Turning it on for English later is a mechanical change plus a sweep of
 * exact-string assertions.
 *
 * Content is a different question and gets the opposite answer — see
 * `createTranslatorFromLocaleData`, which never isolates.
 */
function isolatesPlaceables(locale: string): boolean {
    const language = locale.split(/[-_]/)[0].toLowerCase();
    return language !== DEFAULT_LOCALE;
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
    // Uniform across the chain, deliberately: isolation belongs to the surface
    // being rendered, not to whichever catalog happened to answer. A key the
    // requested locale hasn't translated resolves from English and is isolated
    // all the same, because the chrome around it is still the requested
    // locale's.
    return createTranslator(locales, resources, {
        useIsolating: isolatesPlaceables(normalized),
    });
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
