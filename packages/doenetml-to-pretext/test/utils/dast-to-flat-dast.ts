import {
    lezerToDast,
    filterPositionInfo,
    normalizeDocumentDast,
} from "@doenet/parser";
import type {
    CoreWorker,
    FlatDastRoot,
    FlatDastRootWithErrors,
} from "@doenet/doenetml-worker";
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
 */
export function createWrappedCoreWorker() {
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "classic",
    });
    return Comlink.wrap(worker) as Comlink.Remote<CoreWorker>;
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
function flatDastFilterPositionInfo(
    flatDast: FlatDastRoot | FlatDastRootWithErrors,
): FlatDastRoot {
    return filterPositionInfo(flatDast as any) as any as FlatDastRoot;
}

/**
 * Create a worker initialized with empty flags and the source `source`.
 */
async function workerWithSource(source: string) {
    const worker = await createWrappedCoreWorker();
    await worker.setFlags({ flags: {} });
    await worker.setSource({
        source,
        dast: toDast(source),
    });
    return worker;
}

/**
 * Script to be called by `webdriverio` to get the flat DAST.
 */
async function getFlatDast(source: string) {
    const worker = await workerWithSource(source);

    const flatDast = flatDastFilterPositionInfo(await worker.returnDast());
    return flatDast;
}

(globalThis as any).getFlatDast = getFlatDast;

// Load all of our conversion functions into the global scope
import * as ConvertFunctions from "../../src/index";
Object.assign(globalThis, ConvertFunctions);
