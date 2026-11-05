/**
 * Carry one commit's package versions over to another commit's working tree.
 *
 * The pre-release workflow compares the extension built at two commits, and a
 * build bakes package versions into its output (`DOENETML_VERSION` in the
 * editor footer, for one). Left alone, a changesets "Version Packages" merge —
 * which changes nothing but version numbers — would make the two builds differ
 * and publish a pre-release with no change in it. Building the baseline under
 * the current commit's versions makes the comparison see code changes only,
 * while the current build, which is the one published, keeps its own versions.
 *
 * Usage:
 *   node package-versions.mjs save <versions-out>   # at the current commit
 *   node package-versions.mjs apply <versions-in>   # at the baseline commit
 *
 * Both run from the repository root. `save` records the `version` of every
 * tracked package.json; `apply` writes those versions into whichever of the
 * same files exist, changing only the version string so that the rest of each
 * file stays byte-for-byte as committed.
 */

import { execFileSync } from "node:child_process";
import * as fs from "node:fs";

const [command, file] = process.argv.slice(2);

if (!["save", "apply"].includes(command) || !file) {
    console.error(
        "Usage: node package-versions.mjs <save|apply> <versions-file>",
    );
    process.exit(1);
}

if (command === "save") {
    const paths = execFileSync("git", ["ls-files", "*package.json"], {
        encoding: "utf8",
    })
        .split("\n")
        .filter(Boolean);

    /** @type {Record<string, string>} */
    const versions = {};
    for (const p of paths) {
        const version = JSON.parse(fs.readFileSync(p, "utf8")).version;
        if (typeof version === "string") {
            versions[p] = version;
        }
    }
    fs.writeFileSync(file, JSON.stringify(versions, null, 4) + "\n");
    console.log(`Recorded ${Object.keys(versions).length} package versions.`);
} else {
    /** @type {Record<string, string>} */
    const versions = JSON.parse(fs.readFileSync(file, "utf8"));
    let changed = 0;
    for (const [p, version] of Object.entries(versions)) {
        if (!fs.existsSync(p)) {
            continue;
        }
        const text = fs.readFileSync(p, "utf8");
        const current = JSON.parse(text).version;
        if (typeof current !== "string" || current === version) {
            continue;
        }
        // The first `"version": "…"` is the top-level one in every package.json
        // here; checking that it holds the parsed value guards against a file
        // where a nested key comes first.
        const pattern = /("version"\s*:\s*)"([^"\\]*)"/;
        const match = text.match(pattern);
        let updated;
        if (match && match[2] === current) {
            updated = text.replace(pattern, `$1${JSON.stringify(version)}`);
        } else {
            const pkg = JSON.parse(text);
            pkg.version = version;
            updated = JSON.stringify(pkg, null, 4) + "\n";
        }
        fs.writeFileSync(p, updated);
        console.log(`${p}: ${current} -> ${version}`);
        changed++;
    }
    console.log(`Applied ${changed} package version(s).`);
}
