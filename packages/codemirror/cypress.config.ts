import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import fs from "fs";

export default defineConfig({
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
            viteConfig: {
                plugins: [
                    {
                        // The LSP IIFE bundle (≈7 MB, with inlined WASM)
                        // triggers a parse error in Vite's import-analysis
                        // when imported with `?raw`.  This plugin intercepts
                        // the load and returns a plain string export.
                        name: "raw-lsp-bundle",
                        enforce: "pre" as const,
                        load(id: string) {
                            if (
                                /[?&]raw\b/.test(id) &&
                                (id.includes("@doenet/lsp") ||
                                    id.includes("/packages/lsp/"))
                            ) {
                                const filePath = id.replace(/[?#].*$/, "");
                                const content = fs.readFileSync(
                                    filePath,
                                    "utf-8",
                                );
                                // Convert to base64 and decode at runtime to
                                // avoid a multi-MB string literal that
                                // es-module-lexer cannot parse.
                                const b64 =
                                    Buffer.from(content).toString("base64");
                                return `export default atob(${JSON.stringify(b64)});`;
                            }
                        },
                    },
                ],
                optimizeDeps: {
                    exclude: ["@doenet/lsp"],
                },
            },
        },
        specPattern: "test/cypress/component/**/*.cy.{js,jsx,ts,tsx}",
        supportFile: "test/cypress/support/component.ts",
        indexHtmlFile: "test/cypress/support/component-index.html",
        setupNodeEvents(on) {
            on("file:preprocessor", vitePreprocessor());
        },
    },
});
