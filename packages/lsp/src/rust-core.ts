import * as Comlink from "comlink";
import type { CoreWorker } from "@doenet/doenetml-worker";
import type { RustResolverCore } from "@doenet/lsp-tools";

/**
 * A spawned rust core sub-worker bundle.  The caller owns the lifetime: call
 * `terminate()` when the document is closed so the worker thread and Comlink
 * proxy are released.
 */
export type SpawnedRustCore = {
    core: RustResolverCore;
    terminate: () => void;
};

/**
 * Spawn a fresh inlined-core webworker (whose URL is provided by the host as
 * `doenetWorkerUrl`) and return a `RustResolverCore` proxy that delegates to
 * it via Comlink.  Each call returns a new sub-worker with its own
 * `PublicDoenetMLCore` instance so multiple LSP documents never share rust
 * resolver state — matching the per-document isolation the LSP relied on
 * when the WASM was loaded directly.
 *
 * Returns `null` when no URL is provided.  Callers should treat the rust
 * resolver as unavailable in that case.
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

    const worker = new Worker(doenetWorkerUrl);
    const remote = Comlink.wrap<CoreWorker>(worker);

    const core: RustResolverCore = {
        set_source: (dast, source) =>
            remote.setSource({ source, dast: dast as any }),
        set_flags: (flags) => remote.setFlags({ flags: JSON.parse(flags) }),
        return_dast: () => remote.returnDast() as any,
        resolve_path: (path, origin, skipParentSearch) =>
            remote.resolvePath({
                path: path as any,
                origin,
                skipParentSearch,
            }) as any,
    };

    let terminated = false;
    const terminate = () => {
        if (terminated) return;
        terminated = true;
        remote[Comlink.releaseProxy]();
        worker.terminate();
    };

    return { core, terminate };
}
