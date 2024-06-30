import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [],
    build: {
        minify: false,
        sourcemap: false,
        assetsInlineLimit: 0,
        outDir: "dist/iframe-editor",
        lib: {
            entry: { "iframe-editor-index": "./src/iframe-editor-index.ts" },
            fileName: "iframe-editor-index",
            name: "doenetEditorIframe",
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
