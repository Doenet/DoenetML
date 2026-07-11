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
