import { DoenetMLFlags } from "../doenetml";
import { doenetGlobalConfig } from "../global-config";
import * as Comlink from "comlink";
import type { CoreWorker } from "@doenet/doenetml-worker";
import {
    expandExternalReferences,
    lezerToDast,
    normalizeDocumentDast,
} from "@doenet/parser";

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 */
export function createCoreWorker() {
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "classic",
    });
    return Comlink.wrap(worker) as Comlink.Remote<CoreWorker>;
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
    retrieveDoenetML,
}: {
    coreWorker: Comlink.Remote<CoreWorker>;
    doenetML: string;
    flags: DoenetMLFlags;
    activityId: string;
    docId: string;
    requestedVariantIndex: number;
    attemptNumber: number;
    documentStructureCallback?: Function;
    retrieveDoenetML?: (arg: string) => Promise<string>;
}) {
    let dast = lezerToDast(doenetML);

    if (retrieveDoenetML) {
        dast = await expandExternalReferences(dast, retrieveDoenetML);
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

    if (result.success) {
        documentStructureCallback?.({
            activityId,
            docId,
            args: {
                allPossibleVariants: result.allPossibleVariants,
                baseComponentCounts: result.baseComponentCounts,
            },
        });
    }

    return result;
}
