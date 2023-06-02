const { defineConfig } = require("cypress");

module.exports = defineConfig({
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
    baseUrl: "http://localhost:5173",
  },
});
