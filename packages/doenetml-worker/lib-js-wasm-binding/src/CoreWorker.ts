import * as Comlink from "comlink";
import init, {
    Action as _Action,
    ActionResponse,
    ActionsEnum,
    PublicDoenetMLCore,
    DastRoot as DastRootInCore,
} from "lib-doenetml-worker";
export type * from "lib-doenetml-worker";
import type {
    FlatDastRoot,
    DastError,
    FlatDastElement,
} from "lib-doenetml-worker";
import type { DastRoot } from "@doenet/parser";

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
    wasm_initialized = false;
    source_set = false;
    flags_set = false;

    isProcessingPromise = Promise.resolve();

    async setSource(args: { source: string; dast: DastRoot }) {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        if (!this.wasm_initialized) {
            await init();
            this.wasm_initialized = true;
        }

        if (!this.doenetCore) {
            this.doenetCore = PublicDoenetMLCore.new();
        }

        // We need to cast `args.dast` to `DastRootInCore` because
        // a real `DastRoot` allows things like comments and cdata, etc.
        // These are assume to be filtered out by the time we send data to core.
        this.doenetCore.set_source(args.dast as DastRootInCore, args.source);
        this.source_set = true;

        resolve();
    }

    async setFlags(args: { flags: Flags }) {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        if (!this.wasm_initialized) {
            await init();
            this.wasm_initialized = true;
        }

        if (!this.doenetCore) {
            this.doenetCore = PublicDoenetMLCore.new();
        }

        this.doenetCore.set_flags(JSON.stringify(args.flags));
        this.flags_set = true;

        resolve();
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
            let flat_dast = this.doenetCore.return_dast();
            return flat_dast;
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

        resolve();
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
