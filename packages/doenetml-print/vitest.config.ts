import { defineConfig } from "vitest/config";
import { webdriverio } from "@vitest/browser-webdriverio";
import arraybuffer from "vite-plugin-arraybuffer";

export default defineConfig({
    base: "./",
    plugins: [arraybuffer()],
    define: {
        "process.env": "{}",
    },
    optimizeDeps: {
        exclude: ["pyodide"],
    },
    test: {
        include: ["test/**/*.test.browser.ts"],
        browser: {
            enabled: true,
            headless: true,
            provider: webdriverio(),
            instances: [{ browser: "chrome" }],
        },
        testTimeout: 300000,
    },
});
