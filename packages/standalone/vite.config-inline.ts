import { defineConfig } from "vite";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { version } from "./package.json";
import {
    forceEsbuildMinifyPlugin,
    suppressLogPlugin,
} from "../../scripts/vite-plugins";

const DIST_DIR = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "dist",
);

// Builds `dist/doenet-standalone-inline.js`: the same entry as the code-split
// `doenet-standalone.js` (vite.config.ts), with every dynamic import folded
// back into one file. This is the variant for hosts that evaluate the bundle
// where relative module resolution has no base — a Blob or srcdoc URL, as
// `@doenet/doenetml-iframe`'s dev harness and component tests do with a
// locally built copy. A host loading from a real URL (the CDN, a self-hosted
// `dist/`) should use `doenet-standalone.js`, whose lazy chunks keep the
// editor stack and unused renderers out of the eagerly-parsed payload.
//
// Runs after the main build (wireit dependency) into the same `dist/`, so it
// sits beside the worker, `locales/`, and `package.json` that build copied in
// — `emptyOutDir: false` keeps them. The `define` block matches
// vite.config.ts: both builds compile `src/index.tsx`, and the version pin
// and catalog arrangement documented there apply to this file identically.
export default defineConfig({
    base: "./",
    plugins: [
        suppressLogPlugin(),
        // Vite's built-in `minify` does not actually minify this lib-mode
        // bundle (see plugin doc). Do it explicitly instead.
        forceEsbuildMinifyPlugin(),
        {
            // This entry's CSS is byte-identical to the `style.css` the main
            // build already emitted (same entry module); remove it after the
            // write so the published `dist/` carries the 3+ MB stylesheet
            // once. Removal happens in `closeBundle` because Vite's own CSS
            // handling adds the asset after user plugins' `generateBundle`.
            name: "drop-duplicate-css",
            closeBundle() {
                fs.rmSync(path.join(DIST_DIR, "doenet-standalone-inline.css"), {
                    force: true,
                });
            },
        },
    ],
    build: {
        // Minification is handled by forceEsbuildMinifyPlugin above.
        minify: false,
        // The code-split build beside this one ships the source maps; a map
        // for this variant would republish the same ~34 MB of mappings a
        // second time for the rare single-file host.
        sourcemap: false,
        emptyOutDir: false,
        assetsInlineLimit: 0,
        lib: {
            entry: { "doenet-standalone-inline": "./src/index.tsx" },
            fileName: "doenet-standalone-inline",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                // The point of this variant: one self-contained file.
                inlineDynamicImports: true,
            },
        },
    },
    define: {
        "process.env.NODE_ENV": '"production"',
        STANDALONE_VERSION: JSON.stringify(version),
        __DOENET_CODE_SPLIT_CATALOGS__: "false",
        // This single file *is* the root-level bundle; siblings resolve from
        // its own directory. See the declaration in `src/index.tsx`; the
        // code-split build defines it as `".."`.
        __DOENET_STANDALONE_BUNDLE_ROOT__: '"."',
    },
});
