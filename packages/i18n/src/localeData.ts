import { DEFAULT_LOCALE } from "./catalogs";
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
     * One tag, not two: the worker only needs `documentLocale` while the
     * strings it computes are content. The phase that moves diagnostics into
     * the worker will have to carry `uiLocale` alongside it — diagnostics are
     * produced by the worker but addressed to the reader, so they follow the
     * chrome's language (see `WORKER_NAMESPACES`).
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
 * Build the translator for a {@link LocaleData} payload, negotiating the
 * requested locale against the catalogs that actually arrived.
 */
export function createTranslatorFromLocaleData(
    localeData: LocaleData,
): Translator {
    const chain = negotiateLocales(
        [localeData.locale],
        Object.keys(localeData.resources),
    );
    return createTranslator(chain, localeData.resources);
}
