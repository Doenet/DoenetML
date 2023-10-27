import { PluginOption, defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import * as path from "node:path";
import dts from "vite-plugin-dts";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [dts({ rollupTypes: true }), visualizer() as PluginOption],
    base: "./",
    build: {
        outDir: path.join(__dirname, "extension", "build", "language-server"),
        minify: true,
        sourcemap: true,
        lib: {
            entry: "./src/language-server/index.ts",
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
