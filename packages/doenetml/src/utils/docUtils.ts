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
     * The underlying native `Worker`. Retained so a *wedged* worker can be
     * force-killed with `worker.terminate()`. The Comlink `remote.terminate()`
     * call routes through the worker's own serialization queue, so if that
     * queue is stuck (e.g. a hung WASM init), the Comlink terminate hangs too
     * — leaving no way to recover. See Doenet/DoenetApps#2957.
     */
    worker: Worker;
};

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 *
 * Returns both the Comlink `remote` (the normal async API) and the native
 * `worker` handle. Callers should drive the worker through `remote`; the
 * native `worker` is only for `terminate()` as a guaranteed kill switch when
 * the worker has stopped responding.
 */
export function createCoreWorker(): CoreWorkerHandle {
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "classic",
    });
    const remote = Comlink.wrap(worker) as Comlink.Remote<CoreWorker>;
    return { remote, worker };
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
