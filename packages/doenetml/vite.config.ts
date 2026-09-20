import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import * as path from "node:path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import dts from "vite-plugin-dts";
import { createPackageJsonTransformer } from "../../scripts/transform-package-json";
import { version } from "./package.json";
import {
    ignoreWireitCachesPlugin,
    prefigureDynamicImportIgnorePlugin,
    suppressLogPlugin,
} from "../../scripts/vite-plugins";

// These are the dependencies that will not be bundled into the library.
//
// `math-expressions` resolves to `@doenet/math`, which inlines the Rust core as
// ~2.3 MiB of base64. Bundling it here put a private copy in this library *and*
// in every sibling library, so `doenet-standalone.js` ended up carrying three
// copies of the same bytes. Externalized, the application bundle resolves it
// once.
const EXTERNAL_DEPS = ["react", "react-dom", "math-expressions"];

// `math-expressions` stays in that list, and that is what puts it into the
// published `dist/package.json`'s `peerDependencies`.
//
// The range is named here rather than taken from `package.json`, because the
// two want different strings. `package.json` says `file:../math`, which is what
// makes every `import me from "math-expressions"` in this package resolve to
// `@doenet/math` — the seam that inlines the WASM core, and the module every
// sibling workspace and the standalone app resolve too. Declaring the registry
// range there instead would make npm install the published package *inside*
// `packages/doenetml`, so this package alone would type-check and test against
// a different module than it ships.
//
// The dot in `-alpha.1` is load-bearing: without it npm semver reads the tail
// as one alphanumeric identifier and compares it as text, so `-alpha.10` would
// sort before `-alpha.9`. See the range table in
// `MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md`. When upstream reaches a real
// `3.0.0`, this becomes `^3.0.0`.
const MATH_EXPRESSIONS_PUBLISHED_RANGE = "^3.0.0-alpha.1";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // If we call vite build --mode="development", we want to deactivate `lib` mode so that html assets get built.
    // This is so we can copy them into our `demos` package for inclusion in the website.
    const devBuild = mode === "development";
    return {
        base: "./",
        plugins: [
            ignoreWireitCachesPlugin(),
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
                            publishRanges: {
                                "math-expressions":
                                    MATH_EXPRESSIONS_PUBLISHED_RANGE,
                            },
                        }),
                    },
                    // Ship the README in the published package (`dist/` is
                    // the publish root) so npm displays it.
                    { src: "README.md", dest: "./" },
                ],
            }),
            prefigureDynamicImportIgnorePlugin(),
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
            lib: !devBuild && {
                entry: {
                    index: "./src/index.ts",
                    "doenetml-inline-worker": "./src/doenetml-inline-worker.ts",
                    "doenetml-external-worker":
                        "./src/doenetml-external-worker.ts",
                    // Direct access to the CodeMirror component without
                    // routing the editor stack through the main entry — see
                    // src/codemirror.ts.
                    codemirror: "./src/codemirror.ts",
                },
                formats: ["es"],
                cssFileName: "style",
            },
            rollupOptions: devBuild
                ? undefined
                : {
                      // The subpath pattern alongside the bare names:
                      // `utils/mathWasm.ts` reaches
                      // `math-expressions/wasm-web/…` on the consumer path,
                      // and rollup resolves a dynamic import at build time
                      // unless told not to. An exact-match entry does not
                      // cover a subpath, and here it cannot resolve —
                      // `@doenet/math`, which backs the specifier in this
                      // repository, deliberately has no such export. It is
                      // the consumer's `math-expressions` that answers it,
                      // so it has to leave this build untouched.
                      //
                      // Deliberately not added to EXTERNAL_DEPS: that list is
                      // also what becomes `peerDependencies`, and the subpath
                      // is not a package to depend on.
                      external: [...EXTERNAL_DEPS, /^math-expressions\//],
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
    };
});
