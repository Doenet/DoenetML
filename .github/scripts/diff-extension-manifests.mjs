/**
 * Summarize the difference between two extension fingerprint manifests as
 * markdown, for the pre-release workflow's job summary.
 *
 * Usage:
 *   node diff-extension-manifests.mjs <baseline-manifest> <current-manifest>
 *
 * A raw `diff` of the manifests is close to unreadable: Vite gives chunks
 * content-hashed names, so changing one shared module renames most of the
 * import graph — a one-line source fix showed up as ~100 added and ~100
 * removed lines.  Collapsing those hashes back to `name-*.js` turns the same
 * change into "97 files modified", which is what a reader actually wants.
 *
 * This only formats the report.  The publish decision is made by a plain
 * byte comparison of the manifests in the workflow, so nothing here can cause
 * a change to be missed.
 */

import * as fs from "node:fs";

const [basePath, currentPath] = process.argv.slice(2);

if (!basePath || !currentPath) {
    console.error(
        "Usage: node diff-extension-manifests.mjs <baseline-manifest> <current-manifest>",
    );
    process.exit(1);
}

/** How many individual files to name before collapsing into a count. */
const MAX_LISTED = 40;

/**
 * Collapse a content hash in a built filename, so that the same chunk before
 * and after a rebuild lines up: `codeEditor-ObpSVeQN.js` -> `codeEditor-*.js`.
 *
 * @param {string} filePath
 * @returns {string}
 */
function collapseContentHash(filePath) {
    return filePath.replace(/-[A-Za-z0-9_-]{8,}(\.[^./]+)$/, "-*$1");
}

/**
 * @param {string} file
 * @returns {Map<string, Set<string>>} collapsed path -> content hashes
 */
function readManifest(file) {
    /** @type {Map<string, Set<string>>} */
    const entries = new Map();
    const text = fs.readFileSync(file, "utf8");
    for (const line of text.split("\n")) {
        if (!line.trim()) {
            continue;
        }
        const separator = line.indexOf("  ");
        const hash = line.slice(0, separator);
        const key = collapseContentHash(line.slice(separator + 2));
        const hashes = entries.get(key) ?? new Set();
        hashes.add(hash);
        entries.set(key, hashes);
    }
    return entries;
}

const base = readManifest(basePath);
const current = readManifest(currentPath);

/** @type {string[]} */
const added = [];
/** @type {string[]} */
const removed = [];
/** @type {string[]} */
const modified = [];

for (const [key, hashes] of current) {
    const before = base.get(key);
    if (!before) {
        added.push(key);
    } else if (
        before.size !== hashes.size ||
        [...hashes].some((h) => !before.has(h))
    ) {
        modified.push(key);
    }
}
for (const key of base.keys()) {
    if (!current.has(key)) {
        removed.push(key);
    }
}

const total = added.length + removed.length + modified.length;

if (total === 0) {
    console.log("The built extension is **unchanged**.");
    process.exit(0);
}

const parts = [];
if (added.length) {
    parts.push(`${added.length} added`);
}
if (removed.length) {
    parts.push(`${removed.length} removed`);
}
if (modified.length) {
    parts.push(`${modified.length} modified`);
}

console.log(`The built extension **changed**: ${parts.join(", ")}.`);
console.log("");

/**
 * @param {string} label
 * @param {string[]} keys
 */
function report(label, keys) {
    if (!keys.length) {
        return;
    }
    console.log(`<details><summary>${label} (${keys.length})</summary>`);
    console.log("");
    console.log("```");
    for (const key of keys.sort().slice(0, MAX_LISTED)) {
        console.log(key);
    }
    if (keys.length > MAX_LISTED) {
        console.log(`… and ${keys.length - MAX_LISTED} more`);
    }
    console.log("```");
    console.log("");
    console.log("</details>");
    console.log("");
}

report("Added", added);
report("Removed", removed);
report("Modified", modified);
