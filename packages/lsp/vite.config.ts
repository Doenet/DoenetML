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
