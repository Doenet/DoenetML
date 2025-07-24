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
import { resolvePathImmediatelyToNodeIdx } from "@doenet/debug-hooks";
let wasmBlobUrl: string = WASM_BYTES_DATA_URL;
try {
    // If the URL starts with `data:*;base64,`, then it is a data URL and we want to get
    // the base64 part
    if (wasmBlobUrl.match(/^data:.*;base64,/)) {
        const base64 = wasmBlobUrl.split(",")[1];
        // Create a blob URL from the base64 data
        const byteCharacters = atob(base64);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        wasmBlobUrl = URL.createObjectURL(
            new Blob([byteArray], { type: "application/wasm" }),
        );
    }
} catch (e) {
    console.warn("Error while creating blob URL for wasm bundle", e);
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
export class CoreWorker {
    doenetCore?: PublicDoenetMLCore;
    javascriptCore?: PublicDoenetMLCoreJavascript;
    wasm_initialized = false;
    javascript_initialized = false;
    source_set = false;
    flags_set = false;
    core_type: "rust" | "javascript" = "rust";

    isProcessingPromise = Promise.resolve();

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
                await init(wasmBlobUrl);
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
        }

        resolve();
    }

    async setFlags(args: { flags: Flags }) {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        if (!this.wasm_initialized) {
            await init(wasmBlobUrl);
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

        resolve();
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
    ) {
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
            return await this.javascriptCore?.createCoreGenerateDast(
                args,
                updateRenderersCallback,
                reportScoreAndStateCallback,
                requestAnimationFrame,
                cancelAnimationFrame,
                copyToClipboard,
                sendEvent,
                requestSolutionView,
            );
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
                let flat_dast = this.doenetCore.return_dast();

                console.log("flat_data from rust core", flat_dast);
                return flat_dast;
            }
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            resolve();
        }
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

        const args = {
            coreId: "a",
            cid: null,
            initializeCounters: {},
        };

        let updateInstructions = null;

        // JS core sends most of the dast data with `updateRendersCallback` with `{ init: true }`
        const updateRenderersCallback = (args: any) => {
            if (args.init) {
                updateInstructions = args.updateInstructions;
            }
        };

        // Stub these callbacks for now, which aren't needed if we don't have interactivity
        const reportScoreAndStateCallback = (args: any) => {
            console.log("reportScoreAndStateCallback", args);
        };
        const requestAnimationFrame = (args: any) => {
            console.log("requestAnimationFrame", args);
        };
        const cancelAnimationFrame = (args: any) => {
            console.log("cancelAnimationFrame", args);
        };
        const copyToClipboard = (args: any) => {
            console.log("copyToClipboard", args);
        };
        const sendEvent = (args: any) => {
            console.log("sendEvent", args);
        };
        const requestSolutionView = (args: any) => {
            console.log("requestSolutionView", args);
            return Promise.resolve({ allowView: true });
        };

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
