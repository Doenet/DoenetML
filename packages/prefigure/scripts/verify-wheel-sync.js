#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fail(message) {
    console.error(`❌ ${message}`);
    process.exit(1);
}

const compilerPath = path.join(__dirname, "..", "src", "worker", "compiler.ts");
const pyodidePackagesDir = path.join(__dirname, "..", "pyodide_packages");

if (!fs.existsSync(compilerPath)) {
    fail(`Missing compiler file: ${compilerPath}`);
}

if (!fs.existsSync(pyodidePackagesDir)) {
    fail(`Missing pyodide packages directory: ${pyodidePackagesDir}`);
}

const compilerContent = fs.readFileSync(compilerPath, "utf8");
const constantMatch = compilerContent.match(
    /export const PREFIG_WHEEL_FILENAME = "([^"]+)";/,
);

if (!constantMatch) {
    fail("Could not parse PREFIG_WHEEL_FILENAME from compiler.ts");
}

const configuredWheel = constantMatch[1];
if (
    !(configuredWheel.startsWith("prefig-") && configuredWheel.endsWith(".whl"))
) {
    fail(
        `PREFIG_WHEEL_FILENAME is not a prefig wheel filename: ${configuredWheel}`,
    );
}

const prefigWheels = fs
    .readdirSync(pyodidePackagesDir)
    .filter((f) => f.startsWith("prefig-") && f.endsWith(".whl"));

if (prefigWheels.length === 0) {
    fail("No prefig wheel found in pyodide_packages/");
}

if (prefigWheels.length > 1) {
    fail(
        `Multiple prefig wheels found in pyodide_packages/: ${prefigWheels.join(", ")}`,
    );
}

const packagedWheel = prefigWheels[0];
if (configuredWheel !== packagedWheel) {
    fail(
        `Wheel mismatch: compiler.ts uses ${configuredWheel}, but pyodide_packages contains ${packagedWheel}`,
    );
}

console.log(`✅ Prefigure wheel sync OK: ${configuredWheel}`);
