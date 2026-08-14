// Not runnable as committed: this package has no `test` script, and
// `@vitest/browser-webdriverio` is not a dependency of this repo. Landed with
// the print/PreTeXt workstream rather than with the math-engine switch; wire it
// up (add the dependency and a `test` script) or drop it.
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
