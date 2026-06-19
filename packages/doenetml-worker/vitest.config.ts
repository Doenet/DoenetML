import { defineConfig } from "vitest/config";

// Tests for the FlatDast converters (`flatDastFromJS`, `flatDastUpdateFromJS`).
// Most specs exercise plain TypeScript helpers, but the `*.coreIntegration`
// spec stands up a real JavaScript core (loading the rust resolver WASM from
// disk, as `doenetml-worker-javascript`'s own tests do) to verify the
// converter against authentic core output. The default node environment
// supports both; the integration test reads the WASM via `fs`, so no
// Comlink/Web Worker machinery is needed.
export default defineConfig({
    test: {
        include: ["src/**/*.test.ts"],
        testTimeout: 180000,
    },
});
