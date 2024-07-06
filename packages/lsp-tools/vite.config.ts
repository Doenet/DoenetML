import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts()],
    resolve: {
        // The package `decode-named-character-reference` imported by `micromark-util-decode-string`
        // which is imported by `mdast-util-to-markdown` defaults to using the browser's DOM to compute
        // named character references. Workers don't have access to the DOM. If we want to use this package
        // from a worker, we need to specify the `worker` condition so it loads from the package's `"exports": { "worker": ... }`
        conditions: ["worker"],
    },
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: "./src/index.ts",
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["@doenet/parser", "@doenet/static-assets"],
        },
    },
});
