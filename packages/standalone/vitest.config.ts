import { defineConfig } from "vitest/config";

// The package ships no source tests — it is a bundling target. The one suite
// here covers `scripts/check-bundle-size.mjs`, the guard that keeps the built
// bundles from growing silently. Scoped to `scripts/` so vitest never walks the
// multi-megabyte `dist/` output.
export default defineConfig({
    test: {
        environment: "node",
        include: ["scripts/**/*.test.mjs"],
    },
});
