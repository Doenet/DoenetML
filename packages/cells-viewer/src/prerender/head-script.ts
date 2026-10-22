// The script a built page's head runs before any of its other scripts
// have arrived, to start the first load's slowest fetch early: the core's
// wasm, fetched and compiled on a background thread into
// `window.__cellsWasm` (`src/core.ts` instantiates from it), recorded as
// the step `wasm compile`. Shared by the dev page's build (`vite.config.ts`)
// and prerendered pages (`page.ts`), so both start the core the same way.

/** The statements that start compiling the wasm at `wasmUrl`. */
export function compileWasmEarly(wasmUrl: string): string {
    return `
    var url = ${JSON.stringify(wasmUrl)};
    if (typeof WebAssembly.compileStreaming === "function") {
        var start = performance.now();
        window.__cellsWasm = WebAssembly.compileStreaming(fetch(url)).then(
            function (module) {
                performance.measure("cells:wasm compile", { start: start, end: performance.now(), detail: { counts: {} } });
                return module;
            },
            function () { return undefined; }
        );
    }`;
}
