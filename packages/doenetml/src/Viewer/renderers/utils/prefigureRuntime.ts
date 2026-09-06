import {
    PREFIGURE_BUILD_ENDPOINT,
    PREFIGURE_INDEX_URL,
    PREFIGURE_MODULE_URL,
    PREFIGURE_RUST_ENABLED,
} from "./prefigureConfig";
// Static workspace import: unlike `@doenet/prefigure` (loaded dynamically
// from a CDN URL at runtime, see `importPrefigureFromUrl` below), this is a
// normal in-repo package, and the whole point of this module is that it is
// small and fast to instantiate, so eagerly bundling it costs little. It is
// still only *initialized* (WASM fetch+instantiate) lazily, behind the
// `PREFIGURE_RUST_ENABLED` flag, via `startPrefigureRustWarmup()`.
import * as PrefigureRustModule from "@doenet/prefigure-rust";

const PREFIGURE_BUILD_DEBOUNCE_COLD_MS = 1000;
const PREFIGURE_BUILD_DEBOUNCE_WARM_MS = 40;

export type PrefigureModule = typeof import("@doenet/prefigure");

export type PrefigureBuildResult = {
    svg: string;
    annotationsXml: string;
};

type PrefigureBuildWinner =
    | { backend: "service"; data: PrefigureBuildResult }
    | { backend: "local"; module: PrefigureModule }
    | { backend: "rust"; module: typeof PrefigureRustModule };

let prefigureModulePromise: Promise<PrefigureModule> | null = null;
let prefigureWarmupPromise: Promise<PrefigureModule> | null = null;
let prefigureReadyModule: PrefigureModule | null = null;

let prefigureRustWarmupPromise: Promise<typeof PrefigureRustModule> | null =
    null;
let prefigureRustReadyModule: typeof PrefigureRustModule | null = null;

async function importPrefigureFromUrl(url: string): Promise<PrefigureModule> {
    return import(/* @vite-ignore */ url);
}

async function getPrefigureModule() {
    if (!prefigureModulePromise) {
        prefigureModulePromise = importPrefigureFromUrl(PREFIGURE_MODULE_URL);
    }

    return prefigureModulePromise;
}

async function startPrefigureWarmup() {
    if (!prefigureWarmupPromise) {
        prefigureWarmupPromise = (async () => {
            const module = await getPrefigureModule();
            await module.initPrefigure(PREFIGURE_INDEX_URL || undefined);
            prefigureReadyModule = module;
            console.log("[prefigure] WASM runtime ready");
            return module;
        })().catch((error) => {
            // Keep fallback-to-service behavior and allow future retries.
            prefigureWarmupPromise = null;
            prefigureModulePromise = null;
            throw error;
        });
    }

    return prefigureWarmupPromise;
}

async function startPrefigureRustWarmup() {
    if (!prefigureRustWarmupPromise) {
        prefigureRustWarmupPromise = (async () => {
            await PrefigureRustModule.initPrefigure();
            prefigureRustReadyModule = PrefigureRustModule;
            console.log("[prefigure-rust] WASM runtime ready");
            return PrefigureRustModule;
        })().catch((error) => {
            // Allow future retries.
            prefigureRustWarmupPromise = null;
            throw error;
        });
    }

    return prefigureRustWarmupPromise;
}

function logWarmupFailure(error: unknown) {
    console.error("[prefigure] warmup failed", error);
}

function logRustWarmupFailure(error: unknown) {
    console.error("[prefigure-rust] warmup failed", error);
}

export function warmupPrefigureInBackground() {
    startPrefigureWarmup().catch(logWarmupFailure);
}

/**
 * No-op unless `PREFIGURE_RUST_ENABLED` is set: the Rust backend is opt-in
 * and unproven in production, so disabled-by-default behavior must have
 * zero cost (no warmup call, no bundle-visible side effect beyond the
 * static import above).
 */
export function warmupPrefigureRustInBackground() {
    if (!PREFIGURE_RUST_ENABLED) {
        return;
    }
    startPrefigureRustWarmup().catch(logRustWarmupFailure);
}

export function currentPrefigureDebounceMs() {
    return prefigureReadyModule || prefigureRustReadyModule
        ? PREFIGURE_BUILD_DEBOUNCE_WARM_MS
        : PREFIGURE_BUILD_DEBOUNCE_COLD_MS;
}

export function isPrefigureRuntimeReady() {
    return Boolean(prefigureReadyModule);
}

async function buildWithPrefigureService(
    diagramXML: string,
    signal: AbortSignal,
): Promise<PrefigureBuildResult> {
    const response = await fetch(PREFIGURE_BUILD_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/xml",
        },
        body: diagramXML,
        signal,
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
}

/**
 * Creates a DOMException-compatible AbortError for programmatic cancellation.
 * Falls back to a plain Error with `name === "AbortError"` in environments
 * where DOMException is not constructible (e.g. older WebViews).
 */
function createAbortError(): Error {
    try {
        return new DOMException("The operation was aborted.", "AbortError");
    } catch (_error) {
        const error = new Error("The operation was aborted.");
        error.name = "AbortError";
        return error;
    }
}

/**
 * Returns true if `error` is an AbortError regardless of whether it came from
 * a DOMException, from the plain-Error fallback in {@link createAbortError},
 * or from environment-specific abort object shapes.
 */
export function isAbortError(error: unknown): boolean {
    if (
        error === null ||
        (typeof error !== "object" && typeof error !== "function")
    ) {
        return false;
    }

    if (!("name" in error)) {
        return false;
    }

    return error.name === "AbortError";
}

/**
 * Unwraps a multi-error array produced by {@link firstSuccessful} into a
 * single throwable value. Prefers the first non-AbortError so that a real
 * failure surfaces even when one backend was intentionally cancelled.
 */
function resolveBuildRaceError(error: unknown): unknown {
    if (!Array.isArray(error)) {
        return error;
    }

    const nonAbortError = error.find((candidate) => !isAbortError(candidate));
    return nonAbortError ?? error[0];
}

/**
 * Resolves with the value of the first promise that fulfills.
 * Rejects with an array of all errors only when every promise has rejected.
 *
 * Semantically equivalent to `Promise.any()`, but compatible with the
 * `ES2021.String` lib subset used in this package (which lacks `ES2021.Promise`
 * and therefore lacks the `AggregateError` type).
 */
function firstSuccessful<T>(promises: Array<Promise<T>>): Promise<T> {
    return new Promise((resolve, reject) => {
        let remaining = promises.length;
        const errors: unknown[] = [];

        if (remaining === 0) {
            reject(new Error("No promises were provided."));
            return;
        }

        for (const promise of promises) {
            promise.then(resolve, (error: unknown) => {
                errors.push(error);
                remaining -= 1;
                if (remaining === 0) {
                    reject(errors);
                }
            });
        }
    });
}

/**
 * Build diagram content via whichever backend is currently available.
 * Prefers local WASM when warm; otherwise uses the build service.
 */
export async function buildPrefigureDiagram(
    diagramXML: string,
    signal: AbortSignal,
): Promise<PrefigureBuildResult> {
    if (prefigureReadyModule) {
        return prefigureReadyModule.compilePrefigure(diagramXML, {
            mode: "svg",
            indexURL: PREFIGURE_INDEX_URL || undefined,
        });
    }

    if (PREFIGURE_RUST_ENABLED && prefigureRustReadyModule) {
        return prefigureRustReadyModule.compilePrefigure(diagramXML, {
            mode: "svg",
        });
    }

    if (signal.aborted) {
        throw createAbortError();
    }

    const serviceAbortController = new AbortController();
    const abortServiceRequest = () => {
        serviceAbortController.abort();
    };

    signal.addEventListener("abort", abortServiceRequest, { once: true });

    // Close the check/listen race: the outer signal may have aborted after the
    // earlier guard but before this listener was attached.
    if (signal.aborted) {
        serviceAbortController.abort();
    }

    // cleanupOuterAbort removes the abort listener added inside the promise
    // constructor below so it does not linger on the signal after the race
    // settles normally.
    let cleanupOuterAbort: () => void = () => {};

    const outerAbortPromise = new Promise<never>((_resolve, reject) => {
        const rejectForAbort = () => {
            reject(createAbortError());
        };

        if (signal.aborted) {
            rejectForAbort();
            return;
        }

        signal.addEventListener("abort", rejectForAbort, { once: true });
        cleanupOuterAbort = () => {
            signal.removeEventListener("abort", rejectForAbort);
        };
    });

    try {
        async function buildServicePromise(): Promise<PrefigureBuildWinner> {
            const data = await buildWithPrefigureService(
                diagramXML,
                serviceAbortController.signal,
            );
            return { backend: "service", data };
        }

        async function buildLocalPromise(): Promise<PrefigureBuildWinner> {
            try {
                const module = await startPrefigureWarmup();
                return { backend: "local" as const, module };
            } catch (error) {
                logWarmupFailure(error);
                throw error;
            }
        }

        async function buildRustPromise(): Promise<PrefigureBuildWinner> {
            try {
                const module = await startPrefigureRustWarmup();
                return { backend: "rust" as const, module };
            } catch (error) {
                logRustWarmupFailure(error);
                throw error;
            }
        }

        const serviceBuildPromise = buildServicePromise();
        const localReadyPromise = buildLocalPromise();
        const raceCandidates: Array<Promise<PrefigureBuildWinner>> = [
            serviceBuildPromise,
            localReadyPromise,
        ];
        if (PREFIGURE_RUST_ENABLED) {
            raceCandidates.push(buildRustPromise());
        }

        const raceStart =
            typeof performance !== "undefined" ? performance.now() : Date.now();

        const winner = await Promise.race([
            firstSuccessful(raceCandidates),
            outerAbortPromise,
        ]);

        const elapsedMs = Math.round(
            (typeof performance !== "undefined"
                ? performance.now()
                : Date.now()) - raceStart,
        );
        console.log(
            "[prefigure] backend=%s elapsedMs=%d",
            winner.backend,
            elapsedMs,
        );

        if (winner.backend === "service") {
            return winner.data;
        }

        // WASM became ready before the service response, so stop waiting on the
        // slower network fallback and compile locally.
        serviceAbortController.abort();

        if (winner.backend === "rust") {
            return await Promise.race([
                winner.module.compilePrefigure(diagramXML, {
                    mode: "svg",
                }),
                outerAbortPromise,
            ]);
        }

        return await Promise.race([
            winner.module.compilePrefigure(diagramXML, {
                mode: "svg",
                indexURL: PREFIGURE_INDEX_URL || undefined,
            }),
            outerAbortPromise,
        ]);
    } catch (error) {
        throw resolveBuildRaceError(error);
    } finally {
        signal.removeEventListener("abort", abortServiceRequest);
        cleanupOuterAbort();
    }
}
