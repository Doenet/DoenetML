import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [],
    build: {
        outDir: "./dist/run/",
        emptyOutDir: false,
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                "index": "./run.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            // If we do `external: ["yargs"]` then we do not produce a portable JS file,
            // so only exclude node built-in modules
            external: ["fs", "path", "node:fs", "yargs", "webdriverio"],
        },
    },
});
