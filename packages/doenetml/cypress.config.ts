import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import fs from "fs";
import { version as doenetmlVersion } from "./package.json";

export default defineConfig({
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
            viteConfig: {
                define: {
                    DOENETML_VERSION: JSON.stringify(doenetmlVersion),
                },
                plugins: [
                    {
                        // Large pre-built IIFE bundles imported via `?raw`
                        // (the LSP language server, the inlined doenetml worker)
                        // trigger a parse error in Vite's import-analysis on
                        // its multi-MB string literal. Intercept the load and
                        // return a base64-encoded string that decodes at
                        // runtime so es-module-lexer never sees the raw blob.
                        name: "raw-large-bundle",
                        enforce: "pre" as const,
                        load(id: string) {
                            if (
                                /[?&]raw\b/.test(id) &&
                                (id.includes("@doenet/lsp") ||
                                    id.includes("/packages/lsp/") ||
                                    id.includes("@doenet/doenetml-worker") ||
                                    id.includes("/packages/doenetml-worker/"))
                            ) {
                                const filePath = id.replace(/[?#].*$/, "");
                                const content = fs.readFileSync(
                                    filePath,
                                    "utf-8",
                                );
                                const b64 =
                                    Buffer.from(content).toString("base64");
                                return `export default atob(${JSON.stringify(b64)});`;
                            }
                        },
                    },
                ],
                optimizeDeps: {
                    exclude: ["@doenet/lsp", "@doenet/doenetml-worker"],
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
