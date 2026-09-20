/**
 * Verify that the CI workflow succeeded for a specific commit SHA, waiting for
 * a run that is still going rather than failing on it.
 *
 * A release can reach this check while CI for the same commit is still running:
 * the PyPI workflow's build job has no environment gate and starts the moment a
 * release is published, and `production-release` gets there as soon as its
 * `production` approval lands. Querying only completed runs hid a run that was
 * still going, so it took the same "no run found" branch as a commit CI had
 * never run for at all, and all three states — still running, never ran, ran
 * and failed — ended the job immediately. Only the last of them deserves that;
 * the first just needs waiting out, and the second deserves a short look before
 * we give up on it, since the tag push and the release event race and a run may
 * not be registered yet.
 *
 * So: pass as soon as some completed run for the commit succeeded, wait while
 * any run is still pending, and fail once every run is in and none succeeded.
 * Taking "any run succeeded" as the pass condition (rather than judging the
 * newest run) also keeps a stray startup failure for the same commit from
 * vetoing a full CI run that went green — GitHub records those as ordinary
 * failed runs, and they carry no job results to disagree with.
 *
 * Required environment variables:
 *   GITHUB_TOKEN  - GitHub Actions token with `actions: read` permission
 *   REPO          - Repository in "owner/name" format (e.g. "Doenet/DoenetML")
 *   TARGET_SHA    - Full commit SHA to check CI status for
 *
 * Configuration (environment variables):
 *   VERIFY_CI_TIMEOUT_MS        - total budget for waiting on a pending run
 *                                 (default 3600000, i.e. 60 minutes)
 *   VERIFY_CI_MISSING_GRACE_MS  - how long to keep looking when the commit has
 *                                 no runs at all yet, and how long to tolerate
 *                                 back-to-back failed API reads
 *                                 (default 300000, 5 minutes)
 *   VERIFY_CI_POLL_INTERVAL_MS  - delay between polls (default 30000, and at
 *                                 least 1000; a smaller value is ignored with
 *                                 a warning rather than allowed to spin)
 *
 * The waiting budget is wall-clock from the moment this script starts, so a
 * slow API read spends it rather than extending it. The grace for unreadable
 * responses is measured from the first of a run of them instead, and restarts
 * on the next read that succeeds — one blip must not end a wait that is
 * otherwise watching a healthy run. While reads fail promptly, the script
 * reaches an exit of its own within the waiting budget plus that grace plus
 * one poll — 65.5 minutes at the defaults, inside the callers'
 * `timeout-minutes: 70`. Reads need not fail promptly, though: a `fetch` that
 * hangs is bounded only by Node's own header/body timeouts, 300 s apiece, so
 * two hung reads at the end of the budget would take this past 70 minutes and
 * the backstop would end the step first. That costs the specific message, not
 * the verdict, and it is why the backstop is not optional.
 */

const token = process.env.GITHUB_TOKEN;
const repo = process.env.REPO;
const targetSha = process.env.TARGET_SHA;

if (!token || !repo || !targetSha) {
    console.error("Missing required environment for CI verification");
    process.exit(1);
}

const timeoutMs = readIntegerEnv("VERIFY_CI_TIMEOUT_MS", 3_600_000, 0);
const missingGraceMs = readIntegerEnv("VERIFY_CI_MISSING_GRACE_MS", 300_000, 0);
const pollIntervalMs = readIntegerEnv(
    "VERIFY_CI_POLL_INTERVAL_MS",
    30_000,
    1000,
);

const [owner, name] = repo.split("/");
const url = `https://api.github.com/repos/${owner}/${name}/actions/workflows/ci.yml/runs?head_sha=${targetSha}&per_page=20`;

/**
 * Run statuses that mean the run has not reached a conclusion yet. GitHub has
 * added to this set over time (`waiting` for environment approvals, `pending`
 * for concurrency holds), so treat anything that is not `completed` as pending
 * rather than listing the terminal states — a status we have never seen should
 * make us wait, not fail.
 */
function isPending(run) {
    return run.status !== "completed";
}

const startedAt = Date.now();

function elapsedSeconds() {
    return Math.round((Date.now() - startedAt) / 1000);
}

function readIntegerEnv(variable, fallback, minimum) {
    const raw = process.env[variable];
    if (raw === undefined || raw === "") {
        return fallback;
    }
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed < minimum) {
        console.warn(
            `Ignoring ${variable}=${raw}; falling back to ${fallback}.`,
        );
        return fallback;
    }
    return parsed;
}

async function sleep(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * The CI runs recorded for `targetSha`, newest first.
 *
 * Returns null for a read that could not be made sense of — a transport error,
 * an error status, a body that is not JSON, or one without the expected array.
 * That is reported and treated as "nothing known yet" rather than ending the
 * job: giving up on the first 5xx would reintroduce the failure mode this
 * script exists to remove. A run that is genuinely absent is decided by a
 * budget running out, not by one unlucky request. Null is deliberately
 * distinct from an empty array, which is the API stating authoritatively that
 * the commit has no runs (it answers `{"total_count":0,"workflow_runs":[]}`).
 */
async function fetchRuns() {
    let response;
    try {
        response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });
    } catch (error) {
        return unreadable(
            `could not query CI workflow runs: ${error.message ?? error}`,
        );
    }

    if (!response.ok) {
        const body = await response.text().catch(() => "");
        const result = unreadable(
            `could not query CI workflow runs: ${response.status} ${response.statusText}`,
        );
        if (body) {
            console.warn(`  ${body.slice(0, 500)}`);
        }
        return result;
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        return unreadable(
            `could not parse the CI workflow run listing: ${error.message ?? error}`,
        );
    }

    const runs = data?.workflow_runs;
    if (!Array.isArray(runs)) {
        return unreadable(
            "CI workflow run listing had no workflow_runs array; treating it as unread",
        );
    }

    return runs.filter((run) => run.head_sha === targetSha);
}

/**
 * Report an unreadable response and remember why. The reason is repeated in
 * the message that ends the job, so that message stands on its own: before
 * this script waited, an unusable response failed the step immediately and the
 * status was right there in the error. Now it is a warning from some poll
 * several minutes earlier, which is exactly the line a reader would miss.
 */
function unreadable(reason) {
    lastUnreadableReason = reason;
    console.warn(`  ${reason}`);
    return null;
}

function describe(run) {
    return `run ${run.id} (status=${run.status}, conclusion=${run.conclusion ?? "none"}) ${run.html_url}`;
}

/** Whether any run for this commit has been seen, at any point in the wait. */
let sawRuns = false;
/** When the current unbroken streak of unreadable responses began, if any. */
let firstUnreadableAt = null;
/** Why the most recent unreadable response could not be used. */
let lastUnreadableReason = null;

while (true) {
    const runs = await fetchRuns();

    if (runs !== null) {
        firstUnreadableAt = null;

        const succeeded = runs.find(
            (run) => run.status === "completed" && run.conclusion === "success",
        );
        if (succeeded) {
            console.log(
                `Verified successful CI run for ${targetSha}: ${succeeded.html_url}`,
            );
            process.exit(0);
        }

        const pending = runs.filter(isPending);

        if (runs.length > 0 && pending.length === 0) {
            // Every run for this commit is in, and none of them succeeded.
            // Waiting cannot change that.
            console.error(
                `CI workflow for commit ${targetSha} did not succeed. Runs found:`,
            );
            for (const run of runs) {
                console.error(`  ${describe(run)}`);
            }
            process.exit(1);
        }

        // A commit with no runs at all is far more likely to be a mistake (CI
        // never ran for it) than one whose run is merely slow, so it gets a
        // much shorter budget than a run we can actually see progressing. The
        // budget is checked before the progress line so the last thing printed
        // before the failure is the failure itself.
        //
        // Having seen a run latches the long budget on. The listing is only
        // eventually consistent, and a single reply that omits a run we were
        // watching must not retroactively reclassify a wait that is already
        // minutes old as "CI never ran" and end it on the spot.
        sawRuns ||= runs.length > 0;
        const budget = sawRuns ? timeoutMs : missingGraceMs;
        if (Date.now() - startedAt >= budget) {
            if (runs.length === 0 && sawRuns) {
                // The latch means this is reachable, and "no run found" would
                // be the wrong thing to say about it: a run *was* found, and
                // then stopped being listed — a deleted run, or a listing
                // that never recovered.
                console.error(
                    `CI workflow runs for commit ${targetSha} stopped being listed part-way through the wait and had not come back after ${elapsedSeconds()}s.`,
                );
            } else if (runs.length === 0) {
                console.error(
                    `No CI workflow run with matching head_sha found for commit ${targetSha} after ${elapsedSeconds()}s.`,
                );
            } else {
                console.error(
                    `CI workflow for commit ${targetSha} was still in progress after ${elapsedSeconds()}s:`,
                );
                for (const run of runs) {
                    console.error(`  ${describe(run)}`);
                }
            }
            process.exit(1);
        }

        if (pending.length > 0) {
            const budgetLeft = Math.round(
                (budget - (Date.now() - startedAt)) / 1000,
            );
            console.log(
                `  waiting on ${describe(pending[0])} — ${elapsedSeconds()}s elapsed, ${budgetLeft}s of budget left`,
            );
        } else if (sawRuns) {
            console.log(
                `  the CI run listed earlier for ${targetSha} is no longer being returned — ${elapsedSeconds()}s elapsed`,
            );
        } else {
            console.log(
                `  no CI run recorded for ${targetSha} yet — ${elapsedSeconds()}s elapsed`,
            );
        }
    } else {
        // Bound consecutive unreadable responses rather than total elapsed
        // time: an API blip twenty minutes into a perfectly healthy wait is
        // exactly what this script is supposed to ride out, and measuring
        // from the start of the wait would instead make it fatal.
        firstUnreadableAt ??= Date.now();
        const unreadableMs = Date.now() - firstUnreadableAt;
        if (unreadableMs >= missingGraceMs) {
            console.error(
                `Could not read CI workflow runs for commit ${targetSha} for ${Math.round(unreadableMs / 1000)}s (${elapsedSeconds()}s into the wait). Last failure: ${lastUnreadableReason}.`,
            );
            process.exit(1);
        }
    }

    await sleep(pollIntervalMs);
}
