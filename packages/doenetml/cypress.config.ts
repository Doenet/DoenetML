import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { version as doenetmlVersion } from "./package.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codemirrorSrc = path.resolve(__dirname, "../codemirror/src/index.ts");

export default defineConfig({
    // Match the policy `@doenet/test-cypress`, `@doenet/docs-cypress` and
    // `@doenet/doenetml-iframe` already set: retry twice in CI (runMode), never
    // when iterating locally (openMode). Without it a single flake failed the
    // whole `doenetml-cypress` job — which is how both #1612 (a hover
    // re-dispatch race) and #1719 (a viewer that boots slower than the test's
    // wait on a cold 2-core runner) took CI down. Both are timing races on a
    // contended runner rather than wrong assertions, and these are the specs
    // that boot a real core worker, so a second attempt against a warm cache
    // almost always passes. (`@doenet/codemirror` has no retries either —
    // #1612 lists it too — but its component specs drive the editor alone and
    // are left alone here.) Retrying is a safety net, not a diagnosis: a spec
    // that fails every attempt still fails the job, and the `printAppConsole`
    // task below is what says why.
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
                    DOENETML_VERSION: JSON.stringify(doenetmlVersion),
                },
                resolve: {
                    alias: [
                        // Resolve `@doenet/codemirror` to its source rather
                        // than the built dist. The dist embeds the LSP IIFE
                        // (which itself contains a data-URL-inlined WASM) as
                        // a single string literal: when Rust builds the WASM
                        // unoptimized (e.g. CI without `wasm-opt`), that
                        // literal exceeds esbuild's parser limits and Vite's
                        // `vite:client-inject` transform fails with
                        // "Unterminated string literal". Consuming the source
                        // routes the `?raw` LSP import through the
                        // `raw-large-bundle` plugin below, which sidesteps
                        // the problem regardless of WASM size. Subpath
                        // imports (`/style.css`, `/*json`) still resolve via
                        // the package exports against the dist.
                        {
                            find: /^@doenet\/codemirror$/,
                            replacement: codemirrorSrc,
                        },
                    ],
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
                                // Decode base64 → bytes → UTF-8 at runtime.
                                // `atob` alone yields a Latin-1 string, which
                                // turns every multi-byte character in the
                                // bundle — the English message catalogs and
                                // the typography in them, among others — into
                                // mojibake before it reaches the Blob the
                                // worker is built from. The same
                                // plugin in ../doenetml-iframe/cypress.config.ts
                                // decodes its bundle this way; keep the two in
                                // step.
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
                    exclude: [
                        "@doenet/lsp",
                        "@doenet/doenetml-worker",
                        "@doenet/codemirror",
                    ],
                    // Aliasing `@doenet/codemirror` to source means Vite only
                    // discovers its transitive deps when the first spec is
                    // already loading, triggering a mid-flight reload that
                    // aborts the spec's dynamic import (one spec fails, the
                    // next passes). Pre-include them so the first scan
                    // catches everything before any spec runs.
                    include: [
                        "@codemirror/state",
                        "@codemirror/view",
                        "@codemirror/language",
                        "@codemirror/lint",
                        "@codemirror/autocomplete",
                        "@uiw/react-codemirror",
                        "@lezer/highlight",
                        "@qualified/lsp-connection",
                        "@qualified/vscode-jsonrpc-ww",
                        // The LSP value imports — runtime constants
                        // (`CompletionItemKind`, `MarkupKind`) pulled in
                        // by `@doenet/lsp-tools/auto-completer/methods/*`
                        // and the client-side `vscode-languageserver-protocol/browser`
                        // imported directly by `@doenet/codemirror`'s
                        // `lsp/worker.ts`. Without these, Vite first
                        // discovers them while the contextHelp spec is
                        // loading and triggers a "optimized dependencies
                        // changed. reloading" that aborts the spec's
                        // dynamic import.
                        "vscode-languageserver/browser",
                        "vscode-languageserver-protocol/browser",
                    ],
                },
            },
        },
        specPattern: "test/cypress/component/**/*.cy.{js,jsx,ts,tsx}",
        supportFile: "test/cypress/support/component.ts",
        indexHtmlFile: "test/cypress/support/component-index.html",
        setupNodeEvents(on) {
            on("file:preprocessor", vitePreprocessor());
            on("task", {
                /**
                 * Print the app's console warnings and errors from a failing
                 * test into the runner's own output (#1719).
                 *
                 * Nothing the browser logs reaches the terminal under `cypress
                 * run`, so a boot-timing flake arrives on CI as a bare
                 * "expected to find content ... but never did" even though the
                 * boot ladder has already said what went wrong. This is the
                 * printing half of that fix; `test/cypress/support/component.ts`
                 * is the collecting half, and carries the reasoning.
                 */
                printAppConsole({
                    title,
                    attempt,
                    messages,
                }: {
                    title: string;
                    attempt: number;
                    messages: string[];
                }) {
                    console.log(
                        `\n--- app console during failing test (attempt ${attempt}): ${title}`,
                    );
                    for (const message of messages) {
                        console.log(`    ${message}`);
                    }
                    console.log("--- end app console\n");
                    return null;
                },
            });
        },
    },
});
