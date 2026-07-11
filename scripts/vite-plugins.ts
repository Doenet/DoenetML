import { PluginOption } from "vite";
import { transform } from "esbuild";
import remapping from "@jridgewell/remapping";

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
 * `doenet-standalone.js` ships as ~32 MB of un-minified, fully-commented source
 * (346k lines) despite `minify: true`. esbuild's own `transform` API minifies
 * the very same bundle to ~26 MB in ~2s with a valid sourcemap, so the bytes
 * are recoverable; Vite just isn't applying the pass. This plugin runs that
 * esbuild pass explicitly as a post-render step so minification is
 * deterministic and independent of Vite's built-in behavior.
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
        // `generateBundle` runs after every `renderChunk` hook, so nothing in
        // Vite's pipeline can re-serialize the chunk after us. (A `renderChunk`
        // hook here — even `enforce: "post"` — gets overwritten by a later
        // internal Vite renderChunk, leaving the emitted file un-minified.)
        async generateBundle(outputOptions, bundle) {
            const wantSourcemap = !!outputOptions.sourcemap;
            for (const file of Object.values(bundle)) {
                if (file.type !== "chunk") continue;
                const result = await transform(file.code, {
                    minify: true,
                    // Drop license/@preserve banners too — this is an
                    // application bundle, not a redistributed library that
                    // needs attribution inline.
                    legalComments: "none",
                    sourcemap: wantSourcemap
                        ? ("external" as const)
                        : (false as const),
                    // esbuild uses this as the map's `sources` entry and to
                    // key the mapping to the pre-minified chunk.
                    sourcefile: file.fileName,
                    loader: "js",
                });
                const priorMap = file.map;
                file.code = result.code;
                if (wantSourcemap && result.map) {
                    // esbuild's map goes minified -> pre-minified chunk (its
                    // single source is `file.fileName`). If the chunk already
                    // had a map (the normal case for JS chunks), chain onto it
                    // so the shipped sourcemap still resolves to original
                    // sources; otherwise ship esbuild's map as-is.
                    file.map = (priorMap
                        ? remapping(result.map, (source) =>
                              source === file.fileName
                                  ? (priorMap as unknown as Parameters<
                                        typeof remapping
                                    >[0])
                                  : null,
                          )
                        : JSON.parse(result.map)) as unknown as typeof file.map;
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
