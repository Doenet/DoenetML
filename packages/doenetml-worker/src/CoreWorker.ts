import * as Comlink from "comlink";
import init, {
    Action as _Action,
    ActionResponse,
    ActionsEnum,
    PublicDoenetMLCore,
    DastRoot as DastRootInCore,
} from "@doenet/doenetml-worker-rust";
// TODO: for some reason `export type * from "@doenet/doenetml-worker-rust";` doesn't work. The generated .d.ts file
// has an incorrect path. As a workaround, we export the types directly from Rust here. Fix this if you can figure out
// why the paths are wrong...
export type * from "lib-doenetml-worker";
import type {
    FlatDastRoot,
    DastError,
    FlatDastElement,
    NormalizedRoot,
    PathToCheck,
    FlatFragment,
    IndexResolution,
    RefResolution,
    ContentVector,
    NodeList,
} from "@doenet/doenetml-worker-rust";
import type { DastRoot } from "@doenet/parser";
import {
    CancelAnimationFrame,
    CopyToClipboard,
    PublicDoenetMLCore as PublicDoenetMLCoreJavascript,
    ReportScoreAndStateCallback,
    RequestAnimationFrame,
    RequestSolutionView,
    SendEvent,
    UpdateRenderersCallback,
} from "@doenet/doenetml-worker-javascript";

// 2025-05-14
// There is some weirdness with CORS/Firefox/Data URLs that makes it so that
// the bundled WASM cannot actually be loaded. To work around this,
// we import it as a string and create a blob URL from it.
// @ts-ignore
import WASM_BYTES_DATA_URL from "@doenet/doenetml-worker-rust/lib_doenetml_worker_bg.wasm?url";
import { flatDastFromJS } from "./flatDastFromJS";
import type { UpdateInstruction } from "./flatDastFromJS";
import {
    collectInstructionMaps,
    flatDastUpdateFromJS,
    seedInstructionMaps,
    type FlatDastElementUpdateFromJS,
} from "./flatDastUpdateFromJS";
import { resolvePathImmediatelyToNodeIdx } from "@doenet/debug-hooks";
import { translateJsCoreActionName } from "./jsCoreActionNames";
// The wasm-bindgen `init` function accepts a `BufferSource` (ArrayBuffer)
// directly — passing the decoded bytes avoids any `fetch()` round-trip and
// works in all environments including VS Code's web-worker extension host
// where `fetch()` is blocked for blob/data URLs (issue #1375).
// Previously, the data URL was converted to a blob URL first (to work around
// CORS/Firefox issues with data URLs), but fetching that blob URL is also
// blocked in VS Code.  Passing the ArrayBuffer directly uses
// `WebAssembly.instantiate(buffer, imports)` inside wasm-bindgen, which
// requires no network access at all.
let wasmInitInput: string | ArrayBuffer = WASM_BYTES_DATA_URL;
if (
    typeof wasmInitInput === "string" &&
    wasmInitInput.match(/^data:.*;base64,/)
) {
    try {
        const base64 = wasmInitInput.split(",")[1];
        const byteCharacters = atob(base64);
        const wasmBytes = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            wasmBytes[i] = byteCharacters.charCodeAt(i);
        }
        wasmInitInput = wasmBytes.buffer;
    } catch (e) {
        console.warn(
            "Error while decoding WASM data URL, falling back to URL (fetch may fail):",
            e,
        );
    }
}

/**
 * The correct type of `FlatDastRoot`. **This should be used instead of
 * `FlatDastRoot`**
 */
export interface FlatDastRootWithErrors extends Omit<FlatDastRoot, "elements"> {
    elements: (DastError | FlatDastElement)[];
}

/**
 * Action type for use with typescript. There are errors with the type
 * exported by `lib-doenetml-worker`, so use this version instead.
 */
export type Action = ActionsEnum & { componentIdx: number };

type Flags = Record<string, unknown>;

// Due to vite issue https://github.com/vitejs/vite/issues/17570 (related: https://github.com/vitejs/vite/issues/12611 )
// vite assumes that globalThis.document is defined and relies on it when creating a WebWorker URL. Since it is not defined
// in a worker itself, we define it here to prevent the error.
// 2024-07-05
if (typeof globalThis !== "undefined" && !globalThis.document) {
    const url = new URL(
        typeof location !== "undefined" ? location.href : "http://localhost",
    );
    const baseUrl = url.protocol + "//" + url.host + url.pathname;
    // @ts-ignore
    globalThis.document = {
        URL: baseUrl,
        baseURI: baseUrl,
    };
}
/**
 * Initialize the WASM module exactly once per worker realm. wasm-bindgen's
 * `init` only guards *completed* initializations (`if (wasm !== undefined)`),
 * so concurrent in-flight calls — which happen when several hosted cores
 * (#1466) boot at once on one worker — would race and instantiate the module
 * multiple times, corrupting the module-level instance the glue points at.
 * Gate every caller behind one shared promise.
 */
let wasmInitPromise: Promise<unknown> | null = null;
function ensureWasmInitialized(): Promise<unknown> {
    if (!wasmInitPromise) {
        wasmInitPromise = init({ module_or_path: wasmInitInput });
    }
    return wasmInitPromise;
}

export class CoreWorker {
    doenetCore?: PublicDoenetMLCore;
    javascriptCore?: PublicDoenetMLCoreJavascript;
    wasm_initialized = false;
    javascript_initialized = false;
    source_set = false;
    flags_set = false;
    core_type: "rust" | "javascript" = "rust";

    /**
     * Buffer of update batches pushed by the JS core's persistent
     * `updateRenderersCallback` (set up during the initial render). Drained by
     * `dispatchActionJavascriptFlat` to build the FlatDast update map.
     */
    _javascriptUpdateBuffer: UpdateInstruction[] = [];
    /**
     * Whether the persistent `updateRenderersCallback` should buffer pushes.
     * Only set while `dispatchActionJavascriptFlat` has an action in flight, so
     * pushes that arrive with no in-flight action (animations, deferred async
     * resolution — which this return-based API does not deliver anyway) are
     * dropped rather than accumulating in `_javascriptUpdateBuffer` unbounded
     * for the core's lifetime.
     */
    _capturingJavascriptUpdates = false;
    /**
     * Map from `componentIdx` to the JS component type/name, retained from the
     * initial render and extended by each update batch. Used to select the
     * JS->Rust prop fixup in `flatDastUpdateFromJS`.
     */
    _componentIdxToName: Record<number, string> = {};
    /**
     * Map from JS string id to `componentIdx`, required by the `ref` fixup.
     * Retained from the initial render and extended by each update batch.
     */
    _doenetIdToComponentIdx: Record<string, number> = {};
    /**
     * Whether `returnFlatDastFromJS` has run, installing the persistent
     * `updateRenderersCallback` and seeding the lookup maps above. Until then,
     * `dispatchActionJavascriptFlat` has no callback to capture pushes and no
     * maps to convert them, so it refuses to run rather than silently
     * returning an empty update map.
     */
    _javascriptInitialRenderDone = false;

    isProcessingPromise = Promise.resolve();

    // --- Multi-core host support (#1466, stream E of #1441) ---------------
    //
    // One worker process can host several independent cores, collapsing the
    // ~104 MB per-worker fixed floor (script eval + WASM) to one copy per
    // page. The worker's default exposed instance doubles as the host: the
    // main thread calls `createCore` with a transferred `MessagePort` and
    // drives the new core over that port with the same Comlink API a
    // dedicated worker would offer. All cores share this worker's WASM
    // instance (wasm-bindgen `init` is idempotent per module scope); each
    // core is a separate `PublicDoenetMLCore` / JS core with its own state.

    /** Cores created via `createCore`, so `destroyCore` can release them. */
    _hostedCores: Map<number, { core: CoreWorker; port: MessagePort }> =
        new Map();
    _nextHostedCoreId = 1;

    /**
     * Create an additional, independent core in this worker and expose it on
     * `port` via Comlink. Returns an id for a later `destroyCore` call.
     */
    async createCore(port: MessagePort): Promise<number> {
        const core = new CoreWorker();
        Comlink.expose(core, port);
        const id = this._nextHostedCoreId++;
        this._hostedCores.set(id, { core, port });
        return id;
    }

    /**
     * Release a core created by `createCore`: give it a graceful
     * `terminate()` (frees the Rust core and JS core), then close its port
     * and drop the reference. Best-effort — a torn-down document must never
     * take its sibling cores with it.
     */
    async destroyCore(id: number) {
        const entry = this._hostedCores.get(id);
        if (!entry) {
            return;
        }
        this._hostedCores.delete(id);
        try {
            await entry.core.terminate();
        } catch (err) {
            console.error("Error terminating hosted core", err);
        } finally {
            entry.port.close();
        }
    }

    setCoreType(core_type: "rust" | "javascript") {
        this.core_type = core_type;
    }

    async setSource(args: { source: string; dast: DastRoot }) {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        try {
            if (!this.wasm_initialized) {
                await ensureWasmInitialized();
                this.wasm_initialized = true;
            }

            if (!this.doenetCore) {
                this.doenetCore = PublicDoenetMLCore.new();
            }
            if (this.core_type === "javascript") {
                if (!this.javascriptCore) {
                    this.javascriptCore = new PublicDoenetMLCoreJavascript();
                }
                this.javascriptCore.setSource(args.source);
            }

            // We need to cast `args.dast` to `DastRootInCore` because
            // a real `DastRoot` allows things like comments and cdata, etc.
            // These are assume to be filtered out by the time we send data to core.
            this.doenetCore.set_source(
                args.dast as DastRootInCore,
                args.source,
            );
            this.source_set = true;
        } catch (err) {
            console.error("Error when setting source", err);
            throw err;
        } finally {
            // Always release the queue, even on a throw (e.g. a transient WASM
            // init failure). Skipping this leaves `isProcessingPromise`
            // unresolved, which permanently deadlocks every later call — and
            // hangs the viewer with no way to recover. See
            // Doenet/DoenetApps#2957.
            resolve();
        }
    }

    async setFlags(args: { flags: Flags }) {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        try {
            if (!this.wasm_initialized) {
                await ensureWasmInitialized();
                this.wasm_initialized = true;
            }

            if (!this.doenetCore) {
                this.doenetCore = PublicDoenetMLCore.new();
            }
            if (this.core_type === "javascript") {
                if (!this.javascriptCore) {
                    this.javascriptCore = new PublicDoenetMLCoreJavascript();
                }
                this.javascriptCore.setFlags(args.flags);
            }

            this.doenetCore.set_flags(JSON.stringify(args.flags));
            this.flags_set = true;
        } finally {
            // Always release the queue, even if WASM init or set_flags throws,
            // so a transient failure doesn't deadlock all later calls
            // (Doenet/DoenetApps#2957).
            resolve();
        }
    }

    async initializeJavascriptCore({
        activityId,
        docId,
        requestedVariantIndex,
        attemptNumber,
    }: {
        activityId: string;
        docId: string;
        requestedVariantIndex: number;
        attemptNumber: number;
    }) {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        if (
            !this.source_set ||
            !this.flags_set ||
            !this.javascriptCore ||
            !this.doenetCore
        ) {
            throw Error(
                "Cannot initialize javascript core before setting source and flags",
            );
        }

        try {
            let normalizedRoot = this.doenetCore.return_normalized_dast_root();

            const doenetCore = this.doenetCore;

            function calculateRootNames() {
                return doenetCore.calculate_root_names();
            }

            function resolvePath(
                path: PathToCheck,
                origin: number,
                skip_parent_search: boolean,
            ): RefResolution {
                return doenetCore.resolve_path(
                    path,
                    origin,
                    skip_parent_search,
                );
            }
            function addNodesToResolver(
                flat_fragment: FlatFragment,
                index_resolution: IndexResolution,
            ) {
                doenetCore.add_nodes_to_resolver(
                    flat_fragment,
                    index_resolution,
                );
            }
            function replaceIndexResolutionsInResolver(
                components: ContentVector,
                index_resolution: IndexResolution,
            ) {
                doenetCore.replace_index_resolutions_in_resolver(
                    components,
                    index_resolution,
                );
            }
            function deleteNodesFromResolver(node_list: NodeList) {
                doenetCore.delete_nodes_from_resolver(node_list);
            }

            const initializedResult =
                await this.javascriptCore.initializeWorker({
                    activityId,
                    docId,
                    requestedVariantIndex,
                    attemptNumber,
                    normalizedRoot,
                    addNodesToResolver,
                    replaceIndexResolutionsInResolver,
                    deleteNodesFromResolver,
                    resolvePath,
                    calculateRootNames,
                });
            this.javascript_initialized = true;
            // The JavaScript core has consumed the normalized DAST; free the
            // Rust core's retained copy of the document DAST (the rust
            // core-type path still needs it for later
            // `returnNormalizedDastRoot` calls, so only release here).
            this.doenetCore.release_initialization_data();
            return initializedResult;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            resolve();
        }
    }

    async generateJavascriptDast(
        args: {
            coreId: string;
            userId?: string;
            cid: string | null;
            theme?: "dark" | "light";
            requestedVariant?: Record<string, any>;
            stateVariableChanges?: string;
            initializeCounters: Record<string, number>;
        },
        updateRenderersCallback: UpdateRenderersCallback,
        reportScoreAndStateCallback: ReportScoreAndStateCallback,
        requestAnimationFrame: RequestAnimationFrame,
        cancelAnimationFrame: CancelAnimationFrame,
        copyToClipboard: CopyToClipboard,
        sendEvent: SendEvent,
        requestSolutionView: RequestSolutionView,
    ): Promise<
        | (FlatDastRootWithErrors & {
              success: true;
              [key: string]: any;
          })
        | { success: false; errMsg: string; coreId?: string }
    > {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        if (!this.javascript_initialized || !this.javascriptCore) {
            throw Error(
                "Cannot return javascript dast before initializing javascript core",
            );
        }

        try {
            return (await this.javascriptCore?.createCoreGenerateDast(
                args,
                updateRenderersCallback,
                reportScoreAndStateCallback,
                requestAnimationFrame,
                cancelAnimationFrame,
                copyToClipboard,
                sendEvent,
                requestSolutionView,
            )) as any;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            resolve();
        }
    }

    async returnDast(): Promise<FlatDastRootWithErrors> {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        if (!this.source_set || !this.flags_set || !this.doenetCore) {
            throw Error("Cannot return dast before setting source and flags");
        }

        try {
            if (this.core_type === "javascript") {
                return await this.returnFlatDastFromJS();
            } else {
                return this.doenetCore.return_dast();
            }
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            resolve();
        }
    }

    /**
     * Return the pre-expansion normalized DAST (every source element keeps its
     * resolver-known id even when its expansion errors).  Used by the LSP's
     * `RustResolverAdapter` to map reference-making composites like
     * `<module copy="$x">` that would otherwise be replaced with id-less error
     * entries in the post-expansion `returnDast` output (#1154).
     */
    async returnNormalizedDastRoot() {
        if (!this.source_set || !this.doenetCore) {
            throw Error(
                "Cannot return normalized dast root before setting source",
            );
        }
        if (this.core_type === "javascript") {
            // The JS core doesn't expose a normalized DAST today; the LSP's
            // resolver path uses the rust core, so this is unreachable for
            // resolver consumers — return the minimal shape consumers expect.
            return { nodes: [] };
        }
        return this.doenetCore.return_normalized_dast_root();
    }

    /**
     * Transform the initial output of the JavaScript core into the flat data structure
     * produces by the rust core and expected by the `doenetml-prototype`
     */
    private async returnFlatDastFromJS() {
        if (!this.javascriptCore || !this.doenetCore) {
            throw Error("Cannot return dast before setting source and flags");
        }

        let normalizedRoot = this.doenetCore.return_normalized_dast_root();
        const doenetCore = this.doenetCore;

        function calculateRootNames() {
            return doenetCore.calculate_root_names();
        }

        function resolvePath(
            path: PathToCheck,
            origin: number,
            skip_parent_search: boolean,
        ): RefResolution {
            return doenetCore.resolve_path(path, origin, skip_parent_search);
        }
        function addNodesToResolver(
            flat_fragment: FlatFragment,
            index_resolution: IndexResolution,
        ) {
            doenetCore.add_nodes_to_resolver(flat_fragment, index_resolution);
        }
        function replaceIndexResolutionsInResolver(
            components: ContentVector,
            index_resolution: IndexResolution,
        ) {
            doenetCore.replace_index_resolutions_in_resolver(
                components,
                index_resolution,
            );
        }
        function deleteNodesFromResolver(node_list: NodeList) {
            doenetCore.delete_nodes_from_resolver(node_list);
        }

        await this.javascriptCore.initializeWorker({
            activityId: "a",
            docId: "a",
            requestedVariantIndex: 1,
            attemptNumber: 1,
            normalizedRoot,
            addNodesToResolver,
            replaceIndexResolutionsInResolver,
            deleteNodesFromResolver,
            resolvePath,
            calculateRootNames,
        });
        this.javascript_initialized = true;
        // The JavaScript core has consumed the normalized DAST; free the
        // Rust core's retained copy of the document DAST (the rust core-type
        // path still needs it for later `returnNormalizedDastRoot` calls, so
        // only release here).
        this.doenetCore.release_initialization_data();

        const args = {
            coreId: "a",
            cid: null,
            initializeCounters: {},
        };

        let updateInstructions = null;

        // The JS core pushes renderer updates through `updateRenderersCallback`.
        // The initial render arrives once with `{ init: true }`; every later
        // batch (e.g. triggered by `requestAction`) is appended to a buffer that
        // `dispatchActionJavascriptFlat` drains. This callback is installed once
        // on the persistent core, so it keeps receiving pushes for the core's
        // lifetime; later batches are only buffered while an action is in flight
        // (`_capturingJavascriptUpdates`) so out-of-action pushes don't grow the
        // buffer without bound.
        this._javascriptUpdateBuffer = [];
        const updateRenderersCallback = (args: any) => {
            if (args.init) {
                updateInstructions = args.updateInstructions;
            } else if (
                this._capturingJavascriptUpdates &&
                args.updateInstructions
            ) {
                this._javascriptUpdateBuffer.push(...args.updateInstructions);
            }
        };

        // No-op stubs for callbacks that aren't needed in non-interactive contexts
        // (e.g. pretext export). The core requires these to be functions.
        const reportScoreAndStateCallback = (_args: any) => {};
        const requestAnimationFrame = (_args: any) => {};
        const cancelAnimationFrame = (_args: any) => {};
        const copyToClipboard = (_args: any) => {};
        const sendEvent = (_args: any) => {};
        const requestSolutionView = (_args: any) =>
            Promise.resolve({ allowView: true });

        const coreResult = await this.javascriptCore.createCoreGenerateDast(
            args,
            updateRenderersCallback,
            reportScoreAndStateCallback,
            requestAnimationFrame,
            cancelAnimationFrame,
            copyToClipboard,
            sendEvent,
            requestSolutionView,
        );

        if (!coreResult.success) {
            console.error(coreResult.errMsg);
            throw Error(coreResult.errMsg);
        }

        if (updateInstructions === null) {
            throw Error(
                "Need to address case where do not get updateRenderersCallback before dast",
            );
        }

        const documentToRender = coreResult.coreInfo.documentToRender;

        // Retain the maps that `flatDastUpdateFromJS` needs (element-type lookup
        // for fixups and the `ref` referent lookup), seeded with the document
        // root and extended with every component in the initial render.
        const { componentIdxToName, doenetIdToComponentIdx } =
            seedInstructionMaps(documentToRender, updateInstructions);
        this._componentIdxToName = componentIdxToName;
        this._doenetIdToComponentIdx = doenetIdToComponentIdx;
        this._javascriptInitialRenderDone = true;

        const flat_dast = flatDastFromJS(documentToRender, updateInstructions);
        return flat_dast;
    }

    /**
     * Dispatch the action `actionName` of `componentIdx` to the Javascript core,
     * which will execute that action and return the result.
     */
    async dispatchActionJavascript(actionArgs: {
        actionName: string;
        componentIdx: number | undefined;
        args: Record<string, any>;
    }) {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        if (!this.source_set || !this.flags_set || !this.javascriptCore) {
            throw Error("Cannot handle action before setting source and flags");
        }

        // TODO: handle case if dispatchAction is called before returnDast

        try {
            return await this.javascriptCore.requestAction(actionArgs);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            resolve();
        }
    }

    /**
     * Dispatch the action `actionName` of `componentIdx` to the JavaScript core
     * and return the resulting FlatDast update map, matching the shape returned
     * by the rust core's `dispatchAction` (`ActionResponse["payload"]`).
     *
     * The JS core uses a push model: `requestAction` resolves with only
     * `{ actionId }`, while the actual renderer updates are pushed
     * asynchronously through the persistent `updateRenderersCallback` installed
     * during the initial render (see `returnFlatDastFromJS`). This method
     * bridges that push model to the prototype's pull-based `dispatchAction`
     * thunk: it clears the update buffer, awaits the action, then drains and
     * converts the buffered batches via `flatDastUpdateFromJS`.
     *
     * Requires the initial render (`returnFlatDastFromJS`, via `returnDast`) to
     * have run first — that is what installs the persistent callback and seeds
     * the lookup maps; otherwise this throws rather than returning an empty map.
     *
     * Known gaps (acceptable for this milestone):
     * - Updates that arrive with no in-flight action (animations, deferred async
     *   resolution) are not delivered by this return-based API. The persistent
     *   callback only buffers while an action is in flight, so such pushes are
     *   dropped rather than buffered.
     * - `requestAction` resolving does not guarantee every async renderer push
     *   has flushed; only synchronously-available batches are drained.
     */
    async dispatchActionJavascriptFlat(actionArgs: {
        actionName: string;
        componentIdx: number | undefined;
        args: Record<string, any>;
    }): Promise<Record<number, FlatDastElementUpdateFromJS>> {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        try {
            if (!this.source_set || !this.flags_set || !this.javascriptCore) {
                throw Error(
                    "Cannot handle action before setting source and flags",
                );
            }
            if (!this._javascriptInitialRenderDone) {
                // The persistent update callback and the lookup maps are
                // installed by `returnFlatDastFromJS`; without them this method
                // would capture nothing and return an empty update map.
                throw Error(
                    "Cannot dispatch a flat action before the initial render (returnDast) has run",
                );
            }

            this._javascriptUpdateBuffer = [];
            this._capturingJavascriptUpdates = true;

            // Translate the prototype's rust action name to the JS core's name
            // when they differ (e.g. point `move` -> `movePoint`).
            const componentType =
                actionArgs.componentIdx != null
                    ? this._componentIdxToName[actionArgs.componentIdx]
                    : undefined;
            const translatedActionName = translateJsCoreActionName(
                componentType,
                actionArgs.actionName,
            );

            const actionResult = await this.javascriptCore.requestAction({
                ...actionArgs,
                actionName: translatedActionName,
            });

            // `requestAction` reports failures by returning `{ success: false,
            // errMsg }` rather than throwing, so surface them instead of
            // silently returning an empty update map.
            if (
                actionResult &&
                typeof actionResult === "object" &&
                "success" in actionResult &&
                actionResult.success === false
            ) {
                const actionLabel =
                    translatedActionName === actionArgs.actionName
                        ? `"${actionArgs.actionName}"`
                        : `"${actionArgs.actionName}" (translated to "${translatedActionName}")`;
                throw Error(
                    `Action ${actionLabel} failed: ${
                        actionResult.errMsg ?? "unknown error"
                    }`,
                );
            }

            // Disable capture and snapshot+clear the buffer as one synchronous
            // unit. There is no `await` between these statements, so no
            // `updateRenderersCallback` push can interleave: turning capture off
            // first guarantees a push can never land in the fresh buffer before
            // we stop accepting, while the snapshot still holds everything that
            // accumulated during `requestAction`. (Pushes that arrive on later
            // ticks, after capture is off, are the documented animation/async
            // gap and are intentionally not delivered by this return-based API.)
            this._capturingJavascriptUpdates = false;
            const batches = this._javascriptUpdateBuffer;
            this._javascriptUpdateBuffer = [];

            // Keep the lookup maps current in case the action introduced new
            // components, then convert the drained batches into the update map.
            collectInstructionMaps(
                batches,
                this._componentIdxToName,
                this._doenetIdToComponentIdx,
            );

            return flatDastUpdateFromJS(
                batches,
                this._componentIdxToName,
                this._doenetIdToComponentIdx,
            );
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            this._capturingJavascriptUpdates = false;
            resolve();
        }
    }

    /**
     * Resolve `path` to a node, starting the search from node `origin` and
     * following the DoenetML core's name-scoping rules.  Used by the language
     * server to back `$ref` / `$ref.member` autocomplete.
     *
     * `setSource` and `setFlags` must have run first: like `dispatchAction`
     * and `returnDast`, this throws otherwise rather than resolving against an
     * empty core (which would yield confusing Rust-side panics).
     *
     * By default the search recurses into `origin`'s ancestor scopes to match
     * the first path segment; set `skipParentSearch` to search only
     * descendants of `origin` instead.
     */
    async resolvePath(args: {
        path: PathToCheck;
        origin: number;
        skipParentSearch: boolean;
    }): Promise<RefResolution> {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        if (!this.source_set || !this.flags_set || !this.doenetCore) {
            throw Error(
                "Cannot resolve a path before setting source and flags",
            );
        }

        try {
            return this.doenetCore.resolve_path(
                args.path,
                args.origin,
                args.skipParentSearch,
            );
        } finally {
            resolve();
        }
    }

    async dispatchAction(action: Action): Promise<ActionResponse> {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        if (!this.source_set || !this.flags_set || !this.doenetCore) {
            throw Error("Cannot handle action before setting source and flags");
        }

        // TODO: handle case if dispatchAction is called before returnDast

        try {
            let flat_dast_element_updates =
                this.doenetCore.dispatch_action(action);
            return flat_dast_element_updates;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            resolve();
        }
    }

    /**
     * Attempt to resolve `path` immediately by forcibly resolving any composite components required
     * to determine the ref resolution. If the path is resolved to a node index without any unresolved path left,
     * then return the node index. Otherwise return -1.
     *
     * By default, the search for the path begins at the document root, node 0. Specify a node index for `origin`
     * to change where the search begins.
     *
     * By default, the search begins by recursing to the parents of `origin` to match the first part of the path.
     * Specify `skip_parent_search` to bypass that stage and only search descendants of `origin`.
     *
     * At present, this function is implemented only for string indices within the path.
     * An error is thrown if the index of a path contains any references to other nodes.
     */
    async resolvePathJavascript(name: string, origin = 0) {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        if (
            !this.source_set ||
            !this.flags_set ||
            !this.doenetCore ||
            !this.javascriptCore
        ) {
            throw Error("Cannot resolve path before setting source and flags");
        }

        try {
            let nodeIdx = await resolvePathImmediatelyToNodeIdx(
                name,
                this.doenetCore,
                this.javascriptCore,
                origin,
            );
            return nodeIdx;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            resolve();
        }
    }

    async terminate() {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        // TODO: need to call terminate on doenetCore
        // so that it can attempt to send final state (to allow it to be saved)
        // before terminating

        this.doenetCore?.free();
        this.doenetCore = undefined;

        // Since we store source and flags in doenetCore,
        // we lose source and flags when terminating it.
        this.source_set = false;
        this.flags_set = false;

        if (this.javascriptCore) {
            try {
                await this.javascriptCore.terminate();
            } catch (err) {
                console.error(err);
                throw err;
            } finally {
                resolve();
            }
        } else {
            resolve();
        }

        // Terminate the worker itself
        close();
    }

    async returnAllStateVariables(consoleLogComponents = false) {
        if (this.javascriptCore) {
            return this.javascriptCore.returnAllStateVariables(
                consoleLogComponents,
            );
        } else {
            return {};
        }
    }

    // Turn on or off recording of the visibility of document components,
    // depending if the document itself is visible
    handleVisibilityChange(documentIsVisible: boolean) {
        if (this.javascriptCore) {
            this.javascriptCore.handleVisibilityChange(documentIsVisible);
        }
    }

    /**
     * Call submitAnswer on all answers in the document
     */
    async submitAllAnswers() {
        if (this.javascriptCore) {
            this.javascriptCore.submitAllAnswers();
        }
    }

    /**
     * Immediately save all document state to the database,
     * ignoring any timeouts
     */
    async saveImmediately() {
        if (this.javascriptCore) {
            this.javascriptCore.saveImmediately();
        }
    }

    async _getTests() {
        // This function is only used in a testing environment
        // and so doesn't need the usual amount of caution.
        return this.doenetCore?._get_tests();
    }

    async _runTest(testName: string) {
        // This function is only used in a testing environment
        // and so doesn't need the usual amount of caution.
        return this.doenetCore?._run_test(testName);
    }
}

function promiseWithResolver() {
    let resolve: (value: void) => void;
    let reject: (reason: unknown) => void;
    const promise: Promise<void> = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve: resolve!, reject: reject! };
}

// We are exporting `void`, but we have to export _something_ to get the module to work correctly
export default Comlink.expose(new CoreWorker());
