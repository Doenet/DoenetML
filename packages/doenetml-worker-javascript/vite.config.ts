/// <reference types="vitest/config" />
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";
import { suppressLogPlugin } from "../../scripts/vite-plugins";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [suppressLogPlugin(), dts({ rollupTypes: true })],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                index: "./src/index.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            // `math-expressions` is also pulled in by `doenetml-worker`; we don't need two copies.
            external: ["math-expressions"],
        },
    },
    test: {
        testTimeout: 180000,
        pool: "threads",
    },
});
