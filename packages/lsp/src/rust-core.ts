import init, { PublicDoenetMLCore } from "@doenet/doenetml-worker-rust";
// @ts-expect-error — Vite ?url resolves to a data-URL string at build time
import WASM_BYTES_DATA_URL from "@doenet/doenetml-worker-rust/lib_doenetml_worker_bg.wasm?url";

// Convert data-URL to a blob URL so fetch() works regardless of the
// Worker's origin (data: URLs lack a usable base for relative fetches).
let wasmBlobUrl: string = WASM_BYTES_DATA_URL;
let createdWasmBlobUrl = false;
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
        createdWasmBlobUrl = true;
    }
} catch (e) {
    console.warn("Error while creating blob URL for wasm bundle", e);
}

let wasmBlobUrlRevoked = false;

function revokeWasmBlobUrlIfNeeded() {
    if (!createdWasmBlobUrl || wasmBlobUrlRevoked) {
        return;
    }
    URL.revokeObjectURL(wasmBlobUrl);
    wasmBlobUrlRevoked = true;
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
        function stripQueryAndHash(value: string) {
            return value.replace(/[?#].*$/, "");
        }

        const nodeProcess = getNodeProcess();
        const runningInNode = !!nodeProcess?.versions?.node;
        const normalizedForGate = stripQueryAndHash(wasmBlobUrl);
        const looksLikeWindowsAbsPath = /^[A-Za-z]:[\\/]/.test(
            normalizedForGate,
        );
        const canTryFsPath =
            runningInNode &&
            (normalizedForGate.startsWith("/") ||
                normalizedForGate.startsWith("file://") ||
                looksLikeWindowsAbsPath);
        if (!canTryFsPath) {
            throw error;
        }

        // In Node-based test runners, Vite may resolve `?url` as a
        // non-fetchable path-like string (e.g. `/packages/...wasm` or
        // `/@fs/<absolute-path>`). Load bytes from disk in that case.
        // @ts-expect-error Node-only import in a browser-targeted package.
        const fs = await import("node:fs/promises");
        // @ts-expect-error Node-only import in a browser-targeted package.
        const path = await import("node:path");
        // @ts-expect-error Node-only import in a browser-targeted package.
        const { fileURLToPath } = await import("node:url");

        const normalized = stripQueryAndHash(wasmBlobUrl);
        const candidatePaths: string[] = [];

        if (normalized.startsWith("file://")) {
            // Use fileURLToPath so that Windows file:///C:/... URLs are
            // converted to C:\... rather than /C:/... (which fs.readFile
            // cannot open on Windows).
            const fromFileUrl = fileURLToPath(normalized);
            if (fromFileUrl) {
                candidatePaths.push(fromFileUrl);
            }
        } else if (normalized.startsWith("/@fs/")) {
            const fspath = normalized.slice("/@fs".length);
            candidatePaths.push(
                /^\/[A-Za-z]:/.test(fspath) ? fspath.slice(1) : fspath,
            );
        } else if (path.isAbsolute(normalized)) {
            // Some runners surface workspace-root-relative paths like
            // `/packages/...` rather than absolute filesystem paths.
            candidatePaths.push(normalized);
            candidatePaths.push(
                path.resolve(nodeProcess.cwd(), `.${normalized}`),
            );
        }

        for (const wasmPath of candidatePaths) {
            try {
                const wasmBytes = await fs.readFile(wasmPath);
                await init(wasmBytes);
                return;
            } catch {
                // Try the next candidate path.
            }
        }

        throw error;
    } finally {
        // The module is initialized once per worker runtime, so this blob URL
        // is no longer needed after the first init attempt completes.
        revokeWasmBlobUrlIfNeeded();
    }
}

/**
 * Lazily initialize the WASM module once per worker runtime.
 */
async function ensureRustWasmInitialized(): Promise<void> {
    if (!wasmInitPromise) {
        wasmInitPromise = initWasmWithNodePathWorkaround();
    }
    await wasmInitPromise;
}

/**
 * Lazily initialize the WASM module and return a fresh
 * `PublicDoenetMLCore` instance for each caller.
 *
 * Important: this intentionally does NOT return a global core singleton.
 * The LSP keeps one adapter/core per open document so Rust-side source state
 * and JS-side index mappings stay aligned in multi-document sessions.
 */
export async function getRustCore(): Promise<PublicDoenetMLCore> {
    await ensureRustWasmInitialized();
    const core = PublicDoenetMLCore.new();
    // Flags must be set before the core can process source.
    // An empty flags object is sufficient for path resolution.
    core.set_flags("{}");
    return core;
}
