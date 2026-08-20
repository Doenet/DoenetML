import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: ["test/**/*.test.ts"],
        // The wasm build (`npm run build:rust`) must run before tests, since
        // the wrapper imports the generated `pkg/prefig_wasm.js` glue code
        // directly.
        testTimeout: 20000,
    },
});
