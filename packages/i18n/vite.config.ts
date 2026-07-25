import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true })],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                index: "./src/index.ts",
            },
            formats: ["es"],
        },
        // `@fluent/bundle` and `@fluent/langneg` are deliberately *not*
        // external: this package is bundled into the viewer, the worker, and
        // the LSP, none of which resolve bare specifiers at runtime.
        rollupOptions: {},
    },
});
