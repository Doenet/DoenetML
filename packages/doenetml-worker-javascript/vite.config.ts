/// <reference types="vitest/config" />
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";
import { suppressLogPlugin } from "../../scripts/vite-plugins";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [suppressLogPlugin()],
    build: {
        minify: true,
        sourcemap: true,
        lib: {
            entry: "src/index.ts",
            fileName: (_format, _entryName) => "CoreWorker.js",
            formats: ["iife"],
            name: "doenetmlWorker",
        },
        rollupOptions: {
            // @ts-ignore
            plugins: [nodePolyfills()],
            external: ["react", "react-dom", "styled-components"],
            output: {
                globals: {
                    react: "react",
                    "react-dom": "react-dom",
                    "styled-components": "styled-components",
                },
            },
        },
    },
    test: {
        testTimeout: 120000,
    },
});
