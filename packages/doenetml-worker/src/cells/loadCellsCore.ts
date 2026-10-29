/**
 * The cells core's wasm, instantiated once per worker, and only when a cells
 * core is first loaded (ADR 0020). The glue is bundled into the worker; the
 * `.wasm` is fetched from beside the worker script, as the Rust core's is (see
 * `../wasmLoading.ts`).
 */
import init, { Core } from "@doenet/cells-core/pkg/cells_wasm.js";
import type { DastRoot } from "@doenet/parser";
import { resolveWasmInput } from "../wasmLoading";
import { CellsBridge } from "./bridge";

export const CELLS_WASM_FILE_NAME = "cells_wasm_bg.wasm";

let memoryPromise: Promise<WebAssembly.Memory> | null = null;

/** Instantiate the cells core's wasm, once; `wasm` overrides where it comes
 * from (the bytes, in a test). */
export function initCellsCore(
    wasm?: BufferSource | WebAssembly.Module,
): Promise<WebAssembly.Memory> {
    if (!memoryPromise) {
        // Cleared on failure, so a later load can retry the fetch.
        memoryPromise = (async () => {
            const input =
                wasm ?? (await resolveWasmInput(CELLS_WASM_FILE_NAME));
            const output = await init({ module_or_path: input });
            return output.memory;
        })().catch((e) => {
            memoryPromise = null;
            throw e;
        });
    }
    return memoryPromise;
}

/** Load a document's normalized DAST into a new cells core, behind a bridge. */
export async function loadCellsDocument(
    dast: DastRoot,
    seed = 0,
): Promise<CellsBridge> {
    const memory = await initCellsCore();
    const start = performance.now();
    const bytes = new TextEncoder().encode(JSON.stringify(dast));
    const encoded = performance.now();
    const core = Core.with_seed(bytes, seed);
    const loaded = performance.now();
    const bridge = new CellsBridge(core, memory);
    bridge.loadTiming.encode = encoded - start;
    bridge.loadTiming.core = loaded - encoded;
    bridge.loadTiming.bridge = performance.now() - loaded;
    return bridge;
}
