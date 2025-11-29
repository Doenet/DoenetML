import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";

export default defineConfig({
    numTestsKeptInMemory: 5,
    defaultCommandTimeout: 30000,
    e2e: {
        // vital for iframes like YouTube
        chromeWebSecurity: false,

        setupNodeEvents(on, config) {
            on("before:browser:launch", (browser = {}, launchOptions) => {
                // Only apply these flags to Chrome-family browsers (Chrome, Chromium, Electron)
                if (
                    browser.family === "chromium" ||
                    browser.name === "electron"
                ) {
                    // Allow autoplay without user interaction
                    launchOptions.args.push(
                        "--autoplay-policy=no-user-gesture-required",
                    );

                    // Mute audio to avoid any hardware/driver issues in CI
                    launchOptions.args.push("--mute-audio");

                    // Fake UI for media usually helps with permissions
                    launchOptions.args.push("--use-fake-ui-for-media-stream");
                }

                return launchOptions;
            });
            on("file:preprocessor", vitePreprocessor());
        },

        baseUrl: "http://localhost:4173",
    },
});
