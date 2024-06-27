import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";

export default defineConfig({
    numTestsKeptInMemory: 5,
    defaultCommandTimeout: 30000,
    e2e: {
        setupNodeEvents(on, config) {
            on("before:browser:launch", (browser = {}, launchOptions) => {
                if (browser.name === "chrome") {
                    launchOptions.args.push("--mute-audio");
                }
                return launchOptions;
            });
            on("file:preprocessor", vitePreprocessor());
        },

        baseUrl: "http://localhost:4173",
    },
});
