#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PREFIG_WHEEL_FILENAME } from "../src/worker/compiler-metadata";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type VerifyWheelSyncOptions = {
    pyodidePackagesDir: string;
};

export function verifyWheelSync({
    pyodidePackagesDir,
}: VerifyWheelSyncOptions): string {
    if (!fs.existsSync(pyodidePackagesDir)) {
        throw new Error(
            `Missing pyodide packages directory: ${pyodidePackagesDir}`,
        );
    }

    const configuredWheel = PREFIG_WHEEL_FILENAME;
    if (
        !(
            configuredWheel.startsWith("prefig-") &&
            configuredWheel.endsWith(".whl")
        )
    ) {
        throw new Error(
            `PREFIG_WHEEL_FILENAME is not a prefig wheel filename: ${configuredWheel}`,
        );
    }

    const prefigWheels = fs
        .readdirSync(pyodidePackagesDir)
        .filter((f) => f.startsWith("prefig-") && f.endsWith(".whl"));

    if (prefigWheels.length === 0) {
        throw new Error("No prefig wheel found in pyodide_packages/");
    }

    if (prefigWheels.length > 1) {
        throw new Error(
            `Multiple prefig wheels found in pyodide_packages/: ${prefigWheels.join(", ")}`,
        );
    }

    const packagedWheel = prefigWheels[0];
    if (configuredWheel !== packagedWheel) {
        throw new Error(
            `Wheel mismatch: compiler-metadata.ts uses ${configuredWheel}, but pyodide_packages contains ${packagedWheel}`,
        );
    }

    return configuredWheel;
}

function runCli() {
    const pyodidePackagesDir = path.join(__dirname, "..", "pyodide_packages");

    try {
        const configuredWheel = verifyWheelSync({ pyodidePackagesDir });
        console.log(`✅ Prefigure wheel sync OK: ${configuredWheel}`);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`❌ ${message}`);
        process.exit(1);
    }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    runCli();
}
