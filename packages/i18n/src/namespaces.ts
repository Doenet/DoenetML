/**
 * Catalog namespaces.
 *
 * The split is by *load context*, not by topic: a consumer should be able to
 * ship only the catalogs it can actually render. The worker, for instance,
 * renders nothing but core-computed prose, so it only ever needs `content`.
 */
export const CATALOG_NAMESPACES = [
    "chrome",
    "content",
    "diagnostics",
    "editor",
] as const;

export type CatalogNamespace = (typeof CATALOG_NAMESPACES)[number];

/**
 * Namespaces the web worker needs: core-computed prose, and nothing else.
 *
 * Not `diagnostics`, even though the worker raises them. A diagnostic is
 * addressed to whoever is looking at the screen, so it answers to `uiLocale`,
 * which the worker has no business knowing — it emits a stable code plus the
 * arguments that fill the message in, and the main thread renders it (#1518).
 * The English it writes onto each record while it is there comes from the
 * built-in English catalogs, which `createTranslator` appends whole. So a
 * *translated* diagnostics catalog would be dead weight in the worker bundle.
 */
export const WORKER_NAMESPACES: readonly CatalogNamespace[] = ["content"];

/** Namespaces the main-thread viewer/editor chrome needs. */
export const CHROME_NAMESPACES: readonly CatalogNamespace[] = [
    "chrome",
    "diagnostics",
];

export type Catalogs = Partial<Record<CatalogNamespace, string>>;

/**
 * Concatenate per-namespace FTL sources into the single source a Fluent
 * bundle consumes.
 *
 * Namespaces share one bundle, so message ids must be unique across the
 * catalogs a given context loads. `lint:i18n` enforces that.
 *
 * Sources are joined with a newline, so a catalog whose last line lacks one
 * cannot run into the next catalog's first entry.
 */
export function combineCatalogs(catalogs: Catalogs): string {
    return CATALOG_NAMESPACES.map((namespace) => catalogs[namespace])
        .filter((source): source is string => source !== undefined)
        .join("\n");
}
