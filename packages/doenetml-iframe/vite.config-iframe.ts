import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// These are the dependencies that will not be bundled into the library.
const EXTERNAL_DEPS = [];

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [],
    build: {
        minify: false,
        sourcemap: false,
        assetsInlineLimit: 0,
        outDir: "dist/iframe",
        lib: {
            entry: { "iframe-index": "./src/iframe-index.ts" },
            fileName: "iframe-index",
            name: "doenetIframe",
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
