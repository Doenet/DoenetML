import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { version as iframeVersion } from "./package.json";

const HERE = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    // Match @doenet/test-cypress's policy: retry twice in CI (runMode), no
    // retries when iterating locally (openMode). The component specs that
    // double-boot the ~32 MB @doenet/standalone bundle (notably
    // DoenetEditor.srcDocRebuildReplay) ride right at the edge of cold CI
    // runners' budget and don't have a logic flake — they have a
    // boot-cost flake. Without this, an unlucky cold start fails the whole
    // job; with it, the second attempt almost always passes against a
    // warmed-up disk cache and V8 isolate.
    retries: {
        runMode: 2,
        openMode: 0,
    },
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
                resolve: {
                    // Component specs may import linked workspace packages
                    // (notably @doenet/virtual-keyboard) directly. Dedupe
                    // React so those packages share the same hook dispatcher as
                    // Cypress's React mount runtime.
                    dedupe: ["react", "react-dom"],
                },
                plugins: [
                    {
                        // The standalone bundle no longer embeds the core
                        // worker — it loads it from a URL. Because these
                        // specs load the bundle from a Blob URL (below),
                        // "next to the bundle" does not exist, and the bundle
                        // falls back to `<origin>/doenetml-worker/index.js`.
                        // Serve the built worker there.
                        name: "serve-doenetml-worker",
                        configureServer(server: any) {
                            const workerDist = path.resolve(
                                HERE,
                                "../doenetml-worker/dist",
                            );
                            const MIME: Record<string, string> = {
                                ".js": "text/javascript",
                                ".mjs": "text/javascript",
                                ".map": "application/json",
                                ".wasm": "application/wasm",
                            };
                            server.middlewares.use(
                                "/doenetml-worker",
                                (req: any, res: any, next: any) => {
                                    const rel = (req.url ?? "")
                                        .replace(/[?#].*$/, "")
                                        .replace(/^\/+/, "");
                                    const file = path.join(
                                        workerDist,
                                        rel || "index.js",
                                    );
                                    if (
                                        !file.startsWith(workerDist) ||
                                        !fs.existsSync(file) ||
                                        fs.statSync(file).isDirectory()
                                    ) {
                                        return next();
                                    }
                                    res.setHeader(
                                        "content-type",
                                        MIME[path.extname(file)] ??
                                            "application/octet-stream",
                                    );
                                    fs.createReadStream(file).pipe(res);
                                },
                            );
                        },
                    },
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
