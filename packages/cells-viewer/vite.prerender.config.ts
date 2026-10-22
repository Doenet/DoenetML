import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// The server build: `src/prerender/render.tsx` for Node, to
// `dist-prerender/render.js`, with everything it imports bundled in (React,
// the parser, the core's glue), so it runs without this workspace's
// packages beside it. JSXGraph, which cannot load outside a browser, is
// replaced by its stand-in: a server renders a graph as its empty
// container. The core's wasm is not read from here: `scripts/prerender.mjs`
// passes `initCore` the wasm of the client build (`dist/`), so a page and
// its server run the same core.
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            {
                find: /^jsxgraph$/,
                replacement: fileURLToPath(
                    new URL(
                        "./src/prerender/jsxgraph-stub.ts",
                        import.meta.url,
                    ),
                ),
            },
        ],
    },
    ssr: { noExternal: true },
    build: {
        ssr: "src/prerender/render.tsx",
        outDir: "dist-prerender",
        target: "node22",
        emptyOutDir: true,
        rollupOptions: { output: { format: "es" } },
    },
});
