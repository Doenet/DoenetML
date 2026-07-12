import * as Comlink from "comlink";

// Parent-side shared core-worker pool (#1466, milestone 3).
//
// Each srcdoc iframe is its own realm and cannot share workers with its
// siblings, so the PARENT page (where this React component runs) owns the
// worker pool. An iframe that opts in mints a `MessageChannel` locally, keeps
// one port for its viewer, and posts the other port here
// (`createSharedCore`); we forward that port to a shared host worker's
// `createCore`, so the core lives beside the other iframes' cores in the same
// worker instead of costing its own ~100 MB dedicated worker.
//
// Pools are keyed by the RESOLVED worker URL, so components pinned to
// different standalone versions get separate (matching-version) workers.

/** Mirrors the pool cap in @doenet/doenetml's docUtils. */
const MAX_CORES_PER_WORKER = 12;

type SharedHost = {
    worker: Worker;
    remote: {
        createCore: (port: MessagePort) => Promise<number>;
        destroyCore: (id: number) => Promise<void>;
    };
    liveCores: number;
    quarantined: boolean;
};

const hostsByWorkerUrl = new Map<string, SharedHost[]>();

type CoreRecord = {
    viewerId: string;
    host: SharedHost;
    /** Pool key of `host`, needed for quarantine bookkeeping at destroy time. */
    workerUrl: string;
    idPromise: Promise<number>;
    destroyed: boolean;
};

const coreRecords = new Map<string, CoreRecord>();

/**
 * Resolve the worker URL for a standalone bundle URL: the worker directory is
 * co-served next to the bundle (`doenetml-worker/index.js`, both on npm/CDN
 * and in a dist deploy). For a blob/data `standaloneUrl` (no "next to the
 * bundle"), fall back to `<origin>/doenetml-worker/index.js` on this page —
 * the same chain the standalone bundle itself uses.
 */
function resolveWorkerUrl(standaloneUrl: string): string | null {
    try {
        return new URL("./doenetml-worker/index.js", standaloneUrl).href;
    } catch {
        // opaque base (blob:/data:) — fall through
    }
    try {
        return new URL("/doenetml-worker/index.js", document.baseURI).href;
    } catch {
        return null;
    }
}

/**
 * A dedicated `new Worker(url)` requires a same-origin URL. When the worker
 * resolves cross-origin (the CDN case), wrap it in a tiny same-origin
 * classic-worker bootstrap that `importScripts()` the real (CORS-served)
 * worker — the same technique as @doenet/doenetml's external-worker entry.
 */
function workerCreationUrl(workerUrl: string): string {
    try {
        if (new URL(workerUrl).origin === window.location.origin) {
            return workerUrl;
        }
    } catch {
        // fall through to the bootstrap
    }
    const bootstrap = `importScripts(${JSON.stringify(workerUrl)});`;
    return URL.createObjectURL(
        new Blob([bootstrap], { type: "text/javascript" }),
    );
}

function quarantineHost(workerUrl: string, host: SharedHost) {
    host.quarantined = true;
    if (host.liveCores <= 0) {
        try {
            host.worker.terminate();
        } catch {
            // best-effort
        }
        const pool = hostsByWorkerUrl.get(workerUrl);
        const index = pool?.indexOf(host) ?? -1;
        if (pool && index !== -1) {
            pool.splice(index, 1);
        }
    }
}

function getHost(workerUrl: string): SharedHost {
    let pool = hostsByWorkerUrl.get(workerUrl);
    if (!pool) {
        pool = [];
        hostsByWorkerUrl.set(workerUrl, pool);
    }
    let host = pool.find(
        (h) => !h.quarantined && h.liveCores < MAX_CORES_PER_WORKER,
    );
    if (!host) {
        const worker = new Worker(workerCreationUrl(workerUrl), {
            type: "classic",
        });
        const newHost: SharedHost = {
            worker,
            remote: Comlink.wrap(worker) as unknown as SharedHost["remote"],
            liveCores: 0,
            quarantined: false,
        };
        worker.addEventListener("error", () => {
            quarantineHost(workerUrl, newHost);
        });
        pool.push(newHost);
        host = newHost;
    }
    return host;
}

/**
 * Handle a `createSharedCore` request from an iframe: forward its transferred
 * port to a (possibly new) shared host worker's `createCore`. The iframe's
 * viewer is already sending on its end of the channel; those messages buffer
 * until the core is exposed.
 */
export function handleCreateSharedCore({
    viewerId,
    coreId,
    standaloneUrl,
    port,
}: {
    viewerId: string;
    coreId: string;
    standaloneUrl: string;
    port: MessagePort;
}) {
    const workerUrl = resolveWorkerUrl(standaloneUrl);
    if (workerUrl === null) {
        // Nothing we can do — the viewer's handshake watchdog will surface
        // the failure (and DocViewer will retry / error out).
        console.warn(
            "doenetml-iframe: could not resolve a shared core worker URL for",
            standaloneUrl,
        );
        return;
    }
    const host = getHost(workerUrl);
    host.liveCores++;
    const idPromise = host.remote.createCore(Comlink.transfer(port, [port]));
    idPromise.catch(() => {
        // Failure surfaces through the viewer's own watchdogged calls; this
        // handler only prevents an unhandled rejection.
    });
    coreRecords.set(coreId, {
        viewerId,
        host,
        workerUrl,
        idPromise,
        destroyed: false,
    });
}

/**
 * Handle a `destroySharedCore` request (or component-unmount cleanup):
 * release the core on its host, and quarantine the host when the teardown
 * carried wedge suspicion (see CoreWorkerHandle.kill in @doenet/doenetml).
 */
export function handleDestroySharedCore({
    coreId,
    suspectWedge,
}: {
    coreId: string;
    suspectWedge: boolean;
}) {
    const record = coreRecords.get(coreId);
    if (!record || record.destroyed) {
        return;
    }
    record.destroyed = true;
    coreRecords.delete(coreId);
    record.host.liveCores--;
    // Best-effort: works whenever the host's event loop is alive.
    record.idPromise
        .then((id) => record.host.remote.destroyCore(id))
        .catch(() => {});
    if (suspectWedge || record.host.quarantined) {
        quarantineHost(record.workerUrl, record.host);
    }
}

/**
 * Release every core created for a viewer (component unmount / iframe
 * teardown): an abruptly-removed iframe realm never runs its own destroy
 * path, so without this the cores would leak on the shared host.
 */
export function destroySharedCoresForViewer(viewerId: string) {
    for (const [coreId, record] of [...coreRecords]) {
        if (record.viewerId === viewerId) {
            handleDestroySharedCore({ coreId, suspectWedge: false });
        }
    }
}

/** Pool observability for tests and debugging. */
export function getSharedCorePoolStats() {
    let hosts = 0;
    let liveCores = 0;
    for (const pool of hostsByWorkerUrl.values()) {
        hosts += pool.length;
        for (const host of pool) {
            liveCores += host.liveCores;
        }
    }
    return { hosts, liveCores };
}
