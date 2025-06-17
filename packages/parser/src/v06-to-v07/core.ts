import fs from "node:fs";
import path from "path";

import init, {
    PublicDoenetMLCore as PublicDoenetMLCoreRust,
    DastRoot as DastRootInCore,
} from "lib-doenetml-worker";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import util from "util";
import { PublicDoenetMLCore } from "@doenet/doenetml-worker-javascript";
import { DastRoot } from "../types";
import { toXml } from "../dast-to-xml/dast-util-to-xml";

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

export type ResolvePathToNodeIdx = Awaited<
    ReturnType<typeof createCoreForLookup>
>["resolvePathToNodeIdx"];

export async function createCoreForLookup({ dast }: { dast: DastRoot }) {
    const wasmBuffer = fs.readFileSync(
        path.resolve(
            __dirname,
            "../../../doenetml-worker/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm",
        ),
    );

    await init(wasmBuffer);

    const rustCore = PublicDoenetMLCoreRust.new();

    dast = normalizeDocumentDast(structuredClone(dast), true);
    rustCore.set_source(dast as DastRootInCore, toXml(dast));

    const { normalizedRoot, resolver } = rustCore.return_normalized_dast_root();
    const addNodesToResolver = PublicDoenetMLCoreRust.add_nodes_to_resolver;
    const deleteNodesFromResolver =
        PublicDoenetMLCoreRust.delete_nodes_from_resolver;
    const resolvePath = PublicDoenetMLCoreRust.resolve_path;

    const flags: DoenetMLFlags = { ...defaultFlags };

    const core = new PublicDoenetMLCore();

    core.setSource(toXml(dast));
    core.setFlags(flags);

    await core.initializeWorker({
        activityId: "",
        docId: "1",
        requestedVariantIndex: 1,
        attemptNumber: 1,
        normalizedRoot,
        resolver,
        addNodesToResolver,
        deleteNodesFromResolver,
        resolvePath,
    });

    const dastResult = await core.createCoreGenerateDast(
        {
            coreId: "",
            cid: "",
            initializeCounters: {},
            theme: "light",
        },
        () => null,
        () => null,
        () => null,
        () => null,
        () => null,
        () => null,
        async () => ({ allowView: true }),
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
        if (name.startsWith("$")) {
            name = name.slice(1);
        }
        return core.resolvePathImmediatelyToNodeIdx(name, origin);
    }

    return { core, rustCore, resolvePathToNodeIdx };
}
