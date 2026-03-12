#!/usr/bin/env node

/**
 * Update prefigure wheel from the latest PyPI release.
 * Fetches prefig[pycairo], extracts the wheel filename,
 * copies it to pyodide_packages/, and updates compiler.ts.
 * Logs the version for manual package.json update.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create temp directory for pip wheel download
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prefigure-update-"));

try {
    console.log("Fetching latest prefigure from PyPI...\n");

    // Download wheel using pip wheel
    // --only-binary=:all: ensures we get a binary wheel (pre-built)
    execSync(`pip wheel prefig[pycairo] --only-binary=:all: -w "${tempDir}"`, {
        stdio: "pipe",
    });

    // Find the prefig .whl file (ignore dependencies)
    const files = fs.readdirSync(tempDir);
    const wheelFile = files.find(
        (f) => f.startsWith("prefig-") && f.endsWith(".whl"),
    );

    if (!wheelFile) {
        throw new Error("No prefig .whl file found in pip wheel output");
    }

    console.log(`Found wheel: ${wheelFile}`);

    // Extract version from filename (e.g., prefig-0.5.10-py3-none-any.whl)
    const versionMatch = wheelFile.match(/prefig-([^-]+)-/);
    if (!versionMatch) {
        throw new Error(`Could not extract version from ${wheelFile}`);
    }
    const version = versionMatch[1];

    // Ensure pyodide_packages directory exists
    const pyodidePackagesDir = path.join(__dirname, "..", "pyodide_packages");
    fs.mkdirSync(pyodidePackagesDir, { recursive: true });

    // Remove old prefig wheels to avoid confusion
    const oldWheels = fs
        .readdirSync(pyodidePackagesDir)
        .filter((f) => f.startsWith("prefig-") && f.endsWith(".whl"));
    for (const oldWheel of oldWheels) {
        fs.unlinkSync(path.join(pyodidePackagesDir, oldWheel));
        console.log(`Removed old wheel: ${oldWheel}`);
    }

    // Copy new wheel to pyodide_packages
    const destPath = path.join(pyodidePackagesDir, wheelFile);
    fs.copyFileSync(path.join(tempDir, wheelFile), destPath);
    console.log(`Copied wheel to ${destPath}\n`);

    // Update PREFIG_WHEEL_FILENAME in compiler.ts
    const compilerPath = path.join(
        __dirname,
        "..",
        "src",
        "worker",
        "compiler.ts",
    );
    let compilerContent = fs.readFileSync(compilerPath, "utf8");
    const oldPattern =
        /export const PREFIG_WHEEL_FILENAME = "prefig-[^"]+.whl";/;
    const newPattern = `export const PREFIG_WHEEL_FILENAME = "${wheelFile}";`;

    if (!oldPattern.test(compilerContent)) {
        throw new Error(
            "Could not find PREFIG_WHEEL_FILENAME constant in compiler.ts",
        );
    }

    compilerContent = compilerContent.replace(oldPattern, newPattern);
    fs.writeFileSync(compilerPath, compilerContent);

    const updatedCompilerContent = fs.readFileSync(compilerPath, "utf8");
    const updatedMatch = updatedCompilerContent.match(
        /export const PREFIG_WHEEL_FILENAME = "([^"]+)";/,
    );
    if (!updatedMatch || updatedMatch[1] !== wheelFile) {
        throw new Error(
            `Failed to update PREFIG_WHEEL_FILENAME in compiler.ts to ${wheelFile}`,
        );
    }

    console.log(
        `Updated PREFIG_WHEEL_FILENAME in compiler.ts to "${wheelFile}"\n`,
    );

    // Success message with instructions
    console.log(`✅ Prefigure updated successfully to version ${version}\n`);
    console.log(`📝 Next step: Update package.json version to match:`);
    console.log(`   In packages/prefigure/package.json, change:`);
    console.log(`   "version": "X.X.X"  →  "version": "${version}"`);
    console.log(`\n📦 Then rebuild:  npm run build -w @doenet/prefigure`);
} catch (error) {
    console.error("❌ Error updating prefigure:", error.message);
    process.exit(1);
} finally {
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
}
