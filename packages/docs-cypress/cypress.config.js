import { defineConfig } from "cypress";

export default defineConfig({
    defaultCommandTimeout: 15000,
    retries: {
        runMode: 2,
        openMode: 0,
    },
    e2e: {
        baseUrl: "http://localhost:3000",
        setupNodeEvents(_on, _config) {},
    },
});
