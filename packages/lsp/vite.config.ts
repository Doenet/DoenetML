import { PluginOption, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true }), visualizer() as PluginOption],
    build: {
        minify: true,
        sourcemap: true,
        // Inline the WASM binary (≈4 MB) as a data URL so the IIFE bundle
        // is fully self-contained.  The blob-URL conversion in rust-core.ts
        // turns it back into a loadable WASM URL at runtime.
        assetsInlineLimit: 10 * 1024 * 1024,
        lib: {
            entry: "./src/index.ts",
            name: "DoenetLanguageServer",
            formats: ["iife"],
        },
        rollupOptions: {
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
            },
        },
    },
});
