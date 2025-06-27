import { defineConfig, Plugin, PluginOption } from "vite";
import dts from "vite-plugin-dts";
import fs from "node:fs/promises";
import path from "node:path";
import peg from "peggy";
import * as esbuild from "esbuild";
import { visualizer } from "rollup-plugin-visualizer";
import arraybuffer from "vite-plugin-arraybuffer";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        arraybuffer(),
        dts(),
        //{ rollupTypes: true }
        pegjsLoader(),
        visualizer() as PluginOption,
    ],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                index: "./src/index.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            // This is needed for building the `v06-to-v07` converter.
            // We don't want to add a build dep on `@doenet/doenetml-worker-javascript` just for this.
            external: [
                "@doenet/doenetml-worker-javascript",
                "lib-doenetml-worker",
            ],
        },
    },
});

/**
 * Plugin to allow importing peggy/pegjs files directly.
 */
export function pegjsLoader(options = {}) {
    const svgRegex = /\.peg(js|gy)$/;

    const ret: Plugin = {
        name: "pegjs-loader",
        enforce: "pre",

        async load(filePath) {
            if (!filePath.match(svgRegex)) {
                return;
            }
            const source = await fs.readFile(filePath, "utf-8");
            const filename = path.relative(process.cwd(), filePath);

            const defaultOptions: Record<string, any> = {
                output: "source",
                format: "bare",
                ...options,
            };
            if (filename.match(/latex\.(pegjs|peggy)$/)) {
                defaultOptions.allowedStartRules = ["document", "math"];
            }
            if (filename.match(/tikz\.(pegjs|peggy)$/)) {
                defaultOptions.allowedStartRules = [
                    "path_spec",
                    "foreach_body",
                ];
            }

            const contents = peg.generate(source, defaultOptions);
            // contents might have some typescript in it, so we transpile the typescript
            // away with esbuild.
            const { code } = await esbuild.transform(
                `export default ${contents}`,
                { loader: "ts" },
            );
            return { code };
        },
    };
    return ret;
}
