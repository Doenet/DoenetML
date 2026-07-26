import { defineConfig } from "vitest/config";

// The package ships no source tests — it is a bundling target. The one suite
// here covers `scripts/check-bundle-size.mjs`, the guard that keeps the built
// bundles from growing silently.
//
// This file exists mostly so the test run does not fall back to `vite.config.ts`,
// which is the lib build: `vite-plugin-dts` and `vite-plugin-static-copy` have no
// business loading to run a handful of unit tests. (`dist/` needs no exclusion of
// its own — vitest already ignores `**/dist/**`.)
export default defineConfig({
    test: {
        environment: "node",
        include: ["scripts/**/*.test.mjs"],
    },
});
