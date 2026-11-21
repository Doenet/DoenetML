import { defineConfig } from "vite";
import { suppressLogPlugin } from "../../scripts/vite-plugins";

// Builds the math key strip for host pages (dist/math-key-strip.js): a small
// classic script — no React, no dependence on the main bundle — that a page
// embedding DoenetML activity iframes adds to draw a row of math keys above
// the device's keyboard on phones and tablets. See src/math-key-strip.ts.
// Runs AFTER the main build (wireit dependency) into the same dist/, as
// coordinator.js does.
export default defineConfig({
    plugins: [suppressLogPlugin()],
    build: {
        minify: true,
        sourcemap: true,
        emptyOutDir: false,
        lib: {
            entry: { "math-key-strip": "./src/math-key-strip.ts" },
            formats: ["iife"],
            name: "DoenetMathKeyStrip",
        },
        rollupOptions: {
            output: {
                entryFileNames: "math-key-strip.js",
            },
        },
    },
    define: {
        "process.env.NODE_ENV": '"production"',
    },
});
