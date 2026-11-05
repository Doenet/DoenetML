/**
 * Fingerprint a built VS Code extension so two builds can be compared.
 *
 * The pre-release workflow builds the extension at two commits and publishes
 * only when the results differ, which keeps commits that never reach the
 * extension (docs, tests, other packages) from producing a Marketplace
 * release.  This script turns a built extension directory into that
 * comparable fingerprint.
 *
 * Usage:
 *   node hash-vscode-extension.mjs <extension-dir> <manifest-out>
 *
 * Writes a manifest of `<sha256>  <relative path>` lines, sorted by path, to
 * <manifest-out> and prints the aggregate hash.
 *
 * Two kinds of file are skipped:
 *
 *   - Source maps.  They are derived from the same sources as the `.js` files
 *     beside them, so a real change always shows up in the `.js`, while the
 *     maps carry build-machine paths that can differ for identical source.
 *   - `CHANGELOG.md`.  Only a changesets "Version Packages" merge writes it,
 *     and the entries it adds describe stable releases.
 *
 * A version bump alone does not register as a change, because the workflow
 * builds the baseline under the current commit's package versions (see
 * `package-versions.mjs`).
 */

import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";

const [extensionDir, manifestOut] = process.argv.slice(2);

if (!extensionDir || !manifestOut) {
    console.error(
        "Usage: node hash-vscode-extension.mjs <extension-dir> <manifest-out>",
    );
    process.exit(1);
}

if (!fs.existsSync(extensionDir)) {
    console.error(`Extension directory does not exist: ${extensionDir}`);
    process.exit(1);
}

/** Directories that are never part of what the extension ships. */
const SKIP_DIRS = new Set([".git", "node_modules"]);

/** @param {string} file */
function isSkipped(file) {
    return file.endsWith(".map") || file === "CHANGELOG.md";
}

/** @type {string[]} */
const files = [];

/** @param {string} dir */
function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (SKIP_DIRS.has(entry.name)) {
                continue;
            }
            walk(full);
        } else if (entry.isFile()) {
            if (isSkipped(entry.name)) {
                continue;
            }
            files.push(full);
        }
    }
}

walk(extensionDir);

if (files.length === 0) {
    console.error(`No files found under ${extensionDir} — was it built?`);
    process.exit(1);
}

/**
 * @param {string} file
 * @returns {string}
 */
function hashFile(file) {
    return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const lines = files
    .map((file) => ({
        rel: path.relative(extensionDir, file).split(path.sep).join("/"),
        file,
    }))
    .sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0))
    .map(({ rel, file }) => `${hashFile(file)}  ${rel}`);

const manifest = lines.join("\n") + "\n";
fs.writeFileSync(manifestOut, manifest);

const aggregate = createHash("sha256").update(manifest).digest("hex");

console.log(`Hashed ${lines.length} files under ${extensionDir}`);
console.log(`Manifest: ${manifestOut}`);
console.log(`Aggregate hash: ${aggregate}`);
