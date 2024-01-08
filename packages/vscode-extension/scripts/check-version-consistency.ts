import * as path from "path";
import * as fs from "fs/promises";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootPackageJson = JSON.parse(
    await fs.readFile(path.join(__dirname, "..", "package.json"), "utf-8"),
);
const extensionPackageJson = JSON.parse(
    await fs.readFile(
        path.join(__dirname, "..", "extension", "package.json"),
        "utf-8",
    ),
);

function inconsistentVersion(): string | undefined {
    if (rootPackageJson.version !== extensionPackageJson.version) {
        return `root package.json version (${rootPackageJson.version}) is not equal to extension/package.json version (${extensionPackageJson.version}). They must be equal to publish.`;
    }
}
// If the versions are incorrect, exit with an error code
if (inconsistentVersion()) {
    console.error(inconsistentVersion());
    process.exit(1);
}
