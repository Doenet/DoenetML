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
 * Build the translator for a {@link LocaleData} payload, negotiating the
 * requested locale against the catalogs available inside the worker.
 *
 * Those are whatever reached the worker as `LocaleData.resources`. The worker
 * carries no translation of its own — English is appended behind every chain by
 * {@link createTranslator}, and every other language is loaded on the main
 * thread and sent through. `documentLocale="es"` therefore produces Spanish
 * style descriptions with nothing configured, one load after the first paint.
 *
 * Never isolates its placeables, unlike the chrome translator. What this builds
 * becomes state variables — `$line.styleDescription` and the rest — that an
 * author interpolates into prose, an `<award>` compares against a response, and
 * the answer machinery folds into a SHA-1 of the dependency graph. Invisible
 * marks in any of those break a comparison silently. The line is drawn at what
 * is compared, not at what looks like prose.
 *
 * @param locale The content locale to render in. Defaults to the one in
 *   `localeData`; the caller passes a different tag when an authored
 *   `<document lang>` overrides what the host asked for.
 */
export function createTranslatorFromLocaleData(
    localeData: LocaleData,
    locale: string = localeData.locale,
): Translator {
    const { resources } = localeData;
    const chain = negotiateLocales([locale], Object.keys(resources));
    return createTranslator(chain, resources);
}
