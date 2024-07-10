import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [],
    build: {
        outDir: "./dist/dast-to-flat-dast/",
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                "index": "./dast-to-flat-dast.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            // If we do `external: ["yargs"]` then we do not produce a portable JS file,
            // so only exclude node built-in modules
            external: ["fs", "path", "node:fs"],
        },
    },
});
