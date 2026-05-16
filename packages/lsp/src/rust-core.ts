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
 * Spawn a fresh inlined-core webworker (whose URL is provided by the host as
 * `doenetWorkerUrl`) and return the core, reached via Comlink.  Each call
 * returns a new sub-worker with its own `PublicDoenetMLCore` instance so
 * multiple LSP documents never share rust resolver state — matching the
 * per-document isolation the LSP relied on when the WASM was loaded directly.
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

    return { core, terminate };
}
