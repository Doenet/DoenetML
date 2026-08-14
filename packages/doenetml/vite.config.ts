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

// The subset of `EXTERNAL_DEPS` that becomes a `peerDependencies` entry in the
// published `dist/package.json`.
//
// `math-expressions` is deliberately absent. It resolves to the workspace-only
// `@doenet/math` through `"math-expressions": "file:../math"`, and a `file:`
// range is meaningless to an npm consumer. Externalizing it is still right for
// the workspace — `@doenet/standalone` builds against this `dist/` and resolves
// the seam once — but it means the *published* tarball carries an unresolved
// `math-expressions` import. Publishing this package therefore has to wait for
// the seam to be a real published package; see
// `MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md`.
const PUBLISHED_PEER_DEPS = EXTERNAL_DEPS.filter(
    (dep) => dep !== "math-expressions",
);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // If we call vite build --mode="development", we want to deactivate `lib` mode so that html assets get built.
    // This is so we can copy them into our `demos` package for inclusion in the website.
    const devBuild = mode === "development";
    return {
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
                            externalDeps: PUBLISHED_PEER_DEPS,
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
                },
                formats: ["es"],
                cssFileName: "style",
            },
            rollupOptions: devBuild
                ? undefined
                : {
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
    };
});
