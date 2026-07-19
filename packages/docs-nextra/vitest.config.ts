import { defineConfig } from "vitest/config";

// Unit tests for the pure-policy modules under `components/` (currently the
// windowed-mounting `editor-mount-manager`). They exercise plain TypeScript
// with no DOM, so the default node environment suffices. Defining this config
// also stops Vitest from inheriting `vite.config.ts`, which is the lib build
// for the Next.js remark plugins (not relevant to these tests).
export default defineConfig({
    test: {
        environment: "node",
        include: ["test/**/*.test.ts"],
    },
});
