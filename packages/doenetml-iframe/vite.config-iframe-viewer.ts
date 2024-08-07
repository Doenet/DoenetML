import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts()],
    build: {
        minify: false,
        sourcemap: false,
        assetsInlineLimit: 0,
        outDir: "dist/iframe-viewer",
        lib: {
            entry: { "iframe-viewer-index": "./src/iframe-viewer-index.ts" },
            fileName: "iframe-viewer-index",
            name: "doenetViewerIframe",
            formats: ["iife"],
        },
        rollupOptions: {
            output: {
                // Make sure everything is bundled as a single file
                inlineDynamicImports: true,
            },
        },
    },
    define: {
        "process.env.NODE_ENV": '"production"',
    },
});
