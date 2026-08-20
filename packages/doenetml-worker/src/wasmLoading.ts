/**
 * Locating the core WASM (#1438).
 *
 * The WASM is not inlined into the worker bundle. It is published as
 * `lib_doenetml_worker_bg.wasm` beside the worker script and fetched at run
 * time, so the browser's machine-code cache — keyed by URL for streaming
 * compilation — lets every worker, iframe, and repeat page view on a host
 * share one compilation instead of each decoding and compiling its own
 * ~6.5 MB copy. Which source is used depends on how the worker was started;
 * the first available step of this ladder wins:
 *
 * 1. `self.__doenetWorkerWasmUrl` — set (before the worker script runs) by
 *    consumers that need a single-file worker with no network access:
 *    @doenet/doenetml's inline-worker entry and the VS Code extension bake
 *    the WASM in as a `data:` URL, which is decoded to bytes here and handed
 *    straight to wasm-bindgen. Fetching data:/blob: URLs is blocked in VS
 *    Code's web extension host (#1375), so a `data:` URL is never fetched.
 *    Dev servers set it to a served asset URL instead, which is fetched.
 * 2. The file beside `self.__doenetWorkerScriptUrl` — set by the same-origin
 *    bootstrap blobs that `importScripts()` a cross-origin worker
 *    (@doenet/doenetml's external-worker entry, @doenet/doenetml-iframe's
 *    shared pool). Such a worker runs from a `blob:` URL that nothing can be
 *    resolved against, so the bootstrap records the real script URL.
 * 3. The file beside `location.href` — a worker started directly from a real
 *    URL (e.g. a same-origin `/doenetml-worker/index.js`, as local dev
 *    servers and the Cypress previews serve it).
 * 4. A jsDelivr URL pinned to the `@doenet/standalone` release the worker
 *    was built as (the published packages version together, and that package
 *    carries the deployed copy of the worker directory). This is the last
 *    resort for a worker with no usable URL of its own; jsDelivr serves the
 *    CORS headers a cross-origin fetch needs. Steps 1–3 cover local dev, CI,
 *    and every packaged consumer, so no test or offline environment reaches
 *    it.
 *
 * A fetched `Response` is handed to wasm-bindgen's `init`, which compiles it
 * with `WebAssembly.instantiateStreaming` and falls back to compiling the
 * raw bytes when the server serves the file without the `application/wasm`
 * MIME type that streaming compilation requires (Firefox enforces this). A
 * response carrying `text/html` — what a single-page app's catch-all route
 * answers for a path with no file behind it — is treated as a fetch miss
 * instead, so a host with no sibling copy still falls through to the CDN
 * step.
 */

const WASM_FILE_NAME = "lib_doenetml_worker_bg.wasm";

// Injected by the vite configs from `packages/standalone/package.json`.
declare const __DOENET_STANDALONE_VERSION__: string;

/** Read a global set by the code that started this worker, if any. */
function injectedGlobal(name: string): string | undefined {
    const value = (globalThis as Record<string, unknown>)[name];
    return typeof value === "string" ? value : undefined;
}

/** Decode a base64 `data:` URL to bytes, or `null` if it cannot be decoded. */
export function decodeWasmDataUrl(dataUrl: string): ArrayBuffer | null {
    try {
        const base64 = dataUrl.split(",")[1];
        const byteCharacters = atob(base64);
        const wasmBytes = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            wasmBytes[i] = byteCharacters.charCodeAt(i);
        }
        return wasmBytes.buffer;
    } catch (e) {
        console.warn("Error while decoding the WASM data URL:", e);
        return null;
    }
}

/**
 * The URLs to try fetching the WASM from, in order — the ladder above, minus
 * the decoded-bytes case handled in `resolveWasmInput`.
 */
export function wasmUrlCandidates(): string[] {
    const candidates: string[] = [];
    function push(url: string) {
        if (!candidates.includes(url)) {
            candidates.push(url);
        }
    }
    const provided = injectedGlobal("__doenetWorkerWasmUrl");
    if (provided !== undefined) {
        push(provided);
    }
    const bases = [
        injectedGlobal("__doenetWorkerScriptUrl"),
        typeof location !== "undefined" ? location.href : undefined,
    ];
    for (const base of bases) {
        if (base === undefined) {
            continue;
        }
        try {
            push(new URL(WASM_FILE_NAME, base).href);
        } catch {
            // An opaque base (`blob:`, `data:`) has no "beside it".
        }
    }
    push(
        `https://cdn.jsdelivr.net/npm/@doenet/standalone@${__DOENET_STANDALONE_VERSION__}/doenetml-worker/${WASM_FILE_NAME}`,
    );
    return candidates;
}

/**
 * Resolve the WASM to initialize wasm-bindgen with: decoded bytes when an
 * inlined `data:` URL was supplied, otherwise the response of the first
 * candidate URL that fetches successfully.
 */
export async function resolveWasmInput(): Promise<ArrayBuffer | Response> {
    const provided = injectedGlobal("__doenetWorkerWasmUrl");
    if (provided !== undefined && /^data:.*;base64,/.test(provided)) {
        const bytes = decodeWasmDataUrl(provided);
        if (bytes) {
            return bytes;
        }
        // An undecodable data URL cannot be fetched either; let the ladder
        // try the URL-based candidates.
    }
    let lastError: unknown = undefined;
    for (const url of wasmUrlCandidates()) {
        if (url.startsWith("data:")) {
            continue;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw Error(`HTTP ${response.status} fetching ${url}`);
            }
            // A single-page app's catch-all route answers any path —
            // including a missing `.wasm` — with the app's HTML page and
            // status 200. Treat it as a miss so the ladder moves on to its
            // remaining candidates.
            const contentType = response.headers.get("Content-Type") ?? "";
            if (/^text\/html\b/i.test(contentType)) {
                throw Error(
                    `Fetching ${url} returned ${contentType}, an HTML page rather than WebAssembly`,
                );
            }
            return response;
        } catch (e) {
            lastError = e;
        }
    }
    throw lastError ?? Error("No URL to load the core WASM from");
}
