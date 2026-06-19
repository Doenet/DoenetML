import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import { version } from "./package.json";
import { viteStaticCopy } from "vite-plugin-static-copy";
import arraybuffer from "vite-plugin-arraybuffer";

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PluginOption } from "vite";

const EXTERNAL_DEPS = ["react", "react-dom"];

const PYODIDE_EXCLUDE = [
    "!**/*.{md,html}",
    "!**/*.d.ts",
    "!**/*.whl",
    "!**/node_modules",
];

/**
 * Copy over Pyodide assets supplied by the pyodide package.
 */
export function viteStaticCopyPyodide() {
    const pyodideDir = dirname(fileURLToPath(import.meta.resolve("pyodide")));
    return viteStaticCopy({
        targets: [
            {
                src: [join(pyodideDir, "*")].concat(PYODIDE_EXCLUDE),
                dest: "assets",
            },
        ],
    });
}

/**
 * Copy over assets needed to run PreFigure from inside pyodide.
 */
function vitePluginPrefigure(): PluginOption {
    const prefigureDir = dirname(
        fileURLToPath(import.meta.resolve("@doenet/prefigure")),
    );

    return viteStaticCopy({
        targets: [
            {
                src: [
                    join(prefigureDir, "..", "pyodide_packages", "**", "*.whl"),
                    join(prefigureDir, "..", "pyodide_packages", "**", "*.zip"),
                ],
                dest: "assets",
            },
        ],
    });
}

export default defineConfig(({ mode }) => {
    // Development mode builds should include HTML assets for demos.
    const devBuild = mode === "development";

    return {
        base: "./",
        plugins: [
            dts({ rollupTypes: true }),
            viteStaticCopyPyodide(),
            vitePluginPrefigure(),
            arraybuffer(),
        ],
        worker: {
            format: "es",
        },
        server: {
            host: "0.0.0.0",
            port: 8012,
        },
        define: {
            DOENETML_PRINT_VERSION: JSON.stringify(version),
        },
        build: {
            minify: false,
            lib: !devBuild && {
                entry: {
                    index: "./src/index.ts",
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
                  },
        },
        optimizeDeps: {
            exclude: ["pyodide"],
        },
        test: {
            setupFiles: ["@vitest/web-worker"],
        },
    };
});
