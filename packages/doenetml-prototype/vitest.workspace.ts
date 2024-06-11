import { defineWorkspace, defaultInclude } from "vitest/config";

export default defineWorkspace([
    {
        // use vite.config.ts as a default config for all
        extends: "./vite.config.ts",
        test: {
            name: "node",
            include: ["test/*.test.ts"],
        },
    },
    {
        extends: "./vite.config.ts",
        test: {
            name: "browser",
            include: ["test/*.test.browser.ts"],
            browser: {
                enabled: true,
                name: "chrome",
                headless: true,
            },
        },
    },
]);
