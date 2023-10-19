import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDoenetDeps } from "../../scripts/vite-plugin-externalize-doenet-deps";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true }), externalizeDoenetDeps()],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: "./src/parser.ts",
            fileName: "index",
            formats: ["es"],
        },
    },
});
