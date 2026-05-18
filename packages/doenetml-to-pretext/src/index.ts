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

export class DoenetMLToPretext {
    _worker: Comlink.Remote<CoreWorker> | null = null;

    async _ensureWorker() {
        if (!this._worker) {
            this._worker = await this._createWrappedCoreWorker();
            await this._worker.setCoreType("javascript");
        }
    }

    async convert(doenetML: string): Promise<string> {
        await this._ensureWorker();

        const flatDast = await this._getStaticDast(doenetML);
        const xastRoot = await this._flatDastToPretext(flatDast);

        return xastToXml(xastRoot);
    }

    _createWrappedCoreWorker() {
        const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
            type: "module",
        });

        return Comlink.wrap(worker) as Comlink.Remote<CoreWorker>;
    }

    async _runDastThroughWorker(
        dast: DastRoot,
        source: string,
    ): Promise<FlatDastRootWithErrors> {
        await this._ensureWorker();
        if (!this._worker) {
            throw new Error("Worker not initialized");
        }

        await this._worker.setSource({ dast, source });
        await this._worker.setFlags({ flags: defaultFlags });

        const flatDast = await this._worker.returnDast();

        return flatDast;
    }

    /**
     * Get a flat DAST representation of DoenetML source. This flat DAST has already been run through core,
     * so elements like references, etc. have all been resolved.
     */
    async _getStaticDast(doenetML: string): Promise<FlatDastRootWithErrors> {
        await this._ensureWorker();

        const normalizedDast = getNormalizedDast(doenetML);
        const preprocessedDast = preprocessDast(normalizedDast);

        const flatDast = await this._runDastThroughWorker(
            preprocessedDast,
            doenetML,
        );

        return flatDast;
    }

    /**
     * Convert flat DAST to PreTeXt XAST.
     *
     * Note: if you want to convert a string of DoenetML to PreTeXt, use the `convert` method instead.
     */
    async _flatDastToPretext(
        flatDast: FlatDastRootWithErrors,
    ): Promise<Xast.Root> {
        return renderFlatDastToPretext(flatDast);
    }
}

/**
 * Create a DoenetCoreWorker that is wrapped in Comlink for a nice async API.
 */
export async function createWrappedCoreWorker() {
    const worker = new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "module",
    });

    return Comlink.wrap(worker) as Comlink.Remote<CoreWorker>;
}

/**
 * Convert a DoenetML string into a static PreTeXt representation.
 */
export async function doenetMLToPretext(doenetML: string): Promise<string> {
    const converter = new DoenetMLToPretext();
    return await converter.convert(doenetML);

    // const flatDast = await getStaticDast(doenetML);
    // const xastRoot = await flatDastToPretext(flatDast);

    // return xastToXml(xastRoot);
}

/**
 * Convert FlatDast to static PreTeXt.
 */
export async function flatDastToPretext(
    flatDast: FlatDastRootWithErrors,
): Promise<Xast.Root> {
    return renderFlatDastToPretext(flatDast);
}

// /**
//  * Convert DoenetML `source` into a static DAST representation. This is suitable for rendering to PreTeXt.
//  * @param source
//  */
// export async function getStaticDast(
//     source: string,
// ): Promise<FlatDastRootWithErrors> {
//     const normalizedDast = getNormalizedDast(source);
//     const preprocessedDast = preprocessDast(normalizedDast);
//     const flatDast = await runDastThroughWorker(preprocessedDast, source);

//     return flatDast;
// }

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

// /**
//  * Run normalized DAST through the core worker to get FlatDast.
//  */
// export async function runDastThroughWorker(
//     dast: DastRoot,
//     source: string,
// ): Promise<FlatDastRootWithErrors> {
//     const worker = await createWrappedCoreWorker();
//     await worker.setCoreType("javascript");
//     await worker.setSource({ dast, source });
//     await worker.setFlags({ flags: defaultFlags });

//     const flatDast = await worker.returnDast();

//     return flatDast;
// }
