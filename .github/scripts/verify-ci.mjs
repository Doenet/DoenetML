/**
 * Verify that the CI workflow succeeded for a specific commit SHA.
 *
 * Required environment variables:
 *   GITHUB_TOKEN  - GitHub Actions token with `actions: read` permission
 *   REPO          - Repository in "owner/name" format (e.g. "Doenet/DoenetML")
 *   TARGET_SHA    - Full commit SHA to check CI status for
 */

const token = process.env.GITHUB_TOKEN;
const repo = process.env.REPO;
const targetSha = process.env.TARGET_SHA;

if (!token || !repo || !targetSha) {
    console.error("Missing required environment for CI verification");
    process.exit(1);
}

const [owner, name] = repo.split("/");
const url = `https://api.github.com/repos/${owner}/${name}/actions/workflows/ci.yml/runs?head_sha=${targetSha}&status=completed&per_page=20`;

const response = await fetch(url, {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    },
});

if (!response.ok) {
    const body = await response.text();
    console.error(
        `Failed to query CI workflow runs: ${response.status} ${response.statusText}`,
    );
    console.error(body);
    process.exit(1);
}

const data = await response.json();
const runs = data.workflow_runs ?? [];

const ciRun = runs.find((run) => run.head_sha === targetSha);

if (!ciRun) {
    console.error(
        `No completed CI workflow run with matching head_sha found for commit ${targetSha}.`,
    );
    process.exit(1);
}

if (ciRun.conclusion !== "success") {
    console.error(
        `CI workflow for commit ${targetSha} is not successful (status=${ciRun.status}, conclusion=${ciRun.conclusion}). See ${ciRun.html_url}`,
    );
    process.exit(1);
}

console.log(`Verified successful CI run for ${targetSha}: ${ciRun.html_url}`);
