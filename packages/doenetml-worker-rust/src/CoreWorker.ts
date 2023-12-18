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
    flags: Flags = {};
    dast: DastRoot = { type: "root", children: [] };
    source: string = "";

    // Note: we separate initializeWorker from createCore
    // so that we can call other analysis functions (such as determine variants)
    // even without creating the core.
    // (These analysis functions are not yet implemented)
    async initializeWorker(args: {
        source: string;
        dast: DastRoot;
        flags: Flags;
    }) {
        this.dast = args.dast;
        this.flags = args.flags;
        this.source = args.source;
    }

    async createCore(args: {}) {
        console.log("CoreWorker.createCore", args, this.dast);

        await init();

        try {
            this.doenetCore = PublicDoenetMLCore.new(
                JSON.stringify(this.dast),
                this.source,
                JSON.stringify(this.flags),
            );
        } catch (err) {
            console.error(err);
            throw err;
        }

        return JSON.parse(this.doenetCore.return_dast()) as FlatDastRoot;
    }

    async terminate() {
        console.log("CoreWorker.terminate");
        this.doenetCore?.free();
    }
}

// We are exporting `void`, but we have to export _something_ to get the module to work correctly
export default Comlink.expose(new CoreWorker());
