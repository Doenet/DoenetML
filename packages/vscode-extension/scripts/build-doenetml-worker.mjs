/**
 * Assemble the single-file core worker the extension ships at
 * `extension/build/doenetml-worker/index.js`.
 *
 * The built worker in `@doenet/doenetml-worker` no longer carries its WASM —
 * it locates it at run time (see the loading ladder in that package's
 * `src/wasmLoading.ts`). The extension's copy must work with no network access at
 * all: the LSP boots it from a blob URL inside VS Code's web extension host,
 * where fetching is blocked. So this script bakes the WASM back in, as a
 * `data:` URL assigned to `self.__doenetWorkerWasmUrl` ahead of the worker
 * source — the ladder's first step, which decodes it to bytes without any
 * fetch.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
const workerDist = path.resolve(packageRoot, "../doenetml-worker/dist");
const outDir = path.join(packageRoot, "extension/build/doenetml-worker");

const wasmBase64 = fs
    .readFileSync(path.join(workerDist, "lib_doenetml_worker_bg.wasm"))
    .toString("base64");
const workerSource = fs.readFileSync(
    path.join(workerDist, "index.js"),
    "utf-8",
);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
    path.join(outDir, "index.js"),
    `self.__doenetWorkerWasmUrl = ${JSON.stringify(
        `data:application/wasm;base64,${wasmBase64}`,
    )};\n${workerSource}`,
);
