import { visualizer } from "rollup-plugin-visualizer";
import { PluginOption, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { ignoreWireitCachesPlugin } from "../../scripts/vite-plugins";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        ignoreWireitCachesPlugin(),
        dts({ rollupTypes: true }),
        visualizer() as PluginOption,
    ],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: "./src/index.ts",
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "react-dom/server",
                // Leave `@doenet/static-assets` (the component schema and
                // completion snippets) to the consuming build, the same way
                // `@doenet/lsp-tools` does. Every consumer bundles this
                // package together with other users of the schema, so
                // resolving it there means one shared copy of the ~230 KB
                // compressed schema literal instead of a private copy baked
                // into this dist.
                /@doenet\/static-assets/,
            ],
        },
    },
    // The LSP bundle is a large IIFE with inlined WASM (≈7 MB).  It is
    // imported with `?raw` to create a blob-URL Worker.  Prevent Vite's
    // dev server from trying to pre-bundle it.
    optimizeDeps: {
        exclude: ["@doenet/lsp"],
    },
});
