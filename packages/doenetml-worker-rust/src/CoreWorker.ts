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

interface SetSourceInstruction {
    type: "set_source";
    source: string;
    dast: DastRoot;
    core_worker: CoreWorker;
    resolve: Function;
    reject: Function;
}

interface SetFlagsInstruction {
    type: "set_flags";
    flags: Flags;
    core_worker: CoreWorker;
    resolve: Function;
    reject: Function;
}

interface ReturnDastInstruction {
    type: "return_dast";
    core_worker: CoreWorker;
    resolve: Function;
    reject: Function;
}

interface TerminateInstruction {
    type: "terminate";
    core_worker: CoreWorker;
    resolve: Function;
    reject: Function;
}

let instruction_queue: (
    | SetSourceInstruction
    | SetFlagsInstruction
    | ReturnDastInstruction
    | TerminateInstruction
)[] = [];
let processing_instruction = false;

export class CoreWorker {
    doenetCore?: PublicDoenetMLCore;
    wasm_initialized = false;
    source_set = false;
    flags_set = false;

    setSource(args: { source: string; dast: DastRoot }) {
        return new Promise((resolve, reject) => {
            instruction_queue.push({
                type: "set_source",
                source: args.source,
                dast: args.dast,
                core_worker: this,
                resolve,
                reject,
            } as SetSourceInstruction);

            if (!processing_instruction) {
                processing_instruction = true;
                executeInstructions();
            }
        });
    }

    setFlags(args: { flags: Flags }) {
        return new Promise((resolve, reject) => {
            instruction_queue.push({
                type: "set_flags",
                flags: args.flags,
                core_worker: this,
                resolve,
                reject,
            } as SetFlagsInstruction);

            if (!processing_instruction) {
                processing_instruction = true;
                executeInstructions();
            }
        });
    }

    returnDast() {
        return new Promise((resolve, reject) => {
            instruction_queue.push({
                type: "return_dast",
                core_worker: this,
                resolve,
                reject,
            } as ReturnDastInstruction);

            if (!processing_instruction) {
                processing_instruction = true;
                executeInstructions();
            }
        });
    }

    terminate() {
        return new Promise((resolve, reject) => {
            instruction_queue.push({
                type: "terminate",
                core_worker: this,
                resolve,
                reject,
            } as TerminateInstruction);

            if (!processing_instruction) {
                processing_instruction = true;
                executeInstructions();
            }
        });
    }
}

async function executeInstructions() {
    while (instruction_queue.length > 0) {
        let next_instruction = instruction_queue.splice(0, 1)[0];

        if (next_instruction.type === "set_source") {
            await executeSetSource(next_instruction);
            next_instruction.resolve();
        } else if (next_instruction.type === "set_flags") {
            await executeSetFlags(next_instruction);
            next_instruction.resolve();
        } else if (next_instruction.type === "return_dast") {
            let dast = await executeReturnDast(next_instruction);
            next_instruction.resolve(dast);
        } else if (next_instruction.type === "terminate") {
            await executeTerminate(next_instruction);
            next_instruction.resolve();
        }
    }

    processing_instruction = false;
}

async function executeSetSource(instruction: SetSourceInstruction) {
    let worker = instruction.core_worker;

    if (!worker.wasm_initialized) {
        await init();
        worker.wasm_initialized = true;
    }

    if (!worker.doenetCore) {
        worker.doenetCore = PublicDoenetMLCore.new();
    }

    worker.doenetCore.set_source(
        JSON.stringify(instruction.dast),
        instruction.source,
    );
    worker.source_set = true;
}

async function executeSetFlags(instruction: SetFlagsInstruction) {
    let worker = instruction.core_worker;

    if (!worker.wasm_initialized) {
        await init();
        worker.wasm_initialized = true;
    }

    if (!worker.doenetCore) {
        worker.doenetCore = PublicDoenetMLCore.new();
    }

    worker.doenetCore.set_flags(JSON.stringify(instruction.flags));
    worker.flags_set = true;
}

async function executeReturnDast(instruction: ReturnDastInstruction) {
    let worker = instruction.core_worker;
    if (!worker.source_set || !worker.flags_set || !worker.doenetCore) {
        throw Error("Cannot return dast before setting source and flags");
    }

    try {
        return JSON.parse(worker.doenetCore.return_dast()) as FlatDastRoot;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function executeTerminate(instruction: TerminateInstruction) {
    let worker = instruction.core_worker;

    // TODO: need to call terminate on doenetCore
    // so that it can attempt to send final state (to allow it to be saved)
    // before terminating

    worker.doenetCore?.free();
    worker.doenetCore = undefined;

    // Since we store source and flags in doenetCore,
    // we lose source and flags when terminating it.
    worker.source_set = false;
    worker.flags_set = false;
}

// We are exporting `void`, but we have to export _something_ to get the module to work correctly
export default Comlink.expose(new CoreWorker());
