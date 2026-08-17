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

// `math-expressions` stays in that list, and that is what puts it into the
// published `dist/package.json`'s `peerDependencies`: the transformer copies
// this package's declared range verbatim. So the range in `package.json` is the
// range that ships. It is `file:../math` today, which no npm consumer can
// resolve — changing it to the range matching the version actually published is
// Step 6 of `MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md`, and that document states
// the order the release has to follow and which range each published version
// shape needs (`^3.0.0` for a release, `^3.0.0-alpha1` for a prerelease, since
// npm semver excludes prereleases from `^3.x`).

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
                            externalDeps: EXTERNAL_DEPS,
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
