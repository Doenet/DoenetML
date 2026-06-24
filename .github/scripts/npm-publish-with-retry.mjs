/**
 * Publish an npm package with retries and idempotency.
 *
 * npm's provenance/Trusted-Publishing path occasionally fails with transient
 * errors (most notably `IDENTITY_TOKEN_READ_ERROR` while retrieving the OIDC
 * identity token, plus assorted network/5xx blips). A single flaky publish
 * would otherwise fail the whole release job even though the build and all the
 * other packages succeeded. This wrapper retries those transient failures and
 * treats an already-published version as success, so the release pipeline is
 * resilient to flakiness and safe to re-run.
 *
 * Usage:
 *   node .github/scripts/npm-publish-with-retry.mjs <publish-dir> [npm publish args...]
 *
 * Example (from a package directory):
 *   node ../../.github/scripts/npm-publish-with-retry.mjs dist --tag dev
 *
 * Behavior:
 *   - Reads name@version from <publish-dir>/package.json.
 *   - If that exact version is already on the registry, skips (success).
 *   - Otherwise runs `npm publish` (forwarding the extra args) in <publish-dir>,
 *     retrying on transient errors with exponential backoff.
 *   - After a failed attempt it re-checks the registry: if the version now
 *     exists (the publish succeeded server-side despite a client-side error),
 *     it is treated as success.
 *
 * Configuration (environment variables):
 *   NPM_PUBLISH_MAX_ATTEMPTS    - total attempts before giving up (default 4)
 *   NPM_PUBLISH_RETRY_DELAY_MS  - base backoff delay in ms (default 10000)
 *   NPM_PUBLISH_MAX_DELAY_MS    - backoff delay cap in ms (default 60000)
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const [, , publishDir, ...publishArgs] = process.argv;

if (!publishDir) {
    console.error(
        "Usage: node npm-publish-with-retry.mjs <publish-dir> [npm publish args...]",
    );
    process.exit(1);
}

const maxAttempts = Number(process.env.NPM_PUBLISH_MAX_ATTEMPTS ?? 4);
const baseDelayMs = Number(process.env.NPM_PUBLISH_RETRY_DELAY_MS ?? 10_000);
const maxDelayMs = Number(process.env.NPM_PUBLISH_MAX_DELAY_MS ?? 60_000);

const cwd = resolve(process.cwd(), publishDir);

let pkg;
try {
    pkg = JSON.parse(readFileSync(resolve(cwd, "package.json"), "utf8"));
} catch (error) {
    console.error(
        `Could not read package.json in ${cwd}: ${error.message ?? error}`,
    );
    process.exit(1);
}

const { name, version } = pkg;
if (!name || !version) {
    console.error(`package.json in ${cwd} is missing a name or version.`);
    process.exit(1);
}
const spec = `${name}@${version}`;

/**
 * Patterns that indicate the version is already published. Re-publishing the
 * same version is impossible, so we treat this as success (idempotent re-runs).
 */
const ALREADY_PUBLISHED_PATTERNS = [
    /EPUBLISHCONFLICT/i,
    /cannot publish over/i,
    /previously published version/i,
    /\b403\b[^\n]*over/i,
];

/**
 * Patterns for transient failures that are worth retrying. The OIDC identity
 * token read error is the motivating case; the rest are common network/registry
 * blips during publish + provenance signing.
 */
const TRANSIENT_PATTERNS = [
    /IDENTITY_TOKEN_READ_ERROR/i,
    /error retrieving identity token/i,
    /provenance/i,
    /sigstore/i,
    /fulcio/i,
    /rekor/i,
    /transparency log/i,
    /ECONNRESET/i,
    /ETIMEDOUT/i,
    /ENOTFOUND/i,
    /EAI_AGAIN/i,
    /ECONNREFUSED/i,
    /EPIPE/i,
    /socket hang up/i,
    /network/i,
    /request to .* failed/i,
    /fetch failed/i,
    /\b429\b/,
    /\b5\d\d\b/,
    /Internal Server Error/i,
    /Service Unavailable/i,
    /Bad Gateway/i,
    /Gateway Time-?out/i,
    /registry returned/i,
];

function matchesAny(text, patterns) {
    return patterns.some((pattern) => pattern.test(text));
}

function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

/**
 * Returns true if the exact name@version is already available on the registry.
 */
function alreadyPublished() {
    const result = spawnSync(
        "npm",
        ["view", spec, "version", "--no-workspaces"],
        { encoding: "utf8" },
    );
    if (result.status === 0) {
        return result.stdout.trim() === version;
    }
    // A non-zero exit here typically means the package or version does not
    // exist yet (E404), which is exactly the "not published" case.
    return false;
}

function runPublish() {
    console.log(`\n$ npm publish ${publishArgs.join(" ")}  (in ${cwd})`);
    const result = spawnSync("npm", ["publish", ...publishArgs], {
        cwd,
        encoding: "utf8",
    });
    if (result.stdout) {
        process.stdout.write(result.stdout);
    }
    if (result.stderr) {
        process.stderr.write(result.stderr);
    }
    return {
        status: result.status,
        output: `${result.stdout ?? ""}\n${result.stderr ?? ""}`,
    };
}

async function main() {
    if (alreadyPublished()) {
        console.log(`✔ ${spec} is already published; skipping.`);
        return;
    }

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(
            `\n=== Publishing ${spec} (attempt ${attempt}/${maxAttempts}) ===`,
        );
        const { status, output } = runPublish();

        if (status === 0) {
            console.log(`✔ Published ${spec}.`);
            return;
        }

        if (matchesAny(output, ALREADY_PUBLISHED_PATTERNS)) {
            console.log(
                `✔ ${spec} is already published (publish reported a conflict); treating as success.`,
            );
            return;
        }

        // The publish may have succeeded server-side even though the client
        // reported an error (e.g. the token read failed after upload). Confirm
        // against the registry before deciding to retry.
        if (alreadyPublished()) {
            console.log(
                `✔ ${spec} is now present on the registry despite the error; treating as success.`,
            );
            return;
        }

        const transient = matchesAny(output, TRANSIENT_PATTERNS);
        if (!transient) {
            console.error(
                `✖ Publishing ${spec} failed with a non-transient error; not retrying.`,
            );
            process.exit(status ?? 1);
        }

        if (attempt === maxAttempts) {
            console.error(
                `✖ Publishing ${spec} still failing after ${maxAttempts} attempts; giving up.`,
            );
            process.exit(status ?? 1);
        }

        const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
        console.warn(
            `⚠ Transient failure publishing ${spec}; retrying in ${Math.round(
                delay / 1000,
            )}s...`,
        );
        await sleep(delay);
    }
}

await main();
