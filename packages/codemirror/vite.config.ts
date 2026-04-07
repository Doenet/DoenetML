import { visualizer } from "rollup-plugin-visualizer";
import { PluginOption, defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true }), visualizer() as PluginOption],
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
