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
                    // Co-locate the core worker next to the standalone bundle.
                    // `index.tsx` imports the externalized-worker entry, which
                    // loads the worker from `./doenetml-worker/index.js`
                    // relative to the bundle URL instead of embedding it as an
                    // inline Blob string.
                    //
                    // Copy only `index.js` (+ its source map). `index.js` is
                    // fully self-contained at runtime: the WASM is inlined as a
                    // `data:` URL, and it neither `importScripts()` nor fetches
                    // any sibling file. The rest of the worker `dist/` (the
                    // `.esm.js` build variant, the standalone `.wasm`, and the
                    // `.d.ts` declarations — ~48 MB) is runtime-dead and would
                    // only bloat the published bundle, working against the very
                    // memory/size reduction this externalization is for.
                    src: path.join(
                        require.resolve("@doenet/doenetml-worker/index.js"),
                        "../index.js{,.map}",
                    ),
                    dest: "doenetml-worker/",
                },
                // Ship the README in the published package (`dist/` is the
                // publish root) so npm displays it.
                { src: "README.md", dest: "./" },
            ],
        }),
        suppressLogPlugin(),
        // Vite's built-in `minify` does not actually minify this lib-mode
        // bundle (see plugin doc). Do it explicitly instead.
        forceEsbuildMinifyPlugin(),
    ],
    server: {
        host: "0.0.0.0",
    },
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
