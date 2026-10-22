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

/**
 * A prerendered page's first script: from the moment the page begins, note
 * every button and hint summary pressed in the snapshot (`#root` while it
 * is `data-prerendered`), into `window.__cellsClicks`, so the live viewer
 * can press them again (`carry.ts`). Nothing in the snapshot answers a
 * press until then.
 */
export function recordEarlyClicks(): string {
    return `
    var clicks = (window.__cellsClicks = []);
    document.addEventListener("click", function (e) {
        var root = document.getElementById("root");
        var t = e.target;
        if (!root || !root.hasAttribute("data-prerendered") || !t || !t.closest) return;
        var b = t.closest("button, summary");
        if (b && root.contains(b)) clicks.push(b);
    }, true);`;
}
