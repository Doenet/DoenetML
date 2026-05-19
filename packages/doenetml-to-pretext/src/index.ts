import { CoreWorker, FlatDastRootWithErrors } from "@doenet/doenetml-worker";
import { DastRoot, lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { doenetGlobalConfig } from "./global-config";
import * as Comlink from "comlink";
import * as Xast from "xast";
import "./index-inline-worker";
import { renderFlatDastToPretext } from "./utils/pretext/render-to-pretext";
import { preprocessDastForPretext } from "./utils/pretext/preprocess-dast";
import { toXml as xastToXml } from "xast-util-to-xml";

export type ConvertOptions = Parameters<typeof renderFlatDastToPretext>[1];

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

    async convert(
        doenetML: string,
        {
            throwOnError = true,
            ...options
        }: { throwOnError?: boolean } & ConvertOptions = {},
    ): Promise<string> {
        await this._ensureWorker();

        const flatDast = await this._getStaticDast(doenetML);
        const xastRoot = await this._flatDastToPretext(flatDast, options);
        const result = xastToXml(xastRoot);

        if (throwOnError) {
            this.throwOnErrors(result);
        }

        return result;
    }

    /**
     * Throw an error if the PreTeXt output contains error elements (`<_error>`).
     */
    throwOnErrors(pretextOutput: string): void {
        if (pretextOutput.includes("<_error>")) {
            throw new Error(
                "DoenetML conversion produced errors. Output contains <_error> elements.",
            );
        }
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

        // Apply optional preprocessing to normalized DAST before worker execution.
        const preprocessedDast = preprocessDastForPretext(normalizedDast);

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
        options: Parameters<typeof renderFlatDastToPretext>[1] = {},
    ): Promise<Xast.Root> {
        return renderFlatDastToPretext(flatDast, options);
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
export async function doenetMLToPretext(
    doenetML: string,
    options: { throwOnError?: boolean } & ConvertOptions = {},
): Promise<string> {
    const converter = new DoenetMLToPretext();
    return await converter.convert(doenetML, options);
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
 * Convert DoenetML source text into normalized DAST.
 */
export function getNormalizedDast(source: string) {
    return normalizeDocumentDast(lezerToDast(source));
}
