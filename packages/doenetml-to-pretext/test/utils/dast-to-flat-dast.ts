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
import workerSource from "@doenet/doenetml-worker/index.esm.js?raw";
// The worker locates its WASM at run time; a blob-URL worker cannot, so
// supply it up front via `self.__doenetWorkerWasmUrl` — see
// `src/index-inline-worker.ts`, which this mirrors.
// @ts-ignore
import wasmUrl from "@doenet/doenetml-worker/lib_doenetml_worker_bg.wasm?url";

function absoluteWasmUrl(): string {
    if (wasmUrl.startsWith("data:")) {
        return wasmUrl;
    }
    try {
        return new URL(wasmUrl, globalThis.location?.href).href;
    } catch {
        return wasmUrl;
    }
}

// We make a blob URL directly from the source code of the worker. This way we don't
// need to load any other files
const workerBlobUrl = URL.createObjectURL(
    new Blob(
        [
            `self.__doenetWorkerWasmUrl = ${JSON.stringify(absoluteWasmUrl())};\n`,
            workerSource,
        ],
        { type: "text/javascript" },
    ),
);
doenetGlobalConfig.doenetWorkerUrl = workerBlobUrl;

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 */
export function createWrappedCoreWorker() {
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "module",
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

/**
 * The converter that every conversion in a test run shares.
 *
 * A `DoenetMLToPretext` starts a worker the first time it converts and never shuts it
 * down, so building one per conversion leaves the page holding as many workers as the
 * file has tests. They compete for the same thread from then on, and the tests at the
 * end of a file slow down until they run out of time.
 */
let converter: ConvertFunctions.DoenetMLToPretext | undefined;

(globalThis as any).sharedConverter = () =>
    (converter ??= new ConvertFunctions.DoenetMLToPretext());
