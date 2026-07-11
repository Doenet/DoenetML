import { PluginOption } from "vite";
import { transform } from "esbuild";
import remapping, { type SourceMapInput } from "@jridgewell/remapping";
import path from "node:path";

const PREFIGURE_DIST_ASSET_JS_RE =
    /(^|\/)packages\/prefigure\/dist\/assets\/.+\.js$/;

function isPrefigureDistAssetJsId(id: string): boolean {
    // Normalize Vite transform ids across OS and id shapes (e.g. /@fs/, file://).
    const normalizedId = id.replaceAll("\\", "/");
    const pathWithoutQuery = normalizedId.split("?", 1)[0];
    return PREFIGURE_DIST_ASSET_JS_RE.test(pathWithoutQuery);
}

/**
 * Force-minify every emitted JS chunk with esbuild in `generateBundle`.
 *
 * Why this exists: in this repo's Vite 7 library builds, `build.minify: true`
 * does not actually minify the emitted lib-mode bundle — the shipped
 * `doenet-standalone.js` ships as ~33 MB of un-minified, fully-commented source
 * (346k lines) despite `minify: true`. esbuild's own `transform` API minifies
 * the very same bundle to ~28 MB in a couple of seconds, so the bytes are
 * recoverable; Vite just isn't applying the pass. This plugin runs that esbuild
 * pass explicitly so minification is deterministic and independent of Vite's
 * built-in behavior.
 *
 * Why `generateBundle` and not `renderChunk`: a `renderChunk` hook (even
 * `enforce: "post"`) is re-serialized by a later internal Vite esbuild pass
 * that pretty-prints the code back out, undoing the whitespace minification
 * (identifier mangling survives, but the newlines/indentation return). By
 * `generateBundle` the pipeline is done rewriting chunk code, so our output is
 * final.
 *
 * The catch with `generateBundle`: Rollup has *already* appended the
 * `//# sourceMappingURL=` comment to `chunk.code` and emitted the chunk's map
 * as a standalone `.map` asset (both happen during `renderChunks`, before this
 * hook — see rollup's `addChunksToBundle`). esbuild strips the now-stale
 * comment while minifying, and the written `.map` file comes from the emitted
 * asset, not from `chunk.map`. So after minifying we must (1) overwrite that
 * `.map` asset with a map chained back to the original sources and (2) re-add
 * the `sourceMappingURL` comment ourselves — mutating `chunk.map` alone would
 * never reach disk.
 *
 * Every embedded iframe realm on a textbook page re-parses this bundle, so the
 * saved bytes (and the parse work they represent) multiply across instances.
 *
 * Use together with `build.minify: false` so the built-in (non-working) pass is
 * off and this plugin is the single source of truth for minification.
 */
export function forceEsbuildMinifyPlugin(): PluginOption {
    return {
        name: "force-esbuild-minify",
        async generateBundle(outputOptions, bundle) {
            const sourcemap = outputOptions.sourcemap;
            for (const file of Object.values(bundle)) {
                if (file.type !== "chunk") continue;
                const result = await transform(file.code, {
                    minify: true,
                    // Drop license/@preserve banners too — this is an
                    // application bundle, not a redistributed library that
                    // needs attribution inline.
                    legalComments: "none",
                    sourcemap: sourcemap ? ("external" as const) : false,
                    // esbuild records this as the map's single `sources` entry;
                    // we key the chaining below off it.
                    sourcefile: file.fileName,
                    loader: "js",
                });
                const priorMap = file.map;
                file.code = result.code;
                if (!sourcemap || !result.map) continue;

                // esbuild's map goes minified -> pre-minified chunk (its single
                // source is `file.fileName`). Chain it onto the chunk's existing
                // map (pre-minified chunk -> original sources) so the shipped
                // map still resolves to original sources. If the chunk somehow
                // had no map, fall back to esbuild's map as-is.
                let mapJson: string;
                if (priorMap) {
                    const remapped = remapping(result.map, (source) =>
                        source === file.fileName
                            ? (priorMap as unknown as SourceMapInput)
                            : null,
                    );
                    file.map = remapped as unknown as typeof file.map;
                    mapJson = remapped.toString();
                } else {
                    mapJson = result.map;
                    file.map = JSON.parse(result.map) as typeof file.map;
                }

                if (sourcemap === "inline") {
                    // Inline mode has no separate `.map` asset; embed the map
                    // as a data URI so browsers still pick it up.
                    const base64 = Buffer.from(mapJson).toString("base64");
                    file.code += `\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,${base64}\n`;
                    continue;
                }

                // Overwrite the stale `.map` asset Rollup already emitted for
                // this chunk with our chained map...
                const mapFileName = file.sourcemapFileName;
                const mapAsset = mapFileName ? bundle[mapFileName] : undefined;
                if (mapAsset?.type === "asset") {
                    mapAsset.source = mapJson;
                }
                // ...and re-add the `sourceMappingURL` comment esbuild stripped
                // (`"hidden"` mode deliberately ships the map without a link).
                if (sourcemap !== "hidden" && mapFileName) {
                    file.code += `\n//# sourceMappingURL=${path.basename(
                        mapFileName,
                    )}\n`;
                }
            }
        },
    };
}

/**
 * Vite plugin to suppress warnings about using eval and some other log messages that clutter the logs.
 */
export function suppressLogPlugin(): PluginOption {
    return {
        name: "suppress-log",
        onLog(level, message) {
            if (message.code === "EVAL") {
                // Don't warn about using eval. We know it's bad and the messages just clutter the logs
                return false;
            }
            if (
                /import.meta.url/.test(message.message) &&
                /@vite-ignore/.test(message.message)
            ) {
                // There is an ignorable warning about import.meta.url that is not relevant to us
                return false;
            }
        },
    };
}

/**
 * Vite's import-analysis warns on runtime-resolved dynamic imports in the
 * generated local `@doenet/prefigure` assets (notably Pyodide loader files).
 * This is needed even when the top-level prefigure module import uses
 * `@vite-ignore`, because Vite separately analyzes nested imports inside those
 * loaded asset files.
 *
 * In dev, DoenetML serves those built files directly from
 * `packages/prefigure/dist/assets/*.js`. Rewriting `import(` to
 * `import(/* @vite-ignore *\/ ` at transform time suppresses the warning while
 * preserving runtime behavior for these vendor-generated scripts.
 */
export function prefigureDynamicImportIgnorePlugin(): PluginOption {
    return {
        name: "prefigure-dynamic-import-ignore",
        enforce: "pre",
        transform(code, id) {
            if (!isPrefigureDistAssetJsId(id)) {
                return null;
            }

            if (!code.includes("import(")) {
                return null;
            }

            const rewrittenCode = code.replaceAll(
                /import\(\s*(?!\/\*\s*@vite-ignore\s*\*\/)/g,
                "import(/* @vite-ignore */ ",
            );

            if (rewrittenCode === code) {
                return null;
            }

            return {
                code: rewrittenCode,
                map: null,
            };
        },
    };
}
