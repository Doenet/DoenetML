import { PluginOption } from "vite";

const PREFIGURE_DIST_ASSET_JS_RE =
    /\/packages\/prefigure\/dist\/assets\/.*\.js(?:\?.*)?$/;

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
            if (!PREFIGURE_DIST_ASSET_JS_RE.test(id)) {
                return null;
            }

            if (!code.includes("import(") || code.includes("@vite-ignore")) {
                return null;
            }

            return {
                code: code.replaceAll("import(", "import(/* @vite-ignore */ "),
                map: null,
            };
        },
    };
}
