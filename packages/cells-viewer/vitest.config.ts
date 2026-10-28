import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Two kinds of test, each in the environment it needs. Both read
// `@doenet/parser` and the core's wasm from their builds, which the `test`
// script builds first.
export default defineConfig({
    test: {
        projects: [
            {
                // Render documents to HTML in Node, as a server prerendering
                // a page would: JSXGraph, which cannot load outside a
                // browser, is replaced by its stand-in.
                resolve: {
                    alias: [
                        {
                            find: /^jsxgraph$/,
                            replacement: fileURLToPath(
                                new URL(
                                    "./src/prerender/jsxgraph-stub.ts",
                                    import.meta.url,
                                ),
                            ),
                        },
                    ],
                },
                test: {
                    name: "prerender",
                    include: ["src/prerender/**/*.test.{ts,tsx}"],
                    environment: "node",
                    testTimeout: 60000,
                },
            },
            {
                // Drive the renderers, JSXGraph included, in jsdom;
                // `pretendToBeVisual` gives it `requestAnimationFrame`,
                // which a tick schedules.
                test: {
                    name: "renderers",
                    include: ["src/**/*.test.{ts,tsx}"],
                    exclude: ["src/prerender/**"],
                    environment: "jsdom",
                    environmentOptions: { jsdom: { pretendToBeVisual: true } },
                },
            },
        ],
    },
});
