import { defineConfig, Plugin } from "vite";
import { dataToEsm } from "@rollup/pluginutils";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import * as compressJson from "compress-json";
import * as path from "node:path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        dts(),
        viteStaticCopy({
            targets: [
                {
                    src: "./src/generated/*",
                    dest: "./generated/",
                },
            ],
        }),
        compressJsonPlugin(),
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
    },
});

/**
 * A vite plugin that replaces import json statements with compressed json, if
 * the compressed json is at least 5% smaller than the original.
 */
function compressJsonPlugin() {
    // Size of `import { decompress } from "compress-json"`
    const DECOMPRESS_IMPORT_SIZE = 12;

    const ret: Plugin = {
        name: "compress-json",
        enforce: "pre",
        configResolved(config) {
            // Remove the `vite:json` plugin, since we replace it.

            // XXX: I don't know the proper way to remove the `vite:json` plugin,
            // so I filter it from the list of plugins. Update if a "proper" way is found.
            // @ts-ignore
            config.plugins = config.plugins.filter(
                (p) => p.name !== "vite:json",
            );
        },
        async transform(code, id) {
            if (!id.match(/\.json$/)) {
                return null;
            }
            // Get the relative path of the file
            const filename = path.relative(__dirname, id);

            const uncompressed = JSON.parse(code);
            const compressed = compressJson.compress(uncompressed);
            const origSize = JSON.stringify(uncompressed).length / 1024;
            const compSize = JSON.stringify(compressed).length / 1024;
            const compRatio = compSize / origSize;

            if (compRatio > 0.95) {
                return {
                    code: `export default ${JSON.stringify(uncompressed)};`,
                    map: { mappings: "" },
                };
            }

            // We're going to compress
            console.log(
                `\n   Compressing ${filename} to ${Math.round(
                    compRatio * 100,
                )}% of original size`,
            );

            const compressedStr = JSON.stringify(compressed);
            const outCode = `import { decompress } from "compress-json";\n\nexport default decompress(${compressedStr});`;

            return {
                code: outCode,
                map: { mappings: "" },
            };
        },
    };
    return ret;
}
