import { defineConfig, Plugin, PluginOption } from "vite";
import dts from "vite-plugin-dts";
import fs from "node:fs/promises";
import path from "node:path";
import peg from "peggy";
import * as esbuild from "esbuild";
import { visualizer } from "rollup-plugin-visualizer";
import arraybuffer from "vite-plugin-arraybuffer";
import { ignoreWireitCachesPlugin } from "../../scripts/vite-plugins";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        ignoreWireitCachesPlugin(),
        arraybuffer(),
        dts(),
        //{ rollupTypes: true }
        pegjsLoader(),
        visualizer() as PluginOption,
    ],
    build: {
        minify: false,
        sourcemap: true,
        emptyOutDir: false,
        lib: {
            entry: {
                index: "./src/index.ts",
                "pretty-printer": "./src/pretty-printer/index.ts",
                "index-v06": "./src/index-v06.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            // Leave `@doenet/static-assets` (the component schema the
            // pretty-printer's layout table reads, and the entity map) to the
            // consuming build, the same way `@doenet/lsp-tools` and
            // `@doenet/codemirror` do. Every consumer bundles this package
            // together with other users of the schema, so resolving it there
            // means one shared copy of the ~230 KB compressed schema literal
            // instead of a private copy baked into `pretty-printer.js`.
            external: [/@doenet\/static-assets/],
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
            // The v0.7 macro grammar has a second entry point, `MacroTail`,
            // which `gobblePropIndices` uses to carry a reference's path past an
            // element index. Naming any start rules replaces the default, so
            // `top` has to stay listed. The match is on the directory because
            // the v0.6 grammar is also called `macros.peggy` and has no such
            // rule.
            if (filename.match(/macros\/macros\.(pegjs|peggy)$/)) {
                defaultOptions.allowedStartRules = ["top", "MacroTail"];
            }
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
