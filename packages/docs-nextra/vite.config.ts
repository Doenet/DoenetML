import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    base: "./",
    plugins: [dts()],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                index: "./scripts/index.ts",
            },
            formats: ["es"],
        },
    },
});
