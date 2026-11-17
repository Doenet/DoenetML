/**
 * The versions of the docs site that are deployed side by side, and which one
 * this build is.
 *
 * docs.doenet.org serves more than one build of these docs: the current
 * release line at the root and `main` (the next, unreleased line) under a
 * path such as `/dev`. The deploy workflow (`.github/workflows/gh-pages-docs.yml`
 * on `main`) builds each one and is the single place that says which branch
 * goes where. It passes the same list to every build, so each site's version
 * switcher lists the same versions:
 *
 *   DOCS_VERSIONS='[
 *     {"label": "0.7", "path": ""},
 *     {"label": "0.8 (in development)", "path": "/dev", "prerelease": true}
 *   ]'
 *   DOCS_BASE_PATH=/dev     # which of those this build is
 *
 * Both are unset for local development and for the CI build, which then build
 * an unversioned site at the root with no switcher and no banner.
 *
 * This file is plain `.mjs` because `next.config.mjs` reads it before any
 * TypeScript is compiled. The app reads it too.
 */

/**
 * @typedef {object} DocsVersion
 * @property {string} label What the switcher shows, e.g. `0.7`.
 * @property {string} path The site's base path: `""` for the root, or
 *   `/dev`, `/0.7`, …, with a leading slash and no trailing slash.
 * @property {boolean} [prerelease] An unreleased line. Its pages carry a
 *   banner pointing to the current release, and are kept out of search
 *   engines.
 */

/**
 * Normalize a base path to `""` or `/a/b`: a leading slash, no trailing one.
 *
 * @param {string | undefined} path
 * @returns {string}
 */
export function normalizeBasePath(path) {
    const trimmed = (path ?? "").trim().replace(/^\/+|\/+$/g, "");
    return trimmed === "" ? "" : `/${trimmed}`;
}

/** This build's base path, from `DOCS_BASE_PATH`. */
export const basePath = normalizeBasePath(process.env.DOCS_BASE_PATH);

/**
 * Every deployed version, from `DOCS_VERSIONS`, or an empty list when it is
 * unset. A malformed value fails the build rather than deploying a site with
 * a broken switcher.
 *
 * @type {DocsVersion[]}
 */
export const docsVersions = parseVersions(process.env.DOCS_VERSIONS);

/**
 * The entry for this build, if `DOCS_VERSIONS` lists one at `basePath`.
 *
 * @type {DocsVersion | undefined}
 */
export const currentVersion = docsVersions.find((v) => v.path === basePath);

if (docsVersions.length > 0 && currentVersion === undefined) {
    throw new Error(
        `DOCS_BASE_PATH (${JSON.stringify(basePath)}) is not the path of any ` +
            `entry in DOCS_VERSIONS (${docsVersions
                .map((v) => JSON.stringify(v.path))
                .join(", ")}).`,
    );
}

/**
 * @param {string | undefined} raw
 * @returns {DocsVersion[]}
 */
function parseVersions(raw) {
    if (raw === undefined || raw.trim() === "") {
        return [];
    }
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        throw new Error(`DOCS_VERSIONS is not valid JSON: ${e}`);
    }
    if (!Array.isArray(parsed)) {
        throw new Error("DOCS_VERSIONS must be a JSON array.");
    }
    return parsed.map((entry, i) => {
        if (
            typeof entry !== "object" ||
            entry === null ||
            typeof entry.label !== "string" ||
            typeof entry.path !== "string"
        ) {
            throw new Error(
                `DOCS_VERSIONS[${i}] must be an object with string "label" and "path".`,
            );
        }
        return {
            label: entry.label,
            path: normalizeBasePath(entry.path),
            prerelease: entry.prerelease === true,
        };
    });
}
