import init, {
    PublicDoenetMLCore as PublicDoenetMLCoreRust,
    DastRoot as DastRootInCore,
    PathToCheck,
    RefResolution,
    FlatFragment,
    IndexResolution,
    NodeList,
} from "lib-doenetml-worker";
import { normalizeDocumentDast, DastRoot, toXml } from "@doenet/parser";
import { PublicDoenetMLCore } from "@doenet/doenetml-worker-javascript";
import { resolvePathImmediatelyToNodeIdx } from "@doenet/debug-hooks";

type DoenetMLFlags = {
    showCorrectness: boolean;
    readOnly: boolean;
    solutionDisplayMode:
        "button" | "buttonRequirePermission" | "displayed" | "none";
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
    ReturnType<typeof createCoreForLookup>
>["resolvePathToNodeIdx"];

export async function createCoreForLookup({ dast }: { dast: DastRoot }) {
    // Load the WASM bundle in a way that works both in the browser and in node.
    // `init` memoizes the compiled module, so the cost here is one-time; it is the
    // per-document `PublicDoenetMLCoreRust.new()` below that must be freed (see
    // `dispose`), since anything it allocates lives in the shared wasm memory.
    // TODO: is there a way to avoid this from fully bundling a copy of core?
    // Note: `dispose` is not enough to convert an unbounded number of documents in one
    // process. Measured over the 0.6 corpus, roughly 20 MB per document is still
    // retained on the *JavaScript* heap after a forced GC, somewhere inside the core
    // built below, so a long batch run needs a raised `--max-old-space-size` or a
    // recycled worker process.
    const wasmBuffer = (
        await import("@doenet/doenetml-worker/lib_doenetml_worker_bg.wasm?arraybuffer&base64")
    ).default;
    await init({ module_or_path: wasmBuffer });

    const rustCore = PublicDoenetMLCoreRust.new();

    dast = normalizeDocumentDast(structuredClone(dast), true);
    rustCore.set_source(dast as DastRootInCore, toXml(dast));

    const normalizedRoot = rustCore.return_normalized_dast_root();

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
    function deleteNodesFromResolver(node_list: NodeList) {
        rustCore.delete_nodes_from_resolver(node_list);
    }

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

        return resolvePathImmediatelyToNodeIdx(name, rustCore, core, origin);
    }

    /**
     * Release the core built for this lookup.
     *
     * Without this, every converted document leaves a `PublicDoenetMLCore` allocated in
     * the shared wasm linear memory, which only ever grows. (See the note above: this
     * does not release the separate, larger retention on the JavaScript heap.)
     */
    async function dispose() {
        try {
            await core.terminate();
        } catch (e) {
            // Terminating is best-effort; a document that failed to initialize fully
            // should not prevent the wasm core from being freed below.
        }
        try {
            rustCore.free();
        } catch (e) {
            // Already freed.
        }
    }

    return { core, rustCore, resolvePathToNodeIdx, dispose };
}
