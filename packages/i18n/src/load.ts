import { BUNDLED_LOCALES } from "./bundled";
import { DEFAULT_LOCALE } from "./catalogs";
import { SUPPORTED_LOCALES } from "./generated/supportedLocales";
import {
    CATALOG_NAMESPACES,
    combineCatalogs,
    type CatalogNamespace,
    type Catalogs,
} from "./namespaces";
import { negotiateLocales, normalizeLocaleTag } from "./negotiate";

/**
 * Fetch one locale's catalogs, for the namespaces the asking context can
 * actually render.
 *
 * The namespaces are a parameter rather than a fixed set because each one costs
 * separately: {@link fetchLocaleLoaders} makes a request per namespace, and the
 * code-split loaders pull a chunk per namespace. A context that renders a
 * subset — `WORKER_NAMESPACES`, which is `content` alone — should not move four
 * catalogs to get one.
 *
 * The viewer asks for all four, because the map it builds serves both jobs: its
 * own chrome reads three of them, and the core it hands `LocaleData.resources`
 * to reads the fourth.
 *
 * A namespace the locale has no catalog for is simply absent from the result.
 * A partial translation is legitimate — the missing keys fall through to
 * English — and so is a locale that translates one namespace and not another.
 */
export type LocaleLoader = (
    namespaces: readonly CatalogNamespace[],
) => Promise<Catalogs>;

/** Loadable locales, as tag → loader. */
export type LocaleLoaders = Record<string, LocaleLoader>;

/**
 * Whether this build can code-split catalogs at all.
 *
 * A build-time constant, replaced by `define`, because a single-file build
 * cannot: `inlineDynamicImports` folds every dynamic import back into the one
 * output file, so the glob below would put every catalog in the bundle it is
 * meant to keep them out of — and being reachable is enough, whether or not
 * anything ever calls it. Setting it `false` lets the branch be dead-code
 * eliminated, and such a build supplies {@link fetchLocaleLoaders} pointed at
 * a copy of `locales/` served beside it instead.
 *
 * `typeof` rather than a bare read so this is still valid where nothing
 * defines it, which is every build but that one.
 */
declare const __DOENET_CODE_SPLIT_CATALOGS__: boolean;

const CODE_SPLIT_CATALOGS =
    typeof __DOENET_CODE_SPLIT_CATALOGS__ === "undefined" ||
    __DOENET_CODE_SPLIT_CATALOGS__;

/**
 * Every catalog under `locales/`, as a lazy per-file dynamic import.
 *
 * A glob rather than a generated registry, for the same reason
 * `supportedLocales.ts` derives its names from `Intl` rather than spelling
 * them out: adding a language should cost a directory and nothing else. A
 * generated module would have to be regenerated, committed, and kept from
 * drifting, and would buy nothing the bundler cannot work out for itself.
 *
 * Vite compiles this to one `import()` per file, which is what keeps the
 * catalogs out of the entry chunk. `?raw` is the same import `catalogs.ts`
 * uses for English; nothing here parses FTL, it only moves the source.
 *
 * The exclusions are the {@link BUNDLED_LOCALES}, which are already in the
 * entry chunk: a locale that is both statically and dynamically imported does
 * not get its own chunk anyway, and Rollup says so on every build. They have
 * to be spelled out because a glob pattern is resolved at build time and
 * cannot read a runtime list — so `lint:i18n` compares the two and fails if
 * they drift. Add a locale to `BUNDLED_TRANSLATIONS` and a `!` line here at
 * the same time.
 */
const LAZY_CATALOG_MODULES = CODE_SPLIT_CATALOGS
    ? (import.meta.glob(
          [
              "../locales/*/*.ftl",
              "!../locales/en/*.ftl",
              "!../locales/es/*.ftl",
          ],
          { query: "?raw", import: "default" },
      ) as Record<string, () => Promise<string>>)
    : {};

/** `../locales/<locale>/<namespace>.ftl` */
const CATALOG_PATH_PATTERN = /\/locales\/([^/]+)\/([^/]+)\.ftl$/;

/** One locale's catalogs, as a dynamic import per namespace it translates. */
type CatalogImporters = Partial<
    Record<CatalogNamespace, () => Promise<string>>
>;

function isCatalogNamespace(name: string): name is CatalogNamespace {
    return (CATALOG_NAMESPACES as readonly string[]).includes(name);
}

/**
 * Turn the glob's flat `path → import()` map into one loader per locale.
 *
 * A path that does not name a locale and a known namespace is skipped rather
 * than rejected: the glob is a filesystem pattern, and a stray file under
 * `locales/` should not stop the catalogs beside it from loading.
 */
function loadersFromModules(
    modules: Record<string, () => Promise<string>>,
): LocaleLoaders {
    const byLocale: Record<string, CatalogImporters> = {};
    for (const [modulePath, importModule] of Object.entries(modules)) {
        const match = CATALOG_PATH_PATTERN.exec(modulePath);
        if (!match || !isCatalogNamespace(match[2])) {
            continue;
        }
        (byLocale[match[1]] ??= {})[match[2]] = importModule;
    }

    const loaders: LocaleLoaders = {};
    for (const [locale, importers] of Object.entries(byLocale)) {
        loaders[locale] = async (namespaces) => {
            // Only the namespaces this locale actually translates; the rest
            // are simply absent from the result and fall back to English.
            const wanted = namespaces.filter((namespace) =>
                Boolean(importers[namespace]),
            );
            const sources = await Promise.all(
                wanted.map((namespace) => importers[namespace]!()),
            );
            const catalogs: Catalogs = {};
            wanted.forEach((namespace, index) => {
                catalogs[namespace] = sources[index];
            });
            return catalogs;
        };
    }
    return loaders;
}

/**
 * The loaders the viewer uses unless a host supplies its own: the catalogs
 * that shipped in this build, code-split out of the entry chunk.
 */
export const LAZY_LOCALE_LOADERS: LocaleLoaders =
    loadersFromModules(LAZY_CATALOG_MODULES);

/**
 * Loaders that fetch catalogs the *host* serves, laid out as
 * `<baseUrl>/<locale>/<namespace>.ftl`.
 *
 * For two situations the bundled loaders cannot cover. A single-file build
 * (`@doenet/standalone`) inlines every dynamic import by construction, so
 * code-splitting cannot keep catalogs out of it — pointing this at a copy of
 * `locales/` served beside the bundle keeps them out instead, the same trick
 * the core worker already uses to stay out of that file. And a deployment with
 * a translation of its own has somewhere to put it without rebuilding
 * DoenetML.
 *
 * A locale whose catalogs 404 loads as nothing and falls back to English,
 * rather than failing the render: a missing translation is not an error, and
 * this runs during a paint.
 *
 * A base URL that cannot be resolved is treated the same way, and that is
 * load-bearing rather than defensive habit. `blob:` and `about:srcdoc` are
 * both opaque — `new URL("./x", blobUrl)` throws — and both are real bases
 * here: `@doenet/doenetml-iframe` boots the standalone bundle from a Blob URL,
 * which is exactly where `import.meta.url` is one. Resolving eagerly would
 * throw while the caller is still evaluating its module, taking the whole
 * bundle down over a missing translation. So each URL is built inside the
 * fetch that uses it, where a failure already means English.
 *
 * @param baseUrl Directory the catalogs are served from, as a URL or a string
 *   to resolve one from — typically `import.meta.url` for a copy shipped
 *   beside the bundle.
 * @param locales Tags to offer. Defaults to every locale this build knows of,
 *   which is what a host serving a copy of `locales/` has.
 */
export function fetchLocaleLoaders(
    baseUrl: string | URL,
    locales: readonly string[] = SUPPORTED_LOCALES.map((info) => info.locale),
): LocaleLoaders {
    // A base that does not end in `/` would otherwise have its last segment
    // replaced rather than extended by `new URL`.
    const base = baseUrl.toString().replace(/\/?$/, "/");
    const loaders: LocaleLoaders = {};
    for (const locale of locales) {
        if (locale === DEFAULT_LOCALE) {
            continue;
        }
        loaders[locale] = async (namespaces) => {
            const catalogs: Catalogs = {};
            await Promise.all(
                namespaces.map(async (namespace) => {
                    try {
                        // Inside the `try`: an opaque base makes this throw,
                        // and that has to degrade to English like any other
                        // catalog that cannot be reached.
                        const url = new URL(`${locale}/${namespace}.ftl`, base);
                        const response = await fetch(url);
                        if (response.ok) {
                            catalogs[namespace] = await response.text();
                        }
                    } catch {
                        // Unresolvable base, offline, blocked, or no such
                        // catalog. English covers it.
                    }
                }),
            );
            return catalogs;
        };
    }
    return loaders;
}

let installedLoaders: LocaleLoaders | null = null;

/**
 * Replace the loaders every caller gets by default.
 *
 * For a build that cannot code-split — `@doenet/standalone` — to point the
 * viewer at catalogs it serves itself, once, at startup, rather than threading
 * a loader through every component that might resolve a locale.
 *
 * Pass `null` to go back to whatever this build compiled in.
 */
export function setLocaleLoaders(loaders: LocaleLoaders | null): void {
    installedLoaders = loaders;
    // The cache is keyed by what was asked for, not by who answers, so entries
    // filled by the old loaders would be served for the new ones.
    inFlight.clear();
}

/** The loaders in effect: whatever was installed, else this build's own. */
function currentLocaleLoaders(): LocaleLoaders {
    return installedLoaders ?? LAZY_LOCALE_LOADERS;
}

export type LoadLocaleResourcesOptions = {
    /** Where catalogs come from. Defaults to {@link currentLocaleLoaders}. */
    loaders?: LocaleLoaders;
    /**
     * Locales the caller can already resolve — inlined in this build, or
     * handed over by the host.
     *
     * They win over anything loadable, and win *before* the fetch rather than
     * after: a locale already on hand should cost no request at all. English
     * and the {@link BUNDLED_LOCALES} are always treated as present.
     */
    available?: readonly string[];
};

/**
 * A stable cache key for one request, so N viewers on a page share one fetch.
 */
function requestKey(
    locale: string,
    namespaces: readonly CatalogNamespace[],
    available: readonly string[],
): string {
    return [
        locale,
        [...namespaces].sort().join("+"),
        [...available].sort().join("+"),
    ].join("|");
}

/**
 * Requests in flight or already settled, for the default loaders only.
 *
 * Keyed by what was asked for rather than by locale alone, because the worker
 * and the chrome ask for different namespaces of the same locale and must not
 * be served each other's answer. A `loaders` map passed at the call site is
 * deliberately not cached: it is the caller's object, and two different ones
 * can legitimately answer the same tag differently.
 */
const inFlight = new Map<string, Promise<Record<string, string>>>();

/**
 * Load the catalogs for one locale, as the `locale → FTL source` map
 * `localeResources` takes.
 *
 * Returns `{}` — not an error — whenever there is nothing to fetch: English,
 * a blank tag, a locale already {@link LoadLocaleResourcesOptions.available},
 * or one nothing offers a catalog for. That is what lets a caller run this
 * unconditionally for whatever tag it resolved.
 *
 * The tag is negotiated the way everything else is, so `documentLocale="es-MX"`
 * loads the `es` catalog and comes back keyed `es` — the key the fallback
 * chain will look for.
 */
export async function loadLocaleResources(
    locale: string,
    namespaces: readonly CatalogNamespace[] = CATALOG_NAMESPACES,
    options: LoadLocaleResourcesOptions = {},
): Promise<Record<string, string>> {
    const installed = currentLocaleLoaders();
    const { loaders = installed, available = [] } = options;
    const normalized = normalizeLocaleTag(locale);
    if (!normalized || normalized === DEFAULT_LOCALE) {
        return {};
    }

    const onHand = [...BUNDLED_LOCALES, ...available];
    const loadable = Object.keys(loaders);
    // Negotiate against both, so a tag that matches something already on hand
    // resolves to that rather than to a catalog we would have to go and get.
    const chain = negotiateLocales([normalized], [...onHand, ...loadable]);
    const negotiated = chain.find((tag) => tag !== DEFAULT_LOCALE);
    if (!negotiated || onHand.includes(negotiated) || !loaders[negotiated]) {
        return {};
    }
    // Rebound past the guard, so `load` below sees a tag and a loader rather
    // than the optionals the search returned.
    const target = negotiated;
    const loader = loaders[target];

    async function load(): Promise<Record<string, string>> {
        const source = combineCatalogs(await loader(namespaces));
        return source ? { [target]: source } : {};
    }

    if (loaders !== installed) {
        return load();
    }
    const key = requestKey(target, namespaces, onHand);
    let pending = inFlight.get(key);
    if (!pending) {
        // Cached even when it rejects would strand every later caller on one
        // bad network moment, so a failure drops out of the map and the next
        // caller retries.
        pending = load().catch((error) => {
            inFlight.delete(key);
            throw error;
        });
        inFlight.set(key, pending);
    }
    return pending;
}

/**
 * {@link loadLocaleResources} for several tags at once, merged into one map.
 *
 * The viewer resolves two locales that need not agree — the content's and the
 * reader's — and both feed the same `localeResources`. Duplicates and English
 * cost nothing, so a caller can pass whatever it resolved without sorting out
 * which are worth loading.
 */
export async function loadLocaleResourcesFor(
    locales: readonly (string | null | undefined)[],
    namespaces: readonly CatalogNamespace[] = CATALOG_NAMESPACES,
    options: LoadLocaleResourcesOptions = {},
): Promise<Record<string, string>> {
    const wanted = [
        ...new Set(locales.filter((locale): locale is string => !!locale)),
    ];
    const loaded = await Promise.all(
        wanted.map((locale) =>
            loadLocaleResources(locale, namespaces, options),
        ),
    );
    return Object.assign({}, ...loaded);
}
