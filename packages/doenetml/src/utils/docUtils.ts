import { DoenetMLFlags } from "../doenetml";
import { doenetGlobalConfig } from "../global-config";
import * as Comlink from "comlink";
import type { CoreWorker } from "@doenet/doenetml-worker";
import {
    expandExternalReferences,
    lezerToDast,
    normalizeDocumentDast,
} from "@doenet/parser";
import { resolveDocumentLocale } from "@doenet/i18n";
import { readDocumentLang } from "./documentLang";

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

/**
 * The initialization in flight on each core worker, keyed by the worker's
 * Comlink remote (#1533).
 *
 * `initializeCoreWorker` drives a worker through several separately awaited
 * round trips, and the worker serializes each call on its own, so two
 * initializations started against one worker interleave in arrival order:
 *
 *     A.setSource, B.setSource, A.setFlags, B.setFlags, ...
 *     A.initializeJavascriptCore, B.initializeJavascriptCore
 *
 * The first `initializeJavascriptCore` releases the document DAST the Rust
 * core retained, the JavaScript core having consumed it, and the second then
 * has nothing to initialize from and fails the boot. Nothing unusual reaches
 * that: a `SPLICE.getState` answer arriving while the optimistic first boot
 * is still in its round trips restarts the boot on the same worker, so does a
 * rebuild that lands mid-boot, and so does `render` turning true while the
 * priming initialization of a `render={false}` viewer is still in flight.
 *
 * So initializations are serialized here, per worker: one started while
 * another is in flight waits for it to settle, then runs whole. Run whole
 * after its predecessor, it is correct as it stands — its own `setSource`
 * puts the DAST back — so settlement is all it waits for: a predecessor
 * that failed is its own caller's to report.
 *
 * Weakly keyed, so an entry goes with the worker it describes and nothing
 * here has to be told when a worker is discarded. One discarded with an
 * initialization queued on it never answers that initialization's round
 * trips, which is where an unserialized one would have hung too; the boot
 * ladder's watchdog is what bounds a hung handshake.
 */
const initializationInFlight = new WeakMap<
    Comlink.Remote<CoreWorker>,
    Promise<unknown>
>();

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
    documentLocale,
    localeResources,
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
    /**
     * BCP-47 tag for the content's language. An authored `<document lang>`
     * overrides it — the author knows what language they wrote in.
     */
    documentLocale?: string | null;
    /**
     * FTL catalogs for the content, keyed by locale. English is bundled into
     * the worker and never needs to be supplied.
     */
    localeResources?: Record<string, string> | null;
}) {
    /**
     * Everything one initialization does, in order: its own work first — the
     * parse, the expansion of external references and the `lang` resolution,
     * which overlap whatever is in flight on the worker — and then the round
     * trips, once `predecessor` (the initialization ahead of it on this
     * worker, if any) has settled. Only the round trips are serialized; see
     * `initializationInFlight`.
     */
    async function initializeAfter(predecessor: Promise<unknown> | undefined) {
        let dast = lezerToDast(doenetML);

        if (fetchExternalDoenetML) {
            dast = await expandExternalReferences(dast, fetchExternalDoenetML);
        }

        dast = normalizeDocumentDast(dast, true);

        // The content's language, for the `lang` attribute on the rendered
        // wrapper. Resolved from the DAST we already parsed rather than asked
        // of the core, so it is available before the first render — a screen
        // reader should not have to wait for evaluation to learn what
        // language it is reading. The core reaches the same tag for its own
        // `document.locale`, running the same helper over the same authored
        // `lang` and the locale sent below, so the attribute always reports
        // the language the content was rendered in — English, for a document
        // nobody declared one for.
        const resolvedDocumentLocale = resolveDocumentLocale(
            readDocumentLang(dast),
            documentLocale,
        );

        if (predecessor) {
            // Settlement is all that is waited for; see
            // `initializationInFlight`.
            await Promise.allSettled([predecessor]);
        }

        await coreWorker.setCoreType("javascript");
        await coreWorker.setSource({ source: doenetML, dast });
        await coreWorker.setFlags({ flags });
        // Sent unconditionally, even with nothing configured: a reused worker
        // (the shared-core pool) would otherwise keep the previous document's
        // locale. Only the host's half of the rule is applied here — an
        // authored `<document lang>` belongs to the `<document>` carrying it,
        // and the core applies it there, once per `<document>`, so what it
        // wants from the host is the ambient preference to fall back on. It
        // goes through the shared helper all the same, so the fallback to
        // English is written in one place and the tag the core stores is
        // canonical for everything that later negotiates against it.
        await coreWorker.setLocaleData({
            localeData: {
                locale: resolveDocumentLocale(undefined, documentLocale),
                resources: localeResources ?? {},
            },
        });

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

        return { ...result, resolvedDocumentLocale };
    }

    // The place in the worker's queue is taken here, when the initialization
    // is asked for: `initializeAfter` runs synchronously to its first await,
    // and the entry is written in the same turn. So initializations run in
    // the order they were asked for, whatever each one's expansion costs —
    // the last to run is the newest, and the worker ends up holding the
    // document the viewer is showing even when an older initialization's
    // external references were slow to fetch.
    const initialization = initializeAfter(
        initializationInFlight.get(coreWorker),
    );
    initializationInFlight.set(coreWorker, initialization);
    try {
        return await initialization;
    } finally {
        // The entry is this initialization's to clear only while nothing has
        // queued behind it; a successor's entry is the successor's.
        if (initializationInFlight.get(coreWorker) === initialization) {
            initializationInFlight.delete(coreWorker);
        }
    }
}
