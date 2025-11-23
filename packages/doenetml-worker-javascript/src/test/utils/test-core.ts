import { PublicDoenetMLCore } from "../../CoreWorker";
import fs from "node:fs";
import path from "path";

import init, {
    PublicDoenetMLCore as PublicDoenetMLCoreRust,
    DastRoot as DastRootInCore,
    FlatPathPart,
    FlatIndex,
    RefResolution,
    PathToCheck,
    FlatFragment,
    IndexResolution,
    ContentVector,
    NodeList,
} from "lib-doenetml-worker";
import {
    expandExternalReferences,
    lezerToDast,
    normalizeDocumentDast,
} from "@doenet/parser";
import { resolvePathImmediatelyToNodeIdx } from "@doenet/debug-hooks";

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
    saveRendererState: boolean;
    allowLocalState: boolean;
    allowSaveEvents: boolean;
    messageParent: boolean;
    autoSubmit: boolean;
};

type DoenetMLFlagsSubset = Partial<DoenetMLFlags>;

const defaultFlags: DoenetMLFlags = {
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

export type ResolvePathToNodeIdx = Awaited<
    ReturnType<typeof createTestCore>
>["resolvePathToNodeIdx"];

export async function createTestCore({
    doenetML,
    requestedVariantIndex = 1,
    flags: specifiedFlags = {},
    theme,
    initializeCounters = {},
    requestSolutionView = async () => ({ allowView: true }),
    externalDoenetMLs = {},
}: {
    doenetML: string;
    requestedVariantIndex?: number;
    flags?: DoenetMLFlagsSubset;
    theme?: "dark" | "light";
    initializeCounters?: Record<string, number>;
    requestSolutionView?: (componentIdx: number) => Promise<{
        allowView: boolean;
    }>;
    externalDoenetMLs?: Record<string, string>;
}) {
    const wasmBuffer = fs.readFileSync(
        path.resolve(
            __dirname,
            "../../../../doenetml-worker-rust/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm",
        ),
    );

    await init(wasmBuffer);

    const rustCore = PublicDoenetMLCoreRust.new();

    /**
     * A mock function for retrieving DoenetML source from a URI,
     * using the URI `doenet:[code]`.
     */
    function fetchExternalDoenetML(sourceUri: string) {
        return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                const match = sourceUri.match(/^doenet:(\w+)/);

                if (match) {
                    const doenetML = externalDoenetMLs[match[1]];

                    if (doenetML) {
                        return resolve(doenetML);
                    }
                }
                reject(`DoenetML for "${sourceUri}" not found.`);
            });
        });
    }

    const dast = normalizeDocumentDast(
        await expandExternalReferences(
            lezerToDast(doenetML),
            fetchExternalDoenetML,
        ),
        true,
    );
    rustCore.set_source(dast as DastRootInCore, doenetML);

    const normalizedRoot = rustCore.return_normalized_dast_root();

    function calculateRootNames() {
        return rustCore.calculate_root_names();
    }

    function resolvePath(
        path: PathToCheck,
        origin: number,
        skip_parent_search: boolean,
    ): RefResolution {
        return rustCore.resolve_path(path, origin, skip_parent_search);
    }
    function addNodesToResolver(
        flat_fragment: FlatFragment,
        index_resolution: IndexResolution,
    ) {
        rustCore.add_nodes_to_resolver(flat_fragment, index_resolution);
    }
    function replaceIndexResolutionsInResolver(
        components: ContentVector,
        index_resolution: IndexResolution,
    ) {
        rustCore.replace_index_resolutions_in_resolver(
            components,
            index_resolution,
        );
    }
    function deleteNodesFromResolver(node_list: NodeList) {
        rustCore.delete_nodes_from_resolver(node_list);
    }

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
        addNodesToResolver,
        replaceIndexResolutionsInResolver,
        deleteNodesFromResolver,
        resolvePath,
        calculateRootNames,
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
    function resolvePathToNodeIdx(name: string, origin = 0) {
        return resolvePathImmediatelyToNodeIdx(name, rustCore, core, origin);
    }

    return { core, rustCore, resolvePathToNodeIdx };
}
