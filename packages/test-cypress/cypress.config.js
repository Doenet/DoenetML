import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";

export default defineConfig({
    numTestsKeptInMemory: 5,
    defaultCommandTimeout: 30000,
    e2e: {
        // 1. vital for iframes like YouTube
        chromeWebSecurity: false,

        setupNodeEvents(on, config) {
            on("before:browser:launch", (browser = {}, launchOptions) => {
                // Only apply these flags to Chrome-family browsers (Chrome, Chromium, Electron)
                if (
                    browser.family === "chromium" ||
                    browser.name === "electron"
                ) {
                    // 2. Allow autoplay without user interaction
                    launchOptions.args.push(
                        "--autoplay-policy=no-user-gesture-required",
                    );

                    // Optional: Mute audio to avoid any hardware/driver issues in CI
                    launchOptions.args.push("--mute-audio");

                    // Optional: Fake UI for media usually helps with permissions
                    launchOptions.args.push("--use-fake-ui-for-media-stream");
                }

                return launchOptions;
            });
            on("file:preprocessor", vitePreprocessor());
        },

        baseUrl: "http://localhost:4173",
    },
});
