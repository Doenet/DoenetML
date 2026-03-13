#!/usr/bin/env node
/**
 * Download the liblouis JS binary and braille translation tables into
 * src/worker/liblouis/generated/ from the liblouis/js-build GitHub repository.
 *
 * The JS binary (build-no-tables-utf32.js) requires a one-line export shim
 * appended to it so it can be imported as an ES module. This is documented
 * in src/worker/liblouis/README.md.
 *
 * To upgrade liblouis: change LIBLOUIS_REF and update the sha256 entries below
 * to match the new tag's file contents (run the script once with CHECK_HASHES=false
 * to download, then recompute hashes and re-enable verification).
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
const LIBLOUIS_DIR = path.join(PACKAGE_ROOT, "src", "worker", "liblouis");
const GENERATED_DIR = path.join(LIBLOUIS_DIR, "generated");

// ---------------------------------------------------------------------------
// Version pin
// To upgrade: change LIBLOUIS_REF, run `npm run setup`, re-compute hashes,
// update LIBLOUIS_SHA256 and TABLE_SHA256 entries below.
// ---------------------------------------------------------------------------

// Use an immutable commit SHA to avoid drifting assets from a moving branch.
const LIBLOUIS_REF = "f08df1fa198505f0642a64f675f022cafa677f8a";
const RAW_BASE = `https://raw.githubusercontent.com/liblouis/js-build/${LIBLOUIS_REF}`;

/** sha256 of the raw downloaded JS file (before the export shim is appended) */
const LIBLOUIS_JS_SHA256 =
    "69e2b34daa3c3a4b36a81f96e1bbfeefb4374b3eb2120c1e37e820dcb3a43b66";

/** Export shim appended to build-no-tables-utf32.js to make it an ES module */
const EXPORT_SHIM = "\nexport { liblouisBuild as capi };\n";

/** Braille table files and their sha256 hashes from the pinned tag */
const TABLE_FILES = {
    "braille-patterns.cti":
        "5e24558303fa6db1642ee99dde12c43a42938edc7de26e87d09d4acfbeae6bbe",
    "en-ueb-chardefs.uti":
        "05b51b62ef69aa6235338da9ce9ef16cb515ab0392795c2dec3b5957c955a00e",
    "en-ueb-g1.ctb":
        "1f77969efa61620b5af30eda2930068f8a239e18601b235505527601cc3d03ed",
    "en-ueb-g2.ctb":
        "45b83481438667b57f57793d9369aeb44a5e5c50980767c69ba99ea83f442059",
    "en-ueb-math.ctb":
        "d4fa2926bdc0e46fedf0f18e755b3c50a904e5e5b16b635eac88eff6a086f75d",
    "latinLetterDef6Dots.uti":
        "644b8b0c9a49ec88d487d2068933995cfa4d77cabb64ec5db26ae04b3d458f71",
    "latinUppercaseComp6.uti":
        "d777e0ab7c0c7a0c3a6a685f1aa74c4c57fea7766f6e16cf25f8ffa1a8be0b5b",
    "spaces.uti":
        "8fdd5a9f42caa6f583540b026d7c5af13760b02029cbd08c052b2393cb8829da",
    "text_nabcc.dis":
        "f3b10172236afd9921ac385c94a66d0ae23dbbf92afee92ae81ab31933088fbc",
};

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

async function downloadBuffer(url) {
    const res = await fetchUrl(url);
    return Buffer.from(await res.arrayBuffer());
}

function sha256hex(buffer) {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}

function verifyHash(buffer, expected, label) {
    const actual = sha256hex(buffer);
    if (actual !== expected) {
        throw new Error(
            `SHA-256 mismatch for ${label}\n` +
                `  Expected: ${expected}\n` +
                `  Got:      ${actual}\n` +
                `\nIf you are upgrading liblouis, update the hash constants in\n` +
                `  ${__filename}`,
        );
    }
}

// ---------------------------------------------------------------------------
// JS binary
// ---------------------------------------------------------------------------

async function fetchLiblouisJs() {
    const destPath = path.join(GENERATED_DIR, "build-no-tables-utf32.js");
    const url = `${RAW_BASE}/build-no-tables-utf32.js`;

    // Check if we already have the correct version: verify hash of content
    // before the shim (the last line) to see if it matches the expected hash.
    if (fs.existsSync(destPath)) {
        const content = fs.readFileSync(destPath);
        // Strip the trailing shim to get the original content for hash comparison
        const shimBuf = Buffer.from(EXPORT_SHIM);
        const originalContent = content.subarray(
            0,
            content.length - shimBuf.length,
        );
        if (sha256hex(originalContent) === LIBLOUIS_JS_SHA256) {
            console.log(`  build-no-tables-utf32.js already up to date`);
            return;
        }
        console.log(`  Updating build-no-tables-utf32.js (hash changed)`);
    } else {
        console.log(`  Downloading build-no-tables-utf32.js`);
    }

    const buffer = await downloadBuffer(url);
    verifyHash(buffer, LIBLOUIS_JS_SHA256, "build-no-tables-utf32.js");

    // Append the ES module export shim
    const patched = Buffer.concat([buffer, Buffer.from(EXPORT_SHIM)]);
    fs.writeFileSync(destPath, patched);
}

// ---------------------------------------------------------------------------
// Braille table files
// ---------------------------------------------------------------------------

async function fetchBrailleTables() {
    let downloaded = 0;
    let skipped = 0;

    for (const [filename, expectedSha256] of Object.entries(TABLE_FILES)) {
        const destPath = path.join(GENERATED_DIR, filename);

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

        const buffer = await downloadBuffer(`${RAW_BASE}/tables/${filename}`);
        verifyHash(buffer, expectedSha256, filename);
        fs.writeFileSync(destPath, buffer);
        downloaded++;
    }

    console.log(
        `  braille tables: ${downloaded} downloaded, ${skipped} already up to date`,
    );
}

function removeLegacyRootFiles() {
    const legacyFiles = [
        "build-no-tables-utf32.js",
        ...Object.keys(TABLE_FILES),
    ];

    for (const filename of legacyFiles) {
        const legacyPath = path.join(LIBLOUIS_DIR, filename);
        if (fs.existsSync(legacyPath)) {
            fs.unlinkSync(legacyPath);
            console.log(
                `  Removed legacy file: src/worker/liblouis/${filename}`,
            );
        }
    }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    console.log(`Fetching liblouis ${LIBLOUIS_REF} assets...`);
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
    await fetchLiblouisJs();
    await fetchBrailleTables();
    removeLegacyRootFiles();
    console.log("Done.");
}

main().catch((err) => {
    console.error(`\nfetch-liblouis failed: ${err.message}`);
    process.exit(1);
});
