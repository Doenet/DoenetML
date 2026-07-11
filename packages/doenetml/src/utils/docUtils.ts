import { DoenetMLFlags } from "../doenetml";
import { doenetGlobalConfig } from "../global-config";
import * as Comlink from "comlink";
import type { CoreWorker } from "@doenet/doenetml-worker";
import {
    expandExternalReferences,
    lezerToDast,
    normalizeDocumentDast,
} from "@doenet/parser";

export type CoreWorkerHandle = {
    /** The Comlink-wrapped async API for the core worker. */
    remote: Comlink.Remote<CoreWorker>;
    /**
     * Force-kill switch, used when the core has stopped responding. The
     * Comlink `remote.terminate()` call routes through the core's own
     * serialization queue, so if that queue is stuck (e.g. a hung WASM init),
     * the Comlink terminate hangs too — this is the escape hatch. See
     * Doenet/DoenetApps#2957.
     *
     * Dedicated-worker mode: natively terminates the worker. Shared-worker
     * mode (#1466): closes this core's port and asks the host to destroy the
     * core — sibling cores are unaffected, but note this cannot recover from
     * a wedge that blocks the whole worker thread (only killing the shared
     * worker would, which would take the siblings with it; the escalation
     * ladder is follow-up work on #1466).
     */
    kill: () => void;
};

/** Default pool cap for shared core workers (see `sharedCoreWorkerMaxCores`). */
const DEFAULT_SHARED_CORE_WORKER_MAX_CORES = 12;

/**
 * Live shared host workers for this realm (only used when
 * `doenetGlobalConfig.useSharedCoreWorker` is set). Each hosts up to the pool
 * cap of cores; when all are full, a new one is spun up. Hosts are kept warm
 * once created — assignment-style pages mount/unmount documents repeatedly,
 * and re-paying the ~100 MB boot on each remount would defeat the purpose.
 */
const sharedHosts: {
    worker: Worker;
    remote: Comlink.Remote<CoreWorker>;
    liveCores: number;
}[] = [];

/**
 * Create a core on a shared host worker (#1466): the host worker's default
 * instance doubles as a core factory, and each core is driven over its own
 * `MessagePort` with the same Comlink API a dedicated worker would offer.
 */
function createSharedWorkerCore(): CoreWorkerHandle {
    const maxCores =
        doenetGlobalConfig.sharedCoreWorkerMaxCores ??
        DEFAULT_SHARED_CORE_WORKER_MAX_CORES;
    let host = sharedHosts.find((h) => h.liveCores < maxCores);
    if (!host) {
        const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
            type: "classic",
        });
        host = {
            worker,
            remote: Comlink.wrap(worker) as Comlink.Remote<CoreWorker>,
            liveCores: 0,
        };
        sharedHosts.push(host);
    }
    const channel = new MessageChannel();
    // Not awaited: messages the caller sends on port1 in the meantime are
    // buffered by the channel until the host exposes the core on port2, so
    // the returned remote is usable immediately (the caller's handshake
    // watchdog covers the failure case, as it does for a dedicated worker
    // that never boots).
    const coreIdPromise = host.remote.createCore(
        Comlink.transfer(channel.port2, [channel.port2]),
    );
    coreIdPromise.catch(() => {
        // Failure surfaces to the caller through its own (watchdogged) calls
        // on `remote`; this handler only prevents an unhandled rejection.
    });
    const remote = Comlink.wrap(channel.port1) as Comlink.Remote<CoreWorker>;
    host.liveCores++;
    let killed = false;
    const kill = () => {
        if (killed) {
            return;
        }
        killed = true;
        host.liveCores--;
        channel.port1.close();
        // Best-effort: if the host's event loop is alive (a wedged sibling
        // core does not block it — cores share the thread, so this only fails
        // on a thread-blocking wedge), release the core's memory.
        coreIdPromise.then((id) => host.remote.destroyCore(id)).catch(() => {});
    };
    return { remote, kill };
}

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 *
 * Returns the Comlink `remote` (the normal async API) and a `kill` switch.
 * Callers should drive the core through `remote`; `kill` is only for
 * guaranteed teardown when the core has stopped responding.
 *
 * With `doenetGlobalConfig.useSharedCoreWorker` set (#1466), cores are
 * multiplexed onto shared host workers instead of one worker per document.
 */
export function createCoreWorker(): CoreWorkerHandle {
    if (doenetGlobalConfig.useSharedCoreWorker) {
        try {
            return createSharedWorkerCore();
        } catch (e) {
            console.warn(
                "Shared core worker unavailable, falling back to a dedicated worker:",
                e,
            );
        }
    }
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "classic",
    });
    const remote = Comlink.wrap(worker) as Comlink.Remote<CoreWorker>;
    return { remote, kill: () => worker.terminate() };
}

export async function initializeCoreWorker({
    coreWorker,
    doenetML,
    flags,
    activityId,
    docId,
    requestedVariantIndex,
    attemptNumber,
    documentStructureCallback,
    fetchExternalDoenetML,
}: {
    coreWorker: Comlink.Remote<CoreWorker>;
    doenetML: string;
    flags: DoenetMLFlags;
    activityId: string;
    docId: string;
    requestedVariantIndex: number;
    attemptNumber: number;
    documentStructureCallback?: Function;
    fetchExternalDoenetML?: (arg: string) => Promise<string>;
}) {
    let dast = lezerToDast(doenetML);

    if (fetchExternalDoenetML) {
        dast = await expandExternalReferences(dast, fetchExternalDoenetML);
    }

    dast = normalizeDocumentDast(dast, true);

    await coreWorker.setCoreType("javascript");
    await coreWorker.setSource({ source: doenetML, dast });
    await coreWorker.setFlags({ flags });

    const result = await coreWorker.initializeJavascriptCore({
        activityId,
        docId,
        requestedVariantIndex,
        attemptNumber,
    });

    documentStructureCallback?.({
        activityId,
        docId,
        args: {
            allPossibleVariants: result.allPossibleVariants,
            baseComponentCounts: result.baseComponentCounts,
        },
    });

    return result;
}
