import { defineConfig } from "vite";
import * as path from "node:path";
import { createRequire } from "node:module";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { createPackageJsonTransformer } from "../../scripts/transform-package-json";
import { version } from "./package.json";
import {
    forceEsbuildMinifyPlugin,
    suppressLogPlugin,
} from "../../scripts/vite-plugins";

const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        dts({ rollupTypes: true }),
        viteStaticCopy({
            targets: [
                {
                    src: "package.json",
                    dest: "./",
                    transform: createPackageJsonTransformer(),
                },
                {
                    // Co-locate the core worker (and its siblings, incl. the
                    // wasm) next to the standalone bundle. `index.tsx` imports
                    // the externalized-worker entry, which loads the worker
                    // from `./doenetml-worker/index.js` relative to the bundle
                    // URL instead of embedding it as an inline Blob string.
                    src: path.join(
                        require.resolve("@doenet/doenetml-worker/index.js"),
                        "../*",
                    ),
                    dest: "doenetml-worker/",
                },
            ],
        }),
        suppressLogPlugin(),
        // Vite's built-in `minify` does not actually minify this lib-mode
        // bundle (see plugin doc). Do it explicitly instead.
        forceEsbuildMinifyPlugin(),
    ],
    build: {
        // Minification is handled by forceEsbuildMinifyPlugin above; the
        // built-in pass is a no-op here, so leave it off to avoid confusion.
        minify: false,
        sourcemap: true,
        assetsInlineLimit: 0,
        lib: {
            entry: { "doenet-standalone": "./src/index.tsx" },
            fileName: "doenet-standalone",
            cssFileName: "style",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                // Make sure everything is bundled as a single file
                inlineDynamicImports: true,
            },
        },
    },
    define: {
        "process.env.NODE_ENV": '"production"',
        STANDALONE_VERSION: JSON.stringify(version),
    },
});
