import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [],
    build: {
        outDir: "./lib-doenetml-core/tests/dist/",
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                "parse-dast": "./lib-doenetml-core/tests/parse-dast.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            external: ["yargs"],
        },
    },
});
