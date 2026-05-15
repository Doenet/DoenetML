import { CoreWorker, FlatDastRootWithErrors } from "@doenet/doenetml-worker";
import { DastRoot, lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { doenetGlobalConfig } from "./global-config";
import * as Comlink from "comlink";
import * as Xast from "xast";
import "./index-inline-worker";
import { renderFlatDastToPretext } from "./utils/pretext/render-to-pretext";
import { preprocessDastForPretext } from "./utils/pretext/preprocess-dast";
import { toXml as xastToXml } from "xast-util-to-xml";

const defaultFlags = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: true,
    allowSaveState: true,
    saveRendererState: false,
    allowLocalState: false,
    allowSaveEvents: true,
    messageParent: false,
    autoSubmit: false,
};

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 */
export async function createWrappedCoreWorker() {
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "classic",
    });

    return Comlink.wrap(worker) as Comlink.Remote<CoreWorker>;
}

/**
 * Convert a DoenetML string into a static PreTeXt representation.
 */
export async function doenetMLToPretext(doenetML: string): Promise<string> {
    const flatDast = await getStaticDast(doenetML);
    const xastRoot = await flatDastToPretext(flatDast);

    return xastToXml(xastRoot);
}

/**
 * Convert FlatDast to static PreTeXt.
 */
export async function flatDastToPretext(
    flatDast: FlatDastRootWithErrors,
): Promise<Xast.Root> {
    return renderFlatDastToPretext(flatDast);
}

/**
 * Convert DoenetML `source` into a static DAST representation. This is suitable for rendering to PreTeXt.
 * @param source
 */
export async function getStaticDast(
    source: string,
): Promise<FlatDastRootWithErrors> {
    const normalizedDast = getNormalizedDast(source);
    const preprocessedDast = preprocessDast(normalizedDast);
    const flatDast = await runDastThroughWorker(preprocessedDast, source);

    return flatDast;
}

/**
 * Convert DoenetML source text into normalized DAST.
 */
export function getNormalizedDast(source: string) {
    return normalizeDocumentDast(lezerToDast(source));
}

/**
 * Apply optional preprocessing to normalized DAST before worker execution.
 */
export function preprocessDast(dast: DastRoot): DastRoot {
    return preprocessDastForPretext(dast);
}

/**
 * Run normalized DAST through the core worker to get FlatDast.
 */
export async function runDastThroughWorker(
    dast: DastRoot,
    source: string,
): Promise<FlatDastRootWithErrors> {
    const worker = await createWrappedCoreWorker();
    await worker.setCoreType("javascript");
    await worker.setSource({ dast, source });
    await worker.setFlags({ flags: defaultFlags });

    const flatDast = await worker.returnDast();

    return flatDast;
}
