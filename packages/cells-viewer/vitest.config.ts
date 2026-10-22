import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// The tests render documents to HTML in Node, as a server prerendering a
// page would: JSXGraph, which cannot load outside a browser, is replaced by
// its stand-in. They read `@doenet/parser` and the core's wasm from their
// builds (`npm run build -w @doenet/parser -w @doenet/cells-core`).
export default defineConfig({
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
        include: ["src/**/*.test.{ts,tsx}"],
        environment: "node",
        testTimeout: 60000,
    },
});
