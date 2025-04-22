import { PublicDoenetMLCore } from "../../CoreWorker";
import fs from "node:fs";
import path from "path";

import init, {
    PublicDoenetMLCore as PublicDoenetMLCoreRust,
    DastRoot as DastRootInCore,
    PathToCheck,
} from "lib-doenetml-worker";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import util from "util";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

type DoenetMLFlags = {
    showCorrectness: boolean;
    readOnly: boolean;
    solutionDisplayMode:
        | "button"
        | "buttonRequirePermission"
        | "displayed"
        | "none";
    showFeedback: boolean;
    showHints: boolean;
    allowLoadState: boolean;
    allowSaveState: boolean;
    allowLocalState: boolean;
    allowSaveEvents: boolean;
    autoSubmit: boolean;
};

type DoenetMLFlagsSubset = Partial<DoenetMLFlags>;

const defaultFlags: DoenetMLFlags = {
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

export async function createTestCore({
    doenetML,
    requestedVariantIndex = 1,
    flags: specifiedFlags = {},
    theme,
    initializeCounters = {},
    requestSolutionView = async () => ({ allowView: true }),
}: {
    doenetML: string;
    requestedVariantIndex?: number;
    flags?: DoenetMLFlagsSubset;
    theme?: "dark" | "light";
    initializeCounters?: Record<string, number>;
    requestSolutionView?: (componentIdx: string) => Promise<{
        allowView: boolean;
    }>;
}) {
    const wasmBuffer = fs.readFileSync(
        path.resolve(
            __dirname,
            "../../../../doenetml-worker/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm",
        ),
    );

    await init(wasmBuffer);

    const rustCore = PublicDoenetMLCoreRust.new();

    const dast = normalizeDocumentDast(lezerToDast(doenetML), true);
    rustCore.set_source(dast as DastRootInCore, doenetML);

    let { normalizedRoot, resolver } = rustCore.return_normalized_dast_root();

    const flags: DoenetMLFlags = { ...defaultFlags, ...specifiedFlags };

    const core = new PublicDoenetMLCore();

    core.setSource(doenetML);
    core.setFlags(flags);

    await core.initializeWorker({
        activityId: "",
        docId: "1",
        requestedVariantIndex,
        attemptNumber: 1,
        normalizedRoot,
        resolver,
    });

    const dastResult = await core.createCoreGenerateDast(
        {
            coreId: "",
            cid: "",
            initializeCounters,
            theme,
        },
        () => null,
        () => null,
        () => null,
        () => null,
        () => null,
        () => null,
        requestSolutionView,
    );

    if (!dastResult.success) {
        throw Error(dastResult.errMsg);
    }

    /**
     * Attempts to resolve the component name `name` to a componentIdx,
     * starting the search algorithm at node `origin`.
     *
     * Throws an error if the name is not resolved.
     */
    function resolveComponentName(name: string, origin = 0) {
        const path: PathToCheck = {
            path: name
                .split(".")
                .map((nm) => ({ type: "flatPathPart", name: nm, index: [] })),
        };

        const resolution = PublicDoenetMLCoreRust.resolve_path(
            resolver,
            path,
            origin,
        );
        return resolution.node_idx;
    }

    return { core, rustCore, resolveComponentName };
}
