/**
 * Rewrite the version specifier in a CDN URL naming `packageName`, so a bundle
 * loaded through a floating tag resolves its sibling assets at the exact
 * release it was itself built as. This is the canonical account of why; callers
 * point back here.
 *
 * This bundle is no longer one file: the core worker is served at
 * `doenetml-worker/index.js` beside it (#1465) and the message catalogs under
 * `locales/` (#1603, wired to the viewer in #1656), each fetched at run time as
 * its own URL. Under a floating specifier — `@latest`, or a partial version
 * such as `@0.7`, which jsDelivr resolves as an npm range — those URLs cache
 * independently of the bundle's: jsDelivr serves `max-age=604800` to the
 * browser and `s-maxage=43200` to its own edge, and a release purges only the
 * edge.
 *
 * So the pieces can skew. A browser that fetched the bundle after a release and
 * the worker before it holds a new bundle paired with the previous release's
 * core, which never completes the Comlink handshake — the viewer retries and
 * then shows "This document could not be started" (see
 * `Viewer/coreWorkerBoot.ts` in `@doenet/doenetml`). Only clearing the browser
 * cache fixes that, which no purge can reach. It is not hypothetical: 0.7.22
 * shipped a changed core worker under a tag whose worker URL that release did
 * not purge.
 *
 * Pinning closes the whole class. An exact-version URL names one immutable npm
 * release, so a sibling resolved beside a pinned bundle is necessarily that
 * bundle's own release, whatever any cache holds and whether or not the purge
 * ran — and both CDNs say as much, serving it `max-age=31536000` (jsDelivr adds
 * `immutable`) rather than a week.
 *
 * @param url The bundle's own URL, normally `import.meta.url`.
 * @param packageName The npm package whose version segment to rewrite, e.g.
 *   `"@doenet/standalone"`.
 * @param version The exact version to pin to — the bundle's compiled-in one.
 * @returns `url` with the `@<spec>` following `packageName` replaced by
 *   `@<version>`, and supplied outright under jsDelivr's `/npm/` prefix where
 *   the path names none. Every other URL comes back unchanged — self-hosted
 *   copies, `blob:`/`data:` bases, anything unparseable — because a URL that
 *   carries no CDN version to correct is left alone rather than guessed at.
 */
export function pinPackageVersion(
    url: string,
    packageName: string,
    version: string,
): string {
    if (!version) {
        return url;
    }
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return url;
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        // `blob:`/`data:` — nothing is "beside" them and there is no version
        // segment to rewrite.
        return url;
    }
    // Match the package name only where a CDN puts it: at the root of the path
    // (unpkg's `/<pkg>@<spec>/…`) or directly under jsDelivr's `/npm/` prefix.
    // It must also be a whole run of segments — a `/` before it, and past the
    // optional `@<spec>` a `/` after — which is what keeps `@doenet/standalone`
    // from matching inside `@doenet/standalone-foo`.
    //
    // The anchor carries as much weight as the bounds. A self-hosted deployment
    // that serves `node_modules` through —
    // `https://host/node_modules/@doenet/standalone/doenet-standalone.js` — has
    // the package name in its path too, and *inserting* a version there would
    // send every sibling to a path that does not exist — turning a working
    // deploy into the very failure this function prevents elsewhere. Only a URL
    // already laid out like a CDN's is rewritten; anything else is left alone.
    const escaped = packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = new RegExp(`^(/npm)?(/${escaped})(@[^/]*)?(?=/)`).exec(
        parsed.pathname,
    );
    if (match === null) {
        return url;
    }
    const [matched, npmPrefix, pkgPath, spec] = match;
    if (npmPrefix === undefined && spec === undefined) {
        // The same hazard one step further in: at the path root, a package name
        // carrying no version is as much that `node_modules` tree mapped onto
        // the web root as it is unpkg, and only one of those two readings can
        // survive a guess. Declining costs nothing — unpkg redirects a
        // versionless URL to its exact version before the module runs, so a
        // bundle loaded that way already sees an exact `import.meta.url`.
        // jsDelivr's `/npm/` prefix names the registry outright and does not
        // redirect, so a missing version there is supplied.
        return url;
    }
    if (spec === `@${version}`) {
        // Already this release's. Hand back the caller's own string: callers
        // compare the result against what they passed to detect "nothing to
        // pin" (see the entry module).
        return url;
    }
    parsed.pathname = `${npmPrefix ?? ""}${pkgPath}@${version}${parsed.pathname.slice(matched.length)}`;
    return parsed.href;
}
