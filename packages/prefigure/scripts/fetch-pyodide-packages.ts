#!/usr/bin/env node
/**
 * Download pyodide-distributed wheels and the prefig wheel into pyodide_packages/.
 *
 * - Pyodide wheels: resolved via node_modules/pyodide/pyodide-lock.json, downloaded
 *   from the jsDelivr pyodide CDN, and verified with sha256 from the lock file.
 * - prefig wheel: downloaded from PyPI at the version pinned in src/worker/compiler-metadata.ts.
 *
 * All downloads are idempotent: existing files with matching sha256 are skipped.
 *
 * Run via `npm run setup -w packages/prefigure`, or automatically as part of
 * `npm run build` (wired through wireit).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fetchUrl, downloadToFile, sha256hex } from "./lib/download-utils.js";
import { PREFIG_WHEEL_FILENAME } from "../src/worker/compiler-metadata";

type PyodideLockPackage = {
    name?: string;
    file_name?: string;
    sha256?: string;
};

type PyodideLock = {
    info: {
        version: string;
    };
    packages: Record<string, PyodideLockPackage>;
};

type PyPiReleaseFile = {
    filename: string;
    packagetype: string;
    url: string;
    digests?: {
        sha256?: string;
    };
};

type PyPiResponse = {
    urls?: PyPiReleaseFile[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGE_ROOT = path.join(__dirname, "..");
const PYODIDE_PACKAGES_DIR = path.join(PACKAGE_ROOT, "pyodide_packages");

// Pyodide package names (as they appear in pyodide-lock.json's `name` field)
// that prefigure requires at runtime. When bumping the `pyodide` npm dependency,
// these names stay the same; only the downloaded filenames/versions change.
const REQUIRED_PYODIDE_PACKAGES = [
    "click",
    "cycler",
    "decorator",
    "fonttools",
    "kiwisolver",
    "lxml",
    "matplotlib",
    "matplotlib-pyodide",
    "micropip",
    "networkx",
    "numpy",
    "openblas",
    "packaging",
    "Pillow",
    "pyparsing",
    "python-dateutil",
    "pytz",
    "scipy",
    "setuptools",
    "shapely",
    "six",
];

function readPyodideLock(): PyodideLock {
    // pyodide is hoisted to the workspace root node_modules
    const candidates = [
        path.join(PACKAGE_ROOT, "node_modules", "pyodide", "pyodide-lock.json"),
        path.join(
            PACKAGE_ROOT,
            "..",
            "..",
            "node_modules",
            "pyodide",
            "pyodide-lock.json",
        ),
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) {
            return JSON.parse(fs.readFileSync(p, "utf8")) as PyodideLock;
        }
    }
    throw new Error(
        `pyodide-lock.json not found. Run 'npm install' first.\nSearched:\n` +
            candidates.map((c) => `  ${c}`).join("\n"),
    );
}

// ---------------------------------------------------------------------------
// Pyodide packages
// ---------------------------------------------------------------------------

async function fetchPyodidePackages(lock: PyodideLock) {
    const pyodideVersion = lock.info.version;
    const baseUrl = `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`;
    console.log(
        `Fetching pyodide ${pyodideVersion} wheels from ${baseUrl} ...`,
    );

    // Build a map from package name -> lock entry
    const byName: Record<string, { file_name: string; sha256: string }> = {};
    for (const pkg of Object.values(lock.packages)) {
        if (pkg.name && pkg.file_name && pkg.sha256) {
            byName[pkg.name] = {
                file_name: pkg.file_name,
                sha256: pkg.sha256,
            };
        }
    }

    let downloaded = 0;
    let skipped = 0;
    const missing: string[] = [];

    for (const pkgName of REQUIRED_PYODIDE_PACKAGES) {
        const entry = byName[pkgName];
        if (!entry) {
            missing.push(pkgName);
            continue;
        }

        const { file_name: filename, sha256: expectedSha256 } = entry;
        const destPath = path.join(PYODIDE_PACKAGES_DIR, filename);

        // Skip if already present with matching hash
        if (fs.existsSync(destPath)) {
            const existing = sha256hex(fs.readFileSync(destPath));
            if (existing === expectedSha256) {
                skipped++;
                continue;
            }
            console.log(`  Updating ${filename} (hash changed)`);
        } else {
            console.log(`  Downloading ${filename}`);
        }

        const buffer = await downloadToFile(baseUrl + filename, destPath);
        const actualSha256 = sha256hex(buffer);
        if (actualSha256 !== expectedSha256) {
            fs.unlinkSync(destPath);
            throw new Error(
                `SHA-256 mismatch for ${filename}\n` +
                    `  Expected: ${expectedSha256}\n` +
                    `  Got:      ${actualSha256}`,
            );
        }
        downloaded++;
    }

    if (missing.length > 0) {
        throw new Error(
            `The following packages were not found in pyodide-lock.json:\n` +
                missing.map((n) => `  ${n}`).join("\n") +
                `\nCheck REQUIRED_PYODIDE_PACKAGES in ${__filename}`,
        );
    }

    console.log(
        `  pyodide wheels: ${downloaded} downloaded, ${skipped} already up to date`,
    );
}

// ---------------------------------------------------------------------------
// prefig wheel
// ---------------------------------------------------------------------------

async function fetchPrefigWheel() {
    const wheelFilename = PREFIG_WHEEL_FILENAME;
    const destPath = path.join(PYODIDE_PACKAGES_DIR, wheelFilename);

    // Keep only the pinned prefig wheel to avoid stale-version ambiguity.
    for (const file of fs.readdirSync(PYODIDE_PACKAGES_DIR)) {
        if (
            file.startsWith("prefig-") &&
            file.endsWith(".whl") &&
            file !== wheelFilename
        ) {
            fs.unlinkSync(path.join(PYODIDE_PACKAGES_DIR, file));
            console.log(`  Removed stale prefig wheel: ${file}`);
        }
    }

    if (fs.existsSync(destPath)) {
        console.log(`  ${wheelFilename} already present, skipping`);
        return;
    }

    // Extract version from filename: prefig-0.5.11-py3-none-any.whl
    const versionMatch = wheelFilename.match(/^prefig-([^-]+)-/);
    if (!versionMatch) {
        throw new Error(
            `Cannot extract version from PREFIG_WHEEL_FILENAME: ${wheelFilename}`,
        );
    }
    const version = versionMatch[1];

    console.log(`  Fetching prefig ${version} from PyPI...`);
    const pypiMetaUrl = `https://pypi.org/pypi/prefig/${version}/json`;
    const res = await fetchUrl(pypiMetaUrl);
    const data = (await res.json()) as PyPiResponse;

    // Find the exact wheel in the PyPI release files
    const allUrls: PyPiReleaseFile[] = data.urls ?? [];
    const wheelEntry = allUrls.find(
        (u: PyPiReleaseFile) =>
            u.filename === wheelFilename && u.packagetype === "bdist_wheel",
    );
    if (!wheelEntry) {
        throw new Error(
            `Wheel "${wheelFilename}" not found in PyPI release files for prefig ${version}.\n` +
                `Available files: ${allUrls.map((u: PyPiReleaseFile) => u.filename).join(", ")}`,
        );
    }

    console.log(`  Downloading ${wheelFilename}`);
    const buffer = await downloadToFile(wheelEntry.url, destPath);

    if (wheelEntry.digests?.sha256) {
        const actualSha256 = sha256hex(buffer);
        if (actualSha256 !== wheelEntry.digests.sha256) {
            fs.unlinkSync(destPath);
            throw new Error(
                `SHA-256 mismatch for ${wheelFilename}\n` +
                    `  Expected: ${wheelEntry.digests.sha256}\n` +
                    `  Got:      ${actualSha256}`,
            );
        }
    }

    console.log(`  Downloaded prefig ${version}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    fs.mkdirSync(PYODIDE_PACKAGES_DIR, { recursive: true });

    const lock = readPyodideLock();
    await fetchPyodidePackages(lock);

    console.log("Fetching prefig wheel...");
    await fetchPrefigWheel();

    console.log("Done.");
}

main().catch((err) => {
    console.error(`\nfetch-pyodide-packages failed: ${err.message}`);
    process.exit(1);
});
