import { defineConfig } from "vitest/config";

// Unit tests for the pure FlatDast converters (`flatDastFromJS`,
// `flatDastUpdateFromJS`). These exercise plain TypeScript helpers and do not
// load the WASM/Comlink machinery in `CoreWorker`, so no special environment is
// required.
export default defineConfig({
    test: {
        include: ["src/**/*.test.ts"],
    },
});
