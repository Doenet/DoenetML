/**
 * Verify that the CI workflow succeeded for a specific commit SHA, waiting for
 * a run that is still going rather than failing on it.
 *
 * A release can reach this check while CI for the same commit is still running:
 * the PyPI workflow's build job has no environment gate and starts the moment a
 * release is published, and `production-release` gets there as soon as its
 * `production` approval lands. Querying only completed runs made those three
 * states — still running, never ran, ran and failed — indistinguishable, and
 * all three failed the job immediately. Only the last of them deserves that;
 * the first just needs waiting out, and the second is usually a run that has
 * not been registered yet, since the tag push and the release event race.
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
 *                                 no runs at all yet (default 300000, 5 minutes)
 *   VERIFY_CI_POLL_INTERVAL_MS  - delay between polls (default 30000)
 *
 * Both budgets are wall-clock and share one clock: a slow or hanging API read
 * spends the budget rather than extending it. The caller should still set
 * `timeout-minutes` on the step as a backstop.
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
 * A read that fails is reported and treated as "nothing known yet" rather than
 * ending the job: the budget above is there to absorb a registry or API blip,
 * and giving up on the first 5xx would reintroduce the failure mode this script
 * exists to remove. A run that is genuinely absent is decided by the budget
 * running out, not by one unlucky request.
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
        console.warn(
            `  could not query CI workflow runs: ${error.message ?? error}`,
        );
        return null;
    }

    if (!response.ok) {
        const body = await response.text().catch(() => "");
        console.warn(
            `  could not query CI workflow runs: ${response.status} ${response.statusText}`,
        );
        if (body) {
            console.warn(`  ${body.slice(0, 500)}`);
        }
        return null;
    }

    const data = await response.json();
    const runs = data.workflow_runs ?? [];
    return runs.filter((run) => run.head_sha === targetSha);
}

function describe(run) {
    return `run ${run.id} (status=${run.status}, conclusion=${run.conclusion ?? "none"}) ${run.html_url}`;
}

while (true) {
    const runs = await fetchRuns();

    if (runs !== null) {
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
        const budget = runs.length > 0 ? timeoutMs : missingGraceMs;
        if (Date.now() - startedAt >= budget) {
            if (runs.length === 0) {
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
        } else {
            console.log(
                `  no CI run recorded for ${targetSha} yet — ${elapsedSeconds()}s elapsed`,
            );
        }
    } else if (Date.now() - startedAt >= missingGraceMs) {
        console.error(
            `Could not read CI workflow runs for commit ${targetSha} after ${elapsedSeconds()}s.`,
        );
        process.exit(1);
    }

    await sleep(pollIntervalMs);
}
