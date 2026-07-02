import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: ["test/**/*.test.ts"],
    },
    define: {
        PREFIGURE_VERSION: JSON.stringify("test-version"),
    },
});
