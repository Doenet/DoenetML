import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import * as path from "node:path";
import { createRequire } from "module";
import { createPackageJsonTransformer } from "../../scripts/transform-package-json";
const require = createRequire(import.meta.url);

// These are the dependencies that will not be bundled into the library.
const EXTERNAL_DEPS = [];

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
            ],
        }),
    ],
    build: {
        minify: true,
        sourcemap: true,
        assetsInlineLimit: 0,
        lib: {
            entry: { "doenet-standalone": "./src/index.tsx" },
            fileName: "doenet-standalone",
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
    },
});
