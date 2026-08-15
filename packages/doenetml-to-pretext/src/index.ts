import { CoreWorker, FlatDastRootWithErrors } from "@doenet/doenetml-worker";
import { DastRoot, lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { doenetGlobalConfig } from "./global-config";
import * as Comlink from "comlink";
import * as Xast from "xast";
import "./index-inline-worker";
import {
    renderFlatDastToPretext,
    ConvertOptions,
} from "./utils/pretext/render-to-pretext";
import { preprocessDastForPretext } from "./utils/pretext/preprocess-dast";
import { toXml as xastToXml } from "xast-util-to-xml";
import { prefixIds } from "./utils/pretext/prefix-ids";

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
    /**
     * The `Worker` behind {@link _worker}. Comlink's proxy does not expose the
     * port it wraps, so the raw handle has to be kept for {@link dispose} to
     * have anything to terminate.
     */
    _rawWorker: Worker | null = null;

    async _ensureWorker() {
        if (!this._worker) {
            this._worker = await this._createWrappedCoreWorker();
            await this._worker.setCoreType("javascript");
        }
    }

    /**
     * Convert multiple DoenetML fragments to PreTeXt strings.
     * Each fragment is converted in fragment mode and converted to string form.
     */
    async convertMultiple(
        fragments: string[],
        options: ConvertOptions = {},
    ): Promise<string[]> {
        const xastRoots: Xast.Root[] = [];
        for (const fragment of fragments) {
            const flatDast = await this._getStaticDast(fragment);
            const xastRoot = await this._flatDastToPretext(flatDast, {
                ...options,
                fragment: true,
            });
            xastRoots.push(xastRoot);
        }
        if (xastRoots.length > 1) {
            // If we have multiple fragments, assume they are being embedded into the same PreTeXt document. A such,
            // their generated xml:id's must be unique (in PreTeXt all xml:id's are unique).
            xastRoots.forEach((root, i) => {
                prefixIds(`fragment${i}-`, root);
            });
        }
        const ret = xastRoots.map((xastRoot) => xastToXml(xastRoot));
        ret.forEach((pretextOutput) => {
            this.throwOnErrors(pretextOutput);
        });
        return ret;
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
        this._rawWorker = worker;

        return Comlink.wrap(worker) as Comlink.Remote<CoreWorker>;
    }

    /**
     * Shut the core worker down and release everything it holds.
     *
     * A core worker is not cheap: it holds the whole worker bundle plus two
     * instantiated WASM modules (the DoenetML core and, since the math engine
     * moved to Rust, `@doenet/math`), and nothing reclaims it while the realm
     * is alive. Anything that creates a converter per document — a batch
     * conversion, a test file — must call this, or every conversion leaves a
     * live worker behind for the lifetime of the page.
     *
     * Safe to call more than once, and safe to call on a converter that never
     * booted a worker. The instance is reusable afterwards: the next
     * conversion boots a fresh worker.
     */
    dispose() {
        // Terminate the worker rather than releasing the Comlink proxy:
        // `releaseProxy` waits for the worker to acknowledge, which a wedged
        // or already-dead worker never does. Terminating tears down the
        // message port with the realm.
        this._rawWorker?.terminate();
        this._rawWorker = null;
        this._worker = null;
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
        options: ConvertOptions = {},
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
    try {
        return await converter.convert(doenetML, options);
    } finally {
        // This function owns the converter it just made, so it owns the
        // worker's lifetime too. Without this, calling it once per document
        // leaks one core worker per call — see {@link DoenetMLToPretext.dispose}.
        converter.dispose();
    }
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
