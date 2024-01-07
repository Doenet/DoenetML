import * as Comlink from "comlink";
import init, { PublicDoenetMLCore } from "../pkg/doenetml_worker_rust";
import type { DastRoot, DastElement, DastError } from "@doenet/parser";

type Flags = Record<string, unknown>;

export interface FlatDastElement extends Omit<DastElement, "children"> {
    children: (number | string)[];
    data: { id: number };
}
export interface FlatDastRoot {
    type: "root";
    children: number[];
    elements: (FlatDastElement | DastError)[];
    warnings: unknown[];
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
            let flat_dast = JSON.parse(
                this.doenetCore.return_dast(),
            ) as FlatDastRoot;
            resolve();
            return flat_dast;
        } catch (err) {
            resolve();

            console.error(err);
            throw err;
        }
    }

    // TODO: TypeScript for args. Here's is the rust type for the args

    // struct ActionStructure {
    //     componentIdx: usize,
    //     actionName: String,
    //     args: HashMap<String, ArgValue>,
    // }

    // enum ArgValue {
    //     Bool(bool),
    //     Number(serde_json::Number),
    //     NumberArray(Vec<serde_json::Number>),
    //     String(String),
    // }
    async handleAction(args: any) {
        const isProcessingPromise = this.isProcessingPromise;
        let { promise, resolve } = promiseWithResolver();
        this.isProcessingPromise = promise;

        await isProcessingPromise;

        if (!this.source_set || !this.flags_set || !this.doenetCore) {
            throw Error("Cannot handle action before setting source and flags");
        }

        // TODO: handle case if handleAction is called before returnDast

        try {
            // TODO: Do we need to cast flat_dast_element_updates into a TypeScript type
            // like we did for flat_dast, above?

            let flat_dast_element_updates = JSON.parse(
                this.doenetCore.handle_action(args),
            );
            resolve();
            return flat_dast_element_updates;
        } catch (err) {
            resolve();

            console.error(err);
            throw err;
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
