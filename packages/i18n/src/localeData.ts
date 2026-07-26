import { bundledResources } from "./bundled";
import { DEFAULT_LOCALE } from "./catalogs";
import { WORKER_NAMESPACES } from "./namespaces";
import { negotiateLocales } from "./negotiate";
import { createTranslator, type Translator } from "./translator";

/**
 * The locale payload the main thread hands to the web worker.
 *
 * Catalogs cross as plain strings rather than URLs: the worker runs from a
 * blob or an inlined script depending on the bundling variant
 * (`@doenet/standalone` vs `@doenet/doenetml-iframe` vs a dedicated worker
 * file), and cannot reliably resolve a relative fetch in all of them.
 */
export type LocaleData = {
    /**
     * The requested content locale, e.g. `"es-MX"`.
     *
     * One tag, not two, and it stays that way. Diagnostics are produced here
     * but addressed to the reader, so they follow `uiLocale` — and that is
     * exactly why the worker never renders them: it emits a stable code plus
     * the arguments that fill the message in, and the main thread formats it
     * (#1518). So the worker never needs the chrome's language, and this
     * payload never needed to grow a second tag.
     */
    locale: string;
    /**
     * FTL source per locale, already merged across the namespaces the
     * receiving context needs (see `combineCatalogs`). English is bundled and
     * need not appear here.
     */
    resources: Record<string, string>;
};

/** The locale payload used before a host supplies one. */
export const DEFAULT_LOCALE_DATA: LocaleData = {
    locale: DEFAULT_LOCALE,
    resources: {},
};

/**
 * The catalogs the worker carries, assembled once.
 *
 * A module constant, as `chrome.ts` also keeps one, rather than a call per
 * translator: `bundledResources` re-concatenates every namespace it is given,
 * and a core builds a translator for each locale its documents declare.
 */
const BUNDLED_WORKER_RESOURCES: Record<string, string> =
    bundledResources(WORKER_NAMESPACES);

/**
 * Build the translator for a {@link LocaleData} payload, negotiating the
 * requested locale against the catalogs available inside the worker.
 *
 * Those are the bundled translations plus whatever the host sent, host winning
 * per locale — so a deployment can correct a bundled translation, and a
 * bundled locale needs no host cooperation at all. `documentLocale="es"`
 * therefore produces Spanish style descriptions with nothing configured.
 *
 * @param locale The content locale to render in. Defaults to the one in
 *   `localeData`; the caller passes a different tag when an authored
 *   `<document lang>` overrides what the host asked for.
 */
export function createTranslatorFromLocaleData(
    localeData: LocaleData,
    locale: string = localeData.locale,
): Translator {
    const resources = {
        ...BUNDLED_WORKER_RESOURCES,
        ...localeData.resources,
    };
    const chain = negotiateLocales([locale], Object.keys(resources));
    return createTranslator(chain, resources);
}
