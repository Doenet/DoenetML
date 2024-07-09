import { Plugin, PluginOption } from "vite";
import { defineWorkspace, defaultInclude } from "vitest/config";

const omitCssPlugin: Plugin = {
    name: "omit-css",
    enforce: "pre",
    transform(code, id) {
        if (id.endsWith(".css")) {
            return {
                code: "",
            };
        }
    },
};

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
        plugins: [
            // vitest running in th browser won't transform CSS correctly, so we strip away all CSS files
            omitCssPlugin,
        ],
    },
]);
