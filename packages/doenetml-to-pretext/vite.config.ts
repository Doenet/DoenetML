//import { PluginOption, defineConfig } from "vite";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import { version } from "./package.json";

// These are the dependencies that will not be bundled into the library.
const EXTERNAL_DEPS = ["react", "react-dom"];

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true })],
    server: {
        port: 8012,
    },
    define: {
        DOENETML_VERSION: JSON.stringify(version),
    },
    build: {
        minify: false,
        lib: {
            entry: {
                index: "./src/index.ts",
                "pretext-xml": "./src/pretext-xml.ts",
            },
            formats: ["es"],
            cssFileName: "style",
        },
        rollupOptions: {
            external: EXTERNAL_DEPS,
            output: {
                globals: Object.fromEntries(
                    EXTERNAL_DEPS.map((dep) => [dep, dep]),
                ),
            },
        },
    },
    test: {
        setupFiles: ["@vitest/web-worker"],
    },
});
