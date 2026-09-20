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
 *   - A publish that carried the dist-tag has already pointed that tag at the
 *     version, so no follow-up write is made. On the other success paths
 *     (already published, or published server-side despite a client error) it
 *     ensures the tag points at the version, retrying transient failures.
 *   - Hides the per-file tarball listing from the relayed npm output, keeping
 *     the Tarball Details summary (see NPM_PUBLISH_SHOW_FILE_LIST below).
 *
 * Configuration (environment variables):
 *   NPM_PUBLISH_MAX_ATTEMPTS    - total attempts before giving up (default 4)
 *   NPM_PUBLISH_RETRY_DELAY_MS  - base backoff delay in ms (default 10000)
 *   NPM_PUBLISH_MAX_DELAY_MS    - backoff delay cap in ms (default 60000)
 *   NPM_PUBLISH_SHOW_FILE_LIST  - set to 1 to relay the per-file tarball
 *                                 listing instead of hiding it
 *
 * Each of the publish and any follow-up dist-tag write gets its own budget of
 * attempts under the three retry settings.
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
const showFileList = process.env.NPM_PUBLISH_SHOW_FILE_LIST === "1";

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

/**
 * `npm dist-tag add` is a cheap, idempotent metadata write, so it can retry
 * failures that would be suspicious on a publish. Auth errors are included:
 * a genuinely missing or invalid token fails every package in the run, while a
 * one-off `E401` on a single tag write — with the same credentials publishing
 * the other packages seconds earlier and later — is a registry blip, and losing
 * an already-published release to it is the worse outcome.
 */
const TRANSIENT_DIST_TAG_PATTERNS = [
    ...TRANSIENT_PATTERNS,
    /\bE401\b/,
    /\bENEEDAUTH\b/,
    /Unable to authenticate/i,
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

/**
 * One line of the tarball listing `npm publish` prints at its default log level:
 * `npm notice 7.6kB Viewer/renderers/answer.js`. The size always follows
 * `npm notice` immediately, which no line of the Tarball Details summary does
 * (`npm notice package size: 12.8 MB` leads with a word), so this cannot eat the
 * summary.
 */
const TARBALL_FILE_LINE = /^npm notice \d+(\.\d+)?[kMGT]?B .+$/;

/**
 * Drop the per-file tarball listing from npm's output.
 *
 * A dev release publishes four packages of a few thousand files each, so the
 * listing runs ~5800 of the step's ~6000 lines and buries anything worth
 * reading — a release that failed on a one-line `npm error` looks, at a glance,
 * like it never got as far as publishing. The Tarball Details summary that
 * follows the listing carries the part worth keeping (package size, unpacked
 * size, file count, shasum, integrity), and npm has no log level that separates
 * the two: `--loglevel=warn` would drop the summary along with the listing. The
 * published tarball keeps the full file list permanently, and
 * `npm pack <spec> --dry-run` reprints exactly this listing from it, so the copy
 * in an expiring CI log is redundant as well as noisy. On the one path where it
 * is not redundant — a publish that never reached the registry — the file list
 * is the least interesting thing in the log.
 *
 * Filtering is display-only: `combinedOutput` still classifies the untouched
 * text, so the retry and already-published patterns see everything npm said.
 */
function withoutTarballFileList(text) {
    if (!text || showFileList) {
        return { text, suppressed: 0 };
    }

    let suppressed = 0;
    const kept = text.split("\n").filter((line) => {
        if (!TARBALL_FILE_LINE.test(line)) {
            return true;
        }
        suppressed++;
        return false;
    });

    return { text: kept.join("\n"), suppressed };
}

function writeCommandOutput(result, commandName) {
    let suppressed = 0;

    if (result.stdout) {
        const filtered = withoutTarballFileList(result.stdout);
        suppressed += filtered.suppressed;
        process.stdout.write(filtered.text);
    }
    if (result.stderr) {
        const filtered = withoutTarballFileList(result.stderr);
        suppressed += filtered.suppressed;
        process.stderr.write(filtered.text);
    }
    if (suppressed > 0) {
        console.log(
            `(${suppressed} tarball file lines hidden; \`npm pack ${spec} --dry-run\` lists the published files, or set NPM_PUBLISH_SHOW_FILE_LIST=1)`,
        );
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

function runDistTagAdd() {
    const result = spawnSync(
        "npm",
        ["dist-tag", "add", spec, explicitPublishTag, "--no-workspaces"],
        { encoding: "utf8" },
    );
    writeCommandOutput(result, "npm dist-tag add");
    return {
        status: result.status,
        output: combinedOutput(result),
    };
}

/**
 * Make sure the requested dist-tag points at this version.
 *
 * `appliedByPublish` says the `npm publish` in this run carried the tag, which
 * already points it at the version we just published. Verifying it anyway races
 * the registry: reads taken moments after a publish are served from a cache that
 * still shows the previous version, which used to send us into a redundant
 * `npm dist-tag add` — and a failure there would fail a release whose packages
 * were all published and correctly tagged.
 */
async function ensureExplicitDistTag({ appliedByPublish = false } = {}) {
    if (!explicitPublishTag) {
        return true;
    }

    if (appliedByPublish) {
        // The tag can come from the environment (`npm run publish -- --tag dev`
        // reaches us as `npm_config_tag`), in which case nothing else in the log
        // names it. Say so, so the release log still records which tag moved.
        console.log(
            `npm publish applied dist-tag ${name}@${explicitPublishTag}; no follow-up tag write needed.`,
        );
        return true;
    }

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        // Also serves as the re-check after a failed attempt: the write may have
        // landed server-side even though the client reported an error.
        const taggedVersion = publishedVersionForTag(explicitPublishTag);
        if (taggedVersion === version) {
            return true;
        }

        const previousTagMessage = taggedVersion
            ? ` (currently ${taggedVersion})`
            : "";
        console.log(
            `Ensuring npm dist-tag ${name}@${explicitPublishTag} points to ${version}${previousTagMessage} (attempt ${attempt}/${maxAttempts}).`,
        );

        const { output, status } = runDistTagAdd();
        if (status === 0) {
            return true;
        }

        if (!matchesAny(output, TRANSIENT_DIST_TAG_PATTERNS)) {
            console.error(
                `✖ Could not point npm dist-tag ${name}@${explicitPublishTag} at ${version}; the error is not transient, so not retrying.`,
            );
            return false;
        }

        // Back off before looking again — after the final attempt too, whose
        // only re-check is the one below. Reading the registry the instant a
        // write fails tells us nothing new: it is the same cached answer the
        // top of this iteration already saw.
        const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
        console.warn(
            `⚠ Transient failure updating npm dist-tag ${name}@${explicitPublishTag}; ${
                attempt === maxAttempts ? "re-checking" : "retrying"
            } in ${Math.round(delay / 1000)}s...`,
        );
        await sleep(delay);
    }

    // One last look before failing a released version. Two things can make the
    // writes above look worse than the state they were trying to reach: one may
    // have landed server-side even though the client reported an error, and the
    // tag may have been right the whole time, with every read above served from
    // a cache predating the publish. Either only becomes visible once that cache
    // has had time to expire, hence the backoff after the final attempt.
    if (publishedVersionForTag(explicitPublishTag) === version) {
        return true;
    }

    console.error(
        `✖ Could not point npm dist-tag ${name}@${explicitPublishTag} at ${version} after ${maxAttempts} attempts.`,
    );
    return false;
}

async function finishPublishedVersion(message, options) {
    if (!(await ensureExplicitDistTag(options))) {
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
        await finishPublishedVersion(
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
            await finishPublishedVersion(`✔ Published ${spec}.`, {
                appliedByPublish: Boolean(explicitPublishTag),
            });
            return;
        }

        if (matchesAny(output, ALREADY_PUBLISHED_PATTERNS)) {
            await finishPublishedVersion(
                `✔ ${spec} is already published (publish reported a conflict); treating as success.`,
            );
            return;
        }

        // The publish may have succeeded server-side even though the client
        // reported an error (e.g. the token read failed after upload). Confirm
        // against the registry before deciding to retry.
        if (alreadyPublished()) {
            await finishPublishedVersion(
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
