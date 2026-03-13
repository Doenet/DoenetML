#!/usr/bin/env node

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.join(__dirname, "..");

const host = "127.0.0.1";
const port = 4175;
const baseUrl = `http://${host}:${port}`;

function runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: packageRoot,
            stdio: "inherit",
            ...options,
        });

        child.on("error", reject);
        child.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${command} exited with code ${code}`));
            }
        });
    });
}

function waitForChildExit(child, timeoutMs = 10000) {
    return new Promise((resolve) => {
        if (child.exitCode !== null) {
            resolve();
            return;
        }

        const timer = setTimeout(() => {
            if (child.exitCode === null) {
                child.kill("SIGKILL");
            }
        }, timeoutMs);

        child.once("close", () => {
            clearTimeout(timer);
            resolve();
        });
    });
}

async function stopChildProcess(child) {
    if (!child || child.exitCode !== null) {
        return;
    }

    child.kill("SIGTERM");
    await waitForChildExit(child);
}

async function waitForServerReady(timeoutMs = 120000) {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        try {
            const response = await fetch(baseUrl);
            if (response.ok) {
                return;
            }
        } catch {
            // Server not ready yet.
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error(`Timed out waiting for ${baseUrl}`);
}

async function main() {
    await runCommand("npm", ["run", "build"]);

    const viteProcess = spawn(
        "npx",
        ["vite", "--host", host, "--strictPort", "--port", String(port)],
        {
            cwd: packageRoot,
            stdio: "inherit",
        },
    );

    const onInterrupt = async () => {
        await stopChildProcess(viteProcess);
        process.exit(130);
    };

    process.on("SIGINT", onInterrupt);
    process.on("SIGTERM", onInterrupt);

    try {
        await waitForServerReady();

        await runCommand("npx", [
            "cypress",
            "run",
            "--config-file",
            "cypress.config.js",
            "-b",
            "chrome",
            "--headless",
            "--config",
            `baseUrl=${baseUrl},video=false,screenshotOnRunFailure=false`,
            "--spec",
            "test/cypress/prefigure-smoke.cy.js",
        ]);
    } finally {
        process.off("SIGINT", onInterrupt);
        process.off("SIGTERM", onInterrupt);
        await stopChildProcess(viteProcess);
    }
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});
