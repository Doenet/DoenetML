/**
 * Catalog namespaces.
 *
 * The split is by *load context*, not by topic: a consumer should be able to
 * ship only the catalogs it can actually render. The worker, for instance,
 * never draws chrome, so it only ever needs `content` and `diagnostics`.
 */
export const CATALOG_NAMESPACES = [
    "chrome",
    "content",
    "diagnostics",
    "editor",
] as const;

export type CatalogNamespace = (typeof CATALOG_NAMESPACES)[number];

/** Namespaces the web worker needs: core-computed prose and diagnostics. */
export const WORKER_NAMESPACES: readonly CatalogNamespace[] = [
    "content",
    "diagnostics",
];

/** Namespaces the main-thread viewer/editor chrome needs. */
export const CHROME_NAMESPACES: readonly CatalogNamespace[] = [
    "chrome",
    "diagnostics",
];

export type Catalogs = Partial<Record<CatalogNamespace, string>>;

/**
 * Concatenate per-namespace FTL sources into the single source a
 * {@link FluentBundle} consumes.
 *
 * Namespaces share one bundle, so message ids must be unique across the
 * catalogs a given context loads. `lint:i18n` enforces that.
 */
export function combineCatalogs(catalogs: Catalogs): string {
    return CATALOG_NAMESPACES.map((namespace) => catalogs[namespace])
        .filter((source): source is string => source !== undefined)
        .join("\n");
}
