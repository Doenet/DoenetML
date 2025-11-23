import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import * as path from "node:path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import dts from "vite-plugin-dts";
import { createPackageJsonTransformer } from "../../scripts/transform-package-json";
import { version } from "./package.json";
import { suppressLogPlugin } from "../../scripts/vite-plugins";

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
                    // Copy everything from the same directory as `index.js`. This will include
                    // `index.js.map`
                    src: path.join(
                        require.resolve("@doenet/doenetml-worker/index.js"),
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
        suppressLogPlugin(),
    ],
    define: {
        DOENETML_VERSION: JSON.stringify(version),
    },
    server: {
        host: "0.0.0.0",
        port: 8012,
    },
    build: {
        minify: false,
        lib: {
            entry: {
                index: "./src/index.ts",
                "doenetml-inline-worker": "./src/doenetml-inline-worker.ts",
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
            onwarn(warning, warn) {
                // Ignore warnings about module level directives. I.e., literal strings like `"use strict";` included at the top of source code.
                if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
                    return;
                }
                warn(warning);
            },
        },
    },
});
