import { defineConfig, PluginOption } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createPackageJsonTransformer } from "../../scripts/transform-package-json";
import { version } from "./package.json";
import { suppressLogPlugin } from "../../scripts/vite-plugins";

const PYODIDE_EXCLUDE = [
    "!**/*.{md,html}",
    "!**/*.d.ts",
    "!**/*.whl",
    "!**/node_modules",
];

export default defineConfig({
    base: "./",
    optimizeDeps: { exclude: ["pyodide"] },
    plugins: [
        dts({ rollupTypes: true }),
        vitePluginPyodide(),
        viteStaticCopy({
            targets: [
                {
                    src: "package.json",
                    dest: "./",
                    transform: createPackageJsonTransformer(),
                },
                {
                    src: "README.md",
                    dest: "./",
                },
                {
                    src: "NOTICE.md",
                    dest: "./",
                },
                {
                    src: "../../LICENSE",
                    dest: "./",
                },
            ],
        }),
        suppressLogPlugin(),
    ],
    worker: {
        format: "es",
    },
    build: {
        minify: true,
        sourcemap: true,
        assetsInlineLimit: 0,
        lib: {
            entry: { prefigure: "./src/index.ts" },
            fileName: "prefigure",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
            },
        },
    },
    define: {
        PREFIGURE_VERSION: JSON.stringify(version),
    },
});

function vitePluginPyodide(): PluginOption {
    const pyodideDir = dirname(fileURLToPath(import.meta.resolve("pyodide")));

    return viteStaticCopy({
        targets: [
            {
                src: [join(pyodideDir, "*")].concat(PYODIDE_EXCLUDE),
                dest: "assets",
            },
            {
                src: [
                    join("pyodide_packages", "**", "*.whl"),
                    join("pyodide_packages", "**", "*.zip"),
                ],
                dest: "assets",
            },
        ],
    });
}
