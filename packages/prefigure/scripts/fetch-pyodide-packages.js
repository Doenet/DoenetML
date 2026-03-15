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
import crypto from "crypto";
import { fileURLToPath } from "url";

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchUrl(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} fetching ${url}`);
    }
    return res;
}

async function downloadToFile(url, destPath) {
    const res = await fetchUrl(url);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return buffer;
}

function sha256hex(buffer) {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}

function readPyodideLock() {
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
            return JSON.parse(fs.readFileSync(p, "utf8"));
        }
    }
    throw new Error(
        `pyodide-lock.json not found. Run 'npm install' first.\nSearched:\n` +
            candidates.map((c) => `  ${c}`).join("\n"),
    );
}

function readPrefigWheelFilename() {
    const metadataPath = path.join(
        PACKAGE_ROOT,
        "src",
        "worker",
        "compiler-metadata.ts",
    );
    const content = fs.readFileSync(metadataPath, "utf8");
    const match = content.match(
        /export const PREFIG_WHEEL_FILENAME = "([^"]+)";/,
    );
    if (!match) {
        throw new Error(
            "Could not find PREFIG_WHEEL_FILENAME constant in src/worker/compiler-metadata.ts",
        );
    }
    return match[1];
}

// ---------------------------------------------------------------------------
// Pyodide packages
// ---------------------------------------------------------------------------

async function fetchPyodidePackages(lock) {
    const pyodideVersion = lock.info.version;
    const baseUrl = `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`;
    console.log(
        `Fetching pyodide ${pyodideVersion} wheels from ${baseUrl} ...`,
    );

    // Build a map from package name -> lock entry
    const byName = {};
    for (const pkg of Object.values(lock.packages)) {
        if (pkg.name && pkg.file_name) {
            byName[pkg.name] = pkg;
        }
    }

    let downloaded = 0;
    let skipped = 0;
    const missing = [];

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
    const wheelFilename = readPrefigWheelFilename();
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
    const data = await res.json();

    // Find the exact wheel in the PyPI release files
    const allUrls = data.urls ?? [];
    const wheelEntry = allUrls.find(
        (u) => u.filename === wheelFilename && u.packagetype === "bdist_wheel",
    );
    if (!wheelEntry) {
        throw new Error(
            `Wheel "${wheelFilename}" not found in PyPI release files for prefig ${version}.\n` +
                `Available files: ${allUrls.map((u) => u.filename).join(", ")}`,
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
