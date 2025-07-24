import { defineConfig, Plugin, PluginOption } from "vite";
import dts from "vite-plugin-dts";
import arraybuffer from "vite-plugin-arraybuffer";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { createPackageJsonTransformer } from "../../scripts/transform-package-json";

const EXTERNAL_DEPS = [];

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        arraybuffer(),
        dts(),
        viteStaticCopy({
            targets: [
                {
                    src: "package.json",
                    dest: "./",
                    transform: createPackageJsonTransformer({
                        externalDeps: EXTERNAL_DEPS,
                    }),
                },
            ],
        }),
    ],
    build: {
        minify: false,
        sourcemap: true,
        emptyOutDir: false,
        lib: {
            entry: {
                index: "./src/index.ts",
            },
            formats: ["es"],
        },
    },
});
