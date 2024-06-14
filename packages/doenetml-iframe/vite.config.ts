import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { createPackageJsonTransformer } from "../../scripts/transform-package-json";

// These are the dependencies that will not be bundled into the library.
const EXTERNAL_DEPS = ["react", "react-dom"];

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
                    transform: createPackageJsonTransformer({
                        externalDeps: EXTERNAL_DEPS,
                        targetDir: "dist/component",
                    }),
                },
            ],
        }),
    ],
    build: {
        minify: false,
        outDir: "dist/component",
        sourcemap: true,
        assetsInlineLimit: 0,
        lib: {
            entry: "./src/index.tsx",
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: EXTERNAL_DEPS,
            output: {
                globals: Object.fromEntries(
                    EXTERNAL_DEPS.map((dep) => [dep, dep]),
                ),
            },
        },
    },
    define: {
        "process.env.NODE_ENV": '"production"',
    },
});
