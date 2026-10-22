import { defineConfig } from "@playwright/test";

// One id per invocation, inherited by every worker, so a worker started
// after a test times out appends to the layer's records instead of opening
// it again (see openRun).
process.env.BENCH_SESSION ??= `${process.pid}-${Date.now()}`;

export default defineConfig({
    testDir: ".",
    testMatch: /(perf|trace|load|parity)\.spec\.ts/,
    timeout: 600_000,
    workers: 1,
    retries: 0,
    reporter: "list",
    use: {
        headless: true,
        viewport: { width: 1000, height: 800 },
        // The workspace's Playwright may be newer than the browsers on this
        // machine; BENCH_CHROMIUM points it at one that is installed.
        launchOptions: process.env.BENCH_CHROMIUM
            ? { executablePath: process.env.BENCH_CHROMIUM }
            : {},
    },
    webServer: {
        command: "node browser/serve.mjs",
        cwd: "..",
        url: "http://localhost:4174/health",
        reuseExistingServer: true,
        timeout: 30_000,
    },
});
