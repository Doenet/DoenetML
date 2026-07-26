import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true })],
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
            ],
        },
    },
});
