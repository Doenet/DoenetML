import * as Comlink from "comlink";
import init, {
    Action,
    ActionResponse,
    PublicDoenetMLCore,
} from "lib-doenetml-worker-rust";
export type * from "lib-doenetml-worker-rust";
import type { DastRoot, DastElement, DastError } from "@doenet/parser";

type Flags = Record<string, unknown>;

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

        this.doenetCore.set_source(JSON.stringify(args.dast), args.source);
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

    async returnDast() {
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
