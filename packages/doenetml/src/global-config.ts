if (typeof window === "undefined") {
    // @ts-ignore
    globalThis.window = globalThis;
}

/**
 * Global configuration object for DoenetML.
 */
export const doenetGlobalConfig: {
    doenetWorkerUrl: string;
    /**
     * Opt-in (#1466): host multiple document cores in a shared core worker
     * instead of one dedicated worker per document. Collapses the ~104 MB
     * per-worker fixed floor (script eval + WASM compile) to one copy per
     * worker, at the cost of coarser failure isolation: a worker-level hang
     * or crash affects every document on that worker (per-core teardown is
     * still individual). Default off.
     */
    useSharedCoreWorker?: boolean;
    /**
     * Pool cap for `useSharedCoreWorker`: maximum live cores per shared
     * worker before a new worker is spun up. Bounds both the blast radius of
     * a worker-level failure and single-isolate heap pressure. Falls back to
     * a built-in default when unset.
     */
    sharedCoreWorkerMaxCores?: number;
    /**
     * Host-provided core factory (#1466): when set, `createCoreWorker`
     * obtains each core over a `MessagePort` minted by this function instead
     * of creating (or sharing) a worker in this realm. Used by
     * `@doenet/doenetml-iframe` to multiplex the cores of many same-origin
     * iframes onto worker(s) owned by the PARENT page — an iframe realm
     * cannot share workers with its siblings on its own. The returned `port`
     * must speak the per-core `CoreWorker` Comlink protocol (the far end is
     * typically handed to a host worker's `createCore`); `destroy` releases
     * the core, forwarding wedge suspicion (see `CoreWorkerHandle.kill`).
     * Returning `null` falls back to this realm's own workers.
     */
    createExternalCoreWorkerPort?: () => {
        port: MessagePort;
        destroy: (suspectWedge?: boolean) => void;
    } | null;
    /**
     * Maximum number of times `DocViewer` will retry the core-worker
     * *handshake* before giving up and surfacing an error. Each handshake
     * that fails to complete within `coreHandshakeWatchdogMs` is abandoned
     * and retried with a fresh worker. Falls back to a built-in default when
     * unset.
     */
    coreBootMaxAttempts?: number;
    /**
     * Per-attempt watchdog, in milliseconds, for the core-worker *handshake*
     * in `DocViewer` — i.e. (re)creating the worker and running the cheap,
     * roughly size-independent init round-trips (set source/flags, initialize
     * the JS core). A handshake that neither resolves nor rejects within this
     * window is treated as a stalled/wedged worker (Doenet/DoenetApps#2957):
     * the worker is force-terminated and the handshake retried.
     *
     * This watchdog deliberately does NOT cover the subsequent `generateDast`
     * step, which is the legitimately slow, document-size-dependent phase
     * (seconds to minutes on complex documents). Time-boxing that phase would
     * make large documents unloadable, so once the handshake completes — the
     * worker having proven it is alive — the evaluation runs to completion
     * however long it takes. Falls back to a built-in default when unset.
     */
    coreHandshakeWatchdogMs?: number;
    /**
     * Test-only seam. When set, `DocViewer` awaits this at each core-init
     * phase: `"handshake"` (covered by the watchdog) and `"generate"` (the
     * un-watchdogged evaluation). Throwing, rejecting, or returning a
     * never-resolving promise lets a test deterministically simulate either a
     * hung/wedged worker handshake or a slow-but-alive evaluation
     * (Doenet/DoenetApps#2957). Always `undefined` in production.
     */
    __doenetTestCoreInitHook?: (
        phase: "handshake" | "generate",
        attempt: number,
    ) => void | Promise<void>;
} = {
    doenetWorkerUrl: getWorkerUrl(),
};
// We want this to be available in the global scope
(window as any).doenetGlobalConfig = doenetGlobalConfig;

/**
 * Attempt to resolve the URL of the doenet worker. This function falls back
 * to `doenet.org` if an error is thrown.
 * @returns
 */
function getWorkerUrl() {
    try {
        return new URL(
            "/doenetml-worker/index.js",
            window?.location?.href || "https://doenet.org",
        ).href;
    } catch (e) {
        // `window.location.href` may not be a valid URL. For example, in an iframe it
        // could be `about:srcdoc`.
        return "https://doenet.org/doenetml-worker/index.js";
    }
}

/**
 * Rewrite the version specifier in a CDN URL naming `packageName`, so a bundle
 * loaded through a floating tag resolves its sibling assets at the exact
 * release it was itself built as. This is the canonical account of why; callers
 * point back here.
 *
 * `@doenet/standalone` is no longer one file: the core worker is served at
 * `doenetml-worker/index.js` beside the bundle (#1465) and the message catalogs
 * under `locales/` (#1656), each fetched at run time as its own URL. Under a
 * floating specifier — `@latest`, or a partial version such as `@0.7`, which
 * jsDelivr resolves as an npm range — those URLs cache independently of the
 * bundle's: jsDelivr serves `max-age=604800` to the browser and `s-maxage=43200`
 * to its own edge, and a release purges only the edge.
 *
 * So the pieces can skew. A browser that fetched the bundle after a release and
 * the worker before it holds a new bundle paired with the previous release's
 * core, which never completes the Comlink handshake — the viewer retries and
 * then shows "The document viewer could not be started" (see
 * `Viewer/coreWorkerBoot.ts`). Only clearing the browser cache fixes that, which
 * no purge can reach. It is not hypothetical: 0.7.22 shipped a changed core
 * worker under a tag whose worker URL that release did not purge.
 *
 * Pinning closes the whole class. An exact version is immutable on jsDelivr and
 * unpkg alike (`max-age=31536000, immutable`), so a sibling resolved beside a
 * pinned bundle is necessarily that bundle's release, whatever any cache holds
 * and whether or not the purge ran.
 *
 * (It lives in this module, rather than one of its own, so that Rollup keeps
 * naming `@doenet/doenetml`'s big shared chunk `doenetml-<hash>.js` — the chunk
 * takes its name from a module in it.)
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
    // It must also be a whole run of segments — bounded by `/` ahead of it and,
    // past the optional `@<spec>`, by `/` behind — which is what keeps
    // `@doenet/standalone` from matching inside `@doenet/standalone-foo`.
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
        // pin" (see `@doenet/standalone`'s entry).
        return url;
    }
    parsed.pathname = `${npmPrefix ?? ""}${pkgPath}@${version}${parsed.pathname.slice(matched.length)}`;
    return parsed.href;
}
