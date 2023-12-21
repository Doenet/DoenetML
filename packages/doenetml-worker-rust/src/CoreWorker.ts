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

    async setSource(args: { source: string; dast: DastRoot }) {
        if (!this.wasm_initialized) {
            await init();
            this.wasm_initialized = true;
        }

        if (!this.doenetCore) {
            this.doenetCore = PublicDoenetMLCore.new();
        }

        this.doenetCore.set_source(JSON.stringify(args.dast), args.source);
        this.source_set = true;
    }

    async setFlags(args: { flags: Flags }) {
        if (!this.wasm_initialized) {
            await init();
            this.wasm_initialized = true;
        }

        if (!this.doenetCore) {
            this.doenetCore = PublicDoenetMLCore.new();
        }

        this.doenetCore.set_flags(JSON.stringify(args.flags));
        this.flags_set = true;
    }

    async returnDast() {
        if (!this.source_set || !this.flags_set || !this.doenetCore) {
            throw Error("Cannot return dast before setting source and flags");
        }

        try {
            return JSON.parse(this.doenetCore.return_dast()) as FlatDastRoot;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async terminate() {
        console.log("CoreWorker.terminate");

        // TODO: need to call terminate on doenetCore
        // so that it can attempt to send final state (to allow it to be saved)
        // before terminating

        this.doenetCore?.free();
        this.doenetCore = undefined;

        // Since we store source and flags in doenetCore,
        // we lose source and flags when terminating it.
        this.source_set = false;
        this.flags_set = false;
    }
}

// We are exporting `void`, but we have to export _something_ to get the module to work correctly
export default Comlink.expose(new CoreWorker());
