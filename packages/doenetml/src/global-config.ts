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
     * that fails to complete within its per-attempt watchdog budget (see
     * `coreHandshakeWatchdogMs`) is abandoned and retried with a fresh
     * worker, after an exponential backoff with jitter (#1711) so a page of
     * documents that timed out together does not retry in lockstep. Falls
     * back to a built-in default when unset.
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
     * however long it takes.
     *
     * When unset, each attempt's budget is sized to the contention the
     * handshake actually faces (#1711): a built-in base, widened with the
     * page-wide count of concurrent handshakes per core and capped — see
     * `handshakeWatchdogMsFor` in `Viewer/coreWorkerBoot.ts`. Setting this is
     * a statement about the deployment — one using `fetchExternalDoenetML`,
     * say, whose handshake is slow for reasons contention cannot explain —
     * so an explicit value wins outright: it is used as-is for every attempt,
     * never scaled.
     */
    coreHandshakeWatchdogMs?: number;
    /**
     * Test-only seam. When set, `DocViewer` awaits this at each phase of
     * getting a document on screen: `"stateLoad"` (the saved-state load that
     * precedes a boot), `"handshake"` (covered by the watchdog) and
     * `"generate"` (the un-watchdogged evaluation). Throwing, rejecting, or
     * returning a never-resolving promise lets a test deterministically
     * simulate a slow or failing load, a hung/wedged worker handshake, or a
     * slow-but-alive evaluation (Doenet/DoenetApps#2957) — and, by holding a
     * phase open across a rebuild, the supersession races those waits opened
     * up (#1714). Always `undefined` in production, where the phase is
     * therefore never awaited at all.
     */
    __doenetTestCoreInitHook?: (
        phase: "stateLoad" | "handshake" | "generate",
        attempt: number,
    ) => void | Promise<void>;
} = adoptExistingGlobalConfig();

/**
 * Whether the adopted config already carried a `doenetWorkerUrl` when this
 * module evaluated — i.e. the host chose the worker URL itself, before or
 * while the bundle loaded (with the code-split `@doenet/standalone` bundle,
 * a script `onload` handler runs before this module does; see
 * `adoptExistingGlobalConfig`).
 *
 * The module-evaluation-time worker resolution defers to that choice: the
 * externalized-worker entry (`doenetml-external-worker.ts`) and the
 * version-pinning re-point in `@doenet/standalone`'s entry both skip their
 * writes when this is set, so an explicit host URL survives bundle
 * evaluation just as it does when the host writes it after the bundle has
 * evaluated.
 */
export const hostProvidedWorkerUrl: boolean =
    typeof doenetGlobalConfig.doenetWorkerUrl === "string";
if (!hostProvidedWorkerUrl) {
    doenetGlobalConfig.doenetWorkerUrl = getWorkerUrl();
}
// We want this to be available in the global scope
(window as any).doenetGlobalConfig = doenetGlobalConfig;

/**
 * The config object this module adopts: `window.doenetGlobalConfig` when a
 * host already created one, a fresh object otherwise.
 *
 * Adopting the existing object — same identity, defaults filled in above only
 * where a key is absent — is what keeps host configuration working when this
 * module evaluates *after* the host's setup code ran. `@doenet/standalone`'s
 * code-split bundle is the live case: its entry facade awaits the chunk that
 * carries this module, the facade's script `load` event fires at that first
 * `await`, and PreTeXt-style pages configure `window.doenetGlobalConfig` (an
 * empty object the facade pre-created; see `facadeRenderQueue.ts` there) from
 * exactly that event. Values those hosts set this way are live here, and the
 * references they captured stay current.
 *
 * (Typed `any` because the return feeds `doenetGlobalConfig`'s own
 * initializer — naming that type here would be circular. The export's
 * annotation above is what checks every use.)
 */
function adoptExistingGlobalConfig(): any {
    const existing = (window as any).doenetGlobalConfig;
    if (typeof existing === "object" && existing !== null) {
        return existing;
    }
    return {};
}

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
