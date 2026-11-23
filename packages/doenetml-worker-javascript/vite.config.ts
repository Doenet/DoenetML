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
                // The `HeadlessCore` implementation for
                // `@doenet/doenetml-headless`, kept out of the main entry so
                // none of it reaches the browser worker bundle.
                headless: "./src/headless/index.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            // `math-expressions` is also pulled in by `doenetml-worker`; we don't need two copies.
            // `lib-doenetml-worker` (the Rust resolver's wasm-bindgen glue) is
            // imported only by the headless entry; the package that ships it
            // bundles the glue beside the WASM it loads, so it is left to that
            // build rather than compiled into this one.
            external: ["math-expressions", "lib-doenetml-worker"],
        },
    },
    test: {
        testTimeout: 180000,
        pool: "threads",
        // Fail a test whose document reports an error after load (DIAG-7).
        setupFiles: ["./src/test/setupErrorsAfterLoad.ts"],
    },
});
