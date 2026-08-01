import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    createChromeTranslator,
    directionOf,
    loadLocaleResourcesFor,
    localeResourceKey,
    resolveDocumentLocale,
    resolveUiLocale,
    CATALOG_NAMESPACES,
    DEFAULT_LOCALE,
    EN_CHROME_TRANSLATOR,
    type Direction,
    type Translator,
} from "@doenet/i18n";

/**
 * The language the chrome renders in, and the translator that does it.
 *
 * The tag travels beside the translator because a consumer that has to format
 * something *outside* Fluent — `Intl.ListFormat`, in the diagnostic formatters
 * the error box and the editor's hover tooltips build — needs to know which
 * language to format it in, and a `Translator` alone cannot say.
 *
 * Defaults to English rather than to a throwing or empty translator:
 * `@doenet/doenetml` exports its renderers individually, so one can be mounted
 * by a host that never set up a locale. Those hosts should keep seeing exactly
 * what they see today.
 */
const I18nContext = createContext<{ translate: Translator; locale: string }>({
    translate: EN_CHROME_TRANSLATOR,
    locale: DEFAULT_LOCALE,
});

/**
 * The catalogs available for a set of locales: whatever the host supplied,
 * plus whatever this build can code-split in for the tags actually asked for.
 *
 * Every locale beyond `BUNDLED_LOCALES` arrives this way, which is what lets
 * `documentLocale="fr"` and `<document lang="fr">` work with nothing
 * configured. A host that supplies a catalog of its own still wins: its map is
 * merged last, so a deployment can correct a shipped translation.
 *
 * Returns the host's map *by identity* until something has actually loaded.
 * Catalogs are compared by which locales they hold rather than by their
 * contents, and `DocViewer` rebuilds the core when one of the content's
 * arrives — so handing back an empty map before the host's had arrived would
 * build the core once without it and again with it, for nothing.
 *
 * Loaded catalogs accumulate rather than being replaced. A viewer whose locale
 * changes and changes back should not pay for the same catalog twice, and a
 * stale entry costs only the negotiation passing it over.
 *
 * @param locales The tags in play — the content's and the reader's, which need
 *   not agree. Blanks, repeats and English are ignored.
 * @param hostResources Catalogs the embedding page supplied.
 */
export function useLocaleCatalogs(
    locales: (string | null | undefined)[],
    hostResources?: Record<string, string> | null,
): Record<string, string> | null | undefined {
    const [loaded, setLoaded] = useState<Record<string, string>>({});

    const hostKey = localeResourceKey(hostResources);
    // The locales as a scalar, so the effect re-runs when *which* languages
    // are wanted changes rather than on every render that rebuilds the array.
    const wantedKey = [...new Set(locales.filter(Boolean))].sort().join(",");

    useEffect(() => {
        let cancelled = false;
        async function load() {
            const resources = await loadLocaleResourcesFor(
                locales,
                CATALOG_NAMESPACES,
                { available: Object.keys(hostResources ?? {}) },
            );
            if (cancelled || Object.keys(resources).length === 0) {
                return;
            }
            setLoaded((previous) => {
                const next = { ...previous, ...resources };
                // Same locales as before means nothing downstream needs to
                // know, and re-keying would rebuild the core.
                return localeResourceKey(next) === localeResourceKey(previous)
                    ? previous
                    : next;
            });
        }
        load().catch(() => {
            // A catalog that cannot be fetched leaves the locale falling back
            // to English, which is what an untranslated locale does anyway.
            // Nothing here is worth failing a render over.
        });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wantedKey, hostKey]);

    return useMemo(() => {
        if (Object.keys(loaded).length === 0) {
            return hostResources;
        }
        return { ...loaded, ...hostResources };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded, hostKey]);
}

/**
 * Build the chrome translator for a resolved UI locale.
 *
 * @param uiLocale The chrome's language, already through `resolveUiLocale`.
 * @param localeResources Host-supplied catalogs as locale → FTL source.
 */
export function useChromeTranslator(
    uiLocale: string,
    localeResources?: Record<string, string> | null,
): Translator {
    // Keyed by *which locales* arrived, not by their contents, the way
    // everything that compares catalogs does — see `localeResourceKey`.
    const resourceKey = localeResourceKey(localeResources);

    return useMemo(
        () => createChromeTranslator(uiLocale, localeResources),
        [uiLocale, resourceKey],
    );
}

/**
 * Build the chrome translator a host's props alone imply.
 *
 * For chrome that sits *outside* the document — the virtual keyboard, the
 * variant selector — where there is no authored `<document lang>` to consult:
 * hence the `undefined` authored language. Inside the document, `DocViewer`
 * resolves the same pair of rules again against the language it parsed out of
 * the source, and mounts a nested provider with the result.
 *
 * Returns the resolved tag alongside the translator, because that is what
 * {@link I18nProvider} publishes and the caller has no other way to recover it
 * — the resolution happens in here.
 *
 * @param uiLocale The `uiLocale` prop, if the host set one.
 * @param documentLocale The `documentLocale` prop, if the host set one.
 * @param localeResources Host-supplied catalogs as locale → FTL source.
 */
export function useHostChromeTranslator(
    uiLocale: string | null | undefined,
    documentLocale: string | null | undefined,
    localeResources?: Record<string, string> | null,
): { translate: Translator; locale: string } {
    const locale = resolveUiLocale(
        uiLocale,
        resolveDocumentLocale(undefined, documentLocale),
    );
    const translate = useChromeTranslator(locale, localeResources);
    return { translate, locale };
}

/**
 * Publish a translator to every `useT()` below it.
 *
 * Mounted twice per viewer, on purpose: `doenetml.tsx` mounts one from the
 * props alone, covering chrome outside the document, and `DocViewer` nests a
 * second inside it, because only there is an authored `<document lang>` known.
 * The inner one wins for renderers, which is the right split — the keyboard is
 * host chrome, the renderers are inside the document.
 */
export function I18nProvider({
    translate,
    locale,
    children,
}: {
    translate: Translator;
    /** The resolved `uiLocale` `translate` was built for. */
    locale: string;
    children: React.ReactNode;
}) {
    // Memoized so a re-render of the provider's parent doesn't hand every
    // consumer a new object and re-render the whole document with it.
    const value = useMemo(() => ({ translate, locale }), [translate, locale]);
    return (
        <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    );
}

/**
 * The chrome translator in effect.
 *
 * Call it with a string-literal key and an English fallback:
 * `t("answer-correct", undefined, "Correct")`. Both parts are load-bearing —
 * `lint:i18n` matches exactly that shape to check the key exists, and the
 * fallback is what renders if a catalog is somehow missing it.
 */
export function useT(): Translator {
    return useContext(I18nContext).translate;
}

/**
 * The language the chrome is rendering in.
 *
 * For a consumer that has to format something Fluent isn't formatting — today,
 * the diagnostic formatters in `_error.tsx` and `EditorViewer`, which join
 * list arguments with `Intl.ListFormat`.
 */
export function useUiLocale(): string {
    return useContext(I18nContext).locale;
}

/**
 * The direction of the document this chrome is drawn inside, or `null` where
 * there is no surrounding document to disagree with.
 *
 * `null` is the default so a renderer mounted outside `DocViewer` — or before
 * the core has answered — adds no attributes and behaves as it does today.
 */
const DocumentDirectionContext = createContext<Direction | null>(null);

/**
 * Declare the direction of the document the chrome below is drawn inside.
 *
 * Mounted twice over: once by `DocViewer` for the outermost document, and again
 * by `section.tsx` around a nested `<document lang>`, which turns its own
 * subtree around and so becomes what the chrome inside *it* has to agree with.
 * Without the second, a hint inside `<document lang="ar">` would compare itself
 * against the activity's direction and stay silent while sitting in a box
 * running the other way.
 */
export function DocumentDirectionProvider({
    direction,
    children,
}: {
    direction: Direction;
    children: React.ReactNode;
}) {
    return (
        <DocumentDirectionContext.Provider value={direction}>
            {children}
        </DocumentDirectionContext.Provider>
    );
}

/**
 * The direction of the nearest enclosing document, or `null` outside any.
 *
 * For a renderer that both *declares* a direction and draws chrome of its own
 * inside it — today only `section.tsx`, which has to compare its own heading
 * against the box it is about to open rather than the one around it.
 */
export function useDocumentDirection(): Direction | null {
    return useContext(DocumentDirectionContext);
}

/** What {@link useChromeLangDir} spreads onto a piece of chrome. */
export type ChromeLangDir = { lang?: string; dir?: Direction };

/**
 * {@link useChromeLangDir} without the hook, for a caller that renders *above*
 * {@link DocumentDirectionProvider} and so cannot read the context — today only
 * `DocViewer`'s error banner, which is built before the providers it sits
 * inside.
 *
 * @param documentDirection The direction of the surrounding document, or `null`
 *   where there is none to disagree with.
 */
export function chromeLangDir(
    uiLocale: string,
    documentDirection: Direction | null,
): ChromeLangDir {
    const chromeDirection = directionOf(uiLocale);
    if (documentDirection === null || documentDirection === chromeDirection) {
        return {};
    }
    return { lang: uiLocale, dir: chromeDirection };
}

/**
 * `lang` and `dir` for a piece of chrome, or `{}` when it needs neither.
 *
 * The viewer labels its wrapper with the *document's* language, and mounts the
 * chrome provider inside it — so every string a renderer draws through
 * {@link useT} is the reader's language sitting in a box declared to be the
 * content's. That costs nothing while the two run the same way, and is why
 * this returns an empty object in the overwhelmingly common case: spreading it
 * then adds no attribute to the element it is spread onto. (Three of the call
 * sites wrap their string in a `<span>` to have something to spread onto; that
 * span is inert when the object is empty.)
 *
 * It matters when they disagree, which is the case right-to-left support
 * exists for: a Spanish-speaking reader working an Arabic activity. Without
 * this, their English or Spanish chrome renders inside `dir="rtl"` and its
 * trailing punctuation, parentheses and percent signs land on the wrong end of
 * the sentence.
 *
 * Spread it onto chrome that sits *inside* the document — the error box, the
 * feedback heading, the click-to-toggle text on a hint, a solution or a
 * collapsible section. Do not spread it onto anything reading
 * {@link useContentT}: the check-work widget follows the document's language
 * on purpose, so it should follow the document's direction too.
 */
export function useChromeLangDir(): ChromeLangDir {
    return chromeLangDir(useUiLocale(), useDocumentDirection());
}

/**
 * The translator for the *document's* language, as opposed to the reader's.
 *
 * Defaults to English for the same reason {@link I18nContext} does: a renderer
 * mounted outside any provider should keep rendering what it renders today.
 */
const ContentI18nContext = createContext<Translator>(EN_CHROME_TRANSLATOR);

/**
 * Publish the document-language translator to every {@link useContentT} below.
 *
 * Mounted by `DocViewer` beside {@link I18nProvider}, from the same
 * `effectiveDocumentLocale` the core was handed — so a word this renders and a
 * word the worker computed cannot disagree.
 *
 * Needs no `useMemo` where {@link I18nProvider} does: what it publishes is the
 * translator itself, which `useChromeTranslator` already memoizes, rather than
 * an object rebuilt on every render.
 */
export function ContentI18nProvider({
    translate,
    children,
}: {
    translate: Translator;
    children: React.ReactNode;
}) {
    return (
        <ContentI18nContext.Provider value={translate}>
            {children}
        </ContentI18nContext.Provider>
    );
}

/**
 * A translator bound to the document's language — usually *not* the one to
 * reach for. Almost everything a renderer draws is chrome and belongs on
 * {@link useT}; this is for a control the core already writes part of, where
 * following the reader would put one widget in two languages.
 *
 * The check-work button is the case it exists for, and the reason is a chain
 * of two links rather than taste. Its resting label is `submitLabel`, a
 * *content* state variable: an author can write `submitLabel="Comprueba"`, and
 * can interpolate `$ans.submitLabel` into their own prose — "Pulsa el botón
 * $ans.submitLabel" — so its value cannot depend on who is reading, and the
 * worker that computes it is never told `uiLocale`. Everything the button says
 * afterwards ("Correct", "37% Credit", "no attempts remaining") therefore has
 * to answer to the same tag, or the sentence pointing at the button stops
 * naming what the button says.
 *
 * What answers to it is the whole control, not each string weighed alone. The
 * button's visually hidden span carries `submitLabel` verbatim beside the
 * status only a screen reader hears ("Checking answer"), so putting that
 * announcement in the reader's language would leave one span bilingual; the
 * `Max credit available: 80%; 1 attempt remaining` line renders as a single
 * joined sentence immediately after the button and splits no better.
 *
 * This is deliberately *not* the rule for everything drawn inside the
 * document. What a *neighbouring* element says is weighed on its own, and
 * mostly comes out the other way: the in-document error box follows the reader
 * (#1570), and so does the validation state appended to an input's accessible
 * description, because both are addressed to whoever is looking at the screen
 * and no authored prose ever refers to them. The test is whether the author's
 * own document talks about the words — not where they appear.
 *
 * The catalogs are the same ones {@link useT} resolves against; only the
 * negotiated locale differs. The keys stay in `chrome.ftl` because namespaces
 * split by *load context*, and these are drawn on the main thread — moving
 * them to `content` would ship them to the worker, which never draws them.
 *
 * Bind it as `tContent`, and reach its keys through a helper whose own
 * parameter is named `t` (`createCheckWorkComponent`). `lint:i18n` only sees
 * call sites through a translator named `t` or `translate`, so a key called
 * straight off `tContent` would read as an orphan; the name also keeps `t`
 * meaning the reader's translator in every renderer.
 */
export function useContentT(): Translator {
    return useContext(ContentI18nContext);
}
