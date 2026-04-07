import { visualizer } from "rollup-plugin-visualizer";
import { PluginOption, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import fs from "fs";

/**
 * Vite plugin that ensures `?raw` imports of the LSP IIFE bundle work in the
 * dev server.  The built LSP bundle (≈7 MB, with inlined WASM data URL) can
 * trip Vite's `import-analysis` transform when the normal `vite:asset` `load`
 * handler doesn't claim the file (e.g. inside Cypress component-test dev
 * server).  This plugin intercepts the load early and returns the file as a
 * plain string export, matching what `?raw` should produce.
 */
function rawLspBundlePlugin(): PluginOption {
    return {
        name: "raw-lsp-bundle",
        enforce: "pre",
        load(id) {
            if (/[?&]raw\b/.test(id) && id.includes("@doenet/lsp")) {
                const filePath = id.replace(/[?#].*$/, "");
                const content = fs.readFileSync(filePath, "utf-8");
                return `export default ${JSON.stringify(content)}`;
            }
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        rawLspBundlePlugin(),
        dts({ rollupTypes: true }),
        visualizer() as PluginOption,
    ],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: "./src/CodeMirror.tsx",
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["react", "react-dom", "react-dom/server"],
        },
    },
    // The LSP bundle is a large IIFE with inlined WASM (≈7 MB).  It is
    // imported with `?raw` to create a blob-URL Worker.  Prevent Vite's
    // dev server from trying to pre-bundle it.
    optimizeDeps: {
        exclude: ["@doenet/lsp"],
    },
});
