import { CoreWorker, FlatDastRootWithErrors } from "@doenet/doenetml-worker";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { doenetGlobalConfig } from "./global-config";
import * as Comlink from "comlink";
import "./index-inline-worker";

const defaultFlags = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: false,
    allowSaveState: false,
    allowLocalState: false,
    allowSaveEvents: false,
    autoSubmit: false,
};

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
 * Convert DoenetML to static PreTeXt.
 */
export async function doenetmlToPretext() {
    // This function is a placeholder for the main export of the package.
    // It can be used to initialize or export functionalities related to DoenetML to PreTeXt conversion.
    console.log("DoenetML to PreTeXt conversion initialized.");
}

/**
 * Convert DoenetML `source` into a static DAST representation. This is suitable for rendering to PreTeXt.
 * @param source
 */
export async function getStaticDast(
    source: string,
): Promise<FlatDastRootWithErrors> {
    const worker = createWrappedCoreWorker();
    await worker.setCoreType("javascript");
    const dast = normalizeDocumentDast(lezerToDast(source));
    await worker.setSource({ dast, source });
    await worker.setFlags({ flags: defaultFlags });

    const flatDast = await worker.returnDast();

    return flatDast;
}
