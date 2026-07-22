/**
 * Find the head SHA of the most recent successful CI run on main that
 * predates the current run. Prints the SHA to stdout, or nothing if no
 * prior run is found.
 *
 * Required environment variables:
 *   GITHUB_TOKEN       - GitHub Actions token with `actions: read` permission
 *   REPO               - Repository in "owner/name" format (e.g. "Doenet/DoenetML")
 *   CI_RUN_ID          - Numeric ID of the current CI run (excluded from results)
 *   CI_RUN_CREATED_AT  - ISO 8601 timestamp of the current CI run (used as upper bound)
 *   TRIGGER_SHA        - Head SHA of the current CI run (excluded from results)
 */

const token = process.env.GITHUB_TOKEN;
const repo = process.env.REPO;
const currentRunId = Number(process.env.CI_RUN_ID);
const currentCreatedAt = Date.parse(process.env.CI_RUN_CREATED_AT);
const currentHeadSha = process.env.TRIGGER_SHA;

if (!token || !repo || !currentRunId || !currentCreatedAt || !currentHeadSha) {
    console.error("Missing required environment for find-previous-ci-sha");
    process.exit(1);
}

const url = `https://api.github.com/repos/${repo}/actions/workflows/ci.yml/runs?branch=main&event=push&status=completed&per_page=100`;

const response = await fetch(url, {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    },
});

if (!response.ok) {
    console.error(
        `Failed to query CI workflow runs: ${response.status} ${response.statusText}`,
    );
    console.error(await response.text());
    process.exit(1);
}

const data = await response.json();
const runs = data.workflow_runs ?? [];

const previousRun = runs.find(
    (run) =>
        run.conclusion === "success" &&
        run.id !== currentRunId &&
        run.head_sha !== currentHeadSha &&
        Date.parse(run.created_at) < currentCreatedAt,
);

if (previousRun) {
    process.stdout.write(previousRun.head_sha);
}
