import { defineConfig, type HtmlTagDescriptor, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { compileWasmEarly } from "./src/prerender/head-script";

const core = resolve(__dirname, "../cells-core");

/** The generated fixtures' names, for the dev page's Fixture menu. */
function fixtureNames(): string[] {
    try {
        return readdirSync(resolve(core, "fixtures"))
            .filter((f) => f.endsWith(".cdast"))
            .map((f) => f.slice(0, -".cdast".length))
            .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
    } catch {
        return [];
    }
}

/**
 * What the page's head runs before any of its scripts have arrived: the
 * first load's two slowest fetches, started now instead of when the code
 * that needs them runs. The document's text (`?src=`) goes to
 * `window.__cellsDoc` (`dev/main.tsx`), and the core's wasm is fetched and
 * compiled, on a background thread, into `window.__cellsWasm`
 * (`src/core.ts` instantiates from it). The compile is recorded as the
 * step `wasm compile`. Only the built page has this: the dev server has no
 * bundle to name the wasm from, and `src/core.ts` fetches it itself.
 */
function headScript(wasmUrl: string | null): string {
    return `
(function () {
    var src = new URLSearchParams(location.search).get("src");
    if (src) {
        window.__cellsDocAt = performance.now();
        window.__cellsDoc = fetch(src);
    }
${wasmUrl ? compileWasmEarly(wasmUrl) : ""}
})();`;
}

/**
 * Start early (build only): the head script above, and a preload of the
 * parser's chunk, a dynamic import that would otherwise be requested only
 * once the text is in hand.
 */
function startEarly(): Plugin {
    return {
        name: "cells-start-early",
        apply: "build",
        transformIndexHtml: {
            order: "post",
            handler(_html, ctx) {
                const files = Object.values(ctx.bundle ?? {});
                const wasm = files.find((f) => f.fileName.endsWith(".wasm"));
                const parser = files.find(
                    (f) =>
                        f.type === "chunk" &&
                        f.isDynamicEntry &&
                        f.facadeModuleId?.includes("/packages/parser/"),
                );
                const tags: HtmlTagDescriptor[] = [
                    {
                        tag: "script",
                        injectTo: "head-prepend",
                        children: headScript(wasm ? `/${wasm.fileName}` : null),
                    },
                ];
                if (parser)
                    tags.push({
                        tag: "link",
                        attrs: {
                            rel: "modulepreload",
                            crossorigin: true,
                            href: `/${parser.fileName}`,
                        },
                        injectTo: "head",
                    });
                return tags;
            },
        },
    };
}

export default defineConfig({
    plugins: [react(), startEarly()],
    // The generated fixtures, served at /<spec>.cdast, .json and .doenet.
    publicDir: resolve(core, "fixtures"),
    define: { __CELLS_FIXTURES__: JSON.stringify(fixtureNames()) },
    // The core is a workspace package whose wasm must not be pre-bundled.
    optimizeDeps: { exclude: ["@doenet/cells-core"] },
    server: { port: 5173 },
    build: {
        target: "esnext",
        // `dist/.vite/manifest.json`: where the prerendered pages'
        // writer (`scripts/prerender.mjs`) finds the build's hashed files.
        manifest: true,
        rollupOptions: {
            output: {
                // One script per big library, so the browser compiles them
                // on separate background threads as they stream in, instead
                // of one 3 MB script on one thread. The editor (CodeMirror,
                // lsp-tools, the language server) is a dynamic import of its
                // own (`src/EditorViewer.tsx`), so it is not here.
                manualChunks: {
                    jsxgraph: ["jsxgraph"],
                    react: ["react", "react-dom"],
                },
            },
        },
    },
});
