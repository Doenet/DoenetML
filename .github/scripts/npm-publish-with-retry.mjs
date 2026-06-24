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
 *   - If that exact version is already on the registry, ensures any explicitly
 *     requested dist-tag points to it, then skips (success).
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

const maxAttempts = readIntegerEnv("NPM_PUBLISH_MAX_ATTEMPTS", 4, 1);
const baseDelayMs = readIntegerEnv("NPM_PUBLISH_RETRY_DELAY_MS", 10_000, 0);
const maxDelayMs = readIntegerEnv("NPM_PUBLISH_MAX_DELAY_MS", 60_000, 0);

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
const explicitPublishTag = getExplicitPublishTag();

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

function getExplicitPublishTag() {
    let tag = process.env.npm_config_tag;

    for (let i = 0; i < publishArgs.length; i++) {
        const arg = publishArgs[i];
        if (arg === "--tag") {
            const nextArg = publishArgs[i + 1];
            if (!nextArg || nextArg.startsWith("-")) {
                console.error("Missing value for npm publish argument --tag.");
                process.exit(1);
            }
            tag = nextArg;
            i++;
        } else if (arg.startsWith("--tag=")) {
            tag = arg.slice("--tag=".length);
            if (!tag) {
                console.error("Missing value for npm publish argument --tag.");
                process.exit(1);
            }
        }
    }

    return tag;
}

/**
 * Read integer configuration from the environment and fail loudly on typos.
 */
function readIntegerEnv(name, defaultValue, minValue) {
    const rawValue = process.env[name];
    if (rawValue == null || rawValue.trim() === "") {
        return defaultValue;
    }

    const parsed = Number(rawValue);
    if (!Number.isInteger(parsed) || parsed < minValue) {
        console.error(
            `${name} must be an integer greater than or equal to ${minValue}; received ${JSON.stringify(
                rawValue,
            )}.`,
        );
        process.exit(1);
    }
    return parsed;
}

function combinedOutput(result) {
    return [
        result.stdout,
        result.stderr,
        result.error?.message,
        result.signal ? `Process terminated by signal ${result.signal}` : "",
    ]
        .filter(Boolean)
        .join("\n");
}

function writeCommandOutput(result, commandName) {
    if (result.stdout) {
        process.stdout.write(result.stdout);
    }
    if (result.stderr) {
        process.stderr.write(result.stderr);
    }
    if (result.error) {
        console.error(
            `${commandName} failed to start: ${result.error.message}`,
        );
    }
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
    if (result.error) {
        console.warn(
            `Could not check whether ${spec} is already published: ${result.error.message}`,
        );
        return false;
    }
    if (result.status === 0) {
        return result.stdout.trim() === version;
    }
    // A non-zero exit here typically means the package or version does not
    // exist yet (E404), which is exactly the "not published" case.
    return false;
}

function publishedVersionForTag(tag) {
    const result = spawnSync(
        "npm",
        ["view", name, "dist-tags", "--json", "--no-workspaces"],
        { encoding: "utf8" },
    );
    if (result.error) {
        console.warn(
            `Could not check npm dist-tags for ${name}: ${result.error.message}`,
        );
        return undefined;
    }
    if (result.status !== 0) {
        return undefined;
    }

    try {
        return JSON.parse(result.stdout)[tag];
    } catch (error) {
        console.warn(
            `Could not parse npm dist-tags for ${name}: ${error.message ?? error}`,
        );
        return undefined;
    }
}

function ensureExplicitDistTag() {
    if (!explicitPublishTag) {
        return true;
    }

    const taggedVersion = publishedVersionForTag(explicitPublishTag);
    if (taggedVersion === version) {
        return true;
    }

    const previousTagMessage = taggedVersion
        ? ` (currently ${taggedVersion})`
        : "";
    console.log(
        `Ensuring npm dist-tag ${name}@${explicitPublishTag} points to ${version}${previousTagMessage}.`,
    );
    const result = spawnSync(
        "npm",
        ["dist-tag", "add", spec, explicitPublishTag, "--no-workspaces"],
        { encoding: "utf8" },
    );
    writeCommandOutput(result, "npm dist-tag add");
    if (result.status === 0) {
        return true;
    }

    console.error(
        `Could not ensure npm dist-tag ${name}@${explicitPublishTag} points to ${version}.`,
    );
    return false;
}

function treatAlreadyPublishedAsSuccess(message) {
    if (!ensureExplicitDistTag()) {
        process.exit(1);
    }
    console.log(message);
}

function runPublish() {
    console.log(`\n$ npm publish ${publishArgs.join(" ")}  (in ${cwd})`);
    const result = spawnSync("npm", ["publish", ...publishArgs], {
        cwd,
        encoding: "utf8",
    });
    writeCommandOutput(result, "npm publish");
    return {
        status: result.status,
        output: combinedOutput(result),
    };
}

async function main() {
    if (alreadyPublished()) {
        treatAlreadyPublishedAsSuccess(
            `✔ ${spec} is already published; skipping.`,
        );
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
            treatAlreadyPublishedAsSuccess(
                `✔ ${spec} is already published (publish reported a conflict); treating as success.`,
            );
            return;
        }

        // The publish may have succeeded server-side even though the client
        // reported an error (e.g. the token read failed after upload). Confirm
        // against the registry before deciding to retry.
        if (alreadyPublished()) {
            treatAlreadyPublishedAsSuccess(
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
