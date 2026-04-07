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

type NodeProcessLike = {
    cwd(): string;
    versions?: {
        node?: unknown;
    };
};

function getNodeProcess(): NodeProcessLike | undefined {
    return (globalThis as typeof globalThis & { process?: NodeProcessLike })
        .process;
}

async function initWasmWithNodePathWorkaround(): Promise<void> {
    try {
        await init(wasmBlobUrl);
        return;
    } catch (error) {
        const nodeProcess = getNodeProcess();
        const runningInNode = !!nodeProcess?.versions?.node;
        const canTryFsPath = runningInNode && wasmBlobUrl.startsWith("/");
        if (!canTryFsPath) {
            throw error;
        }

        // In Node-based test runners, Vite may resolve `?url` as a
        // workspace-root-relative path (e.g. `/packages/...wasm`) rather
        // than a fetchable URL. Load bytes from disk in that case.
        // @ts-expect-error Node-only import in a browser-targeted package.
        const fs = await import("node:fs/promises");
        // @ts-expect-error Node-only import in a browser-targeted package.
        const path = await import("node:path");
        const wasmPath = path.resolve(nodeProcess.cwd(), `.${wasmBlobUrl}`);
        const wasmBytes = await fs.readFile(wasmPath);
        await init(wasmBytes);
    }
}

/**
 * Lazily initialize the WASM module once per worker runtime.
 */
function ensureRustWasmInitialized(): Promise<void> {
    if (!wasmInitPromise) {
        wasmInitPromise = initWasmWithNodePathWorkaround();
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
