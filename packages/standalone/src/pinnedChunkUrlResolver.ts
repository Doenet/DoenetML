/**
 * The runtime half of chunk-URL pinning for the code-split bundle.
 *
 * The build (see `scripts/pin-chunk-urls-plugin.ts`) rewrites every emitted
 * chunk reference — the facade's import of the eager chunk and each lazy
 * `import()` inside the chunks — to go through the resolver this factory
 * returns, and injects both this factory and `pinPackageVersion` into the
 * chunks as stringified plain functions. Stringification is what makes the
 * injection sound, and it constrains this module: **everything here must be
 * self-contained** — no imports, no references to anything outside the
 * function's own parameters and standard globals — because in an emitted chunk
 * the surrounding module scope of this source file does not exist.
 *
 * Why the chunk references need pinning at all: PreTeXt documents load this
 * bundle from a CDN under a floating tag (`@latest`, or no version), which
 * jsDelivr serves 200 directly — no redirect to the concrete release — with
 * `s-maxage=43200` (12 h per edge) and `max-age=604800` (7 days in the
 * browser). After a release, a reader whose cached entry came from release N
 * requests a first-time lazy chunk under the floating tag, which the edge now
 * resolves to release N+1 — where that content-hashed chunk name does not
 * exist. The request 404s and the renderer-failed placeholder appears, and a
 * plain reload does not help because the stale entry is cached without
 * revalidation. Resolving every chunk reference against the importing module's
 * *pinned* URL closes the class: pinned CDN URLs name one immutable release
 * (served `max-age=31536000`), so a release-N entry always gets release-N
 * chunks, whatever any cache holds. `pinPackageVersion` documents the URL
 * grammar and which URLs are left alone.
 */

/** The shape of `pinPackageVersion`, which the build passes in stringified. */
type PinPackageVersion = (
    url: string,
    packageName: string,
    version: string,
) => string;

/**
 * Make the resolver a chunk turns its emitted relative chunk paths into
 * absolute, same-release URLs with.
 *
 * @param pin `pinPackageVersion` (a parameter, not an import, so the
 *   stringified factory stays self-contained; see the module doc).
 * @param selfUrl The chunk's own URL — `import.meta.url` at the injection
 *   site.
 * @param packageName The npm package a CDN URL would name, e.g.
 *   `"@doenet/standalone"`.
 * @param version The exact version this bundle was built as.
 * @returns A function from a chunk reference as the build emitted it
 *   (`"./chunks/Name-hash.js"` in the facade, `"./Name-hash.js"` between
 *   chunks) to the URL to load it from. On a CDN URL with a floating or
 *   mismatched specifier that is the exact-version URL; everywhere else —
 *   self-hosted copies, localhost, an already-pinned URL — it is exactly what
 *   relative resolution produces today. A base no URL can be resolved against
 *   (`blob:`) hands the relative path back unchanged, so the ensuing
 *   `import()` fails the same way it would have without the resolver: as a
 *   rejected promise, never a synchronous throw.
 */
export function makePinnedChunkUrlResolver(
    pin: PinPackageVersion,
    selfUrl: string,
    packageName: string,
    version: string,
): (relativePath: string) => string {
    const base = pin(selfUrl, packageName, version);
    return function pinnedChunkUrl(relativePath: string): string {
        try {
            return new URL(relativePath, base).href;
        } catch {
            return relativePath;
        }
    };
}
