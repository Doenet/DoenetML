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
 * <manifest-out>, prints the aggregate hash, and sets a `hash` step output
 * when running under GitHub Actions.
 *
 * Two normalizations keep the comparison free of false positives:
 *
 *   - `version` in any package.json is blanked.  The published pre-release
 *     version is derived from the clock, not from the manifest, so a version
 *     bump alone is not a reason to publish.
 *   - Source maps are skipped.  They are derived from the same sources as the
 *     `.js` files beside them, so a real change always shows up in the `.js`,
 *     while the maps carry build-machine paths that can differ for identical
 *     source.
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
function isSourceMap(file) {
    return file.endsWith(".map");
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
            if (isSourceMap(entry.name)) {
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
 * Hash one file's contents, with package.json versions blanked out.
 *
 * @param {string} file
 * @returns {string}
 */
function hashFile(file) {
    let contents = fs.readFileSync(file);
    if (path.basename(file) === "package.json") {
        try {
            const pkg = JSON.parse(contents.toString("utf8"));
            pkg.version = "0.0.0-normalized";
            contents = Buffer.from(JSON.stringify(pkg, null, 4) + "\n");
        } catch {
            // A package.json that does not parse is hashed as-is; a build that
            // produces one has bigger problems than a spurious publish.
        }
    }
    return createHash("sha256").update(contents).digest("hex");
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

if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `hash=${aggregate}\n`);
}
