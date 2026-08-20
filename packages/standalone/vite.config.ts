import { defineConfig } from "vite";
import * as path from "node:path";
import { createRequire } from "node:module";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { createPackageJsonTransformer } from "../../scripts/transform-package-json";
import { version } from "./package.json";
import {
    copyLocaleCatalogsPlugin,
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
        // Serve the message catalogs beside the bundle rather than inside it.
        // Catalogs stay runtime-fetched files (`__DOENET_CODE_SPLIT_CATALOGS__`
        // switches the library build's code-split path off below, and
        // `index.tsx` points the viewer's loaders at this copy): as plain
        // assets they can be version-pinned per `pinPackageVersion`, and the
        // single-file `doenet-standalone-inline.js` variant stays free of them
        // too. Same arrangement as the core worker above, for the same reason.
        copyLocaleCatalogsPlugin(),
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
                // Code-split output: the editor stack and the individual
                // viewer renderers load on demand as sibling chunks, resolved
                // relative to the bundle's own URL (`import.meta.url`). That
                // works from jsDelivr and from any host that serves `dist/`
                // as a directory — the same arrangement the co-located core
                // worker and `locales/` already rely on. A host that
                // evaluates the bundle from a Blob/srcdoc URL has no base to
                // resolve chunks against; it uses the single-file
                // `doenet-standalone-inline.js` built by
                // `vite.config-inline.ts` instead.
                //
                // Chunk names keep their content hash: under a floating CDN
                // tag, an out-of-date cached entry then fails loudly (404,
                // retried and surfaced by the renderer-loading path) rather
                // than silently mixing modules from two releases. Chunks are
                // not version-pinned the way the worker and catalogs are —
                // a chunk fetched from a pinned URL would re-resolve its own
                // static imports against that URL and evaluate a second copy
                // of the entry module. Exact-version URLs (what
                // `@doenet/doenetml-iframe` generates) never see a skew.
                chunkFileNames: "chunks/[name]-[hash].js",
            },
        },
    },
    define: {
        "process.env.NODE_ENV": '"production"',
        // Load-bearing, not just informational: `src/index.tsx` pins the URLs
        // it resolves the core worker and `locales/` against to this version,
        // so a build carrying a stale one would send every embed to the
        // previous release's assets. Hence `package.json` among this build's
        // declared wireit inputs — a version bump has to rebuild.
        STANDALONE_VERSION: JSON.stringify(version),
        // This build code-splits, so `src/index.tsx`'s module body evaluates
        // from a chunk under `chunks/` — one level below the bundle root where
        // `doenetml-worker/` and `locales/` are served. See the declaration in
        // `src/index.tsx`; the inline build defines it as `"."`.
        __DOENET_STANDALONE_BUNDLE_ROOT__: '".."',
        // See the `locales/` copy target above: the catalogs are served
        // beside this bundle rather than split out of it. Switching this off
        // makes `@doenet/i18n`'s lazy-catalog glob dead code, so none of
        // `locales/` is inlined here — in either the code-split bundle or the
        // single-file inline variant, which shares this define via
        // `vite.config-inline.ts`.
        __DOENET_CODE_SPLIT_CATALOGS__: "false",
    },
});
