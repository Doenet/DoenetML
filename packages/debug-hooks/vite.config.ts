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
        rollupOptions: {
            // `@doenet/doenetml-worker-javascript` is also pulled in by `doenetml-worker`;
            // bundling a second copy here would duplicate component classes (e.g. `Section`
            // becomes `Section$1`) and break runtime lookups by class name.
            external: ["@doenet/doenetml-worker-javascript"],
        },
    },
});
