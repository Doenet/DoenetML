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
 * Pin the version specifier in a CDN URL that names a package, so a bundle
 * loaded through a floating tag fetches its sibling assets from the exact
 * release it was itself built as.
 *
 * `@doenet/standalone` is no longer one file: the core worker is served at
 * `doenetml-worker/index.js` beside the bundle (#1465) and the message
 * catalogs under `locales/` (#1656), both resolved against `import.meta.url`
 * at run time. On a floating tag — `@doenet/standalone@latest`, which is what
 * `@doenet/doenetml-iframe` builds when a host asks for "latest", and what
 * PreTeXt embeds — each of those is a *separate* URL under the same tag, with
 * its own cache lifetime: jsDelivr serves them `max-age=604800` to the browser
 * and `s-maxage=43200` to its edge, and the release only purges the edge.
 *
 * So the pieces can skew. A browser that fetched the bundle after a release and
 * the worker before it holds a new bundle paired with the previous release's
 * core, which never completes the Comlink handshake — the viewer retries and
 * then shows "The document viewer could not be started" (see
 * `Viewer/coreWorkerBoot.ts`), and only clearing the browser cache fixes it,
 * which no purge can do. That is not hypothetical: 0.7.22 shipped a changed
 * core worker on a tag whose worker URL the release did not purge.
 *
 * Rewriting the tag to the bundle's own version closes the whole class. An
 * exact version is immutable on every npm CDN (`max-age=31536000, immutable`),
 * so a pinned sibling cannot be a different release's, whatever any cache
 * holds and whether or not the purge ran.
 *
 * @param url The bundle's own URL, normally `import.meta.url`.
 * @param packageName The npm package whose version segment to rewrite, e.g.
 *   `"@doenet/standalone"`.
 * @param version The exact version to pin to — the bundle's compiled-in one.
 * @returns The URL with `<packageName>@<anything>` rewritten to
 *   `<packageName>@<version>`, or `url` unchanged when it does not name the
 *   package as a path segment. Self-hosted copies, `blob:` and `data:` URLs,
 *   and anything unparseable therefore pass through untouched: a URL that
 *   carries no version to correct is left alone rather than guessed at.
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
    // The package name must be a whole run of path segments: bounded by `/`
    // ahead of it and, past the optional `@<spec>`, by `/` behind. That is what
    // keeps `@doenet/standalone` from matching inside `@doenet/standalone-foo`,
    // and it covers both CDN layouts — jsDelivr's `/npm/<pkg>@<spec>/…` and
    // unpkg's `/<pkg>@<spec>/…`.
    const escaped = packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const segment = new RegExp(`(/${escaped})(@[^/]*)?(?=/)`);
    const pinned = parsed.pathname.replace(segment, `$1@${version}`);
    if (pinned === parsed.pathname) {
        return url;
    }
    parsed.pathname = pinned;
    return parsed.href;
}
