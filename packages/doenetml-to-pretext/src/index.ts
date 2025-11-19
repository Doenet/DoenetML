import { CoreWorker, FlatDastRootWithErrors } from "@doenet/doenetml-worker";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { doenetGlobalConfig } from "./global-config";
import * as Comlink from "comlink";
import * as Xast from "xast";
import "./index-inline-worker";
import { renderFlatDastToPretext } from "./utils/pretext/render-to-pretext";
import { toXml as xastToXml } from "xast-util-to-xml";

const defaultFlags = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: true,
    allowSaveState: true,
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
    const worker = await createWrappedCoreWorker();
    await worker.setCoreType("javascript");
    const dast = normalizeDocumentDast(lezerToDast(source));
    await worker.setSource({ dast, source });
    await worker.setFlags({ flags: defaultFlags });

    const flatDast = await worker.returnDast();

    return flatDast;
}
