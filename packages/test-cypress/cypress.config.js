import { defineConfig } from "cypress";

export default defineConfig({
    numTestsKeptInMemory: 20,
    defaultCommandTimeout: 30000,
    e2e: {
        setupNodeEvents(on, config) {
            on("before:browser:launch", (browser = {}, launchOptions) => {
                if (browser.name === "chrome") {
                    launchOptions.args.push("--mute-audio");
                }
                return launchOptions;
            });
        },

        baseUrl: "http://localhost:4173",
    },
});
