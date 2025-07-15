import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [],
    define: {
        // 2025-07-11: Needed to prevent React import errors for some reason...
        "process.env": "{}",
    },
    build: {
        outDir: "./dist/dast-to-flat-dast/",
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                index: "./dast-to-flat-dast.ts",
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
