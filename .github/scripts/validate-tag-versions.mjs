/**
 * Validate that all release package versions match the expected release version.
 *
 * Required environment variables:
 *   RELEASE_VERSION  - The version string to validate against (e.g. "1.2.3")
 */

import { readFileSync } from "node:fs";

const releaseVersion = process.env.RELEASE_VERSION;
if (!releaseVersion) {
    console.error("Missing RELEASE_VERSION");
    process.exit(1);
}

const manifests = [
    "packages/doenetml/package.json",
    "packages/standalone/package.json",
    "packages/doenetml-iframe/package.json",
    "packages/v06-to-v07/package.json",
    "packages/vscode-extension/package.json",
    "packages/vscode-extension/extension/package.json",
];

const mismatches = [];
for (const file of manifests) {
    const pkg = JSON.parse(readFileSync(file, "utf8"));
    if (pkg.version !== releaseVersion) {
        mismatches.push(
            `${file}: expected ${releaseVersion}, found ${pkg.version}`,
        );
    }
}

if (mismatches.length > 0) {
    console.error(
        "Release tag does not match package versions:\n" +
            mismatches.join("\n"),
    );
    process.exit(1);
}

console.log(
    `Validated release version ${releaseVersion} across all release packages.`,
);
