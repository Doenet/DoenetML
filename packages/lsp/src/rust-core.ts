import init, { PublicDoenetMLCore } from "@doenet/doenetml-worker-rust";
// @ts-expect-error — Vite ?url resolves to a data-URL string at build time
import WASM_BYTES_DATA_URL from "@doenet/doenetml-worker-rust/lib_doenetml_worker_bg.wasm?url";

// Convert data-URL to a blob URL so fetch() works regardless of the
// Worker's origin (data: URLs lack a usable base for relative fetches).
let wasmBlobUrl: string = WASM_BYTES_DATA_URL;
try {
    if (wasmBlobUrl.match(/^data:.*;base64,/)) {
        const base64 = wasmBlobUrl.split(",")[1];
        const byteCharacters = atob(base64);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        wasmBlobUrl = URL.createObjectURL(
            new Blob([byteNumbers], { type: "application/wasm" }),
        );
    }
} catch (e) {
    console.warn("Error while creating blob URL for wasm bundle", e);
}

let wasmInitPromise: Promise<unknown> | null = null;

/**
 * Lazily initialize the WASM module once per worker runtime.
 */
function ensureRustWasmInitialized(): Promise<void> {
    if (!wasmInitPromise) {
        wasmInitPromise = init(wasmBlobUrl);
    }
    return wasmInitPromise.then(() => {});
}

/**
 * Lazily initialize the WASM module and return a fresh
 * `PublicDoenetMLCore` instance for each caller.
 *
 * Important: this intentionally does NOT return a global core singleton.
 * The LSP keeps one adapter/core per open document so Rust-side source state
 * and JS-side index mappings stay aligned in multi-document sessions.
 */
export function getRustCore(): Promise<PublicDoenetMLCore> {
    return (async () => {
        await ensureRustWasmInitialized();
        const core = PublicDoenetMLCore.new();
        // Flags must be set before the core can process source.
        // An empty flags object is sufficient for path resolution.
        core.set_flags("{}");
        return core;
    })();
}
