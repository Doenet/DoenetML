import * as Comlink from "comlink";
import type { CoreWorker } from "@doenet/doenetml-worker";
import type { ResolverCore } from "@doenet/lsp-tools";

/**
 * A spawned rust core sub-worker bundle.  The caller owns the lifetime: call
 * `terminate()` when the document is closed so the worker thread and Comlink
 * proxy are released.
 */
export type SpawnedRustCore = {
    core: ResolverCore;
    terminate: () => void;
};

/**
 * Hard cap on how long to wait for a freshly spawned worker to answer its
 * first RPC.  A genuine cold start (multi-MB bundle + WASM init) finishes in
 * well under a second; this is purely a safety net for a bad URL or a worker
 * that never calls `Comlink.expose`.
 */
const WORKER_BOOT_TIMEOUT_MS = 30_000;

/**
 * Spawn a fresh inlined-core webworker (whose URL is provided by the host as
 * `doenetWorkerUrl`) and return the core, reached via Comlink.  Each call
 * returns a new sub-worker with its own `PublicDoenetMLCore` instance so
 * multiple LSP documents never share rust resolver state — matching the
 * per-document isolation the LSP relied on when the WASM was loaded directly.
 *
 * Returns `null` when no URL is provided, when the URL is unusable, or when
 * the spawned worker fails to boot.  Callers should treat the rust resolver
 * as unavailable in that case.
 *
 * The returned `terminate` MUST be called when the owning document closes
 * so the spawned worker is released.
 */
export async function getRustCore(
    doenetWorkerUrl: string | undefined,
): Promise<SpawnedRustCore | null> {
    if (!doenetWorkerUrl) {
        return null;
    }

    let worker: Worker;
    try {
        worker = new Worker(doenetWorkerUrl);
    } catch (error) {
        // A malformed URL makes the `Worker` constructor throw synchronously.
        console.warn("Rust core worker could not be created.", error);
        return null;
    }

    const remote = Comlink.wrap<CoreWorker>(worker);

    // The Comlink proxy structurally provides every method `ResolverCore`
    // declares.  The cast only drops Comlink's pessimistic `RemoteObject`
    // return-type wrapping — the worker returns plain structured-cloned data.
    const core = remote as unknown as ResolverCore;

    let terminated = false;
    const terminate = () => {
        if (terminated) return;
        terminated = true;
        remote[Comlink.releaseProxy]();
        worker.terminate();
    };

    // A bad URL or a failing worker script does NOT make `new Worker` throw,
    // and Comlink RPCs against a worker that never came up hang forever.
    // Race a probe RPC against the worker's `error` event and a timeout so a
    // broken URL surfaces as "unavailable" instead of leaking the worker and
    // wedging `rustState` at "initializing".
    try {
        await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error("rust core worker boot timed out"));
            }, WORKER_BOOT_TIMEOUT_MS);
            worker.addEventListener(
                "error",
                (event) => {
                    clearTimeout(timer);
                    reject(
                        new Error(event.message || "rust core worker error"),
                    );
                },
                { once: true },
            );
            // `setFlags` is a cheap RPC that forces the worker module to load
            // and the WASM core to initialize; it is also a no-op the adapter
            // would issue anyway.
            remote.setFlags({ flags: {} }).then(
                () => {
                    clearTimeout(timer);
                    resolve();
                },
                (error) => {
                    clearTimeout(timer);
                    reject(error);
                },
            );
        });
    } catch (error) {
        console.warn("Rust core worker failed to start.", error);
        terminate();
        return null;
    }

    return { core, terminate };
}
