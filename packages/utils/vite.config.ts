import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { ignoreWireitCachesPlugin } from "../../scripts/vite-plugins";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [ignoreWireitCachesPlugin(), dts({ rollupTypes: true })],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                index: "./src/index.ts",
                diagnosticMarkdown:
                    "./src/diagnostics/renderDiagnosticMarkdownHtml.ts",
                parseInlineMarkdown: "./src/markdown/parseInlineMarkdown.ts",
                style: "./src/style/index.ts",
                // Its own entry, paired with the matching `exports` subpath in
                // package.json, so the language server can reach it without
                // the root barrel. See
                // `packages/lsp-tools/test/no-root-utils-import.test.ts`.
                mathInputFunctionNames:
                    "./src/components/mathInputFunctionNames.ts",
                mathjax: "./src/math/MathJaxContext.tsx",
            },
            formats: ["es"],
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "@fortawesome/free-solid-svg-icons",
                "@fortawesome/react-fontawesome",
                "better-react-mathjax",
                "math-expressions",
                // Left as a bare import rather than inlined. Consumers of this
                // package overwhelmingly depend on `@doenet/i18n` themselves —
                // the viewer formats diagnostics with it, the worker raises
                // them — and inlining a second copy here would put two Fluent
                // bundles, two message catalogs and two parsers in the same
                // application. Externalized, the consumer's bundler resolves
                // one. See `packages/lsp/scripts/check-server-bundle.mjs` for
                // the check that it also stays out of the language server.
                "@doenet/i18n",
            ],
        },
    },
});
