import { defineConfig } from "vitest/config";

// This package is mostly a bundling target, so there is little here to unit
// test: `scripts/check-bundle-size.mjs`, the guard that keeps the built bundles
// from growing silently, and any source module that holds logic of its own
// rather than wiring up the viewer.
//
// This file exists mostly so the test run does not fall back to `vite.config.ts`,
// which is the lib build: `vite-plugin-dts` and `vite-plugin-static-copy` have no
// business loading to run a handful of unit tests. (`dist/` needs no exclusion of
// its own — vitest already ignores `**/dist/**`.)
export default defineConfig({
    test: {
        environment: "node",
        include: [
            "scripts/**/*.test.mjs",
            "scripts/**/*.test.ts",
            "src/**/*.test.ts",
        ],
    },
});
