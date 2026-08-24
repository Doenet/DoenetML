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
 * Whenever our configuration does not reach the engine in play, the macros and
 * TeX packages Doenet's documents rely on are simply absent there — an author's
 * `\units{9.8}{...}` renders as a bare `\units` on a host page and correctly on
 * doenet.org. To close that gap, such an engine is *primed*: before the shared
 * promise resolves, we run expressions through its TeX input jax that reproduce
 * our configured macros as `\def`s and pull in our added TeX packages with
 * `\require`. Nothing is rendered or added to the page; the point is the state
 * those expressions leave behind in the jax, which MathJax keeps for the life of
 * the document, so this happens once rather than per expression. See
 * {@link primeUnconfiguredEngine} for what that costs the host.
 *
 * Priming is best-effort by design: each fragment is allowed to fail on its own
 * (an engine with no TeX input jax, a `\require` the host's MathJax cannot
 * honor) and the worst outcome is that the host renders the document the way it
 * would have before — never that math stops rendering.
 *
 * Priming is deliberately skipped whenever the engine booted on our own
 * configuration — the common case, including every iframe embedding — so the
 * usual path pays nothing for it.
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
 * code relies on (`startup.promise`, `typesetPromise`, `typesetClear`, and the
 * `tex2mmlPromise` that priming uses), so a host engine in the 3.x–4.x range
 * works; MathJax 2 (which exposes `Hub` instead) is not supported for reuse.
 *
 * Priming reaches only as far as the host's version allows. `units` is a
 * MathJax 4 package, so on a host still running 3.x the `\require{units}`
 * fragment fails, priming logs a warning, and the macros still land — `\units`
 * typesets as its own name there, exactly as it did before this existed, while
 * everything else is unaffected.
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
    /**
     * Direct TeX-to-MathML conversion, added by MathJax's startup when a TeX
     * input jax is loaded. Used by priming to reach that jax without going
     * through the page (see {@link primeUnconfiguredEngine}).
     */
    tex2mmlPromise?: (...args: unknown[]) => Promise<unknown>;
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
     * script loads. Left unset while a host MathJax engine or script is in play,
     * so a host's configuration is never overwritten — unless that host engine
     * never becomes usable and the timeout fallback takes over (see
     * {@link loadMathJax}), in which case this config is staged instead. Where
     * it cannot be staged, its macros and added TeX packages are instead applied
     * to the resulting engine by priming (see {@link loadMathJax}).
     */
    config?: object;
    /**
     * URL of the MathJax script to inject when no MathJax is present on the
     * page. Defaults to {@link DEFAULT_MATHJAX_SRC}.
     */
    src?: string;
    /**
     * When `true`, prefer a host-provided MathJax: wait for `window.MathJax` to
     * become a live engine rather than injecting our own copy up front. Use this
     * when the host loads MathJax but does so after Doenet mounts (so no script
     * is detectable yet). If the host engine never becomes usable within
     * `timeoutMs`, we fall back to loading our own copy.
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
 * clobbered. When `force` is on, a provided `config` is staged even if the
 * global is already claimed, overwriting whatever stale value is there: this is
 * the takeover fallback used after a host-provided MathJax was detected but
 * never became usable. Overwriting the stale global with our config (as
 * Doenet ≤0.7.20 always did) is what lets our own engine initialize cleanly,
 * rather than colliding with a half-loaded or unrecognized host engine.
 *
 * When a host config was left in place, the engine we load boots on *its* terms
 * rather than ours, so the result is primed exactly as a host's own engine
 * would be (see {@link primeUnconfiguredEngine}).
 */
function injectMathJax(
    src: string,
    config: object | undefined,
    { force = false }: { force?: boolean } = {},
): Promise<MathJaxEngine> {
    return new Promise((resolve, reject) => {
        // True also when there is no config at all: there is then nothing our
        // configuration could have taught the engine that it is missing.
        const bootsOnOurConfig = !config || force || window.MathJax == null;
        if (config && bootsOnOurConfig) {
            window.MathJax = config;
        }
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.async = true;
        script.setAttribute(DOENET_MATHJAX_SCRIPT_ATTR, "true");
        script.addEventListener("load", () => {
            const engine = window.MathJax as MathJaxEngine;
            resolve(
                bootsOnOurConfig
                    ? engine
                    : primeUnconfiguredEngine(engine, config),
            );
        });
        script.addEventListener("error", () => {
            reject(
                new Error(`DoenetViewer: failed to load MathJax from ${src}`),
            );
        });
        document.head.appendChild(script);
    });
}

/**
 * The `tex` section of a MathJax configuration, whose shape we cannot rely on:
 * `config` is whatever the caller passed, and a host may have staged one of its
 * own. Every field is read defensively by the helpers below.
 */
function texConfig(
    config: object | undefined,
): Record<string, unknown> | undefined {
    const tex = (config as { tex?: unknown } | undefined)?.tex;
    return tex && typeof tex === "object"
        ? (tex as Record<string, unknown>)
        : undefined;
}

/**
 * Reproduces `config.tex.macros` as a string of `\def`s.
 *
 * MathJax's macro config accepts a bare replacement string, or `[replacement,
 * argCount]`, or `[replacement, argCount, defaultForOptionalArg]`. A plain
 * `\def` expresses the first two; the optional-argument form has no `\def`
 * equivalent and is skipped rather than approximated, as is any name `\def`
 * cannot take (control sequences are letters-only).
 */
function texDefsFromConfig(config: object | undefined): string {
    const macros = texConfig(config)?.macros;
    if (!macros || typeof macros !== "object") {
        return "";
    }
    const defs: string[] = [];
    for (const [name, value] of Object.entries(
        macros as Record<string, unknown>,
    )) {
        if (!/^[A-Za-z]+$/.test(name)) {
            continue;
        }
        let replacement: string;
        let argCount = 0;
        if (typeof value === "string") {
            replacement = value;
        } else if (
            Array.isArray(value) &&
            value.length <= 2 &&
            typeof value[0] === "string"
        ) {
            replacement = value[0];
            argCount = typeof value[1] === "number" ? value[1] : 0;
        } else {
            continue;
        }
        if (!Number.isInteger(argCount) || argCount < 0 || argCount > 9) {
            continue;
        }
        const parameters = Array.from(
            { length: argCount },
            (_unused, index) => `#${index + 1}`,
        ).join("");
        defs.push(`\\def\\${name}${parameters}{${replacement}}`);
    }
    return defs.join("");
}

/**
 * The TeX packages `config` *adds* to MathJax's defaults — the `{"[+]": [...]}`
 * form. A bare array is ignored on purpose: that form replaces the default list
 * outright and so describes the base set of the engine we build ourselves, not
 * something an unconfigured engine is necessarily missing.
 */
function texPackagesFromConfig(config: object | undefined): string[] {
    const packages = texConfig(config)?.packages;
    if (!packages || typeof packages !== "object" || Array.isArray(packages)) {
        return [];
    }
    const added = (packages as Record<string, unknown>)["[+]"];
    if (!Array.isArray(added)) {
        return [];
    }
    return added.filter(
        (name): name is string =>
            typeof name === "string" && /^[\w-]+$/.test(name),
    );
}

/**
 * Runs `tex` through the engine's TeX input jax purely for the state it leaves
 * behind there — a macro table entry, a loaded package — and resolves whether or
 * not that worked.
 *
 * Direct conversion rather than typesetting a hidden element: it reaches the
 * same input jax the engine renders everything else with, so the definitions
 * persist, while depending on neither the host's math delimiters (which a host
 * is free to redefine, and `\(`…`\)` need not survive) nor its ignored-element
 * rules, and putting nothing into the page.
 *
 * Never rejects: priming is a best-effort improvement on an engine we did not
 * configure, and a failure here must not stop the math that follows from
 * rendering.
 */
async function convertForSideEffect(
    engine: MathJaxEngine,
    tex: string,
): Promise<void> {
    // Defined by MathJax's startup only once a TeX input jax is in play. An
    // engine without one cannot render Doenet's TeX at all, primed or not, so
    // there is nothing priming could rescue here — leave the host alone.
    if (typeof engine.tex2mmlPromise !== "function") {
        return;
    }
    try {
        await engine.tex2mmlPromise(tex);
    } catch (reason) {
        console.warn(
            `DoenetViewer: could not prime MathJax with "${tex}"; ` +
                "math relying on it may not render as it does on doenet.org.",
            reason,
        );
    }
}

/**
 * Teaches an engine our configuration never reached — a host's, or one we
 * injected onto a host-staged config — the macros and TeX packages that
 * configuration would have given it, so a document renders the same there as on
 * an engine we configured ourselves.
 *
 * Two things are worth being explicit about, because this writes to state the
 * host shares:
 *
 *  - The definitions are document-wide and outlive this call, which is what
 *    makes priming a one-time cost instead of a per-expression one. It also
 *    means a host that defines any of the same names gets ours instead. The
 *    names come from Doenet's own configuration, so the exposure is limited to
 *    what a Doenet document could already have relied on.
 *  - Each fragment is converted separately. `\require` throws when a package
 *    cannot be loaded, and MathJax abandons the rest of the expression when it
 *    does; batching would let one unavailable package silently take the macro
 *    definitions down with it.
 */
async function primeUnconfiguredEngine(
    engine: MathJaxEngine,
    config: object | undefined,
): Promise<MathJaxEngine> {
    try {
        await engine.startup?.promise;
    } catch {
        // An engine that reports a failed startup may still convert; let the
        // priming attempts below find out rather than deciding here.
    }
    const defs = texDefsFromConfig(config);
    if (defs) {
        await convertForSideEffect(engine, defs);
    }
    for (const packageName of texPackagesFromConfig(config)) {
        await convertForSideEffect(engine, `\\require{${packageName}}`);
    }
    return engine;
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
    // It is not ours and never saw `config`, so prime it before anyone uses it.
    if (isMathJaxEngine(window.MathJax)) {
        return primeUnconfiguredEngine(window.MathJax, config);
    }

    // A MathJax script is already on the page (possibly deferred), or the host
    // told us to reuse theirs — wait for it rather than injecting a second copy.
    // If it never becomes usable within the window (a broken/blocked host, or an
    // engine we failed to recognize), don't fail permanently: fall back to
    // loading — and taking over with — our own copy, so math still renders. This
    // is what makes a mis-detected host non-fatal instead of blanking all math.
    if (useExistingMathJax || findMathJaxScript()) {
        return waitForExistingMathJax(timeoutMs).then(
            // The host's engine: ours to use, not ours to have configured.
            (engine) => primeUnconfiguredEngine(engine, config),
            // The takeover copy is one we load and stage `config` on ourselves,
            // so it needs no priming. Handling the rejection here rather than in
            // a trailing `.catch` also keeps a priming failure above — which is
            // never fatal — from being mistaken for a host that never loaded,
            // and answered by injecting a second engine over the host's.
            (reason) => {
                console.warn(
                    "DoenetViewer: a host-provided MathJax did not become usable in " +
                        "time; falling back to loading Doenet's own copy.",
                    reason,
                );
                return injectMathJax(src, config, { force: true });
            },
        );
    }

    // Nothing else provides MathJax — load our own copy. `injectMathJax` stages
    // `config` on it unless a host has already claimed the global with a config
    // of its own, in which case it primes what it could not stage.
    return injectMathJax(src, config);
}

/**
 * Loads MathJax, coexisting with any MathJax the host page provides, and
 * returns a promise for the live engine. The promise is memoized on `window`,
 * so repeated calls (from multiple viewers/editors/keyboard trays) share a
 * single MathJax and the first caller's options win.
 *
 * "The first caller's options win" is why callers that only need the engine
 * (renderers reaching for `startup.promise`) call this bare: they run inside a
 * viewer, whose `MathJaxContext` has already made the call carrying `config`.
 * A bare call that got there first would settle the memo with no configuration
 * to stage *or* to prime, leaving Doenet's macros absent everywhere — so a new
 * caller that could run before a viewer mounts must pass `config`.
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
