import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [dts()],
    base: "./",
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: "src/index.ts",
            fileName: (_format, _entryName) => "index.js",
            formats: ["iife"],
            name: "doenetmlWorker",
        },
    },
});
