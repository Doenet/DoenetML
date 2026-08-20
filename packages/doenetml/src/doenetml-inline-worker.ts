export * from "./index";
import { doenetGlobalConfig } from "./global-config";
// @ts-ignore
import workerSource from "@doenet/doenetml-worker/index.js?raw";
// The worker locates its WASM at run time (see the loading ladder in
// @doenet/doenetml-worker's src/wasmLoading.ts), but a worker booted from a blob
// URL has no URL to locate anything against — so this single-file entry
// supplies the WASM up front via `self.__doenetWorkerWasmUrl`. The
// `?url&inline` query makes Vite hand the asset over as a `data:` URL on a
// dev server as well as in the library build (`?url` routes a `.wasm` file
// through the asset pipeline, `&inline` forces inlining), so every worker
// booted from this entry decodes the bytes in place and never fetches. That
// is required in VS Code's webviews, where fetching is blocked, and it keeps
// worker boots on dev servers (including Cypress component runs) at memory
// speed — a served asset URL would put a ~6.5 MB fetch on every worker boot.
// @ts-ignore
import wasmUrl from "@doenet/doenetml-worker/lib_doenetml_worker_bg.wasm?url&inline";

// We make a blob URL directly from the source code of the worker. This way we
// don't need to load any other files.
const workerBlobUrl = URL.createObjectURL(
    new Blob(
        [
            `self.__doenetWorkerWasmUrl = ${JSON.stringify(wasmUrl)};\n`,
            workerSource,
        ],
        { type: "application/javascript" },
    ),
);
doenetGlobalConfig.doenetWorkerUrl = workerBlobUrl;
