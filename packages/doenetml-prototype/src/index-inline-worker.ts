export * from "./index";
import { doenetGlobalConfig } from "./global-config";
// @ts-ignore
import workerSource from "@doenet/doenetml-worker/index.js?raw";
// The worker locates its WASM at run time, but a worker booted from a blob
// URL has no URL to locate anything against — so this single-file entry
// supplies it up front via `self.__doenetWorkerWasmUrl` (see the loading
// ladder in @doenet/doenetml-worker's src/wasmLoading.ts). In the library build
// Vite inlines the asset as a `data:` URL; on a dev server it is the served
// asset URL, which the worker fetches same-origin.
// @ts-ignore
import wasmUrl from "@doenet/doenetml-worker/lib_doenetml_worker_bg.wasm?url";

/**
 * The WASM URL to hand the worker. A dev server hands out a root-relative
 * asset URL, and a blob-URL worker has no base to resolve that against, so
 * absolutize it here where the page's URL is known. A `data:` URL is already
 * absolute (and too large to push through `new URL` for nothing).
 */
function absoluteWasmUrl(): string {
    if (wasmUrl.startsWith("data:")) {
        return wasmUrl;
    }
    try {
        return new URL(wasmUrl, globalThis.location?.href).href;
    } catch {
        return wasmUrl;
    }
}

// We make a blob URL directly from the source code of the worker. This way we
// don't need to load any other files.
const workerBlobUrl = URL.createObjectURL(
    new Blob(
        [
            `self.__doenetWorkerWasmUrl = ${JSON.stringify(absoluteWasmUrl())};\n`,
            workerSource,
        ],
        { type: "application/javascript" },
    ),
);
doenetGlobalConfig.doenetWorkerUrl = workerBlobUrl;
