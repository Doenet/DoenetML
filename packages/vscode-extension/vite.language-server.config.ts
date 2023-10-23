import { defineConfig } from "vite";
import * as path from "node:path";
import dts from "vite-plugin-dts";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [dts({ rollupTypes: true })],
    base: "./",
    build: {
        outDir: path.join(__dirname, "extension", "build", "language-server"),
        minify: false,
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
