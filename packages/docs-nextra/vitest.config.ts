import { defineConfig } from "vitest/config";

// Unit tests for this package's pure-policy modules: the windowed-mounting
// `editor-mount-manager` under `components/`, and the schema-history
// derivation under `scripts/`. They exercise plain TypeScript with no DOM, so
// the default node environment suffices. Defining this config
// also stops Vitest from inheriting `vite.config.ts`, which is the lib build
// for the Next.js remark plugins (not relevant to these tests).
export default defineConfig({
    test: {
        environment: "node",
        include: ["test/**/*.test.ts"],
    },
});
