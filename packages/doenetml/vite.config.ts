import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import * as path from "node:path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import dts from "vite-plugin-dts";
import { createPackageJsonTransformer } from "../../scripts/transform-package-json";

// These are the dependencies that will not be bundled into the library.
const EXTERNAL_DEPS = ["react", "react-dom", "styled-components"];

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react(),
        dts({ rollupTypes: false }),
        viteStaticCopy({
            targets: [
                {
                    // Copy everything from the same directory as `CoreWorker.js`. This will include
                    // `CoreWorker.js.map`
                    src: path.join(
                        require.resolve(
                            "@doenet/doenetml-worker/CoreWorker.js",
                        ),
                        "../*",
                    ),
                    dest: "doenetml-worker/",
                },
                {
                    src: "package.json",
                    dest: "./",
                    transform: createPackageJsonTransformer({
                        externalDeps: EXTERNAL_DEPS,
                    }),
                },
            ],
        }),
    ],
    server: {
        port: 8012,
    },
    build: {
        minify: false,
        lib: {
            entry: {
                doenetml: "./src/index.js",
                "doenetml-inline-worker": "./src/index-inline-worker.ts",
            },
            formats: ["es"],
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
});
