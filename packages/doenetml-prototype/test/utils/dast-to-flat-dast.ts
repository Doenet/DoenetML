import {
    lezerToDast,
    filterPositionInfo,
    normalizeDocumentDast,
} from "@doenet/parser";
import type { CoreWorker, FlatDastRoot } from "@doenet/doenetml-worker";
import * as Comlink from "comlink";
import { doenetGlobalConfig } from "../../src/global-config";

// @ts-ignore
import workerSource from "@doenet/doenetml-worker/index.js?raw";

// We make a blob URL directly from the source code of the worker. This way we don't
// need to load any other files
const workerBlobUrl = URL.createObjectURL(
    new Blob([workerSource], { type: "application/javascript" }),
);
doenetGlobalConfig.doenetWorkerUrl = workerBlobUrl;

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 *
 * The raw worker's `terminate` comes back alongside the proxy because Comlink
 * hides the `Worker` itself, and every caller has to terminate it. A core
 * worker holds two WASM modules per realm now — the core's and the math
 * engine's — so one that outlives its use costs an order of magnitude more
 * memory than it used to; `test/wasm-tests.test.browser.ts` had to start
 * terminating for the same reason.
 */
export function createWrappedCoreWorker() {
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "classic",
    });
    return {
        core: Comlink.wrap(worker) as Comlink.Remote<CoreWorker>,
        terminate: () => worker.terminate(),
    };
}

/**
 * Convert a string to normalized DAST
 */
export function toDast(source: string) {
    return normalizeDocumentDast(lezerToDast(source));
}

/**
 * Filter out position information from FlatDast
 */
function flatDastFilterPositionInfo(flatDast: FlatDastRoot): FlatDastRoot {
    return filterPositionInfo(flatDast as any) as any as FlatDastRoot;
}

/**
 * Script to be called by `webdriverio` to get the flat DAST.
 *
 * One worker per call, terminated in a `finally` — the page this is installed
 * into outlives every call, so a worker left behind is held for the whole run.
 */
async function getFlatDast(source: string) {
    const { core, terminate } = createWrappedCoreWorker();
    try {
        await core.setFlags({ flags: {} });
        await core.setSource({ source, dast: toDast(source) });
        return flatDastFilterPositionInfo(await core.returnDast());
    } finally {
        terminate();
    }
}

(globalThis as any).getFlatDast = getFlatDast;
