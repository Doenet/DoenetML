import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
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
// ~1.8 MiB of base64. Bundling it here put a private copy in this library *and*
// in every sibling library, so `doenet-standalone.js` ended up carrying three —
// 5.3 MiB of the same bytes. Externalized, the application bundle resolves it
// once. Deliberately NOT done in `packages/doenetml-worker`: that bundle is
// fetched on its own by URL and has to stay self-contained (see the
// viteStaticCopy note in packages/standalone/vite.config.ts).
const EXTERNAL_DEPS = ["react", "react-dom", "math-expressions"];
/**
 * `math-expressions` resolves to the `@doenet/math` workspace package through a
 * `file:` link. Vite rewrites that to an absolute path before rollup's
 * string-array `external` check runs, so listing the bare specifier alone
 * silently bundles it anyway — which is how ~1.8 MiB of inlined WASM kept
 * landing in this library after it was supposedly externalized. Match the
 * resolved path as well as the specifier.
 */
const MATH_DIST = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../math/dist",
);
function isExternalDep(id: string): boolean {
    return (
        EXTERNAL_DEPS.includes(id) ||
        id === "math-expressions" ||
        id.startsWith(MATH_DIST)
    );
}

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
                      external: isExternalDep,
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
