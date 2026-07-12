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
     * core — sibling cores are unaffected.
     *
     * `suspectWedge` marks teardowns where the core stopped responding (a
     * watchdogged handshake timeout, or a graceful terminate that timed out)
     * rather than an ordinary unmount. In shared mode this quarantines the
     * core's host worker: no new cores are assigned to it (a retry therefore
     * lands on a fresh worker), and it is natively terminated once its last
     * core is gone. Existing sibling cores keep running — the suspicion may
     * be a false positive (e.g. CPU contention), and a sibling that is truly
     * affected will trip its own watchdog.
     */
    kill: (suspectWedge?: boolean) => void;
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
type SharedHost = {
    worker: Worker;
    remote: Comlink.Remote<CoreWorker>;
    liveCores: number;
    /**
     * A quarantined host receives no new cores (retries land on a fresh
     * worker) and is natively terminated once its last core is gone. Set when
     * a core on this host stops responding (`kill(suspectWedge)`) or the
     * worker itself fires an `error` event.
     */
    quarantined: boolean;
};

const sharedHosts: SharedHost[] = [];

/**
 * Quarantine a shared host: stop assigning new cores to it, and once no live
 * cores remain, natively terminate it and drop it from the pool. Live sibling
 * cores are left running — the suspicion may be a false positive (CPU
 * contention), and a truly affected sibling will trip its own watchdog, whose
 * `kill(suspectWedge)` lands back here until the host empties out.
 */
function quarantineSharedHost(host: SharedHost) {
    host.quarantined = true;
    if (host.liveCores <= 0) {
        try {
            host.worker.terminate();
        } catch {
            // best-effort; nothing more we can do
        }
        const index = sharedHosts.indexOf(host);
        if (index !== -1) {
            sharedHosts.splice(index, 1);
        }
    }
}

/**
 * Create a core on a shared host worker (#1466): the host worker's default
 * instance doubles as a core factory, and each core is driven over its own
 * `MessagePort` with the same Comlink API a dedicated worker would offer.
 */
function createSharedWorkerCore(): CoreWorkerHandle {
    const maxCores =
        doenetGlobalConfig.sharedCoreWorkerMaxCores ??
        DEFAULT_SHARED_CORE_WORKER_MAX_CORES;
    let host = sharedHosts.find(
        (h) => !h.quarantined && h.liveCores < maxCores,
    );
    if (!host) {
        const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
            type: "classic",
        });
        const newHost: SharedHost = {
            worker,
            remote: Comlink.wrap(worker) as Comlink.Remote<CoreWorker>,
            liveCores: 0,
            quarantined: false,
        };
        // A worker-level error (e.g. the script failed to load) poisons every
        // core on it; make sure no future cores land there.
        worker.addEventListener("error", () => {
            quarantineSharedHost(newHost);
        });
        sharedHosts.push(newHost);
        host = newHost;
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
    const kill = (suspectWedge?: boolean) => {
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
        if (suspectWedge || host.quarantined) {
            // Unresponsive core (or already-suspect host): stop assigning new
            // cores here, and terminate the worker once it holds none. A
            // subsequent retry by the caller then boots on a fresh worker —
            // this is what lets DocViewer's handshake watchdog + retry ladder
            // recover in shared mode even from a thread-blocking wedge.
            quarantineSharedHost(host);
        }
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
    // A host-provided core factory takes precedence (#1466): the embedding
    // page (e.g. @doenet/doenetml-iframe's parent component) owns the shared
    // worker pool and hands this realm a per-core MessagePort, so cores from
    // MANY same-origin iframes multiplex onto the same workers — something
    // this realm cannot arrange on its own.
    const externalPortProvider =
        doenetGlobalConfig.createExternalCoreWorkerPort;
    if (externalPortProvider) {
        try {
            const external = externalPortProvider();
            if (external) {
                const remote = Comlink.wrap(
                    external.port,
                ) as Comlink.Remote<CoreWorker>;
                let killed = false;
                const kill = (suspectWedge?: boolean) => {
                    if (killed) {
                        return;
                    }
                    killed = true;
                    try {
                        external.port.close();
                    } catch {
                        // best-effort
                    }
                    try {
                        external.destroy(suspectWedge);
                    } catch {
                        // best-effort
                    }
                };
                return { remote, kill };
            }
        } catch (e) {
            console.warn(
                "External core worker port unavailable, falling back:",
                e,
            );
        }
    }
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
