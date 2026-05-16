import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import fs from "fs";
import { version as iframeVersion } from "./package.json";

export default defineConfig({
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
            viteConfig: {
                define: {
                    // Mirrors the `define` block in vite.config.ts so
                    // `src/index.tsx`'s top-level `IFRAME_VERSION` reference
                    // resolves at cypress dev-server compile time too.
                    IFRAME_VERSION: JSON.stringify(iframeVersion),
                },
                plugins: [
                    {
                        // The @doenet/standalone bundle (~32 MB JS, plus a
                        // multi-MB CSS file) is imported as `?raw` and wrapped
                        // in a Blob URL for the iframe. Inlined as a string
                        // literal, the JS bundle exceeds esbuild's parser
                        // limit for string-literal source files. Decode at
                        // runtime instead — the same workaround used in
                        // ../doenetml/cypress.config.ts for its LSP/worker
                        // bundles.
                        name: "raw-large-bundle",
                        enforce: "pre" as const,
                        load(id: string) {
                            if (
                                /[?&]raw\b/.test(id) &&
                                (id.includes("@doenet/standalone") ||
                                    id.includes("/packages/standalone/"))
                            ) {
                                const filePath = id.replace(/[?#].*$/, "");
                                const content = fs.readFileSync(
                                    filePath,
                                    "utf-8",
                                );
                                const b64 =
                                    Buffer.from(content).toString("base64");
                                // Decode base64 → bytes → UTF-8 string at
                                // runtime. Plain `atob()` returns a Latin-1
                                // string and mangles multi-byte characters
                                // present in the bundled JS, which makes the
                                // resulting Blob fail to evaluate inside the
                                // iframe.
                                return `
                                    const __bin = atob(${JSON.stringify(b64)});
                                    const __bytes = new Uint8Array(__bin.length);
                                    for (let i = 0; i < __bin.length; i++) __bytes[i] = __bin.charCodeAt(i);
                                    export default new TextDecoder("utf-8").decode(__bytes);
                                `;
                            }
                        },
                    },
                ],
                optimizeDeps: {
                    exclude: ["@doenet/standalone"],
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
