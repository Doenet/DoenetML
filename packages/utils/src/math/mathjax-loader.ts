/**
 * Coexisting MathJax loader.
 *
 * The rendering layer uses `better-react-mathjax`, whose `MathJaxContext`
 * unconditionally (1) assigns `window.MathJax = config` and (2) appends a
 * MathJax `<script>` to the page — with no check for a MathJax that the host
 * page already loaded. When a Doenet activity is embedded in a page that loads
 * its own MathJax (e.g. PreTeXt books), that clobbers the host's live engine
 * with a plain config object and/or races a second engine, producing
 * intermittent, load-order-dependent failures.
 *
 * This module replaces that loader with one that *coexists* with a
 * host-provided MathJax:
 *
 *  - If a live MathJax engine is already present, reuse it and never touch
 *    `window.MathJax`.
 *  - If a MathJax `<script>` is already on the page (possibly deferred and not
 *    yet executed), wait for it instead of injecting a second copy. If it never
 *    becomes a usable engine within the timeout, fall back to loading — and
 *    taking over `window.MathJax` with — our own copy, so a broken or
 *    unrecognized host engine degrades to Doenet's ≤0.7.20 behavior rather than
 *    leaving all math blank.
 *  - Otherwise, inject our own copy — and only stage `window.MathJax = config`
 *    when nothing else has claimed that global.
 *
 * The resulting promise is memoized on `window` so that every viewer, editor,
 * and virtual-keyboard tray in the realm shares a single MathJax, regardless of
 * how many (possibly separately-bundled) copies of this module are loaded.
 *
 * ## Supported MathJax versions
 *
 * Doenet renders with MathJax 4 and pins {@link DEFAULT_MATHJAX_SRC} for the
 * copy it injects. When reusing a host-provided engine, the host's version
 * governs typesetting. MathJax 3 and 4 share the component-tex/typeset API this
 * code relies on (`startup.promise`, `typesetPromise`, `typesetClear`), so a
 * host engine in the 3.x–4.x range works; MathJax 2 (which exposes `Hub`
 * instead) is not supported for reuse.
 */

/**
 * The MathJax script Doenet injects when no MathJax is present on the page.
 * Pinned to match the version Doenet is tested against.
 */
export const DEFAULT_MATHJAX_SRC =
    "https://cdn.jsdelivr.net/npm/mathjax@4.1.3/tex-mml-chtml.js";

/**
 * Minimal shape of a loaded MathJax 3/4 engine that the renderers rely on.
 * Intentionally loose — the full types live in `better-react-mathjax`.
 */
export interface MathJaxEngine {
    startup?: { promise?: Promise<unknown> } & Record<string, unknown>;
    typesetPromise?: (...args: unknown[]) => Promise<unknown>;
    typesetClear?: (...args: unknown[]) => unknown;
    version?: string;
    [key: string]: unknown;
}

declare global {
    interface Window {
        // Before MathJax's engine script runs, `window.MathJax` holds a plain
        // config object; afterwards it is the live engine. It may also be
        // provided by the host page rather than by Doenet.
        MathJax?: MathJaxEngine | object;
    }
}

export interface LoadMathJaxOptions {
    /**
     * MathJax configuration object. Staged as `window.MathJax` before our own
     * script loads. Ignored when a host MathJax engine or script is detected,
     * so a host's configuration is never overwritten.
     */
    config?: object;
    /**
     * URL of the MathJax script to inject when no MathJax is present on the
     * page. Defaults to {@link DEFAULT_MATHJAX_SRC}.
     */
    src?: string;
    /**
     * When `true`, always reuse a host-provided MathJax: wait for `window.MathJax`
     * to become a live engine instead of ever injecting our own copy. Use this
     * when the host loads MathJax but does so after Doenet mounts (so no script
     * is detectable yet).
     */
    useExistingMathJax?: boolean;
    /**
     * How long, in milliseconds, to wait for a host-provided MathJax before
     * giving up and loading our own copy instead. Only applies when we are
     * waiting on someone else's MathJax (an existing script or
     * `useExistingMathJax`). Defaults to 30000.
     */
    timeoutMs?: number;
}

/**
 * Key under which the shared MathJax promise is memoized on `window`. Using a
 * global (rather than a module-level variable) makes the singleton robust even
 * when this module is bundled into several packages on the same page.
 */
const GLOBAL_PROMISE_KEY = "__doenetMathJaxPromise";

/**
 * Attribute placed on the `<script>` we inject, so it is not mistaken for a
 * host-provided MathJax script by {@link findMathJaxScript}.
 */
const DOENET_MATHJAX_SCRIPT_ATTR = "data-doenet-mathjax";

/**
 * Matches the `src` of a MathJax `<script>`. Covers CDN URLs (which contain
 * `mathjax` in the path) as well as the common component entry-point filenames.
 */
const MATHJAX_SRC_PATTERN = /mathjax|tex-(chtml|mml|svg)|mml-chtml/i;

const DEFAULT_TIMEOUT_MS = 30000;

/**
 * Distinguishes a live, loaded MathJax engine from a plain config object (which
 * is what `window.MathJax` holds after configuration but before the engine
 * script runs). Only a loaded engine exposes `startup.promise`.
 */
export function isMathJaxEngine(
    candidate: unknown,
): candidate is MathJaxEngine {
    if (!candidate || typeof candidate !== "object") {
        return false;
    }
    const startup = (candidate as MathJaxEngine).startup;
    // On a live engine, `startup` is the startup *module*. In MathJax 4 that is
    // a callable function (with `.promise`, `.document`, … attached), so its
    // `typeof` is "function", not "object"; MathJax 3 exposes it as a plain
    // object. Accept either — the definitive live-engine signal is a thenable
    // `startup.promise`, which a plain config object never has. Requiring
    // `typeof startup === "object"` here silently rejected every MathJax 4 host
    // engine, so Doenet waited for one forever and blanked all math.
    return (
        !!startup &&
        (typeof startup === "object" || typeof startup === "function") &&
        typeof (startup.promise as Promise<unknown> | undefined)?.then ===
            "function"
    );
}

/**
 * Finds a MathJax `<script>` already present on the page, excluding the one we
 * inject ourselves. A deferred host script counts: it is in the DOM from
 * initial parse even though it has not executed yet.
 */
function findMathJaxScript(): HTMLScriptElement | null {
    const scripts = document.querySelectorAll<HTMLScriptElement>("script[src]");
    for (const script of scripts) {
        if (script.hasAttribute(DOENET_MATHJAX_SCRIPT_ATTR)) {
            continue;
        }
        if (MATHJAX_SRC_PATTERN.test(script.src)) {
            return script;
        }
    }
    return null;
}

/**
 * Polls until `window.MathJax` becomes a live engine, then resolves. Rejects if
 * the engine has not appeared within `timeoutMs`. Used when we are waiting on a
 * host-provided MathJax rather than loading our own. The caller
 * ({@link createMathJaxPromise}) recovers from the rejection by loading Doenet's
 * own copy, so this only signals "the host engine never became usable" — it does
 * not mean math will fail to render.
 */
function waitForExistingMathJax(timeoutMs: number): Promise<MathJaxEngine> {
    return new Promise((resolve, reject) => {
        const deadline = Date.now() + timeoutMs;
        function poll() {
            const mathJax = window.MathJax;
            if (isMathJaxEngine(mathJax)) {
                resolve(mathJax);
                return;
            }
            if (Date.now() > deadline) {
                reject(
                    new Error(
                        "DoenetViewer: timed out waiting for a host-provided MathJax",
                    ),
                );
                return;
            }
            window.setTimeout(poll, 50);
        }
        poll();
    });
}

/**
 * Injects our own MathJax `<script>` and resolves once it has loaded.
 *
 * Normally (`force` off) it stages `window.MathJax = config` only when nothing
 * else has already claimed that global, so a host configuration is never
 * clobbered. When `force` is on, it overwrites `window.MathJax` unconditionally:
 * this is the takeover fallback used after a host-provided MathJax was detected
 * but never became usable. Overwriting the stale global with our config (as
 * Doenet ≤0.7.20 always did) is what lets our own engine initialize cleanly,
 * rather than colliding with a half-loaded or unrecognized host engine.
 */
function injectMathJax(
    src: string,
    config: object | undefined,
    { force = false }: { force?: boolean } = {},
): Promise<MathJaxEngine> {
    return new Promise((resolve, reject) => {
        if (config && (force || window.MathJax == null)) {
            window.MathJax = config;
        }
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.async = true;
        script.setAttribute(DOENET_MATHJAX_SCRIPT_ATTR, "true");
        script.addEventListener("load", () => {
            resolve(window.MathJax as MathJaxEngine);
        });
        script.addEventListener("error", () => {
            reject(
                new Error(`DoenetViewer: failed to load MathJax from ${src}`),
            );
        });
        document.head.appendChild(script);
    });
}

function createMathJaxPromise(
    options: LoadMathJaxOptions,
): Promise<MathJaxEngine> {
    const {
        config,
        src = DEFAULT_MATHJAX_SRC,
        useExistingMathJax = false,
        timeoutMs = DEFAULT_TIMEOUT_MS,
    } = options;

    // A live engine is already present — reuse it and never touch window.MathJax.
    if (isMathJaxEngine(window.MathJax)) {
        return Promise.resolve(window.MathJax);
    }

    // A MathJax script is already on the page (possibly deferred), or the host
    // told us to reuse theirs — wait for it rather than injecting a second copy.
    // If it never becomes usable within the window (a broken/blocked host, or an
    // engine we failed to recognize), don't fail permanently: fall back to
    // loading — and taking over with — our own copy, so math still renders. This
    // is what makes a mis-detected host non-fatal instead of blanking all math.
    if (useExistingMathJax || findMathJaxScript()) {
        return waitForExistingMathJax(timeoutMs).catch((reason) => {
            console.warn(
                "DoenetViewer: a host-provided MathJax did not become usable in " +
                    "time; falling back to loading Doenet's own copy.",
                reason,
            );
            return injectMathJax(src, config, { force: true });
        });
    }

    // Nothing else provides MathJax — load our own copy.
    return injectMathJax(src, config);
}

/**
 * Loads MathJax, coexisting with any MathJax the host page provides, and
 * returns a promise for the live engine. The promise is memoized on `window`,
 * so repeated calls (from multiple viewers/editors/keyboard trays) share a
 * single MathJax and the first caller's options win.
 */
export function loadMathJax(
    options: LoadMathJaxOptions = {},
): Promise<MathJaxEngine> {
    if (typeof window === "undefined") {
        return Promise.reject(
            new Error("MathJax can only be loaded in a browser environment"),
        );
    }

    const cached = (window as unknown as Record<string, unknown>)[
        GLOBAL_PROMISE_KEY
    ] as Promise<MathJaxEngine> | undefined;
    if (cached) {
        return cached;
    }

    const promise = createMathJaxPromise(options);
    (window as unknown as Record<string, unknown>)[GLOBAL_PROMISE_KEY] =
        promise;
    // A rejected attempt must not poison the page: drop the memo so a later
    // mount retries from scratch instead of resolving to the same failed
    // promise. (With the takeover fallback above, the only way to reach here is
    // our own copy failing to load — e.g. an offline CDN — where a retry is
    // exactly what we want.)
    promise.catch(() => {
        const store = window as unknown as Record<string, unknown>;
        if (store[GLOBAL_PROMISE_KEY] === promise) {
            delete store[GLOBAL_PROMISE_KEY];
        }
    });
    return promise;
}
